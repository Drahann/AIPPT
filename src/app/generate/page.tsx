'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { PipelineEvent } from '@/lib/ai/pipeline'
import { Presentation } from '@/lib/types'

export default function GeneratePage() {
  const router = useRouter()
  const { generateConfig, setGenerateConfig, setPresentation } = useAppStore()
  const [progress, setProgress] = useState(0)
  const [messages, setMessages] = useState<string[]>([])
  const [status, setStatus] = useState<string>('initializing')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    if (!generateConfig || !generateConfig.file) {
      router.push('/')
      return
    }

    const formData = new FormData()
    formData.append('file', generateConfig.file)
    formData.append('themeId', generateConfig.packId)
    if (generateConfig.debugMode) {
      formData.append('debugMode', '1')
    }

    if (generateConfig.userImages?.length) {
      const imgMeta: { index: number; description: string }[] = []
      generateConfig.userImages.forEach((img, i) => {
        formData.append(`image_${i}`, img.file)
        imgMeta.push({ index: i, description: img.description })
      })
      formData.append('userImageMeta', JSON.stringify(imgMeta))
    }

    startGeneration(formData)
  }, [generateConfig, router])

  async function startGeneration(formData: FormData) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        setError(`请求失败: ${response.status}`)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        setError('未收到流式响应')
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const event: PipelineEvent = JSON.parse(line)
            handleEvent(event)
          } catch {
            // 忽略非法行
          }
        }
      }
    } catch (e) {
      setError(`生成失败: ${e instanceof Error ? e.message : '未知错误'}`)
    }
  }

  function handleEvent(event: PipelineEvent) {
    if (event.progress !== undefined) setProgress(event.progress)
    if (event.message) setMessages((prev) => [...prev, event.message!])
    if (event.status) setStatus(event.status)

    if (event.type === 'done' && event.data) {
      const presentation = event.data as Presentation
      setPresentation(presentation)
      setGenerateConfig(null)
      setDone(true)
    }
    if (event.type === 'error') {
      setError(event.message || '生成失败')
    }

    setTimeout(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }

  const statusLabels: Record<string, string> = {
    initializing: '初始化',
    parsing: '解析文档',
    outlining: '生成大纲',
    generating: '生成内容',
    imaging: '处理图片',
    done: '完成',
  }

  return (
    <div className="ff-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="ff-nav">
        <div className="ff-container ff-nav__inner">
          <span className="ff-nav__brand">HIT</span>
        </div>
      </nav>

      <main className="ff-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
              <h1
                style={{
                  fontFamily: "var(--ff-font-heading, 'Instrument Sans', sans-serif)",
                  fontSize: '48px',
                  fontWeight: 700,
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {progress}%
              </h1>
              <span
                style={{
                  fontFamily: "var(--ff-font-heading, 'Instrument Sans', sans-serif)",
                  fontSize: '16px',
                  color: '#767676',
                  letterSpacing: '-0.03em',
                }}
              >
                {error ? '失败' : done ? '完成' : statusLabels[status] || '处理中…'}
              </span>
            </div>

            <div style={{ height: '2px', background: '#e9e9e9', width: '100%' }}>
              <div
                style={{
                  height: '100%',
                  background: '#000',
                  width: `${progress}%`,
                  transition: 'width 0.5s ease-out',
                }}
              />
            </div>

            {generateConfig && generateConfig.file && !done && !error && (
              <p style={{ fontSize: '14px', color: '#767676', letterSpacing: '-0.03em', marginTop: '8px' }}>
                {generateConfig.file.name} · {(generateConfig.file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </div>

          <div
            ref={logRef}
            style={{
              borderTop: '1px solid #e9e9e9',
              height: '280px',
              overflowY: 'auto',
              paddingTop: '16px',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#767676',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.6',
                  marginBottom: '4px',
                }}
              >
                <span style={{ color: '#000', flexShrink: 0, marginTop: '2px' }}>
                  {i === messages.length - 1 && !done && !error ? (
                    <svg className="ff-spin" width="14" height="14" viewBox="0 0 24 24">
                      <circle className="ff-spin__track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                      <path className="ff-spin__arc" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    '→'
                  )}
                </span>
                <span>{msg}</span>
              </div>
            ))}
            {error && <div style={{ color: '#000', fontWeight: 600, marginTop: '12px' }}>{error}</div>}
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            {done && (
              <button onClick={() => router.push('/edit')} className="ff-btn ff-btn--primary" style={{ flex: 1 }}>
                进入编辑器 →
              </button>
            )}
            {error && (
              <button onClick={() => router.push('/')} className="ff-btn ff-btn--outline" style={{ flex: 1 }}>
                返回首页
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
