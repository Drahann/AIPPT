import type { LayoutSpec } from '../../types'
export const endingSpec: LayoutSpec = { id: 'ending', canvas: { w: 1920, h: 1080, background: '#ffffff' }, decorations: [{ type: 'image', x: -38, y: -49, w: 1995, h: 1409, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.5, zIndex: 0 }], slots: [
  { id: 'title', x: 125, y: 350, w: 1558, h: 200, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 120, fontWeight: 400, color: '#000000', valign: 'middle', lineHeight: 1.1, zIndex: 1 },
  { id: 'body', x: 125, y: 600, w: 1558, h: 80, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: '#30290e', lineHeight: 1.25, hideIfEmpty: true, zIndex: 1 },
] }
export const metricsSpec: LayoutSpec = { id: 'metrics', canvas: { w: 1920, h: 1080, background: '#ffffff' }, decorations: [{ type: 'image', x: 0, y: -49, w: 1920, h: 1200, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.3, zIndex: 0 }], slots: [
  { id: 'title', x: 90, y: 90, w: 1740, h: 120, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 90, fontWeight: 400, color: '#000000', align: 'center', lineHeight: 1, zIndex: 1 },
  { id: 'metric-0-value', x: 150, y: 350, w: 500, h: 140, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 120, fontWeight: 400, color: '#30290e', align: 'center', lineHeight: 1, zIndex: 1 },
  { id: 'metric-0-label', x: 150, y: 510, w: 500, h: 80, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.25, zIndex: 1 },
  { id: 'metric-1-value', x: 710, y: 350, w: 500, h: 140, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 120, fontWeight: 400, color: '#30290e', align: 'center', lineHeight: 1, zIndex: 1 },
  { id: 'metric-1-label', x: 710, y: 510, w: 500, h: 80, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.25, zIndex: 1 },
  { id: 'metric-2-value', x: 1270, y: 350, w: 500, h: 140, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 120, fontWeight: 400, color: '#30290e', align: 'center', lineHeight: 1, zIndex: 1 },
  { id: 'metric-2-label', x: 1270, y: 510, w: 500, h: 80, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: '#666666', align: 'center', lineHeight: 1.25, zIndex: 1 },
  { id: 'body', x: 310, y: 680, w: 1300, h: 200, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: '#30290e', align: 'center', lineHeight: 1.25, hideIfEmpty: true, zIndex: 1 },
] }
export const timelineSpec: LayoutSpec = { id: 'timeline', canvas: { w: 1920, h: 1080, background: '#ffffff' }, decorations: [{ type: 'image', x: 0, y: -49, w: 1920, h: 1200, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.3, zIndex: 0 }, { type: 'line', x: 940, y: 200, w: 2, h: 700, stroke: '#30290e', strokeWidth: 1, opacity: 0.3, zIndex: 0 }], slots: [
  { id: 'title', x: 90, y: 90, w: 700, h: 120, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 90, fontWeight: 400, color: '#000000', lineHeight: 1, zIndex: 1 },
  { id: 'event-0-date', x: 150, y: 300, w: 740, h: 40, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: '#30290e', align: 'right', lineHeight: 1, zIndex: 1 },
  { id: 'event-0-title', x: 990, y: 280, w: 780, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, zIndex: 1 },
  { id: 'event-0-description', x: 990, y: 350, w: 780, h: 80, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#666666', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
  { id: 'event-1-date', x: 150, y: 510, w: 740, h: 40, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: '#30290e', align: 'right', lineHeight: 1, zIndex: 1 },
  { id: 'event-1-title', x: 990, y: 490, w: 780, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, zIndex: 1 },
  { id: 'event-1-description', x: 990, y: 560, w: 780, h: 80, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#666666', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
  { id: 'event-2-date', x: 150, y: 720, w: 740, h: 40, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: '#30290e', align: 'right', lineHeight: 1, zIndex: 1 },
  { id: 'event-2-title', x: 990, y: 700, w: 780, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, zIndex: 1 },
  { id: 'event-2-description', x: 990, y: 770, w: 780, h: 80, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#666666', lineHeight: 1.3, hideIfEmpty: true, zIndex: 1 },
] }
export const comparisonSpec: LayoutSpec = { id: 'comparison', canvas: { w: 1920, h: 1080, background: '#ffffff' }, decorations: [{ type: 'image', x: 0, y: -49, w: 1920, h: 1200, src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png', objectFit: 'cover', opacity: 0.3, zIndex: 0 }, { type: 'line', x: 960, y: 200, w: 2, h: 700, stroke: '#30290e', strokeWidth: 1, zIndex: 0 }], slots: [
  { id: 'title', x: 90, y: 90, w: 1740, h: 100, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 90, fontWeight: 400, color: '#000000', align: 'center', lineHeight: 1, zIndex: 1 },
  { id: 'left-heading', x: 150, y: 280, w: 750, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, zIndex: 1 },
  { id: 'left-items', x: 150, y: 370, w: 750, h: 500, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#30290e', lineHeight: 1.5, zIndex: 1 },
  { id: 'right-heading', x: 1020, y: 280, w: 750, h: 60, type: 'text', fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 400, color: '#000000', lineHeight: 1.1, zIndex: 1 },
  { id: 'right-items', x: 1020, y: 370, w: 750, h: 500, type: 'text', fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: '#30290e', lineHeight: 1.5, zIndex: 1 },
] }
