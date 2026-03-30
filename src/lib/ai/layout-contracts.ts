import { LayoutType, SlideContent, SlideOutline } from '../types'

type ValidationResult = {
  valid: boolean
  slide: SlideContent
  remapped: boolean
  errors: string[]
  contentMissing: boolean
}

const CARD_LAYOUTS: LayoutType[] = [
  'cards-2',
  'cards-3',
  'cards-4',
  'list-featured',
  'quote',
  'quote-no-avatar',
  'staggered-cards',
  'features-list-image',
  'cards-split',
]

const GENERIC_TITLES = new Set([
  '核心要点',
  '三项能力',
  '四项能力',
  '关键观点',
  '核心观点',
  '引用观点',
  '解决方案覆盖',
  '功能亮点',
  '功能总览',
])

function toCardsFromBody(slide: SlideContent): SlideContent['cards'] | undefined {
  if (!slide.body || slide.body.length === 0) return undefined

  const cards = slide.body
    .flatMap((block) => {
      if (block.type === 'bullet' && block.items) {
        return block.items.map((item) => ({ heading: item, body: '' }))
      }
      if (block.type === 'paragraph' && block.text) {
        return [{ heading: block.text, body: '' }]
      }
      return []
    })
    .filter((card) => card.heading || card.body)

  return cards.length > 0 ? cards : undefined
}

function toCardsFromStringArray(values: string[], defaultHeading = ''): SlideContent['cards'] {
  return values
    .filter(Boolean)
    .map((text, index) => ({
      heading: defaultHeading ? `${defaultHeading}${index + 1}` : '',
      body: text,
    }))
}

function toEventsFromCards(slide: SlideContent): SlideContent['events'] | undefined {
  if (!slide.cards || slide.cards.length === 0) return undefined
  const events = slide.cards
    .map((card, index) => ({
      date: card.icon || `阶段${index + 1}`,
      title: card.heading || `阶段${index + 1}`,
      description: card.body || '',
    }))
    .filter((event) => event.title || event.description)
  return events.length > 0 ? events : undefined
}

function toEventsFromBody(slide: SlideContent): SlideContent['events'] | undefined {
  if (!slide.body || slide.body.length === 0) return undefined
  const items = slide.body.flatMap((block) => {
    if (block.type === 'bullet' && block.items) return block.items
    if (block.type === 'paragraph' && block.text) return [block.text]
    return []
  })
  const events = items
    .filter(Boolean)
    .map((text, index) => ({
      date: `阶段${index + 1}`,
      title: text.slice(0, 18),
      description: text,
    }))
  return events.length > 0 ? events : undefined
}

function toComparisonFromCards(slide: SlideContent): Pick<SlideContent, 'left' | 'right'> | undefined {
  if (!slide.cards || slide.cards.length < 2) return undefined
  const [leftCard, rightCard] = slide.cards
  return {
    left: {
      heading: leftCard.heading || '方案一',
      items: [leftCard.body || leftCard.heading || ''],
      tone: 'positive',
    },
    right: {
      heading: rightCard.heading || '方案二',
      items: [rightCard.body || rightCard.heading || ''],
      tone: 'negative',
    },
  }
}

function toComparisonFromBody(slide: SlideContent): Pick<SlideContent, 'left' | 'right'> | undefined {
  if (!slide.body || slide.body.length === 0) return undefined
  const items = slide.body.flatMap((block) => {
    if (block.type === 'bullet' && block.items) return block.items
    if (block.type === 'paragraph' && block.text) return [block.text]
    return []
  }).filter(Boolean)
  if (items.length < 2) return undefined
  const midpoint = Math.ceil(items.length / 2)
  return {
    left: {
      heading: '左侧观点',
      items: items.slice(0, midpoint),
      tone: 'positive',
    },
    right: {
      heading: '右侧观点',
      items: items.slice(midpoint),
      tone: 'negative',
    },
  }
}

