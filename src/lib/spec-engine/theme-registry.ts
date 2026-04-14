/**
 * Theme Registry — 主题注册与查找
 *
 * 所有 ThemeSpec 在此注册。
 * SlideRenderer 通过 resolveLayout 查找某主题某布局的 spec，
 * 支持 4 级 fallback 优先级机制。
 */

import type { LayoutType } from '../types'
import type { ThemeSpec, LayoutSpec, SlotDefinition, DecorationElement } from './types'

const registry = new Map<string, ThemeSpec>()

/**
 * 注册一个主题
 */
export function registerTheme(theme: ThemeSpec): void {
  registry.set(theme.id, theme)
}

/**
 * 获取主题定义
 */
export function getThemeSpec(themeId: string): ThemeSpec | undefined {
  return registry.get(themeId)
}

/**
 * 查找某主题某布局的 LayoutSpec（直接查找，无 fallback）
 * @returns LayoutSpec 如果存在，否则 undefined
 */
export function getLayoutSpec(themeId: string, layout: LayoutType): LayoutSpec | undefined {
  const theme = registry.get(themeId)
  if (!theme) return undefined
  return theme.layouts[layout]
}

/**
 * 获取所有已注册主题（排除 common）
 */
export function getAllThemeSpecs(): ThemeSpec[] {
  return Array.from(registry.values()).filter(t => t.id !== 'common')
}

/**
 * 检查某主题是否有 spec 引擎支持
 */
export function isSpecTheme(themeId: string): boolean {
  return registry.has(themeId) && themeId !== 'common'
}

/**
 * 获取某主题支持的所有布局类型
 */
export function getThemeLayouts(themeId: string): string[] {
  const theme = registry.get(themeId)
  if (!theme) return []
  return Object.keys(theme.layouts)
}

// ---------------------------------------------------------------------------
// Fallback 优先级算法
// ---------------------------------------------------------------------------

/**
 * 从 contentFields 推断内容能力
 * 例: ['title', 'cards:3'] → { hasTitle: true, hasCards: true, cardCount: 3 }
 */
function inferCapability(layout: string): { type: string; count?: number } {
  // 简单的语义推断
  if (layout.startsWith('chart-')) return { type: 'chart' }
  if (layout.includes('timeline') || layout.includes('milestone')) return { type: 'timeline' }
  if (layout.includes('cards') || layout.includes('grid')) return { type: 'cards' }
  if (layout.includes('metric')) return { type: 'metrics' }
  if (layout.includes('comparison')) return { type: 'comparison' }
  if (layout.includes('quote')) return { type: 'quote' }
  if (layout.includes('image')) return { type: 'image-text' }
  if (layout.includes('cover')) return { type: 'cover' }
  if (layout.includes('ending')) return { type: 'ending' }
  return { type: 'text' }
}

/**
 * 在主题的所有布局中查找内容能力兼容的布局
 */
function findCompatibleLayout(themeId: string, capability: { type: string }): LayoutSpec | undefined {
  const theme = registry.get(themeId)
  if (!theme) return undefined

  for (const spec of Object.values(theme.layouts)) {
    const specCap = inferCapability(spec.id)
    if (specCap.type === capability.type) {
      return spec
    }
  }
  return undefined
}

/**
 * $theme.xxx Token 替换机制
 *
 * 遍历 LayoutSpec 中所有字符串值，将 $theme.xxx 替换为当前主题的 defaults
 */
