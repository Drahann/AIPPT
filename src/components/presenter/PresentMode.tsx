'use client'

import { useEffect, useCallback, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { SlideRenderer } from '@/components/slides/SlideRenderer'
import { getTemplatePack, templatePackToCSS } from '@/lib/templates/registry'

export function PresentMode() {
  const { presentation, currentSlideIndex, setCurrentSlide, setPresentMode } = useAppStore()
  const [transitioning, setTransitioning] = useState(false)
  const [showHelp, setShowHelp] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowHelp(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (!presentation || transitioning) return
      const newIndex =
        direction === 'next'
          ? Math.min(currentSlideIndex + 1, presentation.slides.length - 1)
          : Math.max(currentSlideIndex - 1, 0)

      if (newIndex === currentSlideIndex) return

      setTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(newIndex)
        setTimeout(() => setTransitioning(false), 50)
      }, 150)
    },
    [presentation, currentSlideIndex, transitioning, setCurrentSlide]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          navigate('next')
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'Backspace':
          e.preventDefault()
          navigate('prev')
          break
        case 'Escape':
          setPresentMode(false)
          break
        case 'Home':
          e.preventDefault()
          setCurrentSlide(0)
          break
        case 'End':
          e.preventDefault()
          if (presentation) setCurrentSlide(presentation.slides.length - 1)
          break
      }
    },
    [navigate, setPresentMode, setCurrentSlide, presentation]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!presentation) return null

  const templatePack = getTemplatePack(presentation.themeId)
  const cssVars = templatePackToCSS(templatePack)
  const slide = presentation.slides[currentSlideIndex]
  const total = presentation.slides.length

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center select-none"
      style={cssVars as React.CSSProperties}
    >
      {/* Slide Content with transition */}
      <div
        className={`w-full max-w-5xl px-8 transition-all duration-200 ease-out ${
          transitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        <SlideRenderer slide={slide} index={currentSlideIndex} isEditable={false} pack={templatePack} />
      </div>

      {/* Click zones */}
      <div
        className="absolute left-0 top-0 w-1/3 h-full cursor-w-resize z-10"
        onClick={() => navigate('prev')}
      />
      <div
        className="absolute right-0 top-0 w-1/3 h-full cursor-e-resize z-10"
        onClick={() => navigate('next')}
      />

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div
          className="h-full bg-white/40 transition-all duration-300"
          style={{ width: `${((currentSlideIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-6 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => setPresentMode(false)}
          className="text-white/60 hover:text-white text-xs flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          ESC 退出
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('prev')}
            disabled={currentSlideIndex === 0}
            className="text-white/60 hover:text-white disabled:opacity-20 p-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span className="text-white/60 text-xs font-medium tabular-nums min-w-[3rem] text-center">
            {currentSlideIndex + 1} / {total}
          </span>

          <button
            onClick={() => navigate('next')}
            disabled={currentSlideIndex === total - 1}
            className="text-white/60 hover:text-white disabled:opacity-20 p-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="w-16" />
      </div>

      {/* Help overlay (auto-dismiss) */}
      {showHelp && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-8 py-6 text-white/80 text-sm space-y-2 animate-pulse">
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-0.5 rounded bg-white/20 text-xs font-mono">←</kbd>
              <kbd className="px-2 py-0.5 rounded bg-white/20 text-xs font-mono">→</kbd>
              <span>切换页面</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-0.5 rounded bg-white/20 text-xs font-mono">ESC</kbd>
              <span>退出放映</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
