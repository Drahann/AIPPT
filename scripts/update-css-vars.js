const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../src/styles/slide-layouts.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The replacement logic:
// We look for blocks of CSS rules. E.g. .layout-xxx .class-name { ... font-size: X; ... }
// Based on .class-name, we replace `font-size: <val>;` with `font-size: var(--dynamic-TARGET-fs, <val>);`

// List of exact CSS class suffixes that represent the main bounding 'body' text measured by pretext
const bodyClasses = [
  'slide-text', 'slide-description', 'card-body', 'timeline-description', 
  'comparison-body', 'list-body', 'quote-body', 'metrics-label', 'quote-text',
  'cards-dual-metric-description', 'cards-split-feature-body', 'milestone-content',
  'cards-dual-metric-value'
];
// List of exact CSS class suffixes that represent the main 'heading' text measured by pretext
const headingClasses = [
  'slide-title', 'section-title', 'metrics-value', 'quote-attr',
  'milestone-year', 'list-featured-heading', 'cards-featured-title'
];
// List of classes that belong to the S (Subheading) tier
const subheadingClasses = [
  'card-heading', 'timeline-heading', 'comparison-heading', 'cards-featured-heading'
];

function getTargetVar(selector) {
  const s = selector.toLowerCase();
  // We check for the class name preceded by a dot or space to avoid partial word matches
  if (headingClasses.some(k => s.includes('.' + k) || s.includes(' ' + k))) return '--dynamic-heading-fs';
  if (subheadingClasses.some(k => s.includes('.' + k) || s.includes(' ' + k))) return '--dynamic-subheading-fs';
  if (bodyClasses.some(k => s.includes('.' + k) || s.includes(' ' + k))) return '--dynamic-body-fs';
  return null;
}

// Regex to find CSS blocks
// Warning: This simplistic parser assumes standard CSS without nested media queries (or simple ones).
// Since slide-layouts.css is flat, this works well.
const ruleRegex = /([^{]+)\{([^}]+)\}/g;

css = css.replace(ruleRegex, (match, selector, block) => {
  const targetVar = getTargetVar(selector);
  if (!targetVar) return match;

  // We want to replace `font-size: X;`
  // Handle two common patterns:
  // 1. `font-size: 1.5rem;`
  // 2. `font-size: calc(1.5rem * var(--slide-scale-font));`
  
  const newBlock = block.replace(/font-size:\s*(calc\([^;]+?\)|[^;]+?)(;|$)/g, (fMatch, val, suffix) => {
    // If it already uses our dynamic var, skip
    if (val.includes('--dynamic-')) return fMatch;

    // Pattern 1: calc(1.5rem * var(--slide-scale-font))
    const calcMatch = val.match(/^calc\(([^*]+)\s*\*\s*var\(--slide-scale-font\)\)$/);
    if (calcMatch) {
      const baseVal = calcMatch[1].trim();
      return `font-size: calc(var(${targetVar}, ${baseVal}) * var(--slide-scale-font))${suffix}`;
    }

    // Pattern 2: 1.5rem
    return `font-size: var(${targetVar}, ${val})${suffix}`;
  });

  return `${selector}{${newBlock}}`;
});

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated CSS with dynamic typography variables!');
