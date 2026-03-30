export interface DocumentChunk {
  id: string
  heading: string
  headingLevel: number
  content: string
  tables?: string[]
  order: number
}

export type LayoutType =
  | 'cover'
  | 'section-header'
  | 'text-bullets'
  | 'text-center'
  | 'image-text'
  | 'text-image'
  | 'image-center'
  | 'image-full'
  | 'cards-2'
  | 'cards-3'
  | 'cards-4'
  | 'comparison'
  | 'timeline'
  | 'metrics'
  | 'quote'
  | 'quote-no-avatar'
  | 'ending'
  | 'chart-bar'
  | 'chart-bar-compare'
  | 'chart-line'
  | 'chart-pie'
  | 'list-featured'
  | 'cards-split'
  | 'staggered-cards'
  | 'features-list-image'
  | 'metrics-rings'
  | 'metrics-split'
  | 'milestone-list'
  | 'team-members'

export interface SlideOutline {
  index: number
  title: string
  subtitle?: string
  layout: LayoutType
  contentHint: string
  imageHint?: string
  imageIndex?: number
  refChunks: number[]
  speakerNotes?: string
}

export interface OutlineResult {
  title: string
  slideCount: number
  slides: SlideOutline[]
}

export interface CardContent {
  icon?: string
  image?: { url: string; prompt?: string }
  heading: string
  body: string
}

export interface TimelineEvent {
  date: string
  title: string
  description: string
}

export interface MetricItem {
  value: string
  label: string
  icon?: string
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie'
  title: string
  categories: string[]
  series: {
    name: string
    values: number[]
  }[]
}

export interface SlideContent {
  id?: string
  layout: LayoutType
  title: string
  subtitle?: string
  body?: Array<{
    type: 'paragraph' | 'bullet'
    text?: string
    items?: string[]
  }>
  image?: {
    prompt: string
    alt: string
    url?: string
  }
  cards?: CardContent[]
  left?: { heading: string; items: string[]; tone?: 'positive' | 'negative' | 'neutral' }
  right?: { heading: string; items: string[]; tone?: 'positive' | 'negative' | 'neutral' }
  events?: TimelineEvent[]
  metrics?: MetricItem[]
  chart?: ChartData
  quote?: { text: string; attribution?: string }
  speakerNotes?: string
}

export interface Presentation {
  id: string
  title: string
  themeId: string
  slides: SlideContent[]
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

export interface GenerationTask {
  id: string
  status: 'uploading' | 'parsing' | 'outlining' | 'generating' | 'imaging' | 'done' | 'error'
  progress: number
  message: string
  presentation?: Presentation
  error?: string
}

export interface ThemeColors {
  primary: string
  primaryLight: string
  secondary: string
  background: string
  surface: string
  surfaceAlt: string
  text: string
  textSecondary: string
  accent: string
  positive: string
  negative: string
  border: string
}

export interface Theme {
  id: string
  name: string
  colors: ThemeColors
  fonts: {
    heading: string
    body: string
  }
  cardStyle: 'flat' | 'elevated' | 'bordered' | 'glass'
}
