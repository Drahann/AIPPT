'use client'

import { SlideContent } from '@/lib/types'
import { EditableText, SlideFooter, getIconSvg } from '../shared'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function ComparisonSlide({ slide, editable, onUpdate }: Props) {
  const leftItems = slide.left?.items || []
  const rightItems = slide.right?.items || []
  const leftHeading = slide.left?.heading || '左侧标题'
  const rightHeading = slide.right?.heading || '右侧标题'

  const renderCard = (
    heading: string,
    items: string[],
    isNegative: boolean,
    onHeadingChange: (v: string) => void,
    onItemsChange: (v: string[]) => void
  ) => {
    return (
      <div className={`comparison-contrast-card backdrop-blur comparison-contrast-card--${isNegative ? 'negative' : 'positive'}`}>
        <div className="comparison-contrast-accent" />
        <div className="comparison-contrast-heading-row">
          <span className="comparison-contrast-heading-icon">
            {getIconSvg(isNegative ? 'close-circle' : 'checkbox-circle')}
          </span>
          <EditableText 
            value={heading} 
            editable={editable} 
            onChange={onHeadingChange} 
            className="comparison-contrast-heading" 
          />
        </div>
        <div className="comparison-contrast-list">
          {items.map((text, i) => (
            <div key={i} className="comparison-contrast-item">
              <span className={`comparison-contrast-dot ${text.startsWith('!') ? 'is-highlight' : ''}`} />
              <EditableText
                value={text.startsWith('!') ? text.substring(1) : text}
                editable={editable}
                onChange={(v) => {
                  const next = [...items]
                  next[i] = text.startsWith('!') ? '!' + v : v
                  onItemsChange(next)
                }}
                className="comparison-contrast-text"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="slide-card-inner comparison-contrast-shell" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="flex-1 min-h-0" style={{ padding: '1.25rem 1.45rem' }}>
        <div className="comparison-contrast-header">
          <EditableText
            value={slide.title}
            tag="h2"
            className="comparison-contrast-title"
            editable={editable}
            onChange={(v) => onUpdate?.({ ...slide, title: v })}
          />
          {slide.subtitle && (
            <EditableText
              value={slide.subtitle}
              tag="p"
              className="comparison-contrast-subtitle"
              editable={editable}
              onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
            />
          )}
        </div>

        <div className="comparison-contrast-grid">
          <div className="comparison-contrast-column">
            {renderCard(
              leftHeading,
              leftItems,
              slide.left?.tone === 'negative',
              (v) => onUpdate?.({ ...slide, left: { ...slide.left!, heading: v } }),
              (v) => onUpdate?.({ ...slide, left: { ...slide.left!, items: v } })
            )}
          </div>
          <div className="comparison-contrast-column">
            {renderCard(
              rightHeading,
              rightItems,
              slide.right?.tone === 'negative',
              (v) => onUpdate?.({ ...slide, right: { ...slide.right!, heading: v } }),
              (v) => onUpdate?.({ ...slide, right: { ...slide.right!, items: v } })
            )}
          </div>
        </div>
      </div>
      <SlideFooter />
    </div>
  )
}
