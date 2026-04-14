/**
 * Template Pack Registry — 向后兼容桩
 *
 * 旧的 group-01~10 主题已废除，所有渲染走 SpecRenderer。
 * 此文件保留最小兼容接口供 HiddenRenderEngine、EditorToolbar 等组件使用。
 * 不再导入任何旧主题组件。
 */
import { TemplatePack } from './index'
import { getAllThemeSpecs, getThemeSpec } from '../spec-engine/theme-registry'
import '../spec-engine/themes' // side-effect: registers all themes

/**
 * 将 Spec ThemeSpec 转换为旧 TemplatePack 兼容格式
 */
function themeSpecToTemplatePack(themeId: string): TemplatePack {
  const theme = getThemeSpec(themeId)
  if (!theme) {
    return createFallbackPack(themeId)
  }
  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    previewColor: theme.previewColor || theme.defaults.colorPrimary,
    colors: {
      primary: theme.defaults.colorPrimary,
      primaryLight: theme.defaults.colorPrimary + '40',
      secondary: theme.defaults.colorAccent,
      positive: '#22c55e',
      negative: '#ef4444',
      accent: theme.defaults.colorAccent,
      background: theme.defaults.colorBackground,
      surface: theme.defaults.colorBackground,
      surfaceAlt: theme.defaults.colorBackground,
      text: theme.defaults.colorText,
      textSecondary: theme.defaults.colorTextSecondary,
      border: '#e5e5e5',
    },
    fonts: {
      heading: theme.defaults.fontHeading,
      body: theme.defaults.fontBody,
    },
    cardRadius: 12,
    cardStyle: 'flat',
    figmaLayouts: [],
    decorations: [],
    cssClass: `tpl-${theme.id}`,
  }
}

function createFallbackPack(id: string): TemplatePack {
  return {
    id,
    name: id,
    colors: {
      primary: '#3b82f6',
      primaryLight: '#93c5fd',
      secondary: '#8b5cf6',
      positive: '#22c55e',
      negative: '#ef4444',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f9fafb',
      surfaceAlt: '#f3f4f6',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
    },
    fonts: { heading: "'Noto Sans SC', sans-serif", body: "'Noto Sans SC', sans-serif" },
    cardRadius: 8,
    cardStyle: 'flat',
    figmaLayouts: [],
    decorations: [],
    cssClass: `tpl-${id}`,
  }
}

// 从 Spec 注册表生成兼容的 templatePacks 列表
export const templatePacks: TemplatePack[] = getAllThemeSpecs().map(t => themeSpecToTemplatePack(t.id))

const packMap = new Map(templatePacks.map((p) => [p.id, p]))

export function getTemplatePack(id: string): TemplatePack {
  // 先查缓存，不存在则动态生成
  const cached = packMap.get(id)
  if (cached) return cached
  const pack = themeSpecToTemplatePack(id)
  packMap.set(id, pack)
  return pack
}

export function getAllTemplatePacks(): TemplatePack[] {
  return templatePacks
}

/** Convert TemplatePack colors/fonts → CSS custom properties for inline style */
export function templatePackToCSS(pack: TemplatePack): Record<string, string> {
  return {
    '--color-primary': pack.colors.primary,
    '--color-primary-light': pack.colors.primaryLight,
    '--color-secondary': pack.colors.secondary || pack.colors.primary,
    '--color-positive': pack.colors.positive,
    '--color-negative': pack.colors.negative,
    '--color-accent': pack.colors.accent,
    '--color-background': pack.colors.background,
    '--color-bg': pack.colors.background,
    '--color-surface': pack.colors.surface,
    '--color-surface-alt': pack.colors.surfaceAlt,
    '--color-canvas': pack.colors.background,
    '--color-text': pack.colors.text,
    '--color-text-secondary': pack.colors.textSecondary,
    '--color-on-canvas': pack.colors.text,
    '--color-on-surface': pack.colors.text,
    '--color-on-primary': '#ffffff',
    '--color-on-accent': '#ffffff',
    '--color-positive-soft': pack.colors.positive + '20',
    '--color-negative-soft': pack.colors.negative + '20',
    '--color-text-raw': pack.colors.text,
    '--color-text-secondary-raw': pack.colors.textSecondary,
    '--color-border': pack.colors.border,
    '--font-heading': pack.fonts.heading,
    '--font-body': pack.fonts.body,
  }
}
