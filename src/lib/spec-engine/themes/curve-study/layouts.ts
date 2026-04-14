import type { LayoutSpec } from '../../types'

export const textCenterSpec: LayoutSpec = { id: 'text-center', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [], slots: [
  { id: 'title', x: 200, y: 200, w: 1520, h: 400, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 140, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1, letterSpacing: -4.2, textTransform: 'uppercase', zIndex: 1 },
  { id: 'body', x: 360, y: 650, w: 1200, h: 300, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 400, color: '#000000', align: 'center', lineHeight: 1.3, zIndex: 1 },
] }

export const textBulletsSpec: LayoutSpec = { id: 'text-bullets', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [], slots: [
  { id: 'title', x: 64, y: 60, w: 1100, h: 200, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 120, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-0-heading', x: 700, y: 320, w: 1100, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-0-body', x: 700, y: 390, w: 1100, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
  { id: 'card-1-heading', x: 700, y: 510, w: 1100, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-1-body', x: 700, y: 580, w: 1100, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
  { id: 'card-2-heading', x: 700, y: 700, w: 1100, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', hideIfEmpty: true, zIndex: 1 },
  { id: 'card-2-body', x: 700, y: 770, w: 1100, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
  { id: 'body', x: 64, y: 900, w: 1800, h: 120, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
] }

export const cards3Spec: LayoutSpec = { id: 'cards-3', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [], slots: [
  { id: 'title', x: 64, y: 60, w: 1400, h: 200, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 120, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-0-heading', x: 64, y: 380, w: 560, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-0-body', x: 64, y: 460, w: 560, h: 400, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.4, zIndex: 1 },
  { id: 'card-1-heading', x: 680, y: 380, w: 560, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-1-body', x: 680, y: 460, w: 560, h: 400, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.4, zIndex: 1 },
  { id: 'card-2-heading', x: 1296, y: 380, w: 560, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-2-body', x: 1296, y: 460, w: 560, h: 400, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.4, zIndex: 1 },
] }

export const cards2Spec: LayoutSpec = { id: 'cards-2', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [], slots: [
  { id: 'title', x: 64, y: 60, w: 1400, h: 200, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 120, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-0-heading', x: 64, y: 380, w: 860, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-0-body', x: 64, y: 460, w: 860, h: 400, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.4, zIndex: 1 },
  { id: 'card-1-heading', x: 990, y: 380, w: 860, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'card-1-body', x: 990, y: 460, w: 860, h: 400, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.4, zIndex: 1 },
] }

export const quoteSpec: LayoutSpec = { id: 'quote', canvas: { w: 1920, h: 1080, background: '#e8e8e8' }, decorations: [], slots: [
  { id: 'title', x: 200, y: 200, w: 1520, h: 500, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 100, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1.1, letterSpacing: -3, textTransform: 'uppercase', zIndex: 1 },
  { id: 'body', x: 460, y: 750, w: 1000, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.3, zIndex: 1 },
] }

export const quoteNoAvatarSpec: LayoutSpec = { id: 'quote-no-avatar', canvas: { w: 1920, h: 1080, background: '#e8e8e8' }, decorations: [], slots: [
  { id: 'title', x: 200, y: 200, w: 1520, h: 500, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 100, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1.1, letterSpacing: -3, textTransform: 'uppercase', zIndex: 1 },
  { id: 'body', x: 460, y: 750, w: 1000, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.3, zIndex: 1 },
] }

export const imageTextSpec: LayoutSpec = { id: 'image-text', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [], slots: [
  { id: 'title', x: 64, y: 60, w: 900, h: 300, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 100, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -3, textTransform: 'uppercase', zIndex: 1 },
  { id: 'body', x: 64, y: 400, w: 900, h: 400, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.3, zIndex: 1 },
  { id: 'image', x: 1020, y: 60, w: 840, h: 960, type: 'image', borderRadius: 0, objectFit: 'cover', zIndex: 2 },
] }

export const textImageSpec: LayoutSpec = { id: 'text-image', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [], slots: [
  { id: 'image', x: 64, y: 60, w: 840, h: 960, type: 'image', borderRadius: 0, objectFit: 'cover', zIndex: 2 },
  { id: 'title', x: 960, y: 60, w: 900, h: 300, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 100, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -3, textTransform: 'uppercase', zIndex: 1 },
  { id: 'body', x: 960, y: 400, w: 900, h: 400, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.3, zIndex: 1 },
] }

export const imageCenterSpec: LayoutSpec = { id: 'image-center', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [], slots: [
  { id: 'image', x: 64, y: 60, w: 1792, h: 700, type: 'image', borderRadius: 0, objectFit: 'cover', zIndex: 1 },
  { id: 'title', x: 200, y: 810, w: 1520, h: 120, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 80, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase', zIndex: 1 },
  { id: 'body', x: 360, y: 950, w: 1200, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
] }

export const metricsSpec: LayoutSpec = { id: 'metrics', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [], slots: [
  { id: 'title', x: 64, y: 60, w: 1800, h: 120, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 100, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1, letterSpacing: -3, textTransform: 'uppercase', zIndex: 1 },
  { id: 'metric-0-value', x: 150, y: 350, w: 500, h: 140, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 120, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1, zIndex: 1 },
  { id: 'metric-0-label', x: 150, y: 510, w: 500, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.3, zIndex: 1 },
  { id: 'metric-1-value', x: 710, y: 350, w: 500, h: 140, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 120, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1, zIndex: 1 },
  { id: 'metric-1-label', x: 710, y: 510, w: 500, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.3, zIndex: 1 },
  { id: 'metric-2-value', x: 1270, y: 350, w: 500, h: 140, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 120, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1, zIndex: 1 },
  { id: 'metric-2-label', x: 1270, y: 510, w: 500, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.3, zIndex: 1 },
  { id: 'body', x: 310, y: 680, w: 1300, h: 200, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', align: 'center', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
] }

export const timelineSpec: LayoutSpec = { id: 'timeline', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [{ type: 'line', x: 940, y: 200, w: 2, h: 700, stroke: '#000000', strokeWidth: 1, opacity: 0.2, zIndex: 0 }], slots: [
  { id: 'title', x: 64, y: 60, w: 700, h: 120, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 100, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -3, textTransform: 'uppercase', zIndex: 1 },
  { id: 'event-0-date', x: 150, y: 300, w: 740, h: 40, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 600, color: '#000000', align: 'right', lineHeight: 1, textTransform: 'uppercase', zIndex: 1 },
  { id: 'event-0-title', x: 990, y: 280, w: 780, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'event-0-description', x: 990, y: 350, w: 780, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
  { id: 'event-1-date', x: 150, y: 510, w: 740, h: 40, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 600, color: '#000000', align: 'right', lineHeight: 1, textTransform: 'uppercase', zIndex: 1 },
  { id: 'event-1-title', x: 990, y: 490, w: 780, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'event-1-description', x: 990, y: 560, w: 780, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
  { id: 'event-2-date', x: 150, y: 720, w: 740, h: 40, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 600, color: '#000000', align: 'right', lineHeight: 1, textTransform: 'uppercase', zIndex: 1 },
  { id: 'event-2-title', x: 990, y: 700, w: 780, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'event-2-description', x: 990, y: 770, w: 780, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
] }

export const comparisonSpec: LayoutSpec = { id: 'comparison', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [{ type: 'line', x: 960, y: 200, w: 2, h: 700, stroke: '#000000', strokeWidth: 1, opacity: 0.2, zIndex: 0 }], slots: [
  { id: 'title', x: 64, y: 60, w: 1800, h: 120, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 100, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1, letterSpacing: -3, textTransform: 'uppercase', zIndex: 1 },
  { id: 'left-heading', x: 150, y: 280, w: 750, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'left-items', x: 150, y: 370, w: 750, h: 500, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.5, zIndex: 1 },
  { id: 'right-heading', x: 1020, y: 280, w: 750, h: 60, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 50, fontWeight: 200, color: '#000000', lineHeight: 1, letterSpacing: -1.5, textTransform: 'uppercase', zIndex: 1 },
  { id: 'right-items', x: 1020, y: 370, w: 750, h: 500, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#333333', lineHeight: 1.5, zIndex: 1 },
] }

export const endingSpec: LayoutSpec = { id: 'ending', canvas: { w: 1920, h: 1080, background: '#f3f3f3' }, decorations: [
  { type: 'image', x: -159, y: 605, w: 2379, h: 588, src: 'f2cfd6791790399e142d695cd02c823fbd158cc8.svg', objectFit: 'contain', zIndex: 0 },
], slots: [
  { id: 'title', x: 64, y: 250, w: 1792, h: 300, type: 'text', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 180, fontWeight: 200, color: '#000000', align: 'center', lineHeight: 1, letterSpacing: -5.4, textTransform: 'uppercase', zIndex: 1 },
  { id: 'body', x: 460, y: 600, w: 1000, h: 80, type: 'text', fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
] }
