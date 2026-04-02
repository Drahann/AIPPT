/**
 * Pretext Measurement Engine
 *
 * Server-side text measurement using @chenglou/pretext backed by node-canvas.
 * Provides a typographic scale system (H1~H3, B1~B6) and an automatic
 * step-down algorithm to find the optimal font tier for a given bounding box.
 *
 * Canvas: 1920×1080 px reference (matches frontend 960px at 2× scale)
 */

import { createCanvas, registerFont } from 'canvas'
import path from 'path'
import fs from 'fs'

// ---------------------------------------------------------------------------
// 1. Node.js Canvas polyfill — must run BEFORE importing pretext
// ---------------------------------------------------------------------------

let polyfillInstalled = false

function ensureCanvasPolyfill() {
  if (polyfillInstalled) return
  if (typeof globalThis.OffscreenCanvas === 'undefined') {
    ;(globalThis as any).OffscreenCanvas = class NodeOffscreenCanvas {
      private _canvas: ReturnType<typeof createCanvas>
      constructor(w: number, h: number) {
        this._canvas = createCanvas(w, h)
      }
      getContext(type: string) {
        return this._canvas.getContext(type as '2d')
      }
    }
  }
  polyfillInstalled = true
}

// ---------------------------------------------------------------------------
// 2. Typographic Scale
// ---------------------------------------------------------------------------

export type HeadingLevel = 'H1' | 'H2' | 'H3'
export type SubheadingLevel = 'S1' | 'S2'
export type BodyLevel = 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6'
export type TypoLevel = HeadingLevel | SubheadingLevel | BodyLevel

/**
 * PPT Typographic Scale — 1920×1080 canvas
 *
 * Design principles:
 *   - Heading ratio: ~1.30 (Perfect Fourth)
 *   - S→B gap: 1.19 (clear category break)
 *   - Body ratio: ~1.15 (Minor Second, dense but readable)
 *   - Line-height: H ~1.15, S ~1.25, B ~1.45
 *   - Font-weight: H=700, S=600, B=400
 *
 * Scale mapping at 960px frontend (÷2):
 *   H1=44px  H2=34px  H3=26px
 *   S1=22px  S2=19px
 *   B1=16px  B2=14px  B3=12px  B4=10.5px  B5=9px  B6=8px
 */
export const TYPO_SCALE = {
  heading: {
    H1: { fontSize: 88, lineHeight: 100, fontWeight: 700 },
    H2: { fontSize: 68, lineHeight: 80,  fontWeight: 700 },
    H3: { fontSize: 52, lineHeight: 62,  fontWeight: 700 },
  },
  subheading: {
    S1: { fontSize: 44, lineHeight: 54,  fontWeight: 600 },
    S2: { fontSize: 38, lineHeight: 48,  fontWeight: 600 },
  },
  body: {
    B1: { fontSize: 32, lineHeight: 48,  fontWeight: 400 },
    B2: { fontSize: 28, lineHeight: 40,  fontWeight: 400 },
    B3: { fontSize: 24, lineHeight: 34,  fontWeight: 400 },
    B4: { fontSize: 21, lineHeight: 30,  fontWeight: 400 },
    B5: { fontSize: 18, lineHeight: 25,  fontWeight: 400 },
    B6: { fontSize: 16, lineHeight: 22,  fontWeight: 400 },
  },
} as const

