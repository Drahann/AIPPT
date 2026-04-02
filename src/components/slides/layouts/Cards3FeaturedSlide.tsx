import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function Cards3FeaturedSlide({ slide, editable, onUpdate }: Props) {
  const cards = slide.cards?.slice(0, 3) || []
  
  // Ensure we have 3 slots for the layout
  const displayCards = [...cards]
  while (displayCards.length < 3) {
    displayCards.push({ heading: '', body: '' })
  }

  return (
    <div className="slide-card-inner cards-3-featured-inner">
      <div className="cards-3-featured-hero">
        <EditableText
          value={slide.title || 'Course Outline'}
          tag="h1"
          className="cards-3-featured-main-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
        {/* Figma 99:54 - Decorative Accent (SVG) */}
        <svg className="cards-3-featured-accent-circle" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="var(--color-primary)"/>
        </svg>
      </div>

      <div className="cards-3-featured-grid">
        {displayCards.map((card, i) => {
          // Primary: explicit secondary field first; fallback to \n\n split
          let bodyPrimary = card.body || ''
          let bodySecondary = card.secondary || ''
          if (!bodySecondary && bodyPrimary.includes('\n\n')) {
            const parts = bodyPrimary.split('\n\n')
            bodyPrimary = parts[0]
            bodySecondary = parts.slice(1).join('\n\n')
          }
          
          return (
            <div key={i} className={`cards-3-featured-item backdrop-blur ${!card.heading && !card.body ? 'is-empty' : ''}`}>
              <div className="featured-card-header">
                <EditableText
                  value={card.heading || `Week ${i + 1}`}
                  tag="div"
                  className="featured-card-title"
                  editable={editable}
                  onChange={(v) => {
                    const next = [...(slide.cards || [])]
                    next[i] = { ...next[i], heading: v }
                    onUpdate?.({ ...slide, cards: next })
                  }}
                />
              </div>
              <div className="featured-card-body-container">
                <EditableText
                  value={bodyPrimary}
                  tag="div"
                  className="featured-card-body-primary"
                  editable={editable}
                  onChange={(v) => {
                    const next = [...(slide.cards || [])]
                    const rest = card.body?.split('\n\n').slice(1).join('\n\n') || ''
                    next[i] = { ...next[i], body: v + (rest ? '\n\n' + rest : '') }
                    onUpdate?.({ ...slide, cards: next })
                  }}
                />
                <EditableText
                  value={bodySecondary}
                  tag="div"
                  className="featured-card-body-secondary"
                  editable={editable}
                  onChange={(v) => {
                    const next = [...(slide.cards || [])]
                    const first = card.body?.split('\n\n')[0] || ''
                    next[i] = { ...next[i], body: first + '\n\n' + v }
                    onUpdate?.({ ...slide, cards: next })
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Note: No SlideFooter per user experience summary */}
    </div>
  )
}
