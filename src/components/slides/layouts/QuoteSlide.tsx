'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, SlideFooter, getIconSvg } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function QuoteSlide({ slide, editable, onUpdate }: Props) {
  const cards = (slide.cards || []).slice(0, 5)

  return (
    <div className="slide-card-inner quote-multi-shell" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="flex-1 min-h-0 flex flex-col" style={{ padding: '1.25rem 1.45rem' }}>
        {slide.title && (
          <EditableText
            value={slide.title}
            tag="h2"
            className="slide-title"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, title: v })}
          />
        )}
        <div className={`quote-grid quote-grid--count-${cards.length}`}>
          {cards.map((card, i) => (
            <div key={i} className="quote-item">
              <div className="quote-avatar">
                {card.icon ? (
                   <div className="quote-avatar-image">{getIconSvg(card.icon)}</div>
                ) : (
                  <div className="quote-avatar-image shadow-inner bg-slate-100/50" />
                )}
              </div>
              <EditableText
                value={card.body}
                tag="p"
                className="quote-item-text"
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
                className="quote-item-attribution"
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
