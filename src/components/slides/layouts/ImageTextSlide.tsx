'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, BodyContent, SlideImage } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
  imagePosition: 'left' | 'right'
}

export function ImageTextSlide({ slide, editable, onUpdate, imagePosition }: Props) {
  const paragraphBlocks = (slide.body || [])
    .map((block) => {
      if (block.type === 'paragraph' && block.text?.trim()) return block.text.trim()
      if (block.type === 'bullet' && block.items?.length) return block.items.filter(Boolean).join('\n')
      return ''
    })
    .filter(Boolean)

  const imageEl = (
    <div className="slide-image-wrapper">
      <SlideImage src={slide.image?.url} alt={slide.image?.alt || ''} />
    </div>
  )

  const textEl = (
    <div className="slide-text-content">
      <EditableText
        value={slide.title}
        tag="h2"
        className="slide-title"
        editable={editable}
        onChange={(v) => onUpdate?.({ ...slide, title: v })}
      />
      {paragraphBlocks.length > 0 ? <BodyContent body={slide.body} /> : null}
    </div>
  )

  return (
    <div className="slide-card-inner">
      {imagePosition === 'left' ? (
        <>
          {imageEl}
          {textEl}
        </>
      ) : (
        <>
          {textEl}
          {imageEl}
        </>
      )}
    </div>
  )
}
