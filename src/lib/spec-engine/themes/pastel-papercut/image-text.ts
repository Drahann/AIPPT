import type { LayoutSpec } from '../../types'
export const imageTextSpec: LayoutSpec = { id: 'image-text', canvas: { w: 1920, h: 1080, background: '#ffffff' }, decorations: [{ type: 'image', x: 0, y: -49, w: 1920, h: 1200, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.35, zIndex: 0 }], slots: [
  { id: 'title', x: 90, y: 90, w: 800, h: 200, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 90, fontWeight: 400, color: '#000000', lineHeight: 1, zIndex: 1 },
  { id: 'body', x: 90, y: 350, w: 800, h: 400, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: '#30290e', lineHeight: 1.25, zIndex: 1 },
  { id: 'image', x: 1000, y: 90, w: 830, h: 900, type: 'image', borderRadius: 20, objectFit: 'cover', zIndex: 2 },
] }
export const textImageSpec: LayoutSpec = { id: 'text-image', canvas: { w: 1920, h: 1080, background: '#ffffff' }, decorations: [{ type: 'image', x: 0, y: -49, w: 1920, h: 1200, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.35, zIndex: 0 }], slots: [
  { id: 'image', x: 90, y: 90, w: 830, h: 900, type: 'image', borderRadius: 20, objectFit: 'cover', zIndex: 2 },
  { id: 'title', x: 1020, y: 90, w: 800, h: 200, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 90, fontWeight: 400, color: '#000000', lineHeight: 1, zIndex: 1 },
  { id: 'body', x: 1020, y: 350, w: 800, h: 400, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: '#30290e', lineHeight: 1.25, zIndex: 1 },
] }
