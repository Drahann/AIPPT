'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Presentation } from '@/lib/types'
import { getTemplatePack, templatePackToCSS } from '@/lib/templates/registry'
import { SlideRenderer } from '@/components/slides/SlideRenderer'
import { captureSlideLayout } from '@/lib/utils/layout-snapshot'

/**
 * 内部渲染页面，仅供 Playwright 无头浏览器访问。
 * 
 * 用法：
 * GET /render?id=<tempFileId>
 * 
 * 1. 从 /api/render-data?id=xxx 获取 Presentation JSON
 * 2. 渲染所有 SlideRenderer 组件
 * 3. 自动采集 DOM 快照，挂到 window.__SNAPSHOTS
 * 4. 设置 window.__SNAPSHOTS_READY = true
 */

function RenderContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || ''
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 1. Fetch presentation data
  useEffect(() => {
    if (!id) {
      setError('Missing id parameter')
      return
    }

    fetch(`/api/render-data?id=${encodeURIComponent(id)}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
        return res.json()
      })
      .then(data => setPresentation(data))
      .catch(err => setError(err.message))
  }, [id])

  // 2. After rendering, capture snapshots
  useEffect(() => {
    if (!presentation || !containerRef.current) return

    // Wait for React to render + fonts/images to load
    const timer = setTimeout(() => {
      if (!containerRef.current) return

      const slideNodes = Array.from(containerRef.current.children)
      const snapshots = slideNodes.map((node, i) => 
        captureSlideLayout(node as HTMLElement, i)
      )

      // Expose snapshots to Playwright
      ;(window as any).__SNAPSHOTS = snapshots
      ;(window as any).__SNAPSHOTS_READY = true

      console.log(`[Render] Captured ${snapshots.length} slide snapshots`)
    }, 1500) // 1.5s delay for rendering + image loading

    return () => clearTimeout(timer)
  }, [presentation])

  if (error) {
    return <div id="render-error">{error}</div>
  }

  if (!presentation) {
    return <div id="render-loading">Loading...</div>
  }

  const pack = getTemplatePack(presentation.themeId)
  const cssVars = templatePackToCSS(pack)

  return (
    <div
      ref={containerRef}
      style={{
        ...cssVars as React.CSSProperties,
        width: '960px',
        position: 'relative',
      }}
    >
      {presentation.slides.map((slide, i) => (
        <div
          key={i}
          style={{ width: '960px', height: '540px', position: 'relative' }}
        >
          <SlideRenderer
            slide={slide}
            index={i}
            pack={pack}
            isEditable={false}
          />
        </div>
      ))}
    </div>
  )
}

export default function RenderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RenderContent />
    </Suspense>
  )
}
