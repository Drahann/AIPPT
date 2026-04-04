/**
 * Quick verification: ensure getTemplateCharLimitsRange produces monotonic gradients
 * for all layouts, i.e. optimal <= standard <= expanded <= max
 */
import { getTemplateCharLimitsRange } from '../src/lib/utils/pretext-engine'
import { templateBounds } from '../src/lib/layout-specs'

const layouts = Object.keys(templateBounds) as Array<keyof typeof templateBounds>
let failures = 0

for (const layout of layouts) {
  const ranges = getTemplateCharLimitsRange(layout as any)
  if (!ranges || Object.keys(ranges).length === 0) continue

  for (const [field, range] of Object.entries(ranges)) {
    const { optimal, standard, expanded, max } = range
    const isMonotonic = optimal <= standard && standard <= expanded && expanded <= max
    if (!isMonotonic) {
      console.error(`❌ ${layout}.${field}: optimal=${optimal} standard=${standard} expanded=${expanded} max=${max}`)
      failures++
    }
  }
}

if (failures === 0) {
  console.log('✅ All layouts have monotonic char limit gradients')
} else {
  console.error(`\n❌ ${failures} fields have non-monotonic gradients`)
}

// Show a sample for cards-3 to verify
console.log('\n--- Sample: cards-3 ---')
const sample = getTemplateCharLimitsRange('cards-3')
for (const [field, range] of Object.entries(sample)) {
  console.log(`  ${field}: optimal=${range.optimal} standard=${range.standard} expanded=${range.expanded} max=${range.max}`)
}
