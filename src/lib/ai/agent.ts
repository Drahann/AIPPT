import { Presentation, SlideContent, LayoutType } from '../types'
import { callLLM, cleanJsonResponse } from './llm'
import { AGENT_SYSTEM_PROMPT, REWRITE_SLIDE_PROMPT } from './prompts/agent-system'
import { buildSlideContentPrompt } from './prompts/slide-content'

export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ToolCall {
  tool: string
  args: Record<string, unknown>
}

export interface AgentResponse {
  message: string
  toolCalls: ToolCall[]
  updatedPresentation?: Presentation
}

export async function runAgent(
  userMessage: string,
  presentation: Presentation,
  history: AgentMessage[]
): Promise<AgentResponse> {
  const slideSummary = presentation.slides
    .map((s, i) => `  [${i}] layout="${s.layout}" title="${s.title}"`)
    .join('\n')

  const contextPrompt = `当前演示文稿信息：
标题: ${presentation.title}
主题: ${presentation.themeId}
共 ${presentation.slides.length} 页：
${slideSummary}

请基于上下文回复。
请严格返回 JSON，格式如下：
{
  "message": "给用户的回复",
  "toolCalls": [
    { "tool": "工具名", "args": { ... } }
  ]
}
如果不需要改动，toolCalls 返回空数组。`

  const historyText = history
    .map((m) => `${m.role === 'user' ? '用户' : '助手'}: ${m.content}`)
    .join('\n')
  const messages = historyText
    ? `${historyText}\n用户: ${userMessage}`
    : `用户: ${userMessage}`

  const raw = await callLLM(
    AGENT_SYSTEM_PROMPT,
    `${contextPrompt}\n\n对话历史:\n${messages}`
  )

  const cleaned = cleanJsonResponse(raw)
  let parsed: { message: string; toolCalls: ToolCall[] }

  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return { message: cleaned || '处理完成。', toolCalls: [] }
  }

  if (!parsed.toolCalls || parsed.toolCalls.length === 0) {
    return { message: parsed.message, toolCalls: [] }
  }

  let updated = { ...presentation, slides: [...presentation.slides] }

  for (const call of parsed.toolCalls) {
    updated = await executeToolCall(call, updated)
  }

  updated.updatedAt = new Date().toISOString()

  return {
    message: parsed.message,
    toolCalls: parsed.toolCalls,
    updatedPresentation: updated,
  }
}

async function executeToolCall(call: ToolCall, presentation: Presentation): Promise<Presentation> {
  const slides = [...presentation.slides]
  const args = call.args

  switch (call.tool) {
    case 'rewrite_slide':
    case 'rewrite_text': {
      const idx = args.slideIndex as number
      if (idx < 0 || idx >= slides.length) break
      const original = slides[idx]
      const instruction = args.instruction as string

      const raw = await callLLM(
        REWRITE_SLIDE_PROMPT,
        `原始页面 JSON:\n${JSON.stringify(original, null, 2)}\n\n改写要求: ${instruction}\n\n请输出 JSON:`
      )

      try {
        const rewritten = JSON.parse(cleanJsonResponse(raw)) as SlideContent
        rewritten.layout = original.layout
        slides[idx] = rewritten
      } catch {
        // keep original on failure
      }
      break
    }

    case 'change_layout': {
      const idx = args.slideIndex as number
      const newLayout = args.newLayout as LayoutType
      if (idx < 0 || idx >= slides.length) break
      slides[idx] = { ...slides[idx], layout: newLayout }
      break
    }

    case 'add_slide': {
      const afterIdx = args.afterIndex as number
      const layout = (args.layout as LayoutType) || 'text-bullets'
      const title = (args.title as string) || '新页面'
      const instruction = (args.instruction as string) || ''

      const outline = {
        index: afterIdx + 2,
        title,
        layout,
        contentHint: instruction || title,
        refChunks: [],
      }
      const { system, user } = buildSlideContentPrompt(outline, [])
      const raw = await callLLM(system, user)

      try {
        const newSlide = JSON.parse(cleanJsonResponse(raw)) as SlideContent
        newSlide.layout = layout
        slides.splice(afterIdx + 1, 0, newSlide)
      } catch {
        slides.splice(afterIdx + 1, 0, {
          layout,
          title,
          body: [{ type: 'paragraph', text: instruction }],
        })
      }
      break
    }

    case 'delete_slide': {
      const idx = args.slideIndex as number
      if (idx >= 0 && idx < slides.length && slides.length > 1) {
        slides.splice(idx, 1)
      }
      break
    }

    case 'change_theme': {
      const themeId = args.themeId as string
      return { ...presentation, slides, themeId }
    }
  }

  return { ...presentation, slides }
}
