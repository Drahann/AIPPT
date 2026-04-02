import OpenAI from 'openai'
import JSON5 from 'json5'

const getClients = () => {
  const keysStr = process.env.LLM_API_KEY || ''
  const keys = keysStr
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean)
  const baseUrl = process.env.LLM_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'

  if (keys.length === 0) {
    return [
      new OpenAI({
        apiKey: '',
        baseURL: baseUrl,
        maxRetries: 5,
        timeout: 300000, // 5 minutes
      }),
    ]
  }

  return keys.map(
    (key) =>
      new OpenAI({
        apiKey: key,
        baseURL: baseUrl,
        maxRetries: 5,
        timeout: 300000, // 5 minutes
      })
  )
}

const clients = getClients()
let currentClientIndex = 0

function getNextClient() {
  const index = currentClientIndex
  const client = clients[index]
  currentClientIndex = (currentClientIndex + 1) % clients.length
  return { client, index }
}

export const DEEPSEEK_REASONER = 'qwen3-max'
export const DEEPSEEK_CHAT = 'qwen3-max'

const defaultModel = process.env.LLM_MODEL || DEEPSEEK_REASONER

export function getEffectiveModel(customModel?: string): string {
  return customModel || defaultModel
}

export function getFastModel(): string {
  // 如果默认是 reasoner，则快模型通常是 chat
  if (defaultModel === DEEPSEEK_REASONER) return DEEPSEEK_CHAT
  return defaultModel
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error: any): boolean {
  const msg = (error?.message || '').toLowerCase()
  const name = (error?.name || '').toLowerCase()
  const causeMsg = (error?.cause?.message || '').toLowerCase()

  // Socket errors, aborted/terminated, and typical transient API errors
  return (
    msg.includes('terminated') ||
    msg.includes('socket') ||
    msg.includes('connection') ||
    msg.includes('timeout') ||
    msg.includes('reset') ||
    causeMsg.includes('closed') ||
    causeMsg.includes('socket') ||
    name === 'apiconnectionerror' ||
    name === 'apitimeouterror' ||
    error?.status === 429 ||
    error?.status >= 500
  )
}

type LLMCallOptions = {
  debugLog?: (stage: string, payload: unknown) => void
  label?: string
}

function serializeLLMError(error: unknown) {
  const maybe = error as {
    message?: string
    name?: string
    status?: number
    code?: string
    type?: string
    param?: string
    request_id?: string
    headers?: Record<string, string>
    error?: unknown
    cause?: unknown
    response?: {
      status?: number
      headers?: Record<string, string>
      data?: unknown
    }
  }

  return {
    error: error instanceof Error ? error.message : String(error),
    errorName: error instanceof Error ? error.name : typeof error,
    status: maybe?.status ?? maybe?.response?.status ?? null,
    code: maybe?.code ?? null,
    type: maybe?.type ?? null,
    param: maybe?.param ?? null,
    requestId: maybe?.request_id ?? null,
    headers: maybe?.headers ?? maybe?.response?.headers ?? null,
    cause:
      maybe?.cause instanceof Error
        ? { name: maybe.cause.name, message: maybe.cause.message }
        : maybe?.cause ?? null,
    apiError: maybe?.error ?? null,
    responseData: maybe?.response?.data ?? null,
  }
}

export async function callLLM(
  system: string,
  user: string,
  options?: LLMCallOptions & { model?: string }
): Promise<string> {
  const model = getEffectiveModel(options?.model)
  const label = options?.label || 'llm.call'
  const startedAt = Date.now()
  let attempts = 0
  const maxAttempts = 5

  while (attempts < maxAttempts) {
    attempts++
    const { client, index } = getNextClient()
    const attemptStartedAt = Date.now()

    if (attempts > 1) {
      options?.debugLog?.(`${label}.retry`, {
        attempt: attempts,
        model,
        clientIndex: index,
      })
    } else {
      options?.debugLog?.(`${label}.start`, {
        model,
        clientIndex: index,
        systemLength: system.length,
        userLength: user.length,
      })
    }

    try {
      const isChat = model === DEEPSEEK_CHAT
      const stream = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.3,
        max_tokens: isChat ? 8192 : 32768,
        stream: true,
      })

      let fullContent = ''
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta
        const content = delta?.content || ''
        fullContent += content
        // Even if content is empty (e.g. reasoning tokens), receiving the chunk prevents idle timeout.
      }

      if (!fullContent) {
        throw new Error('LLM returned empty response. Check API key/model configuration.')
      }

      options?.debugLog?.(`${label}.success`, {
        model,
        clientIndex: index,
        durationMs: Date.now() - startedAt,
        attemptDurationMs: Date.now() - attemptStartedAt,
        attempts,
        contentLength: fullContent.length,
      })

      return fullContent
    } catch (error) {
      const errorInfo = serializeLLMError(error)
      options?.debugLog?.(`${label}.attempt_error`, {
        attempt: attempts,
        model,
        clientIndex: index,
        durationMs: Date.now() - attemptStartedAt,
        ...errorInfo,
      })

      if (attempts < maxAttempts && isRetryableError(error)) {
        const delay = Math.min(1000 * Math.pow(2, attempts - 1), 10000)
        await wait(delay)
        continue
      }

      options?.debugLog?.(`${label}.error`, {
        model,
        clientIndex: index,
        durationMs: Date.now() - startedAt,
        attempts,
        ...errorInfo,
      })
      throw error
    }
  }
  throw new Error('Max attempts reached')
}

