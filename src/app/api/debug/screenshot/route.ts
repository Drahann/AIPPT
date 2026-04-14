import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * POST /api/debug/screenshot
 * 接收 base64 PNG 数据，保存到 debug-data/<sessionId>/ 目录。
 *
 * Body: { sessionId, slideIndex, source: 'render' | 'export', dataUrl }
 */
export async function POST(req: NextRequest) {
  try {
    const { sessionId, slideIndex, source, dataUrl } = await req.json()

    if (!sessionId || slideIndex === undefined || !dataUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const debugDir = path.join(process.cwd(), 'debug-data', sessionId)
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true })
    }

    // Strip the data:image/png;base64, prefix
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const prefix = source === 'export' ? 'export-slide' : 'render-slide'
    const filename = `${prefix}-${String(slideIndex).padStart(3, '0')}.png`
    const filepath = path.join(debugDir, filename)

    await fs.promises.writeFile(filepath, buffer)
    console.log(`[Debug] Screenshot saved: ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`)

    return NextResponse.json({ success: true, path: filepath })
  } catch (error) {
    console.error('[Debug] Failed to save screenshot:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
