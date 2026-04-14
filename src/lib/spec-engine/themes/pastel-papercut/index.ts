/**
 * Pastel Papercut — ThemeSpec 入口
 *
 * all-layouts.ts 包含所有布局定义（另一个 agent 正在基于 Figma 精确数据重写）。
 * 使用动态收集，无论 all-layouts.ts 中的导出名称如何变化都能自动适应。
 */
import type { ThemeSpec, LayoutSpec } from '../../types'
import * as layouts from './all-layouts'

// 动态收集所有导出的 LayoutSpec
const allLayouts: LayoutSpec[] = Object.values(layouts).filter(
  (v): v is LayoutSpec => typeof v === 'object' && v !== null && 'id' in v && 'canvas' in v
)

export const pastelPapercut: ThemeSpec = {
  id: 'pastel-papercut',
  name: 'Pastel Papercut',
  description: '柔和剪纸风，Shippori Mincho + Playfair Display 字体',
  previewColor: '#c9a87c',
  layouts: Object.fromEntries(allLayouts.map(spec => [spec.id, spec])),
  defaults: {
    fontHeading: "'Shippori Mincho', 'Noto Sans SC', serif",
    fontBody: "'Playfair Display', 'Noto Sans SC', serif",
    colorText: '#000000',
    colorTextSecondary: '#555555',
    colorBackground: '#ffffff',
    colorPrimary: '#c9a87c',
    colorAccent: '#d4a574',
  },
  assetBase: '/themes/pastel-papercut/',
  layoutAliases: {
    'cover': 'pp-cover',
    'ending': 'pp-thanks-end',
    'section-header': 'pp-chapter',
    'text-center': 'pp-chapter',
    'text-bullets': 'pp-title-bottom-text',
    'cards-2': 'pp-columns-2',
    'cards-3': 'pp-title-cols-3',
    'cards-4': 'pp-agenda-4',
    'cards-split': 'pp-agenda-4',
    'cards-3-featured': 'pp-title-cols-3',
    'cards-3-stack': 'pp-title-cols-3',
    'cards-4-featured': 'pp-agenda-4',
    'staggered-cards': 'pp-title-cols-3',
    'list-featured': 'pp-agenda-4',
    'grid-2x2-featured': 'pp-agenda-4',
    'image-text': 'pp-title-image-top',
    'text-image': 'pp-title-image-side',
    'image-center': 'pp-image-horiz-title',
    'image-full': 'pp-image-horiz-title',
    'chart-bar': 'pp-stats-4',
    'chart-line': 'pp-stats-3',
    'chart-pie': 'pp-stats-3',
    'chart-bar-compare': 'pp-stats-4',
    'metrics': 'pp-stats-3',
    'metrics-rings': 'pp-stats-4',
    'timeline': 'pp-timeline-right',
    'milestone-list': 'pp-timeline-5',
    'quote': 'pp-quote-author',
    'quote-no-avatar': 'pp-quote-right',
    'team-members': 'pp-team-cols-3',
    'comparison': 'pp-columns-2',
    'features-list-image': 'pp-agenda-4-image',
  },
}