const HEADING_TIERS: HeadingLevel[] = ['H1', 'H2', 'H3']
const BODY_TIERS: BodyLevel[] = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6']
const ALL_TIERS: TypoLevel[] = ['H1', 'H2', 'H3', 'S1', 'S2', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6']

// ---------------------------------------------------------------------------
// 3. Core calculation functions
// ---------------------------------------------------------------------------

export interface TypoResult {
  level: string
  fontSize: number
  lineHeight: number
  overflow: boolean
}

function resolveScale(level: TypoLevel): { fontSize: number; lineHeight: number } {
  if (level in TYPO_SCALE.heading) return TYPO_SCALE.heading[level as HeadingLevel]
  if (level in TYPO_SCALE.subheading) return TYPO_SCALE.subheading[level as SubheadingLevel]
  if (level in TYPO_SCALE.body) return TYPO_SCALE.body[level as BodyLevel]
  return TYPO_SCALE.body.B2
}

function getTierAtOffset(level: TypoLevel, offset: number): TypoLevel {
  const idx = ALL_TIERS.indexOf(level)
  if (idx < 0) return level
  const targetIdx = Math.min(idx + offset, ALL_TIERS.length - 1)
  return ALL_TIERS[targetIdx]
}

function getMaxTierForCategory(level: TypoLevel): TypoLevel {
  if (level.startsWith('H')) return 'H3'
  if (level.startsWith('S')) return 'S2'
  return 'B6'
}

/**
 * Pure math: given a bounding box and a font tier, calculate max safe char count.
 */
export function getCharLimitForBounds(
  w: number,
  h: number,
  level: TypoLevel,
  cjkRatio: number = 0.85,
): { charLimit: number; lineCount: number } {
  const scale = resolveScale(level)
  const avgCharWidth = scale.fontSize * (cjkRatio * 1.0 + (1 - cjkRatio) * 0.55)
  const charsPerLine = Math.floor(w / avgCharWidth)
  const lineCount = Math.floor(h / scale.lineHeight)
  const charLimit = charsPerLine * lineCount
  return { charLimit: Math.max(charLimit, 5), lineCount: Math.max(lineCount, 1) }
}

/**
 * Determines the optimal typographic tier for `text` to fit within a box.
 */
export async function calculateOptimalTypo(
  text: string,
  type: 'heading' | 'body',
  maxWidth: number,
  maxHeight: number,
  fontFamily: string = 'sans-serif',
): Promise<TypoResult> {
  ensureCanvasPolyfill()
  const { prepare, layout } = await import('@chenglou/pretext')

  const entries = type === 'heading'
      ? HEADING_TIERS.map((t) => ({ tier: t, ...TYPO_SCALE.heading[t] }))
      : BODY_TIERS.map((t) => ({ tier: t, ...TYPO_SCALE.body[t] }))

  for (const entry of entries) {
    const fontStr = `${entry.fontSize}px ${fontFamily}`
    const breakableText = text.replace(/([\u4e00-\u9fa5])/g, '$1\u200B')
    const prepared = prepare(breakableText, fontStr)
    const result = layout(prepared, maxWidth, entry.lineHeight)

    if (result.height <= maxHeight) {
      return { level: entry.tier, fontSize: entry.fontSize, lineHeight: entry.lineHeight, overflow: false }
    }
  }

  const last = entries[entries.length - 1]
  return { level: last.tier, fontSize: last.fontSize, lineHeight: last.lineHeight, overflow: true }
}

// ---------------------------------------------------------------------------
// 4. Multi-tier Character Constraint Logic
// ---------------------------------------------------------------------------

/**
 * Compute a tiered range of char limits for a bounding box.
 */
function getCharLimitRangeForBounds(w: number, h: number, defaultTier: TypoLevel) {
  return {
    optimal:  getCharLimitForBounds(w, h, defaultTier).charLimit,
    standard: getCharLimitForBounds(w, h, getTierAtOffset(defaultTier, 1)).charLimit,
    expanded: getCharLimitForBounds(w, h, getTierAtOffset(defaultTier, 2)).charLimit,
    max:      getCharLimitForBounds(w, h, getTierAtOffset(defaultTier, 3)).charLimit,
  }
}

/**
 * Given a layout type, returns a multi-tiered map of field name -> char limits.
 */
export function getTemplateCharLimitsRange(
  layout: import('../types').LayoutType,
): Record<string, { optimal: number; standard: number; expanded: number; max: number }> {
  const { templateBounds } = require('../layout-specs')
  const bounds = templateBounds[layout]
  if (!bounds) return {}

  const result: Record<string, { optimal: number; standard: number; expanded: number; max: number }> = {}
  for (const [key, box] of Object.entries(bounds)) {
    if (typeof box === 'object' && box !== null && 'w' in (box as any) && 'h' in (box as any) && 'defaultTier' in (box as any)) {
      const b = box as { w: number; h: number; defaultTier: TypoLevel }
      result[key] = getCharLimitRangeForBounds(b.w, b.h, b.defaultTier)
    }
  }
  return result
}

/**
 * Returns a flattened map of field -> standard limit (legacy support).
 */
export function getTemplateCharLimits(
  layout: import('../types').LayoutType,
): Record<string, number> {
  const range = getTemplateCharLimitsRange(layout)
  const flat: Record<string, number> = {}
  for (const [k, v] of Object.entries(range)) {
    flat[k] = v.standard
  }
  return flat
}

export async function measureMultipleFields(
  fields: Array<{ name: string; text: string; type: 'heading' | 'body'; maxW: number; maxH: number }>,
  fontFamily?: string,
): Promise<Record<string, TypoResult>> {
  const results: Record<string, TypoResult> = {}
  for (const field of fields) {
    results[field.name] = await calculateOptimalTypo(field.text, field.type, field.maxW, field.maxH, fontFamily)
  }
  return results
}
