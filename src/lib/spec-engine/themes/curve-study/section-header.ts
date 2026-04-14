import type { LayoutSpec } from '../../types'
export const sectionHeaderSpec: LayoutSpec = { id: 'section-header', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [
  { type: 'image', x: 1283, y: 0, w: 444, h: 1083, src: '623f830f284e5c55e8980e2b238d75a9c44c4215.svg', objectFit: 'contain', zIndex: 0 },
], slots: [
  { id: 'title', x: 64, y: 40, w: 1183, h: 200, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 180, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -5.4, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-0-heading', x: 380, y: 380, w: 729, h: 80, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 80, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-1-heading', x: 380, y: 500, w: 729, h: 80, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 80, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase', hideIfEmpty: true, zIndex: 1 },
  { id: 'card-2-heading', x: 380, y: 620, w: 729, h: 80, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 80, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase', hideIfEmpty: true, zIndex: 1 },
  { id: 'subtitle', x: 64, y: 960, w: 1093, h: 40, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 600, color: '#000000', lineHeight: 1, textTransform: 'uppercase', hideIfEmpty: true, zIndex: 1 },
] }
