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
        <EditableText
          value={slide.title}
          tag="h2"
          className="overview-intro-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
        <BodyContent body={slide.body} className="overview-intro-body" />
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
