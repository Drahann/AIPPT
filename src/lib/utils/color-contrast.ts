type RGB = { r: number; g: number; b: number }

const FALLBACK_DARK = '#111111'
const FALLBACK_LIGHT = '#FFFFFF'

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

export function normalizeHex(input: string): string {
  const raw = input.trim().replace('#', '')
  if (raw.length === 3) {
    const expanded = raw.split('').map((c) => `${c}${c}`).join('')
    return `#${expanded.toUpperCase()}`
  }
  if (raw.length === 6) {
    return `#${raw.toUpperCase()}`
  }
  return '#000000'
}

export function hexToRgb(input: string): RGB {
  const hex = normalizeHex(input).replace('#', '')
  const value = parseInt(hex, 16)
  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff,
  }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (v: number) => clampByte(v).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function channelToLinear(value: number): number {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(input: string): number {
  const { r, g, b } = hexToRgb(input)
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  )
}

export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground)
  const l2 = relativeLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function pickReadableTextColor(
  background: string,
  dark = FALLBACK_DARK,
  light = FALLBACK_LIGHT
): string {
  const darkContrast = contrastRatio(dark, background)
  const lightContrast = contrastRatio(light, background)
  return darkContrast >= lightContrast ? normalizeHex(dark) : normalizeHex(light)
}

export function ensureContrast(
  preferredForeground: string,
  background: string,
  minRatio = 4.5
): string {
  const preferred = normalizeHex(preferredForeground)
  const bg = normalizeHex(background)
  if (contrastRatio(preferred, bg) >= minRatio) {
    return preferred
  }
  return pickReadableTextColor(bg)
}

export function mixHex(a: string, b: string, weightA = 0.5): string {
  const first = hexToRgb(a)
  const second = hexToRgb(b)
  const wA = Math.max(0, Math.min(1, weightA))
  const wB = 1 - wA
  return rgbToHex({
    r: first.r * wA + second.r * wB,
    g: first.g * wA + second.g * wB,
    b: first.b * wA + second.b * wB,
  })
}

export interface ReadableColorSource {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  positive: string
  negative: string
}

export interface ReadableColorTokens {
  canvas: string
  onCanvas: string
  onSurface: string
  onPrimary: string
  onAccent: string
  positiveSoft: string
  negativeSoft: string
  subtleOnCanvas: string
}

export interface ContrastAuditResult {
  key: 'onCanvas' | 'onSurface' | 'onPrimary' | 'onAccent'
  ratio: number
  min: number
  pass: boolean
}

export function deriveReadableTokens(source: ReadableColorSource): ReadableColorTokens {
  const background = normalizeHex(source.background)
  const surface = normalizeHex(source.surface)
  const text = normalizeHex(source.text)
  const textSecondary = normalizeHex(source.textSecondary)
  const primary = normalizeHex(source.primary)
  const accent = normalizeHex(source.accent)
  const positive = normalizeHex(source.positive)
  const negative = normalizeHex(source.negative)

  const canvas = contrastRatio(text, background) >= 4.5 ? background : surface
  const onCanvas = ensureContrast(text, canvas, 4.5)
  const onSurface = ensureContrast(text, surface, 4.5)
  const subtleOnCanvas = ensureContrast(textSecondary, canvas, 3)
  const onPrimary = ensureContrast(FALLBACK_LIGHT, primary, 4.5)
  const onAccent = ensureContrast(FALLBACK_LIGHT, accent, 4.5)
  const positiveSoft = mixHex(positive, surface, 0.18)
  const negativeSoft = mixHex(negative, surface, 0.18)

  return {
    canvas,
    onCanvas,
    onSurface,
    onPrimary,
    onAccent,
    positiveSoft,
    negativeSoft,
    subtleOnCanvas,
  }
}

export function auditReadableTokens(
  source: ReadableColorSource,
  tokens: ReadableColorTokens
): ContrastAuditResult[] {
  return [
    { key: 'onCanvas', ratio: contrastRatio(tokens.onCanvas, tokens.canvas), min: 4.5, pass: contrastRatio(tokens.onCanvas, tokens.canvas) >= 4.5 },
    { key: 'onSurface', ratio: contrastRatio(tokens.onSurface, source.surface), min: 4.5, pass: contrastRatio(tokens.onSurface, source.surface) >= 4.5 },
    { key: 'onPrimary', ratio: contrastRatio(tokens.onPrimary, source.primary), min: 4.5, pass: contrastRatio(tokens.onPrimary, source.primary) >= 4.5 },
    { key: 'onAccent', ratio: contrastRatio(tokens.onAccent, source.accent), min: 4.5, pass: contrastRatio(tokens.onAccent, source.accent) >= 4.5 },
  ]
}
