import type { LayoutSpec } from '../../types'

const FH = "'Shippori Mincho', 'Noto Sans SC', serif"
const FB = "'Playfair Display', 'Noto Sans SC', serif"
const FI = "'Playfair Display', 'Noto Sans SC', serif"
const BG_PAPER_SRC = '35e56626f174259f1ab7fce23e37eaf437c37a51.png'
const BACKGROUND = '#ffffff'
const BLACK = '#000000'

function paperBg() {
  // Original Figma data: x=-38, y=-49, w=1995, h=1409, rotate=90
  // CSS rotate(90deg) rotates around center and does NOT swap the box dimensions,
  // causing the image to overflow the canvas in the wrong direction.
  // Solution: pre-compute the rotated coordinates by swapping w/h and adjusting x/y
  // so the paper texture fills the 1920×1080 canvas without CSS rotation.
  // After 90° rotation around center: new w=1409, new h=1995
  // Center of original box: cx = -38 + 1995/2 = 959.5, cy = -49 + 1409/2 = 655.5
  // New top-left: x = cx - 1409/2 = 255, y = cy - 1995/2 = -342
  // But we want full coverage, so stretch to fill canvas:
  return [
    { type: 'image' as const, x: -50, y: -50, w: 2020, h: 1180, src: BG_PAPER_SRC, objectFit: 'cover' as const, opacity: 0.3, zIndex: 0 }
  ]
}

// 1. Cover (Node_4-2072)
export const ppCover: LayoutSpec = {
  id: 'pp-cover',
  description: '封面页，大标题+剪纸装饰',
  contentFields: ['title', 'subtitle', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 395, y: 129, w: 1690, h: 1232, src: '26ba375a83c6b17998f90af04e168737e456c95d.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 90, y: 90, w: 1435, h: 300, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'subtitle', type: 'text', x: 1760, y: 241, w: 70, h: 597, fontFamily: FI, fontSize: 28, fontStyle: 'italic', color: BLACK, align: 'center', lineHeight: 1.25 },
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 30, fontFamily: FB, fontSize: 20, color: BLACK, lineHeight: 1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 30, fontFamily: FB, fontSize: 20, color: BLACK, align: 'right', lineHeight: 1 }
  ]
}

// 2. Chapter (Node_4-2079)
export const ppChapter: LayoutSpec = {
  id: 'pp-chapter',
  description: '章节过渡页',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 315, y: -46, w: 1690, h: 1232, rotate: 180, src: 'fd9f19c841fe80c6d683562db93941d2d1ad58df.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 125, y: 714, w: 1704, h: 250, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, align: 'right', lineHeight: 1.1 },
    { id: 'body', type: 'text', x: 51, y: 241, w: 70, h: 597, fontFamily: FI, fontSize: 28, fontStyle: 'italic', color: BLACK, align: 'center', lineHeight: 1.25 },
    { id: 'captionLeft', type: 'text', x: 90, y: 70, w: 163, h: 30, fontFamily: FB, fontSize: 20, color: BLACK, lineHeight: 1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 70, w: 65, h: 30, fontFamily: FB, fontSize: 20, color: BLACK, align: 'right', lineHeight: 1 }
  ]
}

