//目前弃用，项目现在使用universal-exporter.ts导出

import PptxGenJS from 'pptxgenjs'
import { Presentation, SlideContent } from '../types'
import { getTemplatePack } from '../templates/registry'
import { TemplatePack } from '../templates/index'
import { getPackPptxConfig } from './pack-pptx-configs'
import { getSeriesColorPalette, toPptxHex } from '../utils/chart-utils'
import { getDensityClass, getDensityScale } from '../utils/density-utils'
import { deriveReadableTokens, ensureContrast, normalizeHex } from '../utils/color-contrast'
import { layoutSpecs, SLIDE_W, SLIDE_H } from '../layout-specs'

// Legacy constants kept for compatibility
const PAD_X = 0.8
const PAD_Y = 0.5
const CARD_GAP = 0.3
const CARD_RADIUS = 0.12
const CARD_SHADOW: any = { type: 'outer', color: '000000', opacity: 0.1, blur: 10, offset: 4 }
const F = layoutSpecs.fonts  // Font size shorthand
// F_SCALE is now integrated into layoutSpecs.fonts mapping (0.75x)


// Premium Icon Library (Hand-curated Remix Icons)
const ICON_MAP: Record<string, string> = {
  target: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12V2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2V12Z"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C9.33333 14 4 15.3333 4 18V20H20V18C20 15.3333 14.6667 14 12 14Z"/></svg>`,
  team: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 12C7.79086 12 6 10.2091 6 8C6 5.79086 7.79086 4 10 4C12.2091 4 14 5.79086 14 8C14 10.2091 12.2091 12 10 12ZM17 4.33579C18.4116 4.75033 19.5 6.04968 19.5 7.6C19.5 9.15032 18.4116 10.4497 17 10.8642V12.9231C19.6053 12.4497 21.5 10.2472 21.5 7.6C21.5 4.95275 19.6053 2.75034 17 2.27692V4.33579ZM17 15.1162C18.6631 15.5453 20.0129 16.6306 20.748 18.0469C21.5164 19.524 22 21.2127 22 23H20C20 21.5583 19.6548 20.1977 19.0494 18.9959C18.6575 18.2178 17.8943 17.5677 17 17.132V15.1162Z"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2.04932 12.9999H7.52725C7.70624 16.2688 8.7574 19.3053 10.452 21.8809C5.98761 21.1871 2.5001 17.5402 2.04932 12.9999ZM2.04932 10.9999C2.5001 6.45968 5.98761 2.81276 10.452 2.11902C8.7574 4.69456 7.70624 7.73111 7.52725 10.9999H2.04932ZM21.9506 10.9999H16.4726C16.2936 7.73111 15.2425 4.69456 13.5479 2.11902C18.0123 2.81276 21.4998 6.45968 21.9506 10.9999ZM21.9506 12.9999C21.4998 17.5402 18.0123 21.1871 13.5479 21.8809C15.2425 19.3053 16.2936 16.2688 16.4726 12.9999H21.9506ZM9.53068 12.9999H14.4692C14.2976 15.7828 13.4146 18.3732 11.9999 20.5915C10.5852 18.3732 9.70229 15.7828 9.53068 12.9999ZM9.53068 10.9999C9.70229 8.21709 10.5852 5.62672 11.9999 3.40841C13.4146 5.62672 14.2976 8.21709 14.4692 10.9999H9.53068Z"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM16.4645 15.5355L20 12L16.4645 8.46447L15.0503 9.87868L17.1716 12L15.0503 14.1213L16.4645 15.5355ZM6.82843 12L8.94975 9.87868L7.53553 8.46447L4 12L7.53553 15.5355L8.94975 14.1213L6.82843 12ZM11.2443 17L14.884 7H12.7557L9.11597 17H11.2443Z"/></svg>`,
  terminal: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12 15V17H18V15H12ZM8.41421 12L5.58579 14.8284L7 16.2426L11.2426 12L7 7.75736L5.58579 9.17157L8.41421 12Z"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168Z"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 5V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7ZM4 15V19H20V15H4ZM11 11V13H13V11H11ZM9 3V5H15V3H9Z"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17 15.2454V22.1169C17 22.393 16.7761 22.617 16.5 22.617C16.4094 22.617 16.3205 22.5923 16.2428 22.5457L12 20L7.75725 22.5457C7.52046 22.6877 7.21333 22.6109 7.07125 22.3742C7.02463 22.2964 7 22.2075 7 22.1169V15.2454C5.17107 13.7793 4 11.5264 4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9C20 11.5264 18.8289 13.7793 17 15.2454ZM12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15ZM12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13Z"/></svg>`,
  "bar-chart": `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H7V21H3V12ZM17 8H21V21H17V8ZM10 2H14V21H10V2Z"/></svg>`,
  money: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.0049 22.0027C6.48204 22.0027 2.00488 17.5256 2.00488 12.0027C2.00488 6.4799 6.48204 2.00275 12.0049 2.00275C17.5277 2.00275 22.0049 6.4799 22.0049 12.0027C22.0049 17.5256 17.5277 22.0027 12.0049 22.0027ZM8.50488 14.0027V16.0027H11.0049V18.0027H13.0049V16.0027H14.0049C15.3856 16.0027 16.5049 14.8835 16.5049 13.5027C16.5049 12.122 15.3856 11.0027 14.0049 11.0027H10.0049C9.72874 11.0027 9.50488 10.7789 9.50488 10.5027C9.50488 10.2266 9.72874 10.0027 10.0049 10.0027H15.5049V8.00275H13.0049V6.00275H11.0049V8.00275H10.0049C8.62417 8.00275 7.50488 9.12203 7.50488 10.5027C7.50488 11.8835 8.62417 13.0027 10.0049 13.0027H14.0049C14.281 13.0027 14.5049 13.2266 14.5049 13.5027C14.5049 13.7789 14.281 14.0027 14.0049 14.0027H8.50488Z"/></svg>`,
  lightbulb: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 18H7.94101C7.64391 16.7274 6.30412 15.6857 5.75395 14.9992C4.65645 13.6297 4 11.8915 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 11.8925 19.3428 13.6315 18.2443 15.0014C17.6944 15.687 16.3558 16.7276 16.059 18H13V13H11V18ZM16 20V21C16 22.1046 15.1046 23 14 23H10C8.89543 23 8 22.1046 8 21V20H16Z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"/></svg>`,
  rocket: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.433 2.14652C12.1461 2.05088 11.8385 2.05088 11.5516 2.14652L3.55162 4.81318C3.21808 4.92426 3 5.23719 3 5.58985V11.2355C3 15.7511 5.92211 19.8006 10.218 21.2326L11.5516 21.6771C11.8385 21.7728 12.1461 21.7728 12.433 21.6771L13.7666 21.2326C18.0625 19.8006 21 15.7511 21 11.2355V5.58985C21 5.23719 20.7819 4.92426 20.4484 4.81318L12.433 2.14652ZM12 4.07001L19 6.40335V11.2355C19 14.8475 16.6577 18.0874 13.2212 19.2329L12 19.64L10.7788 19.2329C7.34231 18.0874 5 14.8475 5 11.2355V6.40335L12 4.07001ZM12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7ZM10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11C14 12.1046 13.1046 13 12 13C10.8954 13 10 12.1046 10 11Z"/></svg>`
}

function getIconBase64(name: string, color: string): string {
  const svg = ICON_MAP[name] || ICON_MAP['star']
  const coloredSvg = svg.replace('currentColor', color)
  return `data:image/svg+xml;base64,${btoa(coloredSvg)}`
}

export async function exportToPptx(presentation: Presentation): Promise<Blob> {
  const pack = getTemplatePack(presentation.themeId)
  const pptx = new PptxGenJS()

  pptx.layout = 'LAYOUT_WIDE'  // 13.33" x 7.5" = 16:9
  pptx.author = ''
  pptx.title = presentation.title

  for (const slide of presentation.slides) {
    renderSlide(pptx, slide, pack)
  }

  const data = await pptx.write({ outputType: 'blob' })
  return data as Blob
}

function hexToRgb(hex: string): string {
  return hex.replace('#', '')
}

function extractFont(cssFontFamily: string, role: 'heading' | 'body' = 'body'): string {
  // 标题/副标题: 华文宋体, 正文: 黑体
  return role === 'heading' ? 'STSong' : 'SimHei'
}

type Colors = TemplatePack['colors']
type Slide = PptxGenJS.Slide
type SemanticColors = ReturnType<typeof deriveReadableTokens>

function getSemanticColors(colors: Colors): SemanticColors {
  return deriveReadableTokens(colors)
}

function calculateFitDimensions(url: string, boxX: number, boxY: number, boxW: number, boxH: number) {
  const result = { x: boxX, y: boxY, w: boxW, h: boxH, isDataURI: false, url };
  if (url.startsWith('data:image/')) {
    result.isDataURI = true;
    try {
      // In a real project, we'd use a browser-safe image parser or an async approach.
      // For now, to stop crashes, we skip exact fit calculation if require/Buffer isn't ready.
      if (typeof window === 'undefined' && typeof require !== 'undefined') {
        const base64Data = url.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const sizeOf = require('image-size');
        const dimensions = sizeOf(buffer);
        if (dimensions.width && dimensions.height) {
          const m = Math.min(boxW / dimensions.width, boxH / dimensions.height);
          result.w = dimensions.width * m;
          result.h = dimensions.height * m;
          result.x = boxX + (boxW - result.w) / 2;
          result.y = boxY + (boxH - result.h) / 2;
        }
      }
    } catch (e) {
      console.warn('Failed to calculate dynamic image dimensions (expected in browser):', e);
    }
  }
  return result;
}

