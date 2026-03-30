'use client'

import { SlideContent } from '@/lib/types'
import React, { useCallback, useState, useEffect } from 'react'
import iconMap from '@/lib/icons/map.json'

interface EditableTextProps {
  value: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  editable?: boolean
  onChange?: (value: string) => void
  placeholder?: string
}

export function EditableText({
  value,
  className = '',
  tag: Tag = 'div',
  editable = false,
  onChange,
  placeholder = '请输入内容...',
}: EditableTextProps) {
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      if (onChange) {
        onChange(e.currentTarget.textContent || '')
      }
    },
    [onChange]
  )

  return (
    <Tag
      className={className}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={handleBlur}
      data-placeholder={placeholder}
    >
      {value}
    </Tag>
  )
}

interface SlideImageProps {
  src?: string
  alt: string
  className?: string
}

export function SlideImage({ src, alt, className = '' }: SlideImageProps) {
  if (!src) {
    return (
      <div className={`slide-image-placeholder ${className}`}>
        <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)] opacity-50">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="mt-2 text-sm">{alt}</span>
        </div>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />
}

interface BodyContentProps {
  body?: SlideContent['body']
  className?: string
}

export function BodyContent({ body, className = '' }: BodyContentProps) {
  if (!body || body.length === 0) return null

  return (
    <div className={`slide-body ${className}`}>
      {body.map((block, i) => {
        if (block.type === 'bullet' && block.items) {
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )
        }
        return <p key={i}>{block.text}</p>
      })}
    </div>
  )
}

export function getIconSvg(iconName?: string) {
  return <DynamicIcon name={iconName} />
}

export function DynamicIcon({ name }: { name?: string }) {
  const [svgStr, setSvgStr] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const target = (name || 'star').replace('-line', '').replace('-fill', '').toLowerCase()
    const map = iconMap as Record<string, string>
    const path = map[target] || map['star']
    if (path) {
      fetch(`/remixicons/${path}`)
        .then(r => r.text())
        .then(txt => {
          if (active) setSvgStr(txt)
        })
        .catch(console.error)
    }
    return () => { active = false }
  }, [name])

  if (!svgStr) return <span style={{ display: 'inline-block', width: '24px', height: '24px', opacity: 0 }} />
  
  return (
    <span 
      className="remix-icon-wrapper block [&>svg]:w-full [&>svg]:h-full"
      dangerouslySetInnerHTML={{ __html: svgStr }} 
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
    />
  )
}
export function SlideFooter() {
  return (
    <div className="overview-intro-footer">
      <div className="overview-intro-logo">HIT</div>
      <div className="overview-intro-company">Company Name</div>
    </div>
  )
}
