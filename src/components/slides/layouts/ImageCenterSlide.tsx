'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, SlideImage } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function ImageCenterSlide({ slide, editable, onUpdate }: Props) {
  const paragraphText = (slide.body || [])
    .flatMap((block) => {
      if (block.type === 'paragraph' && block.text) return [block.text]
      if (block.type === 'bullet' && block.items) return block.items
      return []
    })
    .filter((text) => text.trim())
    .join(' ')

  const description = paragraphText

  return (
    <div className="slide-card-inner image-center-aether-shell">
      <div className="image-center-aether-visual">
        <div className="slide-image-wrapper image-center-aether-image">
          <SlideImage src={slide.image?.url} alt={slide.image?.alt || ''} />
        </div>
      </div>

      <div className="image-center-aether-text">
        <EditableText
          value={slide.title}
          tag="h2"
          className="image-center-aether-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
        {description ? (
          <EditableText
            value={description}
            tag="p"
            className="image-center-aether-description"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, body: [{ type: 'paragraph', text: v }] })}
          />
        ) : null}
      </div>
    </div>
  )
}
