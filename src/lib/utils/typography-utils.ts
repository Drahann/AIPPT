import { CSSProperties } from 'react'

/**
 * Typography CSS variable bridge.
 *
 * Maps the backend TYPO_SCALE (1920×1080 px) to frontend CSS properties
 * at the 960px half-scale canvas using rem units (1rem = 16px).
 *
 * Conversion: frontendPx = enginePx / 2; rem = frontendPx / 16
 */

const HEADING_SCALES: Record<string, { fs: string; lh: string; fw: string }> = {
  H1: { fs: '2.75rem',   lh: '1.14', fw: '700' },
  H2: { fs: '2.125rem',  lh: '1.18', fw: '700' },
  H3: { fs: '1.625rem',  lh: '1.19', fw: '700' },
}

const SUBHEADING_SCALES: Record<string, { fs: string; lh: string; fw: string }> = {
  S1: { fs: '1.375rem',  lh: '1.23', fw: '600' },
  S2: { fs: '1.1875rem', lh: '1.26', fw: '600' },
}

const BODY_SCALES: Record<string, { fs: string; lh: string; fw: string }> = {
  B1: { fs: '1.0rem',    lh: '1.5',  fw: '400' },
  B2: { fs: '0.875rem',  lh: '1.43', fw: '400' },
  B3: { fs: '0.75rem',   lh: '1.42', fw: '400' },
  B4: { fs: '0.65625rem',lh: '1.43', fw: '400' },
  B5: { fs: '0.5625rem', lh: '1.39', fw: '400' },
  B6: { fs: '0.5rem',    lh: '1.38', fw: '400' },
}

interface TypographyParams {
  headingLevel?: 'H1' | 'H2' | 'H3'
  subheadingLevel?: 'S1' | 'S2'
  bodyLevel?: 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6'
}

/**
 * Returns a CSSProperties object with dynamic typography CSS variables.
 * If no params are provided, returns an empty object (CSS defaults apply).
 */
export function getTypographyVars(params?: TypographyParams): CSSProperties {
  const vars: Record<string, string> = {}

  // Export ALL constant scales as global CSS variables for the slide scope
  Object.entries(HEADING_SCALES).forEach(([level, val]) => {
    vars[`--font-size-${level.toLowerCase()}`] = val.fs;
    vars[`--font-weight-${level.toLowerCase()}`] = val.fw;
  });
  Object.entries(SUBHEADING_SCALES).forEach(([level, val]) => {
    vars[`--font-size-${level.toLowerCase()}`] = val.fs;
    vars[`--font-weight-${level.toLowerCase()}`] = val.fw;
  });
  Object.entries(BODY_SCALES).forEach(([level, val]) => {
    vars[`--font-size-${level.toLowerCase()}`] = val.fs;
    vars[`--font-weight-${level.toLowerCase()}`] = val.fw;
  });

  if (!params) return vars as CSSProperties

  if (params.headingLevel && HEADING_SCALES[params.headingLevel]) {
    const h = HEADING_SCALES[params.headingLevel]
    vars['--dynamic-heading-fs'] = h.fs
    vars['--dynamic-heading-lh'] = h.lh
    vars['--dynamic-heading-fw'] = h.fw
  }

  if (params.subheadingLevel && SUBHEADING_SCALES[params.subheadingLevel]) {
    const s = SUBHEADING_SCALES[params.subheadingLevel]
    vars['--dynamic-subheading-fs'] = s.fs
    vars['--dynamic-subheading-lh'] = s.lh
    vars['--dynamic-subheading-fw'] = s.fw
  }

  if (params.bodyLevel && BODY_SCALES[params.bodyLevel]) {
    const b = BODY_SCALES[params.bodyLevel]
    vars['--dynamic-body-fs'] = b.fs
    vars['--dynamic-body-lh'] = b.lh
    vars['--dynamic-body-fw'] = b.fw
  }

  return vars as CSSProperties
}
