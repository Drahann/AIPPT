'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function ListFeaturedSlide({ slide, editable, onUpdate }: Props) {
  const itemCount = Math.min(slide.cards?.length || 0, 8)
  const isFewMode = itemCount > 0 && itemCount <= 5
  const isDense = itemCount >= 7
  const rowsClass = isFewMode
    ? itemCount >= 5
      ? 'corporate-insights-grid--rows-5'
      : itemCount === 4
        ? 'corporate-insights-grid--rows-4'
        : 'corporate-insights-grid--rows-3'
    : itemCount > 6
      ? 'corporate-insights-grid--rows-4'
      : 'corporate-insights-grid--rows-3'
  const metaLabel = slide.subtitle?.trim() || ''

  return (
    <div className="slide-card-inner corporate-insights-frame">
      <div className="corporate-insights-topbar">
        <span className="corporate-insights-topbar-item" />
        <EditableText
          value={metaLabel}
          tag="p"
          className="corporate-insights-topbar-item corporate-insights-topbar-item--center"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
        />
        <span className="corporate-insights-topbar-item corporate-insights-topbar-item--right" />
      </div>
      <div className="corporate-insights-shell">
        <div className="corporate-insights-panel corporate-insights-panel--headline">
          <EditableText
            value={slide.title}
            tag="h2"
            className="corporate-insights-title"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, title: v })}
          />
        </div>
        <div className="corporate-insights-panel corporate-insights-panel--matrix">
          <div
            className={`corporate-insights-grid ${
              isFewMode ? 'corporate-insights-grid--single corporate-insights-grid--few' : 'corporate-insights-grid--double corporate-insights-grid--matrix'
            } ${isDense ? 'corporate-insights-grid--dense' : ''} ${rowsClass}`}
          >
            {slide.cards?.slice(0, 8).map((card, i) => (
              <div key={i} className="corporate-insight-item">
                <div className="corporate-insight-dot" />
                <div className="corporate-insight-content">
                  <div className="corporate-insight-heading">{card.heading}</div>
                  <div className="corporate-insight-body">{card.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
