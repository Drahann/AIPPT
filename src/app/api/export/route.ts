import { NextRequest, NextResponse } from 'next/server'
import { generateUniversalPptx } from '@/lib/export/universal-exporter'

export async function POST(request: NextRequest) {
  try {
    const { title, snapshots } = await request.json()

    if (!snapshots || !Array.isArray(snapshots) || snapshots.length === 0) {
      return NextResponse.json({ error: 'Invalid snapshot data' }, { status: 400 })
    }

    const buffer = await generateUniversalPptx(snapshots, title)

    const filename = `${title || 'presentation'}.pptx`
    const encodedFilename = encodeURIComponent(filename)

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Export failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

