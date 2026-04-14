/**
 * Spec Engine — 公共入口
 *
 * 统一导出引擎的所有公共 API。
 */

export type {
  DecorationElement,
  DecorationElementType,
  SlotDefinition,
  SlotType,
  LayoutSpec,
  ThemeSpec,
} from './types'

export { SpecRenderer } from './SpecRenderer'
export { DecorationRenderer } from './DecorationRenderer'
export { SlotRenderer } from './SlotRenderer'

export {
  registerTheme,
  getThemeSpec,
  getLayoutSpec,
  getAllThemeSpecs,
  isSpecTheme,
  getThemeLayouts,
  resolveLayout,
  applyThemeTokens,
} from './theme-registry'
