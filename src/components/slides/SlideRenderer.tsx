'use client'

import { SlideContent } from '@/lib/types'
import { TemplatePack } from '@/lib/templates/index'
import { getFigmaComponent } from '@/lib/templates/shared/component-map'
import { CoverSlide } from './layouts/CoverSlide'
import { SectionHeaderSlide } from './layouts/SectionHeaderSlide'
import { TextBulletsSlide } from './layouts/TextBulletsSlide'
import { TextCenterSlide } from './layouts/TextCenterSlide'
import { ImageTextSlide } from './layouts/ImageTextSlide'
import { ImageCenterSlide } from './layouts/ImageCenterSlide'
import { ImageFullSlide } from './layouts/ImageFullSlide'
import { CardsSlide } from './layouts/CardsSlide'
import { ComparisonSlide } from './layouts/ComparisonSlide'
import { TimelineSlide } from './layouts/TimelineSlide'
import { MetricsSlide } from './layouts/MetricsSlide'
import { QuoteSlide } from './layouts/QuoteSlide'
import { QuoteNoAvatarSlide } from './layouts/QuoteNoAvatarSlide'
import { EndingSlide } from './layouts/EndingSlide'
import { ChartSlide } from './layouts/ChartSlide'
import { ListFeaturedSlide } from './layouts/ListFeaturedSlide'
import { CardsSplitSlide } from './layouts/CardsSplitSlide'
import { StaggeredCardsSlide } from './layouts/StaggeredCardsSlide'
import { FeaturesListImageSlide } from './layouts/FeaturesListImageSlide'
import { MetricsRingsSlide } from './layouts/MetricsSplitSlide'
import { MilestoneListSlide } from './layouts/MilestoneListSlide'
import { TeamMembersSlide } from './layouts/TeamMembersSlide'

import { getDensityClass } from '@/lib/utils/density-utils'
import { useAppStore } from '@/lib/store'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { captureSlideLayout, saveLayoutSnapshot } from '@/lib/utils/layout-snapshot'

interface SlideRendererProps {
  slide: SlideContent
  index: number
  pack?: TemplatePack
  isEditable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function SlideRenderer({ slide, index, pack, isEditable = false, onUpdate }: SlideRendererProps) {
  const searchParams = useSearchParams()
  const storeDebugMode = useAppStore(state => 
    state.generateConfig?.debugMode || 
    (state.presentation as any)?.metadata?.debugMode
  )
  const debugMode = storeDebugMode === true || searchParams.get('debug') === 'true'
  const slideRef = useRef<HTMLDivElement>(null)

  const densityClass = getDensityClass(slide)
  const normalizedLayout = slide.layout === 'metrics-split' ? 'metrics-rings' : slide.layout
  const layoutClass = `layout-${normalizedLayout}`

  const debugSessionId = (useAppStore.getState().presentation as any)?.metadata?.debugSessionId
  
  // Automatic layout snapshot for debugging
  useEffect(() => {
    if (debugMode && slideRef.current) {
      const timer = setTimeout(async () => {
        if (slideRef.current) {
          const snapshot = captureSlideLayout(slideRef.current, index);
          // Pass the session ID to the server to ensure snapshots go to the right folder
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

  // --- Figma original-code rendering path ---
  if (pack && pack.figmaLayouts.includes(slide.layout) && slide.layout !== 'quote') {
    const FigmaComponent = getFigmaComponent(pack.id, slide.layout)
    if (FigmaComponent) {
      return (
        <div 
          ref={slideRef}
          className={`slide-card ${layoutClass} ${pack.cssClass || ''}`}
          data-slide-index={index}
        >
          <span className="slide-number">{index + 1}</span>
          {/* We wrap Figma components in a scaled container to match 1920x1080 design */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <div style={{
              width: 1920,
              height: 1080,
              transform: `scale(0.5)`,
              transformOrigin: 'top left',
            }}>
              <FigmaComponent 
                title={slide.title}
                subtitle={slide.subtitle}
                quote={slide.quote}
                colors={pack.colors}
              />
            </div>
          </div>
        </div>
      )
    }
  }

  // --- Semantic layout rendering path ---
  const renderLayout = () => {
    switch (slide.layout) {
      case 'cover':
        return <CoverSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'section-header':
        return <SectionHeaderSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'text-bullets':
        return <TextBulletsSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'text-center':
        return <TextCenterSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'image-text':
        return <ImageTextSlide slide={slide} editable={isEditable} onUpdate={onUpdate} imagePosition="left" />
      case 'text-image':
        return <ImageTextSlide slide={slide} editable={isEditable} onUpdate={onUpdate} imagePosition="right" />
      case 'image-center':
        return <ImageCenterSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'image-full':
        return <ImageFullSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'cards-2':
        return <CardsSlide slide={slide} columns={2} editable={isEditable} onUpdate={onUpdate} />
      case 'cards-3':
        return <CardsSlide slide={slide} columns={3} editable={isEditable} onUpdate={onUpdate} />
      case 'cards-4':
        return <CardsSlide slide={slide} columns={4} editable={isEditable} onUpdate={onUpdate} />
      case 'comparison':
        return <ComparisonSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'timeline':
        return <TimelineSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'metrics':
        return <MetricsSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'quote':
        return <QuoteSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'quote-no-avatar':
        return <QuoteNoAvatarSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'ending':
        return <EndingSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'chart-bar':
      case 'chart-bar-compare':
      case 'chart-line':
      case 'chart-pie':
        return <ChartSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'list-featured':
        return <ListFeaturedSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'cards-split':
        return <CardsSplitSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'staggered-cards':
        return <StaggeredCardsSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'features-list-image':
        return <FeaturesListImageSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'metrics-rings':
      case 'metrics-split':
        return <MetricsRingsSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'milestone-list':
        return <MilestoneListSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      case 'team-members':
        return <TeamMembersSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
      default:
        return <TextBulletsSlide slide={slide} editable={isEditable} onUpdate={onUpdate} />
    }
  }

  return (
    <div 
      ref={slideRef}
      className={`slide-card ${layoutClass} ${densityClass} ${pack?.cssClass || ''}`} 
      data-slide-index={index}
    >
      <span className="slide-number">{index + 1}</span>
      {renderLayout()}
    </div>
  )
}
