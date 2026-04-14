import type { LayoutSpec } from '../../types'
export const cards2Spec: LayoutSpec = { id: 'cards-2', canvas: { w: 1920, h: 1080, background: '#ffffff' }, decorations: [{ type: 'image', x: 0, y: -49, w: 1920, h: 1200, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.35, zIndex: 0 }], slots: [
  { id: 'title', x: 90, y: 90, w: 800, h: 200, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 90, fontWeight: 400, color: '#000000', lineHeight: 1, zIndex: 1 },
  { id: 'card-0-heading', x: 150, y: 420, w: 780, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, zIndex: 1 },
  { id: 'card-0-body', x: 150, y: 500, w: 780, h: 350, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#30290e', lineHeight: 1.35, zIndex: 1 },
  { id: 'card-1-heading', x: 990, y: 420, w: 780, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, zIndex: 1 },
  { id: 'card-1-body', x: 990, y: 500, w: 780, h: 350, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#30290e', lineHeight: 1.35, zIndex: 1 },
] }
