import type { LayoutSpec } from '../../types'
export const coverSpec: LayoutSpec = { id: 'cover', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [
  { type: 'image', x: -159, y: 605, w: 2379, h: 588, src: 'f2cfd6791790399e142d695cd02c823fbd158cc8.svg', objectFit: 'contain', zIndex: 0 },
], slots: [
  { id: 'subtitle', x: 64, y: 40, w: 1093, h: 40, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 600, color: '#000000', lineHeight: 1, letterSpacing: 0, textTransform: 'uppercase', hideIfEmpty: true, zIndex: 1 },
  { id: 'title', x: 64, y: 170, w: 1183, h: 540, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 180, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -5.4, textTransform: 'uppercase', zIndex: 1 },
  { id: 'body', x: 1283, y: 64, w: 573, h: 120, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 400, color: '#000000', lineHeight: 1.2, hideIfEmpty: true, zIndex: 1 },
] }
