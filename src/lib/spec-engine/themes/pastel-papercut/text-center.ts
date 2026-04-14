import type { LayoutSpec } from '../../types'
export const textCenterSpec: LayoutSpec = {
  id: 'text-center',
  canvas: { w: 1920, h: 1080, background: '#faf3e8' },
  decorations: [
    { type: 'image', x: -38, y: -49, w: 1995, h: 1409, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.4, zIndex: 0 },
  ],
  slots: [
    { id: 'title', x: 260, y: 300, w: 1400, h: 300, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 120, fontWeight: 400, color: '#000000', align: 'center', lineHeight: 1.1, zIndex: 1 },
    { id: 'body', x: 310, y: 650, w: 1300, h: 300, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: '#30290e', align: 'center', lineHeight: 1.25, zIndex: 1 },
  ],
}