function parseNumericValue(text: string): number | null {
  const match = text.match(/-?\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

function toMetricsFromCards(slide: SlideContent): SlideContent['metrics'] | undefined {
  if (!slide.cards || slide.cards.length === 0) return undefined
  const metrics = slide.cards
    .map((card) => {
      const bodyNumber = parseNumericValue(card.body || '')
      const headingNumber = parseNumericValue(card.heading || '')
      const numericSource = headingNumber !== null ? card.heading || '' : bodyNumber !== null ? card.body || '' : ''
      const numericValue = headingNumber !== null ? headingNumber : bodyNumber
      if (numericValue === null) return null
      return {
        value: numericSource.match(/-?\d+(\.\d+)?%?/)?.[0] || String(numericValue),
        label: headingNumber !== null ? (card.body || card.heading || '') : (card.heading || card.body || ''),
        icon: card.icon,
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  return metrics.length > 0 ? metrics : undefined
}

function toMetricsFromBody(slide: SlideContent): SlideContent['metrics'] | undefined {
  if (!slide.body || slide.body.length === 0) return undefined
  const items = slide.body.flatMap((block) => {
    if (block.type === 'bullet' && block.items) return block.items
    if (block.type === 'paragraph' && block.text) return [block.text]
    return []
  })
  const metrics = items
    .map((text) => {
      const value = text.match(/-?\d+(\.\d+)?%?/)?.[0]
      if (!value) return null
      const label = text.replace(value, '').replace(/^[：:、，,\s-]+|[：:、，,\s-]+$/g, '').trim()
      return {
        value,
        label: label || '指标',
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  return metrics.length > 0 ? metrics : undefined
}

function toChartFromMetrics(slide: SlideContent): SlideContent['chart'] | undefined {
  if (!slide.metrics || slide.metrics.length === 0) return undefined
  const values = slide.metrics
    .map((metric) => parseNumericValue(metric.value))
    .filter((value): value is number => value !== null)
  if (values.length !== slide.metrics.length || values.length === 0) return undefined
  return {
    type: 'bar',
    title: slide.title || '数据图表',
    categories: slide.metrics.map((metric) => metric.label || '指标'),
    series: [
      {
        name: slide.subtitle || '数据',
        values,
      },
    ],
  }
}

function hasCards(slide: SlideContent): boolean {
  return Boolean(slide.cards?.some((card) => (card.heading || '').trim() || (card.body || '').trim()))
}

function hasEvents(slide: SlideContent): boolean {
  return Boolean(slide.events?.some((event) => (event.date || '').trim() || (event.title || '').trim() || (event.description || '').trim()))
}

function hasMetrics(slide: SlideContent): boolean {
  return Boolean(slide.metrics?.some((metric) => (metric.value || '').trim() || (metric.label || '').trim()))
}

function hasComparison(slide: SlideContent): boolean {
  return Boolean(
    slide.left &&
      slide.right &&
      ((slide.left.heading || '').trim() || (slide.left.items || []).some((item) => item.trim())) &&
      ((slide.right.heading || '').trim() || (slide.right.items || []).some((item) => item.trim()))
  )
}

function hasChart(slide: SlideContent): boolean {
  return Boolean(
    slide.chart &&
      slide.chart.categories?.length &&
      slide.chart.series?.length &&
      slide.chart.series.some((series) => Array.isArray(series.values) && series.values.length > 0)
  )
}

function hasAnySemanticContent(slide: SlideContent): boolean {
  return hasVisibleBody(slide) || hasCards(slide) || hasEvents(slide) || hasMetrics(slide) || hasComparison(slide) || hasChart(slide)
}

function toBodyFromCards(slide: SlideContent): SlideContent['body'] | undefined {
  if (!slide.cards || slide.cards.length === 0) return undefined
  const items = slide.cards
    .map((card) => [card.heading, card.body].filter(Boolean).join('：'))
    .filter(Boolean)
  if (items.length === 0) return undefined
  return [{ type: 'bullet', items }]
}

function hasVisibleBody(slide: SlideContent): boolean {
  return Boolean(
    slide.body?.some((block) =>
      block.type === 'paragraph' ? block.text?.trim() : (block.items || []).some((item) => item.trim())
    )
  )
}

export function normalizeGeneratedTitle(slide: SlideContent, outline: SlideOutline): SlideContent {
  const next = { ...slide }
  const currentTitle = (next.title || '').trim()
  if (!currentTitle || GENERIC_TITLES.has(currentTitle)) {
    next.title = outline.title
  }
  if ((!next.subtitle || !next.subtitle.trim()) && outline.subtitle?.trim()) {
    next.subtitle = outline.subtitle
  }
  return next
}

export function validateAndNormalizeSlideShape(slide: SlideContent, outline: SlideOutline): ValidationResult {
  let next: SlideContent = normalizeGeneratedTitle(slide, outline)
  let remapped = false
  const errors: string[] = []

  if (CARD_LAYOUTS.includes(next.layout)) {
    if ((!next.cards || next.cards.length === 0) && hasVisibleBody(next)) {
      const mappedCards = toCardsFromBody(next)
      if (mappedCards && mappedCards.length > 0) {
        next = { ...next, cards: mappedCards, body: undefined }
        remapped = true
      }
    }
  }

  if (['image-text', 'text-image', 'image-center', 'text-bullets', 'text-center'].includes(next.layout)) {
    if ((!next.body || next.body.length === 0) && next.cards?.length) {
      const mappedBody = toBodyFromCards(next)
      if (mappedBody) {
        next = { ...next, body: mappedBody }
        remapped = true
      }
    }
  }

  if (['timeline', 'milestone-list'].includes(next.layout) && (!next.events || next.events.length === 0)) {
    const mappedEvents = toEventsFromCards(next) || toEventsFromBody(next)
    if (mappedEvents) {
      next = { ...next, events: mappedEvents }
      remapped = true
    }
  }

  if (next.layout === 'comparison' && (!next.left || !next.right)) {
    const mappedComparison = toComparisonFromCards(next) || toComparisonFromBody(next)
    if (mappedComparison) {
      next = { ...next, ...mappedComparison }
      remapped = true
    }
  }

  if (['metrics', 'metrics-rings', 'metrics-split'].includes(next.layout) && (!next.metrics || next.metrics.length === 0)) {
    const mappedMetrics = toMetricsFromCards(next) || toMetricsFromBody(next)
    if (mappedMetrics) {
      next = { ...next, metrics: mappedMetrics }
      remapped = true
    }
  }

  if (['chart-bar', 'chart-bar-compare', 'chart-line', 'chart-pie'].includes(next.layout) && !next.chart) {
    const derivedMetrics = next.metrics || toMetricsFromCards(next) || toMetricsFromBody(next)
    if (derivedMetrics) {
      next = { ...next, metrics: next.metrics || derivedMetrics }
      const mappedChart = toChartFromMetrics({ ...next, metrics: derivedMetrics })
      if (mappedChart) {
        next = { ...next, chart: mappedChart }
        remapped = true
      }
    }
  }

  if (next.layout === 'quote-no-avatar' && (!next.cards || next.cards.length === 0)) {
    const unknownBody = next.body as unknown
    if (Array.isArray(unknownBody) && unknownBody.length > 0 && unknownBody.every((item) => typeof item === 'string')) {
      next = { ...next, cards: toCardsFromStringArray(unknownBody as string[], '引用'), body: undefined }
      remapped = true
    }
  }

  if (CARD_LAYOUTS.includes(next.layout) && !hasCards(next)) {
    errors.push('missing cards')
  }
  if (['timeline', 'milestone-list'].includes(next.layout) && !hasEvents(next)) {
    errors.push('missing events')
  }
  if (['metrics', 'metrics-rings', 'metrics-split'].includes(next.layout) && !hasMetrics(next)) {
    errors.push('missing metrics')
  }
  if (['image-text', 'text-image', 'image-center', 'text-bullets', 'text-center'].includes(next.layout) && !hasVisibleBody(next)) {
    errors.push('missing body')
  }
  if (next.layout === 'comparison' && !hasComparison(next)) {
    errors.push('missing comparison sides')
  }
  if (['chart-bar', 'chart-bar-compare', 'chart-line', 'chart-pie'].includes(next.layout) && !hasChart(next)) {
    errors.push('missing chart')
  }

  const contentMissing = !hasAnySemanticContent(next)

  return {
    valid: errors.length === 0,
    slide: next,
    remapped,
    errors,
    contentMissing,
  }
}

export function chooseLayoutForNormalizedContent(slide: SlideContent, outline: SlideOutline): SlideContent {
  if (slide.layout === 'cover' || slide.layout === 'ending' || slide.layout === 'section-header') {
    return slide
  }

  if (hasComparison(slide)) {
    return { ...slide, layout: 'comparison' }
  }
  if (hasChart(slide)) {
    return { ...slide, layout: outline.layout.startsWith('chart-') ? outline.layout : 'chart-bar' }
  }
  if (hasMetrics(slide)) {
    return { ...slide, layout: 'metrics' }
  }
  if (hasEvents(slide)) {
    return { ...slide, layout: outline.layout === 'milestone-list' ? 'milestone-list' : 'timeline' }
  }
  if (hasCards(slide)) {
    const count = slide.cards?.length || 0
    if (outline.layout === 'quote' || outline.layout === 'quote-no-avatar') {
      return { ...slide, layout: outline.layout }
    }
    if (outline.layout === 'list-featured' || outline.layout === 'features-list-image' || outline.layout === 'cards-split') {
      return { ...slide, layout: outline.layout }
    }
    if (count <= 2) return { ...slide, layout: 'cards-2' }
    if (count === 3) return { ...slide, layout: 'cards-3' }
    return { ...slide, layout: 'cards-4' }
  }
  if (hasVisibleBody(slide)) {
    return { ...slide, layout: slide.image ? (outline.layout === 'text-image' ? 'text-image' : 'image-text') : 'text-bullets' }
  }
  return slide
}
