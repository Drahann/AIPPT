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
    // [Calibration: PPT pt = CSS px * 0.75]
    
    // Cards 3 centered
    cardsCenteredKicker: 36,   // 48px * 0.75
    cardsCenteredTitle: 40,    // 53.6px * 0.75
    cardHeading: 16.5,         // 22px * 0.75
    cardBody: 12,              // 16px * 0.75

    // Cards generic
    cardItemHeading: 12,       // 16px * 0.75
    cardItemBody: 10.5,        // 14px * 0.75

    // Comparison (Snap: Title 44.5px, Sub 15.7px, Head 19.2px, Body 11.8px)
    comparisonTitle: 33.4,     // 44.48 * 0.75
    comparisonSubtitle: 11.8,  // 15.68 * 0.75
    comparisonHeading: 14.4,   // 19.2 * 0.75
    comparisonBody: 9,         // 11.84 * 0.75 (Matches snap)

    // Quote
    quoteText1: 17,  // 23 * 0.75
    quoteText2: 13.5,
    quoteText3: 12,
    quoteText4: 10,
    quoteText5: 8.5,
    quoteAttr1: 12,
    quoteAttr2: 10.5,
    quoteAttr3: 9,
    quoteAttr4: 7.5,
    quoteAttr5: 7,

    // Metrics (Snap 4.15rem = 66.4px)
    metricsValue: 50,   // 66.4 * 0.75
    metricsLabel: 12.8, // 17 * 0.75
    metricsTitle: 27.8, // 37 * 0.75

    // Timeline
    timelineTitle: 24,        // 32 * 0.75
    timelineHeading: 18,      // 24 * 0.75
    timelineDescription: 12,  // 16 * 0.75

    // Text bullets (structured)
    textBulletsTitle: 24.8,     // 33 * 0.75
    textBulletsIndex: 24,       // 32 * 0.75
    textBulletsDescription: 12.8, // 17 * 0.75

    // Text center
    textCenterTitle: 24.8,
    textCenterBody: 15.8,

    // Image text
    imageTextTitle: 34.5,
    imageTextBody: 12.8,

    // List featured
    listFeaturedTitle: 30,
    listFeaturedHeading: 12,
    listFeaturedBody: 8.5,

    // Cards split
    cardsSplitTitle: 34.5,
    cardsSplitSubtitle: 14.3,
    cardsSplitHeading: 10.5,
    cardsSplitBody: 8.5,

    // Cards 2 (dual metric)
    cards2Value: 25.5,
    cards2Description: 15.8,
    cards2Kicker: 9,
  },
} as const
