import { SlideOutline, SlideContent, DocumentChunk } from '../types'
import { callLLM, cleanJsonResponse, repairJsonWithLLM, tryParseJson, getFastModel } from './llm'
import { buildSlideContentPrompt } from './prompts/slide-content'
import { getSplitLimitForLayout } from '../layout-rules'
import { normalizeSlideContentText } from './text-normalizer'
import { chooseLayoutForNormalizedContent, validateAndNormalizeSlideShape } from './layout-contracts'
import { calculateOptimalTypo, TYPO_SCALE } from '../utils/pretext-engine'
import { templateBounds } from '../layout-specs'

export async function generateSlideContent(
  outline: SlideOutline,
  chunks: DocumentChunk[],
  imagePool?: { url: string; description: string; source: 'user' | 'docx' }[],
  options?: { language?: string; debugLog?: (stage: string, payload: unknown) => void }
): Promise<SlideContent> {
  const maxAttempts = 3
  const language = options?.language || 'zh-CN'
  let lastFailure: unknown = null

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const { system, user } = buildSlideContentPrompt(outline, chunks, { language })
    let raw = ''
    let cleaned = ''

    try {
      raw = await callLLM(system, user, {
        model: getFastModel(),
        debugLog: options?.debugLog,
        label: `slide.${outline.index}.llm`,
      })
      options?.debugLog?.(`slide.${outline.index}.raw`, { attempt, raw })
      cleaned = cleanJsonResponse(raw)
      options?.debugLog?.(`slide.${outline.index}.cleaned`, { attempt, cleaned })
    } catch (requestError) {
      lastFailure = requestError
      options?.debugLog?.(`slide.${outline.index}.request.error`, {
        attempt,
        error: String(requestError),
      })
      if (attempt < maxAttempts) {
        options?.debugLog?.(`slide.${outline.index}.regenerated`, {
          attempt,
          nextAttempt: attempt + 1,
          reason: String(lastFailure),
        })
        continue
      }
      break
    }

    try {
      const content = tryParseJson<SlideContent>(cleaned)
      const hydrated = hydrateSlideContent(content, outline, imagePool)
      const validated = validateAndNormalizeSlideShape(hydrated, outline)
      options?.debugLog?.(`slide.${outline.index}.shape.beforeValidation`, {
        attempt,
        layout: hydrated.layout,
        title: hydrated.title,
        keys: Object.keys(hydrated),
      })

      if (validated.remapped) {
        options?.debugLog?.(`slide.${outline.index}.shape.remapped`, {
          attempt,
          errors: validated.errors,
          layout: validated.slide.layout,
          keys: Object.keys(validated.slide),
        })
      }

      if (!validated.valid) {
        options?.debugLog?.(`slide.${outline.index}.contract.error`, {
          attempt,
          errors: validated.errors,
          stage: 'initial-parse',
        })
        if (!validated.contentMissing) {
          const normalizedSlide = chooseLayoutForNormalizedContent(validated.slide, outline)
          const typoSlide = await applyTypographyFitting(normalizedSlide, options?.debugLog)
          options?.debugLog?.(`slide.${outline.index}.shape.normalized`, {
            attempt,
            fromLayout: validated.slide.layout,
            toLayout: typoSlide.layout,
            errors: validated.errors,
            keys: Object.keys(typoSlide),
          })
          return normalizeSlideContentText(typoSlide, language)
        }
        lastFailure = new Error(validated.errors.join(', '))
      } else {
        const typoSlide = await applyTypographyFitting(validated.slide, options?.debugLog)
        options?.debugLog?.(`slide.${outline.index}.finalShape`, {
          attempt,
          layout: typoSlide.layout,
          keys: Object.keys(typoSlide),
        })
        return normalizeSlideContentText(typoSlide, language)
      }
    } catch (e) {
      lastFailure = e
      options?.debugLog?.(`slide.${outline.index}.parse.error`, {
        attempt,
        error: String(e),
        cleaned,
      })
      try {
        const repaired = await repairJsonWithLLM(
          cleaned,
          `{"layout":"${outline.layout}","title":"${outline.title}","subtitle":"${outline.subtitle || ''}"}`,
          {
            debugLog: options?.debugLog,
            label: `slide.${outline.index}.repair`,
          }
        )
        options?.debugLog?.(`slide.${outline.index}.repaired`, { attempt, repaired })
        const repairedContent = tryParseJson<SlideContent>(repaired)
        const hydrated = hydrateSlideContent(repairedContent, outline, imagePool)
        const validated = validateAndNormalizeSlideShape(hydrated, outline)

        if (validated.remapped) {
          options?.debugLog?.(`slide.${outline.index}.shape.remapped`, {
            attempt,
            errors: validated.errors,
            layout: validated.slide.layout,
            keys: Object.keys(validated.slide),
          })
        }

        if (!validated.valid) {
          options?.debugLog?.(`slide.${outline.index}.contract.error`, {
            attempt,
            errors: validated.errors,
            stage: 'repair-parse',
          })
          if (!validated.contentMissing) {
            const normalizedSlide = chooseLayoutForNormalizedContent(validated.slide, outline)
            const typoSlide = await applyTypographyFitting(normalizedSlide, options?.debugLog)
            options?.debugLog?.(`slide.${outline.index}.shape.normalized`, {
              attempt,
              fromLayout: validated.slide.layout,
              toLayout: normalizedSlide.layout,
              errors: validated.errors,
              keys: Object.keys(normalizedSlide),
            })
            return normalizeSlideContentText(typoSlide, language)
          }
          lastFailure = new Error(validated.errors.join(', '))
        } else {
          const typoSlide = await applyTypographyFitting(validated.slide, options?.debugLog)
          options?.debugLog?.(`slide.${outline.index}.finalShape`, {
            attempt,
            layout: typoSlide.layout,
            keys: Object.keys(typoSlide),
          })
          return normalizeSlideContentText(typoSlide, language)
        }
      } catch (repairError) {
        lastFailure = repairError
        options?.debugLog?.(`slide.${outline.index}.repair.error`, {
          attempt,
          error: String(repairError),
        })
      }
    }

    if (attempt < maxAttempts) {
      options?.debugLog?.(`slide.${outline.index}.regenerated`, {
        attempt,
        nextAttempt: attempt + 1,
        reason: String(lastFailure),
      })
    }
  }

  console.error(`Failed to parse slide ${outline.index}:`, String(lastFailure))
  return normalizeSlideContentText({
    layout: outline.layout,
    title: outline.title,
    subtitle: outline.subtitle,
    body: [{ type: 'paragraph', text: outline.contentHint }],
    speakerNotes: outline.speakerNotes,
  }, language)
}

