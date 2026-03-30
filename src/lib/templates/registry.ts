import group01 from './group-01/meta'
import group02 from './group-02/meta'
import group03 from './group-03/meta'
import group04 from './group-04/meta'
import group05 from './group-05/meta'
import group06 from './group-06/meta'
import group07 from './group-07/meta'
import group08 from './group-08/meta'
import group09 from './group-09/meta'
import group10 from './group-10/meta'
import { TemplatePack } from './index'
import { auditReadableTokens, deriveReadableTokens } from '../utils/color-contrast'

export const templatePacks: TemplatePack[] = [
  group01,
  group02,
  group03,
  group04,
  group05,
  group06,
  group07,
  group08,
  group09,
  group10,
]

const packMap = new Map(templatePacks.map((p) => [p.id, p]))

export function getTemplatePack(id: string): TemplatePack {
  return packMap.get(id) || group01
}

export function getAllTemplatePacks(): TemplatePack[] {
  return templatePacks
}

/** Convert TemplatePack colors/fonts → CSS custom properties for inline style */
export function templatePackToCSS(pack: TemplatePack): Record<string, string> {
  const readable = deriveReadableTokens(pack.colors)
  if (process.env.NODE_ENV !== 'production') {
    const failing = auditReadableTokens(pack.colors, readable).filter((item) => !item.pass)
    if (failing.length > 0) {
      console.warn(
        `[contrast] ${pack.id} has low-contrast semantic tokens: ${failing
          .map((item) => `${item.key}=${item.ratio.toFixed(2)}`)
          .join(', ')}`
      )
    }
  }
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
    '--color-canvas': readable.canvas,
    '--color-text': readable.onCanvas,
    '--color-text-secondary': readable.subtleOnCanvas,
    '--color-on-canvas': readable.onCanvas,
    '--color-on-surface': readable.onSurface,
    '--color-on-primary': readable.onPrimary,
    '--color-on-accent': readable.onAccent,
    '--color-positive-soft': readable.positiveSoft,
    '--color-negative-soft': readable.negativeSoft,
    '--color-text-raw': pack.colors.text,
    '--color-text-secondary-raw': pack.colors.textSecondary,
    '--color-border': pack.colors.border,
    '--font-heading': pack.fonts.heading,
    '--font-body': pack.fonts.body,
  }
}
