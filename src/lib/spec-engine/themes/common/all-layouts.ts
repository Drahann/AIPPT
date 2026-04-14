/**
 * Common Theme — 公共模板库
 *
 * themeId='common'
 * 当 Spec 主题缺少某种布局时自动 fallback。
 * 所有颜色/字体使用 $theme.xxx token，运行时由 applyThemeTokens() 替换为当前主题的 defaults。
 */
import type { LayoutSpec } from '../../types'

// ============================================================================
// 基础布局 — 通用兜底
// ============================================================================

export const commonTextBullets: LayoutSpec = {
  id: 'text-bullets',
  description: '多要点列表，适合展示 3-6 个并列要点',
  contentFields: ['title', 'body'],
  canvas: { w: 1920, h: 1080, background: '$theme.colorBackground' },
  decorations: [],
  slots: [
    {
      id: 'title', type: 'text',
      x: 120, y: 80, w: 1680, h: 120,
      fontSize: 52, fontWeight: 700,
      fontFamily: '$theme.fontHeading',
      color: '$theme.colorText',
      lineHeight: 1.1,
    },
    {
      id: 'body', type: 'text',
      x: 120, y: 240, w: 1680, h: 760,
      fontSize: 28, fontWeight: 400,
      fontFamily: '$theme.fontBody',
      color: '$theme.colorText',
      lineHeight: 1.5,
    },
  ],
}

export const commonTextCenter: LayoutSpec = {
  id: 'text-center',
  description: '居中文本，适合单段重要论述或声明',
  contentFields: ['title', 'body'],
  canvas: { w: 1920, h: 1080, background: '$theme.colorBackground' },
  decorations: [],
  slots: [
    {
      id: 'title', type: 'text',
      x: 240, y: 280, w: 1440, h: 140,
      fontSize: 56, fontWeight: 700,
      fontFamily: '$theme.fontHeading',
      color: '$theme.colorText',
      lineHeight: 1.1,
      align: 'center',
      valign: 'middle',
    },
    {
      id: 'body', type: 'text',
      x: 320, y: 460, w: 1280, h: 360,
      fontSize: 26, fontWeight: 400,
      fontFamily: '$theme.fontBody',
      color: '$theme.colorTextSecondary',
      lineHeight: 1.6,
      align: 'center',
      valign: 'top',
    },
  ],
}

// ============================================================================
// 封面/结尾
// ============================================================================

export const commonCover: LayoutSpec = {
  id: 'cover',
  description: '封面页，大号标题+副标题',
  contentFields: ['title', 'subtitle'],
  canvas: { w: 1920, h: 1080, background: '$theme.colorBackground' },
  decorations: [
    {
      type: 'rect',
      x: 0, y: 0, w: 1920, h: 1080,
      fill: '$theme.colorPrimary',
      opacity: 0.05,
    },
  ],
  slots: [
    {
      id: 'title', type: 'text',
      x: 200, y: 300, w: 1520, h: 240,
      fontSize: 72, fontWeight: 700,
      fontFamily: '$theme.fontHeading',
      color: '$theme.colorText',
      lineHeight: 1.1,
      align: 'center',
      valign: 'middle',
    },
    {
      id: 'subtitle', type: 'text',
      x: 400, y: 580, w: 1120, h: 80,
      fontSize: 28, fontWeight: 400,
      fontFamily: '$theme.fontBody',
      color: '$theme.colorTextSecondary',
      lineHeight: 1.3,
      align: 'center',
      valign: 'top',
    },
  ],
}

export const commonEnding: LayoutSpec = {
  id: 'ending',
  description: '结尾感谢页',
  contentFields: ['title', 'body'],
  canvas: { w: 1920, h: 1080, background: '$theme.colorBackground' },
  decorations: [],
  slots: [
    {
      id: 'title', type: 'text',
      x: 240, y: 340, w: 1440, h: 160,
      fontSize: 64, fontWeight: 700,
      fontFamily: '$theme.fontHeading',
      color: '$theme.colorText',
      lineHeight: 1.1,
      align: 'center',
      valign: 'middle',
    },
    {
      id: 'body', type: 'text',
      x: 400, y: 540, w: 1120, h: 80,
      fontSize: 24, fontWeight: 400,
      fontFamily: '$theme.fontBody',
      color: '$theme.colorTextSecondary',
      lineHeight: 1.4,
      align: 'center',
      valign: 'top',
    },
  ],
}

// ============================================================================
// 图表布局
// ============================================================================

export const commonChartBar: LayoutSpec = {
  id: 'chart-bar',
  description: '柱状图，标题+图表区域',
  contentFields: ['title', 'chart'],
  canvas: { w: 1920, h: 1080, background: '$theme.colorBackground' },
  decorations: [],
  slots: [
    {
      id: 'title', type: 'text',
      x: 120, y: 60, w: 1680, h: 100,
      fontSize: 44, fontWeight: 700,
      fontFamily: '$theme.fontHeading',
      color: '$theme.colorText',
      lineHeight: 1.1,
    },
    {
      id: 'body', type: 'chart',
      x: 120, y: 200, w: 1680, h: 800,
    },
  ],
}

export const commonChartLine: LayoutSpec = {
  id: 'chart-line',
  description: '折线图，标题+图表区域',
  contentFields: ['title', 'chart'],
  canvas: { w: 1920, h: 1080, background: '$theme.colorBackground' },
  decorations: [],
  slots: [
    {
      id: 'title', type: 'text',
      x: 120, y: 60, w: 1680, h: 100,
      fontSize: 44, fontWeight: 700,
      fontFamily: '$theme.fontHeading',
      color: '$theme.colorText',
      lineHeight: 1.1,
    },
    {
      id: 'body', type: 'chart',
      x: 120, y: 200, w: 1680, h: 800,
    },
  ],
}

export const commonChartPie: LayoutSpec = {
  id: 'chart-pie',
  description: '饼图，标题+图表区域',
  contentFields: ['title', 'chart'],
  canvas: { w: 1920, h: 1080, background: '$theme.colorBackground' },
  decorations: [],
  slots: [
    {
      id: 'title', type: 'text',
      x: 120, y: 60, w: 1680, h: 100,
      fontSize: 44, fontWeight: 700,
      fontFamily: '$theme.fontHeading',
      color: '$theme.colorText',
      lineHeight: 1.1,
    },
    {
      id: 'body', type: 'chart',
      x: 120, y: 200, w: 1680, h: 800,
    },
  ],
}

export const commonChartBarCompare: LayoutSpec = {
  id: 'chart-bar-compare',
  description: '对比柱状图，标题+图表区域',
  contentFields: ['title', 'chart'],
  canvas: { w: 1920, h: 1080, background: '$theme.colorBackground' },
  decorations: [],
  slots: [
    {
      id: 'title', type: 'text',
      x: 120, y: 60, w: 1680, h: 100,
      fontSize: 44, fontWeight: 700,
      fontFamily: '$theme.fontHeading',
      color: '$theme.colorText',
      lineHeight: 1.1,
    },
    {
      id: 'body', type: 'chart',
      x: 120, y: 200, w: 1680, h: 800,
    },
  ],
}
