import { SlideContent } from '../types';

export type DensityClass = 'density-low' | 'density-medium' | 'density-high';

/**
 * Calculates the content density of a slide to drive layout adjustments.
 */
export function getDensityClass(slide: SlideContent): DensityClass {
  let score = 0;

  // 1. Text length contribution
  const titleLen = slide.title?.length || 0;
  const subtitleLen = slide.subtitle?.length || 0;
  
  let bodyLen = 0;
  if (slide.body) {
    slide.body.forEach(b => {
      bodyLen += b.text?.length || 0;
      b.items?.forEach(i => bodyLen += i.length);
    });
  }

  if (slide.left) {
    bodyLen += slide.left.heading.length;
    slide.left.items.forEach(i => bodyLen += i.length);
  }
  if (slide.right) {
    bodyLen += slide.right.heading.length;
    slide.right.items.forEach(i => bodyLen += i.length);
  }
  if (slide.quote) {
    bodyLen += slide.quote.text.length + (slide.quote.attribution?.length || 0);
  }
  
  // 2. Structural elements contribution
  const cardCount = slide.cards?.length || 0;
  const eventCount = slide.events?.length || 0;
  const metricCount = slide.metrics?.length || 0;
  
  // Calculate raw score
  score += titleLen * 1.5;
  score += subtitleLen * 1.2;
  score += bodyLen;
  score += cardCount * 50;  // Each card is significant structure
  score += eventCount * 40; // Each timeline event
  score += metricCount * 30; // Each metric
  
  // If it's a chart or has an image, it's rarely "low" density visually
  if (slide.layout.startsWith('chart-')) score += 200;
  if (slide.image) score += 150;

  // Thresholds calibrated for 16:9 layout
  if (score < 180) return 'density-low';
  if (score < 450) return 'density-medium';
  return 'density-high';
}

/**
 * Returns a scaling factor for font sizes based on density.
 * low -> 1.25x booster
 */
export function getDensityScale(density: DensityClass): number {
  switch (density) {
    case 'density-low': return 1.25;
    case 'density-medium': return 1.1;
    default: return 1.0;
  }
}
