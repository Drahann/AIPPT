import { DocumentChunk, LayoutType, SlideOutline } from '../types'

const CHART_KEYWORDS = ['增长', '同比', '环比', '占比', '比例', '趋势', '数据', '%', '亿元', '万元', '数量', '预算', '营收', '收入', '成本', '利润', '盈利', '毛利率', '融资', '总产值', '渗透率', '份额']
const TIMELINE_KEYWORDS = ['阶段', '里程碑', '时间', '计划', '节点', '路线图', '季度', '年份', '历程', '规划', '三步走']
const COMPARISON_KEYWORDS = ['before-after', '对比分析', '优劣势对比', '差异对照', '传统方案', '现行方案', '新方案优势']
const QUOTE_KEYWORDS = ['引用', '观点', '评价', '反馈', '客户声音', 'testimonial', '认为', '表示', '说道', '专家', '院士', '教授']
const METRIC_KEYWORDS = ['指标', 'kpi', '达成率', '效率', '转化率', '留存率', '预算', '营收', '收入', '成本', '利润', '盈利', '毛利率', '融资', '规模', '就业', '专利', '论文', '软著', '著作权', '成果', '准确率', '损耗', '周期']
const IMAGE_KEYWORDS = ['架构', '流程图', '示意图', '场景', '图片', '视觉', '装置', '展示', '系统图']
const TEAM_MEMBERS_KEYWORDS = ['团队', '成员', '主创', '负责人', '专家', '顾问', '合伙人', '创始人', '技术团队', '核心人员']

function countPotentialItems(text: string): number {
  const lines = (text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const bulletLike = lines.filter((line) => /^([-*•]|[0-9]+[.)、]|[A-Za-z][.)])\s+/.test(line))
  if (bulletLike.length > 0) return bulletLike.length

  const content = lines.join(' ')
  const enumerationCount = (content.match(/[、]/g) || []).length
  if (enumerationCount >= 2) return enumerationCount + 1

  const commaCount = (content.match(/[，,]/g) || []).length
  if (commaCount >= 2 && commaCount <= 6) return commaCount + 1

  return lines.length
}

function hasAny(text: string, words: string[]): boolean {
  const lower = (text || '').toLowerCase()
  return words.some((word) => lower.includes(word.toLowerCase()))
}

function countKeywordHits(text: string, words: string[]): number {
  const lower = (text || '').toLowerCase()
  return words.filter((word) => lower.includes(word.toLowerCase())).length
}

function hasStrongNumericSignal(text: string): boolean {
  if (!text) return false
  const numericPatterns = /-?\d+(\.\d+)?%?|[\d\.]+(亿元|万元|k|m|b|%)/gi
  const matches = text.match(numericPatterns) || []
  return matches.length >= 2 || hasAny(text, CHART_KEYWORDS)
}

function hasTimelineSignal(text: string, title?: string, subtitle?: string): boolean {
  const combined = [title, subtitle, text].filter(Boolean).join('\n')
  const keywordHits = countKeywordHits(combined, TIMELINE_KEYWORDS)
  const strongTitle = hasAny(`${title || ''}\n${subtitle || ''}`, ['推广模式', '里程碑', '发展历程', '路线图', '阶段目标', '时间轴'])
  const yearHits = (combined.match(/\b(19|20)\d{2}\b/g) || []).length
  return strongTitle || keywordHits >= 2 || yearHits >= 2
}

function hasQuoteSignal(text: string, title?: string, subtitle?: string): boolean {
  const combined = [title, subtitle, text].filter(Boolean).join('\n')
  return hasAny(combined, [...QUOTE_KEYWORDS, '院士', '教授', '专家', '表示', '认为', '评价']) 
}

function hasMetricSignal(text: string, title?: string, subtitle?: string): boolean {
  const combined = [title, subtitle, text].filter(Boolean).join('\n')
  const isKickerMatch = hasAny(combined, METRIC_KEYWORDS) || /\b(kpi|roi|gmv|mau|dau)\b/i.test(combined)
  const numericMatches = (combined.match(/\d+(\.\d+)?%?/g) || []).length
  return isKickerMatch || numericMatches >= 4
}

function hasImageSignal(text: string, title?: string, subtitle?: string, imageHint?: string): boolean {
  return Boolean(imageHint) || hasAny([title, subtitle, text].filter(Boolean).join('\n'), IMAGE_KEYWORDS)
}

function hasTeamMembersSignal(text: string, title?: string, subtitle?: string): boolean {
  const combined = [title, subtitle, text].filter(Boolean).join('\n')
  return hasAny(combined, TEAM_MEMBERS_KEYWORDS)
}

function buildSourceText(slide: SlideOutline, chunks: DocumentChunk[]) {
  const refs = slide.refChunks
    .map((order) => chunks.find((chunk) => chunk.order === order))
    .filter((value): value is DocumentChunk => Boolean(value))
  return [slide.title, slide.subtitle, slide.contentHint, ...refs.map((item) => `${item.heading}\n${item.content}`)].join('\n')
}

