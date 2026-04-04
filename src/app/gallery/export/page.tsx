'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getTemplatePack, templatePackToCSS } from '@/lib/templates/registry'
import { SlideRenderer } from '@/components/slides/SlideRenderer'
import { MOCK_SLIDES } from '@/lib/templates/mock-data'
import { type CSSProperties } from 'react'

type CSSVarStyle = CSSProperties & Record<`--${string}`, string>

function GalleryExportContent() {
  const searchParams = useSearchParams()
  const packId = searchParams.get('packId') || 'group-04'
  const pack = getTemplatePack(packId)
  const cssVars = templatePackToCSS(pack) as CSSVarStyle

  return (
    <div className="bg-white min-h-screen">
      {/* CSS for print-friendly layout */}
      <style jsx global>{`
        @media print {
          @page {
            size: 960px 540px;
            margin: 0;
          }
           body {
            margin: 0;
            padding: 0;
          }
          .slide-container {
            page-break-after: always;
            break-after: page;
          }
        }
        .slide-container {
          width: 960px;
          height: 540px;
          overflow: hidden;
          position: relative;
          background: var(--color-canvas);
        }
        /* Override SlideRenderer internal scale if needed, 
           but since we are rendering at 1920x1080, it should be 1:1 */
        .slide-card {
           width: 100% !important;
           height: 100% !important;
           border: none !important;
           box-shadow: none !important;
           border-radius: 0 !important;
        }
      `}</style>
      
      <div style={cssVars} className={pack.cssClass}>
        {MOCK_SLIDES.map((slide, idx) => (
          <div key={idx} className="slide-container">
            <div className="w-full h-full relative">
               <SlideRenderer slide={slide} index={idx} pack={pack} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GalleryExportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryExportContent />
    </Suspense>
  )
}
