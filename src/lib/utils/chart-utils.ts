/**
 * Shared Chart Utilities
 * 
 * Provides a professional, high-contrast color palette for charts
 * that complements the theme's brand colors.
 */

export const EXTENDED_CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#84cc16', // lime-500
  '#6366f1', // indigo-500
];

export interface ThemeColors {
  primary: string;
  secondary?: string;
  accent: string;
}

/**
 * Returns an array of hex colors for a chart series.
 * Prioritizes theme colors, then fills with extended palette.
 * @param avoidColors - List of colors (hex or var) to avoid using to prevent overlap with background.
 */
export function getSeriesColorPalette(theme: ThemeColors, count: number, avoidColors: string[] = []): string[] {
  const result: string[] = [];
  const normalizedAvoid = avoidColors.map(c => c.toLowerCase());
  
  const isAvoided = (color: string) => {
    return normalizedAvoid.some(a => a === color.toLowerCase());
  };

  // 1. Theme Primary
  if (!isAvoided(theme.primary)) {
    result.push(theme.primary);
  }
  
  // 2. Theme Secondary (if different and not avoided)
  if (theme.secondary && 
      theme.secondary.toLowerCase() !== theme.primary.toLowerCase() && 
      !isAvoided(theme.secondary)) {
    result.push(theme.secondary);
  }
  
  // 3. Theme Accent (if different and not avoided)
  if (theme.accent && 
      theme.accent.toLowerCase() !== theme.primary.toLowerCase() && 
      theme.accent.toLowerCase() !== (theme.secondary || '').toLowerCase() &&
      !isAvoided(theme.accent)) {
    result.push(theme.accent);
  }
  
  // 4. Fill with extended colors, skipping matches to theme colors or avoid list
  for (const color of EXTENDED_CHART_COLORS) {
    if (result.length >= count) break;
    
    const isAlreadyUsed = result.some(r => r.toLowerCase() === color.toLowerCase());
    if (!isAlreadyUsed && !isAvoided(color)) {
      result.push(color);
    }
  }
  
  // 5. If still not enough, just repeat the extended palette (ignoring avoid list if possible)
  let i = 0;
  while (result.length < count) {
    const color = EXTENDED_CHART_COLORS[i % EXTENDED_CHART_COLORS.length];
    if (!isAvoided(color) || result.length === 0) { // If everything is avoided, we have to pick something
      result.push(color);
    }
    i++;
    if (i > EXTENDED_CHART_COLORS.length * 2) break; // Safety break
  }
  
  return result;
}

/**
 * Standardize hex for PPTX (removes #)
 */
export function toPptxHex(hex: string): string {
  return hex.replace('#', '');
}
