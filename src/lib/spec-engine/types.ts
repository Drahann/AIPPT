/**
 * Spec Engine — Core Type Definitions
 *
 * LayoutSpec 定义了一个 1920×1080 幻灯片的完整布局：
 * - canvas: 画布背景
 * - decorations: 装饰元素（纯视觉，不承载内容）
 * - slots: 内容槽位（由 SlideContent 数据填充）
 *
 * ThemeSpec 定义了一个主题的完整配置：
 * - 多个 LayoutSpec（按 layout type 索引）
 * - 主题级默认样式
 * - 静态资源路径
 */

import type { LayoutType } from '../types'

// ---------------------------------------------------------------------------
// Decoration Elements — 纯视觉元素，不承载内容
// ---------------------------------------------------------------------------

export type DecorationElementType = 'rect' | 'ellipse' | 'line' | 'image' | 'svg' | 'gradient'

export interface DecorationElement {
  type: DecorationElementType
  x: number
  y: number
  w: number
  h: number

  // 通用样式
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  borderRadius?: number
  rotate?: number
  zIndex?: number

  // image 类型专用
  src?: string                // 图片路径（相对于 assetBase）
  objectFit?: 'cover' | 'contain' | 'fill'

  // svg 类型专用
  svgContent?: string         // 内联 SVG 字符串

  // gradient 类型专用
  gradient?: {
    type: 'linear' | 'radial'
    angle?: number             // linear gradient 角度（deg）
    stops: Array<{ offset: number; color: string }>
  }

  // 背景图平铺（用于 noise texture 等）
  backgroundSize?: string     // 如 '416px 311px'
  backgroundRepeat?: string   // 如 'repeat'

  // 混合模式
  mixBlendMode?: string       // 如 'soft-light'

  // 高级效果
  shadow?: string             // CSS box-shadow 格式
  blur?: number               // backdrop-filter: blur(Npx)
}

// ---------------------------------------------------------------------------
// Content Slots — 内容槽位，由 SlideContent 数据填充
// ---------------------------------------------------------------------------

export type SlotType = 'text' | 'image' | 'chart' | 'icon' | 'container'

export interface SlotDefinition {
  id: string                  // 语义标识，决定数据映射
  x: number
  y: number
  w: number
  h: number
  type: SlotType

  // 文字样式
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  fontStyle?: 'normal' | 'italic'
  color?: string
  align?: 'left' | 'center' | 'right'
  valign?: 'top' | 'middle' | 'bottom'
  lineHeight?: number
  letterSpacing?: number
  textTransform?: 'none' | 'uppercase' | 'lowercase'

  // 容器样式
  background?: string
  borderRadius?: number
  border?: string
  padding?: number | string   // px or "top right bottom left"
  opacity?: number
  zIndex?: number

  // image slot 专用
  objectFit?: 'cover' | 'contain' | 'fill'

  // container slot：可包含子 slot（用于卡片等复合布局）
  children?: SlotDefinition[]
  
  // 当内容为空时是否隐藏该 slot
  hideIfEmpty?: boolean
}

// ---------------------------------------------------------------------------
// Layout Spec — 一个完整的幻灯片布局规格
// ---------------------------------------------------------------------------

export interface LayoutSpec {
  /** 布局ID — 主题内唯一标识 */
  id: string

  /**
   * AI 用描述 — 告诉 AI 何时选用此布局
   * 例: '适合展示3个并列要点或特性' / '封面页，仅标题+副标题'
   */
  description?: string

  /**
   * 内容字段声明 — 告诉 AI 这个布局需要什么 SlideContent 字段
   * 例: ['title', 'body'] 或 ['title', 'cards:3', 'image']
   * cards:N 表示需要N个卡片，metrics:N 表示N个指标
   */
  contentFields?: string[]

  /** 画布配置 */
  canvas: {
    w: 1920
    h: 1080
    background: string        // 颜色值、渐变、或 'transparent'
    backgroundImage?: string  // 纸纹/纹理图片文件名（相对于 assetBase）
    backgroundOpacity?: number // 背景图透明度 (0-1)
  }

  /** 装饰元素列表（按渲染顺序） */
  decorations: DecorationElement[]

  /** 内容槽位列表 */
  slots: SlotDefinition[]

  /**
   * 自定义数据映射规则
   * key = slot.id, value = SlideContent 的属性路径
   * 默认按约定映射（'title' → slide.title 等）
   */
  slotMapping?: Record<string, string>
}

// ---------------------------------------------------------------------------
// Theme Spec — 一个主题的完整定义
// ---------------------------------------------------------------------------

export interface ThemeSpec {
  /** 主题ID，用于注册和查找 */
  id: string

  /** 显示名称 */
  name: string

  /** 描述 */
  description?: string

  /** 预览色（用于主题选择器） */
  previewColor?: string

  /**
   * 布局集合
   * key = 布局ID（主题自定义，不受旧 LayoutType 枚举限制）
   * 缺失的布局 ID 会 fallback 到旧组件
   */
  layouts: Record<string, LayoutSpec>

  /** 主题级默认样式（当 slot 未指定时使用） */
  defaults: {
    fontHeading: string
    fontBody: string
    colorText: string
    colorTextSecondary: string
    colorBackground: string
    colorPrimary: string
    colorAccent: string
  }

  /** 静态资源目录前缀（相对于 public/） */
  assetBase: string

  /**
   * 布局别名映射 — 将 AI 常用的通用布局 ID 映射到主题专属 ID
   * 让 resolveLayout 在精确匹配之前先尝试别名解析。
   * 例: { 'cards-3': 'pp-title-cols-3', 'ending': 'pp-thanks-end' }
   */
  layoutAliases?: Record<string, string>
}
