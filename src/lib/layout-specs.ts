/**
 * Layout Specifications - CSS-to-PPTX Calibration
 *
 * All values in INCHES, derived from slide-layouts.css via:
 *   CSS rem → inches: rem × 16 × (13.33 / 960) = rem × 0.222
 *   CSS px  → inches: px × (13.33 / 960) = px × 0.01389
 *
 * PPTX canvas: 13.33" × 7.5" (standard 16:9)
 * Frontend canvas: 960px max-width, 16:9 aspect ratio
 *
 * [CRITICAL] Font Scaling:
 *   CSS px at 96dpi: 1px = 1/96 inch
 *   PPT pt: 1pt = 1/72 inch
 *   To match visual size: PPT pt = CSS px * (72 / 96) = CSS px * 0.75
 */

const R = 0.222   // 1rem in inches
const PX = 0.01389 // 1px in inches

export const SLIDE_W = 13.33
export const SLIDE_H = 7.5

export const layoutSpecs = {
  // --- image-text / text-image ---
  // CSS: padding 2.35rem, gap clamp(3.5rem,7vw,5.25rem), grid 1.06fr:0.94fr
  imageText: {
    paddingX: 2.35 * R,   // 0.522"
    paddingY: 2.35 * R,   // 0.522"
    gap: 4.2 * R,         // 0.932" (midpoint of clamp)
    imageRatio: 1.06,
    textRatio: 0.94,
  },

  // --- image-center ---
  // CSS: flex 0 0 70% visual, text grid 42%:58%, padding 1rem 1.35rem
  imageCenter: {
    visualRatio: 0.70,
    textPadX: 1.35 * R,     // 0.30"
    textPadTop: 1.0 * R,    // 0.222"
    textPadBottom: 0.95 * R, // 0.211"
    titleWidthRatio: 0.42,
  },

  // --- list-featured ---
  // CSS: padding 0.78rem 0.88rem, grid 30.5%:auto, gap 0.12rem
  listFeatured: {
    outerPadX: 0.88 * R,     // 0.195"
    topbarY: 0.78 * R,       // 0.173" (top padding)
    topbarHeight: 0.28 * R,  // 0.062"
    leftPanelW: SLIDE_W * 0.305, // 4.07"
    panelGap: 0.12 * R,      // 0.027"
    matrixTop: 1.48 * R,     // 0.329"  (after topbar)
    matrixBottom: SLIDE_H - 0.84 * R, // bottom padding
  },

  // --- cards-split ---
  // CSS: padding 1.35rem 1.55rem, grid 35%:65%, gap 1.25rem
  cardsSplit: {
    padX: 1.55 * R,    // 0.344"
    padY: 1.35 * R,    // 0.300"
    leftRatio: 0.35,
    rightRatio: 0.65,
    gap: 1.25 * R,     // 0.278"
  },

  // --- milestone-list ---
  // CSS: accent width 31%, content padding 0.76rem
  milestoneList: {
    accentW: SLIDE_W * 0.31,  // 4.13"
    kickerX: 0.7 * R,         // 0.155"
    contentX: SLIDE_W * 0.31 + 0.76 * R, // 4.30"
    topY: 1.45 * R,           // 0.322"
    contentHeight: 5.95,
    yearW: 1.95,
  },

  // --- comparison ---
  // Snap data (Slide 6): Title Y 2.67% (0.20"), Sub Y 11.26% (0.84"), Card Y 19.7%? (Actually Heading is 19.7%)
  comparison: {
    cardY: 1.48,     // Adjusted to match real container bleed
    cardH: 5.6, 
    colW: (SLIDE_W - 0.76 * R * 2 - 1.12 * R) / 2, // 5.75"
    gap: 1.12 * R,  // 0.249"
    leftX: 0.76 * R, // 0.169"
  },

  // --- metrics ---
  // CSS: left panel 37.5%, right grid padding 1.95rem 2.1rem, gap 1.3rem
  metrics: {
    leftW: SLIDE_W * 0.375, // 5.0"
    rightPad: 2.1 * R,      // 0.467"
    gridY: 1.95 * R,        // 0.433"
    gridH: SLIDE_H - 1.95 * R * 2, // available height
    colGap: 1.3 * R,        // 0.289"
    rowGap: 1.3 * R,        // 0.289"
  },

  // --- quote ---
  // CSS: padding 1.25rem 1.45rem, grid gap varies by count
  quote: {
    sidePad: 1.45 * R,    // 0.322"
    baseY: 1.25 * R + 0.8, // after top padding + avatar space
    avatarSize: 3.9 * R,  // 0.866"  (CSS: 3.9rem)
  },

  // --- chart-pie ---
  chartPie: {
    paddingX: 0.6,
    chartW: 6.5,
    legendX: 7.5,
    legendGap: 0.75,
  },

  // --- text-bullets (structured table) ---
  // CSS: padding 0.62rem 0 0.38rem, full width table
  textLayout: {
    paddingX: 0.62 * R,  // 0.138" (very tight, as CSS shows)
    headingY: 0.62 * R,  // 0.138"
    bodyY: 0.62 * R + 0.34 * R + 0.8, // after title + margin
  },

  // --- cards generic (3-col centered, 4-col grid) ---
  // CSS cards-3: padding 2.5rem 2.75rem, gap 1rem, card min-height 15rem
  // CSS cards-4: gap 0.75rem
  cardsGeneric: {
    paddingX: 2.75 * R,  // 0.611"
    paddingY: 2.5 * R,   // 0.555"
    gap: 1.0 * R,        // 0.222"
    cardH: 15 * R,       // 3.33" (CSS min-height 15rem)
  },

  // --- staggered-cards ---
  staggeredCards: {
    paddingX: 2.75 * R,
    cardW: 3.8,
    gapX: 1.0 * R,
    baseY: 2.0,
    stepY: 1.5 * R,     // CSS translateY(1.5rem)
    cardH: 15 * R,
  },

  fonts: {
    // [Calibration: PPT pt = CSS px (1:1 mapping for 960pt LAYOUT_WIDE)]
    
    // Cards 3 centered
    cardsCenteredKicker: 20,   // SH2: 20px
    cardsCenteredTitle: 37.3,  // H2: 37.3px
    cardHeading: 20,           // SH2: 20px
    cardBody: 14,              // B1: 14px

    // Cards generic
    cardItemHeading: 20,       
    cardItemBody: 14,        

    // Comparison (Snap: Title 44.5px, Sub 15.7px, Head 19.2px, Body 11.8px)
    comparisonTitle: 44.5,     
    comparisonSubtitle: 15.7,  
    comparisonHeading: 19.2,   
    comparisonBody: 12,         

    // Quote
    quoteText1: 22.7,  
    quoteText2: 18,
    quoteText3: 16,
    quoteText4: 13.3,
    quoteText5: 11.3,
    quoteAttr1: 16,
    quoteAttr2: 14,
    quoteAttr3: 12,
    quoteAttr4: 10,
    quoteAttr5: 9.3,

    // Metrics (Snap 4.15rem = 66.4px)
    metricsValue: 53.3,   
    metricsLabel: 16,   
    metricsTitle: 32,   

    // Timeline
    timelineTitle: 32,
    timelineCaption: 17,      // 17px
    timelineHeading: 20,      // S2: 1.25rem -> 20px
    timelineDescription: 15.2, // B2: 0.95rem -> 15.2px

    // Text bullets (structured)
    textBulletsTitle: 33,     
    textBulletsIndex: 32,       
    textBulletsDescription: 17,

    // Text center
    textCenterTitle: 33,
    textCenterBody: 21,

    // Image text
    imageTextTitle: 37.3,        
    imageTextBody: 16,
    listFeaturedTitle: 32,     
    listFeaturedHeading: 16,
    listFeaturedBody: 11.3,
    cardsSplitTitle: 32,       
    cardsSplitSubtitle: 16,    
    cardsSplitHeading: 14,
    cardsSplitBody: 11.3,

    // Cards 2 (dual metric)
    cards2Value: 24,           // 32 * 0.75 (Down from 25.5)
    cards2Description: 15.8,
    cards2Kicker: 9,
  },
} as const

