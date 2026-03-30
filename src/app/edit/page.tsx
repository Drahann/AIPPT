'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { SlideRenderer } from '@/components/slides/SlideRenderer'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { SlideNavigator } from '@/components/editor/SlideNavigator'
import { AgentPanel } from '@/components/editor/AgentPanel'
import { getTemplatePack, templatePackToCSS } from '@/lib/templates/registry'
import { PresentMode } from '@/components/presenter/PresentMode'
import { useState } from 'react'

export default function EditPage() {
  const router = useRouter()
  const {
    presentation,
    currentSlideIndex,
    isPresentMode,
    setCurrentSlide,
  } = useAppStore()
  const [agentOpen, setAgentOpen] = useState(false)

  useEffect(() => {
    if (!presentation) {
      router.push('/')
    }
  }, [presentation, router])

  if (!presentation) return null

  const pack = getTemplatePack(presentation.themeId)
  const cssVars = templatePackToCSS(pack)

  if (isPresentMode) {
    return <PresentMode />
  }

  return (
    <div className="ff-editor" style={cssVars as React.CSSProperties}>
      <EditorToolbar onToggleAgent={() => setAgentOpen(!agentOpen)} />

      <div className="ff-editor__body">
        <SlideNavigator />

        {/* Canvas */}
        <main className="ff-editor__canvas">
          <div className="ff-editor__canvas-inner">
            {presentation.slides.map((slide, index) => (
              <div
                key={slide.id || index}
                id={`slide-${index}`}
                className={`ff-editor__slide ${currentSlideIndex === index ? 'ff-editor__slide--active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              >
                <SlideRenderer
                  slide={slide}
                  index={index}
                  pack={pack}
                  isEditable={false}
                />
              </div>
            ))}
          </div>
        </main>

        {/* Agent Panel */}
        <AgentPanel open={agentOpen} onClose={() => setAgentOpen(false)} />
      </div>
    </div>
  )
}
