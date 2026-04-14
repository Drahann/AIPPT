/**
 * Section Header — Pastel Papercut 章节页
 * 白底 + 纹理 + 左侧标题 + 右侧编号列表
 */
import type { LayoutSpec } from '../../types'

export const sectionHeaderSpec: LayoutSpec = {
  id: 'section-header',
  canvas: { w: 1920, h: 1080, background: '#ffffff' },
  decorations: [
    {
      type: 'image',
      x: 0, y: -128, w: 1920, h: 1355,
      src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png',
      objectFit: 'cover',
      opacity: 0.5,
      zIndex: 0,
    },
  ],
  slots: [
    {
      id: 'title',
      x: 89, y: 70, w: 516, h: 200,
      type: 'text',
      fontFamily: "'Shippori Mincho', serif",
      fontSize: 90,
      fontWeight: 400,
      color: '#000000',
      lineHeight: 1,
      zIndex: 1,
    },
    {
      id: 'body',
      x: 700, y: 120, w: 1100, h: 800,
      type: 'text',
      fontFamily: "'Shippori Mincho', serif",
      fontSize: 40,
      fontWeight: 400,
      color: '#000000',
      lineHeight: 1.3,
      zIndex: 1,
    },
  ],
}