function hydrateSlideContent(
  content: SlideContent,
  outline: SlideOutline,
  imagePool?: { url: string; description: string; source: 'user' | 'docx' }[]
): SlideContent {
  const next: SlideContent = {
    ...content,
    layout: outline.layout,
    title: content.title?.trim() || outline.title,
    subtitle: content.subtitle?.trim() || outline.subtitle,
    speakerNotes: outline.speakerNotes,
  }

  if (outline.imageIndex !== undefined && outline.imageIndex !== null && imagePool) {
    const matchedImg = imagePool[outline.imageIndex]
    if (matchedImg) {
      // Top-level image
      next.image = {
        url: matchedImg.url,
        prompt: outline.imageHint || next.image?.prompt || '',
        alt: matchedImg.description || next.image?.alt || '',
      }

      // Card-level image (for layouts like features-list-image, cards-split)
      if (next.cards && next.cards.length > 0) {
        // Find the first card that was supposed to have an image, or just the first card
        const targetCard = next.cards.find(c => c.image) || next.cards[0]
        if (targetCard) {
          targetCard.image = {
            ...targetCard.image,
            url: matchedImg.url,
            prompt: targetCard.image?.prompt || matchedImg.description || '',
          }
        }
      }
    }
  }

  return next
}

export async function generateAllSlides(
  outlines: SlideOutline[],
  chunks: DocumentChunk[],
  imagePool?: { url: string; description: string; source: 'user' | 'docx' }[],
  onProgress?: (completed: number, total: number) => void,
  options?: { language?: string; debugLog?: (stage: string, payload: unknown) => void }
): Promise<SlideContent[]> {
  const total = outlines.length
  const finalSlides: SlideContent[] = []

  const BATCH_SIZE = 8
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = outlines.slice(i, i + BATCH_SIZE)
    const batchStart = Date.now()
    options?.debugLog?.('slide.batch.start', {
      batchStartIndex: i + 1,
      batchEndIndex: Math.min(i + BATCH_SIZE, total),
      total,
      slideIndexes: batch.map((outline) => outline.index),
    })
    let batchResults: SlideContent[]
    try {
      batchResults = await Promise.all(
        batch.map((outline) => generateSlideContent(outline, chunks, imagePool, options))
      )
    } catch (error) {
      options?.debugLog?.('slide.batch.error', {
        batchStartIndex: i + 1,
        batchEndIndex: Math.min(i + BATCH_SIZE, total),
        total,
        durationMs: Date.now() - batchStart,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }

    batchResults.forEach((result) => {
      const splits = splitOverflowingSlide(result)
      finalSlides.push(...splits)
    })

    onProgress?.(Math.min(i + BATCH_SIZE, total), total)
    options?.debugLog?.('slide.batch.success', {
      batchStartIndex: i + 1,
      batchEndIndex: Math.min(i + BATCH_SIZE, total),
      total,
      durationMs: Date.now() - batchStart,
    })
  }

  return finalSlides
}

function splitOverflowingSlide(slide: SlideContent): SlideContent[] {
  // 0. Handle text-bullets specifically (6-8 target, split when >8)
  if (slide.layout === 'text-bullets' && slide.body && slide.body.length > 0) {
    const bullets = slide.body.flatMap((block) => {
      if (block.type === 'bullet' && block.items) return block.items
      if (block.type === 'paragraph' && block.text) return [block.text]
      return []
    })

    const maxItems = getSplitLimitForLayout('text-bullets') || 8
    if (bullets.length > maxItems) {
      const chunks = []
      for (let i = 0; i < bullets.length; i += maxItems) {
        chunks.push(bullets.slice(i, i + maxItems))
      }
      return chunks.map((items) => ({
        ...slide,
        body: [{ type: 'bullet', items }],
      }))
    }
  }

  // 1. Handle body text (paragraphs/bullets)
  if (
    ['text-center', 'image-text', 'text-image', 'image-center'].includes(slide.layout) &&
    slide.body && slide.body.length > 0
  ) {
    let totalItems = 0;
    slide.body.forEach(b => {
      if (b.type === 'paragraph') totalItems += 1;
      if (b.type === 'bullet' && b.items) totalItems += b.items.length;
    });

    const MAX_ITEMS = 8;
    if (totalItems > MAX_ITEMS) {
      const chunks: Array<NonNullable<SlideContent['body']>> = [];
      let currentChunk: NonNullable<SlideContent['body']> = [];
      let currentCount = 0;

      for (const block of slide.body) {
        if (block.type === 'paragraph') {
          if (currentCount > 0 && currentCount >= MAX_ITEMS) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentCount = 0;
          }
          currentChunk.push(block);
          currentCount += 1;
        } else if (block.type === 'bullet' && block.items) {
           for (const item of block.items) {
             if (currentCount > 0 && currentCount >= MAX_ITEMS) {
               chunks.push(currentChunk);
               currentChunk = [];
               currentCount = 0;
             }
             let lastBlock = currentChunk[currentChunk.length - 1];
             if (!lastBlock || lastBlock.type !== 'bullet') {
                lastBlock = { type: 'bullet', items: [] };
                currentChunk.push(lastBlock);
             }
             lastBlock.items!.push(item);
             currentCount += 1;
           }
        }
      }
      if (currentChunk.length > 0) chunks.push(currentChunk);

      return chunks.map((bodyChunk) => ({
        ...slide,
        title: slide.title,
        body: bodyChunk,
      }));
    }
  }

  // 2. Handle cards (Support cards-2, cards-3, cards-4, and advanced card layouts)
  if (slide.cards && slide.cards.length > 0) {
    const maxCards = getSplitLimitForLayout(slide.layout) ?? 3

    if (slide.cards.length > maxCards) {
      const chunks = [];
      for (let i = 0; i < slide.cards.length; i += maxCards) {
        chunks.push(slide.cards.slice(i, i + maxCards));
      }
      return chunks.map((cardChunk) => ({
        ...slide,
        title: slide.title,
        cards: cardChunk,
      }));
    }
  }

  // 3. Handle timeline
  if (
    slide.layout === 'timeline' &&
    slide.events &&
    slide.events.length > (getSplitLimitForLayout('timeline') || 5)
  ) {
     const maxEvents = getSplitLimitForLayout('timeline') || 5;
     const chunks = [];
     for (let i = 0; i < slide.events.length; i += maxEvents) {
        chunks.push(slide.events.slice(i, i + maxEvents));
     }
     return chunks.map((eventChunk) => ({
        ...slide,
        title: slide.title,
        events: eventChunk,
     }));
  }

  // 3.1 Handle milestone list
  if (
    slide.layout === 'milestone-list' &&
    slide.events &&
    slide.events.length > (getSplitLimitForLayout('milestone-list') || 6)
  ) {
     const maxEvents = getSplitLimitForLayout('milestone-list') || 6;
     const chunks = [];
     for (let i = 0; i < slide.events.length; i += maxEvents) {
        chunks.push(slide.events.slice(i, i + maxEvents));
     }
     return chunks.map((eventChunk) => ({
        ...slide,
        title: slide.title,
        events: eventChunk,
     }));
  }

  // 4. Handle metrics
  if (
    slide.layout === 'metrics' &&
    slide.metrics &&
    slide.metrics.length > (getSplitLimitForLayout('metrics') || 6)
  ) {
     const maxMetrics = getSplitLimitForLayout('metrics') || 6;
     const chunks = [];
     for (let i = 0; i < slide.metrics.length; i += maxMetrics) {
        chunks.push(slide.metrics.slice(i, i + maxMetrics));
     }
     return chunks.map((metricChunk) => ({
        ...slide,
        title: slide.title,
        metrics: metricChunk,
     }));
  }

  // 4.1 Handle metrics-rings
  if (
    (slide.layout === 'metrics-rings') &&
    slide.metrics &&
    slide.metrics.length > (getSplitLimitForLayout('metrics-rings') || 3)
  ) {
    const maxMetrics = getSplitLimitForLayout('metrics-rings') || 3
    const chunks = []
    for (let i = 0; i < slide.metrics.length; i += maxMetrics) {
      chunks.push(slide.metrics.slice(i, i + maxMetrics))
    }
    return chunks.map((metricChunk) => ({
      ...slide,
      title: slide.title,
      metrics: metricChunk,
    }))
  }

  return [slide];
}

