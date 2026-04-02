'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function FeaturesListImageSlide({ slide, editable, onUpdate }: Props) {
  return (
    <div className="slide-card-inner">
      <div className="side-header">
        <EditableText
          value={slide.title}
          tag="h2"
          className="slide-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
        <EditableText
          value={slide.subtitle || ''}
          tag="p"
          className="slide-subtitle"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
        />
      </div>
      
      <div className="features-list-column">
        {slide.cards?.map((card, i) => (
          <div key={i} className="feature-item-row">
            <div className="feature-image-box">
              {/* Fallback to search result icon or placeholder if no image provided */}
              <img src={card.image?.url || `https://api.dicebear.com/7.x/shapes/svg?seed=${card.heading}`} alt="" />
            </div>
            <div className="feature-text-box">
              <div className="feature-heading">{card.heading}</div>
              <div className="feature-description">{(card.body || '').split('\n').map((line, li) => {
                    const formatted = line.replace(/^- /, '• ')
                    return <span key={li}>{li > 0 && <br/>}{formatted}</span>
                  })}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
