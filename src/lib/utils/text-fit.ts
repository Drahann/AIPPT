import { FigmaSlideProps } from '../templates/index'

export function fitText(baseSize: number, props: FigmaSlideProps): number {
  // Extract text content dynamically based on what's available
  const text = props.quote?.text || props.title || props.subtitle || ''
  const len = text.length
  
  if (len <= 10) return baseSize
  if (len <= 20) return Math.floor(baseSize * 0.85)
  if (len <= 35) return Math.floor(baseSize * 0.7)
  if (len <= 50) return Math.floor(baseSize * 0.55)
  return Math.floor(baseSize * 0.4)
}
