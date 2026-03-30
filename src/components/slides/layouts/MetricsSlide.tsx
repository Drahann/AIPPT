'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function MetricsSlide({ slide, editable, onUpdate }: Props) {
  const items = (slide.metrics || []).slice(0, 6)
  const summaryFromBody = slide.body?.find((block) => block.type === 'paragraph')?.text || ''
  const summary = slide.subtitle || summaryFromBody
  const isThreeRows = items.length > 4

  return (
    <div className="slide-card-inner metrics-overview-shell">
      <div className="metrics-overview-left">
        <EditableText
          value={slide.title}
          tag="h2"
          className="metrics-overview-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
        {summary ? (
          <EditableText
            value={summary}
            tag="p"
            className="metrics-overview-summary"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
          />
        ) : null}
      </div>

      <div className={`metrics-overview-grid ${isThreeRows ? 'metrics-overview-grid--rows-3' : 'metrics-overview-grid--rows-2'}`}>
        {items.map((metric, i) => {
          const isFiveTail = items.length === 5 && i === 4
          return (
            <div key={i} className={`metrics-overview-item ${isFiveTail ? 'metrics-overview-item--wide' : ''}`}>
              <div className="metrics-overview-value">{metric.value}</div>
              <div className="metrics-overview-label">{metric.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
