import { NextRequest, NextResponse } from 'next/server'
import { runAgent, AgentMessage } from '@/lib/ai/agent'
import { Presentation } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, presentation, history } = body as {
      message: string
      presentation: Presentation
      history: AgentMessage[]
    }

    if (!message || !presentation) {
      return NextResponse.json({ error: 'Missing message or presentation' }, { status: 400 })
    }

    const result = await runAgent(message, presentation, history || [])
    return NextResponse.json(result)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