function renderImageFull(s: Slide, slide: SlideContent) {
  if (slide.image?.url) {
    s.addImage({
      path: slide.image.url,
      x: 0, y: 0, w: 13.33, h: 7.5,
      sizing: { type: 'cover', w: 13.33, h: 7.5 }
    })
  }
}

function getCardsThreeHeader(slide: SlideContent) {
  return {
    serifLine: slide.subtitle?.trim() || '',
    sansLine: slide.title,
  }
}

function renderCardsThreeCentered(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.cardsGeneric
  s.background = { fill: toPptxHex(sem.canvas) }
  const headingColor = toPptxHex(sem.onCanvas)

  const { serifLine, sansLine } = getCardsThreeHeader(slide)
  if (serifLine) {
    s.addText(serifLine, {
      x: 1.1, y: 0.6 + vOffset, w: 11.1, h: 0.55,
      fontSize: F.cardsCenteredKicker * scale, fontFace: fB, color: headingColor,
      align: 'center', fit: 'shrink'
    })
  }

  s.addText(sansLine, {
    x: 0.8, y: (serifLine ? 1.15 : 0.85) + vOffset, w: 11.7, h: 0.9,
    fontSize: F.cardsCenteredTitle * scale, fontFace: fH, color: toPptxHex(c.primary), bold: true,
    align: 'center', fit: 'shrink'
  })

  const cards = (slide.cards || []).slice(0, 3)
  if (cards.length === 0) return

  const paddingX = spec.paddingX
  const gap = spec.gap
  const cardW = (SLIDE_W - paddingX * 2 - gap * (cards.length - 1)) / cards.length
  const cardY = spec.paddingY + 0.95 + vOffset
  const cardH = spec.cardH

  cards.forEach((card, i) => {
    const x = paddingX + i * (cardW + gap)
    const iconName = card.icon || inferIcon(card.heading)

    s.addShape('roundRect' as PptxGenJS.ShapeType, {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: toPptxHex(sem.onSurface), transparency: 94 },
      line: { color: toPptxHex(c.primary), width: 1 },
      rectRadius: 0.1
    })

    if (iconName) {
      s.addShape('ellipse' as PptxGenJS.ShapeType, {
        x: x + 0.34, y: cardY + 0.3, w: 0.74, h: 0.74,
        fill: { color: toPptxHex(sem.onSurface), transparency: 94 },
        line: { color: toPptxHex(c.primary), width: 1 }
      })
      s.addImage({
        data: getIconBase64(iconName, `#${toPptxHex(c.primary)}`),
        x: x + 0.52, y: cardY + 0.48, w: 0.38, h: 0.38
      })
    }

    s.addText(card.heading, {
      x: x + 0.25, y: cardY + 1.25, w: cardW - 0.5, h: 0.46,
      fontSize: F.cardHeading * scale, fontFace: fH, color: headingColor,
      bold: true, align: 'center', fit: 'shrink'
    })

    s.addText(card.body, {
      x: x + 0.38, y: cardY + 1.78, w: cardW - 0.76, h: cardH - 2.02,
      fontSize: F.cardBody * scale, fontFace: fB, color: headingColor,
      valign: 'top', lineSpacingMultiple: 1.2, fit: 'shrink'
    })
  })
}