export function applyThemeTokens(spec: LayoutSpec, themeId: string): LayoutSpec {
  const theme = registry.get(themeId)
  if (!theme) return spec

  const tokenMap: Record<string, string> = {
    '$theme.colorText': theme.defaults.colorText,
    '$theme.colorTextSecondary': theme.defaults.colorTextSecondary,
    '$theme.colorBackground': theme.defaults.colorBackground,
    '$theme.colorPrimary': theme.defaults.colorPrimary,
    '$theme.colorAccent': theme.defaults.colorAccent,
    '$theme.fontHeading': theme.defaults.fontHeading,
    '$theme.fontBody': theme.defaults.fontBody,
  }

  function replaceTokens(value: any): any {
    if (typeof value === 'string' && value.startsWith('$theme.')) {
      return tokenMap[value] ?? value
    }
    return value
  }

  function processSlot(slot: SlotDefinition): SlotDefinition {
    return {
      ...slot,
      fontFamily: replaceTokens(slot.fontFamily),
      color: replaceTokens(slot.color),
      background: replaceTokens(slot.background),
      border: replaceTokens(slot.border),
      children: slot.children?.map(processSlot),
    }
  }

  function processDecoration(dec: DecorationElement): DecorationElement {
    return {
      ...dec,
      fill: replaceTokens(dec.fill),
      stroke: replaceTokens(dec.stroke),
    }
  }

  return {
    ...spec,
    canvas: {
      ...spec.canvas,
      background: replaceTokens(spec.canvas.background),
    },
    decorations: spec.decorations.map(processDecoration),
    slots: spec.slots.map(processSlot),
  }
}

/**
 * 4 级 Fallback 优先级的布局解析
 *
 * ① 主题精确匹配
 * ② 主题语义匹配（按 contentFields 能力）
 * ③ 公共库精确匹配（注入当前主题配色）
 * ④ 公共库语义匹配（注入当前主题配色）
 * ⑤ 终极兜底：公共库 text-center
 */
export function resolveLayout(themeId: string, requestedLayout: string): LayoutSpec {
  const theme = registry.get(themeId)

  // ⓪ 别名解析 — 将 AI 通用布局 ID 映射到主题专属 ID
  let resolvedName = requestedLayout
  if (theme?.layoutAliases?.[requestedLayout]) {
    resolvedName = theme.layoutAliases[requestedLayout]
  }

  // ① 主题精确匹配（用别名解析后的名字）
  const exact = getLayoutSpec(themeId, resolvedName as LayoutType)
  if (exact) return exact

  // 如果别名解析后没找到，也用原名试一次
  if (resolvedName !== requestedLayout) {
    const exactOriginal = getLayoutSpec(themeId, requestedLayout as LayoutType)
    if (exactOriginal) return exactOriginal
  }

  // ② 主题语义匹配
  const capability = inferCapability(requestedLayout)
  const semantic = findCompatibleLayout(themeId, capability)
  if (semantic) return semantic

  // ③ 公共库精确匹配（注入当前主题配色）
  const commonExact = getLayoutSpec('common', requestedLayout as LayoutType)
  if (commonExact) return applyThemeTokens(commonExact, themeId)

  // ④ 公共库语义匹配（注入当前主题配色）
  const commonSemantic = findCompatibleLayout('common', capability)
  if (commonSemantic) return applyThemeTokens(commonSemantic, themeId)

  // ⑤ 终极兜底
  const fallback = getLayoutSpec('common', 'text-center' as LayoutType)
  if (fallback) return applyThemeTokens(fallback, themeId)

  // 不应该到达这里
  throw new Error(`[Theme] No layout found for ${themeId}/${requestedLayout} and common fallback is missing`)
}

/**
 * 生成 AI 可读的布局清单
 * 返回格式化字符串，供 outline prompt 注入
 *
 * 示例输出:
 * - cp-cover: 封面页（仅标题+副标题） [字段: title, subtitle]
 * - cp-three-col: 三列并排内容，适合展示3个并列要点 [字段: title, cards:3]
 */
export function getThemeLayoutDescriptions(themeId: string): string {
  const theme = registry.get(themeId)
  if (!theme) return ''

  const lines: string[] = []
  for (const [layoutId, spec] of Object.entries(theme.layouts)) {
    const desc = spec.description || layoutId
    const fields = spec.contentFields?.join(', ') || '(auto)'
    lines.push(`- ${layoutId}: ${desc} [字段: ${fields}]`)
  }

  // 追加公共库中该主题缺少的布局
  const common = registry.get('common')
  if (common) {
    const themeLayoutIds = new Set(Object.keys(theme.layouts))
    for (const [layoutId, spec] of Object.entries(common.layouts)) {
      if (!themeLayoutIds.has(layoutId)) {
        const desc = spec.description || layoutId
        const fields = spec.contentFields?.join(', ') || '(auto)'
        lines.push(`- ${layoutId}: ${desc} [字段: ${fields}] (公共)`)
      }
    }
  }

  return lines.join('\n')
}
