import { DocumentChunk, LayoutType } from '../../types'
import { getItemCountConstraintLines } from '../../layout-rules'
import { buildRouterGuidance } from '../layout-router'
import { getTemplateCharLimitsRange } from '../../utils/pretext-engine'
import { isSpecTheme, getThemeLayoutDescriptions } from '../../spec-engine/theme-registry'
import '../../spec-engine/themes' // 确保主题已注册

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
    themeId?: string
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
   - 演示文稿的第一页必须使用 cover 类布局，最后一页必须使用 ending/cta 类布局。
   - 【无敌原则】：封面和封底是独立的纯仪式感展示页面，其 \`refChunks\` 数组必须为空 \`[]\`。绝对不允许它们消耗任何输入给你的 Chunk，绝对**不可**把真实的文档段落硬塞在封面或封底！
   - 原文档所有的 Chunk 内容必须从第 2 页开始分配。意味着如果你把 31 个 Chunk 按 1:1 分配为 31 页，那最终出来的幻灯片肯定是 **33 页**！
2. 页面标题忠实度（核心要求）：
    - **必须 100% 直接使用原文 Chunk 标题作为该页的 title**。严禁对正文标题进行任何概括。如果 Chunk 标题为 "核心技术 - XXX"，则该页标题即为 "核心技术 - XXX"。
    - **唯一的例外**：第一页 (cover) 的 title 必须是整个演示文稿的全局总标题；最后一页 (ending) 的 title 必须是结束语（如"感谢观看"、"携手共赢"等）。
3. 页面拆分与合并规则（强制契约）：
   - **H3 级 Chunk 绝对独立**：所有 headingLevel=3 的 Chunk **必须且只能**独立做成一页（1:1 映射），**严禁合并**。
   - **H2 级 Chunk 绝对独立**：所有 headingLevel=2 的 Chunk **必须独立成页**。
   - **禁用细碎分页**：禁止将 H4 或更深层级的内容独立成页。
   - **普通项容量控制**：默认"一个核心观点=一页"。仅在同一 H2 下、内容极少且强相关时最多合并 2 个 chunk。
4. 语义驱动布局选择（核心原则）：
   **所有布局名称必须且只能从下方 [可用布局清单] 中选择，严禁使用清单中不存在的名称。**
   匹配策略：先阅读清单中每个布局的 description 和 contentFields，再根据以下语义场景选择最匹配的布局：
   - 【数据指标】：多组量化数值/KPI → 选择描述中含 stats/metrics 的布局；趋势对比 → 图表类布局。
   - 【特性并列】：多个并列要点/特性/模块 → 选择含 cols/columns/cards 的多列布局。**同类不超过连续2页**。
   - 【时间流程】：发展历程、里程碑 → 选择描述中含 timeline 的布局。
   - 【对比分析】：两方对比、优劣分析 → 选择双栏类布局。
   - 【人物名言】：**仅当原文有明确署名人物发言时** → 选择 quote 类布局。产业验证等客观叙述**禁用** quote。
   - 【专家评价】：若 Chunk 含多位专家署名段落 → 选择 quote 类布局，每位专家对应一个 card。
   - 【团队成员】：多人姓名+职务+分工 → 选择 team 类布局。
   - 【图文混排】：内容搭配图片/架构图 → 选择 image 类布局。
   - 【章节过渡】：只有标题和简短概述 → 选择 chapter/section 类布局。
   - 【纯文字正文】：单段论述 → 选择含 text/bottom-text/blurb 的布局。含多条分点 → 选择含 bullets/list 的布局。
5. 视觉多样性：
   - 严禁连续 3 页使用同一种布局，通过切换维持观众注意力。
   - 优先使用丰富的多列/图表/图文布局，纯文字布局作为最后兜底。
6. 项数与组件强绑定（必须遵守）：
   - 阅读布局的 contentFields 描述：\`cards:3\` 表示必须恰好 3 张卡片，\`cards:4\` 表示恰好 4 张。
   - 如果原文有 5 个要点但选了 \`cards:3\` 的布局，必须归纳合并为 3 项。
   - 如果无法归纳，改选支持更多项的布局。

${(() => {
  const tid = preferences?.themeId || 'pastel-papercut'
  // 所有主题统一走 Spec 引擎的布局词汇表
  return `[可用布局清单 — 当前主题: ${tid}]
每个布局有语义名称和适用场景描述。请严格在以下列表中选择 layout 值：
${getThemeLayoutDescriptions(tid)}

[重要] 第一页必须使用含 cover 的布局，最后一页必须使用含 ending 的布局。中间页面从其余布局中根据内容语义选择。`
})()}

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
