'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllTemplatePacks, templatePackToCSS } from '@/lib/templates/registry'
import { SlideRenderer } from '@/components/slides/SlideRenderer'
import { SlideContent } from '@/lib/types'
import { Layout, Palette, Box, Layers, Monitor, ChevronRight, Sparkles, Target, Code } from 'lucide-react'
import { MOCK_SLIDES } from '@/lib/templates/mock-data'

type CSSVarStyle = CSSProperties & Record<`--${string}`, string>


function GalleryPreview({
  slide,
  index,
  cssVars,
  selectedPack,
}: {
  slide: SlideContent
  index: number
  cssVars: CSSVarStyle
  selectedPack: ReturnType<typeof getAllTemplatePacks>[number]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateScale = (width: number) => {
      setScale(width > 0 ? width / 960 : 1)
    }

    updateScale(element.clientWidth)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        updateScale(entry.contentRect.width)
      }
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const slideStyle: CSSVarStyle = {
    ...cssVars,
    backgroundColor: 'var(--color-canvas)',
    color: 'var(--color-on-canvas)',
  }

  return (
    <div
      ref={containerRef}
      className="aspect-[16/9] w-full bg-white/5 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 group-hover:border-blue-500/50 transition-all duration-300"
    >
      <div
        className="w-[960px] h-[540px] origin-top-left absolute top-0 left-0 pointer-events-none"
        style={{ transform: `scale(${scale})` }}
      >
        <div style={slideStyle} className={`w-full h-full ${selectedPack.cssClass} relative overflow-hidden`}>
          <SlideRenderer slide={slide} index={index} pack={selectedPack} />
        </div>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const packs = getAllTemplatePacks()
  const [selectedPackId, setSelectedPackId] = useState(packs[0].id)
  const selectedPack = packs.find((pack) => pack.id === selectedPackId) || packs[0]
  const cssVars = templatePackToCSS(selectedPack) as CSSVarStyle

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-80 h-full bg-[#1e293b] border-r border-[#334155] flex flex-col">
        <div className="p-8 border-b border-[#334155]">
          <h1 className="text-2xl font-bold flex items-center gap-3 text-white">
            <Sparkles className="text-blue-400" />
            AIPPT Gallery
          </h1>
          <p className="text-sm text-slate-400 mt-2">Real-time template preview and component validation</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Theme Switch</div>
          {packs.map(pack => (
            <button
              key={pack.id}
              onClick={() => setSelectedPackId(pack.id)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 group ${
                selectedPackId === pack.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-[#334155] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-lg flex-shrink-0 border-2 border-white/10"
                style={{ backgroundColor: pack.colors.primary }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{pack.name}</div>
                <div className="text-[10px] opacity-60 truncate uppercase">{pack.id}</div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedPackId === pack.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </button>
          ))}
        </div>
        
        <div className="p-6 border-t border-[#334155] bg-[#1e293b]/50">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Monitor className="w-4 h-4" />
            <span>预览尺寸: 960 × 540 (0.5x)</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 h-full overflow-y-auto bg-[#0f172a] p-12 custom-scrollbar relative">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-[#334155]">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20 uppercase">
                  {selectedPack.id}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-100 font-medium">Component Library</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">{selectedPack.name}</h2>
              <p className="text-lg text-slate-400">Rendering core layout templates in real time with synced theme tokens.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 items-center">
                <div className="flex items-center gap-2 p-1 bg-[#1e293b] rounded-lg border border-[#334155]">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedPack.colors.primary }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedPack.colors.accent }} />
                  <div className="w-6 h-6 rounded border border-[#334155]" style={{ backgroundColor: selectedPack.colors.background }} />
                </div>
                <span className="text-[10px] text-slate-500">主题色</span>
              </div>
              <div className="flex flex-col gap-1 items-end overflow-hidden max-w-[150px]">
                <div className="text-xs font-medium text-white truncate">{selectedPack.fonts.heading}</div>
                <div className="text-[10px] text-slate-500 truncate">{selectedPack.fonts.body}</div>
              </div>
            </div>
          </header>

          {/* Section: All Layouts */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Layout className="w-5 h-5 text-blue-400" /></div>
              <h3 className="text-xl font-bold text-white">{`Layout Library (${MOCK_SLIDES.length})`}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12">
              <AnimatePresence mode="wait">
                {MOCK_SLIDES.map((slide, idx) => (
                  <motion.div
                    key={`${selectedPackId}-${slide.layout}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    className="flex flex-col gap-3 group"
                  >
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <span className="w-5 h-5 bg-[#1e293b] rounded flex items-center justify-center text-[10px]">{(idx + 1).toString().padStart(2, '0')}</span>
                        {slide.layout}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="px-2 py-0.5 bg-white/5 rounded text-[9px] text-slate-400">RENDERED</span>
                      </div>
                    </div>
                    
                    <GalleryPreview
                      slide={slide}
                      index={idx}
                      cssVars={cssVars}
                      selectedPack={selectedPack}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Section: Atomic Showcase */}
          <section id="components" className="bg-white/[0.02] rounded-3xl p-10 border border-white/5 scroll-mt-20 shadow-inner">
             <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg shadow-purple-500/20">
                   <Box className="w-5 h-5 text-white" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white">Component Lab</h3>
                   <p className="text-sm text-slate-500">Validate atomic components under the active theme.</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Column 1: UI Elements */}
                <div className="space-y-8">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                         <Palette className="w-3 h-3" /> Brand Palette
                      </h4>
                      <div className="grid grid-cols-1 gap-3 p-6 bg-black/40 rounded-2xl border border-white/5">
                         <div className="px-6 py-3 rounded-xl font-bold text-center text-sm shadow-sm" style={{ backgroundColor: selectedPack.colors.primary, color: selectedPack.colors.surface }}>PRIMARY BUTTON</div>
                         <div className="px-6 py-3 rounded-xl font-bold text-center text-sm border-2 shadow-sm" style={{ borderColor: selectedPack.colors.primary, color: selectedPack.colors.primary }}>OUTLINED ACTION</div>
                         <div className="px-6 py-3 rounded-xl font-bold text-center text-sm shadow-sm" style={{ backgroundColor: selectedPack.colors.accent, color: selectedPack.colors.text }}>ACCENT CTA</div>
                      </div>
                   </div>

                   <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                      <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Typography Spec</h4>
                      <div className="space-y-2">
                         <div className="text-2xl font-bold leading-tight" style={{ fontFamily: selectedPack.fonts.heading }}>The quick brown fox</div>
                         <div className="text-sm opacity-60 leading-relaxed" style={{ fontFamily: selectedPack.fonts.body }}>Jumped over the lazy dog. Auto-adapts to multilingual font systems.</div>
                      </div>
                   </div>
                </div>

                {/* Column 2: Structural Components */}
                <div className="space-y-4 lg:col-span-1">
                   <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Layers className="w-3 h-3" /> Layout Atoms
                   </h4>
                   <div style={cssVars} className={`p-8 bg-white rounded-2xl ${selectedPack.cssClass} h-full min-h-[300px] border border-white/10 shadow-xl`}>
                      <div className="slide-card-item mb-6">
                         <div className="card-icon"><Target className="w-5 h-5" /></div>
                         <div className="card-heading">Standard card atom component</div>
                         <div className="card-body">Inherits theme tokens including border, shadow, radius, and hover states.</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="metric-item">
                            <div className="metric-value">98%</div>
                            <div className="metric-label">Success Rate</div>
                         </div>
                         <div className="metric-item">
                            <div className="metric-value">2.4s</div>
                            <div className="metric-label">Avg Time</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Column 3: Stylesheet Meta */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Code className="w-3 h-3" /> CSS Blueprint (Meta)
                   </h4>
                   <div className="space-y-3">
                      {[
                        { label: 'Primary', color: selectedPack.colors.primary, desc: 'Brand identification' },
                        { label: 'Secondary', color: selectedPack.colors.secondary || selectedPack.colors.primary, desc: 'Gradient & depth' },
                        { label: 'Surface', color: selectedPack.colors.surface, desc: 'Card levels' },
                        { label: 'Background', color: selectedPack.colors.background, desc: 'Canvas base' },
                      ].map((c) => (
                        <div key={c.label} className="p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/5 transition-colors group">
                           <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg shadow-inner flex items-center justify-center text-[10px] font-mono font-bold" style={{ backgroundColor: c.color, color: selectedPack.colors.text, border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {c.color === selectedPack.colors.primary ? 'P' : ''}
                                 </div>
                                 <div>
                                    <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{c.label}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">{c.desc}</div>
                                 </div>
                              </div>
                              <code className="text-[10px] text-blue-500 font-mono tracking-tighter bg-blue-500/5 px-2 py-1 rounded">{c.color.toUpperCase()}</code>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </section>

          <footer className="text-center py-20 border-t border-white/5">
            <div className="flex items-center justify-center gap-6 mb-6">
               <div className="h-px w-10 bg-gradient-to-r from-transparent to-slate-700"></div>
               <div className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.4em]">Design System v1.0</div>
               <div className="h-px w-10 bg-gradient-to-l from-transparent to-slate-700"></div>
            </div>
            <p className="text-slate-600 text-xs">
              {`© 2026 AIPPT Engineering Sandbox · Powered by Antigravity · ${MOCK_SLIDES.length} layout previews synchronized`}
            </p>
          </footer>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}


