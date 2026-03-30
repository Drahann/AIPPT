'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function CardsSplitSlide({ slide, editable, onUpdate }: Props) {
  const cards = (slide.cards || []).slice(0, 5)
  const rowCount = Math.min(5, Math.max(3, cards.length || 3))

  return (
    <div className="slide-card-inner cards-split-feature-shell">
      <div className="cards-split-feature-side">
        <EditableText
          value={slide.title}
          tag="h2"
          className="cards-split-feature-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
        {slide.subtitle ? (
          <EditableText
            value={slide.subtitle}
            tag="p"
            className="cards-split-feature-subtitle"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
          />
        ) : null}
      </div>

      <div className={`cards-split-feature-list cards-split-feature-list--rows-${rowCount}`}>
        {cards.map((card, i) => (
          <div key={i} className="cards-split-feature-row">
            <div className="cards-split-feature-image-wrap">
              {card.image?.url ? (
                <img src={card.image.url} alt={card.heading} className="cards-split-feature-image" />
              ) : (
                <div className="cards-split-feature-image cards-split-feature-image--placeholder" />
              )}
            </div>
            <div className="cards-split-feature-copy">
              <EditableText
                value={card.heading}
                tag="h3"
                className="cards-split-feature-heading"
                editable={editable}
                onChange={(v) => {
                  const next = [...(slide.cards || [])]
                  if (!next[i]) return
                  next[i] = { ...next[i], heading: v }
                  onUpdate?.({ ...slide, cards: next })
                }}
              />
              <EditableText
                value={card.body}
                tag="p"
                className="cards-split-feature-body"
                editable={editable}
                onChange={(v) => {
                  const next = [...(slide.cards || [])]
                  if (!next[i]) return
                  next[i] = { ...next[i], body: v }
                  onUpdate?.({ ...slide, cards: next })
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
