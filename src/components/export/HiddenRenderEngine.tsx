'use client'

import React, { useEffect, useRef } from 'react'
import { Presentation } from '@/lib/types'
import { captureSlideLayout } from '@/lib/utils/layout-snapshot'
import { getTemplatePack } from '@/lib/templates/registry'
import { isSpecTheme } from '@/lib/spec-engine/theme-registry'
import { SlideRenderer } from '@/components/slides/SlideRenderer'

interface Props {
  presentation: Presentation
  isExporting: boolean
  onComplete: (blob: Blob | null) => void
}

/**
 * 离屏渲染引擎 — 用于导出前采集快照。
 *
 * 修复项：
 * - CSS 变量通过 SpecRenderer 的 canvas 容器正确注入（不再需要额外处理）
 * - 等待所有图片加载完成后再进行快照采集
 * - Spec 主题渲染在 1920×1080（不使用 scale(0.5)）以保证快照精度
 */
export function HiddenRenderEngine({ presentation, isExporting, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!presentation) return
    if (!containerRef.current) return

    const currentPack = getTemplatePack(presentation.themeId)
    let isMounted = true

    const doExport = async () => {
      // 1. Wait a beat for React to mount the elements
      await new Promise(resolve => setTimeout(resolve, 500))

      try {
        if (!containerRef.current) return

        // 2. Wait for all images to finish loading
        const images = Array.from(containerRef.current.querySelectorAll('img'))
        const imagePromises = images
          .filter(img => !img.complete)
          .map(img => new Promise<void>((resolve) => {
            img.onload = () => resolve()
            img.onerror = () => resolve() // Don't block on failed images
            // Timeout safety net
            setTimeout(resolve, 5000)
          }))
        
        if (imagePromises.length > 0) {
          await Promise.all(imagePromises)
          // Give a small extra delay for paint
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        // 3. Query all rendered slides
        const slideNodes = Array.from(containerRef.current.children)
        
        const snapshots = slideNodes.map((node, i) => {
          return captureSlideLayout(node as HTMLElement, i)
        })

        // 4. Send to API for server-side generation
        const res = await fetch('/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: presentation.title || 'Export',
            snapshots
          })
        })

        if (!res.ok) {
           const errBody = await res.json().catch(() => ({}))
           console.error('[Export] Server error:', res.status, errBody)
           throw new Error(`Export failed: ${errBody?.error || res.statusText}`)
        }

        const blob = await res.blob()
        if (isMounted) onComplete(blob)
      } catch (err) {
        console.error('Export PPT error:', err)
        if (isMounted) onComplete(null)
      }
    }

    doExport()

    return () => { isMounted = false }
  }, [isExporting, presentation, onComplete])

  if (!isExporting) return null

  // SlideRenderer internally renders at 1920x1080 with scale(0.5), resulting in
  // a visual size of 960x540. The wrapper must match this so getBoundingClientRect
  // returns correct coordinates for layout-snapshot percentage calculations.
  // logicalWidth=1920 is detected by layout-snapshot via isSpec check.
  const slideW = 960
  const slideH = 540

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '-10000px',
        left: '-10000px',
        width: `${slideW}px`,
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      {presentation.slides.map((slide, i) => (
        <div key={i} style={{ width: `${slideW}px`, height: `${slideH}px`, position: 'relative', overflow: 'visible' }} className="hidden-slide-wrapper">
          <SlideRenderer slide={slide} index={i} pack={getTemplatePack(presentation.themeId)} isEditable={false} />
        </div>
      ))}
    </div>
  )
}
