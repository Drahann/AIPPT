import { SlideContent, SlideOutline, DocumentChunk } from '../../types'

/**
 * Build prompt for generating a presentation narration script for one slide.
 *
 * The script is for an 8-minute academic defense / roadshow presentation.
 * For ~15 slides, that's ~30 seconds per slide → ~120–180 words (Chinese)
 * or ~80–120 words (English) per slide.
 */
export function buildScriptPrompt(
  slide: SlideContent,
  outline: SlideOutline,
  chunks: DocumentChunk[],
  context: {
    slideIndex: number
    totalSlides: number
    presentationTitle: string
    previousScript?: string
    language: string
  }
) {
  const refContent = outline.refChunks
    .map((idx) => chunks.find((c) => c.order === idx))
    .filter(Boolean)
    .map((c) => c!.content)
    .join('\n\n')

  const slideJson = JSON.stringify(
    { title: slide.title, subtitle: slide.subtitle, body: slide.body, cards: slide.cards, metrics: slide.metrics, events: slide.events, chart: slide.chart },
    null,
    2
  )

  const isFirst = context.slideIndex === 1
  const isLast = context.slideIndex === context.totalSlides
  const isChinese = context.language.startsWith('zh')

  const targetWordsPerSlide = isChinese ? '120-180字' : '80-120 words'
  const totalMinutes = 8

  const positionHint = isFirst
    ? (isChinese
        ? '这是第一页（封面），请用开场白引入项目。例如："各位评委/老师好，我是XXX，今天我汇报的项目是《XXX》。"'
        : 'This is the cover slide. Start with a greeting and project introduction.')
    : isLast
      ? (isChinese
          ? '这是最后一页（结尾），请做总结致谢。例如："以上就是本项目的完整介绍，感谢各位的聆听。"'
          : 'This is the ending slide. Summarize key points and thank the audience.')
      : (isChinese
          ? `这是第 ${context.slideIndex} 页（共 ${context.totalSlides} 页），请自然过渡并展开本页核心内容。`
          : `This is slide ${context.slideIndex} of ${context.totalSlides}. Transition naturally and elaborate on the core content.`)

  const languageRule = isChinese
    ? '讲稿必须使用简体中文，口语化但专业。'
    : 'The script must be in English, conversational but professional.'

  return {
    system: `你是一位专业的演讲教练，正在为学生准备一场 ${totalMinutes} 分钟的${isChinese ? '答辩/路演' : 'academic defense / roadshow'}讲稿。

[核心规则]
1. ${languageRule}
2. 每页讲稿控制在 ${targetWordsPerSlide}，整体 ${totalMinutes} 分钟。
3. 只输出讲稿正文，不要输出页码、标题标记、markdown 格式或任何元信息。
4. 讲稿是口语化的演讲稿，不是 PPT 文案的复读。要展开、解释、举例，让听众理解。
5. 引用原文中的具体数据（百分比、金额、专业术语）时必须精确。
6. 不要使用"本页将介绍..."等 PPT 术语，假装你正在面对观众讲话。
7. 自然过渡：如果提供了上一页讲稿，请承上启下。`,

    user: `${positionHint}

演示文稿标题：${context.presentationTitle}

当前页面内容（PPT 文案）：
${slideJson}

原文参考：
${refContent || '（无原文参考）'}

${context.previousScript ? `上一页讲稿（用于过渡）：\n${context.previousScript.slice(-200)}` : ''}

请直接输出本页讲稿正文：`,
  }
}
