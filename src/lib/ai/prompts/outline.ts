import { DocumentChunk } from '../../types'
import { getItemCountConstraintLines } from '../../layout-rules'
import { buildRouterGuidance } from '../layout-router'

export function buildOutlinePrompt(
  chunks: DocumentChunk[],
  preferences?: {
    slideCount?: number
    language?: string
    imagePool?: { url: string; description: string; source: 'user' | 'docx' }[]
  }
) {
  const language = preferences?.language || 'zh-CN'
  const inferredSlideTarget = preferences?.slideCount || Math.max(18, Math.min(chunks.length + 2, 24))
  const itemCountConstraints = getItemCountConstraintLines()
    .map((line) => `- ${line}`)
    .join('\n')

  const chunkSummary = chunks
    .map((chunk) => {
      const content = chunk.content || ''
      const numberCount = (content.match(/-?\d+(\.\d+)?%?/g) || []).length
      const yearCount = (content.match(/\b(19|20)\d{2}\b/g) || []).length
      const bulletCount = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => /^([-*•]|[0-9]+[.)、]|[A-Za-z][.)])\s+/.test(line)).length
      let text =
        `[Chunk ${chunk.order}] 标题: ${chunk.heading} (H${chunk.headingLevel})\n` +
        `原文: ${content}\n` +
        `结构信号: 数值=${numberCount}, 年份=${yearCount}, 列表项≈${bulletCount}, 表格=${chunk.tables?.length || 0}`

      if (chunk.tables && chunk.tables.length > 0) {
        text += `\n[表格数据]\n${chunk.tables.join('\n\n')}`
      }
      return text
    })
    .join('\n\n---\n\n')

  const hasImages = preferences?.imagePool && preferences.imagePool.length > 0
  const imagesMeta = hasImages
    ? `\n[图片池 | 共 ${preferences!.imagePool!.length} 张可用图片]\n` +
      preferences!.imagePool!
        .map((img, idx) => `[Image ${idx}] (${img.source === 'user' ? '用户上传' : '文档提取'}): ${img.description || '无描述'}`)
        .join('\n') +
      `\n\n[图片规则 (及其重要)]
1. 可以为任意页设置 imageIndex。
2. 【强制要求】用户上传的图片（user-uploaded images）必须 100% 全部用上，严禁遗漏任何一张。
3. 必须在大纲中通过为各页面分配对应的 imageIndex，确保每一张“用户上传”图片都被合理引用。
4. 优先分配用户上传图片，分配完后若仍有缺图，才可使用文档提取图片。
5. ⚠️注意：图片必须分配给支持显示的布局。严禁将图片分配给纯文、数据（chart-*, metrics*）、时间线（timeline, milestone-*）或引用类布局。
6. 建议承载图片的布局：image-text, text-image, image-center, image-full, cards-split, features-list-image。`
    : ''

  const routerGuidance = buildRouterGuidance(chunks)

  return {
    system: `你是专业的演示文稿大纲规划助手，请仅返回 JSON。
[输出格式]
1. 只返回 JSON，不要输出解释文字。
2. 必须严格遵循目标 JSON 结构。
3. JSON key 与字符串必须使用 double quotes。

[语言规则]
1. 可见文案（title / subtitle / contentHint / speakerNotes）统一使用简体中文。
2. 不要中英混写，不要输出乱码字符。
3. imageHint 可以是中文描述。

[规划规则]
1. 结构规范：第一页必须是 "cover"，最后一页必须是 "ending"。严禁使用 "section-header" 组织结构，所有内容直接进入对应的功能布局。
2. 页面标题忠实度（核心要求）：
   - **必须 100% 直接使用原文 Chunk 标题作为该页的 title**。
   - 严禁对标题进行任何形式的概括、简化、重组或翻译。如果 Chunk 标题为 "核心技术 - XXX"，则该页标题即为 "核心技术 - XXX"。
3. 页面拆分与合并规则（强制契约）：
   - **二级标题（H2）绝对拆分**：所有层级为 H2 的 Chunk **必须独立成页**，绝对不允许将两个或多个 H2 级别的 Chunk 合并到同一页。
   - **核心项绝对拆分**：每一个以“核心技术 - ”或“应用企业 - ”开头的 Chunk **必须且只能**独立做成一页 Slides（1:1 映射），**严禁将其与任何内容合并**。这是预设的文档格式契约。
   - **特殊项优先拆分**：对于标题包含“应用展示”、“核心优势”、“主要产品”、“应用场景”、“应用案例”等具有子项性质的 Chunk，同样要求每一项单独做成一页，不得随意合并。
   - **普通项容量控制**：对于上述约定的特殊项之外的普通内容，默认采用“一个核心观点=一页”。仅在属于同一 H2 层级下、内容极少且强相关时最多合并 2 个 chunk，合并时标题需用 "标题1 / 标题2" 形式拼接。
4. 语义驱动模板匹配（核心原则）：
   - 【数据与指标】：内容包含具体数值、占比、趋势或核心业绩时，优先选用 \`metrics\`, \`metrics-rings\`, \`chart-bar\`, \`chart-pie\` 等。
   - 【特性与并列】：内容包含多个特性、优势、产品点或模块拆解时，优先选用 \`cards-3\`, \`cards-4\`, \`cards-split\`, \`staggered-cards\`，或 \`list-featured\`。
   - 【时间与流程】：内容涉及发展历程、时间里程碑、项目分期、操作步骤时，必须选用 \`timeline\` 或 \`milestone-list\`。
   - 【对比与解说】：内容涉及两物对比、优劣势分析、或长段抽象概念图解时，优先选用 \`comparison\`, \`image-text\`, \`text-image\` 等。
   - 【人物与名言】：内容涉及重点引语、专家评价、客户心声时，必须使用 \`quote\` 家族模板。
5. 视觉多样性与适宜性的极致平衡：
   - 彻底摒弃全篇 "text-bullets" 轰炸的低级排版，"text-bullets" 仅在纯零散要点且真的无法归类于上述模式时使用。
6. 项数与组件强绑定（必须遵守）：
   - 每种带有具体数字或特定逻辑的模板都有严格的子项数量要求。请务必核对下方 [项数路由约束]。
   - 比如 \`staggered-cards\` 或 \`cards-3\` 必须恰好生成 3 个子项，\`cards-4\` 必须恰好生成 4 个子项。
   - 如果原文包含 5 个要点，但你想用 \`cards-3\`，你必须在提炼内容时将其归纳合并为 3 大点；否则请更换为 \`cards-split\` 等支持 5 项的模板。绝对不要生成与模板限制冲突的内容数量。

[可用布局清单 - 27 种唯一模板]
- 基础及通用: cover, ending, text-bullets, text-center
- 视觉与图片: image-text, text-image, image-center, image-full
- 结构化卡片: cards-2, cards-3, cards-4, cards-split, staggered-cards
- 逻辑与时间: comparison, timeline, milestone-list
- 意见与引用: quote, quote-no-avatar
- 团队与成员: team-members
- 数据与指标: metrics, metrics-rings, metrics-split
- 图表分析: chart-bar, chart-bar-compare, chart-line, chart-pie
- 增强列表: list-featured, features-list-image

[项数路由约束]
${itemCountConstraints}

[图表偏好]
若来源内容包含明确数值趋势、占比、对比，请优先考虑图表布局。${routerGuidance}${hasImages ? '\n\n[重要指令]：检测到图片池，用户上传的图片必须全量引用在大纲中并设置 imageIndex，严禁漏掉。\n' : ''}${imagesMeta}`,

    user: `请根据下列内容规划 PPT 大纲。
${preferences?.slideCount ? `页数目标约 ${preferences.slideCount} 页，可按内容质量微调。` : `默认目标约 ${inferredSlideTarget} 页；宁可略多，也不要过度压缩。`}
语言锁定: ${language}

内容：
${chunkSummary}

请返回以下 JSON 结构：
{
  "title": "演示标题",
  "slideCount": 12,
  "slides": [
    {
      "index": 1,
      "title": "页面标题",
      "subtitle": "可选副标题",
      "layout": "layout-name",
      "contentHint": "该页核心表达（1-2句）",
      "imageHint": "可选图片方向",
      "imageIndex": 0,
      "refChunks": [1, 2],
      "speakerNotes": "可选备注"
    }
  ]
}`,
  }
}
