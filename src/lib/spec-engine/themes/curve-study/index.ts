/**
 * Curve Study — ThemeSpec 入口
 *
 * 当前布局为过渡版本，另一个 agent 正在基于 Figma 精确数据重写。
 * all-layouts.ts 将包含 31 个精确布局。
 */
import type { ThemeSpec, LayoutSpec } from '../../types'
import * as layouts from './all-layouts'

// 动态收集所有导出的 LayoutSpec
const allLayouts: LayoutSpec[] = Object.values(layouts).filter(
  (v): v is LayoutSpec => typeof v === 'object' && v !== null && 'id' in v && 'canvas' in v
)

export const curveStudy: ThemeSpec = {
  id: 'curve-study',
  name: 'Curve Study',
  description: '曲线研究风，Bricolage Grotesque + Inter 字体，深青/浅灰双色',
  previewColor: '#237267',
  layouts: Object.fromEntries(allLayouts.map(spec => [spec.id, spec])),
  defaults: {
    fontHeading: "'Bricolage Grotesque', 'Noto Sans SC', sans-serif",
    fontBody: "'Inter', 'Noto Sans SC', sans-serif",
    colorText: '#000000',
    colorTextSecondary: '#237267',
    colorBackground: '#f3f3f3',
    colorPrimary: '#237267',
    colorAccent: '#f3f3f3',
  },
  assetBase: '/themes/curve-study/',
  layoutAliases: {
    'cover': 'cs-cover-gray',
    'ending': 'cs-cta-teal',
    'section-header': 'cs-section-gray',
    'text-center': 'cs-section-gray',
    'text-bullets': 'cs-text-two-lines',
    'cards-2': 'cs-bar-graph',
    'cards-3': 'cs-text-three-columns',
    'cards-4': 'cs-diagram-features-data',
    'cards-split': 'cs-text-three-columns',
    'cards-3-featured': 'cs-text-three-columns',
    'cards-3-stack': 'cs-text-three-columns',
    'cards-4-featured': 'cs-diagram-features-data',
    'staggered-cards': 'cs-text-three-columns',
    'list-featured': 'cs-diagram-features',
    'grid-2x2-featured': 'cs-diagram-features-data',
    'image-text': 'cs-image-top-right',
    'text-image': 'cs-image-left-teal',
    'image-center': 'cs-image-stack',
    'image-full': 'cs-image-top-right',
    'chart-bar': 'cs-bar-graph',
    'chart-line': 'cs-metrics-three-cols',
    'chart-pie': 'cs-diagram-features-data',
    'chart-bar-compare': 'cs-bar-graph',
    'metrics': 'cs-metrics',
    'metrics-rings': 'cs-metrics-three-cols',
    'timeline': 'cs-timeline-horizontal',
    'milestone-list': 'cs-timeline-zigzag',
    'quote': 'cs-quote-teal',
    'quote-no-avatar': 'cs-quote-gray',
    'team-members': 'cs-team',
    'comparison': 'cs-subtitle-two-lines',
    'features-list-image': 'cs-image-macbook',
  },
}
