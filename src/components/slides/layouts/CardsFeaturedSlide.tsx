'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, SlideFooter } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function CardsFeaturedSlide({ slide, editable, onUpdate }: Props) {
  // Figma 96:45 design uses 4 cards with vertical dividers
  const index = slide.index || 0
  const cards = slide.cards?.slice(0, 4) || []

  return (
    <div className="slide-card-inner layout-cards-4-featured">
      <div className="cards-featured-top-bar">
        <div className="project-name">AIPPT-FEATURED</div>
        <div className="top-hr" />
        <div className="page-number">{index + 1}</div>
      </div>

      <div className="cards-featured-hero">
        <EditableText
          value={slide.title || 'Next Steps'}
          tag="div"
          className="cards-featured-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
      </div>

      <div className="cards-featured-grid">
        {[0, 1, 2, 3].map((i) => {
          const card = cards[i]
          return (
            <div key={i} className={`cards-featured-item-outer ${!card ? 'is-empty' : ''}`}>
              <div className="cards-featured-divider">
                <div className="cards-featured-marker" />
              </div>
              <div className="cards-featured-item backdrop-blur">
                <EditableText
                  value={card?.heading || `Step ${i + 1}`}
                  tag="div"
                  className="cards-featured-heading"
                  editable={editable}
                  onChange={(v) => {
                    const next = [...(slide.cards || [])]
                    next[i] = { ...next[i], heading: v }
                    onUpdate?.({ ...slide, cards: next })
                  }}
                />
                <EditableText
                  value={card?.body || ''}
                  tag="div"
                  className="cards-featured-body"
                  editable={editable}
                  onChange={(v) => {
                    const next = [...(slide.cards || [])]
                    next[i] = { ...next[i], body: v }
                    onUpdate?.({ ...slide, cards: next })
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