// 3. Agenda 8 (Node_4-2086)
export const ppAgenda8: LayoutSpec = {
  id: 'pp-agenda-8',
  description: '双栏议程或目录列表（8项）',
  contentFields: ['title', 'captionLeft', 'captionRight', 'cards:8'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 510, y: -207, w: 1523, h: 1596, src: '5a2f63b4eb0676e2994f87ad68fe0cf080d94d3b.svg' }
  ],
  slots: [
    { id: 'title', type: 'text', x: 89, y: 70, w: 516, h: 250, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    
    { id: 'card-0-subtitle', type: 'text', x: 669, y: 75.5, w: 172, h: 160, fontFamily: FH, fontSize: 150, color: BLACK, lineHeight: 1.07 },
    { id: 'card-0-title', type: 'text', x: 905, y: 130.5, w: 290, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    
    { id: 'card-1-subtitle', type: 'text', x: 669, y: 300.5, w: 172, h: 160, fontFamily: FH, fontSize: 150, color: BLACK, lineHeight: 1.07 },
    { id: 'card-1-title', type: 'text', x: 905, y: 355.5, w: 290, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    
    { id: 'card-2-subtitle', type: 'text', x: 669, y: 525.5, w: 172, h: 160, fontFamily: FH, fontSize: 150, color: BLACK, lineHeight: 1.07 },
    { id: 'card-2-title', type: 'text', x: 905, y: 580.5, w: 290, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    
    { id: 'card-3-subtitle', type: 'text', x: 669, y: 750.5, w: 172, h: 160, fontFamily: FH, fontSize: 150, color: BLACK, lineHeight: 1.07 },
    { id: 'card-3-title', type: 'text', x: 905, y: 805.5, w: 290, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    
    { id: 'card-4-subtitle', type: 'text', x: 1225, y: 75.5, w: 172, h: 160, fontFamily: FH, fontSize: 150, color: BLACK, lineHeight: 1.07 },
    { id: 'card-4-title', type: 'text', x: 1461, y: 130.5, w: 290, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    
    { id: 'card-5-subtitle', type: 'text', x: 1225, y: 300.5, w: 172, h: 160, fontFamily: FH, fontSize: 150, color: BLACK, lineHeight: 1.07 },
    { id: 'card-5-title', type: 'text', x: 1461, y: 355.5, w: 290, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    
    { id: 'card-6-subtitle', type: 'text', x: 1225, y: 525.5, w: 172, h: 160, fontFamily: FH, fontSize: 150, color: BLACK, lineHeight: 1.07 },
    { id: 'card-6-title', type: 'text', x: 1461, y: 580.5, w: 290, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    
    { id: 'card-7-subtitle', type: 'text', x: 1225, y: 750.5, w: 172, h: 160, fontFamily: FH, fontSize: 150, color: BLACK, lineHeight: 1.07 },
    { id: 'card-7-title', type: 'text', x: 1461, y: 805.5, w: 290, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },

    { id: 'captionLeft', type: 'text', x: 89, y: 990, w: 163, h: 30, fontFamily: FB, fontSize: 20, color: BLACK, lineHeight: 1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 30, fontFamily: FB, fontSize: 20, color: BLACK, align: 'right', lineHeight: 1 }
  ]
}

// 4. Agenda 6 (Node_4-2108)
export const ppAgenda6: LayoutSpec = {
  id: 'pp-agenda-6',
  description: '双栏议程列表（4项）',
  contentFields: ['captionLeft', 'captionRight', 'cards:6'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 510, y: -207, w: 1523, h: 1596, src: '5a2f63b4eb0676e2994f87ad68fe0cf080d94d3b.svg' }
  ],
  slots: [
    { id: 'card-0-subtitle', type: 'text', x: 63, y: 53, w: 840, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    { id: 'card-0-title', type: 'text', x: 63, y: 121, w: 840, h: 100, fontFamily: FH, fontSize: 90, color: BLACK, lineHeight: 1 },
    
    { id: 'card-1-subtitle', type: 'text', x: 63, y: 391, w: 840, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-title', type: 'text', x: 63, y: 459, w: 840, h: 100, fontFamily: FH, fontSize: 90, color: BLACK, lineHeight: 1 },
    
    { id: 'card-2-subtitle', type: 'text', x: 63, y: 639, w: 840, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    { id: 'card-2-title', type: 'text', x: 63, y: 707, w: 840, h: 100, fontFamily: FH, fontSize: 90, color: BLACK, lineHeight: 1 },
    
    { id: 'card-3-subtitle', type: 'text', x: 1023, y: 53, w: 840, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    { id: 'card-3-title', type: 'text', x: 1023, y: 121, w: 840, h: 100, fontFamily: FH, fontSize: 90, color: BLACK, lineHeight: 1 },
    
    { id: 'card-4-subtitle', type: 'text', x: 1023, y: 391, w: 840, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    { id: 'card-4-title', type: 'text', x: 1023, y: 459, w: 840, h: 100, fontFamily: FH, fontSize: 90, color: BLACK, lineHeight: 1 },
    
    { id: 'card-5-subtitle', type: 'text', x: 1023, y: 639, w: 840, h: 50, fontFamily: FH, fontSize: 40, color: BLACK, lineHeight: 1.1 },
    { id: 'card-5-title', type: 'text', x: 1023, y: 707, w: 840, h: 100, fontFamily: FH, fontSize: 90, color: BLACK, lineHeight: 1 },

    { id: 'captionLeft', type: 'text', x: 89, y: 990, w: 163, h: 30, fontFamily: FB, fontSize: 20, color: BLACK, lineHeight: 1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 30, fontFamily: FB, fontSize: 20, color: BLACK, align: 'right', lineHeight: 1 }
  ]
}

// 5. Blurb (Node_4-2125)
export const ppBlurb: LayoutSpec = {
  id: 'pp-blurb',
  description: '大标题+侧栏旋转文字',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 272.9, y: -2304.39, w: 1865.118, h: 4314.762, src: '6f94b3a5a423fc51d35cf5d7330b366362a8a4e3.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 1578, h: 270, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'body', type: 'text', x: 1496, y: 505, w: 597, h: 70, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 6. Agenda 4 (Node_4-2132)
export const ppAgenda4: LayoutSpec = {
  id: 'pp-agenda-4',
  description: '四项议程+编号圆圈',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight', 'cards:4'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 110, y: -85, w: 525, h: 1220, src: '1d15bd643751b58c0937aa48f53a55b29fda4232.svg' },
    { type: 'svg', x: 674, y: 90, w: 70, h: 70, src: '9e796af5e0b47781d1fc2cab3ac0548b791d66af.svg' },
    { type: 'svg', x: 674, y: 204, w: 70, h: 70, src: '9e796af5e0b47781d1fc2cab3ac0548b791d66af.svg' },
    { type: 'svg', x: 674, y: 318, w: 70, h: 70, src: '9e796af5e0b47781d1fc2cab3ac0548b791d66af.svg' },
    { type: 'svg', x: 674, y: 432, w: 70, h: 70, src: '9e796af5e0b47781d1fc2cab3ac0548b791d66af.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 520, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'body', type: 'text', x: 1348, y: 488, w: 858, h: 105, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-0-subtitle', type: 'text', x: 674, y: 95, w: 70, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: '#30290e', lineHeight: 1.1, align: 'center', zIndex: 1 },
    { id: 'card-0-title', type: 'text', x: 770, y: 90, w: 902, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-subtitle', type: 'text', x: 674, y: 209, w: 70, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: '#30290e', lineHeight: 1.1, align: 'center', zIndex: 1 },
    { id: 'card-1-title', type: 'text', x: 770, y: 204, w: 902, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-2-subtitle', type: 'text', x: 674, y: 323, w: 70, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: '#30290e', lineHeight: 1.1, align: 'center', zIndex: 1 },
    { id: 'card-2-title', type: 'text', x: 770, y: 318, w: 902, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-3-subtitle', type: 'text', x: 674, y: 437, w: 70, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: '#30290e', lineHeight: 1.1, align: 'center', zIndex: 1 },
    { id: 'card-3-title', type: 'text', x: 770, y: 432, w: 902, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 7. Two Columns (Node_4-2159)
export const ppColumns2: LayoutSpec = {
  id: 'pp-columns-2',
  description: '双栏正文布局',
  contentFields: ['title', 'col0', 'col1', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: -101.38, y: 458.99, w: 2215.932, h: 690.65, src: 'f7d9e342430a4a0ef99ebf18887288060d09b3d4.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 1702, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'col0', type: 'text', x: 90, y: 280, w: 826, h: 500, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'col1', type: 'text', x: 966, y: 280, w: 826, h: 500, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 8. Title + 3 Cards (Node_4-2167)
export const ppTitleCols3: LayoutSpec = {
  id: 'pp-title-cols-3',
  description: '标题+三栏卡片',
  contentFields: ['title', 'captionLeft', 'captionRight', 'cards:3'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 652.61, y: -331.79, w: 1362.797, h: 782.387, src: '236ad922450e18fa3ac45f135aa2ffe76279bfe5.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 80, y: 90, w: 1742, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-0-title', type: 'text', x: 80, y: 591, w: 566, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-0-body', type: 'text', x: 80, y: 671, w: 566, h: 300, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-1-title', type: 'text', x: 670, y: 591, w: 566, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-body', type: 'text', x: 670, y: 671, w: 566, h: 300, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-2-title', type: 'text', x: 1260, y: 591, w: 566, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-2-body', type: 'text', x: 1260, y: 671, w: 566, h: 300, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 9. Title Bottom Text (Node_4-2179)
export const ppTitleBottomText: LayoutSpec = {
  id: 'pp-title-bottom-text',
  description: '大标题+底部正文',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 151, y: 6, w: 525, h: 1220, rotate: 180, src: '2a4c4d7c64565f871cdd0204c53951447b0a4de2.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 1720, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'body', type: 'text', x: 686, y: 650, w: 1121, h: 220, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 10. Title + Side Image (Node_4-2186)
export const ppTitleImageSide: LayoutSpec = {
  id: 'pp-title-image-side',
  description: '标题+侧边旋转大图',
  contentFields: ['title', 'heading', 'body', 'image', 'sideBody', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'image', type: 'image', x: 722, y: 11, w: 1422, h: 1066 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 889, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'heading', type: 'text', x: 90, y: 585, w: 845, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'body', type: 'text', x: 90, y: 665, w: 845, h: 300, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'sideBody', type: 'text', x: 1496, y: 505, w: 597, h: 70, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 11. Title + Image Top (Node_4-2195)
export const ppTitleImageTop: LayoutSpec = {
  id: 'pp-title-image-top',
  description: '左上大图+右侧文字',
  contentFields: ['title', 'body', 'image', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'image', type: 'image', x: -325, y: 19, w: 1397, h: 1048 },
    { id: 'title', type: 'text', x: 985, y: 149, w: 845, h: 200, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'body', type: 'text', x: 985, y: 470, w: 845, h: 300, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 12. Horiz Image + Title (Node_4-2202)
export const ppImageHorizTitle: LayoutSpec = {
  id: 'pp-image-horiz-title',
  description: '横向大图+标题正文',
  contentFields: ['title', 'body', 'image', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'image', type: 'image', x: 631, y: -795, w: 441, h: 2306 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 1740, h: 100, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'body', type: 'text', x: 89, y: 569, w: 988, h: 200, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 13. Agenda 4 + Image (Node_4-2209)
export const ppAgenda4Image: LayoutSpec = {
  id: 'pp-agenda-4-image',
  description: '四项议程+左侧大图',
  contentFields: ['title', 'body', 'image', 'captionLeft', 'captionRight', 'cards:4'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'image', type: 'image', x: -87, y: 351, w: 727, h: 812 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 520, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'body', type: 'text', x: 1348, y: 488, w: 858, h: 105, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-0-subtitle', type: 'text', x: 674, y: 95, w: 70, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: '#30290e', lineHeight: 1.1, align: 'center', zIndex: 1 },
    { id: 'card-0-title', type: 'text', x: 770, y: 90, w: 902, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-subtitle', type: 'text', x: 674, y: 209, w: 70, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: '#30290e', lineHeight: 1.1, align: 'center', zIndex: 1 },
    { id: 'card-1-title', type: 'text', x: 770, y: 204, w: 902, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-2-subtitle', type: 'text', x: 674, y: 323, w: 70, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: '#30290e', lineHeight: 1.1, align: 'center', zIndex: 1 },
    { id: 'card-2-title', type: 'text', x: 770, y: 318, w: 902, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-3-subtitle', type: 'text', x: 674, y: 437, w: 70, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: '#30290e', lineHeight: 1.1, align: 'center', zIndex: 1 },
    { id: 'card-3-title', type: 'text', x: 770, y: 432, w: 902, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 14. Title + Bottom Text + Images (Node_4-2236)
export const ppTitleBottomTextImages: LayoutSpec = {
  id: 'pp-title-bottom-text-images',
  description: '标题+双图+底部正文',
  contentFields: ['title', 'body', 'captionLeft', 'captionRight', 'image0', 'image1'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 770, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'image0', type: 'image', x: 758, y: 0, w: 403, h: 452 },
    { id: 'image1', type: 'image', x: 1117, y: 0, w: 810, h: 426 },
    { id: 'body', type: 'text', x: 686, y: 650, w: 1121, h: 220, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 15. Title + Cols + Horiz Image (Node_4-2244)
export const ppTitleColsHorizImage: LayoutSpec = {
  id: 'pp-title-cols-horiz-image',
  description: '标题+横图+三栏卡片',
  contentFields: ['title', 'image', 'captionLeft', 'captionRight', 'cards:3'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 1193, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'image', type: 'image', x: 627, y: 0, w: 1300, h: 563 },
    { id: 'card-0-title', type: 'text', x: 80, y: 591, w: 566, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-0-body', type: 'text', x: 80, y: 671, w: 566, h: 300, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-1-title', type: 'text', x: 670, y: 591, w: 566, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-body', type: 'text', x: 670, y: 671, w: 566, h: 300, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-2-title', type: 'text', x: 1260, y: 591, w: 566, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-2-body', type: 'text', x: 1260, y: 671, w: 566, h: 300, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 16. Stats 4 (Node_4-2256)
export const ppStats4: LayoutSpec = {
  id: 'pp-stats-4',
  description: '四项关键数据指标',
  contentFields: ['title', 'captionLeft', 'captionRight', 'metrics:4'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 110, y: -85, w: 525, h: 1220, src: '1d15bd643751b58c0937aa48f53a55b29fda4232.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 60, w: 529, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'metric-0-value', type: 'text', x: 677, y: 26, w: 557, h: 200, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-0-label', type: 'text', x: 1282, y: 26, w: 557, h: 200, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-1-value', type: 'text', x: 677, y: 238, w: 557, h: 200, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-1-label', type: 'text', x: 1282, y: 238, w: 557, h: 200, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-2-value', type: 'text', x: 677, y: 450, w: 557, h: 200, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-2-label', type: 'text', x: 1282, y: 450, w: 557, h: 200, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-3-value', type: 'text', x: 677, y: 662, w: 557, h: 200, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-3-label', type: 'text', x: 1282, y: 662, w: 557, h: 200, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 17. Stats 3 (Node_4-2270)
export const ppStats3: LayoutSpec = {
  id: 'pp-stats-3',
  description: '三栏关键数据+描述',
  contentFields: ['title', 'captionLeft', 'captionRight', 'metrics:3'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 778, y: -526, w: 413, h: 2141, rotate: 83.8, src: '15bbc85d6639ddd8ac7a7fba0ee17dd869344ac1.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 91, w: 1740, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'metric-0-value', type: 'text', x: 80, y: 495, w: 545, h: 200, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-0-label', type: 'text', x: 80, y: 751, w: 545, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-0-body', type: 'text', x: 80, y: 831, w: 545, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'metric-1-value', type: 'text', x: 681, y: 495, w: 545, h: 200, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-1-label', type: 'text', x: 681, y: 751, w: 545, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-1-body', type: 'text', x: 681, y: 831, w: 545, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'metric-2-value', type: 'text', x: 1282, y: 495, w: 545, h: 200, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-2-label', type: 'text', x: 1282, y: 751, w: 545, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'metric-2-body', type: 'text', x: 1282, y: 831, w: 545, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 18. Big Number (Node_4-2286)
export const ppBigNumber: LayoutSpec = {
  id: 'pp-big-number',
  description: '大数字标题+正文',
  contentFields: ['number', 'title', 'body', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: -164.81, y: -315.98, w: 1482.033, h: 850.298, src: 'ed5fcc5cfd2ac448b03034850ca28fbe7501e6db.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'number', type: 'text', x: 90, y: 645, w: 421, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'title', type: 'text', x: 583, y: 645, w: 1206, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'body', type: 'text', x: 583, y: 784, w: 1206, h: 200, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 19. Timeline Right (Node_4-2325)
export const ppTimelineRight: LayoutSpec = {
  id: 'pp-timeline-right',
  description: '右对齐年份时间轴（4项）',
  contentFields: ['title', 'captionLeft', 'captionRight', 'cards:4'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 110, y: -85, w: 525, h: 1220, src: '1d15bd643751b58c0937aa48f53a55b29fda4232.svg' }
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 1686, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-0-subtitle', type: 'text', x: 1569, y: 311, w: 207, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-0-title', type: 'text', x: 656, y: 311, w: 286, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-0-body', type: 'text', x: 982, y: 311, w: 547, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-1-subtitle', type: 'text', x: 1569, y: 466, w: 207, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-1-title', type: 'text', x: 656, y: 466, w: 286, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-body', type: 'text', x: 982, y: 466, w: 547, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-2-subtitle', type: 'text', x: 1569, y: 621, w: 207, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-2-title', type: 'text', x: 656, y: 621, w: 286, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-2-body', type: 'text', x: 982, y: 621, w: 547, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-3-subtitle', type: 'text', x: 1569, y: 790, w: 207, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-3-title', type: 'text', x: 656, y: 790, w: 286, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-3-body', type: 'text', x: 982, y: 790, w: 547, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 20. Timeline 5 (Node_4-2294)
export const ppTimeline5: LayoutSpec = {
  id: 'pp-timeline-5',
  description: '5步交错时间轴',
  contentFields: ['title', 'captionLeft', 'captionRight', 'cards:5'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 778, y: -441, w: 413, h: 2141, rotate: 83.8, src: '15bbc85d6639ddd8ac7a7fba0ee17dd869344ac1.svg' },
    { type: 'svg', x: 90, y: 634, w: 248, h: 1.5, src: '4c1c5a652e259940f9b04c8d17d32640e43f1837.svg' },
    { type: 'svg', x: 387, y: 633, w: 547, h: 1.5, src: 'abc57ff36a399e93f076482e3007009c58bb9c0a.svg' },
    { type: 'svg', x: 362, y: 305, w: 1.5, h: 267, src: '55416996cef59d760721ff24a994106a45f6ddc0.svg' },
    { type: 'svg', x: 959, y: 305, w: 1.5, h: 267, src: '55416996cef59d760721ff24a994106a45f6ddc0.svg' },
    { type: 'svg', x: 1557, y: 305, w: 1.5, h: 267, src: '55416996cef59d760721ff24a994106a45f6ddc0.svg' },
    { type: 'svg', x: 662, y: 648, w: 1.5, h: 275, src: 'b58c81682a73476b976a8dd1df8ff04a81b55b0a.svg' },
    { type: 'svg', x: 1257, y: 648, w: 1.5, h: 272, src: '890b98c44e0926b650ac06aa000c986400d0d432.svg' },
    { type: 'svg', x: 985, y: 634, w: 248, h: 1.5, src: 'ff5e054ac8b20234bebf94106749d584ca971f92.svg' },
    { type: 'svg', x: 1283, y: 634, w: 248, h: 1.5, src: 'fc938d5f6d615cd22a9df42aa222f8459c8e8221.svg' },
    { type: 'svg', x: 1581, y: 634, w: 248, h: 1.5, src: '9cbb9633abb5b62a67750be24350ac637e3f961b.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 1717, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-0-subtitle', type: 'text', x: 342, y: 573, w: 41, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-0-title', type: 'text', x: 386, y: 304, w: 250, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-0-body', type: 'text', x: 386, y: 368, w: 250, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-1-subtitle', type: 'text', x: 641, y: 573, w: 41, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-1-title', type: 'text', x: 687, y: 719, w: 250, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-body', type: 'text', x: 687, y: 780, w: 250, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-2-subtitle', type: 'text', x: 939, y: 573, w: 41, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-2-title', type: 'text', x: 983, y: 304, w: 250, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-2-body', type: 'text', x: 983, y: 380, w: 250, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-3-subtitle', type: 'text', x: 1236, y: 573, w: 41, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-3-title', type: 'text', x: 1281, y: 719, w: 250, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-3-body', type: 'text', x: 1281, y: 780, w: 250, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-4-subtitle', type: 'text', x: 1537, y: 573, w: 41, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-4-title', type: 'text', x: 1581, y: 304, w: 250, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-4-body', type: 'text', x: 1581, y: 368, w: 250, h: 100, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 21. Mindmap (Node_4-2343)
export const ppMindmap: LayoutSpec = {
  id: 'pp-mindmap',
  description: '四象限思维导图',
  contentFields: ['title', 'captionLeft', 'captionRight', 'axisLeft', 'axisRight', 'axisTop', 'axisBottom', 'diagTl', 'diagBr', 'diagBl', 'diagTr'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 249, y: 603.5, w: 1420, h: 3, src: '3104f4f3800291e1a4727078d9e452ddd39d2c9a.svg' },
    { type: 'svg', x: 671.5, y: 316, w: 577, h: 3, rotate: 90, src: '3f35f1038552b49fd1eb98b2dae3da424f94b332.svg' },
    { type: 'svg', x: 355, y: 295, w: 227, h: 221, src: 'eb09b8104e827e15d55cfb4a2a0959aa0c420934.svg' },
    { type: 'svg', x: 1208, y: 676, w: 218, h: 217, src: '5d7a7f4a95e1b2527e441e01a0b9b47c3298f93c.svg' },
    { type: 'svg', x: 716, y: 656, w: 128, h: 128, src: 'c9ba1bdb5c3c6fe2ab5bc208c4d578a64c25b573.svg' },
    { type: 'svg', x: 1240, y: 263, w: 158, h: 157, src: '4e2d69fe118d423262ed39857f9b7270dab260a1.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 91, w: 1740, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'axisLeft', type: 'text', x: 90, y: 572, w: 122, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, align: 'right', lineHeight: 1.1 },
    { id: 'axisRight', type: 'text', x: 1708, y: 572, w: 122, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'axisTop', type: 'text', x: 899, y: 223, w: 122, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, align: 'center', lineHeight: 1.1 },
    { id: 'axisBottom', type: 'text', x: 898, y: 915, w: 122, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, align: 'center', lineHeight: 1.1 },
    { id: 'diagTl', type: 'text', x: 379, y: 390, w: 178, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'diagBr', type: 'text', x: 1267, y: 769, w: 100, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'diagBl', type: 'text', x: 730, y: 705, w: 100, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'diagTr', type: 'text', x: 1269, y: 326, w: 100, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 22. Venn Text (Node_4-2366)
export const ppVennText: LayoutSpec = {
  id: 'pp-venn-text',
  description: '维恩图+文字要点',
  contentFields: ['title', 'captionLeft', 'captionRight', 'vennLeft', 'vennCenter', 'vennRight', 'point0', 'point1', 'point2'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 1220, y: 347, w: 529, h: 642, src: '110b76eb71de427824e7fe9477a74fabf4fbc73a.svg' },
    { type: 'svg', x: 686, y: 347, w: 534, h: 642, src: 'e41bbc4aeacc8c59bec538ed8a98382aa98a0b90.svg' },
    { type: 'svg', x: 88, y: 540, w: 95, h: 94, src: 'd03d6b3b84973060b7596009478c4ca2947644d9.svg' },
    { type: 'svg', x: 88, y: 704, w: 94, h: 91, src: '9341462ff7624502718e2e5675f8b9fc8f79f002.svg' },
    { type: 'svg', x: 88, y: 865, w: 92, h: 93, src: '0b661026556b805ad88167aff9d53713636d9c7f.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 89, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 1739, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'vennLeft', type: 'text', x: 874, y: 676, w: 82, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'vennCenter', type: 'text', x: 1179, y: 676, w: 82, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'vennRight', type: 'text', x: 1475, y: 676, w: 82, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'point0', type: 'text', x: 218, y: 560, w: 418, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'point1', type: 'text', x: 217, y: 724, w: 418, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'point2', type: 'text', x: 217, y: 885, w: 418, h: 30, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 23. Phone Horiz (Node_4-2382)
export const ppPhoneHoriz: LayoutSpec = {
  id: 'pp-phone-horiz',
  description: '横向手机样机+屏幕截图',
  contentFields: ['title', 'screen', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: -29, y: -217, w: 1824, h: 1763, src: '788a6a588b238b807954f050771d962adae26713.svg' },
    { type: 'image', x: 645, y: -106, w: 630, h: 1293, rotate: 270, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png' },
    { type: 'image', x: 645, y: -106, w: 630, h: 1293, rotate: 270, src: '43e7918bdb5051d2c77508d8ffa0fcd5b8185746.png' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'screen', type: 'image', x: 673, y: -82, w: 574, h: 1244 },
    { id: 'title', type: 'text', x: 314, y: 901, w: 1293, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, align: 'center', color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 24. Phones Vert 2 (Node_4-2391)
export const ppPhonesVert2: LayoutSpec = {
  id: 'pp-phones-vert-2',
  description: '双竖向手机样机',
  contentFields: ['title', 'body', 'sideText', 'screen0', 'screen1', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 21, y: -217, w: 1824, h: 1763, src: '788a6a588b238b807954f050771d962adae26713.svg' },
    { type: 'image', x: 1202, y: 90, w: 443, h: 910, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png' },
    { type: 'image', x: 1202, y: 90, w: 443, h: 910, src: '43e7918bdb5051d2c77508d8ffa0fcd5b8185746.png' },
    { type: 'image', x: 686, y: 90, w: 443, h: 910, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png' },
    { type: 'image', x: 686, y: 90, w: 443, h: 910, src: '43e7918bdb5051d2c77508d8ffa0fcd5b8185746.png' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 93, y: 93, w: 779, h: 90, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'body', type: 'text', x: 90, y: 660, w: 546, h: 200, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'sideText', type: 'text', x: 1496, y: 505, w: 597, h: 70, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'screen0', type: 'image', x: 706, y: 107, w: 404, h: 876 },
    { id: 'screen1', type: 'image', x: 1222, y: 107, w: 404, h: 876 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 25. Phone Text Mixed (Node_4-2405)
export const ppPhoneTextMixed: LayoutSpec = {
  id: 'pp-phone-text-mixed',
  description: '手机样机+两组文字',
  contentFields: ['screen', 'captionLeft', 'captionRight', 'cards:2'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: -29, y: -87, w: 1824, h: 1763, src: '788a6a588b238b807954f050771d962adae26713.svg' },
    { type: 'image', x: 1100, y: 196, w: 738, h: 1515, src: 'b3c2d0d39ef8d164ef4f6b454cd7ea3eadde1799.png', objectFit: 'cover' },
    { type: 'image', x: 1100, y: 196, w: 738, h: 1515, src: '43e7918bdb5051d2c77508d8ffa0fcd5b8185746.png', objectFit: 'cover' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'screen', type: 'image', x: 1132, y: 224, w: 673, h: 1460 },
    { id: 'card-0-title', type: 'text', x: 1534, y: 280, w: 353, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1, zIndex: 1 },
    { id: 'card-0-body', type: 'text', x: 1534, y: 352, w: 353, h: 200, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25, zIndex: 1 },
    { id: 'card-1-title', type: 'text', x: 90, y: 655, w: 353, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-body', type: 'text', x: 90, y: 727, w: 353, h: 200, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 26. Macbook Text (Node_4-2418)
export const ppMacbookText: LayoutSpec = {
  id: 'pp-macbook-text',
  description: '笔记本样机+标题正文',
  contentFields: ['title', 'body', 'screen', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: -154, y: -178, w: 1523, h: 1596, rotate: 180, src: 'd61fb71a71b35540ed15781a8fec014bc263ac25.svg' },
    { type: 'image', x: 834, y: 153, w: 1276, h: 774, src: '87da79d6303fc1b1117553e5a55830872743eaa0.png' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'screen', type: 'image', x: 963, y: 179, w: 1019, h: 662 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 1063, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'body', type: 'text', x: 90, y: 490, w: 547, h: 300, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 27. Macbook Cols (Node_4-2429)
export const ppMacbookCols: LayoutSpec = {
  id: 'pp-macbook-cols',
  description: '居中笔记本样机+两栏',
  contentFields: ['screen', 'captionLeft', 'captionRight', 'cards:2'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 143, y: -395, w: 1856, h: 1772, rotate: -90, src: 'ee9cb10d2bd442d26ac6a9d4673f6a8bce73a027.svg' },
    { type: 'image', x: 310, y: 147, w: 1300, h: 787, src: '87da79d6303fc1b1117553e5a55830872743eaa0.png' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'screen', type: 'image', x: 442, y: 172, w: 1037, h: 674 },
    { id: 'card-0-title', type: 'text', x: 90, y: 469, w: 273, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-0-body', type: 'text', x: 90, y: 541, w: 273, h: 200, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'card-1-title', type: 'text', x: 1557, y: 469, w: 273, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-body', type: 'text', x: 1557, y: 541, w: 273, h: 200, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 28. Quote Author (Node_4-2441)
export const ppQuoteAuthor: LayoutSpec = {
  id: 'pp-quote-author',
  description: '大引言+作者署名',
  contentFields: ['quote', 'author', 'title', 'sideText', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 315, y: -46, w: 1690, h: 1232, rotate: 180, src: 'fd9f19c841fe80c6d683562db93941d2d1ad58df.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'quote', type: 'text', x: 90, y: 90, w: 1576, h: 500, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'author', type: 'text', x: 90, y: 605, w: 448, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'title', type: 'text', x: 90, y: 685, w: 448, h: 40, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'sideText', type: 'text', x: 1496, y: 505, w: 597, h: 70, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 29. Quote Right (Node_4-2450)
export const ppQuoteRight: LayoutSpec = {
  id: 'pp-quote-right',
  description: '右对齐大引言+作者',
  contentFields: ['quote', 'author', 'title', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: -39, y: -46, w: 1690, h: 1232, rotate: 180, src: '336cc112eebc0563eba32fee569e1069eb7b99fb.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'quote', type: 'text', x: 125, y: 307, w: 1705, h: 300, align: 'right', fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'author', type: 'text', x: 1382, y: 809, w: 448, h: 60, align: 'right', fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'title', type: 'text', x: 1382, y: 889, w: 448, h: 40, align: 'right', fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 30. Team Profile (Node_4-2458)
export const ppTeamProfile: LayoutSpec = {
  id: 'pp-team-profile',
  description: '团队成员单人大图介绍',
  contentFields: ['title', 'name', 'role', 'body', 'image', 'sideText', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 768, h: 264, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'image', type: 'image', x: 858, y: 65, w: 972, h: 1086 },
    { id: 'name', type: 'text', x: 90, y: 525, w: 714, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'role', type: 'text', x: 90, y: 605, w: 714, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'body', type: 'text', x: 90, y: 685, w: 714, h: 200, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'sideText', type: 'text', x: 1496, y: 505, w: 597, h: 70, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 31. Team Cols 3 (Node_4-2469)
export const ppTeamCols3: LayoutSpec = {
  id: 'pp-team-cols-3',
  description: '三栏团队成员（带头像）',
  contentFields: ['title', 'captionLeft', 'captionRight', 'sideText', 'cards:3'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 93, y: 93, w: 1624, h: 120, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'card-0-image', type: 'image', x: 85, y: 341, w: 433, h: 356 },
    { id: 'card-1-image', type: 'image', x: 681, y: 341, w: 367, h: 357 },
    { id: 'card-2-image', type: 'image', x: 1278, y: 341, w: 381, h: 356 },
    { id: 'card-0-title', type: 'text', x: 77, y: 724, w: 448, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, align: 'center', color: BLACK, lineHeight: 1.1 },
    { id: 'card-0-subtitle', type: 'text', x: 77, y: 804, w: 448, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, align: 'center', color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-title', type: 'text', x: 681, y: 724, w: 448, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, align: 'center', color: BLACK, lineHeight: 1.1 },
    { id: 'card-1-subtitle', type: 'text', x: 681, y: 804, w: 448, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, align: 'center', color: BLACK, lineHeight: 1.1 },
    { id: 'card-2-title', type: 'text', x: 1278, y: 724, w: 448, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, align: 'center', color: BLACK, lineHeight: 1.1 },
    { id: 'card-2-subtitle', type: 'text', x: 1278, y: 804, w: 448, h: 60, fontFamily: FH, fontSize: 40, fontWeight: 400, align: 'center', color: BLACK, lineHeight: 1.1 },
    { id: 'sideText', type: 'text', x: 1496, y: 505, w: 597, h: 70, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 32. Title Side Text (Node_4-2484)
export const ppTitleSideText: LayoutSpec = {
  id: 'pp-title-side-text',
  description: '标题页+侧栏装饰',
  contentFields: ['title', 'sideText', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 543, y: -272, w: 1523, h: 1596, rotate: 180, src: 'd61fb71a71b35540ed15781a8fec014bc263ac25.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 90, w: 845, h: 264, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'sideText', type: 'text', x: 1496, y: 505, w: 597, h: 70, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 33. Title Side Text Right (Node_4-2492)
export const ppTitleSideTextRight: LayoutSpec = {
  id: 'pp-title-side-text-right',
  description: '居中标题+侧栏装饰（右侧）',
  contentFields: ['title', 'sideText', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: -154, y: -272, w: 1523, h: 1596, rotate: 180, src: 'd61fb71a71b35540ed15781a8fec014bc263ac25.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 985, y: 558, w: 666, h: 120, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'sideText', type: 'text', x: 1496, y: 505, w: 597, h: 70, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 34. Thanks Text (Node_4-2500)
export const ppThanksText: LayoutSpec = {
  id: 'pp-thanks-text',
  description: '感谢页+副标题',
  contentFields: ['title', 'subtitle', 'sideText', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: -100, y: 493, w: 2140, h: 679, src: 'ced28f79b745f7c23c9f4eac7269daa7a15395ed.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 90, y: 116, w: 775, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'subtitle', type: 'text', x: 919, y: 116, w: 813, h: 200, fontFamily: FH, fontSize: 90, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'sideText', type: 'text', x: 1496, y: 505, w: 597, h: 70, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', align: 'center', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

// 35. Thanks End (Node_4-2509)
export const ppThanksEnd: LayoutSpec = {
  id: 'pp-thanks-end',
  description: '结束感谢页+旋转装饰',
  contentFields: ['title', 'sideText', 'captionLeft', 'captionRight'],
  canvas: { w: 1920, h: 1080, background: BACKGROUND },
  decorations: [
    ...paperBg(),
    { type: 'svg', x: 172, y: -806, w: 1523, h: 1596, rotate: -25, src: 'b8516a32fc25a608101399fcdf402fdd82538174.svg' },
  ],
  slots: [
    { id: 'captionLeft', type: 'text', x: 90, y: 990, w: 163, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, color: BLACK, lineHeight: 1 },
    { id: 'title', type: 'text', x: 125, y: 463, w: 1558, h: 120, fontFamily: FH, fontSize: 120, fontWeight: 400, color: BLACK, lineHeight: 1.1 },
    { id: 'sideText', type: 'text', x: 1349, y: 488, w: 858, h: 105, fontFamily: FI, fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: BLACK, lineHeight: 1.25 },
    { id: 'captionRight', type: 'text', x: 1765, y: 990, w: 65, h: 20, fontFamily: FI, fontSize: 20, fontWeight: 400, align: 'right', color: BLACK, lineHeight: 1 },
  ]
}

