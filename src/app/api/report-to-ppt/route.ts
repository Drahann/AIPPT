import { NextRequest, NextResponse } from 'next/server'
import { runPipeline } from '@/lib/ai/pipeline'
import { uploadToCOS } from '@/lib/server/cos-upload'
import { notifyReportServer } from '@/lib/server/callback'
import { processMarkdownImages } from '@/lib/server/image-downloader'
import { captureSnapshots } from '@/lib/server/snapshot-renderer'
import { generateUniversalPptx } from '@/lib/export/universal-exporter'

export const maxDuration = 900

interface ReportRequest {
  reportId: string
  content: string          // Markdown 内容
  fileUrl?: string         // 报告原文在 COS 上的路径
  themeId?: string         // 模板包 ID，默认 group-01
  callbackUrl?: string     // 可选覆盖回调 URL
}

export async function POST(request: NextRequest) {
  let reportId = 'unknown'

  try {
    const body: ReportRequest = await request.json()
    reportId = body.reportId || 'unknown'

    // ---- 参数校验 ----
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: content (Markdown string)' },
        { status: 400 }
      )
    }
    if (!body.reportId) {
      return NextResponse.json(
        { error: 'Missing required field: reportId' },
        { status: 400 }
      )
    }

    const themeId = body.themeId || 'group-01'
    const fileUrl = body.fileUrl || ''
    console.log(`[ReportToPPT] Start: reportId=${reportId}, contentLength=${body.content.length}, themeId=${themeId}`)

    // ---- 1. 处理 Markdown 中的外部图片 ----
    console.log(`[ReportToPPT] ${reportId}: Processing markdown images...`)
    const { processedMarkdown, images } = await processMarkdownImages(body.content)
    console.log(`[ReportToPPT] ${reportId}: Found ${images.length} images`)

    // ---- 2. 运行 PPT 生成管线 ----
    console.log(`[ReportToPPT] ${reportId}: Running pipeline...`)
    const buffer = Buffer.from(processedMarkdown, 'utf-8')

    const presentation = await runPipeline(
      buffer,
      {
        themeId,
        language: 'zh-CN',
        userImages: images.map(img => ({ url: img.url, description: img.description })),
      },
      (event) => {
        if (event.message) {
          console.log(`[ReportToPPT] ${reportId}: ${event.message}`)
        }
      }
    )

    // ---- 3. Playwright 无头渲染 + DOM 快照采集 ----
    console.log(`[ReportToPPT] ${reportId}: Capturing snapshots via Playwright...`)
    const port = parseInt(process.env.PORT || '3000', 10)
    const snapshots = await captureSnapshots(presentation, port)
    console.log(`[ReportToPPT] ${reportId}: Got ${snapshots.length} snapshots`)

    // ---- 4. 使用 universal-exporter 生成高质量 PPTX ----
    console.log(`[ReportToPPT] ${reportId}: Generating PPTX...`)
    const pptxBuffer = await generateUniversalPptx(snapshots, presentation.title)
    console.log(`[ReportToPPT] ${reportId}: PPTX generated, size=${pptxBuffer.length} bytes`)

    // ---- 5. 上传 PPTX 到 COS ----
    const safeTitle = (presentation.title || 'presentation')
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]/g, '_')
      .slice(0, 50)
    const cosPath = `ppt/${reportId}/${safeTitle}.pptx`
    console.log(`[ReportToPPT] ${reportId}: Uploading to COS: ${cosPath}`)
    const pptUrl = await uploadToCOS(pptxBuffer, cosPath)
    console.log(`[ReportToPPT] ${reportId}: Upload done: ${pptUrl}`)

    // ---- 6. 回调通知 ----
    console.log(`[ReportToPPT] ${reportId}: Sending callback...`)
    const callbackResult = await notifyReportServer(reportId, fileUrl, pptUrl)
    console.log(`[ReportToPPT] ${reportId}: Callback result:`, JSON.stringify(callbackResult))

    // ---- 7. 返回结果 ----
    return NextResponse.json({
      success: true,
      reportId,
      pptUrl,
      slideCount: presentation.slides.length,
      title: presentation.title,
      callback: callbackResult,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error(`[ReportToPPT] ${reportId}: Error:`, msg)
    return NextResponse.json(
      { error: msg, reportId },
      { status: 500 }
    )
  }
}
