'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, getIconSvg } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function StaggeredCardsSlide({ slide, editable, onUpdate }: Props) {
  const serifLine = slide.subtitle?.trim() || ''
  const cards = (slide.cards || []).slice(0, 3)

  return (
    <div className="slide-card-inner cards-centered-shell">
      <div className="cards-centered-header">
        {serifLine ? (
          <EditableText
            value={serifLine}
            tag="p"
            className="cards-centered-kicker"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
          />
        ) : null}
        <EditableText
          value={slide.title}
          tag="h2"
          className="cards-centered-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
      </div>
      <div className="slide-cards-grid cards-centered-grid staggered-centered-grid">
        {cards.map((card, i) => (
          <div key={i} className="slide-card-item cards-centered-item backdrop-blur">
            {card.icon && (
              <div className="card-icon">{getIconSvg(card.icon)}</div>
            )}
            <div className="card-heading">{card.heading}</div>
            <div className="card-body">{(card.body || '').split('\n').map((line, li) => {
                    const formatted = line.replace(/^- /, '• ')
                    return <span key={li}>{li > 0 && <br/>}{formatted}</span>
                  })}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
