import { SlideContent, SlideOutline, DocumentChunk } from '../types'
import { callLLM } from './llm'
import { buildScriptPrompt } from './prompts/script'

/**
 * Generate a presentation narration script for all slides.
 *
 * Strategy: process slides sequentially so each page's script can reference
 * the previous page for natural transitions. Uses batch parallelism for
 * slides that don't need transition context (cover has no predecessor).
 *
 * Target: ~8 minutes total presentation time.
 */
export async function generateScript(
  slides: SlideContent[],
  outlines: SlideOutline[],
  chunks: DocumentChunk[],
  title: string,
  options?: {
    language?: string
    debugLog?: (stage: string, payload: unknown) => void
  }
): Promise<string> {
  const language = options?.language || 'zh-CN'
  const isChinese = language.startsWith('zh')
  const totalSlides = slides.length
  const scripts: string[] = []

  options?.debugLog?.('script.start', { totalSlides, language, title })

  // Process sequentially for transition coherence
  for (let i = 0; i < totalSlides; i++) {
    const slide = slides[i]
    const outline = outlines[i]
    if (!slide || !outline) continue

    const previousScript = i > 0 ? scripts[i - 1] : undefined

    const { system, user } = buildScriptPrompt(slide, outline, chunks, {
      slideIndex: i + 1,
      totalSlides,
      presentationTitle: title,
      previousScript,
      language,
    })

    try {
      const raw = await callLLM(system, user, {
        enableThinking: false,
        debugLog: options?.debugLog,
        label: `script.slide.${i + 1}`,
      })

      // Clean up: remove any markdown formatting the LLM might add
      const cleaned = raw
        .replace(/^```[\s\S]*?```$/gm, '')
        .replace(/^#+\s+.+$/gm, '')
        .replace(/^\*\*.*?\*\*/gm, '')
        .replace(/^---+$/gm, '')
        .trim()

      scripts.push(cleaned)
      options?.debugLog?.(`script.slide.${i + 1}.done`, {
        charCount: cleaned.length,
        preview: cleaned.slice(0, 80),
      })
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      options?.debugLog?.(`script.slide.${i + 1}.error`, { error: msg })
      // Fallback: use slide title + content hint
      scripts.push(
        isChinese
          ? `（本页：${slide.title}）${outline.contentHint || ''}`
          : `(This slide: ${slide.title}) ${outline.contentHint || ''}`
      )
    }
  }

  // Assemble final document
  const separator = '─'.repeat(40)
  const header = isChinese
    ? `${'═'.repeat(40)}\n讲解文稿 - 《${title}》\n${'═'.repeat(40)}\n`
    : `${'═'.repeat(40)}\nPresentation Script - "${title}"\n${'═'.repeat(40)}\n`

  const body = scripts
    .map((script, i) => {
      const slideTitle = slides[i]?.title || `Slide ${i + 1}`
      const pageLabel = isChinese
        ? `第 ${i + 1} 页 | ${slideTitle}`
        : `Slide ${i + 1} | ${slideTitle}`
      return `\n${separator}\n${pageLabel}\n${separator}\n\n${script}\n`
    })
    .join('')

  const footer = isChinese
    ? `\n${'═'.repeat(40)}\n（全文完，预计讲解时间：约8分钟）\n`
    : `\n${'═'.repeat(40)}\n(End of script, estimated duration: ~8 minutes)\n`

  const fullScript = header + body + footer

  options?.debugLog?.('script.done', {
    totalChars: fullScript.length,
    slideCount: scripts.length,
    avgPerSlide: Math.round(fullScript.length / scripts.length),
  })

  return fullScript
}
