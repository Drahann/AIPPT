'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, SlideFooter } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function MetricsRingsSlide({ slide, editable, onUpdate }: Props) {
  const items = (slide.metrics || []).slice(0, 3)
  const overline = slide.subtitle?.trim() || '数据支撑'

  return (
    <div className="slide-card-inner metrics-rings-shell" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="flex-1 min-h-0" style={{ padding: '1.85rem 2.2rem' }}>
        <div className="metrics-rings-header">
          <EditableText
            value={overline}
            tag="p"
            className="metrics-rings-overline"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
          />
          <EditableText
            value={slide.title}
            tag="h2"
            className="metrics-rings-title"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, title: v })}
          />
        </div>

        <div className="metrics-rings-grid">
          {items.map((metric, i) => (
            <div key={i} className="metrics-rings-item">
              <div className="metrics-rings-ring">
                <div className="metrics-rings-value">{metric.value}</div>
              </div>
              <div className="metrics-rings-label">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom descriptive body */}
        {slide.body && Array.isArray(slide.body) && slide.body.length > 0 && (
          <div className="metrics-rings-body">
            <EditableText
              value={slide.body.map((p: any) => p.text || '').join('\n')}
              tag="p"
              className="metrics-rings-body-text"
              editable={editable}
              onChange={(v) => onUpdate?.({ ...slide, body: [{ type: 'paragraph', text: v }] })}
            />
          </div>
        )}
      </div>
      <SlideFooter />
    </div>
  )
}