function renderSlide(pptx: PptxGenJS, slide: SlideContent, pack: TemplatePack) {
  const pptSlide = pptx.addSlide()
  const c = pack.colors
  const fH = extractFont(pack.fonts.heading, 'heading')
  const fB = extractFont(pack.fonts.body, 'body')
  const density = getDensityClass(slide)
  const scale = getDensityScale(density)
  // vOffset for vertical centering logic (density-low gets more boost)
  const vOffset = density === 'density-low' ? 0.8 : density === 'density-medium' ? 0.3 : 0

  const packConfig = getPackPptxConfig(pack.id)
  const figmaLayouts = ['cover', 'section-header', 'quote', 'ending'] as const

  if (packConfig && figmaLayouts.includes(slide.layout as typeof figmaLayouts[number])) {
    const layoutKey = slide.layout === 'section-header' ? 'sectionHeader' : slide.layout as 'cover' | 'quote' | 'ending'
    const config = packConfig[layoutKey]
    if (config) {
      const titleOrQuote = slide.layout === 'quote'
        ? (slide.quote?.text || slide.title)
        : slide.title
      config.render(pptSlide, titleOrQuote, slide.subtitle, fH, fB)
      return
    }
  }

  switch (slide.layout) {
    case 'cover':
      renderCover(pptSlide, slide, c, fH, fB)
      break
    case 'ending':
      renderEnding(pptSlide, slide, c, fH, fB)
      break
    case 'section-header':
      renderSectionHeader(pptSlide, slide, c, fH, fB)
      break
    case 'text-bullets':
      renderTextBullets(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'text-center':
      renderTextCenter(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'image-text':
    case 'text-image':
      renderImageText(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'image-center':
      renderImageCenter(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'image-full':
      renderImageFull(pptSlide, slide)
      break
    case 'cards-2':
    case 'cards-3':
    case 'cards-4':
      renderCards(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'comparison':
      renderComparison(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'timeline':
      renderTimeline(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'milestone-list':
      renderMilestoneList(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'metrics':
      renderMetrics(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'quote':
      renderQuote(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'quote-no-avatar':
      renderQuoteNoAvatar(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'chart-bar':
    case 'chart-bar-compare':
    case 'chart-line':
    case 'chart-pie':
      renderChart(pptx, pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'list-featured':
      renderListFeatured(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'cards-split':
      renderCardsSplit(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'staggered-cards':
      renderStaggeredCards(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'features-list-image':
      renderFeaturesListImage(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'metrics-rings':
      renderMetricsRings(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    case 'team-members':
      renderTeamMembers(pptSlide, slide, c, fH, fB, scale, vOffset)
      break
    default:
      renderTextBullets(pptSlide, slide, c, fH, fB, scale, vOffset)
  }
}

function renderCover(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string) {
  const sem = getSemanticColors(c)
  s.background = { fill: toPptxHex(c.primary) }

  s.addText(slide.title, {
    x: 0.8, y: 1.5, w: 11.5, h: 2,
    fontSize: 40, fontFace: fH, color: toPptxHex(sem.onPrimary), bold: true,
    align: 'center', valign: 'middle', fit: 'shrink'
  })
  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 1.5, y: 3.8, w: 10, h: 1,
      fontSize: 18, fontFace: fB, color: toPptxHex(sem.onPrimary), align: 'center', valign: 'middle'
    })
  }
}

function renderEnding(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string) {
  const sem = getSemanticColors(c)
  s.background = { fill: toPptxHex(c.primary) }

  s.addText(slide.title, {
    x: 0.8, y: 2, w: 11.5, h: 2,
    fontSize: 44, fontFace: fH, color: toPptxHex(sem.onPrimary), bold: true,
    align: 'center', valign: 'middle', fit: 'shrink'
  })
  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 2, y: 4.2, w: 9, h: 0.8,
      fontSize: 16, fontFace: fB, color: toPptxHex(sem.onPrimary), align: 'center'
    })
  }
}

function renderSectionHeader(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string) {
  s.background = { fill: toPptxHex(c.surface) }
  const sem = getSemanticColors(c)

  // Left primary accent bar
  s.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0, w: 0.08, h: 7.5, fill: { color: toPptxHex(c.primary) }
  })

  // Subtitle (Kicker) - Above Title
  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 0.82, y: 2.15, w: 11.5, h: 0.5,
      fontSize: 16.5, fontFace: fB, color: toPptxHex(sem.subtleOnCanvas),
      align: 'left', valign: 'bottom'
    })
  }

  // Title
  s.addText(slide.title, {
    x: 0.8, y: 2.65, w: 11.5, h: 1.0,
    fontSize: 44, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true,
    align: 'left', valign: 'top', fit: 'shrink'
  })
}

function renderImageCenter(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  s.background = { fill: toPptxHex(sem.canvas) }

  const spec = layoutSpecs.imageCenter
  const topH = SLIDE_H * spec.visualRatio
  const textY = topH
  const textH = SLIDE_H - topH
  const bodyText = extractParagraphText(slide).trim()

  if (slide.image?.url) {
    s.addImage({
      ...(slide.image.url.startsWith('data:image/') ? { data: slide.image.url } : { path: slide.image.url }),
      x: 0, y: 0, w: SLIDE_W, h: topH,
      sizing: { type: 'cover', w: SLIDE_W, h: topH }
    })
  } else {
    s.addShape('rect' as PptxGenJS.ShapeType, {
      x: 0, y: 0, w: SLIDE_W, h: topH,
      fill: { color: hexToRgb(c.surfaceAlt) }
    })
    s.addText(slide.image?.alt || '', {
      x: 0, y: 2.25, w: SLIDE_W, h: 0.5,
      fontSize: 16 * scale, fontFace: fB, color: toPptxHex(sem.subtleOnCanvas), align: 'center'
    })
  }

  s.addText(slide.title, {
    x: spec.textPadX * 0.48, y: textY + spec.textPadTop * 0.24 + vOffset, w: SLIDE_W * spec.titleWidthRatio - 0.7, h: textH - 0.42,
    fontSize: 40 * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: false,
    lineSpacingMultiple: 0.95, valign: 'top', fit: 'shrink'
  })

  if (bodyText) {
    s.addText(bodyText, {
      x: SLIDE_W * spec.titleWidthRatio + 0.25, y: textY + spec.textPadTop * 0.31 + vOffset, w: SLIDE_W * (1 - spec.titleWidthRatio) - 0.6, h: textH - 0.45,
      fontSize: 16 * scale, fontFace: fB, color: toPptxHex(sem.onCanvas),
      lineSpacingMultiple: 1.28, valign: 'top', fit: 'shrink'
    })
  }
}

function renderTextBullets(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.textLayout
  s.background = { fill: toPptxHex(sem.canvas) }

  s.addText(slide.title, {
    x: spec.paddingX, y: spec.headingY + vOffset, w: SLIDE_W - spec.paddingX * 2, h: 0.8,
    fontSize: F.textBulletsTitle * scale, fontFace: fH, color: toPptxHex(c.primary), bold: false,
    align: 'center', fit: 'shrink'
  })

  const bullets = extractBullets(slide)
  if (bullets.length > 0) {
    const startY = spec.bodyY + vOffset
    const maxBodyH = SLIDE_H - 1.2 - startY
    const rowH = Math.min(0.7, maxBodyH / Math.max(1, bullets.length))
    bullets.forEach((bullet, index) => {
      const y = startY + index * rowH
      s.addText('•', {
        x: spec.paddingX + 0.1, y: y + 0.05, w: 0.2, h: rowH,
        fontSize: F.textBulletsDescription * scale, fontFace: fB, color: toPptxHex(sem.onCanvas)
      })
      s.addText(bullet, {
        x: spec.paddingX + 0.35, y, w: SLIDE_W - spec.paddingX * 2 - 0.5, h: rowH,
        fontSize: F.textBulletsDescription * scale, fontFace: fB, color: toPptxHex(sem.onCanvas),
        valign: 'top', lineSpacingMultiple: 1.28, fit: 'shrink'
      })
    })
  }
}

function renderTextCenter(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.textLayout
  s.background = { fill: toPptxHex(sem.canvas) }

  s.addText(slide.title, {
    x: spec.paddingX, y: 2.5 + vOffset, w: SLIDE_W - spec.paddingX * 2, h: 1.0,
    fontSize: F.textCenterTitle * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true, align: 'center', valign: 'middle', fit: 'shrink'
  })

  const bodyText = extractParagraphText(slide).trim()
  if (bodyText) {
    s.addText(bodyText, {
      x: spec.paddingX + 1.2, y: 3.6 + vOffset, w: SLIDE_W - (spec.paddingX + 1.2) * 2, h: 1.5,
      fontSize: F.textCenterBody * scale, fontFace: fB, color: toPptxHex(sem.subtleOnCanvas),
      align: 'center', valign: 'top', lineSpacingMultiple: 1.42, fit: 'shrink'
    })
  }
}

function renderImageText(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.imageText
  s.background = { fill: toPptxHex(sem.canvas) }

  const isImageLeft = slide.layout === 'image-text'
  const paddingX = spec.paddingX
  const gap = spec.gap

  const imageW = (SLIDE_W - paddingX * 2 - gap) * (spec.imageRatio / (spec.imageRatio + spec.textRatio))
  const textW = SLIDE_W - paddingX * 2 - gap - imageW

  const imageX = isImageLeft ? paddingX : paddingX + textW + gap
  const textX = isImageLeft ? paddingX + imageW + gap : paddingX

  if (slide.image?.url) {
    s.addImage({
      path: slide.image.url,
      x: imageX, y: spec.paddingY + vOffset, w: imageW, h: SLIDE_H - spec.paddingY * 2,
      sizing: { type: 'cover', w: imageW, h: SLIDE_H - spec.paddingY * 2 }
    })
  }

  s.addText(slide.title, {
    x: textX, y: 1.2 + vOffset, w: textW, h: 0.8,
    fontSize: F.imageTextTitle * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true, fit: 'shrink'
  })

  const bullets = extractBullets(slide).slice(0, 6)
  if (bullets.length > 0) {
    const startY = 2.2 + vOffset
    const maxH = SLIDE_H - 1.0 - startY
    const rowH = Math.min(0.65, maxH / bullets.length)
    bullets.forEach((bullet, index) => {
      const y = startY + index * rowH
      s.addText('•', {
        x: textX + 0.05, y: y + 0.1, w: 0.15, h: rowH,
        fontSize: F.imageTextBody * scale, fontFace: fB, color: toPptxHex(sem.onCanvas)
      })
      s.addText(bullet, {
        x: textX + 0.25, y, w: textW - 0.3, h: rowH,
        fontSize: F.imageTextBody * scale, fontFace: fB, color: toPptxHex(sem.onCanvas),
        valign: 'top', lineSpacingMultiple: 1.15, fit: 'shrink'
      })
    })
  }
}

function renderCards(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.cardsGeneric
  s.background = { fill: toPptxHex(sem.canvas) }

  if (slide.layout === 'cards-2') {
    const cards = (slide.cards || []).slice(0, 2)
    s.addText(slide.subtitle?.trim() || '', {
      x: spec.paddingX, y: 0.45 + vOffset, w: 3, h: 0.24,
      fontSize: F.cards2Kicker * scale, fontFace: fB, color: toPptxHex(sem.subtleOnCanvas), bold: true
    })

    const cardY = spec.paddingY + 0.5 + vOffset
    const cardH = spec.cardH + 0.6
    const gap = spec.gap + 0.1
    const cardW = (SLIDE_W - spec.paddingX * 2 - gap) / 2

    cards.forEach((card, index) => {
      const x = spec.paddingX + index * (cardW + gap)

      s.addShape('roundRect' as PptxGenJS.ShapeType, {
        x, y: cardY, w: cardW, h: cardH,
        fill: { color: toPptxHex(sem.onSurface), transparency: 94 },
        line: { color: toPptxHex(c.primary), width: 1 },
        rectRadius: 0.12
      })

      const headerBoxH = 1.0
      s.addShape('roundRect' as PptxGenJS.ShapeType, {
        x: x + 0.1, y: cardY + 0.1, w: cardW - 0.2, h: headerBoxH,
        fill: { color: toPptxHex(sem.onSurface), transparency: 100 },
        line: { color: toPptxHex(c.primary), width: 0.8 },
        rectRadius: 0.08
      })

      s.addText(card.heading, {
        x: x + 0.15, y: cardY + 0.1, w: cardW - 0.3, h: headerBoxH,
        fontSize: F.cards2Value * scale, fontFace: fH, color: toPptxHex(sem.onCanvas),
        align: 'center', valign: 'middle', fit: 'shrink'
      })

      s.addText(card.body, {
        x: x + 0.2, y: cardY + headerBoxH + 0.3, w: cardW - 0.4, h: cardH - headerBoxH - 0.5,
        fontSize: F.cards2Description * scale, fontFace: fB, color: toPptxHex(sem.onCanvas),
        align: 'left', valign: 'top', lineSpacingMultiple: 1.1, fit: 'shrink'
      })
    })
    return
  }

  if (slide.layout === 'cards-3') {
    renderCardsThreeCentered(s, slide, c, fH, fB, scale, vOffset)
    return
  }

  s.addText(slide.title, {
    x: spec.paddingX, y: 0.4 + vOffset, w: SLIDE_W - spec.paddingX * 2, h: 0.8,
    fontSize: F.cardItemHeading * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true, align: 'center', fit: 'shrink'
  })
  const cards = slide.cards || []
  const cols = Math.min(cards.length, 4)
  const gap = spec.gap * scale
  const cardW = (SLIDE_W - spec.paddingX * 2 - (cols - 1) * gap) / cols

  cards.forEach((card, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = spec.paddingX + col * (cardW + gap)

    // Calculate row height based on total rows to prevent overflow
    const rows = Math.ceil(cards.length / cols)
    const availableH = SLIDE_H - 1.8 - vOffset
    const rowStep = rows > 1 ? availableH / rows : 2.8 * scale
    const y = 1.6 + vOffset + row * rowStep
    const h = rows > 1 ? (rowStep - 0.4) : Math.min(cols <= 2 ? 5 * scale : 2.4 * scale, SLIDE_H - 0.3 - y)

    s.addShape('roundRect' as PptxGenJS.ShapeType, {
      x, y, w: cardW, h,
      fill: { color: toPptxHex(sem.onSurface), transparency: 96 },
      line: { color: hexToRgb(c.border), width: 1 },
      rectRadius: 0.1
    })

    s.addShape('rect' as PptxGenJS.ShapeType, {
      x: x + 0.1, y: y + h - 0.04, w: cardW - 0.2, h: 0.04,
      fill: { color: toPptxHex(c.primary) }
    })

    const iconName = card.icon || inferIcon(card.heading)
    if (iconName) {
      const iconSize = 0.4
      const iconCircleSize = 0.6
      s.addShape('ellipse' as PptxGenJS.ShapeType, {
        x: x + 0.25, y: y + 0.25, w: iconCircleSize, h: iconCircleSize,
        fill: { color: toPptxHex(c.primary), transparency: 85 }
      })
      s.addImage({
        data: getIconBase64(iconName, '#' + toPptxHex(c.primary)),
        x: x + 0.25 + (iconCircleSize - iconSize) / 2,
        y: y + 0.25 + (iconCircleSize - iconSize) / 2,
        w: iconSize, h: iconSize
      })
    }

    const textOffset = iconName ? 1.0 : 0.3
    s.addText(card.heading, {
      x: x + 0.25, y: y + textOffset, w: cardW - 0.5, h: 0.5,
      fontSize: F.cardItemHeading * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true, fit: 'shrink'
    })
    s.addText(card.body, {
      x: x + 0.25, y: y + textOffset + 0.55, w: cardW - 0.5, h: h - textOffset - 0.7,
      fontSize: F.cardItemBody * scale, fontFace: fB, color: toPptxHex(sem.onCanvas), valign: 'top',
      lineSpacingMultiple: 1.2, fit: 'shrink'
    })
  })
}

/**
 * Simple icon inference based on common keywords
 */
function inferIcon(text: string): string | null {
  const t = text.toLowerCase()
  if (t.includes('target') || t.includes('goal') || t.includes('objective')) return 'target'
  if (t.includes('user') || t.includes('customer') || t.includes('client')) return 'user'
  if (t.includes('team') || t.includes('group') || t.includes('collaboration')) return 'team'
  if (t.includes('globe') || t.includes('global') || t.includes('market')) return 'globe'
  if (t.includes('code') || t.includes('dev') || t.includes('engineering')) return 'code'
  if (t.includes('terminal') || t.includes('command') || t.includes('backend')) return 'terminal'
  if (t.includes('settings') || t.includes('config') || t.includes('system')) return 'settings'
  if (t.includes('money') || t.includes('price') || t.includes('cost') || t.includes('finance')) return 'money'
  if (t.includes('idea') || t.includes('creative') || t.includes('insight') || t.includes('lightbulb')) return 'lightbulb'
  if (t.includes('success') || t.includes('done') || t.includes('check')) return 'check'
  if (t.includes('award') || t.includes('honor') || t.includes('achievement')) return 'award'
  if (t.includes('growth') || t.includes('launch') || t.includes('rocket') || t.includes('speed')) return 'rocket'
  if (t.includes('business') || t.includes('work') || t.includes('task') || t.includes('briefcase')) return 'briefcase'
  if (t.includes('data') || t.includes('analysis') || t.includes('bar') || t.includes('chart')) return 'bar-chart'
  return 'star'
}


function renderComparison(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.comparison
  s.background = { fill: toPptxHex(sem.canvas) }
  const textColor = toPptxHex(sem.onCanvas)
  const secondaryColor = toPptxHex(ensureContrast(sem.subtleOnCanvas, sem.canvas, 3.5))
  const highlightColor = toPptxHex(ensureContrast(normalizeHex(c.primary), sem.canvas, 3.5))
  s.addText(slide.title, {
    x: 0.8, y: 0.20 + vOffset, w: 11.7, h: 0.6,
    fontSize: F.comparisonTitle * scale, fontFace: fH, color: textColor, bold: false, align: 'center', fit: 'shrink'
  })
  if (slide.subtitle?.trim()) {
    s.addText(slide.subtitle, {
      x: 0.8, y: 0.84 + vOffset, w: 11.7, h: 0.32,
      fontSize: F.comparisonSubtitle * scale, fontFace: fB, color: secondaryColor, align: 'center', fit: 'shrink'
    })
  }

  const cardY = spec.cardY + vOffset
  const cardH = spec.cardH
  const colW = spec.colW
  const gap = spec.gap
  const leftX = spec.leftX
  const rightX = leftX + colW + gap
  const leftTone = slide.left?.tone || 'positive'
  const rightTone = slide.right?.tone || 'negative'
  const sides = [
    { data: slide.left, x: leftX, fill: leftTone === 'negative' ? toPptxHex(sem.negativeSoft) : toPptxHex(sem.positiveSoft) },
    { data: slide.right, x: rightX, fill: rightTone === 'negative' ? toPptxHex(sem.negativeSoft) : toPptxHex(sem.positiveSoft) }
  ]

  sides.forEach(({ data, x, fill }) => {
    if (!data) return

    s.addShape('rect' as PptxGenJS.ShapeType, {
      x, y: cardY, w: colW, h: cardH,
      fill: { color: toPptxHex(sem.canvas) },
      rectRadius: 0.25, // ≈ 32px
      shadow: CARD_SHADOW
    })

    s.addText(data.heading, {
      x: x + 0.2, y: cardY + 0.22, w: colW - 0.4, h: 0.42,
      fontSize: F.comparisonHeading * scale, fontFace: fH, color: textColor, bold: false, align: 'center', fit: 'shrink'
    })

    const list = (data.items || []).slice(0, 8)
    const listTop = cardY + 0.82
    const rowH = (cardH - 1.0) / Math.max(1, list.length)
    list.forEach((item, index) => {
      const raw = item.trim()
      const text = raw.startsWith('!') ? raw.slice(1).trim() : raw
      const isHighlight = raw.startsWith('!') || /\b(no|not|without|lack|missing|difference|gap|added)\b/i.test(text)
      const y = listTop + index * rowH

      s.addText('•', {
        x: x + 0.32, y: y + 0.02, w: 0.18, h: 0.2,
        fontSize: F.comparisonBody * scale, fontFace: fB, color: isHighlight ? highlightColor : textColor
      })

      s.addText(text, {
        x: x + 0.52, y, w: colW - 0.8, h: Math.max(0.2, rowH - 0.02),
        fontSize: F.comparisonBody * scale, fontFace: fB, color: isHighlight ? highlightColor : textColor,
        lineSpacingMultiple: 1.25, fit: 'shrink'
      })
    })
  })
}

function renderTimeline(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.cardsGeneric
  s.background = { fill: toPptxHex(sem.canvas) }

  s.addText(slide.title, {
    x: spec.paddingX, y: 0.45 + vOffset, w: SLIDE_W - spec.paddingX * 2, h: 0.8,
    fontSize: F.timelineTitle * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true, align: 'left', fit: 'shrink'
  })
  const events = (slide.events || []).slice(0, 5)
  if (events.length === 0) return

  const lineY = 3.95 + vOffset
  const startX = spec.paddingX + 0.38
  const endX = SLIDE_W - spec.paddingX - 0.38
  const topTextY = 1.92 + vOffset
  const bottomTextY = 4.56 + vOffset
  const textW = 2.45
  const tickH = 0.44
  const lineColor = toPptxHex(c.primary)

  s.addShape('line' as PptxGenJS.ShapeType, {
    x: startX, y: lineY, w: endX - startX, h: 0,
    line: { color: lineColor, width: 2.2 }
  })

  events.forEach((event, i) => {
    const ratio = events.length === 1 ? 0 : i / (events.length - 1)
    const x = startX + (endX - startX) * ratio
    const isTop = i % 2 === 1
    const tickY = isTop ? lineY - tickH : lineY
    const rawTextX = x - textW / 2
    const minTextX = 0.52
    const maxTextX = SLIDE_W - 0.52 - textW
    const textX = Math.max(minTextX, Math.min(maxTextX, rawTextX))
    const heading = event.date || event.title
    const body = event.description || event.title

    s.addShape('line' as PptxGenJS.ShapeType, {
      x, y: tickY, w: 0, h: tickH,
      line: { color: toPptxHex(c.primary), width: 1.2 }
    })

    s.addText(heading, {
      x: textX, y: isTop ? topTextY : bottomTextY, w: textW, h: 0.44,
      fontSize: F.timelineHeading * scale, fontFace: fH, color: lineColor, bold: true, align: 'center', fit: 'shrink'
    })

    s.addText(body, {
      x: textX, y: (isTop ? topTextY : bottomTextY) + 0.52, w: textW, h: 1.4,
      fontSize: F.timelineDescription * scale, fontFace: fB, color: toPptxHex(sem.subtleOnCanvas),
      align: 'center', valign: 'top', lineSpacingMultiple: 1.34, fit: 'shrink'
    })
  })
}

function renderMilestoneList(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  s.background = { fill: toPptxHex(sem.canvas) }

  s.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0, w: 4.12, h: SLIDE_H,
    fill: { color: toPptxHex(c.accent) },
    line: { color: hexToRgb(c.accent), width: 0 }
  })

  const spec = layoutSpecs.milestoneList
  const kicker = slide.subtitle?.trim() || ''
  s.addText(kicker, {
    x: spec.kickerX, y: 0.78 + vOffset, w: 2.9, h: 0.26,
    fontSize: 11 * scale, fontFace: fB, color: toPptxHex(ensureContrast('#111111', normalizeHex(c.accent), 4.5)), bold: true
  })

  const events = (slide.events || []).slice(0, 6)
  const rows: Array<{ date: string; title?: string; description: string }> = events.length > 0 ? events : []
  const count = rows.length
  const dense = count >= 5

  const contentX = spec.contentX
  const contentW = SLIDE_W - contentX - 0.85
  const rowY = spec.topY + vOffset
  const rowH = spec.contentHeight / count
  const yearW = spec.yearW

  rows.forEach((row, index) => {
    const y = rowY + index * rowH
    const year = row.date || row.title || `${2022 + index}`
    const description = row.description || row.title || ''

    s.addText(year, {
      x: contentX, y: y + 0.08, w: yearW, h: Math.max(0.45, rowH - 0.18),
      fontSize: (dense ? 38 : 48) * scale, fontFace: fH, color: toPptxHex(sem.onCanvas),
      bold: false, fit: 'shrink'
    })

    s.addText(description, {
      x: contentX + yearW + 0.44, y: y + 0.24, w: contentW - yearW - 0.44, h: Math.max(0.4, rowH - 0.28),
      fontSize: (dense ? 14 : 17) * scale, fontFace: fH, color: toPptxHex(sem.onCanvas),
      lineSpacingMultiple: 1.18, valign: 'top', fit: 'shrink'
    })
  })
}

function renderMetrics(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.metrics
  s.background = { fill: toPptxHex(sem.canvas) }

  const leftW = spec.leftW
  const items = (slide.metrics || []).slice(0, 6)
  const count = items.length
  const rows = count > 4 ? 3 : 2
  const summary = slide.subtitle?.trim() || extractParagraphText(slide)

  s.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0, y: 0, w: leftW, h: SLIDE_H,
    fill: { color: toPptxHex(sem.onSurface), transparency: 92 },
    line: { color: hexToRgb(c.border), width: 0 }
  })

  s.addText(slide.title, {
    x: 0.72, y: 2.05 + vOffset, w: leftW - 1.35, h: 1.25,
    fontSize: 34 * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true, align: 'left', fit: 'shrink'
  })

  if (summary) {
    s.addText(summary, {
      x: 0.72, y: 3.38 + vOffset, w: leftW - 1.35, h: 2.15,
      fontSize: 16 * scale, fontFace: fB, color: toPptxHex(sem.onCanvas),
      align: 'left', valign: 'top', lineSpacingMultiple: 1.22, fit: 'shrink'
    })
  }

  if (count === 0) return

  const rightPad = spec.rightPad
  const gridX = leftW + rightPad
  const gridW = SLIDE_W - gridX - 0.75
  const gridY = spec.gridY + vOffset
  const gridH = spec.gridH
  const colGap = spec.colGap
  const rowGap = rows === 3 ? spec.rowGap * 0.82 : spec.rowGap
  const cellW = (gridW - colGap) / 2
  const cellH = (gridH - rowGap * (rows - 1)) / rows

  items.forEach((metric, i) => {
    const isFiveTail = count === 5 && i === 4
    const col = isFiveTail ? 0 : i % 2
    const row = isFiveTail ? 2 : Math.floor(i / 2)
    const baseX = gridX + col * (cellW + colGap)
    const x = isFiveTail ? gridX + (gridW - cellW) / 2 : baseX
    const y = gridY + row * (cellH + rowGap)

    s.addText(metric.value, {
      x, y: y + 0.02, w: cellW, h: 0.88,
      fontSize: F.metricsValue * scale, fontFace: fH, color: toPptxHex(sem.onCanvas),
      bold: false, align: 'left', fit: 'shrink'
    })

    s.addText(metric.label, {
      x, y: y + 0.98, w: cellW, h: Math.max(0.5, cellH - 1),
      fontSize: F.metricsLabel * scale, fontFace: fB, color: toPptxHex(sem.subtleOnCanvas),
      align: 'left', valign: 'top', lineSpacingMultiple: 1.2, fit: 'shrink'
    })
  })
}

function renderFeaturesListImage(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  s.background = { fill: hexToRgb(c.background) }

  // Left side header
  s.addText(slide.title, {
    x: PAD_X, y: 3.0 + vOffset, w: 3.5, h: 1,
    fontSize: F.imageTextTitle * scale, fontFace: fH, color: hexToRgb(c.text), bold: true, align: 'left', fit: 'shrink'
  })
  s.addText(slide.subtitle || '', {
    x: PAD_X, y: 4.0 + vOffset, w: 3.5, h: 1.5,
    fontSize: F.imageTextBody * scale, fontFace: fB, color: hexToRgb(c.textSecondary), align: 'left'
  })

  // Right side features
  const items = slide.cards || []
  const startX = 5.0
  const colW = 7.5
  const itemH = 1.6
  const gapY = 0.2

  items.forEach((item, i) => {
    const y = 1.2 + vOffset + i * (itemH + gapY)

    // Image
    if (item.image?.url) {
      s.addImage({
        path: item.image.url,
        x: startX, y: y + 0.1, w: 2.5, h: 1.4,
        sizing: { type: 'cover', w: 2.5, h: 1.4 },
        rounding: true // Support rounded corners for images in PPTX manually if needed via shapes or properties
      })
    } else {
      // Placeholder rect
      s.addShape('roundRect' as PptxGenJS.ShapeType, {
        x: startX, y: y + 0.1, w: 2.5, h: 1.4,
        fill: { color: hexToRgb(c.surfaceAlt) },
        rectRadius: CARD_RADIUS
      })
    }

    // Text Column
    s.addText(item.heading, {
      x: startX + 2.7, y: y + 0.2, w: colW - 2.7, h: 0.4,
      fontSize: 18 * scale, fontFace: fH, color: hexToRgb(c.text), bold: true
    })
    s.addText(item.body, {
      x: startX + 2.7, y: y + 0.6, w: colW - 2.7, h: 0.8,
      fontSize: 14 * scale, fontFace: fB, color: hexToRgb(c.textSecondary), lineSpacingMultiple: 1.2
    })

    // Divider
    if (i < items.length - 1) {
      s.addShape('line' as PptxGenJS.ShapeType, {
        x: startX, y: y + itemH + 0.05, w: colW, h: 0,
        line: { color: hexToRgb(c.border), width: 1 }
      })
    }
  })
}

function renderMetricsRings(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  s.background = { fill: hexToRgb(c.background) }

  const overline = slide.subtitle?.trim() || 'The PainPoint'
  const items = (slide.metrics || []).slice(0, 3)

  s.addText(overline, {
    x: 1.18, y: 1.06 + vOffset, w: 5.2, h: 0.4,
    fontSize: F.cards2Kicker * scale, fontFace: fH, color: hexToRgb(c.primary), bold: true, align: 'left', fit: 'shrink'
  })

  s.addText(slide.title, {
    x: 1.18, y: 1.5 + vOffset, w: 6.6, h: 0.78,
    fontSize: F.metricsTitle * scale, fontFace: fH, color: hexToRgb(c.text), bold: true, align: 'left', fit: 'shrink'
  })

  if (items.length === 0) return

  const ringY = 2.92 + vOffset
  const ringD = 2.22
  const ringBorder = 0.2
  const startX = 1.34
  const gap = 1

  items.forEach((item, i) => {
    const x = startX + i * (ringD + gap)
    s.addShape('ellipse' as PptxGenJS.ShapeType, {
      x, y: ringY, w: ringD, h: ringD,
      fill: { color: hexToRgb(c.background), transparency: 100 },
      line: { color: hexToRgb(c.primary), width: ringBorder * 8 }
    })

    s.addText(item.value, {
      x: x + 0.02, y: ringY + 0.63, w: ringD - 0.04, h: 0.55,
      fontSize: 35 * scale, fontFace: fH, color: hexToRgb(c.text),
      bold: true, align: 'center', fit: 'shrink'
    })

    s.addText(item.label, {
      x: x - 0.32, y: ringY + ringD + 0.38, w: ringD + 0.64, h: 1.05,
      fontSize: 14 * scale, fontFace: fB, color: hexToRgb(c.textSecondary),
      align: 'center', valign: 'top', lineSpacingMultiple: 1.15, fit: 'shrink'
    })
  })
}

function renderQuote(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.quote
  s.background = { fill: hexToRgb(c.background) }

  const cardItems = (slide.cards || []).slice(0, 5).map((card) => ({
    text: card.body?.trim() ? card.body : card.heading,
    attribution: card.body?.trim() ? card.heading : '',
    imageUrl: card.image?.url,
  }))
  const items = cardItems.length > 0
    ? cardItems
    : [{
      text: slide.quote?.text || slide.title,
      attribution: slide.quote?.attribution || '',
      imageUrl: slide.image?.url,
    }]
  const count = Math.min(5, Math.max(1, items.length))

  const layoutByCount: Record<number, { cols: number; avatar: number; textSize: number; attrSize: number; startY: number; gapX: number }> = {
    1: { cols: 1, avatar: spec.avatarSize * 1.15, textSize: 26, attrSize: 16, startY: spec.baseY + 0.25, gapX: 0.9 },
    2: { cols: 2, avatar: spec.avatarSize * 1.02, textSize: 21, attrSize: 14, startY: spec.baseY + 0.15, gapX: 0.65 },
    3: { cols: 3, avatar: spec.avatarSize * 0.92, textSize: 18, attrSize: 12, startY: spec.baseY + 0.1, gapX: 0.5 },
    4: { cols: 4, avatar: spec.avatarSize * 0.85, textSize: 15, attrSize: 11, startY: spec.baseY + 0.05, gapX: 0.38 },
    5: { cols: 5, avatar: spec.avatarSize * 0.78, textSize: 13, attrSize: 10, startY: spec.baseY, gapX: 0.3 },
  }
  const conf = layoutByCount[count]
  const sidePad = spec.sidePad
  const itemW = (SLIDE_W - sidePad * 2 - conf.gapX * (conf.cols - 1)) / conf.cols
  const quoteH = count <= 2 ? 2.8 : count === 3 ? 2.2 : 1.8

  items.slice(0, count).forEach((item, i) => {
    const x = sidePad + i * (itemW + conf.gapX)
    const avatarX = x + (itemW - conf.avatar) / 2
    const avatarY = conf.startY + vOffset

    if (item.imageUrl) {
      s.addImage({
        path: item.imageUrl,
        x: avatarX, y: avatarY, w: conf.avatar, h: conf.avatar,
        sizing: { type: 'cover', w: conf.avatar, h: conf.avatar },
      })
      s.addShape('ellipse' as PptxGenJS.ShapeType, {
        x: avatarX, y: avatarY, w: conf.avatar, h: conf.avatar,
        fill: { color: 'FFFFFF', transparency: 100 },
        line: { color: hexToRgb(c.border), width: 0.6 },
      })
    } else {
      s.addShape('ellipse' as PptxGenJS.ShapeType, {
        x: avatarX, y: avatarY, w: conf.avatar, h: conf.avatar,
        fill: { color: hexToRgb(c.surfaceAlt) },
        line: { color: hexToRgb(c.border), width: 0.6 },
      })
    }

    s.addText(`"${item.text}"`, {
      x, y: avatarY + conf.avatar + 0.18, w: itemW, h: quoteH,
      fontSize: conf.textSize * scale, fontFace: fB, color: hexToRgb(c.text),
      align: 'center', valign: 'top', lineSpacingMultiple: 1.18, fit: 'shrink'
    })

    if (item.attribution) {
      s.addText(item.attribution, {
        x, y: avatarY + conf.avatar + 0.18 + quoteH, w: itemW, h: 0.42,
        fontSize: (count === 1 ? F.quoteAttr1 : count === 2 ? F.quoteAttr2 : count === 3 ? F.quoteAttr3 : count === 4 ? F.quoteAttr4 : F.quoteAttr5) * scale,
        fontFace: fB, color: hexToRgb(c.textSecondary),
        align: 'center', fit: 'shrink'
      })
    }
  })
}

function renderQuoteNoAvatar(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.quote
  s.background = { fill: hexToRgb(c.background) }

  const cardItems = (slide.cards || []).slice(0, 5).map((card) => ({
    text: card.body?.trim() ? card.body : card.heading,
    attribution: card.body?.trim() ? card.heading : '',
  }))
  const items = cardItems.length > 0
    ? cardItems
    : [{
      text: slide.quote?.text || slide.title,
      attribution: slide.quote?.attribution || '',
    }]
  const count = Math.min(5, Math.max(1, items.length))

  const layoutByCount: Record<number, { cols: number; textSize: number; attrSize: number; startY: number; gapX: number; quoteH: number }> = {
    1: { cols: 1, textSize: F.quoteText1, attrSize: F.quoteAttr1, startY: spec.baseY + 0.27, gapX: 0.9, quoteH: 2.4 },
    2: { cols: 2, textSize: F.quoteText2, attrSize: F.quoteAttr2, startY: spec.baseY + 0.23, gapX: 0.68, quoteH: 2.2 },
    3: { cols: 3, textSize: F.quoteText3, attrSize: F.quoteAttr3, startY: spec.baseY + 0.2, gapX: 0.52, quoteH: 1.98 },
    4: { cols: 4, textSize: F.quoteText4, attrSize: F.quoteAttr4, startY: spec.baseY + 0.17, gapX: 0.4, quoteH: 1.8 },
    5: { cols: 5, textSize: F.quoteText5, attrSize: F.quoteAttr5, startY: spec.baseY + 0.15, gapX: 0.32, quoteH: 1.66 },
  }
  const conf = layoutByCount[count]
  const sidePad = spec.sidePad * 0.94
  const itemW = (SLIDE_W - sidePad * 2 - conf.gapX * (conf.cols - 1)) / conf.cols

  items.slice(0, count).forEach((item, i) => {
    const x = sidePad + i * (itemW + conf.gapX)
    const topY = conf.startY + vOffset

    s.addText(`"${item.text}"`, {
      x, y: topY, w: itemW, h: conf.quoteH,
      fontSize: conf.textSize * scale, fontFace: fB, color: toPptxHex(sem.onCanvas),
      align: 'center', valign: 'top', lineSpacingMultiple: 1.15, fit: 'shrink'
    })

    if (item.attribution) {
      s.addText(item.attribution, {
        x, y: topY + conf.quoteH + 0.15, w: itemW, h: 0.4,
        fontSize: conf.attrSize * scale, fontFace: fB, color: toPptxHex(sem.subtleOnCanvas),
        align: 'center', fit: 'shrink'
      })
    }
  })
}
function extractBullets(slide: SlideContent): string[] {
  if (!slide.body) return []
  const items: string[] = []
  for (const block of slide.body) {
    if (block.type === 'bullet' && block.items) {
      items.push(...block.items)
    } else if (block.type === 'paragraph' && block.text) {
      items.push(block.text)
    }
  }
  return items
}

function extractParagraphText(slide: SlideContent): string {
  if (!slide.body) return ''
  return slide.body
    .map((b) => (b.type === 'paragraph' ? b.text : b.items?.join('\n')))
    .filter(Boolean).join('\n\n')
}

function renderChart(pptx: PptxGenJS, s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  s.background = { fill: hexToRgb(c.background) }
  if (!slide.chart) return;

  let chartType = (pptx as any).ChartType?.bar || 'bar'
  if (slide.chart.type === 'line') chartType = (pptx as any).ChartType?.line || 'line'
  if (slide.chart.type === 'pie') {
    const sem = getSemanticColors(c)
    const spec = layoutSpecs.chartPie
    s.background = { fill: toPptxHex(sem.canvas) }

    // Title
    s.addText(slide.title, {
      x: 0.72, y: 0.56 + vOffset, w: 10, h: 1.2,
      fontSize: 48 * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: false, fit: 'shrink'
    })

    if (slide.subtitle) {
      s.addText(slide.subtitle, {
        x: 0.72, y: 1.6 + vOffset, w: 10, h: 0.5,
        fontSize: 16 * scale, fontFace: fB, color: toPptxHex(sem.subtleOnCanvas), fit: 'shrink'
      })
    }

    const rawValues = slide.chart.series[0]?.values || []
    const chartValues = rawValues.map(v => (typeof v === 'number' && !isNaN(v)) ? v : 0)

    const pieData = [{
      name: slide.chart.title || 'Data',
      labels: slide.chart.categories,
      values: chartValues
    }]

    const colors = getSeriesColorPalette(c, slide.chart.categories.length, [c.surface, c.surfaceAlt]).map(toPptxHex);

    // Left-aligned Pie Chart
    s.addChart((pptx as any).ChartType?.pie || 'pie', pieData, {
      x: spec.paddingX, y: 2.2 + vOffset, w: spec.chartW, h: 4.8,
      chartColors: colors,
      showLegend: false,
      dataLabelFontFace: fB,
      dataLabelFontSize: 14 * scale,
      showValue: false, // Don't show numeric values overlap on pie
      holeSize: 40, // Donut style if possible
    })

    // Custom Legends on the right
    const legendX = spec.legendX
    const legendStartY = 3.0 + vOffset
    const items = slide.chart.categories
    const total = chartValues.reduce((a, b) => a + b, 0)

    items.forEach((item, i) => {
      const y = legendStartY + i * spec.legendGap
      const percent = total > 0 ? ((chartValues[i] / total) * 100).toFixed(1) : '0.0'
      const color = colors[i % colors.length]

      s.addShape('ellipse' as PptxGenJS.ShapeType, {
        x: legendX, y: y + 0.12, w: 0.22, h: 0.22,
        fill: { color: color },
        line: { color: color, width: 0 }
      })

      s.addText(item, {
        x: legendX + 0.35, y, w: 2.5, h: 0.35,
        fontSize: 16 * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true
      })

      s.addText(`Represents ${percent}% of the total distribution. (${percent}%)`, {
        x: legendX + 0.35, y: y + 0.36, w: 4.5, h: 0.3,
        fontSize: 12 * scale, fontFace: fB, color: toPptxHex(sem.subtleOnCanvas)
      })
    })
    return
  }

  const chartData = slide.chart.series.map(series => ({
    name: series.name,
    labels: slide.chart!.categories,
    values: series.values.map(v => (typeof v === 'number' && !isNaN(v)) ? v : 0)
  }))

  if (slide.chart.type === 'bar' && slide.layout === 'chart-bar-compare') {
    const series = chartData.slice(0, 2)
    const values = series.flatMap((item) => item.values)
    const maxVal = values.length ? Math.max(...values) : 5
    const roundedMax = maxVal <= 5 ? 5 : Math.ceil(maxVal / 5) * 5
    const compareColors = [toPptxHex(c.accent), toPptxHex(c.primary)]

    s.addText(slide.title, {
      x: 0.76, y: 0.6 + vOffset, w: 8.6, h: 0.7,
      fontSize: 30 * scale, fontFace: fH, color: hexToRgb(c.primary), bold: true, fit: 'shrink'
    })

    s.addChart(chartType, series, {
      x: 1.45, y: 1.38 + vOffset, w: 8.7, h: 4.95,
      chartColors: compareColors,
      showLegend: false,
      barGrouping: 'clustered',
      catAxisLabelColor: hexToRgb(c.textSecondary),
      valAxisLabelColor: hexToRgb(c.textSecondary),
      valGridLine: { style: 'solid', color: hexToRgb(c.border) },
      valAxisMinVal: 0,
      valAxisMaxVal: roundedMax,
    })

    const legendX = 10.5
    const legendStartY = 2.7 + vOffset
    const legendItems = [
      { label: series[0]?.name || 'Baseline', color: compareColors[0] },
      { label: series[1]?.name || 'Current', color: compareColors[1] },
    ]
    legendItems.forEach((legend, index) => {
      const y = legendStartY + index * 0.62
      s.addShape('roundRect' as PptxGenJS.ShapeType, {
        x: legendX, y: y + 0.11, w: 0.24, h: 0.08,
        fill: { color: legend.color },
        line: { color: legend.color, width: 0 },
        rectRadius: 0.05,
      })
      s.addText(legend.label, {
        x: legendX + 0.36, y, w: 2.2, h: 0.28,
        fontSize: 14 * scale, fontFace: fB, color: hexToRgb(c.text), fit: 'shrink'
      })
    })
    return
  }

  if (slide.chart.type === 'bar') {
    const panelY = 0.54 + vOffset
    const panelH = 6.4
    const leftW = 6.35
    const rightX = leftW
    const rightW = SLIDE_W - leftW
    const primary = hexToRgb(c.primary)
    const projectName = slide.subtitle?.trim() || ''
    const bodyText = extractParagraphText(slide).trim()

    const firstSeries = chartData[0] ? [chartData[0]] : []
    const values = firstSeries.flatMap((series) => series.values)
    const maxVal = values.length ? Math.max(...values) : 5
    const roundedMax = maxVal <= 5 ? 5 : Math.ceil(maxVal / 5) * 5

    s.addShape('roundRect' as PptxGenJS.ShapeType, {
      x: 0.32, y: panelY, w: SLIDE_W - 0.64, h: panelH,
      rectRadius: 0.2,
      fill: { color: hexToRgb(c.surface) },
      line: { color: primary, transparency: 72, width: 1 }
    })

    s.addShape('rect' as PptxGenJS.ShapeType, {
      x: 0.32, y: panelY, w: leftW - 0.32, h: panelH,
      fill: { color: hexToRgb(c.surface) },
      line: { color: hexToRgb(c.surface), width: 0 }
    })

    s.addShape('rect' as PptxGenJS.ShapeType, {
      x: rightX, y: panelY, w: rightW - 0.32, h: panelH,
      fill: { color: toPptxHex(c.primaryLight) },
      line: { color: toPptxHex(c.primaryLight), width: 0 }
    })

    s.addText(projectName, {
      x: 0.7, y: 0.86 + vOffset, w: 4.6, h: 0.32,
      fontSize: 10 * scale, fontFace: fB, color: hexToRgb(c.textSecondary), bold: true, fit: 'shrink'
    })

    s.addText(slide.title, {
      x: 0.7, y: 1.78 + vOffset, w: 5.2, h: 1.08,
      fontSize: 44 * scale, fontFace: fH, color: hexToRgb(c.text), bold: false, fit: 'shrink'
    })

    s.addText(bodyText, {
      x: 0.7, y: 3.52 + vOffset, w: 5.2, h: 2.36,
      fontSize: 15 * scale, fontFace: fB, color: hexToRgb(c.text),
      valign: 'top', lineSpacingMultiple: 1.2, fit: 'shrink'
    })

    if (firstSeries.length > 0) {
      s.addChart(chartType, firstSeries, {
        x: 6.88, y: 2.44 + vOffset, w: 5.52, h: 3.65,
        chartColors: [primary],
        showLegend: false,
        catAxisLabelColor: hexToRgb(c.textSecondary),
        valAxisLabelColor: hexToRgb(c.textSecondary),
        valGridLine: { style: 'solid', color: hexToRgb(c.border) },
        valAxisMinVal: 0,
        valAxisMaxVal: roundedMax,
      })
    }

    s.addText('23', {
      x: 12.2, y: 0.84 + vOffset, w: 0.45, h: 0.2,
      fontSize: 13 * scale, fontFace: fB, color: hexToRgb(c.text), bold: true, align: 'right'
    })

    s.addText(slide.chart.title || 'Category', {
      x: 8.95, y: 6.18 + vOffset, w: 2.7, h: 0.3,
      fontSize: 13 * scale, fontFace: fB, color: hexToRgb(c.text), align: 'center', fit: 'shrink'
    })
    return
  }

  s.addText(slide.title, {
    x: PAD_X, y: 0.4 + vOffset, w: SLIDE_W - PAD_X * 2, h: 0.8,
    fontSize: 24 * scale, fontFace: fH, color: hexToRgb(c.text), bold: true, align: 'center', fit: 'shrink'
  })
  if (slide.chart.title) {
    s.addText(slide.chart.title, {
      x: 0.8, y: 1.2 + vOffset, w: 11.5, h: 0.4,
      fontSize: 14 * scale, fontFace: fB, color: hexToRgb(c.textSecondary), align: 'center'
    })
  }

  const colorCount = slide.chart.series.length;
  const colors = getSeriesColorPalette(c, colorCount, [c.surface, c.surfaceAlt]).map(toPptxHex);

  const chartOpts: PptxGenJS.IChartOpts = {
    x: 1.5, y: 1.8 + vOffset, w: 10.33, h: 5.2,
    chartColors: colors, showLegend: true, legendPos: 'b',
    dataLabelColor: hexToRgb(c.text), valAxisLabelColor: hexToRgb(c.textSecondary), catAxisLabelColor: hexToRgb(c.textSecondary),
    valGridLine: { style: 'dash', color: hexToRgb(c.border) }
  }
  s.addChart(chartType, chartData, chartOpts)
}

function renderListFeatured(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const background = toPptxHex(sem.canvas)
  const textColor = toPptxHex(sem.onCanvas)
  const secondaryColor = toPptxHex(sem.subtleOnCanvas)
  const borderColor = toPptxHex(sem.onSurface)
  const primaryColor = toPptxHex(c.primary)
  s.background = { fill: background }

  const spec = layoutSpecs.listFeatured
  const metaLabel = slide.subtitle?.trim() || ''
  const topbarY = spec.topbarY + vOffset
  const topbarH = spec.topbarHeight
  const topbarLineY = topbarY + topbarH + 0.08
  const outerY = 0.55 + vOffset
  const outerH = 6.75
  const leftW = spec.leftPanelW
  const gap = spec.panelGap
  const rightX = spec.outerPadX + leftW + gap
  const rightW = SLIDE_W - rightX - spec.outerPadX
  const items = (slide.cards || []).slice(0, 8)
  const count = items.length
  const cols = count > 5 ? 2 : 1
  const rows = Math.max(1, Math.ceil(Math.max(count, 1) / cols))
  const dense = count >= 7
  const fewMode = count > 0 && count <= 5
  const matrixTop = spec.matrixTop + vOffset
  const matrixBottom = spec.matrixBottom
  const rowGap = fewMode ? 0.2 : dense ? 0.24 : 0.34
  const colGap = 0.46
  const itemW = (rightW - 1.16 - (cols - 1) * colGap) / cols
  const itemH = (matrixBottom - matrixTop - (rows - 1) * rowGap) / rows

  s.addText('', {
    x: 0.16, y: topbarY, w: 2.2, h: topbarH,
    fontSize: 10 * scale, fontFace: fH, color: textColor, bold: true
  })

  s.addText(metaLabel, {
    x: 3.2, y: topbarY, w: 6.6, h: topbarH,
    fontSize: 10 * scale, fontFace: fH, color: secondaryColor, bold: true,
    align: 'center', fit: 'shrink'
  })

  s.addText('', {
    x: 10.8, y: topbarY, w: 2.3, h: topbarH,
    fontSize: 10 * scale, fontFace: fH, color: textColor, bold: true,
    align: 'right'
  })

  s.addShape('line' as PptxGenJS.ShapeType, {
    x: 0.12, y: topbarLineY, w: 13.08, h: 0,
    line: { color: borderColor, width: 1 }
  })

  s.addShape('roundRect' as PptxGenJS.ShapeType, {
    x: 0.18, y: outerY, w: leftW, h: outerH,
    rectRadius: 0.28,
    fill: { color: background },
    line: { color: textColor, width: 1 }
  })

  s.addShape('roundRect' as PptxGenJS.ShapeType, {
    x: rightX, y: outerY, w: rightW, h: outerH,
    rectRadius: 0.28,
    fill: { color: background },
    line: { color: textColor, width: 1 }
  })

  s.addText(slide.title, {
    x: 0.34, y: 2.55 + vOffset, w: leftW - 0.68, h: 2.3,
    fontSize: 32 * scale, fontFace: fH, color: textColor, bold: false,
    valign: 'middle', fit: 'shrink'
  })

  items.forEach((item, index) => {
    const col = cols === 1 ? 0 : index % 2
    const row = cols === 1 ? index : Math.floor(index / 2)
    const x = rightX + 0.6 + col * (itemW + colGap)
    const y = matrixTop + row * (itemH + rowGap)
    const bulletSize = fewMode ? 0.16 : dense ? 0.13 : 0.15
    const headingSize = fewMode ? 19.6 : dense ? 15.8 : 17.2
    const bodySize = fewMode ? 12.4 : dense ? 10.1 : 10.9
    const bodyY = y + 0.38

    s.addShape('ellipse' as PptxGenJS.ShapeType, {
      x, y: y + 0.05, w: bulletSize, h: bulletSize,
      fill: { color: primaryColor },
      line: { color: primaryColor, width: 0 }
    })

    s.addText(item.heading, {
      x: x + 0.34, y, w: itemW - 0.48, h: 0.28,
      fontSize: headingSize * scale, fontFace: fH, color: textColor,
      bold: true, fit: 'shrink', breakLine: false
    })

    s.addText(item.body, {
      x: x + 0.34, y: bodyY, w: itemW - 0.48, h: Math.max(0.35, itemH - 0.42),
      fontSize: bodySize * scale, fontFace: fB, color: secondaryColor,
      valign: 'top', lineSpacingMultiple: 1.16, fit: 'shrink'
    })
  })
}

function renderCardsSplit(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.cardsSplit
  s.background = { fill: toPptxHex(sem.canvas) }
  const cards = (slide.cards || []).slice(0, 5)
  const count = Math.min(5, Math.max(3, cards.length || 3))

  s.addText(slide.title, {
    x: spec.padX * 0.5, y: 3.18 + vOffset, w: 3.9, h: 0.82,
    fontSize: 36 * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true, fit: 'shrink'
  })

  if (slide.subtitle?.trim()) {
    s.addText(slide.subtitle.trim(), {
      x: spec.padX * 0.5, y: 3.96 + vOffset, w: 3.9, h: 0.98,
      fontSize: 19 * scale, fontFace: fH, color: toPptxHex(sem.subtleOnCanvas),
      lineSpacingMultiple: 1.12, fit: 'shrink'
    })
  }

  const listX = 5.62
  const listW = 7.35
  const listY = 0.88 + vOffset
  const listH = 5.95
  const rowGap = 0.06
  const rowH = (listH - rowGap * (count - 1)) / count
  const imageW = 2.32
  const imageH = Math.max(0.78, rowH - 0.16)

  for (let i = 0; i < count; i += 1) {
    const rowY = listY + i * (rowH + rowGap)
    const card = cards[i]

    s.addShape('line' as PptxGenJS.ShapeType, {
      x: listX, y: rowY, w: listW, h: 0,
      line: { color: hexToRgb(c.border), width: 1 }
    })

    if (card?.image?.url) {
      s.addImage({
        path: card.image.url,
        x: listX, y: rowY + 0.08, w: imageW, h: imageH,
        sizing: { type: 'cover', w: imageW, h: imageH }
      })
    } else {
      s.addShape('roundRect' as PptxGenJS.ShapeType, {
        x: listX, y: rowY + 0.08, w: imageW, h: imageH,
        rectRadius: 0.06,
        fill: { color: hexToRgb(c.surfaceAlt) },
        line: { color: hexToRgb(c.surfaceAlt), width: 0 }
      })
    }

    s.addText(card?.heading || '', {
      x: listX + imageW + 0.28, y: rowY + 0.12, w: listW - imageW - 0.28, h: 0.32,
      fontSize: 15 * scale, fontFace: fH, color: toPptxHex(sem.onCanvas), bold: true, fit: 'shrink'
    })

    s.addText(card?.body || '', {
      x: listX + imageW + 0.28, y: rowY + 0.46, w: listW - imageW - 0.28, h: Math.max(0.28, rowH - 0.52),
      fontSize: 12 * scale, fontFace: fB, color: toPptxHex(sem.onCanvas),
      lineSpacingMultiple: 1.15, fit: 'shrink'
    })
  }
}

function renderStaggeredCards(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  const spec = layoutSpecs.staggeredCards
  s.background = { fill: toPptxHex(sem.canvas) }

  s.addText(slide.title, {
    x: spec.paddingX, y: 0.5 + vOffset, w: SLIDE_W - spec.paddingX * 2, h: 1,
    fontSize: 28 * scale, fontFace: fH, bold: true, color: toPptxHex(c.primary), align: 'center'
  })

  const cards = slide.cards || []
  const count = cards.length
  const cardW = spec.cardW
  const stepX = cardW + spec.gapX

  cards.forEach((card, i) => {
    const x = spec.paddingX + i * stepX
    const y = spec.baseY + vOffset + i * (count > 3 ? spec.stepY * 0.5 : spec.stepY)
    const h = spec.cardH * scale

    s.addShape('roundRect' as PptxGenJS.ShapeType, {
      x, y, w: cardW, h,
      fill: { color: toPptxHex(sem.onSurface), transparency: 96 },
      line: { color: hexToRgb(c.border), width: 1 },
      rectRadius: 0.1
    })

    const iconName = card.icon || inferIcon(card.heading)
    if (iconName) {
      s.addShape('ellipse' as PptxGenJS.ShapeType, {
        x: x + 0.25, y: y + 0.25, w: 0.6, h: 0.6,
        fill: { color: toPptxHex(sem.onSurface), transparency: 94 },
        line: { color: toPptxHex(c.primary), width: 1 }
      })
      s.addImage({
        data: getIconBase64(iconName, `#${toPptxHex(c.primary)}`),
        x: x + 0.36, y: y + 0.36, w: 0.38, h: 0.38
      })
    }

    s.addText(card.heading, {
      x: x + 0.3, y: y + (iconName ? 0.9 : 0.4), w: cardW - 0.6, h: 0.5,
      fontSize: 18 * scale, fontFace: fH, color: toPptxHex(c.primary), bold: true, fit: 'shrink'
    })

    s.addText(card.body, {
      x: x + 0.3, y: y + (iconName ? 1.4 : 0.9), w: cardW - 0.6, h: 1.5,
      fontSize: 14 * scale, fontFace: fB, color: toPptxHex(sem.onCanvas), valign: 'top',
      lineSpacingMultiple: 1.1, fit: 'shrink'
    })
  })
}

function renderTeamMembers(s: Slide, slide: SlideContent, c: Colors, fH: string, fB: string, scale = 1, vOffset = 0) {
  const sem = getSemanticColors(c)
  s.background = { fill: toPptxHex(sem.canvas) }
  const textColor = toPptxHex(sem.onCanvas)
  const secondaryColor = toPptxHex(sem.subtleOnCanvas)

  // Header Title Area (Optional, derived from slide.title if needed, but the design 4:1252 had it in footer)
  // According to our React impl, title is in footer. But sometimes slides have main titles.
  // We'll follow the footer-heavy design.

  const headerY = 1.0 + vOffset
  s.addText('Working group', {
    x: 1.0, y: headerY, w: 5, h: 0.4,
    fontSize: 14 * scale, fontFace: fB, color: secondaryColor, bold: true
  })
  s.addText('Role', {
    x: 7.5, y: headerY, w: 5, h: 0.4,
    fontSize: 14 * scale, fontFace: fB, color: secondaryColor, bold: true
  })

  s.addShape('line' as PptxGenJS.ShapeType, {
    x: 1.0, y: headerY + 0.45, w: 11.33, h: 0,
    line: { color: toPptxHex(c.border), width: 1 }
  })

  const members = (slide.cards || []).slice(0, 8)
  const startY = headerY + 0.6
  const availableH = 5.2
  const rowH = Math.min(0.65, availableH / Math.max(1, members.length))

  members.forEach((member, i) => {
    const y = startY + i * rowH
    const iconName = member.icon || 'user'

    s.addShape('ellipse' as PptxGenJS.ShapeType, {
      x: 1.05, y: y + 0.08, w: 0.44, h: 0.44,
      fill: { color: toPptxHex(sem.onSurface), transparency: 92 },
      line: { color: toPptxHex(c.border), width: 0.5 }
    })

    s.addImage({
      data: getIconBase64(iconName, '#' + textColor),
      x: 1.15, y: y + 0.18, w: 0.24, h: 0.24
    })

    s.addText(member.heading, {
      x: 1.7, y: y, w: 5.5, h: rowH,
      fontSize: 16 * scale, fontFace: fH, color: textColor, bold: true, valign: 'middle', fit: 'shrink'
    })

    s.addText(member.body, {
      x: 7.5, y: y, w: 5, h: rowH,
      fontSize: 14 * scale, fontFace: fB, color: secondaryColor, valign: 'middle', fit: 'shrink'
    })
  })

  // Footer
  const footerY = 6.8
  s.addShape('rect' as PptxGenJS.ShapeType, {
    x: 1.0, y: footerY + 0.1, w: 0.1, h: 0.35,
    fill: { color: toPptxHex(c.primary) }
  })
  s.addText(slide.title || 'Project Name', {
    x: 1.25, y: footerY, w: 6, h: 0.5,
    fontSize: 14 * scale, fontFace: fH, color: textColor, bold: true, valign: 'middle'
  })
  s.addText(`by ${slide.subtitle || 'Author Name'}`, {
    x: 7.33, y: footerY, w: 5, h: 0.5,
    fontSize: 12 * scale, fontFace: fB, color: secondaryColor, align: 'right', valign: 'middle'
  })
}



