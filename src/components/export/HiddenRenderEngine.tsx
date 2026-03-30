'use client'

import React, { useEffect, useRef } from 'react'
import { Presentation } from '@/lib/types'
import { captureSlideLayout } from '@/lib/utils/layout-snapshot'
import { getTemplatePack } from '@/lib/templates/registry'
// Assuming SlideRenderer exists at this path from standard structure
import { SlideRenderer } from '@/components/slides/SlideRenderer'

interface Props {
  presentation: Presentation
  isExporting: boolean
  onComplete: (blob: Blob | null) => void
}

export function HiddenRenderEngine({ presentation, isExporting, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!presentation) return
    if (!containerRef.current) return

    const currentPack = getTemplatePack(presentation.themeId)
    let isMounted = true

    const doExport = async () => {
      // 1. Wait a beat for React to mount the elements, dynamic icons, and images to fetch
      await new Promise(resolve => setTimeout(resolve, 800))
      
      try {
        if (!containerRef.current) return
        
        // 2. Query all rendered slides
        const slideNodes = Array.from(containerRef.current.children)
        
        const snapshots = slideNodes.map((node, i) => {
          return captureSlideLayout(node as HTMLElement, i)
        })

        // 3. Send to API for server-side generation
        const res = await fetch('/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: presentation.title || 'Export',
            snapshots
          })
        })

        if (!res.ok) {
           throw new Error('Export failed on server')
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

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '-10000px',
        left: '-10000px',
        width: '1920px',
        opacity: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {presentation.slides.map((slide, i) => (
        // We render them at standard sizing scale so layouts resolve cleanly.
        // Some templates will expand inside this container using explicit inner widths.
        <div key={i} style={{ width: '960px', height: '540px', position: 'relative' }} className="hidden-slide-wrapper">
          <SlideRenderer slide={slide} index={i} pack={getTemplatePack(presentation.themeId)} isEditable={false} />
        </div>
      ))}
    </div>
  )
}
