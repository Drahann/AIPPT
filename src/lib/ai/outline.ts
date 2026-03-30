import { DocumentChunk, OutlineResult, SlideOutline } from '../types'
import { callLLM, cleanJsonResponse, repairJsonWithLLM, tryParseJson } from './llm'
import { enforceSlideLayoutByCandidates, getSlideLayoutCandidates } from './layout-router'
import { buildOutlinePrompt } from './prompts/outline'
import { normalizeMojibake } from './text-normalizer'

const SPECIAL_SECTION_ITEM_PREFIXES = [
  '核心技术 - ',
  '应用企业 - ',
  '应用公司 - ',
  '应用部门 - ',
  '应用案例 - ',
  '应用场景 - ',
  '核心优势 - ',
  '主要产品 - ',
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
    return enforceSlideLayoutByCandidates(normalized, chunks)
  })

  return {
    ...result,
    title: normalizeMojibake(result.title || ''),
    slideCount: slides.length,
    slides,
  }
}
