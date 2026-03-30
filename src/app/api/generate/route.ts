import { NextRequest } from 'next/server'
import { runPipeline, PipelineEvent } from '@/lib/ai/pipeline'

export const maxDuration = 900

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const slideCount = parseInt(formData.get('slideCount') as string) || undefined
    const themeId = (formData.get('themeId') as string) || 'group-01'
    const debugMode = String(formData.get('debugMode') || '') === '1'

    const userImageMetaStr = formData.get('userImageMeta') as string
    const userImages: { url: string; description: string }[] = []

    if (userImageMetaStr) {
      try {
        const meta = JSON.parse(userImageMetaStr) as { index: number; description: string }[]
        for (const item of meta) {
          const imgFile = formData.get(`image_${item.index}`) as File | null
          if (!imgFile) continue
          const buf = Buffer.from(await imgFile.arrayBuffer())
          const base64 = `data:${imgFile.type};base64,${buf.toString('base64')}`
          userImages.push({
            url: base64,
            description: item.description,
          })
        }
      } catch (error) {
        console.error('Error parsing user images:', error)
      }
    }

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await runPipeline(buffer, { slideCount, themeId, userImages, debugMode }, (event: PipelineEvent) => {
            controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'))
          })
        } catch {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: '生成失败' }) + '\n'))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
