import { LayoutType } from './types'

export const layoutItemRules = {
  textBullets: { min: 6, max: 8 },
  cardsSplit: { min: 3, max: 5 },
  listFeatured: { min: 3, max: 8 },
  timeline: { min: 3, max: 5 },
  milestoneList: { min: 3, max: 6 },
  metrics: { min: 4, max: 6 },
  metricsRings: { min: 1, max: 3 },
  chartBar: { minCategories: 4, maxCategories: 8 },
  chartBarCompare: { series: 2, minCategories: 4, maxCategories: 8 },
  featuresListImage: { min: 3, max: 4 },
  quote: { min: 1, max: 5 },
  quoteNoAvatar: { min: 1, max: 5 },
  teamMembers: { min: 2, max: 8 },
} as const

export function getItemCountConstraintLines(): string[] {
  return [
    `cards-2: EXACTLY 2 items`,
    `cards-3: EXACTLY 3 items`,
    `cards-4: EXACTLY 4 items`,
    `staggered-cards: EXACTLY 3 items`,
    `text-bullets: ${layoutItemRules.textBullets.min}-${layoutItemRules.textBullets.max} bullet points`,
    `cards-split: ${layoutItemRules.cardsSplit.min}-${layoutItemRules.cardsSplit.max} cards`,
    `list-featured: ${layoutItemRules.listFeatured.min}-${layoutItemRules.listFeatured.max} cards`,
    `timeline: ${layoutItemRules.timeline.min}-${layoutItemRules.timeline.max} events`,
    `milestone-list: ${layoutItemRules.milestoneList.min}-${layoutItemRules.milestoneList.max} events`,
    `metrics: ${layoutItemRules.metrics.min}-${layoutItemRules.metrics.max} metrics`,
    `metrics-rings: ${layoutItemRules.metricsRings.min}-${layoutItemRules.metricsRings.max} metrics`,
    `chart-bar: categories recommended ${layoutItemRules.chartBar.minCategories}-${layoutItemRules.chartBar.maxCategories}`,
    `chart-bar-compare: exactly ${layoutItemRules.chartBarCompare.series} series, categories recommended ${layoutItemRules.chartBarCompare.minCategories}-${layoutItemRules.chartBarCompare.maxCategories}`,
    `features-list-image: cards recommended ${layoutItemRules.featuresListImage.min}-${layoutItemRules.featuresListImage.max}`,
    `quote: ${layoutItemRules.quote.min}-${layoutItemRules.quote.max} quotes`,
    `quote-no-avatar: ${layoutItemRules.quoteNoAvatar.min}-${layoutItemRules.quoteNoAvatar.max} quotes`,
    `team-members: ${layoutItemRules.teamMembers.min}-${layoutItemRules.teamMembers.max} team/stakeholder members`,
  ]
}

export function getSplitLimitForLayout(layout: LayoutType): number | undefined {
  switch (layout) {
    case 'text-bullets':
      return layoutItemRules.textBullets.max
    case 'cards-split':
      return layoutItemRules.cardsSplit.max
    case 'list-featured':
      return layoutItemRules.listFeatured.max
    case 'timeline':
      return layoutItemRules.timeline.max
    case 'milestone-list':
      return layoutItemRules.milestoneList.max
    case 'metrics':
      return layoutItemRules.metrics.max
    case 'metrics-rings':
    case 'metrics-split':
      return layoutItemRules.metricsRings.max
    case 'features-list-image':
      return layoutItemRules.featuresListImage.max
    case 'quote':
      return layoutItemRules.quote.max
    case 'quote-no-avatar':
      return layoutItemRules.quoteNoAvatar.max
    case 'team-members':
      return layoutItemRules.teamMembers.max
    case 'cards-2':
      return 2
    case 'cards-3':
      return 3
    case 'cards-4':
      return 4
    default:
      return undefined
  }
}
