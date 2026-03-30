'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function TimelineSlide({ slide, editable, onUpdate }: Props) {
  // Aetherfield style recommends 4 nodes for balance
  const events = slide.events?.slice(0, 4) || []

  return (
    <div className="slide-card-inner timeline-shell is-aether">
      <EditableText
        value={slide.title}
        tag="h2"
        className="slide-title"
        editable={editable}
        onChange={(v) => onUpdate?.({ ...slide, title: v })}
      />
      
      <div className="timeline-horizontal">
        {/* Main horizontal axis */}
        <div className="timeline-horizontal-line" />
        
        <div className="timeline-milestones">
          {events.map((event, i) => {
            const isTop = i % 2 === 0 // 0, 2 are top; 1, 3 are bottom
            
            return (
              <div key={i} className={`timeline-milestone ${isTop ? 'is-top' : 'is-bottom'}`}>
                {/* Main node dot on the axis - now the anchor */}
                <div className="timeline-tick" />
                
                {/* Vertical group: connector + content */}
                <div className="timeline-info-group">
                  <div className="timeline-connector" />
                  <div className="timeline-content">
                    <EditableText
                      value={event.date || event.title || (isTop ? 'Moment' : 'Occurrence')}
                      tag="div"
                      className="timeline-heading"
                      editable={editable}
                      onChange={(v) => {
                        const next = [...events]
                        next[i] = { ...next[i], title: v, date: v }
                        onUpdate?.({ ...slide, events: next })
                      }}
                    />
                    <EditableText
                      value={event.description || 'Bright and descriptive words, followed by an additional phrase of note.'}
                      tag="div"
                      className="timeline-description"
                      editable={editable}
                      onChange={(v) => {
                        const next = [...events]
                        next[i] = { ...next[i], description: v }
                        onUpdate?.({ ...slide, events: next })
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
          
          {events.length === 0 && (
            <div className="timeline-empty">Add timeline events to render milestones.</div>
          )}
        </div>
      </div>
    </div>
  )
}
