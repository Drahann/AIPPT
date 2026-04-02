import { DocumentChunk, LayoutType } from '../../types'
import { getItemCountConstraintLines } from '../../layout-rules'
import { buildRouterGuidance } from '../layout-router'
import { getTemplateCharLimitsRange } from '../../utils/pretext-engine'

/**
 * Build a compact capacity reference for the outline planner.
 * Shows body char budget per layout family to guide template selection.
 */
function buildCapacityHint(): string {
  const REPRESENTATIVE_LAYOUTS: LayoutType[] = [
    'text-center', 'text-bullets', 'image-text',
    'cards-2', 'cards-3', 'cards-4', 'cards-split',
    'cards-3-featured', 'cards-3-stack', 'cards-4-featured', 'grid-2x2-featured',
    'staggered-cards', 'list-featured',
    'timeline', 'milestone-list',
    'metrics', 'metrics-rings',
    'comparison',
  ]
  const lines = ['[布局容量参考 - 各模板正文字数预算 (推荐 vs 极限)]']
  for (const layout of REPRESENTATIVE_LAYOUTS) {
    const ranges = getTemplateCharLimitsRange(layout)
    if (!ranges.body && !ranges.cardBody && !ranges.eventDesc) continue

    const main = ranges.cardBody || ranges.eventDesc || ranges.body
    if (!main) continue

    const parts = [`${layout}: 推荐≤${main.optimal}, 极限≤${main.max}`]
    lines.push(`- ${parts.join(', ')}`)
  }
  lines.push('提示：若内容极多请优先选择 cards-split/cards-2/text-bullets 等大容量高上限布局。')
  return lines.join('\n')
}

