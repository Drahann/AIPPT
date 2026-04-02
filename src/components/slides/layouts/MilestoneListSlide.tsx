'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'
import type { CSSProperties } from 'react'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function MilestoneListSlide({ slide, editable, onUpdate }: Props) {
  const items = (slide.events || []).slice(0, 6)
  const rowCount = Math.max(1, items.length || 1)
  const denseClass = rowCount >= 5 ? 'milestone-list-rows--dense' : ''

  const updateItem = (index: number, field: 'date' | 'description', value: string) => {
    const nextEvents = [...(slide.events || [])]
    if (!nextEvents[index]) {
      nextEvents[index] = { date: '', title: '', description: '' }
    }
    nextEvents[index] = { ...nextEvents[index], [field]: value }
    onUpdate?.({ ...slide, events: nextEvents })
  }

  return (
    <div className="slide-card-inner milestone-list-shell">
      <div className="milestone-list-accent">
        {slide.subtitle?.trim() ? (
          <EditableText
            value={slide.subtitle.trim()}
            tag="p"
            className="milestone-list-kicker"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
          />
        ) : null}
        <EditableText
          value={slide.title}
          tag="h2"
          className="milestone-list-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
      </div>

      <div className="milestone-list-content">
        <div
          className={`milestone-list-rows ${denseClass}`}
          style={{ '--milestone-rows': rowCount } as CSSProperties}
        >
          {items.map((item, index) => (
            <div key={index} className="milestone-list-row">
              <EditableText
                value={item.date || item.title || `${2022 + index}`}
                tag="p"
                className="milestone-list-year"
                editable={editable}
                onChange={(v) => updateItem(index, 'date', v)}
              />
              <EditableText
                value={item.description || item.title || ''}
                tag="p"
                className="milestone-list-description"
                editable={editable}
                onChange={(v) => updateItem(index, 'description', v)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