export function getGlobalPreferredLayouts(chunks: DocumentChunk[]): LayoutType[] {
  const text = chunks.map((chunk) => `${chunk.heading}\n${chunk.content}`).join('\n')
  const candidates: LayoutType[] = []
  if (hasStrongNumericSignal(text)) candidates.push('chart-bar', 'chart-line', 'chart-pie')
  if (hasAny(text, TIMELINE_KEYWORDS)) candidates.push('timeline', 'milestone-list')
  if (hasAny(text, COMPARISON_KEYWORDS)) candidates.push('comparison', 'chart-bar-compare')
  if (hasAny(text, QUOTE_KEYWORDS)) candidates.push('quote', 'quote-no-avatar')
  if (hasAny(text, METRIC_KEYWORDS)) candidates.push('metrics', 'metrics-rings')
  if (hasAny(text, TEAM_MEMBERS_KEYWORDS)) candidates.push('team-members')
  return Array.from(new Set(candidates))
}

function uniqueLayouts(list: LayoutType[]): LayoutType[] {
  return Array.from(new Set(list))
}

export function getSlideLayoutCandidates(slide: SlideOutline, chunks: DocumentChunk[]): LayoutType[] {
  const sourceText = buildSourceText(slide, chunks)
  const itemCount = countPotentialItems(sourceText)
  
  const lines = sourceText.split('\n').filter(l => l.trim().length > 5)
  const avgLineLength = lines.length > 0 ? lines.reduce((acc, l) => acc + l.length, 0) / lines.length : 0

  const candidates: LayoutType[] = []

  if (slide.layout === 'cover' || slide.layout === 'ending' || slide.layout === 'section-header') {
    return [slide.layout]
  }

  const isComparison = hasAny(sourceText, COMPARISON_KEYWORDS)
  const isTimeline = hasTimelineSignal(sourceText, slide.title, slide.subtitle)
  const isQuote = hasQuoteSignal(sourceText, slide.title, slide.subtitle)
  const isNumeric = hasStrongNumericSignal(sourceText)
  const isMetric = hasMetricSignal(sourceText, slide.title, slide.subtitle)
  const isImage = hasImageSignal(sourceText, slide.title, slide.subtitle, slide.imageHint) || slide.imageIndex !== undefined
  const isTeam = hasTeamMembersSignal(sourceText, slide.title, slide.subtitle)

  if (isComparison) {
    if (isNumeric) candidates.push('chart-bar-compare')
    candidates.push('comparison')
    if (itemCount === 2) candidates.push('cards-2')
  } else if (isTimeline) {
    if (avgLineLength < 100) {
      candidates.push('timeline', 'milestone-list')
    }
  } else if (isQuote) {
    candidates.push('quote', 'quote-no-avatar')
  } else if (isNumeric || isMetric) {
    // Metrics layout: now requires short text density (< 45 chars) and numeric signature
    if (isMetric && avgLineLength < 45) {
      candidates.push('metrics', 'metrics-rings')
    }
    if (isNumeric) candidates.push('chart-bar', 'chart-line', 'chart-pie')
    if (itemCount >= 3 && itemCount <= 5) candidates.push('cards-split', 'staggered-cards')
  } else if (isImage) {
    candidates.push('image-text', 'text-image', 'image-center')
    if (itemCount >= 3) candidates.push('list-featured')
  } else if (isTeam) {
    if (itemCount >= 2 && itemCount <= 8) {
      candidates.push('team-members')
    }
    candidates.push('list-featured', 'cards-split')
  } else if (itemCount >= 6) {
    candidates.push('list-featured')
  } else if (itemCount >= 4) {
    candidates.push('cards-split', 'cards-4', 'features-list-image')
  } else if (itemCount === 3) {
    candidates.push('cards-3', 'staggered-cards', 'list-featured')
  } else if (itemCount === 2) {
    candidates.push('cards-2', 'comparison')
  }

  if (itemCount >= 2) {
    candidates.push('text-bullets')
  }
  candidates.push('text-center', 'image-center')
  
  if (slide.layout) {
    candidates.push(slide.layout)
  }

  return uniqueLayouts(candidates)
}

export function buildRouterGuidance(chunks: DocumentChunk[]): string {
  const preferred = getGlobalPreferredLayouts(chunks)
  if (preferred.length === 0) return ''
  return `\n[布局候选优先级]
以下布局优先考虑：${preferred.join('、')}。先保证语义结构匹配，再考虑样式变化；不要为了多样化强行切换到不合适的模板。`
}

export function enforceSlideLayoutByCandidates(slide: SlideOutline, chunks: DocumentChunk[]): SlideOutline {
  const candidates = getSlideLayoutCandidates(slide, chunks)
  if (candidates.includes(slide.layout)) return slide
  return {
    ...slide,
    layout: candidates[0] || 'text-center',
  }
}