export function buildOutlinePrompt(
  chunks: DocumentChunk[],
  preferences?: {
    slideCount?: number
    language?: string
    imagePool?: { url: string; description: string; source: 'user' | 'docx' }[]
  }
) {
  const language = preferences?.language || 'zh-CN'
  const inferredSlideTarget = preferences?.slideCount || (chunks.length + 2)
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
1. 结构规范与页数（极其核心）：
   - 演示文稿的第一页必须是 "cover"，最后一页必须是 "ending"。
   - 【无敌原则】：封面（cover）和封底（ending）是独立的纯仪式感展示页面，其 \`refChunks\` 数组必须为空 \`[]\`。绝对不允许它们消耗任何输入给你的 Chunk 也就是 \`refChunks\`，绝对**不可**把真实的文档段落硬塞在封面或封底！
   - 原文档所有的 Chunk 内容必须从第 2 页开始分配。意味着如果你把 31 个 Chunk 按 1:1 分配为 31 页，那最终出来的幻灯片肯定是 **33 页**！
2. 页面标题忠实度（核心要求）：
   - **必须 100% 直接使用原文 Chunk 标题作为该页的 title**。严禁对正文标题进行任何概括。如果 Chunk 标题为 "核心技术 - XXX"，则该页标题即为 "核心技术 - XXX"。
   - **唯一的例外**：第一页 (cover) 的 title 必须是整个演示文稿的全局总标题；最后一页 (ending) 的 title 必须是结束语（如“感谢观看”、“携手共赢”等）。
3. 页面拆分与合并规则（强制契约）：
   - **H3 级 Chunk 绝对独立**：所有 headingLevel=3 的 Chunk（已由解析器从"创新技术"、"产业验证"等特殊章节按三级标题预拆分），**必须且只能**独立做成一页（1:1 映射），**严禁合并**。
   - **H2 级 Chunk 绝对独立**：所有 headingLevel=2 的 Chunk **必须独立成页**，不允许合并多个 H2 Chunk。
   - **禁用细碎分页**：禁止将 H4 或更深层级的内容独立成页，需合并入其所属页面。
   - **普通项容量控制**：非特殊项的普通内容，默认"一个核心观点=一页"。仅在属于同一 H2 层级下、内容极少且强相关时最多合并 2 个 chunk，合并时标题需用 "标题1 / 标题2" 形式拼接。
4. 语义驱动模板匹配（核心原则）：
   - 【数据与指标】：若内容核心在于展现多组连贯的具体数值、对比趋势或业绩占比时，可酌情选用 \`metrics\` (四到八项), \`metrics-rings\` (少量), \`chart-bar\`, \`chart-pie\`。如果只是正文中含有零星数字，请依旧使用常规的文字卡片（cards类）以保证排版稳定性。
   - 【特性与并列】：内容包含多个特性、优势、产品点或模块拆解时，请务必以**最高的多样性**在以下所有平级的卡片模板中随机混用，不要偏好任何一种：
     - **3 项时**: 均匀穿插使用 \`cards-3\`, \`cards-3-stack\`, \`cards-3-featured\`, \`staggered-cards\`。
     - **4 项时**: 均匀穿插使用 \`cards-4\`, \`cards-4-featured\`, \`grid-2x2-featured\`。
     - **多项时 (灵活)**: 选用 \`cards-split\` (4-8项), \`list-featured\`, \`features-list-image\`。
   - 【时间与流程】：内容涉及发展历程、时间里程碑、项目分期、操作步骤时，必须选用 \`timeline\` 或 \`milestone-list\`。
   - 【对比与解说】：内容涉及两物对比、优劣势分析、或长段抽象概念图解时，优先选用 \`comparison\`, \`image-text\`, \`text-image\` 等。
   - 【人物与名言】：**只有当原文中存在明确署名的人物发言或评价时**（如"张三指出……"、"李教授评价……"），才可使用 \`quote\` / \`quote-no-avatar\`。严禁对产业验证、案例分析、应用成效等客观叙述内容使用 quote 布局——这类内容应使用 \`cards-3\` / \`text-bullets\` / \`cards-split\` 等常规布局。
5. 视觉多样性与适宜性的极致平衡：
   - **重视觉、轻纯文**：彻底摒弃全篇 "text-bullets" 轰炸的低级排版，"text-bullets" 仅在纯零散要点且真的无法归类于上述模式时作为最后兜底使用。
   - **动态平衡**：严禁连续 3 页使用同一种布局，必须通过切换（如：卡片页 -> 图表页 -> 流程页 -> 引用页）来维持观众注意力。
6. 项数与组件强绑定（必须遵守）：
   - 每种带有具体数字或特定逻辑的模板都有严格的子项数量要求。请务必核对下方 [项数路由约束]。
   - 比如 \`staggered-cards\`, \`cards-3-stack\`, \`cards-3-featured\` 必须恰好生成 3 个子项。
   - \`cards-4-featured\`, \`grid-2x2-featured\` 必须恰好生成 4 个子项。
   - 如果原文包含 5 个要点，但你想用上述 3 项或 4 项布局，你**必须**在提炼内容时将其归纳合并为对应点数；否则请更换为 \`cards-split\` 等支持多项的模板。绝对不要生成与模板限制冲突的内容数量。

[可用布局清单 - 32 种模板（section-header 已禁用）]
- 基础及通用: cover, ending, text-bullets, text-center
- 视觉与图片: image-text, text-image, image-center, image-full
- 结构化卡片: cards-2, cards-3, cards-4, cards-4-featured, grid-2x2-featured, cards-3-featured, cards-3-stack, cards-split, staggered-cards
- 逻辑与时间: comparison, timeline, milestone-list
- 意见与引用: quote, quote-no-avatar
- 团队与成员: team-members
- 数据与指标: metrics, metrics-rings
- 图表分析: chart-bar, chart-bar-compare, chart-line, chart-pie
- 增强列表: list-featured, features-list-image

${buildCapacityHint()}

[项数路由约束]
${itemCountConstraints}

[图表偏好]
若来源内容包含明确数值趋势、占比、对比，请优先考虑图表布局。${routerGuidance}${hasImages ? '\n\n[重要指令]：检测到图片池，用户上传的图片必须全量引用在大纲中并设置 imageIndex，严禁漏掉。\n' : ''}${imagesMeta}`,

    user: `请根据下列内容规划 PPT 大纲。
${preferences?.slideCount ? `页数目标约 ${preferences.slideCount} 页，可按内容质量微调。` : `【严格目标】：因为共有 ${chunks.length} 个 Chunk 数据，加上首尾的 Cover 和 Ending，你必须生成刚好 ${inferredSlideTarget} 页的幻灯片大纲，切勿压缩！`}
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
