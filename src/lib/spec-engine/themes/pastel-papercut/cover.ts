/**
 * Cover — Pastel Papercut 封面
 * 白底 + papercut纹理 + 大型剪纸装饰 SVG + Shippori Mincho 标题
 */
import type { LayoutSpec } from '../../types'

export const coverSpec: LayoutSpec = {
  id: 'cover',
  canvas: { w: 1920, h: 1080, background: '#ffffff' },
  decorations: [
    // Papercut纹理 (旋转90度覆盖)
    {
      type: 'image',
      x: -38, y: -49, w: 1995, h: 1409,
      src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png',
      objectFit: 'cover',
      opacity: 0.6,
      zIndex: 0,
    },
    // 大型剪纸装饰 SVG
    {
      type: 'image',
      x: 395, y: 129, w: 1690, h: 1232,
      src: '26ba375a83c6b17998f90af04e168737e456c95d.svg',
      objectFit: 'contain',
      zIndex: 1,
    },
  ],
  slots: [
    // 主标题
    {
      id: 'title',
      x: 90, y: 90, w: 1435, h: 250,
      type: 'text',
      fontFamily: "'Shippori Mincho', serif",
      fontSize: 90,
      fontWeight: 400,
      color: '#000000',
      lineHeight: 1,
      zIndex: 2,
    },
    // 副标题/日期
    {
      id: 'body',
      x: 90, y: 960, w: 400, h: 40,
      type: 'text',
      fontFamily: "'Playfair Display', serif",
      fontSize: 20,
      fontWeight: 400,
      color: '#000000',
      lineHeight: 1,
      zIndex: 2,
    },
  ],
}