// ---------------------------------------------------------------------------
// Typography Fitting — post-LLM validation via Pretext Engine
// ---------------------------------------------------------------------------


/**
 * Run Pretext measurement on a slide's text fields (validation-only mode).
 * 
 * With the new architecture, LLM already receives precise char limits from
 * buildCharConstraintBlock(), so content should fit at the design baseline tier.
 * This function only does a single measurement pass and injects typographyParams.
 * If text slightly overflows, it records the measured tier (which may be ±1 level
 * from baseline) but does NOT trigger LLM compression.
 */
/**
 * Run Pretext measurement on all text fields with a "global minimum" strategy.
 * This ensures that for multi-card layouts (cards-*), all cards use the same
 * (smallest necessary) font size, maintaining visual alignment.
 */
async function applyTypographyFitting(
  slide: SlideContent,
  debugLog?: (stage: string, payload: unknown) => void,
): Promise<SlideContent> {
  const bounds = templateBounds[slide.layout]
  if (!bounds) return slide

  const TIERS: ('B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6')[] = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6']

  // Collect per-field measurement details for debug
  const fieldMeasurements: Array<{
    field: string
    text: string
    bounds: { w: number; h: number }
    result: { level: string; fontSize: number; lineHeight: number; overflow: boolean }
  }> = []

  try {
    // 1. Measure Title (Independent from body sync)
    const titleResult = await calculateOptimalTypo(
      slide.title || '',
      'heading',
      bounds.title.w,
      bounds.title.h,
    )
    fieldMeasurements.push({
      field: 'title',
      text: (slide.title || '').slice(0, 60),
      bounds: { w: bounds.title.w, h: bounds.title.h },
      result: titleResult,
    })

    // 2. Measure all Body-like containers to find the "Smallest Common Fit"
    let maxBodyTierIdx = 0 // Index in TIERS (0='B1', higher = smaller font)

    const updateMaxTier = (level: string) => {
      const idx = TIERS.indexOf(level as any)
      if (idx > maxBodyTierIdx) maxBodyTierIdx = idx
    }

    // A. Global Body (Lead/Description)
    if (bounds.body) {
      const bodyText = (slide.body || []).map(b => (b as any).text || (b as any).items?.join('\n') || '').filter(Boolean).join('\n')
      const res = await calculateOptimalTypo(bodyText, 'body', bounds.body.w, bounds.body.h)
      updateMaxTier(res.level)
      fieldMeasurements.push({
        field: 'body',
        text: bodyText.slice(0, 80),
        bounds: { w: bounds.body.w, h: bounds.body.h },
        result: res,
      })
    }

    // B. Cards Body (body+secondary only — heading is measured separately in section E)
    if (bounds.cardBody && slide.cards) {
      for (let ci = 0; ci < slide.cards.length; ci++) {
        const card = slide.cards[ci]
        const cardText = [card.body, (card as any).secondary].filter(Boolean).join('\n')
        const res = await calculateOptimalTypo(cardText, 'body', bounds.cardBody.w, bounds.cardBody.h)
        updateMaxTier(res.level)
        fieldMeasurements.push({
          field: `card[${ci}]`,
          text: cardText.slice(0, 120),
          bounds: { w: bounds.cardBody.w, h: bounds.cardBody.h },
          result: res,
        })
      }
    }

    // C. Events (Timeline/Milestone)
    if (bounds.eventDesc && slide.events) {
      for (let ei = 0; ei < slide.events.length; ei++) {
        const ev = slide.events[ei]
        const evText = [ev.title, ev.description].filter(Boolean).join('\n')
        const res = await calculateOptimalTypo(evText, 'body', bounds.eventDesc.w, bounds.eventDesc.h)
        updateMaxTier(res.level)
        fieldMeasurements.push({
          field: `event[${ei}]`,
          text: evText.slice(0, 60),
          bounds: { w: bounds.eventDesc.w, h: bounds.eventDesc.h },
          result: res,
        })
      }
    }

    // D. Metrics
    if (bounds.metricValue && slide.metrics) {
       for (let mi = 0; mi < slide.metrics.length; mi++) {
         const m = slide.metrics[mi]
         const mText = [m.value, m.label].filter(Boolean).join('\n')
         const mH = (bounds.metricValue.h || 100) + (bounds.metricLabel?.h || 0)
         const res = await calculateOptimalTypo(mText, 'body', bounds.metricValue.w, mH)
         updateMaxTier(res.level)
         fieldMeasurements.push({
           field: `metric[${mi}]`,
           text: mText.slice(0, 40),
           bounds: { w: bounds.metricValue.w, h: mH },
           result: res,
         })
       }
    }

    // E. Card Headings (independent subheading tier)
    let maxSubheadingTierIdx = 0
    const SUBHEADING_TIERS: ('S1' | 'S2')[] = ['S1', 'S2']
    if (bounds.cardHeading && slide.cards) {
      for (let ci = 0; ci < slide.cards.length; ci++) {
        const card = slide.cards[ci]
        const headingText = card.heading || ''
        const res = await calculateOptimalTypo(headingText, 'heading', bounds.cardHeading.w, bounds.cardHeading.h)
        const sIdx = SUBHEADING_TIERS.indexOf(res.level as any)
        if (sIdx > maxSubheadingTierIdx) maxSubheadingTierIdx = sIdx
        fieldMeasurements.push({
          field: `cardHeading[${ci}]`,
          text: headingText.slice(0, 40),
          bounds: { w: bounds.cardHeading.w, h: bounds.cardHeading.h },
          result: res,
        })
      }
    }

    const finalBodyLevel = TIERS[maxBodyTierIdx]

    // Enhanced debug output with full pretext details
    debugLog?.('typography.fitting', {
      layout: slide.layout,
      title: (slide.title || '').slice(0, 50),
      result: {
        headingLevel: titleResult.level,
        headingFontSize: titleResult.fontSize,
        headingLineHeight: titleResult.lineHeight,
        headingOverflow: titleResult.overflow,
        bodyLevel: finalBodyLevel,
        bodyFontSize: TYPO_SCALE.body[finalBodyLevel]?.fontSize,
        bodyLineHeight: TYPO_SCALE.body[finalBodyLevel]?.lineHeight,
        bodyFontWeight: TYPO_SCALE.body[finalBodyLevel]?.fontWeight,
      },
      bounds: {
        title: { w: bounds.title.w, h: bounds.title.h, defaultTier: bounds.title.defaultTier },
        body: bounds.body ? { w: bounds.body.w, h: bounds.body.h, defaultTier: bounds.body.defaultTier } : null,
        cardBody: bounds.cardBody ? { w: bounds.cardBody.w, h: bounds.cardBody.h, defaultTier: bounds.cardBody.defaultTier } : null,
        eventDesc: bounds.eventDesc ? { w: bounds.eventDesc.w, h: bounds.eventDesc.h, defaultTier: bounds.eventDesc.defaultTier } : null,
        metricValue: bounds.metricValue ? { w: bounds.metricValue.w, h: bounds.metricValue.h } : null,
      },
      fieldMeasurements,
      overflowFields: fieldMeasurements.filter(fm => fm.result.overflow).map(fm => fm.field),
    })

    // 3. Inject typography params
    const result = { ...slide }
    result.typographyParams = {
      headingLevel: titleResult.level as 'H1' | 'H2' | 'H3',
      subheadingLevel: SUBHEADING_TIERS[maxSubheadingTierIdx],
      bodyLevel: finalBodyLevel,
    }

    return result
  } catch (err) {
    debugLog?.('typography.error', { layout: slide.layout, error: String(err) })
    return slide
  }
}

