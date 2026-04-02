'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function Cards3StackSlide({ slide, editable, onUpdate }: Props) {
  // Figma 102:57 design uses 3 cards with vertical stacks and two-tone colors
  const cards = slide.cards?.slice(0, 3) || []
  const displayCards = [...cards]
  while (displayCards.length < 3) {
    displayCards.push({ heading: '', body: '' })
  }

  return (
    <div className="slide-card-inner">
      <div className="stack-hero">
        <div className="stack-capsule-wrapper">
          <EditableText
            value={slide.title || 'EXECUTIVE SUMMARY'}
            tag="div"
            className="stack-capsule-title"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, title: v })}
          />
        </div>
      </div>

      <div className="stack-grid">
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
            <div key={i} className={`stack-item backdrop-blur ${!card.heading && !card.body ? 'is-empty' : ''}`}>
              <div className="stack-item-header">
                <EditableText
                  value={card.heading || `Theme ${i + 1}`}
                  tag="div"
                  className="stack-item-kicker"
                  editable={editable}
                  onChange={(v) => {
                    const next = [...(slide.cards || [])]
                    next[i] = { ...next[i], heading: v }
                    onUpdate?.({ ...slide, cards: next })
                  }}
                />
              </div>
              <div className="stack-item-body-container">
                <EditableText
                  value={bodyPrimary}
                  tag="div"
                  className="stack-body-primary"
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
                  className="stack-body-secondary"
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
    </div>
  )
}
