import { v4 as uuidv4 } from 'uuid'
import { Presentation } from '../types'
import { parseDocx } from '../parser/docx-parser'
import { generateOutline } from './outline'
import { generateAllSlides } from './slide-gen'
import { DebugSession } from './debug-writer'

export interface PipelineEvent {
  type: 'status' | 'progress' | 'outline' | 'slide' | 'done' | 'error'
  status?: string
  progress?: number
  message?: string
  data?: unknown
}

export async function runPipeline(
  docxBuffer: Buffer,
  preferences: {
    slideCount?: number
    themeId?: string
    language?: string
    debugMode?: boolean
    userImages?: { url: string; description: string }[]
  },
  onEvent: (event: PipelineEvent) => void
): Promise<Presentation> {
  const presentationId = uuidv4()
  const language = preferences.language || 'zh-CN'
  const debug = new DebugSession(Boolean(preferences.debugMode))

  try {
    onEvent({ type: 'status', status: 'parsing', progress: 5, message: '正在解析文档...' })
    const parseResult = await parseDocx(docxBuffer)
    const chunks = parseResult.chunks
    const rawDocxImages = parseResult.docxImages

    debug.log('pipeline.parse.result', {
      chunkCount: chunks.length,
      imageCount: rawDocxImages.length,
      headings: chunks.map((chunk) => ({ order: chunk.order, heading: chunk.heading, level: chunk.headingLevel })),
    })

    onEvent({
      type: 'progress',
      progress: 15,
      message:
        `解析完成，共 ${chunks.length} 个内容块` +
        (rawDocxImages.length > 0 ? `，提取到 ${rawDocxImages.length} 张文档图片` : ''),
    })

    const imagePool: { url: string; description: string; source: 'user' | 'docx' }[] = [
      ...(preferences.userImages || []).map((img) => ({ ...img, source: 'user' as const })),
      ...rawDocxImages.map((img) => ({ ...img, source: 'docx' as const })),
    ]
    debug.log('pipeline.imagePool', {
      count: imagePool.length,
      sources: imagePool.map((image, index) => ({ index, source: image.source, description: image.description })),
    })

    onEvent({ type: 'status', status: 'outlining', progress: 20, message: '正在规划 PPT 大纲...' })
    debug.log('pipeline.outline.start', {
      chunkCount: chunks.length,
      imagePoolCount: imagePool.length,
      language,
      requestedSlideCount: preferences.slideCount || null,
    })
    let outline
    try {
      outline = await generateOutline(
        chunks,
        { ...preferences, language, imagePool },
        (stage, payload) => debug.log(stage, payload)
      )
    } catch (error) {
      debug.log('pipeline.outline.error', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
    debug.log('pipeline.outline', outline)
    debug.log('pipeline.outline.success', {
      title: outline.title,
      slideCount: outline.slideCount,
    })
    onEvent({
      type: 'outline',
      progress: 35,
      message: `大纲已生成：${outline.title}，共 ${outline.slideCount} 页`,
      data: outline,
    })

    onEvent({ type: 'status', status: 'generating', progress: 40, message: '正在生成逐页内容...' })
    debug.log('pipeline.slidegen.start', {
      slideCount: outline.slides.length,
      layouts: outline.slides.map((slide) => ({ index: slide.index, layout: slide.layout, title: slide.title })),
    })
    let slides
    try {
      slides = await generateAllSlides(
        outline.slides,
        chunks,
        imagePool,
        (completed, total) => {
          const progress = 40 + Math.round((completed / total) * 55)
          onEvent({ type: 'slide', progress, message: `已生成 ${completed}/${total} 页` })
        },
        {
          language,
          debugLog: (stage, payload) => debug.log(stage, payload),
        }
      )
    } catch (error) {
      debug.log('pipeline.slidegen.error', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }

    debug.log('pipeline.slides', {
      count: slides.length,
      layouts: slides.map((slide, index) => ({ index: index + 1, layout: slide.layout, title: slide.title })),
    })
    debug.log('pipeline.slidegen.success', {
      count: slides.length,
    })
    onEvent({ type: 'progress', progress: 95, message: '正在组装演示文稿...' })

    slides.forEach((slide) => {
      slide.id = `slide-${uuidv4().slice(0, 8)}`
    })

    const presentation: Presentation = {
      id: presentationId,
      title: outline.title,
      themeId: preferences.themeId || 'group-01',
      slides,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        debugSessionId: debug.id,
        debugMode: Boolean(preferences.debugMode)
      }
    } as any // Use as any to bypass strict type if metadata not yet in interface
    const debugPath = await debug.flush({
      presentationId,
      themeId: preferences.themeId || 'group-01',
      slideCount: presentation.slides.length,
    })
    if (debugPath) {
      onEvent({
        type: 'progress',
        progress: 99,
        message: `Debug数据已保存：${debugPath}`,
      })
    }

    onEvent({ type: 'done', progress: 100, message: '生成完成', data: presentation })
    return presentation
  } catch (error) {
    await debug.flush({
      presentationId,
      error: error instanceof Error ? error.message : String(error),
    })
    const message = error instanceof Error ? error.message : 'Unknown error'
    onEvent({ type: 'error', message: `生成失败：${message}` })
    throw error
  }
}