// ---------------------------------------------------------------------------
// Template Bounding Boxes — used by Pretext Engine for typography fitting
// All values in PIXELS at 1920×1080 canvas (2× the 960px frontend canvas)
//
// Conversion from layoutSpecs inches: px = inches × (1920 / 13.33) ≈ inches × 144
// Conversion from CSS rem at 960: px = rem × 16 × 2 = rem × 32
// ---------------------------------------------------------------------------

import type { LayoutType } from './types'
import type { TypoLevel } from './utils/pretext-engine'

interface TextBounds { 
  w: number; 
  h: number; 
  defaultTier: TypoLevel;  // Design baseline font tier (from CSS fallback)
  x?: number; 
  y?: number; 
  fontSize?: number; 
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
}

export interface TemplateBoundsEntry {
  title: TextBounds
  subtitle?: TextBounds
  body: TextBounds
  cardHeading?: TextBounds
  cardBody?: TextBounds
  eventTitle?: TextBounds
  eventDesc?: TextBounds
  metricValue?: TextBounds
  metricLabel?: TextBounds
}

export const templateBounds: Record<LayoutType, TemplateBoundsEntry> = {
  // === Text-heavy layouts ===
  'text-center': {
    title: { w: 1600, h: 140, defaultTier: 'H2' },
    body:  { w: 1400, h: 720, defaultTier: 'B1' },     // old B2(32px) → new B1(32px)
  },
  'text-bullets': {
    title: { w: 1760, h: 120, defaultTier: 'H3' },
    body:  { w: 1760, h: 780, defaultTier: 'B1' },     // old B2(32px) → new B1(32px)
  },

  // === Image + Text layouts ===
  'image-text': {
    title: { w: 820, h: 100, defaultTier: 'H2' },
    body:  { w: 820, h: 680, defaultTier: 'B1' },      // old B2(32px) → new B1(32px)
  },
  'text-image': {
    title: { w: 820, h: 100, defaultTier: 'H2' },
    body:  { w: 820, h: 680, defaultTier: 'B1' },      // old B2(32px) → new B1(32px)
  },
  'image-center': {
    title: { w: 760, h: 90, defaultTier: 'H2' },
    body:  { w: 1040, h: 240, defaultTier: 'B1' },     // old B2(32px) → new B1(32px)
  },
  'image-full': {
    title: { w: 1600, h: 100, defaultTier: 'H2' },
    body:  { w: 1600, h: 200, defaultTier: 'B1' },     // old B2(32px) → new B1(32px)
  },

  // === Card layouts ===
  'cards-2': {
    title:       { w: 1600, h: 80,  defaultTier: 'H3' },
    body:        { w: 860,  h: 420, defaultTier: 'B1' },    // old B2 → new B1
    cardHeading: { w: 700,  h: 60,  defaultTier: 'S2' },    // old H2 -> S2 避免喧宾夺主
    cardBody:    { w: 700,  h: 450, defaultTier: 'B1' },    // h*1.5 放大容差
  },
  'cards-3': {
    title:       { w: 1600, h: 80,  defaultTier: 'H3' },
    body:        { w: 540,  h: 360, defaultTier: 'B2' },    // old B3(27px) → new B2(28px)
    cardHeading: { w: 520,  h: 50,  defaultTier: 'S2' },
    cardBody:    { w: 520,  h: 280, defaultTier: 'B2' },    // old B3(27px) → new B2(28px)
  },
  'cards-4': {
    // 2x2 grid: each card 44.38%×34.85% → 426×188@960 → 852×376@1920
    // card body text: w=39.35%=378@960→756, h=(50.55-37.35)%=71@960→142
    title:       { w: 1600, h: 70,  defaultTier: 'H3' },
    body:        { w: 860,  h: 160, defaultTier: 'B2' },
    cardHeading: { w: 770,  h: 46,  defaultTier: 'S2' },
    cardBody:    { w: 760,  h: 140, defaultTier: 'B3' },    // tight vertical space, wider lines
  },
  'staggered-cards': {
    title:       { w: 1600, h: 80,  defaultTier: 'H3' },
    body:        { w: 540,  h: 360, defaultTier: 'B1' },    // old B2 → new B1
    cardHeading: { w: 520,  h: 50,  defaultTier: 'S2' },
    cardBody:    { w: 520,  h: 280, defaultTier: 'B1' },    // old B2 → new B1
  },
  'cards-split': {
    title:       { w: 800,  h: 90,  defaultTier: 'H3' },
    body:        { w: 1000, h: 200, defaultTier: 'B2' },    // old B3 → new B2
    cardHeading: { w: 560,  h: 40,  defaultTier: 'S2' },
    cardBody:    { w: 560,  h: 225, defaultTier: 'B1' },    // h*1.5 放大容差
  },

  // === Comparison ===
  'comparison': {
    title: { w: 1600, h: 100, defaultTier: 'H2' },
    body:  { w: 820,  h: 480, defaultTier: 'B1' },     // old B2 → new B1
  },

  // === Timeline & Milestones ===
  'timeline': {
    title:      { w: 1000, h: 80,  defaultTier: 'H3' },
    body:       { w: 700,  h: 230, defaultTier: 'B2' },    // old B3 → new B2
    eventTitle: { w: 600,  h: 50,  defaultTier: 'S2' },
    eventDesc:  { w: 600,  h: 160, defaultTier: 'B2' },    // old B3 → new B2
  },
  'milestone-list': {
    title:      { w: 1200, h: 100, defaultTier: 'H2' },
    body:       { w: 720,  h: 180, defaultTier: 'B2' },    // old B3 → new B2
    eventTitle: { w: 600,  h: 50,  defaultTier: 'S2' },
    eventDesc:  { w: 600,  h: 120, defaultTier: 'B2' },    // old B3 → new B2
  },

  // === Metrics ===
  'metrics': {
    title:       { w: 500,  h: 80,  defaultTier: 'H2' },
    body:        { w: 500,  h: 400, defaultTier: 'B1' },   // old B2 → new B1
    metricValue: { w: 400,  h: 80,  defaultTier: 'H1' },
    metricLabel: { w: 400,  h: 50,  defaultTier: 'B1' },   // old B1(36px) → new B1(32px)
  },
  'metrics-rings': {
    title:       { w: 500,  h: 80,  defaultTier: 'H2' },
    body:        { w: 500,  h: 400, defaultTier: 'B1' },   // old B2 → new B1
    metricValue: { w: 200,  h: 60,  defaultTier: 'H1' },
    metricLabel: { w: 280,  h: 50,  defaultTier: 'B1' },   // old B2(32px) → new B1(32px)
  },

  // === Quote ===
  'quote': {
    title:    { w: 1400, h: 400, defaultTier: 'H2' },
    body:     { w: 1400, h: 400, defaultTier: 'B1' },
    cardBody: { w: 500,  h: 200, defaultTier: 'B1' },      // old B2 → new B1
  },
  'quote-no-avatar': {
    title:    { w: 1400, h: 400, defaultTier: 'H2' },
    body:     { w: 1400, h: 400, defaultTier: 'B1' },
    cardBody: { w: 500,  h: 200, defaultTier: 'B1' },
  },

  // === Charts ===
  'chart-bar': {
    // Left panel text: 38.56%×82% → @960: 370×443px → @1920: 740×886
    title: { w: 800,  h: 70,  defaultTier: 'H2' },   // 41.91%×5.95% = 402×32@960 → 804×64
    body:  { w: 740,  h: 880, defaultTier: 'B2' },    // 38.56%×(97-15)% = 370×443@960 → 740×886
  },
  'chart-bar-compare': {
    title: { w: 800,  h: 70,  defaultTier: 'H2' },
    body:  { w: 740,  h: 880, defaultTier: 'B2' },
  },
  'chart-line': {
    title: { w: 1600, h: 100, defaultTier: 'H2' },
    body:  { w: 1600, h: 800, defaultTier: 'B1' },     // old B2 → new B1
  },
  'chart-pie': {
    title: { w: 1600, h: 100, defaultTier: 'H2' },
    body:  { w: 1600, h: 800, defaultTier: 'B1' },     // old B2 → new B1
  },

  // === Special layouts ===
  'list-featured': {
    title:       { w: 1600, h: 80,  defaultTier: 'H2' },
    body:        { w: 440,  h: 160, defaultTier: 'B2' },    // old B3 → new B2
    cardHeading: { w: 380,  h: 40,  defaultTier: 'S2' },
    cardBody:    { w: 380,  h: 165, defaultTier: 'B2' },    // h*1.5 放大容差
  },
  'features-list-image': {
    title:       { w: 500,  h: 80,  defaultTier: 'H3' },
    body:        { w: 500,  h: 300, defaultTier: 'B1' },    // old B2 → new B1
    cardHeading: { w: 460,  h: 40,  defaultTier: 'S2' },
    cardBody:    { w: 460,  h: 160, defaultTier: 'B2' },    // old B3 → new B2
  },
  'team-members': {
    title: { w: 400, h: 60,  defaultTier: 'H3' },
    body:  { w: 400, h: 100, defaultTier: 'B1' },     // old B2 → new B1
  },

  // === Structural ===
  'cover': {
    title: { w: 1400, h: 200, defaultTier: 'H1' },
    body:  { w: 1400, h: 120, defaultTier: 'B1' },
  },
  'section-header': {
    title: { w: 1400, h: 200, defaultTier: 'H1' },
    body:  { w: 1400, h: 120, defaultTier: 'B1' },
  },
  'ending': {
    title: { w: 1400, h: 200, defaultTier: 'H1' },
    body:  { w: 1400, h: 120, defaultTier: 'B1' },
  },

  // === Advanced featured layouts ===
  'cards-4-featured': {
    title:       { w: 1400, h: 200, defaultTier: 'H1' },
    body:        { w: 320,  h: 400, defaultTier: 'B2' },    // old B3 → new B2
    cardHeading: { w: 280,  h: 50,  defaultTier: 'S1' },
    cardBody:    { w: 280,  h: 300, defaultTier: 'B2' },    // old B3 → new B2
  },
  'grid-2x2-featured': {
    title:       { w: 800,  h: 600, defaultTier: 'H2' },
    body:        { w: 460,  h: 400, defaultTier: 'B2' },
    cardHeading: { w: 420,  h: 50,  defaultTier: 'S2' },
    cardBody:    { w: 420,  h: 200, defaultTier: 'B2' },    // Reduced from 300: tight 2x2 grid
  },
  'cards-3-featured': {
    // Measured from snapshot: card=24.44%×45.04%, text=18.74% wide, body zone=29.4%
    // @960: text_w=180px, body_h=159px → @1920: 360×318, with gap buffer → 300
    title:       { w: 1230, h: 190, defaultTier: 'H2' },  // 64%×17.93% = 614×97@960 → 1228×194
    body:        { w: 500,  h: 500, defaultTier: 'B2' },
    cardHeading: { w: 360,  h: 58,  defaultTier: 'S1' },   // 18.74%×5.38% = 180×29@960 → 360×58
    cardBody:    { w: 360,  h: 300, defaultTier: 'B4' },   // 18.74%×29.4% = 180×159@960 → 360×300 (with gap)
  },
  'cards-3-stack': {
    // Measured from snapshot: card=25%×89%, text=19.29% wide, body zone=52%
    // @960: text_w=185px, body_h=281px → @1920: 370×562, with gap → 440
    title:       { w: 485,  h: 60,  defaultTier: 'H3' },   // 25.25%×2.77% = 242×15@960 → capsule inner
    body:        { w: 600,  h: 600, defaultTier: 'B2' },
    cardHeading: { w: 370,  h: 53,  defaultTier: 'S1' },   // 19.29%×4.89% = 185×26@960 → 370×53
    cardBody:    { w: 370,  h: 440, defaultTier: 'B3' },   // 19.29%×52% = 185×281@960 → 370×440 (with kicker+gap)
  },
}
