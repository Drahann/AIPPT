'use client'

import React from 'react'
import type { SlotDefinition } from './types'
import type { SlideContent } from '../types'

interface SlotRendererProps {
  slots: SlotDefinition[]
  slide: SlideContent
  assetBase: string
  themeDefaults: {
    fontHeading: string
    fontBody: string
    colorText: string
    colorTextSecondary: string
  }
  /** 自定义映射规则：slot.id → SlideContent 属性路径 */
  slotMapping?: Record<string, string>
}

/**
 * 渲染所有内容槽位。
 * 每个 slot 根据 id 约定自动从 SlideContent 获取数据。
 *
 * 三层渲染模型 — L2 内容层：
 * - 文字 slot 渲染为语义标签 <h1>/<h2>/<p>（快照友好）
 * - 叶子文字元素加 data-slot-id 标记
 * - 容器加 data-slot-container="true"（快照跳过容器）
 */
export function SlotRenderer({ slots, slide, assetBase, themeDefaults, slotMapping }: SlotRendererProps) {
  return (
    <>
      {slots.map((slot) => (
        <SlotItem
          key={slot.id}
          slot={slot}
          slide={slide}
          assetBase={assetBase}
          themeDefaults={themeDefaults}
          slotMapping={slotMapping}
        />
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// Slot Data Resolution — 根据 slot.id 从 SlideContent 提取数据
// ---------------------------------------------------------------------------

function resolveSlotData(
  slot: SlotDefinition,
  slide: SlideContent,
  slotMapping?: Record<string, string>
): string | undefined {
  // 1. 如果有显式 mapping, 优先使用
  const mappedPath = slotMapping?.[slot.id]
  if (mappedPath) {
    return getNestedValue(slide, mappedPath)
  }

  // 2. 按 slot.id 约定映射
  const id = slot.id

  // 基础字段
  if (id === 'title') return slide.title
  if (id === 'subtitle') return slide.subtitle || ''
  if (id === 'quote-text') return slide.quote?.text
  if (id === 'quote-attribution') return slide.quote?.attribution

  // body — 合并 body 数组为文本
  if (id === 'body') {
    if (!slide.body?.length) return ''
    return slide.body.map(b => {
      if (b.type === 'bullet' && b.items) {
        return b.items.map(item => `• ${item}`).join('\n')
      }
      return b.text || ''
    }).join('\n')
  }

  // cards — card-{n}, card-{n}-heading, card-{n}-body, card-{n}-icon
  const cardMatch = id.match(/^card-(\d+)(?:-(.+))?$/)
  if (cardMatch) {
    const idx = parseInt(cardMatch[1], 10)
    const field = cardMatch[2]
    const card = slide.cards?.[idx]
    if (!card) return undefined
    if (!field) return `${card.heading}\n${card.body}`
    if (field === 'heading') return card.heading
    if (field === 'body') return card.body
    if (field === 'icon') return card.icon
    if (field === 'secondary') return card.secondary
    return undefined
  }

  // metrics — metric-{n}-value, metric-{n}-label
  const metricMatch = id.match(/^metric-(\d+)-(.+)$/)
  if (metricMatch) {
    const idx = parseInt(metricMatch[1], 10)
    const field = metricMatch[2]
    const metric = slide.metrics?.[idx]
    if (!metric) return undefined
    if (field === 'value') return metric.value
    if (field === 'label') return metric.label
    return undefined
  }

  // events — event-{n}-date, event-{n}-title, event-{n}-description
  const eventMatch = id.match(/^event-(\d+)-(.+)$/)
  if (eventMatch) {
    const idx = parseInt(eventMatch[1], 10)
    const field = eventMatch[2]
    const event = slide.events?.[idx]
    if (!event) return undefined
    if (field === 'date') return event.date
    if (field === 'title') return event.title
    if (field === 'description') return event.description
    return undefined
  }

  // comparison — left-heading, left-items/left-body, right-heading, right-items/right-body
  if (id === 'left-heading') return slide.left?.heading
  if (id === 'left-items' || id === 'left-body') return slide.left?.items?.map(i => `• ${i}`).join('\n')
  if (id === 'right-heading') return slide.right?.heading
  if (id === 'right-items' || id === 'right-body') return slide.right?.items?.map(i => `• ${i}`).join('\n')

  // image
  if (id === 'image') return slide.image?.url

  return undefined
}

/** 从对象中按点分路径取值：'quote.text' → obj.quote.text */
function getNestedValue(obj: any, path: string): string | undefined {
  const parts = path.split('.')
  let current = obj
  for (const part of parts) {
    if (current == null) return undefined
    // 支持数组索引：cards.0.heading
    const idx = parseInt(part, 10)
    if (!isNaN(idx) && Array.isArray(current)) {
      current = current[idx]
    } else {
      current = current[part]
    }
  }
  return typeof current === 'string' ? current : current?.toString()
}

// ---------------------------------------------------------------------------
// Semantic Tag Helper — 根据 slot.id 决定使用哪种 HTML 标签
// ---------------------------------------------------------------------------

function getSemanticTag(slotId: string): 'h1' | 'h2' | 'p' {
  if (slotId === 'title') return 'h1'
  if (slotId === 'subtitle' || slotId.includes('heading')) return 'h2'
  return 'p'
}

// ---------------------------------------------------------------------------
// Slot Item — 单个槽位的渲染
// ---------------------------------------------------------------------------

interface SlotItemProps {
  slot: SlotDefinition
  slide: SlideContent
  assetBase: string
  themeDefaults: {
    fontHeading: string
    fontBody: string
    colorText: string
    colorTextSecondary: string
  }
  slotMapping?: Record<string, string>
}

function SlotItem({ slot, slide, assetBase, themeDefaults, slotMapping }: SlotItemProps) {
  const data = resolveSlotData(slot, slide, slotMapping)

  // hideIfEmpty
  if (slot.hideIfEmpty && (!data || data.trim() === '')) return null

  const isHeading = slot.id.includes('title') || slot.id.includes('heading')

  const basePosition: React.CSSProperties = {
    position: 'absolute',
    left: slot.x,
    top: slot.y,
    width: slot.w,
    height: slot.h,
    opacity: slot.opacity ?? 1,
    zIndex: slot.zIndex ?? 1,
  }

  switch (slot.type) {
    case 'text': {
      // 估算文字内容长度，对长文本自动缩小字号
      const baseFontSize = slot.fontSize || (isHeading ? 60 : 32)
      const textLen = (data || '').length
      const slotArea = slot.w * slot.h
      // 简单启发式：如果文字估算面积超过 slot 面积，缩小字号
      const estimatedArea = textLen * baseFontSize * baseFontSize * (slot.lineHeight || 1.2) * 0.6
      let fontSize = baseFontSize
      if (estimatedArea > slotArea && textLen > 10) {
        const ratio = Math.sqrt(slotArea / estimatedArea)
        fontSize = Math.max(Math.floor(baseFontSize * ratio), isHeading ? 28 : 18)
      }

      const SemanticTag = getSemanticTag(slot.id)

      const textStyle: React.CSSProperties = {
        ...basePosition,
        fontFamily: slot.fontFamily || (isHeading ? themeDefaults.fontHeading : themeDefaults.fontBody),
        fontSize,
        fontWeight: slot.fontWeight || (isHeading ? 700 : 400),
        fontStyle: slot.fontStyle || 'normal',
        color: slot.color || (isHeading ? themeDefaults.colorText : themeDefaults.colorText),
        textAlign: slot.align || 'left',
        lineHeight: slot.lineHeight || (isHeading ? 1.1 : 1.35),
        letterSpacing: slot.letterSpacing,
        textTransform: slot.textTransform as any,
        display: 'flex',
        alignItems: slot.valign === 'middle' ? 'center' : slot.valign === 'bottom' ? 'flex-end' : 'flex-start',
        wordBreak: 'break-word',
        overflow: 'hidden',
        // Container styles
        backgroundColor: slot.background,
        borderRadius: slot.borderRadius,
        border: slot.border,
        padding: slot.padding,
        // 渲染为 margin:0 以重置语义标签的默认样式
        margin: 0,
      }

      // 多行文本需要保留换行 — 使用语义标签直接输出
      const lines = (data || '').split('\n')
      return (
        <SemanticTag
          style={textStyle}
          data-slot-id={slot.id}
        >
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </SemanticTag>
      )
    }

    case 'image': {
      const imageUrl = data || slide.image?.url
      if (!imageUrl) return null
      const imgSrc =
        imageUrl.startsWith('http') || imageUrl.startsWith('data:')
          ? imageUrl
          : `${assetBase}${imageUrl}`

      const containerStyle: React.CSSProperties = {
        ...basePosition,
        backgroundColor: slot.background,
        borderRadius: slot.borderRadius,
        border: slot.border,
        padding: slot.padding,
        overflow: 'hidden',
      }

      return (
        <div style={containerStyle} data-slot-id={slot.id}>
          <img
            src={imgSrc}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: slot.objectFit || 'cover',
              borderRadius: slot.borderRadius,
            }}
          />
        </div>
      )
    }

    case 'container': {
      // 复合容器：渲染子 slots — 标记为 data-slot-container 供快照跳过
      if (!slot.children?.length) return null

      const containerStyle: React.CSSProperties = {
        ...basePosition,
        backgroundColor: slot.background,
        borderRadius: slot.borderRadius,
        border: slot.border,
        padding: slot.padding,
        overflow: 'hidden',
      }

      return (
        <div style={containerStyle} data-slot-container="true" data-slot-id={slot.id}>
          {slot.children.map((child) => (
            <SlotItem
              key={child.id}
              slot={{
                ...child,
                // 子 slot 的坐标是相对于父容器的
                x: child.x,
                y: child.y,
              }}
              slide={slide}
              assetBase={assetBase}
              themeDefaults={themeDefaults}
              slotMapping={slotMapping}
            />
          ))}
        </div>
      )
    }

    case 'icon': {
      // 图标渲染 — 通过 slot data 获取图标名或 SVG 路径
      const iconData = data
      if (!iconData) return null

      const containerStyle: React.CSSProperties = {
        ...basePosition,
        backgroundColor: slot.background,
        borderRadius: slot.borderRadius,
        border: slot.border,
        padding: slot.padding,
        overflow: 'hidden',
      }

      if (iconData.startsWith('<svg') || iconData.startsWith('http') || iconData.startsWith('data:')) {
        if (iconData.startsWith('<svg')) {
          return <div style={containerStyle} data-slot-id={slot.id} dangerouslySetInnerHTML={{ __html: iconData }} />
        }
        return (
          <div style={containerStyle} data-slot-id={slot.id}>
            <img src={iconData} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        )
      }
      // 纯文本图标（如 emoji 或字符）
      return (
        <div style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: slot.fontSize || 40,
          fontFamily: slot.fontFamily || themeDefaults.fontBody,
          color: slot.color || themeDefaults.colorText,
        }} data-slot-id={slot.id}>
          {iconData}
        </div>
      )
    }

    case 'chart': {
      // Chart slot — 需要复用现有 ChartSlide 逻辑
      // 暂时渲染为占位符，后续可以接入

      const containerStyle: React.CSSProperties = {
        ...basePosition,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: themeDefaults.colorTextSecondary,
        fontSize: 20,
        fontFamily: themeDefaults.fontBody,
        overflow: 'hidden',
      }

      return (
        <p style={containerStyle} data-slot-id={slot.id}>
          [Chart: {slide.chart?.title || 'No data'}]
        </p>
      )
    }

    default:
      return null
  }
}
