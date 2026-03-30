'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/lib/store'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  toolCalls?: Array<{ tool: string; args: Record<string, unknown> }>
}

export function AgentPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { presentation, setPresentation } = useAppStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !presentation || loading) return

    const userMsg: ChatMessage = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          presentation,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const result = await response.json()
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: result.message || '已处理',
        toolCalls: result.toolCalls,
      }
      setMessages((prev) => [...prev, assistantMsg])

      if (result.updatedPresentation) {
        setPresentation(result.updatedPresentation)
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `请求失败：${e instanceof Error ? e.message : '未知错误'}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  const toolLabels: Record<string, string> = {
    rewrite_slide: '重写页面',
    rewrite_text: '优化文字',
    change_layout: '切换布局',
    add_slide: '新增页面',
    delete_slide: '删除页面',
    change_theme: '切换主题',
  }

  if (!open) return null

  return (
    <aside className="w-80 border-l border-[var(--color-border)] bg-white flex flex-col shrink-0 h-[calc(100vh-3.5rem)]">
      <div className="h-12 border-b border-[var(--color-border)] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold">AI 助手</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
              </svg>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">你可以这样说：</p>
            <div className="space-y-2">
              {[
                '把第 2 页改成时间线布局',
                '将第 3 页精简为 3 个要点',
                '把整体语气改成更专业',
                '新增一页总结页放在最后',
              ].map((hint, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(hint)
                    setTimeout(() => inputRef.current?.focus(), 50)
                  }}
                  className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                  : 'bg-[var(--color-surface-alt)] text-[var(--color-text)] rounded-bl-md'
              }`}
            >
              <p>{msg.content}</p>
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/20 space-y-1">
                  {msg.toolCalls.map((tc, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-xs opacity-80">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{toolLabels[tc.tool] || tc.tool}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--color-surface-alt)] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--color-text-secondary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--color-text-secondary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--color-text-secondary)] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[var(--color-border)]">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="输入你的修改要求..."
            className="flex-1 px-3 py-2 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
