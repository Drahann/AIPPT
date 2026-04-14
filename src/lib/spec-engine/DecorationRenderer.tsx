'use client'

import React from 'react'
import type { DecorationElement } from './types'

interface DecorationRendererProps {
  decorations: DecorationElement[]
  assetBase: string
}

/**
 * 渲染所有装饰元素。
 * 每个装饰元素都是一个绝对定位的 div/img/svg。
 *
 * 三层渲染模型 — L1 装饰层：
 * - 所有元素标记 data-decoration="true"
 * - 快照采集时对装饰元素保留负坐标（不过滤）
 */
export function DecorationRenderer({ decorations, assetBase }: DecorationRendererProps) {
  return (
    <>
      {decorations.map((dec, i) => (
        <DecorationItem key={i} decoration={dec} assetBase={assetBase} />
      ))}
    </>
  )
}

function DecorationItem({ decoration: dec, assetBase }: { decoration: DecorationElement; assetBase: string }) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: dec.x,
    top: dec.y,
    width: dec.w,
    height: dec.h,
    opacity: dec.opacity ?? 1,
    zIndex: dec.zIndex ?? 0,
    transform: dec.rotate ? `rotate(${dec.rotate}deg)` : undefined,
    mixBlendMode: dec.mixBlendMode as any,
    pointerEvents: 'none',
  }

  switch (dec.type) {
    case 'rect':
      return (
        <div
          data-decoration="true"
          style={{
            ...baseStyle,
            backgroundColor: dec.fill,
            border: dec.stroke ? `${dec.strokeWidth || 1}px solid ${dec.stroke}` : undefined,
            borderRadius: dec.borderRadius,
            boxShadow: dec.shadow,
          }}
        />
      )

    case 'ellipse':
      return (
        <div
          data-decoration="true"
          style={{
            ...baseStyle,
            backgroundColor: dec.fill,
            border: dec.stroke ? `${dec.strokeWidth || 1}px solid ${dec.stroke}` : undefined,
            borderRadius: '50%',
            boxShadow: dec.shadow,
          }}
        />
      )

    case 'line':
      return (
        <div
          data-decoration="true"
          style={{
            ...baseStyle,
            height: dec.strokeWidth || 1,
            backgroundColor: dec.stroke || dec.fill || '#000',
          }}
        />
      )

    case 'image': {
      const src = dec.src
        ? dec.src.startsWith('http') || dec.src.startsWith('data:')
          ? dec.src
          : `${assetBase}${dec.src}`
        : ''

      // 支持背景图平铺模式（如 noise texture）— 使用 CSS background
      if (dec.backgroundSize) {
        return (
          <div
            data-decoration="true"
            style={{
              ...baseStyle,
              backgroundImage: `url('${src}')`,
              backgroundSize: dec.backgroundSize,
              backgroundRepeat: dec.backgroundRepeat || 'repeat',
              backgroundPosition: 'top left',
            }}
          />
        )
      }

      return (
        <img
          data-decoration="true"
          src={src}
          alt=""
          style={{
            ...baseStyle,
            objectFit: dec.objectFit || 'cover',
          }}
        />
      )
    }

    case 'svg':
      if (dec.svgContent) {
        return (
          <div
            data-decoration="true"
            style={baseStyle}
            dangerouslySetInnerHTML={{ __html: dec.svgContent }}
          />
        )
      }
      // SVG 作为图片引用
      if (dec.src) {
        const svgSrc = dec.src.startsWith('http') || dec.src.startsWith('data:')
          ? dec.src
          : `${assetBase}${dec.src}`
        return (
          <img
            data-decoration="true"
            src={svgSrc}
            alt=""
            style={{
              ...baseStyle,
              objectFit: dec.objectFit || 'contain',
            }}
          />
        )
      }
      return null

    case 'gradient': {
      if (!dec.gradient) return null
      const { type, angle = 180, stops } = dec.gradient
      const stopsStr = stops.map(s => `${s.color} ${s.offset}%`).join(', ')
      const bg = type === 'linear'
        ? `linear-gradient(${angle}deg, ${stopsStr})`
        : `radial-gradient(circle, ${stopsStr})`
      return (
        <div
          data-decoration="true"
          style={{
            ...baseStyle,
            background: bg,
            borderRadius: dec.borderRadius,
          }}
        />
      )
    }

    default:
      return null
  }
}
