'use client'

import { useAppStore } from '@/lib/store'
import { getAllTemplatePacks, getTemplatePack } from '@/lib/templates/registry'
import { useState } from 'react'
import { HiddenRenderEngine } from '@/components/export/HiddenRenderEngine'

export function EditorToolbar({ onToggleAgent }: { onToggleAgent?: () => void }) {
  const { presentation, setPresentation, setPresentMode } = useAppStore()
  const [showThemes, setShowThemes] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleExportClick = () => {
    if (!presentation || exporting) return
    setExporting(true)
  }

  const handleExportComplete = (blob: Blob | null) => {
    setExporting(false)
    if (blob && presentation) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${presentation.title || 'presentation'}.pptx`
      a.click()
      URL.revokeObjectURL(url)
    } else if (!blob) {
      alert('导出失败: PPTX生成过程出现错误')
    }
  }

  if (!presentation) return null

  // Narrowing is confirmed here for the rest of the render.
  const activePresentation = presentation

  const allPacks = getAllTemplatePacks()
  const currentPack = getTemplatePack(activePresentation.themeId)

  const handleThemeChange = (packId: string) => {
    setPresentation({ ...activePresentation, themeId: packId, updatedAt: new Date().toISOString() })
    setShowThemes(false)
  }

  return (
    <header className="ff-toolbar">
      <div className="ff-toolbar__left">
        <span className="ff-toolbar__brand">HIT</span>
        <span className="ff-toolbar__sep">/</span>
        <span className="ff-toolbar__title">{activePresentation.title}</span>
      </div>

      <div className="ff-toolbar__spacer" />

      <div className="ff-toolbar__theme-wrap">
        <button onClick={() => setShowThemes(!showThemes)} className="ff-toolbar__btn">
          <div className="ff-toolbar__swatch" style={{ background: currentPack.colors.primary }} />
          {currentPack.name}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showThemes && (
          <>
            <div className="ff-toolbar__backdrop" onClick={() => setShowThemes(false)} />
            <div className="ff-toolbar__dropdown">
              <div className="ff-toolbar__dropdown-label">主题</div>
              {allPacks.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => handleThemeChange(pack.id)}
                  className={`ff-toolbar__dropdown-item ${activePresentation.themeId === pack.id ? 'ff-toolbar__dropdown-item--active' : ''}`}
                >
                  <div
                    className="ff-toolbar__swatch"
                    style={{
                      background: `linear-gradient(135deg, ${pack.colors.primary} 50%, ${pack.colors.secondary || pack.colors.accent} 50%)`,
                    }}
                  />
                  {pack.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <button onClick={handleExportClick} disabled={exporting} className="ff-toolbar__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        {exporting ? '生成/导出中…' : '导出 PPTX'}
      </button>

      <button onClick={onToggleAgent} className="ff-toolbar__btn">
        AI 助手
      </button>

      <button onClick={() => setPresentMode(true)} className="ff-toolbar__btn ff-toolbar__btn--primary">
        放映 →
      </button>

      <HiddenRenderEngine 
        presentation={activePresentation} 
        isExporting={exporting} 
        onComplete={handleExportComplete} 
      />
    </header>
  )
}
