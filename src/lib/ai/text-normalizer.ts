import { SlideContent } from '../types'

function normalizeWhitespace(text: string): string {
  return (text || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export function normalizeMojibake(text: string): string {
  return normalizeWhitespace(text || '')
}

function sanitizeForLanguage(text: string, language: string): string {
  const normalized = normalizeMojibake(text)
  if (language !== 'zh-CN') return normalized
  return normalized.replace(/\b(TODO|N\/A|TBD)\b/gi, '').trim()
}

export function normalizeSlideContentText(
  slide: SlideContent,
  language: string = 'zh-CN'
): SlideContent {
  const next: SlideContent = { ...slide }
  next.title = sanitizeForLanguage(next.title || '', language)
  if (next.subtitle) next.subtitle = sanitizeForLanguage(next.subtitle, language)
  if (next.speakerNotes) next.speakerNotes = sanitizeForLanguage(next.speakerNotes, language)

  if (next.body) {
    next.body = next.body.map((block) => {
      if (block.type === 'paragraph') {
        return { ...block, text: sanitizeForLanguage(block.text || '', language) }
      }
      return {
        ...block,
        items: (block.items || []).map((item) => sanitizeForLanguage(item, language)),
      }
    })
  }

  if (next.cards) {
    next.cards = next.cards.map((card) => ({
      ...card,
      heading: sanitizeForLanguage(card.heading || '', language),
      body: sanitizeForLanguage(card.body || '', language),
      image: card.image
        ? {
            ...card.image,
            prompt: card.image.prompt || '',
          }
        : undefined,
    }))
  }

  if (next.left) {
    next.left = {
      ...next.left,
      heading: sanitizeForLanguage(next.left.heading || '', language),
      items: (next.left.items || []).map((item) => sanitizeForLanguage(item, language)),
    }
  }
  if (next.right) {
    next.right = {
      ...next.right,
      heading: sanitizeForLanguage(next.right.heading || '', language),
      items: (next.right.items || []).map((item) => sanitizeForLanguage(item, language)),
    }
  }

  if (next.events) {
    next.events = next.events.map((event) => ({
      ...event,
      date: sanitizeForLanguage(event.date || '', language),
      title: sanitizeForLanguage(event.title || '', language),
      description: sanitizeForLanguage(event.description || '', language),
    }))
  }

  if (next.metrics) {
    next.metrics = next.metrics.map((metric) => ({
      ...metric,
      value: sanitizeForLanguage(metric.value || '', language),
      label: sanitizeForLanguage(metric.label || '', language),
    }))
  }

  if (next.chart) {
    next.chart = {
      ...next.chart,
      title: sanitizeForLanguage(next.chart.title || '', language),
      categories: (next.chart.categories || []).map((item) => sanitizeForLanguage(item, language)),
      series: (next.chart.series || []).map((series) => ({
        ...series,
        name: sanitizeForLanguage(series.name || '', language),
      })),
    }
  }

  if (next.image?.alt) {
    next.image = {
      ...next.image,
      alt: sanitizeForLanguage(next.image.alt, language),
    }
  }

  if (next.quote) {
    next.quote = {
      ...next.quote,
      text: sanitizeForLanguage(next.quote.text || '', language),
      attribution: next.quote.attribution
        ? sanitizeForLanguage(next.quote.attribution, language)
        : undefined,
    }
  }

  return next
}

