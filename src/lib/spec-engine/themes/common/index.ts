/**
 * Common Theme — 公共模板库注册入口
 *
 * themeId='common'
 * 不会出现在主题选择器中，仅作为 fallback。
 */
import type { ThemeSpec } from '../../types'
import {
  commonTextBullets, commonTextCenter,
  commonCover, commonEnding,
  commonChartBar, commonChartLine, commonChartPie, commonChartBarCompare,
} from './all-layouts'

const allLayouts = [
  commonTextBullets, commonTextCenter,
  commonCover, commonEnding,
  commonChartBar, commonChartLine, commonChartPie, commonChartBarCompare,
]

export const commonTheme: ThemeSpec = {
  id: 'common',
  name: 'Common',
  description: '公共模板库 — 其他主题缺少布局时的 fallback，颜色/字体由当前主题动态注入',
  layouts: Object.fromEntries(allLayouts.map(spec => [spec.id, spec])),
  defaults: {
    fontHeading: "'Noto Sans SC', sans-serif",
    fontBody: "'Noto Sans SC', sans-serif",
    colorText: '#000000',
    colorTextSecondary: '#555555',
    colorBackground: '#ffffff',
    colorPrimary: '#3b82f6',
    colorAccent: '#8b5cf6',
  },
  assetBase: '/themes/common/',
}
