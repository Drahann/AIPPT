import type { LayoutSpec } from '../../types'

const FH = "'Bricolage Grotesque', sans-serif"
const FB = "'Inter', sans-serif"
const TEAL = '#237267'
const GRAY = '#f3f3f3'
const BLACK = '#000000'

// 01. Cover Gray (Node_4-2545)
export const csCoverGray: LayoutSpec = {
  id: 'cs-cover-gray',
  description: '浅灰色大字体封面',
  contentFields: ['title', 'captionLeft', 'captionRight', 'body'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: -159, y: 606, w: 2379, h: 588, src: 'f2cfd6791790399e142d695cd02c823fbd158cc8.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 169, w: 1183, h: 550, fontFamily: FH, fontSize: 180, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -5.4, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 1283, y: 122, w: 573, h: 200, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 }
  ]
}

// 02. Cover Teal (Node_4-2551)
export const csCoverTeal: LayoutSpec = {
  id: 'cs-cover-teal',
  description: '深青色大字体封面',
  contentFields: ['title', 'captionLeft', 'captionRight', 'body'],
  canvas: { w: 1920, h: 1080, background: TEAL },
  decorations: [
    { type: 'svg', x: -787, y: 361, w: 2989, h: 1035, src: 'f5bc22884d2a4d9acc9d78d9fb450a36376c4f63.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 169, w: 1183, h: 550, fontFamily: FH, fontSize: 180, fontWeight: 382, color: GRAY, lineHeight: 1, letterSpacing: -5.4, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 1283, y: 122, w: 573, h: 200, fontFamily: FB, fontSize: 28, fontWeight: 400, color: GRAY, lineHeight: 1.2 }
  ]
}

// 03. Section Gray (Node_4-2557)
export const csSectionGray: LayoutSpec = {
  id: 'cs-section-gray',
  description: '浅灰色章节过渡页',
  contentFields: ['title', 'captionLeft', 'captionRight', 'body'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: -71, y: 633, w: 2800, h: 520, src: '517ff21c60ef0e8bd7a46a496c24ff0ed681a8c8.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 169, w: 1827, h: 200, fontFamily: FH, fontSize: 180, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -5.4, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 64, y: 664, w: 735, h: 200, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 04. Agenda 3 (Node_4-2563)
export const csAgenda3: LayoutSpec = {
  id: 'cs-agenda-3',
  description: '带连线的3项议程列表',
  contentFields: ['title', 'captionLeft', 'captionRight', 'events:3'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 964, y: 320, w: 1083, h: 444, rotate: 90, src: '623f830f284e5c55e8980e2b238d75a9c44c4215.svg' },
    { type: 'svg', x: 1516, y: 466, w: 824, h: 403, rotate: -90, src: 'c4fc51b10a2a4bc49ed34bccfb063c2502061ae9.svg' },
    { type: 'svg', x: 64, y: 483, w: 1030, h: 0, src: 'f4627778eb065700a13dbe04f4842c7fd9acda88.svg' },
    { type: 'svg', x: 64, y: 619, w: 1030, h: 0, src: 'f4627778eb065700a13dbe04f4842c7fd9acda88.svg' },
    { type: 'svg', x: 64, y: 755, w: 1030, h: 0, src: 'f4627778eb065700a13dbe04f4842c7fd9acda88.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 54, w: 1183, h: 200, fontFamily: FH, fontSize: 180, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -5.4, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-0-date', type: 'text', x: 64, y: 375, w: 265, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-0-title', type: 'text', x: 365, y: 375, w: 729, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-1-date', type: 'text', x: 64, y: 511, w: 265, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-1-title', type: 'text', x: 365, y: 511, w: 729, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-2-date', type: 'text', x: 64, y: 647, w: 265, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-2-title', type: 'text', x: 365, y: 647, w: 729, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 }
  ]
}

// 05. Agenda 8 (Node_4-2578)
export const csAgenda8: LayoutSpec = {
  id: 'cs-agenda-8',
  description: '带连线的8项双列议程列表',
  contentFields: ['title', 'captionLeft', 'captionRight', 'events:8'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 978, y: -197, w: 1433, h: 527, rotate: 180, src: '3c37d32f83982bef13f81d47885aa16dd839a439.svg' },
    { type: 'svg', x: 64, y: 505, w: 1733, h: 0, src: 'ef60cdb6f9908f1f126f6d3257cdb424e707df05.svg' },
    { type: 'svg', x: 64, y: 646, w: 1733, h: 0, src: 'ef60cdb6f9908f1f126f6d3257cdb424e707df05.svg' },
    { type: 'svg', x: 64, y: 787, w: 1733, h: 0, src: 'ef60cdb6f9908f1f126f6d3257cdb424e707df05.svg' },
    { type: 'svg', x: 64, y: 928, w: 1733, h: 0, src: 'ef60cdb6f9908f1f126f6d3257cdb424e707df05.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 54, w: 1183, h: 200, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-0-date', type: 'text', x: 64, y: 397, w: 264, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-0-title', type: 'text', x: 364, y: 397, w: 555, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-1-date', type: 'text', x: 64, y: 538, w: 264, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-1-title', type: 'text', x: 364, y: 538, w: 555, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-2-date', type: 'text', x: 64, y: 679, w: 264, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-2-title', type: 'text', x: 364, y: 679, w: 555, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-3-date', type: 'text', x: 64, y: 820, w: 264, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-3-title', type: 'text', x: 364, y: 820, w: 555, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-4-date', type: 'text', x: 942, y: 397, w: 264, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-4-title', type: 'text', x: 1242, y: 397, w: 555, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-5-date', type: 'text', x: 942, y: 538, w: 264, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-5-title', type: 'text', x: 1242, y: 538, w: 555, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-6-date', type: 'text', x: 942, y: 679, w: 264, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-6-title', type: 'text', x: 1242, y: 679, w: 555, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-7-date', type: 'text', x: 942, y: 820, w: 264, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-7-title', type: 'text', x: 1242, y: 820, w: 555, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 }
  ]
}

// 06. Agenda 3 Alt (Node_4-2603)
export const csAgenda3Alt: LayoutSpec = {
  id: 'cs-agenda-3-alt',
  description: '紧凑型带连线的3项议程列表',
  contentFields: ['title', 'captionLeft', 'captionRight', 'events:3'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 44, y: 553, w: 2273, h: 527, src: 'a507ab471369d5551708be273236ef7042c81d7c.svg' },
    { type: 'svg', x: 64, y: 357, w: 1030, h: 0, src: '1cfc625a253e0418be517b84bda270f9ed92adc2.svg' },
    { type: 'svg', x: 64, y: 493, w: 1030, h: 0, src: '1cfc625a253e0418be517b84bda270f9ed92adc2.svg' },
    { type: 'svg', x: 64, y: 629, w: 1030, h: 0, src: '1cfc625a253e0418be517b84bda270f9ed92adc2.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 54, w: 1183, h: 200, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-0-date', type: 'text', x: 64, y: 249, w: 265, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-0-title', type: 'text', x: 365, y: 249, w: 729, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-1-date', type: 'text', x: 64, y: 385, w: 265, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-1-title', type: 'text', x: 365, y: 385, w: 729, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-2-date', type: 'text', x: 64, y: 521, w: 265, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-2-title', type: 'text', x: 365, y: 521, w: 729, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 }
  ]
}

// 07. Text Two Lines (Node_4-2617)
export const csTextTwoLines: LayoutSpec = {
  id: 'cs-text-two-lines',
  description: '两行超大标题+下方正文',
  contentFields: ['title', 'captionLeft', 'captionRight', 'body'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 712, y: -128, w: 1564, h: 1236, src: 'f96af3b8b9ac86cf0db85d91f1cbb920d14b601d.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 93, w: 1183, h: 400, fontFamily: FH, fontSize: 180, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -5.4, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 64, y: 507, w: 630, h: 400, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 08. Subtitle Two Lines (Node_4-2623)
export const csSubtitleTwoLines: LayoutSpec = {
  id: 'cs-subtitle-two-lines',
  description: '大副标题+偏置正文',
  contentFields: ['title', 'captionLeft', 'captionRight', 'body'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 978, y: 346, w: 980, h: 748, src: '46f9b530b2778992dd69e6d45786eaccc2a4c829.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 331, w: 726, h: 300, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 830, y: 331, w: 726, h: 400, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 09. Text Three Columns (Node_4-2629)
export const csTextThreeColumns: LayoutSpec = {
  id: 'cs-text-three-columns',
  description: '横排3列长文本',
  contentFields: ['captionLeft', 'captionRight', 'cards:3'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: -527, y: 895, w: 2672, h: 242, src: 'af895f8e3f948ee9a9c757002129d66a7aa54363.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'card-0-title', type: 'text', x: 64, y: 502, w: 570, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'card-0-body', type: 'text', x: 64, y: 542, w: 570, h: 200, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'card-1-title', type: 'text', x: 674, y: 502, w: 570, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'card-1-body', type: 'text', x: 674, y: 542, w: 570, h: 200, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'card-2-title', type: 'text', x: 1284, y: 502, w: 570, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'card-2-body', type: 'text', x: 1284, y: 542, w: 570, h: 200, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 }
  ]
}

// 10. Image Top Right (Node_4-2639)
export const csImageTopRight: LayoutSpec = {
  id: 'cs-image-top-right',
  description: '右上角大图+左侧正文',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight', 'image'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [],
  slots: [
    { id: 'image', type: 'image', x: 942, y: -127, w: 1308, h: 1308, objectFit: 'cover' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'title', type: 'text', x: 64, y: 385, w: 680, h: 150, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 64, y: 559, w: 680, h: 200, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 }
  ]
}

// 11. Image Left Teal (Node_4-2645)
export const csImageLeftTeal: LayoutSpec = {
  id: 'cs-image-left-teal',
  description: '深青色背景+左侧大图',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight', 'image'],
  canvas: { w: 1920, h: 1080, background: TEAL },
  decorations: [],
  slots: [
    { id: 'image', type: 'image', x: -418, y: -35, w: 1115, h: 1115, objectFit: 'cover' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'title', type: 'text', x: 960, y: 385, w: 800, h: 150, fontFamily: FH, fontSize: 120, fontWeight: 382, color: GRAY, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 960, y: 559, w: 680, h: 200, fontFamily: FB, fontSize: 28, fontWeight: 400, color: GRAY, lineHeight: 1.2 }
  ]
}

// 12. Image Stack (Node_4-2652)
export const csImageStack: LayoutSpec = {
  id: 'cs-image-stack',
  description: '左侧双图叠放+右侧图文',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight', 'image', 'imageOverlay'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [],
  slots: [
    { id: 'image', type: 'image', x: 551, y: 205, w: 580, h: 580, objectFit: 'cover' },
    { id: 'imageOverlay', type: 'image', x: 58, y: 205, w: 580, h: 580, objectFit: 'cover' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'title', type: 'text', x: 1247, y: 320, w: 540, h: 100, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 1247, y: 457, w: 540, h: 300, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 }
  ]
}

// 13. Metrics (Node_4-2659)
export const csMetrics: LayoutSpec = {
  id: 'cs-metrics',
  description: '超大指标数据展示',
  contentFields: ['captionLeft', 'captionRight', 'metrics:2'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 907, y: -389, w: 2025, h: 1600, rotate: 180, src: 'a8d780ae4d618599190d6a0586fe6247e3ac6342.svg' },
    { type: 'svg', x: 64, y: 339, w: 1030, h: 0, src: 'f4627778eb065700a13dbe04f4842c7fd9acda88.svg' },
    { type: 'svg', x: 64, y: 659, w: 1030, h: 0, src: 'f4627778eb065700a13dbe04f4842c7fd9acda88.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'metric-0-value', type: 'text', x: 64, y: 127, w: 1030, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'metric-0-label', type: 'text', x: 64, y: 283, w: 1030, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'metric-1-value', type: 'text', x: 64, y: 447, w: 1030, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'metric-1-label', type: 'text', x: 64, y: 603, w: 1030, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 14. Metrics Three Cols (Node_4-2669)
export const csMetricsThreeCols: LayoutSpec = {
  id: 'cs-metrics-three-cols',
  description: '横向三栏指标数据',
  contentFields: ['title', 'captionLeft', 'captionRight', 'metrics:3'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: -452, y: 785, w: 2214, h: 730, src: 'a0e95a83cd50780443006568f1b38b32abbc4359.svg' },
    { type: 'svg', x: 64, y: 369, w: 1792, h: 0, src: '640fbc9fafd93cf8f47c6fbe9eba1c0b2bc5eb9d.svg' },
    { type: 'svg', x: 64, y: 551, w: 1792, h: 0, src: '640fbc9fafd93cf8f47c6fbe9eba1c0b2bc5eb9d.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 218, w: 1792, h: 150, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'metric-0-value', type: 'text', x: 64, y: 400, w: 421, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'metric-0-label', type: 'text', x: 64, y: 582, w: 516, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'metric-1-value', type: 'text', x: 674, y: 400, w: 421, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'metric-1-label', type: 'text', x: 674, y: 582, w: 515, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'metric-2-value', type: 'text', x: 1284, y: 400, w: 421, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'metric-2-label', type: 'text', x: 1283, y: 582, w: 529, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 15. Metrics Big Teal (Node_4-2682)
export const csMetricsBigTeal: LayoutSpec = {
  id: 'cs-metrics-big-teal',
  description: '深青色超大标题指标页',
  contentFields: ['title', 'captionLeft', 'captionRight', 'metrics:2'],
  canvas: { w: 1920, h: 1080, background: TEAL },
  decorations: [
    { type: 'svg', x: 787, y: -727, w: 2265, h: 1789, rotate: 90, src: 'df290153ed95a951f762dc8ce2579528c60e81b1.svg' },
    { type: 'svg', x: 64, y: 602, w: 1030, h: 0, src: 'f4627778eb065700a13dbe04f4842c7fd9acda88.svg' },
    { type: 'svg', x: 64, y: 922, w: 1030, h: 0, src: 'f4627778eb065700a13dbe04f4842c7fd9acda88.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 1126, y: 695, w: 736, h: 360, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'metric-0-value', type: 'text', x: 64, y: 390, w: 1030, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 382, color: GRAY, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'metric-0-label', type: 'text', x: 64, y: 546, w: 1030, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'metric-1-value', type: 'text', x: 64, y: 710, w: 1030, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 382, color: GRAY, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'metric-1-label', type: 'text', x: 64, y: 866, w: 1030, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 16. Timeline Zigzag (Node_4-2693)
export const csTimelineZigzag: LayoutSpec = {
  id: 'cs-timeline-zigzag',
  description: '交错式6节点时间轴',
  contentFields: ['title', 'captionLeft', 'captionRight', 'events:6'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 0, y: 593, w: 1991, h: 0, src: '9da2a79d2ce7d42325c1410e99a8bdb7ab100a25.svg' },
    { type: 'svg', x: 960, y: 151, w: 824, h: 403, rotate: 180, src: '411056c577547e428a983e19856b352a14e8d6b4.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 64, w: 1792, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    
    { id: 'event-0-date', type: 'text', x: 99, y: 220, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-0-title', type: 'text', x: 99, y: 300, w: 358, h: 30, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-0-body', type: 'text', x: 99, y: 330, w: 358, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    
    { id: 'event-1-date', type: 'text', x: 369, y: 630, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-1-title', type: 'text', x: 369, y: 710, w: 358, h: 30, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-1-body', type: 'text', x: 369, y: 740, w: 358, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    
    { id: 'event-2-date', type: 'text', x: 559, y: 220, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-2-title', type: 'text', x: 559, y: 300, w: 358, h: 30, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-2-body', type: 'text', x: 559, y: 330, w: 358, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },

    { id: 'event-3-date', type: 'text', x: 863, y: 630, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-3-title', type: 'text', x: 863, y: 710, w: 358, h: 30, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-3-body', type: 'text', x: 863, y: 740, w: 358, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },

    { id: 'event-4-date', type: 'text', x: 1015, y: 220, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-4-title', type: 'text', x: 1015, y: 300, w: 358, h: 30, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-4-body', type: 'text', x: 1015, y: 330, w: 358, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },

    { id: 'event-5-date', type: 'text', x: 1319, y: 630, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-5-title', type: 'text', x: 1319, y: 710, w: 358, h: 30, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-5-body', type: 'text', x: 1319, y: 740, w: 358, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 }
  ]
}

// 17. Timeline Horizontal (Node_4-2729)
export const csTimelineHorizontal: LayoutSpec = {
  id: 'cs-timeline-horizontal',
  description: '带贯穿线的横向4节点时间轴',
  contentFields: ['title', 'captionLeft', 'captionRight', 'events:4'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: -295, y: 665, w: 2905, h: 718, rotate: 180, src: '739a5a9503a393a4feb94279ff3761edbcf4ce68.svg' },
    { type: 'svg', x: 0, y: 627, w: 1856, h: 0, src: '961a12449bc3139db17a33f13a0a44494e6c7835.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 64, w: 1792, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    
    { id: 'event-0-date', type: 'text', x: 64, y: 301, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-0-title', type: 'text', x: 64, y: 400, w: 358, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-0-body', type: 'text', x: 64, y: 447, w: 358, h: 150, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },

    { id: 'event-1-date', type: 'text', x: 521, y: 301, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-1-title', type: 'text', x: 521, y: 400, w: 358, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-1-body', type: 'text', x: 521, y: 447, w: 358, h: 150, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },

    { id: 'event-2-date', type: 'text', x: 978, y: 301, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-2-title', type: 'text', x: 978, y: 400, w: 358, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-2-body', type: 'text', x: 978, y: 447, w: 358, h: 150, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },

    { id: 'event-3-date', type: 'text', x: 1435, y: 301, w: 358, h: 80, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4 },
    { id: 'event-3-title', type: 'text', x: 1435, y: 400, w: 358, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'event-3-body', type: 'text', x: 1435, y: 447, w: 358, h: 150, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 }
  ]
}

// 18. Diagram Features (Node_4-2747)
export const csDiagramFeatures: LayoutSpec = {
  id: 'cs-diagram-features',
  description: '左侧圆环图表+右侧3项特性',
  contentFields: ['title', 'captionLeft', 'captionRight', 'cards:3'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'image', x: 120, y: 243, w: 875, h: 582, src: '17d419f2673111646f22908c8b2eead325002550.svg' },
    { type: 'svg', x: 1130, y: 319, w: 63, h: 63, src: 'c32f2c5bdc096daf0d7ab2cda4fe5a4b4908fecc.svg' },
    { type: 'svg', x: 1130, y: 476, w: 63, h: 63, src: 'c3e9fc558f5fac0c77facb8ca83e264615f5a8f6.svg' },
    { type: 'svg', x: 1130, y: 633, w: 63, h: 63, src: '7794759460ec9644b43af7cf4ae0c1866130d606.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 64, w: 1792, h: 150, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    
    { id: 'card-0-body', type: 'text', x: 1215, y: 319, w: 355, h: 120, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'card-1-body', type: 'text', x: 1215, y: 476, w: 355, h: 120, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'card-2-body', type: 'text', x: 1215, y: 633, w: 355, h: 120, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 }
  ]
}

// 19. Diagram Features Data (Node_4-2767)
export const csDiagramFeaturesData: LayoutSpec = {
  id: 'cs-diagram-features-data',
  description: '左侧圆环占比图+四项数据特性',
  contentFields: ['title', 'captionLeft', 'captionRight', 'cards:4'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 1034, y: 824, w: 1007, h: 332, src: '7424c05e5b4b46b061fa07ac7364243601c1ba20.svg' },
    { type: 'svg', x: 341, y: 341, w: 405, h: 406, src: 'd4bd20c68ab26010d3849a09d1d05ef1e9eb71b6.svg' },
    { type: 'svg', x: 574, y: 343, w: 63, h: 63, src: 'c32f2c5bdc096daf0d7ab2cda4fe5a4b4908fecc.svg' },
    { type: 'svg', x: 574, y: 584, w: 63, h: 63, src: '7794759460ec9644b43af7cf4ae0c1866130d606.svg' },
    { type: 'svg', x: 1184, y: 343, w: 63, h: 63, src: '30c6d09d7301e31361b9024a333b98e5720cb980.svg' },
    { type: 'svg', x: 1184, y: 584, w: 63, h: 63, src: 'c3e9fc558f5fac0c77facb8ca83e264615f5a8f6.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 64, w: 1792, h: 150, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    
    { id: 'card-0-title', type: 'text', x: 674, y: 343, w: 370, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'card-0-body', type: 'text', x: 674, y: 387, w: 370, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    
    { id: 'card-1-title', type: 'text', x: 674, y: 584, w: 370, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'card-1-body', type: 'text', x: 674, y: 628, w: 370, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    
    { id: 'card-2-title', type: 'text', x: 1284, y: 343, w: 370, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'card-2-body', type: 'text', x: 1284, y: 387, w: 370, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    
    { id: 'card-3-title', type: 'text', x: 1284, y: 584, w: 370, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'card-3-body', type: 'text', x: 1284, y: 628, w: 370, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 }
  ]
}

// 20. Bar Graph (Node_4-2789)
export const csBarGraph: LayoutSpec = {
  id: 'cs-bar-graph',
  description: '深青色背景+彩色条形图对比',
  contentFields: ['title', 'captionLeft', 'captionRight', 'cards:2'],
  canvas: { w: 1920, h: 1080, background: TEAL },
  decorations: [
    { type: 'rect', x: 216, y: 370, w: 94, h: 400, fill: '#ff542d' },
    { type: 'rect', x: 369, y: 310, w: 94, h: 460, fill: GRAY },
    { type: 'rect', x: 521, y: 469, w: 94, h: 301, fill: '#d2b7e9' },
    { type: 'svg', x: 0, y: 770, w: 1652, h: 0, src: '83621cb82114170293c6cb10a002b009af135556.svg' },
    { type: 'svg', x: 1195, y: 370, w: 748, h: 980, rotate: 90, src: 'f1d8d7773451fe800a222a5136975ed1fac2a2df.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 64, w: 1792, h: 150, fontFamily: FH, fontSize: 120, fontWeight: 382, color: GRAY, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    
    { id: 'card-0-title', type: 'text', x: 826, y: 561, w: 400, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'card-0-body', type: 'text', x: 826, y: 622, w: 400, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: GRAY, lineHeight: 1.2 },
    
    { id: 'card-1-title', type: 'text', x: 1252, y: 561, w: 400, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'card-1-body', type: 'text', x: 1252, y: 622, w: 400, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: GRAY, lineHeight: 1.2 }
  ]
}

// 21. Image Macbook (Node_4-2805)
export const csImageMacbook: LayoutSpec = {
  id: 'cs-image-macbook',
  description: 'Macbook设备展示+右侧正文',
  contentFields: ['captionLeft', 'captionRight', 'title', 'body', 'image'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 195, y: -464, w: 1522, h: 745, rotate: 180, src: 'e711498bc8fb74e7bcfe361429410b4afca24196.svg' },
    { type: 'image', x: -28, y: 238, w: 1086, h: 658, objectFit: 'cover', src: '87da79d6303fc1b1117553e5a55830872743eaa0.png' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1792, h: 150, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'image', type: 'image', x: 82, y: 260, w: 866, h: 563, objectFit: 'fill' },
    { id: 'title', type: 'text', x: 1084, y: 378, w: 723, h: 160, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 1084, y: 562, w: 723, h: 250, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 22. Quote Teal (Node_4-2815)
export const csQuoteTeal: LayoutSpec = {
  id: 'cs-quote-teal',
  description: '深青色背景+超大引言',
  contentFields: ['title', 'captionLeft', 'captionRight', 'body'],
  canvas: { w: 1920, h: 1080, background: TEAL },
  decorations: [
    { type: 'svg', x: -279, y: 755, w: 2797, h: 966, src: '172e297183ed779b01e03d982e71add74b91dcfe.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 127, w: 1800, h: 300, fontFamily: FH, fontSize: 150, fontWeight: 382, color: GRAY, lineHeight: 0.8, letterSpacing: -4.5, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 64, y: 517, w: 1792, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 23. Quote Gray (Node_4-2821)
export const csQuoteGray: LayoutSpec = {
  id: 'cs-quote-gray',
  description: '亮灰色背景+超大引言',
  contentFields: ['title', 'captionLeft', 'captionRight', 'body'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: -367, y: -36, w: 2597, h: 590, src: '0d3b39ee98ad3d76fcb55593486f383f4af25031.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 593, w: 1800, h: 300, fontFamily: FH, fontSize: 150, fontWeight: 382, color: BLACK, lineHeight: 0.8, letterSpacing: -4.5, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 64, y: 983, w: 1792, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 24. Intro Teal (Node_4-2833)
export const csIntroTeal: LayoutSpec = {
  id: 'cs-intro-teal',
  description: '深青色背景+人物介绍页',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight', 'image'],
  canvas: { w: 1920, h: 1080, background: TEAL },
  decorations: [
    { type: 'svg', x: -308, y: 828, w: 2303, h: 349, src: '2b394fa076baff93e43ae843372aad9a89b98ee9.svg' }
  ],
  slots: [
    { id: 'image', type: 'image', x: 64, y: 206, w: 487, h: 487, objectFit: 'cover' },
    { id: 'title', type: 'text', x: 826, y: 185, w: 797, h: 150, fontFamily: FH, fontSize: 120, fontWeight: 382, color: GRAY, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 826, y: 479, w: 797, h: 300, fontFamily: FB, fontSize: 28, fontWeight: 400, color: GRAY, lineHeight: 1.2 },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 25. Team (Node_4-2840)
export const csTeam: LayoutSpec = {
  id: 'cs-team',
  description: '团队成员介绍（2人）',
  contentFields: ['title', 'captionLeft', 'captionRight', 'cards:2'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: -224, y: 848, w: 2892, h: 399, rotate: 180, src: 'debadf2316ca3eaf8315882a8789a3fe610a3763.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 185, w: 1792, h: 150, fontFamily: FH, fontSize: 120, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -3.6, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    
    { id: 'card-0-image', type: 'image', x: 64, y: 489, w: 254, h: 254, objectFit: 'cover' },
    { id: 'card-0-title', type: 'text', x: 369, y: 480, w: 565, h: 100, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase' },
    { id: 'card-0-subtitle', type: 'text', x: 369, y: 650, w: 565, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'card-0-body', type: 'text', x: 369, y: 694, w: 565, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },

    { id: 'card-1-image', type: 'image', x: 978, y: 489, w: 254, h: 254, objectFit: 'cover' },
    { id: 'card-1-title', type: 'text', x: 1283, y: 480, w: 565, h: 100, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase' },
    { id: 'card-1-subtitle', type: 'text', x: 1283, y: 650, w: 565, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'card-1-body', type: 'text', x: 1283, y: 694, w: 565, h: 100, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 }
  ]
}

// 26. CTA Orange (Node_4-2855)
export const csCtaOrange: LayoutSpec = {
  id: 'cs-cta-orange',
  description: '橙色背景+超大行动呼吁(CTA)',
  contentFields: ['title', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: '#ff542d' },
  decorations: [
    { type: 'svg', x: -367, y: 583, w: 2597, h: 590, rotate: 180, src: 'ecc04380f521037d79f821017d927c6aea03562e.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 127, w: 1030, h: 500, fontFamily: FH, fontSize: 150, fontWeight: 382, color: BLACK, lineHeight: 0.8, letterSpacing: -4.5, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 27. CTA Teal (Node_4-2861)
export const csCtaTeal: LayoutSpec = {
  id: 'cs-cta-teal',
  description: '深青色背景+超大行动呼吁(CTA)',
  contentFields: ['title', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: TEAL },
  decorations: [
    { type: 'svg', x: 773, y: -625, w: 2265, h: 1789, rotate: 90, src: '650e6345021cbf8c4456e7269760b79ac28a5191.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 127, w: 918, h: 500, fontFamily: FH, fontSize: 150, fontWeight: 382, color: GRAY, lineHeight: 0.8, letterSpacing: -4.5, textTransform: 'uppercase' },
    { id: 'captionLeft', type: 'text', x: 64, y: 64, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: GRAY, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 64, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 28. Image iPhone (Node_4-2867)
export const csImageIphone: LayoutSpec = {
  id: 'cs-image-iphone',
  description: 'iPhone设备模型展示+左侧正文',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight', 'image'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 1156, y: -463, w: 2905, h: 718, rotate: 90, src: '35e36d21e3b0286c326fd99e90116e34565b49f8.svg' },
    { type: 'image', x: 1103, y: 109, w: 401, h: 824, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png', zIndex: -1 }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 64, w: 723, h: 160, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 64, y: 248, w: 723, h: 500, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    { id: 'image', type: 'image', x: 1120, y: 124, w: 365, h: 792, objectFit: 'cover' },
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 29. Image iPhones 2 (Node_4-2876)
export const csImageIphones2: LayoutSpec = {
  id: 'cs-image-iphones-2',
  description: '两台iPhone设备展示+左侧内容',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight', 'images:2'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: 60, y: -88, w: 1522, h: 745, rotate: 90, src: 'bf94b73a53d74c5bf2b425c678638dc1eee568f9.svg' },
    { type: 'image', x: 124, y: 109, w: 401, h: 824, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png', zIndex: -1 },
    { type: 'image', x: 604, y: 109, w: 401, h: 824, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png', zIndex: -1 }
  ],
  slots: [
    { id: 'image-0', type: 'image', x: 141, y: 124, w: 365, h: 792, objectFit: 'cover' },
    { id: 'image-1', type: 'image', x: 621, y: 124, w: 365, h: 792, objectFit: 'cover' },
    
    { id: 'title', type: 'text', x: 1084, y: 378, w: 723, h: 160, fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 1084, y: 562, w: 723, h: 500, fontFamily: FB, fontSize: 28, fontWeight: 400, color: BLACK, lineHeight: 1.2 },
    
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 30. Image iPhones 3 (Node_4-2888)
export const csImageIphones3: LayoutSpec = {
  id: 'cs-image-iphones-3',
  description: '三台iPhone设备并排展示',
  contentFields: ['title', 'captionLeft', 'captionRight', 'images:3'],
  canvas: { w: 1920, h: 1080, background: GRAY },
  decorations: [
    { type: 'svg', x: -569, y: 334, w: 2298, h: 746, rotate: 180, src: 'd07792e4395b86d27e85c01510054e66221dce41.svg' },
    { type: 'image', x: 390, y: 250, w: 332, h: 683, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png', zIndex: -1 },
    { type: 'image', x: 788, y: 250, w: 332, h: 683, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png', zIndex: -1 },
    { type: 'image', x: 1198, y: 250, w: 332, h: 683, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png', zIndex: -1 }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 64, w: 1792, h: 160, align: 'center', fontFamily: FH, fontSize: 80, fontWeight: 382, color: BLACK, lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase' },
    
    { id: 'image-0', type: 'image', x: 404, y: 262, w: 302, h: 657, objectFit: 'cover' },
    { id: 'image-1', type: 'image', x: 802, y: 262, w: 302, h: 657, objectFit: 'cover' },
    { id: 'image-2', type: 'image', x: 1212, y: 262, w: 302, h: 657, objectFit: 'cover' },
    
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}

// 31. Image Macbook Teal (Node_4-2902)
export const csImageMacbookTeal: LayoutSpec = {
  id: 'cs-image-macbook-teal',
  description: '深青色背景+Macbook设备展示',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight', 'image'],
  canvas: { w: 1920, h: 1080, background: TEAL },
  decorations: [
    { type: 'svg', x: 355, y: 530, w: 2597, h: 590, src: '980ee80f63c08001ce18cc94cda20397d2555aad.svg' },
    { type: 'image', x: 811, y: 93, w: 1446, h: 876, src: '87da79d6303fc1b1117553e5a55830872743eaa0.png', zIndex: -1 }
  ],
  slots: [
    { id: 'title', type: 'text', x: 64, y: 64, w: 723, h: 160, fontFamily: FH, fontSize: 80, fontWeight: 382, color: GRAY, lineHeight: 1, letterSpacing: -2.4, textTransform: 'uppercase' },
    { id: 'body', type: 'text', x: 64, y: 248, w: 723, h: 500, fontFamily: FB, fontSize: 28, fontWeight: 400, color: GRAY, lineHeight: 1.2 },
    { id: 'image', type: 'image', x: 957, y: 122, w: 1153, h: 749, objectFit: 'fill' },
    
    { id: 'captionLeft', type: 'text', x: 64, y: 1024, w: 1093, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' },
    { id: 'captionRight', type: 'text', x: 1283, y: 1024, w: 573, h: 40, fontFamily: FB, fontSize: 28, fontWeight: 600, color: BLACK, lineHeight: 1, textTransform: 'uppercase' }
  ]
}
