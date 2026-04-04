import { NextRequest, NextResponse } from 'next/server'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const TEMP_DIR = join(process.cwd(), 'tmp', 'render-data')

/**
 * 提供临时 Presentation JSON 数据给 /render 页面。
 * GET /api/render-data?id=xxx
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const filePath = join(TEMP_DIR, `${id}.json`)
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'Data not found' }, { status: 404 })
  }

  try {
    const data = readFileSync(filePath, 'utf-8')
    return new NextResponse(data, {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return NextResponse.json({ error: 'Read failed' }, { status: 500 })
  }
}
