import { SlideOutline, SlideContent, DocumentChunk } from '../types'
import { callLLM, cleanJsonResponse, repairJsonWithLLM, tryParseJson, getFastModel } from './llm'
import { buildSlideContentPrompt } from './prompts/slide-content'
import { getSplitLimitForLayout } from '../layout-rules'
import { normalizeSlideContentText } from './text-normalizer'
import { chooseLayoutForNormalizedContent, validateAndNormalizeSlideShape } from './layout-contracts'

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
          options?.debugLog?.(`slide.${outline.index}.shape.normalized`, {
            attempt,
            fromLayout: validated.slide.layout,
            toLayout: normalizedSlide.layout,
            errors: validated.errors,
            keys: Object.keys(normalizedSlide),
          })
          return normalizeSlideContentText(normalizedSlide, language)
        }
        lastFailure = new Error(validated.errors.join(', '))
      } else {
        options?.debugLog?.(`slide.${outline.index}.finalShape`, {
          attempt,
          layout: validated.slide.layout,
          keys: Object.keys(validated.slide),
        })
        return normalizeSlideContentText(validated.slide, language)
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
            options?.debugLog?.(`slide.${outline.index}.shape.normalized`, {
              attempt,
              fromLayout: validated.slide.layout,
              toLayout: normalizedSlide.layout,
              errors: validated.errors,
              keys: Object.keys(normalizedSlide),
            })
            return normalizeSlideContentText(normalizedSlide, language)
          }
          lastFailure = new Error(validated.errors.join(', '))
        } else {
          options?.debugLog?.(`slide.${outline.index}.finalShape`, {
            attempt,
            layout: validated.slide.layout,
            keys: Object.keys(validated.slide),
          })
          return normalizeSlideContentText(validated.slide, language)
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
    (slide.layout === 'metrics-rings' || slide.layout === 'metrics-split') &&
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
