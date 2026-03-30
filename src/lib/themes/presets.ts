import { Theme } from '../types'
import { auditReadableTokens, deriveReadableTokens } from '../utils/color-contrast'

export const themes: Theme[] = [
  {
    id: 'ocean',
    name: '海洋',
    colors: {
      primary: '#0066CC',
      primaryLight: '#E8F2FF',
      secondary: '#004C99',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceAlt: '#F0F6FF',
      text: '#1A1A2E',
      textSecondary: '#64748B',
      accent: '#00B4D8',
      positive: '#10B981',
      negative: '#EF4444',
      border: '#E2E8F0',
    },
    fonts: { heading: "'Noto Sans SC', 'Inter', sans-serif", body: "'Noto Sans SC', 'Inter', sans-serif" },
    cardStyle: 'elevated',
  },
  {
    id: 'midnight',
    name: '极夜',
    colors: {
      primary: '#818CF8',
      primaryLight: '#1E1B4B',
      secondary: '#6366F1',
      background: '#0F0F1A',
      surface: '#1A1A2E',
      surfaceAlt: '#252547',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      accent: '#22D3EE',
      positive: '#34D399',
      negative: '#F87171',
      border: '#334155',
    },
    fonts: { heading: "'Noto Sans SC', 'Inter', sans-serif", body: "'Noto Sans SC', 'Inter', sans-serif" },
    cardStyle: 'glass',
  },
  {
    id: 'rose',
    name: '玫瑰',
    colors: {
      primary: '#E11D48',
      primaryLight: '#FFF1F2',
      secondary: '#BE123C',
      background: '#FFFBFB',
      surface: '#FFFFFF',
      surfaceAlt: '#FFF5F5',
      text: '#1C1917',
      textSecondary: '#78716C',
      accent: '#F59E0B',
      positive: '#10B981',
      negative: '#EF4444',
      border: '#FECDD3',
    },
    fonts: { heading: "'Noto Sans SC', 'Inter', sans-serif", body: "'Noto Sans SC', 'Inter', sans-serif" },
    cardStyle: 'bordered',
  },
  {
    id: 'forest',
    name: '森林',
    colors: {
      primary: '#059669',
      primaryLight: '#ECFDF5',
      secondary: '#047857',
      background: '#F8FDF9',
      surface: '#FFFFFF',
      surfaceAlt: '#F0FDF4',
      text: '#1A1A2E',
      textSecondary: '#6B7280',
      accent: '#D97706',
      positive: '#10B981',
      negative: '#EF4444',
      border: '#D1FAE5',
    },
    fonts: { heading: "'Noto Sans SC', 'Inter', sans-serif", body: "'Noto Sans SC', 'Inter', sans-serif" },
    cardStyle: 'elevated',
  },
  {
    id: 'lavender',
    name: '薰衣草',
    colors: {
      primary: '#7C3AED',
      primaryLight: '#F5F3FF',
      secondary: '#6D28D9',
      background: '#FAFAFF',
      surface: '#FFFFFF',
      surfaceAlt: '#F3F0FF',
      text: '#1E1B4B',
      textSecondary: '#6B7280',
      accent: '#EC4899',
      positive: '#10B981',
      negative: '#EF4444',
      border: '#DDD6FE',
    },
    fonts: { heading: "'Noto Sans SC', 'Inter', sans-serif", body: "'Noto Sans SC', 'Inter', sans-serif" },
    cardStyle: 'glass',
  },
  {
    id: 'minimal',
    name: '极简',
    colors: {
      primary: '#18181B',
      primaryLight: '#F4F4F5',
      secondary: '#3F3F46',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      surfaceAlt: '#FAFAFA',
      text: '#18181B',
      textSecondary: '#71717A',
      accent: '#2563EB',
      positive: '#16A34A',
      negative: '#DC2626',
      border: '#E4E4E7',
    },
    fonts: { heading: "'Noto Sans SC', 'Inter', sans-serif", body: "'Noto Sans SC', 'Inter', sans-serif" },
    cardStyle: 'flat',
  },
  {
    id: 'sunset',
    name: '日落',
    colors: {
      primary: '#EA580C',
      primaryLight: '#FFF7ED',
      secondary: '#C2410C',
      background: '#FFFCF8',
      surface: '#FFFFFF',
      surfaceAlt: '#FFF3E6',
      text: '#1C1917',
      textSecondary: '#78716C',
      accent: '#0891B2',
      positive: '#10B981',
      negative: '#EF4444',
      border: '#FED7AA',
    },
    fonts: { heading: "'Noto Sans SC', 'Inter', sans-serif", body: "'Noto Sans SC', 'Inter', sans-serif" },
    cardStyle: 'elevated',
  },
  {
    id: 'corporate',
    name: '企业',
    colors: {
      primary: '#334155',
      primaryLight: '#F1F5F9',
      secondary: '#1E293B',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceAlt: '#F1F5F9',
      text: '#0F172A',
      textSecondary: '#64748B',
      accent: '#0EA5E9',
      positive: '#22C55E',
      negative: '#EF4444',
      border: '#CBD5E1',
    },
    fonts: { heading: "'Noto Sans SC', 'Inter', sans-serif", body: "'Noto Sans SC', 'Inter', sans-serif" },
    cardStyle: 'bordered',
  },
]

export function getTheme(id: string): Theme {
  return themes.find((theme) => theme.id === id) || themes[0]
}

export function themeToCSS(theme: Theme): Record<string, string> {
  const readable = deriveReadableTokens(theme.colors)
  if (process.env.NODE_ENV !== 'production') {
    const failing = auditReadableTokens(theme.colors, readable).filter((item) => !item.pass)
    if (failing.length > 0) {
      console.warn(
        `[contrast] ${theme.id} has low-contrast semantic tokens: ${failing
          .map((item) => `${item.key}=${item.ratio.toFixed(2)}`)
          .join(', ')}`
      )
    }
  }

  return {
    '--color-primary': theme.colors.primary,
    '--color-primary-light': theme.colors.primaryLight,
    '--color-secondary': theme.colors.secondary,
    '--color-background': theme.colors.background,
    '--color-bg': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-surface-alt': theme.colors.surfaceAlt,
    '--color-canvas': readable.canvas,
    '--color-text': readable.onCanvas,
    '--color-text-secondary': readable.subtleOnCanvas,
    '--color-on-canvas': readable.onCanvas,
    '--color-on-surface': readable.onSurface,
    '--color-on-primary': readable.onPrimary,
    '--color-on-accent': readable.onAccent,
    '--color-positive-soft': readable.positiveSoft,
    '--color-negative-soft': readable.negativeSoft,
    '--color-text-raw': theme.colors.text,
    '--color-text-secondary-raw': theme.colors.textSecondary,
    '--color-accent': theme.colors.accent,
    '--color-positive': theme.colors.positive,
    '--color-negative': theme.colors.negative,
    '--color-border': theme.colors.border,
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
  }
}

