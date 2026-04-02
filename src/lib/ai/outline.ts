import { DocumentChunk, LayoutType, OutlineResult, SlideOutline } from '../types'
import { callLLM, cleanJsonResponse, repairJsonWithLLM, tryParseJson } from './llm'
import { enforceSlideLayoutByCandidates, getSlideLayoutCandidates } from './layout-router'
import { buildOutlinePrompt } from './prompts/outline'
import { normalizeMojibake } from './text-normalizer'

const SPECIAL_SECTION_ITEM_PREFIXES = [
  '核心技术 - ',
  '创新技术 - ',
  '应用企业 - ',
  '产业验证 - ',
  '核心优势 - ',
  '主要产品 - ',
  '应用案例 - ',
  '应用展示 - ',
  '应用场景 - ',
  '与应用企业 - ',
  '与产业验证 - ',
  '应用公司 - ',
  '应用部门 - ',
  'Core Technology - ',
  'Key Technology - ',
  'Application Enterprise - ',
  'Application Company - ',
  'Application Case - ',
]

export async function generateOutline(
  chunks: DocumentChunk[],
  preferences?: {
    slideCount?: number
    language?: string
    imagePool?: { url: string; description: string; source: 'user' | 'docx' }[]
  },
  debugLog?: (stage: string, payload: unknown) => void
): Promise<OutlineResult> {
  const language = preferences?.language || 'zh-CN'
  const { system, user } = buildOutlinePrompt(chunks, { ...preferences, language })
  debugLog?.('outline.start', {
    chunkCount: chunks.length,
    language,
    targetSlides: preferences?.slideCount || null,
    imagePoolCount: preferences?.imagePool?.length || 0,
  })
  const raw = await callLLM(system, user, {
    debugLog,
    label: 'outline.llm',
  })
  debugLog?.('outline.raw', raw)
  const cleaned = cleanJsonResponse(raw)
  debugLog?.('outline.cleaned', cleaned)

  try {
    const result = tryParseJson<OutlineResult>(cleaned)
    if (!result.slides || !Array.isArray(result.slides)) {
      throw new Error('Invalid outline: missing slides array')
    }
    return normalizeOutline(
      enforceSpecialItemSlides(
        {
          ...result,
          title: normalizeMojibake(result.title || '演示文稿'),
        },
        chunks
      ),
      chunks,
      debugLog
    )
  } catch (error) {
    debugLog?.('outline.parse.error', String(error))
    try {
      const repaired = await repairJsonWithLLM(cleaned, '{"title":"演示标题","slideCount":12,"slides":[...]}', {
        debugLog,
        label: 'outline.repair',
      })
      debugLog?.('outline.repaired', repaired)
      const result = tryParseJson<OutlineResult>(repaired)
      if (!result.slides || !Array.isArray(result.slides)) {
        throw new Error('Invalid outline: missing slides array after repair')
      }
      return normalizeOutline(
        enforceSpecialItemSlides(
          {
            ...result,
            title: normalizeMojibake(result.title || '演示文稿'),
          },
          chunks
        ),
        chunks,
        debugLog
      )
    } catch (repairError) {
      debugLog?.('outline.repair.error', String(repairError))
      console.error('Failed to parse outline:', cleaned)
      throw new Error(`Outline generation failed: ${repairError || error}`)
    }
  }
}

function isSpecialItemChunk(chunk: DocumentChunk): boolean {
  return SPECIAL_SECTION_ITEM_PREFIXES.some((prefix) => chunk.heading.startsWith(prefix))
}

function normalizeRefChunks(refChunks: number[] | undefined): number[] {
  if (!Array.isArray(refChunks)) return []
  const set = new Set<number>()
  for (const value of refChunks) {
    if (Number.isFinite(value)) set.add(value)
  }
  return Array.from(set).sort((a, b) => a - b)
}

function extractItemTitle(heading: string): { section: string; item: string } {
  const splitIndex = heading.indexOf(' - ')
  if (splitIndex < 0) return { section: heading, item: heading }
  return {
    section: heading.slice(0, splitIndex).trim(),
    item: heading.slice(splitIndex + 3).trim(),
  }
}

function enforceSpecialItemSlides(result: OutlineResult, chunks: DocumentChunk[]): OutlineResult {
  const specialChunks = chunks.filter(isSpecialItemChunk)
  if (specialChunks.length === 0) return result

  const specialOrders = new Set(specialChunks.map((chunk) => chunk.order))
  const dedicatedOrders = new Set<number>()
  const filteredSlides: SlideOutline[] = []

  for (const slide of result.slides) {
    const refs = normalizeRefChunks(slide.refChunks)
    // Preserve slides with no refChunks (cover, ending, section-header, etc.)
    if (refs.length === 0) {
      filteredSlides.push(slide)
      continue
    }
    const isDedicatedSpecial = refs.length === 1 && specialOrders.has(refs[0])
    if (isDedicatedSpecial) {
      dedicatedOrders.add(refs[0])
      filteredSlides.push({ ...slide, refChunks: refs })
      continue
    }
    const remaining = refs.filter((ref) => !specialOrders.has(ref))
    if (remaining.length === 0) continue
    filteredSlides.push({ ...slide, refChunks: remaining })
  }

  const additionalSlides: SlideOutline[] = specialChunks
    .filter((chunk) => !dedicatedOrders.has(chunk.order))
    .map((chunk) => {
      return {
        index: 0,
        title: chunk.heading,
        subtitle: '',
        layout: 'text-center',
        contentHint: chunk.content.slice(0, 240) || chunk.heading,
        refChunks: [chunk.order],
      }
    })

  const mergedSlides = [...filteredSlides, ...additionalSlides].sort((a, b) => {
    const aOrder = normalizeRefChunks(a.refChunks)[0] ?? Number.MAX_SAFE_INTEGER
    const bOrder = normalizeRefChunks(b.refChunks)[0] ?? Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.index - b.index
  })

  const slides = mergedSlides.map((slide, idx) => ({
    ...slide,
    index: idx + 1,
    refChunks: normalizeRefChunks(slide.refChunks),
  }))

  return { ...result, slideCount: slides.length, slides }
}

