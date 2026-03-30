'use client'

import { SlideContent } from '@/lib/types'
import { EditableText } from '../shared'
import type { CSSProperties } from 'react'

interface Props {
  slide: SlideContent
  editable?: boolean
  onUpdate?: (slide: SlideContent) => void
}

export function TextBulletsSlide({ slide, editable, onUpdate }: Props) {
  const bullets = (slide.body || []).flatMap((block) => {
    if (block.type === 'bullet' && block.items) return block.items
    if (block.type === 'paragraph' && block.text) return [block.text]
    return []
  })

  const fallback = [
    'Add a quick description of the highlight or lowlight here.',
    'Make sure to provide enough context to make it easy to understand.',
    'Keep each point short and direct for easy scanning.',
    'Include links to docs or files where people can learn more.',
    'If you have many points, use multiple copies of this slide.',
    'If you only have a few points, remove rows you do not need.',
  ]

  const displayItems = (bullets.length > 0 ? bullets : fallback).slice(0, 8)

  const updateBulletAt = (index: number, value: string) => {
    const current = [...displayItems]
    current[index] = value
    onUpdate?.({ ...slide, body: [{ type: 'bullet', items: current }] })
  }

  return (
    <div className="slide-card-inner text-bullets-structured-shell">
      <EditableText
        value={slide.title}
        tag="h2"
        className="text-bullets-structured-title"
        editable={editable}
        onChange={(v) => onUpdate?.({ ...slide, title: v })}
      />

      <div
        className={`text-bullets-structured-table ${displayItems.length >= 8 ? 'is-dense' : ''}`}
        style={{ '--tb-rows': displayItems.length } as CSSProperties}
      >
        <div className="text-bullets-structured-topline" />
        {displayItems.map((item, index) => (
          <div key={index} className="text-bullets-structured-row">
            <span className="text-bullets-structured-index">{index + 1}</span>
            <EditableText
              value={item}
              tag="p"
              className="text-bullets-structured-description"
              editable={editable}
              onChange={(v) => updateBulletAt(index, v)}
            />
          </div>
        ))}
      </div>

      <div className="text-bullets-structured-footer">
        <span className="text-bullets-structured-footer-left">Business Review</span>
        <EditableText
          value={slide.subtitle?.trim() || "Today's Date"}
          tag="span"
          className="text-bullets-structured-footer-right"
          editable={editable}
          onChange={(v) => onUpdate?.({ ...slide, subtitle: v })}
        />
      </div>
    </div>
  )
}
