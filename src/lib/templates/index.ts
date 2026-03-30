import { ThemeColors, LayoutType } from '../types'

export interface TemplatePack {
  id: string
  name: string
  description?: string
  previewColor?: string

  // Design Tokens
  colors: ThemeColors
  fonts: {
    heading: string
    body: string
    accent?: string
  }

  // Card / decoration style
  cardRadius: number | string
  cardStyle: 'flat' | 'elevated' | 'bordered' | 'glass' | 'shadow' | 'border-bottom'

  // Figma original-code component layouts
  figmaLayouts: LayoutType[]

  // Decorative resources
  decorations: string[] | {
    backgroundImage?: string
    accentSvg?: string
    footerLogo?: string
    divider?: string
  }

  // CSS class prefix for content-page overrides
  cssClass: string
}

export interface FigmaSlideProps {
  title: string
  subtitle?: string
  quote?: { text: string; attribution?: string }
  colors?: ThemeColors
}

