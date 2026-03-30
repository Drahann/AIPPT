'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, SlideFooter } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function QuoteNoAvatarSlide({ slide, editable, onUpdate }: Props) {
  const cards = (slide.cards || []).slice(0, 5)

  return (
    <div className="slide-card-inner quote-no-avatar-shell" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="flex-1 min-h-0 flex flex-col" style={{ padding: '1.35rem 1.5rem' }}>
        {slide.title && (
          <EditableText
            value={slide.title}
            tag="h2"
            className="slide-title"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, title: v })}
          />
        )}
        <div className={`quote-no-avatar-grid quote-no-avatar-grid--count-${cards.length}`}>
          {cards.map((card, i) => (
            <div key={i} className="quote-no-avatar-item">
              <EditableText
                value={card.body}
                tag="p"
                className="quote-no-avatar-text"
                editable={editable}
                onChange={(v) => {
                  const next = [...(slide.cards || [])]
                  next[i] = { ...next[i], body: v }
                  onUpdate?.({ ...slide, cards: next })
                }}
              />
              <EditableText
                value={card.heading}
                tag="p"
                className="quote-no-avatar-attribution"
                editable={editable}
                onChange={(v) => {
                  const next = [...(slide.cards || [])]
                  next[i] = { ...next[i], heading: v }
                  onUpdate?.({ ...slide, cards: next })
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <SlideFooter />
    </div>
  )
}