export async function callLLMStream(
  system: string,
  user: string,
  onChunk: (chunk: string) => void,
  options?: { model?: string }
): Promise<string> {
  const model = getEffectiveModel(options?.model)
  const { client } = getNextClient()
  const isChat = model === DEEPSEEK_CHAT
  const stream = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.3,
    max_tokens: isChat ? 8192 : 16384,
    stream: true,
  })

  let full = ''
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    full += content
    onChunk(content)
  }

  return full
}

function normalizeJsonText(text: string): string {
  // IMPORTANT: Do NOT globally replace Chinese double quotes \u201C\u201D with ASCII ".
  // CJK content frequently contains them inside string values (e.g. "感知-意图-反馈"),
  // and converting them to ASCII " breaks the JSON structure.

  let result = text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\u00a0/g, ' ')
    .replace(/,(\s*[}\]])/g, '$1')
    .replace(/[\u0000-\u001f]/g, (ch) => (ch === '\n' || ch === '\r' || ch === '\t' ? ch : ''))

  // Smart Chinese double-quote replacement: only at structural JSON positions.
  // e.g. {<lq>  ,<lq>  [<lq>  :<lq>  <rq>}  <rq>,  <rq>]  <rq>:
  result = result.replace(/([\[{,:])\s*\u201C/g, '$1"')
  result = result.replace(/\u201D\s*([\]},:])/g, '"$1')

  // Fullwidth colon/comma only at structural positions (adjacent to ASCII ")
  result = result.replace(/"\uff1a/g, '":').replace(/\uff1a"/g, ':"')
  result = result.replace(/"\uff0c/g, '",').replace(/\uff0c"/g, ',"')

  return result
}

function parseSingleQuotedJsonLike<T>(text: string): T {
  let output = ''
  let inSingle = false
  let inDouble = false
  let escaped = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1] || ''

    if (escaped) {
      output += char
      escaped = false
      continue
    }

    if (char === '\\') {
      output += char
      escaped = true
      continue
    }

    if (inDouble) {
      output += char
      if (char === '"') inDouble = false
      continue
    }

    if (inSingle) {
      if (char === '"') {
        output += '\\"'
        continue
      }

      if (char === "'") {
        const nextNonSpace = text.slice(index + 1).match(/^\s*(.)/)?.[1] || ''
        const shouldClose =
          next === '' ||
          next === ',' ||
          next === '}' ||
          next === ']' ||
          next === ':' ||
          next === '\n' ||
          /\s/.test(next) && [',', '}', ']', ':'].includes(nextNonSpace)

        if (shouldClose) {
          output += '"'
          inSingle = false
        } else {
          output += "\\'"
        }
        continue
      }

      output += char
      continue
    }

    if (char === '"') {
      output += char
      inDouble = true
      continue
    }

    if (char === "'") {
      output += '"'
      inSingle = true
      continue
    }

    output += char
  }

  return JSON5.parse(output) as T
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf('{')
  if (start < 0) return null

  let depth = 0
  let inString = false
  let escaped = false
  for (let index = start; index < text.length; index += 1) {
    const char = text[index]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\') {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (char === '{') depth += 1
    if (char === '}') {
      depth -= 1
      if (depth === 0) return text.slice(start, index + 1)
    }
  }
  return null
}

export function cleanJsonResponse(raw: string): string {
  let cleaned = (raw || '').trim()
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7)
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3)
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3)

  cleaned = normalizeJsonText(cleaned.trim())
  return cleaned
}

export function tryParseJson<T>(raw: string): T {
  const cleaned = cleanJsonResponse(raw)
  try {
    return JSON.parse(cleaned) as T
  } catch {
    const extracted = extractJsonObject(cleaned)
    if (!extracted) throw new Error('No JSON object found in LLM response')
    const normalized = normalizeJsonText(extracted)
    try {
      return JSON.parse(normalized) as T
    } catch {
      try {
        return JSON5.parse(normalized) as T
      } catch {
        return parseSingleQuotedJsonLike<T>(normalized)
      }
    }
  }
}

export async function repairJsonWithLLM(raw: string, schemaHint?: string, options?: LLMCallOptions): Promise<string> {
  const system = 'You repair invalid JSON. Output JSON only.'
  const user = `Fix this JSON string into strict valid JSON.

Rules:
1) Keep original keys and values.
2) Do not add explanation text.
3) Use valid UTF-8 characters.
4) Output JSON only.
${schemaHint ? `5) Keep this shape: ${schemaHint}` : ''}

Input:
${raw}`

  const repaired = await callLLM(system, user, {
    ...options,
    label: options?.label || 'llm.repair',
  })
  return cleanJsonResponse(repaired)
}
