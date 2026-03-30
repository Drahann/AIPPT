'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, getIconSvg, SlideFooter } from '../shared'

interface Props {
  slide: SlideContent
  columns: 2 | 3 | 4
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

function getCenteredHeader(slide: SlideContent) {
  return {
    serifLine: slide.subtitle?.trim() || '',
    sansLine: slide.title,
  }
}

export function CardsSlide({ slide, columns, editable, onUpdate }: Props) {
  const isCenteredCards = columns === 3
  const isDualMetric = columns === 2
  const header = getCenteredHeader(slide)

  return (
    <div 
      className={`slide-card-inner ${isCenteredCards ? 'cards-centered-shell' : ''} ${isDualMetric ? 'cards-dual-metric-shell' : ''}`}
      style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex-1 min-h-0 flex flex-col" style={{ padding: '2.6rem 3rem' }}>
        {isCenteredCards ? (
          <div className="cards-centered-header">
            {header.serifLine ? (
              <EditableText
                value={header.serifLine}
                tag="p"
                className="cards-centered-kicker"
                editable={editable}
                onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
              />
            ) : null}
            <EditableText
              value={header.sansLine}
              tag="h2"
              className="cards-centered-title"
              editable={editable}
              onChange={(v) => onUpdate?.({ ...slide, title: v })}
            />
          </div>
        ) : isDualMetric ? (
          <div className="cards-dual-metric-topbar">
            {slide.subtitle?.trim() ? (
              <EditableText
                value={slide.subtitle.trim()}
                tag="p"
                className="cards-dual-metric-kicker"
                editable={editable}
                onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
              />
            ) : null}
          </div>
        ) : (
          <EditableText
            value={slide.title}
            tag="h2"
            className="slide-title"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, title: v })}
          />
        )}
        <div 
          className={`slide-cards-grid ${isCenteredCards ? 'cards-centered-grid' : ''} ${isDualMetric ? 'cards-dual-metric-grid' : ''}`}
          style={isDualMetric ? { marginTop: '40px' } : {}}
        >
          {slide.cards?.map((card, i) => (
            <div key={i} className={`slide-card-item ${isCenteredCards ? 'cards-centered-item backdrop-blur' : ''} ${isDualMetric ? 'cards-dual-metric-item' : ''}`}>
              {isDualMetric ? (
                <>
                  <EditableText
                    value={card.heading}
                    tag="p"
                    className="cards-dual-metric-value"
                    editable={editable}
                    onChange={(v) => {
                      const next = [...(slide.cards || [])]
                      next[i] = { ...next[i], heading: v }
                      onUpdate?.({ ...slide, cards: next })
                    }}
                  />
                  <EditableText
                    value={card.body}
                    tag="p"
                    className="cards-dual-metric-description"
                    editable={editable}
                    onChange={(v) => {
                      const next = [...(slide.cards || [])]
                      next[i] = { ...next[i], body: v }
                      onUpdate?.({ ...slide, cards: next })
                    }}
                  />
                </>
              ) : (
                <>
                  {card.icon && (
                    <div className="card-icon">{getIconSvg(card.icon)}</div>
                  )}
                  <div className="card-heading">{card.heading}</div>
                  <div className="card-body">{card.body}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <SlideFooter />
    </div>
  )
}