function normalizeOutline(
  result: OutlineResult,
  chunks: DocumentChunk[],
  debugLog?: (stage: string, payload: unknown) => void
): OutlineResult {
  const slides = result.slides.map((slide, index) => {
    const normalized: SlideOutline = {
      ...slide,
      index: index + 1,
      title: normalizeMojibake(slide.title || ''),
      subtitle: slide.subtitle ? normalizeMojibake(slide.subtitle) : undefined,
      contentHint: normalizeMojibake(slide.contentHint || ''),
      imageHint: slide.imageHint ? normalizeMojibake(slide.imageHint) : undefined,
      speakerNotes: slide.speakerNotes ? normalizeMojibake(slide.speakerNotes) : undefined,
      refChunks: normalizeRefChunks(slide.refChunks),
    }

    const candidates = getSlideLayoutCandidates(normalized, chunks)
    debugLog?.('outline.candidates', {
      index: normalized.index,
      title: normalized.title,
      current: normalized.layout,
      candidates,
    })

    if (index === 0) {
      normalized.layout = 'cover'
      return normalized
    }
    if (index === result.slides.length - 1) {
      normalized.layout = 'ending'
      return normalized
    }
    // --- Hard guard: ban quote layouts for case-study / validation content ---
    // LLM frequently misclassifies "产业验证" as quote-worthy, causing fabricated speaker quotes.
    const CASE_STUDY_KEYWORDS = [
      '产业验证', '应用情况', '取得成效', '应用案例', '案例分析',
      '企业简介', '应用展示', '验证总结', '成效分析',
    ]
    const isQuoteLayout = normalized.layout === 'quote' || normalized.layout === 'quote-no-avatar'
    const titleLower = normalized.title
    const isCaseStudy = CASE_STUDY_KEYWORDS.some(kw => titleLower.includes(kw))
    if (isQuoteLayout && isCaseStudy) {
      debugLog?.('outline.quoteGuard.remapped', {
        index: normalized.index,
        title: normalized.title,
        from: normalized.layout,
        to: 'cards-3',
        reason: 'case-study content must not use quote layout',
      })
      normalized.layout = 'cards-3' as LayoutType
    }

    return enforceSlideLayoutByCandidates(normalized, chunks)
  })

  // Build recentLayouts tracker for diversity (same-category only)
  const LAYOUT_CATEGORY: Record<string, string> = {
    'cards-2': 'card', 'cards-3': 'card', 'cards-4': 'card',
    'cards-split': 'card', 'staggered-cards': 'card',
    'cards-3-featured': 'card', 'cards-3-stack': 'card',
    'cards-4-featured': 'card', 'grid-2x2-featured': 'card',
    'list-featured': 'card', 'features-list-image': 'card',
    'text-center': 'text', 'text-bullets': 'text',
    'image-text': 'image', 'text-image': 'image',
    'image-center': 'image', 'image-full': 'image',
    'chart-bar': 'chart', 'chart-line': 'chart',
    'chart-pie': 'chart', 'chart-bar-compare': 'chart',
    'timeline': 'timeline', 'milestone-list': 'timeline',
    'quote': 'quote', 'quote-no-avatar': 'quote',
    'metrics': 'metric', 'metrics-rings': 'metric',
    'comparison': 'comparison', 'team-members': 'team',
  }
  const getCat = (l: LayoutType) => LAYOUT_CATEGORY[l] || 'other'

  const recentLayouts: LayoutType[] = []
  const diverseSlides = slides.map(s => {
    if (s.layout === 'cover' || s.layout === 'ending' || s.layout === 'section-header') {
      return s
    }
    // If this layout was used in the last 2 slides, try to pick a same-category alternative
    if (recentLayouts.slice(-2).includes(s.layout)) {
      const myCat = getCat(s.layout)
      const candidates = getSlideLayoutCandidates(s, chunks)
      const alt = candidates.find(c =>
        !recentLayouts.slice(-2).includes(c) && getCat(c) === myCat
      )
      if (alt) {
        s = { ...s, layout: alt }
      }
    }
    recentLayouts.push(s.layout)
    return s
  })

  return {
    ...result,
    title: normalizeMojibake(result.title || ''),
    slideCount: diverseSlides.length,
    slides: diverseSlides,
  }
}
