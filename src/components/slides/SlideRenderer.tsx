'use client'

import { SlideContent } from '@/lib/types'
import { SpecRenderer, resolveLayout, getThemeSpec } from '@/lib/spec-engine'
import '@/lib/spec-engine/themes' // side-effect: registers all themes

import { getDensityClass } from '@/lib/utils/density-utils'
import { getTypographyVars } from '@/lib/utils/typography-utils'
import { useAppStore } from '@/lib/store'
import { useEffect, useRef, useMemo, useState } from 'react'
import { captureSlideLayout, saveLayoutSnapshot } from '@/lib/utils/layout-snapshot'

interface SlideRendererProps {
  slide: SlideContent
  index: number
  /** @deprecated pack 参数仅为向后兼容保留 */
  pack?: { id: string; cssClass?: string }
  isEditable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

/**
 * 统一的幻灯片渲染器 — 仅通过 SpecRenderer 渲染。
 *
 * 使用 resolveLayout() 4 级 fallback 机制：
 * ① 主题精确匹配
 * ② 主题语义匹配
 * ③ 公共库精确匹配（注入当前主题配色）
 * ④ 公共库语义匹配（注入当前主题配色）
 */
export function SlideRenderer({ slide, index, pack, isEditable = false, onUpdate }: SlideRendererProps) {
  const [urlDebug, setUrlDebug] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setUrlDebug(params.get('debug') === 'true')
    }
  }, [])
  const storeDebugMode = useAppStore(state => 
    state.generateConfig?.debugMode || 
    (state.presentation as any)?.metadata?.debugMode
  )
  const debugMode = storeDebugMode === true || urlDebug
  const slideRef = useRef<HTMLDivElement>(null)

  const layoutClass = `layout-${slide.layout}`

  const debugSessionId = (useAppStore.getState().presentation as any)?.metadata?.debugSessionId
  
  // Automatic layout snapshot for debugging
  useEffect(() => {
    if (debugMode && slideRef.current) {
      const timer = setTimeout(async () => {
        if (slideRef.current) {
          const snapshot = captureSlideLayout(slideRef.current, index);
          const success = await saveLayoutSnapshot({
            ...snapshot,
            sessionId: debugSessionId
          });
          console.log(`[Debug] Layout snapshot saved for slide ${index} in session ${debugSessionId}. Success:`, success);
        }
      }, 1000 + Math.random() * 500); // 1s delay with jitter to spread load
      return () => clearTimeout(timer);
    }
  }, [debugMode, slide, index, debugSessionId]);

  // 通过 resolveLayout 获取布局（含 4 级 fallback）
  const themeId = pack?.id || 'pastel-papercut'
  const layoutSpec = resolveLayout(themeId, slide.layout)
  const themeSpec = getThemeSpec(themeId)

  // 使用实际解析到的主题（可能是 common fallback，但配色已注入）
  const effectiveTheme = themeSpec || getThemeSpec('common')!

  return (
    <div
      ref={slideRef}
      className={`slide-card ${layoutClass} ${pack?.cssClass || ''}`}
      data-slide-index={index}
    >
      <span className="slide-number">{index + 1}</span>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          width: 1920,
          height: 1080,
          transform: 'scale(0.5)',
          transformOrigin: 'top left',
        }}>
          <SpecRenderer spec={layoutSpec} theme={effectiveTheme} slide={slide} />
        </div>
      </div>
    </div>
  )
}
