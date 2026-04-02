import { SlideContent } from '@/lib/types'
import { EditableText, SlideFooter } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function GridFeaturedSlide({ slide, editable, onUpdate }: Props) {
  const cards = slide.cards?.slice(0, 4) || []
  
  // Fill empty cards to maintain the 2x2 grid structure visually
  const displayCards = [...cards]
  while (displayCards.length < 4) {
    displayCards.push({ heading: '', body: '' })
  }

  return (
    <div className="slide-card-inner grid-2x2-featured-inner">
      {/* Left Panel: High Impact Title */}
      <div className="featured-side-panel">
        <EditableText
          value={slide.title}
          tag="h1"
          className="featured-side-title"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, title: v })}
        />
      </div>

      {/* Right Panel: 2x2 Feature Grid */}
      <div className="featured-grid-content">
        <div className="featured-grid-2x2">
          {displayCards.map((card, i) => (
            <div key={i} className={`featured-grid-item backdrop-blur ${!card.heading && !card.body ? 'is-empty' : ''}`}>
              <div className="grid-item-marker" />
              <div className="grid-item-header">
                <span className="grid-item-number">0{i + 1}</span>
              </div>
              <div className="grid-item-copy">
                <EditableText
                  value={card.heading || `Feature ${i + 1}`}
                  tag="div"
                  className="grid-item-heading"
                  editable={editable}
                  onChange={(v) => {
                    const next = [...(slide.cards || [])]
                    next[i] = { ...next[i], heading: v }
                    onUpdate?.({ ...slide, cards: next })
                  }}
                />
                <EditableText
                  value={card.body || ''}
                  tag="div"
                  className="grid-item-body"
                  editable={editable}
                  onChange={(v) => {
                    const next = [...(slide.cards || [])]
                    next[i] = { ...next[i], body: v }
                    onUpdate?.({ ...slide, cards: next })
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
