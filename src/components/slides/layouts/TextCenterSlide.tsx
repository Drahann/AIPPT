'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, BodyContent, SlideFooter } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function TextCenterSlide({ slide, editable, onUpdate }: Props) {
  return (
    <div className="slide-card-inner overview-intro-shell">
      <div className="overview-intro-content">
        {/* Decorative accent circle (top-right) — matches cards-3-featured pattern */}
        <svg className="overview-intro-accent-circle" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="var(--color-primary)"/>
        </svg>
        <EditableText
          value={slide.title}
          tag="h2"
          className="overview-intro-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
        {slide.body && slide.body.length > 0 && (
          <div className="slide-body overview-intro-body">
            <p>{slide.body.map(b => b.type === 'bullet' && b.items ? b.items.join('；') : (b.text || '')).join(' ')}</p>
          </div>
        )}
        {slide.subtitle ? (
          <EditableText
            value={slide.subtitle}
            tag="p"
            className="overview-intro-caption"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
          />
        ) : null}
      </div>

      <SlideFooter />
    </div>
  )
}
