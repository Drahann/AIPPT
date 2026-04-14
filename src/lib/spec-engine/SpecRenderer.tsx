'use client'

import React from 'react'
import type { LayoutSpec, ThemeSpec } from './types'
import type { SlideContent } from '../types'
import { DecorationRenderer } from './DecorationRenderer'
import { SlotRenderer } from './SlotRenderer'

interface SpecRendererProps {
  spec: LayoutSpec
  theme: ThemeSpec
  slide: SlideContent
}

/**
 * 通用 LayoutSpec 渲染引擎。
 *
 * 接收一个 LayoutSpec JSON + SlideContent 数据，
 * 输出 1920×1080 绝对定位的标准 DOM。
 *
 * 三层渲染模型：
 * - L0: 背景层 — CSS background（仅 canvas 容器）
 * - L1: 装饰层 — data-decoration 标记的 SVG/纹理
 * - L2: 内容层 — data-slot-id 标记的语义标签 h1/h2/p
 *
 * canvas 容器定义 CSS 变量供子元素继承（SVG 中的 var() 可解析）。
 * 输出的 DOM 可被 layout-snapshot.ts 直接采集，
 * 然后通过 universal-exporter.ts 转换为 PPTX。
 */
export function SpecRenderer({ spec, theme, slide }: SpecRendererProps) {
  // 构建 canvas 背景样式
  const canvasBg = spec.canvas.background
  const bgImageSrc = spec.canvas.backgroundImage
    ? `url('${theme.assetBase}${spec.canvas.backgroundImage}')`
    : undefined

  const canvasStyle: React.CSSProperties = {
    position: 'relative',
    width: spec.canvas.w,
    height: spec.canvas.h,
    background: canvasBg,
    overflow: 'hidden',
    // 确保字体可以正常控制
    fontFamily: theme.defaults.fontBody,
    color: theme.defaults.colorText,
    // L0: 纸纹/纹理背景图
    ...(bgImageSrc ? {
      backgroundImage: bgImageSrc,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {}),
  }

  // 定义 CSS 变量供子元素（特别是 SVG 装饰中的 var()）继承
  const cssVars: Record<string, string> = {
    '--theme-color-text': theme.defaults.colorText,
    '--theme-color-text-secondary': theme.defaults.colorTextSecondary,
    '--theme-color-background': theme.defaults.colorBackground,
    '--theme-color-primary': theme.defaults.colorPrimary,
    '--theme-color-accent': theme.defaults.colorAccent,
    '--theme-font-heading': theme.defaults.fontHeading,
    '--theme-font-body': theme.defaults.fontBody,
    // 兼容旧 CSS 变量名
    '--color-1': theme.defaults.colorText,
    '--color-2': theme.defaults.colorBackground,
    '--fill-0': theme.defaults.colorPrimary,
    '--fill-1': theme.defaults.colorAccent,
  }

  return (
    <div
      style={{ ...canvasStyle, ...cssVars } as React.CSSProperties}
      data-spec-id={spec.id}
      data-theme-id={theme.id}
    >
      {/* Layer 1: Decorations — 装饰元素 */}
      <DecorationRenderer
        decorations={spec.decorations}
        assetBase={theme.assetBase}
      />

      {/* Layer 2: Content Slots — 内容槽位 */}
      <SlotRenderer
        slots={spec.slots}
        slide={slide}
        assetBase={theme.assetBase}
        themeDefaults={theme.defaults}
        slotMapping={spec.slotMapping}
      />
    </div>
  )
}
