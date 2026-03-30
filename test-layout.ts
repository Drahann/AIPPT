import { getSlideLayoutCandidates } from './src/lib/ai/layout-router.ts'
import { SlideOutline, DocumentChunk } from './src/types.d.ts'

const testCases = [
  {
    name: '3 Bottlenecks (should prefer cards-3 or staggered-cards)',
    slide: { title: '深入调研: 产业瓶颈识别', contentHint: '识别三重瓶颈: 传感器、算法、生态' } as SlideOutline,
    chunks: [] as DocumentChunk[]
  },
  {
    name: 'IP Metrics (should prefer metrics)',
    slide: { title: '创新成果', contentHint: '累计发表论文9篇，申请专利15项' } as SlideOutline,
    chunks: [] as DocumentChunk[]
  },
  {
    name: 'Case Study Metrics (should prefer metrics)',
    slide: { title: '应用案例', contentHint: '周期缩短40%，准确率提升至98.5%' } as SlideOutline,
    chunks: [] as DocumentChunk[]
  },
  {
    name: 'Timeline (should prefer timeline)',
    slide: { title: '落地前景', contentHint: '第一阶段、第二阶段、第三阶段' } as SlideOutline,
    chunks: [] as DocumentChunk[]
  }
]

console.log('--- Testing Layout Diversity ---')
testCases.forEach(tc => {
  const candidates = getSlideLayoutCandidates(tc.slide, tc.chunks)
  console.log(`\nTest: ${tc.name}`)
  console.log(`Winner (candidates[0]): ${candidates[0]}`)
  console.log(`Full List: ${candidates.join(', ')}`)
})
