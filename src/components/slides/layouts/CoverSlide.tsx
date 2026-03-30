'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function CoverSlide({ slide, editable, onUpdate }: Props) {
  return (
    <div className="slide-card-inner">
      <EditableText
        value={slide.title}
        tag="h1"
        className="slide-title"
        editable={editable}
        onChange={(v) => onUpdate?.({ ...slide, title: v })}
      />
      {slide.subtitle && (
        <EditableText
          value={slide.subtitle}
          tag="p"
          className="slide-subtitle"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
        />
      )}
    </div>
  )
}
