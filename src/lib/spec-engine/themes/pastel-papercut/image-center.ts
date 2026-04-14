import type { LayoutSpec } from '../../types'
export const imageCenterSpec: LayoutSpec = { id: 'image-center', canvas: { w: 1920, h: 1080, background: '#ffffff' }, decorations: [{ type: 'image', x: 0, y: -49, w: 1920, h: 1200, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.3, zIndex: 0 }], slots: [
  { id: 'image', x: 160, y: 60, w: 1600, h: 700, type: 'image', borderRadius: 20, objectFit: 'cover', zIndex: 1 },
  { id: 'title', x: 260, y: 810, w: 1400, h: 120, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 90, fontWeight: 400, color: '#000000', align: 'center', lineHeight: 1, zIndex: 1 },
  { id: 'body', x: 360, y: 950, w: 1200, h: 80, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: '#30290e', align: 'center', lineHeight: 1.25, hideIfEmpty: true, zIndex: 1 },
] }
