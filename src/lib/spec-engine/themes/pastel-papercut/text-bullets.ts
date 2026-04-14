import type { LayoutSpec } from '../../types'
export const textBulletsSpec: LayoutSpec = {
  id: 'text-bullets',
  canvas: { w: 1920, h: 1080, background: '#ffffff' },
  decorations: [
    { type: 'image', x: 0, y: -49, w: 1920, h: 1200, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.35, zIndex: 0 },
  ],
  slots: [
    { id: 'title', x: 90, y: 90, w: 520, h: 200, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 90, fontWeight: 400, color: '#000000', lineHeight: 1, zIndex: 1 },
    { id: 'card-0-heading', x: 700, y: 130, w: 900, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, zIndex: 1 },
    { id: 'card-0-body', x: 700, y: 200, w: 900, h: 100, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#30290e', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
    { id: 'card-1-heading', x: 700, y: 340, w: 900, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, zIndex: 1 },
    { id: 'card-1-body', x: 700, y: 410, w: 900, h: 100, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#30290e', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
    { id: 'card-2-heading', x: 700, y: 550, w: 900, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, hideIfEmpty: true, zIndex: 1 },
    { id: 'card-2-body', x: 700, y: 620, w: 900, h: 100, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#30290e', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
    { id: 'body', x: 90, y: 800, w: 1740, h: 200, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: '#30290e', lineHeight: 1.25, hideIfEmpty: true, zIndex: 1 },
  ],
}
