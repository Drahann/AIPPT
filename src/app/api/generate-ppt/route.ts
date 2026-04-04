import { NextRequest, NextResponse } from 'next/server'
import { runPipeline } from '@/lib/ai/pipeline'
import { uploadToCOS } from '@/lib/server/cos-upload'
import { processMarkdownImages } from '@/lib/server/image-downloader'
import { captureSnapshots } from '@/lib/server/snapshot-renderer'
import { generateUniversalPptx } from '@/lib/export/universal-exporter'

export const maxDuration = 900

/**
 * 团队约定接口: Python send_plant_PPT() → AIPPT /api/generate-ppt
 *
 * 接收字段:
 *   msg, companyId, userId, report_id, fileUrl, wordUrl, title, content
 *
 * 流程:
 *   1. 接收 Markdown content
 *   2. 生成 PPT (AI pipeline → Playwright 快照 → PPTX)
 *   3. 上传 PPTX 到 COS
 *   4. 回调通知业务服务器: 所有数据全部完成
 *   5. 返回结果给 Python 调用方
 */

interface GeneratePptRequest {
  msg?: string
  companyId?: string
  userId?: string
  report_id: string
  fileUrl?: string        // PDF 报告 COS 路径
  wordUrl?: string        // Word 文档 COS 路径
  title?: string          // 项目标题 (project_idea)
  content: string         // Markdown 计划书全文 (final_planbook)
  themeId?: string        // 可选主题，默认 group-01
}

export async function POST(request: NextRequest) {
  let reportId = 'unknown'

  try {
    const body: GeneratePptRequest = await request.json()
    reportId = body.report_id || 'unknown'

    // ---- 参数校验 ----
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing required field: content' },
        { status: 400 }
      )
    }
    if (!body.report_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: report_id' },
        { status: 400 }
      )
    }

    const themeId = body.themeId || 'group-01'
    console.log(`[GeneratePPT] Start: report_id=${reportId}, title=${body.title || ''}, contentLen=${body.content.length}, theme=${themeId}`)
    console.log(`[GeneratePPT] ${reportId}: companyId=${body.companyId}, userId=${body.userId}`)

    // ---- 1. 处理 Markdown 中的外部图片 ----
    console.log(`[GeneratePPT] ${reportId}: Processing markdown images...`)
    const { processedMarkdown, images } = await processMarkdownImages(body.content)
    console.log(`[GeneratePPT] ${reportId}: Found ${images.length} images`)

    // ---- 2. 运行 PPT 生成管线 ----
    console.log(`[GeneratePPT] ${reportId}: Running AI pipeline...`)
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
          console.log(`[GeneratePPT] ${reportId}: ${event.message}`)
        }
      }
    )

    // 如果 Python 传了 title，优先用它
    if (body.title) {
      presentation.title = body.title
    }

    // ---- 3. Playwright 无头渲染 + DOM 快照 ----
    console.log(`[GeneratePPT] ${reportId}: Capturing snapshots...`)
    const port = parseInt(process.env.PORT || '3000', 10)
    const snapshots = await captureSnapshots(presentation, port)
    console.log(`[GeneratePPT] ${reportId}: Got ${snapshots.length} snapshots`)

    // ---- 4. 生成 PPTX ----
    console.log(`[GeneratePPT] ${reportId}: Generating PPTX...`)
    const pptxBuffer = await generateUniversalPptx(snapshots, presentation.title)
    console.log(`[GeneratePPT] ${reportId}: PPTX size=${pptxBuffer.length} bytes`)

    // ---- 5. 上传 PPTX 到 COS ----
    const safeTitle = (presentation.title || 'presentation')
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]/g, '_')
      .slice(0, 50)
    const cosPath = `ppt/${reportId}/${safeTitle}.pptx`
    console.log(`[GeneratePPT] ${reportId}: Uploading to COS: ${cosPath}`)
    const pptUrl = await uploadToCOS(pptxBuffer, cosPath)
    console.log(`[GeneratePPT] ${reportId}: Upload done: ${pptUrl}`)

    // ---- 6. 回调通知: 所有数据全部完成 ----
    const callbackResult = await notifyAllComplete({
      reportId,
      fileUrl: body.fileUrl || '',
      wordUrl: body.wordUrl || '',
      pptUrl,
    })
    console.log(`[GeneratePPT] ${reportId}: Callback result:`, JSON.stringify(callbackResult))

    // ---- 7. 返回结果 ----
    return NextResponse.json({
      success: true,
      report_id: reportId,
      pptUrl,
      slideCount: presentation.slides.length,
      title: presentation.title,
      callback: callbackResult,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error(`[GeneratePPT] ${reportId}: Error:`, msg)
    return NextResponse.json(
      { success: false, error: msg, report_id: reportId },
      { status: 500 }
    )
  }
}

/* ────────────────────────────────────────────────────
 * 回调: 通知 chumojy.cn/api/report/receiveReport
 * payload 严格按接口文档:
 *   { success, msg, data: { reportId, fileUrl, pptUrl, wordUrl } }
 * 所有 URL 为 COS 相对路径（不含域名）
 * ──────────────────────────────────────────────────── */
interface CallbackData {
  reportId: string
  fileUrl: string
  wordUrl: string
  pptUrl: string
}

async function notifyAllComplete(data: CallbackData): Promise<{ success: boolean; error?: string }> {
  const callbackUrl = process.env.REPORT_CALLBACK_URL
  if (!callbackUrl) {
    console.warn('[Callback] REPORT_CALLBACK_URL not configured, skipping')
    return { success: false, error: 'REPORT_CALLBACK_URL not configured' }
  }

  // 转为相对路径（回调侧要求不带域名）
  const toRelative = (url: string) => {
    if (!url) return ''
    try {
      const parsed = new URL(url)
      if (parsed.protocol && parsed.hostname) {
        return parsed.pathname.replace(/^\//, '')
      }
    } catch { /* not a full URL */ }
    return url.replace(/^\//, '')
  }

  const payload = {
    success: 'success',
    msg: '报告上传成功',
    data: {
      reportId: data.reportId,
      fileUrl: toRelative(data.fileUrl),
      pptUrl: toRelative(data.pptUrl),
      wordUrl: toRelative(data.wordUrl),
    },
  }

  try {
    console.log(`[Callback] Sending to ${callbackUrl}:`, JSON.stringify(payload))
    const response = await fetch(callbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    })

    if (!response.ok) {
      throw new Error(`Callback responded with ${response.status}`)
    }

    const result = await response.json()
    console.log('[Callback] Success:', JSON.stringify(result))
    return { success: true }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[Callback] Failed:', msg)
    return { success: false, error: msg }
  }
}
