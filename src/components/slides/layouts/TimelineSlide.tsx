'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function TimelineSlide({ slide, editable, onUpdate }: Props) {
  const events = slide.events || []
  // Use N+1 slots to ensure exactly one slot of whitespace on the right (Figma style)
  const totalSlots = events.length + 1
  const slots = Array.from({ length: totalSlots }).map((_, i) => events[i])

  return (
    <div 
      className="slide-card-inner timeline-shell is-aether"
      style={{ '--interval-count': events.length } as any}
    >
      <div className="timeline-header-group">
        <EditableText
          value={slide.title || 'CAPTION'}
          tag="div"
          className="timeline-caption"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
      </div>
      
      <div className="timeline-horizontal">
        <div className="timeline-horizontal-line">
          <svg className="timeline-arrow" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,0 14,7 0,14" fill="var(--color-primary, #3b82f6)" opacity="0.4" />
          </svg>
        </div>
        
        <div className="timeline-milestones">
          {slots.map((item, i) => {
            const isTop = i % 2 === 0
            if (!item) {
              return <div key={`slot-${i}`} className="timeline-milestone is-empty" />
            }
            
            return (
              <div key={i} className={`timeline-milestone ${isTop ? 'is-top' : 'is-bottom'}`}>
                <div className="timeline-tick" />
                <div className="timeline-info-group">
                  <div className="timeline-connector" />
                  <div className="timeline-content">
                    <EditableText
                      value={item.date || item.title || `0${i + 1}`}
                      tag="div"
                      className="timeline-heading"
                      editable={editable}
                      onChange={(v) => {
                        const next = [...(slide.events || [])]
                        next[i] = { ...next[i], title: v, date: v }
                        onUpdate?.({ ...slide, events: next })
                      }}
                    />
                    <EditableText
                      value={item.description || ''}
                      tag="div"
                      className="timeline-description"
                      editable={editable}
                      onChange={(v) => {
                        const next = [...(slide.events || [])]
                        next[i] = { ...next[i], description: v }
                        onUpdate?.({ ...slide, events: next })
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
