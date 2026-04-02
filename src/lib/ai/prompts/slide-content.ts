import { SlideOutline, DocumentChunk, LayoutType } from '../../types'
import { getItemCountConstraintLines } from '../../layout-rules'
import { getTemplateCharLimitsRange } from '../../utils/pretext-engine'

const layoutSchemas: Record<string, string> = {
  cover: `{
  "layout": "cover",
  "title": "与页面主题一致的封面标题",
  "subtitle": "封面副标题"
}`,
  'section-header': `{
  "layout": "section-header",
  "title": "章节标题",
  "subtitle": "章节说明"
}`,
  'text-bullets': `{
  "layout": "text-bullets",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "body": [
    { "type": "bullet", "items": ["核心技术突破或研究方法论述", "量化指标与实验验证结论", "与现有同类方案的差异化优势", "实际应用场景与落地成效", "未来拓展方向或改进路径", "团队能力或资源支撑说明"] }
  ]
}`,
  'text-center': `{
  "layout": "text-center",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "body": [
    { "type": "paragraph", "text": "一段适中的概括性文字正文，不仅要提供充足的信息量，也要注意精炼，避免过于冗长。" }
  ]
}`,
  'image-text': `{
  "layout": "image-text",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "body": [
    { "type": "paragraph", "text": "一段总结性的概括文字，注意保持精炼，避免文字过长破坏整体排版的留白美感。" }
  ],
  "image": {
    "prompt": "English image prompt, specific and scene-based",
    "alt": "图片中文说明"
  }
}`,
  'text-image': `{
  "layout": "text-image",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "body": [
    { "type": "paragraph", "text": "一段总结性的概括文字，注意保持精炼，避免文字过长破坏整体排版的留白美感。" }
  ],
  "image": {
    "prompt": "English image prompt, specific and scene-based",
    "alt": "图片中文说明"
  }
}`,
  'image-center': `{
  "layout": "image-center",
  "title": "与当前页面语义一致的标题",
  "body": [
    { "type": "paragraph", "text": "图片下方的简短说明，不要留空。" }
  ],
  "image": {
    "prompt": "English prompt for architecture or concept diagram",
    "alt": "图片中文说明"
  }
}`,
  'image-full': `{
  "layout": "image-full",
  "title": "与当前页面语义一致的标题",
  "subtitle": "叠加在图片上的文案",
  "image": {
    "prompt": "English prompt for full-screen background image",
    "alt": "图片中文说明"
  }
}`,
  'cards-2': `{
  "layout": "cards-2",
  "title": "与页面主题一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "heading": "维度一（如技术层面/理论贡献）", "body": "- 核心方法或架构创新点\\n- 核心要点B\\n- 相关补充详述" },
    { "heading": "维度二（如应用层面/产业价值）", "body": "- 落地场景与部署实践\\n- 核心要点D\\n- 相关补充详述" }
  ]
}`,
  'cards-3': `{
  "layout": "cards-3",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "icon": "bar-chart", "heading": "研究方向或模块名称", "body": "- 核心技术原理与创新点\\n- 衍生影响或价值论述" },
    { "icon": "globe", "heading": "应用场景或验证领域", "body": "- 实际部署环境与测试条件\\n- 相关环境或合规说明" },
    { "icon": "code", "heading": "系统架构或算法框架", "body": "- 技术方案与实现路径\\n- 提升的性能或吞吐量等参数" }
  ]
}`,
  'cards-4': `{
  "layout": "cards-4",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "icon": "terminal", "heading": "技术能力或产品特性", "body": "- 核心功能与技术实现\\n- 补充说明文本段落" },
    { "icon": "settings", "heading": "工程实践或质量保障", "body": "- 方法论或流程创新\\n- 补充说明文本段落" },
    { "icon": "search", "heading": "市场调研或需求洞察", "body": "- 用户痛点与需求分析\\n- 补充说明文本段落" },
    { "icon": "money", "heading": "商业价值或社会效益", "body": "- 经济效益预测或成本分析\\n- 补充说明文本段落" }
  ]
}`,
  comparison: `{
  "layout": "comparison",
  "title": "与当前页面语义一致的标题",
  "subtitle": "两种方案或阶段的核心差异分析",
  "left": {
    "heading": "本方案/改进后",
    "items": ["技术共性基础", "!核心创新优势（量化数据）", "落地成效或验证结论"],
    "tone": "positive"
  },
  "right": {
    "heading": "传统方案/改进前",
    "items": ["技术共性基础", "!关键瓶颈或局限性", "导致的实际问题或效率损失"],
    "tone": "negative"
  }
}`,
  timeline: `{
  "layout": "timeline",
  "title": "与当前页面语义一致的标题",
  "events": [
    { "date": "2024 Q1", "title": "技术攻关阶段", "description": "完成核心算法研发与原型系统搭建" },
    { "date": "2024 Q3", "title": "验证迭代阶段", "description": "开展行业试点并优化产品性能指标" },
    { "date": "2025 Q1", "title": "推广落地阶段", "description": "签署合作协议，启动规模化生产部署" }
  ]
}`,
  'milestone-list': `{
  "layout": "milestone-list",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "events": [
    { "date": "2022", "title": "立项与基础研究", "description": "完成课题论证和核心理论框架搭建" },
    { "date": "2023", "title": "原型开发与测试", "description": "实现原型系统并通过实验室验证" },
    { "date": "2024", "title": "产业试点应用", "description": "在合作单位完成实地部署和性能验证" },
    { "date": "2025", "title": "成果转化与推广", "description": "获得授权专利，启动商业化批量交付" }
  ]
}`,
  metrics: `{
  "layout": "metrics",
  "title": "与当前页面语义一致的标题",
  "subtitle": "对该组核心量化成果的背景说明与价值综述",
  "metrics": [
    { "value": "97.3%", "label": "核心性能指标名称（如识别准确率）", "icon": "bar-chart" },
    { "value": "120+", "label": "规模或产出类指标（如授权专利数）", "icon": "target" },
    { "value": "3.2x", "label": "对比提升类指标（如效率提升倍数）", "icon": "star" }
  ]
}`,
  'metrics-rings': `{
  "layout": "metrics-rings",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "metrics": [
    { "value": "75%", "label": "达成率或覆盖率等百分比指标", "icon": "target" },
    { "value": "62%", "label": "转化率或满意度等比率指标", "icon": "star" },
    { "value": "81%", "label": "同比增长或市场渗透率指标", "icon": "trending-up" }
  ],
  "body": [
    { "type": "paragraph", "text": "基于原文对以上指标的综合描述分析，字数需至少20字以上" }
  ]
}`,
  quote: `{
  "layout": "quote",
  "title": "与当前页面语义一致的标题",
  "cards": [
    { "heading": "原文中明确提到的人名 - 原文中的身份/职务", "body": "该人物在原文中的原话或核心观点（必须来自refChunks，严禁编造）" },
    { "heading": "原文中明确提到的人名 - 原文中的身份/职务", "body": "该人物在原文中的原话或核心观点（必须来自refChunks，严禁编造）" },
    { "heading": "原文中明确提到的人名 - 原文中的身份/职务", "body": "该人物在原文中的原话或核心观点（必须来自refChunks，严禁编造）" }
  ]
}`,
  'quote-no-avatar': `{
  "layout": "quote-no-avatar",
  "title": "与当前页面语义一致的标题",
  "cards": [
    { "heading": "引用人1 - 身份", "body": "引用内容1" },
    { "heading": "引用人2 - 身份", "body": "引用内容2" },
    { "heading": "引用人3 - 身份", "body": "引用内容3" }
  ]
}`,
  ending: `{
  "layout": "ending",
  "title": "结束页标题",
  "subtitle": "结束页副标题"
}`,
  'chart-bar': `{
  "layout": "chart-bar",
  "title": "与当前页面语义一致的标题",
  "body": [
    { "type": "paragraph", "text": "对图表数据的深入分析与解读，包含具体数据引用和趋势判断，基于数据得出的核心结论或行动建议，2-3句话" }
  ],
  "chart": {
    "type": "bar",
    "title": "柱状图标题",
    "categories": ["类别A", "类别B", "类别C", "类别D"],
    "series": [{ "name": "数据系列", "values": [10, 20, 30, 40] }]
  }
}`,
  'chart-bar-compare': `{
  "layout": "chart-bar-compare",
  "title": "与当前页面语义一致的标题",
  "body": [
    { "type": "paragraph", "text": "对图表的说明性文字（1-2段），解释对比数据的背景、关键结论和业务意义。" }
  ],
  "chart": {
    "type": "bar",
    "title": "对比图标题",
    "categories": ["指标A", "指标B", "指标C", "指标D"],
    "series": [
      { "name": "方案A", "values": [2.8, 3.2, 2.4, 3.0] },
      { "name": "方案B", "values": [3.7, 4.1, 3.6, 4.2] }
    ]
  }
}`,
  'chart-line': `{
  "layout": "chart-line",
  "title": "与当前页面语义一致的标题",
  "chart": {
    "type": "line",
    "title": "趋势图标题",
    "categories": ["Q1", "Q2", "Q3", "Q4"],
    "series": [{ "name": "数据系列", "values": [10, 20, 30, 40] }]
  }
}`,
  'chart-pie': `{
  "layout": "chart-pie",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题/图例说明",
  "body": [
    { "type": "paragraph", "text": "对图表类别A的数据意义与影响进行的详细解释文字" },
    { "type": "paragraph", "text": "对图表类别B的差异化分析结论" },
    { "type": "paragraph", "text": "对图表类别C的市场或业务洞察" },
    { "type": "paragraph", "text": "【重要】确保为图表中的每一个类别提供对应的段落解析，段落数必须与 categories 数量完全一致！" }
  ],
  "chart": {
    "type": "pie",
    "title": "占比图标题",
    "categories": ["类别A", "类别B", "类别C", "类别D"],
    "series": [{ "name": "占比", "values": [35, 30, 20, 15] }]
  }
}`,
  'list-featured': `{
  "layout": "list-featured",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "icon": "trending-up", "heading": "核心创新点或研究突破", "body": "请写出对该观点的详细阐述与深度分析，字数需至少 40 字以上以保证排版饱满度和视觉丰富性。" },
    { "icon": "shield", "heading": "可靠性保障或安全机制", "body": "请写出对该观点的详细阐述与深度分析，字数需至少 40 字以上以保证排版饱满度和视觉丰富性。" },
    { "icon": "zap", "heading": "效率提升或性能优化", "body": "请写出对该观点的详细阐述与深度分析，字数需至少 40 字以上以保证排版饱满度和视觉丰富性。" },
    { "icon": "star", "heading": "行业影响或社会价值", "body": "请写出对该观点的详细阐述与深度分析，字数需至少 40 字以上以保证排版饱满度和视觉丰富性。" }
  ]
}`,
  'cards-split': `{
  "layout": "cards-split",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "heading": "亮点1", "body": "- 核心技术或产品特性解析\\n- 该特性带来的直接用户价值或业务收益指标", "image": { "url": "https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&q=80&w=1400" } },
    { "heading": "亮点2", "body": "- 核心技术或产品特性解析\\n- 该特性带来的直接用户价值或业务收益指标", "image": { "url": "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=1400" } },
    { "heading": "亮点3", "body": "- 核心技术或产品特性解析\\n- 该特性带来的直接用户价值或业务收益指标", "image": { "url": "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80&w=1400" } },
    { "heading": "亮点4", "body": "- 核心技术或产品特性解析\\n- 该特性带来的直接用户价值或业务收益指标", "image": { "url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400" } }
  ]
}`,
  'features-list-image': `{
  "layout": "features-list-image",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "heading": "核心功能或模块名称", "body": "技术实现原理与用户端价值描述", "image": { "prompt": "English prompt for feature 1", "alt": "图片1" } },
    { "heading": "差异化能力名称", "body": "与竞品的对比优势和实测性能数据", "image": { "prompt": "English prompt for feature 2", "alt": "图片2" } },
    { "heading": "应用场景或落地案例", "body": "实际部署中的效果验证与用户反馈", "image": { "prompt": "English prompt for feature 3", "alt": "图片3" } }
  ]
}`,
  'staggered-cards': `{
  "layout": "staggered-cards",
  "title": "与当前页面语义一致的标题",
  "cards": [
    { "icon": "target", "heading": "目标定位或研究问题", "body": "- 问题定义与行业痛点分析\\n- 进一步的深度解析" },
    { "icon": "users", "heading": "团队能力或协作模式", "body": "- 核心成员专业背景与分工\\n- 进一步的深度解析" },
    { "icon": "settings", "heading": "实施方案或技术路线", "body": "- 关键技术路径与里程碑\\n- 进一步的深度解析" }
  ]
}`,
  'team-members': `{
  "layout": "team-members",
  "title": "团队架构与专家顾问",
  "subtitle": "项目名称或负责人",
  "cards": [
    { "icon": "user", "heading": "成员姓名1", "body": "成员角色/职责一句话描述" },
    { "icon": "user", "heading": "成员姓名2", "body": "成员角色/职责一句话描述" },
    { "icon": "user", "heading": "成员姓名3", "body": "成员角色/职责一句话描述" }
  ]
}`,
  'cards-4-featured': `{
  "layout": "cards-4-featured",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "body": [
    { "type": "paragraph", "text": "对核心模块的全局引导或重点背景说明" }
  ],
  "cards": [
    { "icon": "target", "heading": "卡片标题1", "body": "总结性描述或简短分点均可，控制在排版字数预算内。- 核心要点A\\n- 核心要点B" },
    { "icon": "globe", "heading": "卡片标题2", "body": "总结性描述或简短分点均可，控制在排版字数预算内。- 核心要点C\\n- 核心要点D" },
    { "icon": "shield", "heading": "卡片标题3", "body": "总结性描述或简短分点均可，控制在排版字数预算内。- 核心要点E\\n- 核心要点F" },
    { "icon": "zap", "heading": "卡片标题4", "body": "总结性描述或简短分点均可，控制在排版字数预算内。- 核心要点G\\n- 核心要点H" }
  ]
}`,
  'grid-2x2-featured': `{
  "layout": "grid-2x2-featured",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "body": [
    { "type": "paragraph", "text": "对 2x2 矩阵的全局逻辑定义或趋势总结" }
  ],
  "cards": [
    { "icon": "bar-chart", "heading": "卡片标题1", "body": "总结性描述或简短分点均可，控制在排版字数预算内。- 要点A\\n- 要点B" },
    { "icon": "code", "heading": "卡片标题2", "body": "总结性描述或简短分点均可，控制在排版字数预算内。- 要点C\\n- 要点D" },
    { "icon": "settings", "heading": "卡片标题3", "body": "总结性描述或简短分点均可，控制在排版字数预算内。- 要点E\\n- 要点F" },
    { "icon": "trending-up", "heading": "卡片标题4", "body": "总结性描述或简短分点均可，控制在排版字数预算内。- 要点G\\n- 要点H" }
  ]
}`,
  'cards-3-featured': `{
  "layout": "cards-3-featured",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "body": [
    { "type": "paragraph", "text": "针对该三个核心部分的全局总结或战略意义描述" }
  ],
  "cards": [
    { "icon": "target", "heading": "研究方向或模块名称", "body": "核心技术原理与创新方法的详细阐述", "secondary": "衍生价值、实验验证结论或跨领域影响分析" },
    { "icon": "globe", "heading": "应用场景或验证领域", "body": "实际部署环境、测试条件与量化性能数据", "secondary": "推广前景、用户反馈或同行评审引用情况" },
    { "icon": "code", "heading": "系统架构或算法框架", "body": "技术方案与实现路径的核心描述", "secondary": "对比基线的性能增益数据或行业标准对标" }
  ]
}`,
  'cards-3-stack': `{
  "layout": "cards-3-stack",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "body": [
    { "type": "paragraph", "text": "对三层层级或递进关系的全局定义" }
  ],
  "cards": [
    { "icon": "target", "heading": "目标定位或研究问题", "body": "问题定义、行业痛点与预期攻克目标的核心描述", "secondary": "进一步的技术指标论证或未来发展方向建议" },
    { "icon": "users", "heading": "团队能力或协作模式", "body": "核心成员专业背景与跨学科协作优势说明", "secondary": "资源整合策略或与外部机构合作进展" },
    { "icon": "settings", "heading": "实施方案或技术路线", "body": "关键技术路径与里程碑的详细规划", "secondary": "风险预案、质量保障措施或应急策略" }
  ]
}`,
}


/**
 * Build a human-readable char constraint block from pretext engine calculations.
 * Returns empty string for layouts where char limits don't meaningfully apply.
 */
function buildCharConstraintBlock(layout: LayoutType): string {
  const SKIP_LAYOUTS: LayoutType[] = ['cover', 'ending', 'section-header', 'chart-bar', 'chart-bar-compare', 'chart-line', 'chart-pie']
  if (SKIP_LAYOUTS.includes(layout)) return ''

  const ranges = getTemplateCharLimitsRange(layout)
  if (!ranges || Object.keys(ranges).length === 0) return ''

  const lines: string[] = [`[排版空间约束 - 由排版引擎实时计算]`, `当前模板 ${layout} 的字数预算梯度 (字数越多，字号越小):`]

  const formatRange = (range: { optimal: number; standard: number; expanded: number; max: number }) => {
    return `推荐≤${range.optimal}字, 适中≤${range.standard}字, 扩展≤${range.expanded}字, 极限≤${range.max}字`
  }

  if (ranges.title) lines.push(`- title: ${formatRange(ranges.title)}`)
  if (ranges.subtitle) lines.push(`- subtitle: ${formatRange(ranges.subtitle)}`)

  if (ranges.cardHeading) lines.push(`- 每个card.heading: ${formatRange(ranges.cardHeading)}`)
  if (ranges.cardBody) lines.push(`- 每个card.body: ${formatRange(ranges.cardBody)}`)

  if (ranges.eventTitle) lines.push(`- 每个event.title: ${formatRange(ranges.eventTitle)}`)
  if (ranges.eventDesc) lines.push(`- 每个event.description: ${formatRange(ranges.eventDesc)}`)

  if (ranges.metricValue) lines.push(`- 每个metric.value: ${formatRange(ranges.metricValue)}`)
  if (ranges.metricLabel) lines.push(`- 每个metric.label: ${formatRange(ranges.metricLabel)}`)

  if (!ranges.cardBody && !ranges.eventDesc && !ranges.metricLabel && ranges.body) {
    lines.push(`- body正文: ${formatRange(ranges.body)}`)
  }

  lines.push(`提示：在“扩展”或“极限”字数下，引擎将自动缩小字号以确保内容非溢出，请合理平衡内容深度与视觉美感。`)
  return lines.join('\n')
}

export function buildSlideContentPrompt(
  outline: SlideOutline,
  chunks: DocumentChunk[],
  options?: { language?: string }
) {
  const language = options?.language || 'zh-CN'
  const itemCountConstraints = getItemCountConstraintLines()
    .map((line) => `- ${line}`)
    .join('\n')

  const refContent = outline.refChunks
    .map((idx) => chunks.find((chunk) => chunk.order === idx))
    .filter(Boolean)
    .map((chunk) => {
      let text = chunk!.content
      if (chunk!.tables && chunk!.tables.length > 0) {
        text += `\n\n[表格数据]\n${chunk!.tables.join('\n\n')}`
      }
      return text
    })
    .join('\n\n')

  const schema = layoutSchemas[outline.layout] || layoutSchemas['text-bullets']
  const charConstraints = buildCharConstraintBlock(outline.layout)

  return {
    system: `你是专业的演示文稿文案生成助手，请仅输出 JSON。
[硬性规则]
1. 只输出 JSON，不要输出解释。
2. 严格遵循给定 schema。
3. 所有 JSON key 与字符串都必须使用双引号。

[标题规则]
1. 页面标题默认继承 outline.title，不要改成"核心要点""三项能力""关键观点""引用观点""解决方案覆盖"等通用标题。
2. 如果 outline.title 已经明确，就直接沿用。
3. subtitle 仅在当前页确有必要时填写，否则可留空。

[语言规则]
1. 可见文案（title / subtitle / body / cards / events / metrics / chart 文本）统一为简体中文。
2. 不要中英混写，不要输出乱码字符。
3. image.prompt 必须是英文且具体；image.alt 保持中文。

[内容规则]
1. 页面可见文案必须忠实于当前 outline + refChunks 的原文语义，不得遗漏原文的关键信息与重点。
2. 不允许复用模板示例标题或模板样例正文。
3. 若参考内容不足，可以补充概括，但不得写成泛化空话。
4. text-bullets 优先 6-8 条。
5. 卡片类/图文类文字规模要求：
   - 核心原则：**必须在字数预算内提供尽可能高密度的信息**。严格提取原文核心技术细节、量化增幅和底层逻辑。
   - 所有文字字段必须严格遵守下方 [排版空间约束] 的字数预算，在预算内最大化信息密度。
   - team-members: 保持 1 句精炼的角色描述（20-30字以内），严禁使用分点。
6. 重型半页图文 (image-text / text-image): 在字数预算内提供最大信息深度，分段落分层次拆解。
7. comparison 布局中关键差异项前缀 "!"。
8. image-center 必须提供 body，不要留空。
9. metrics / metrics-rings: "value" 字段严禁出现纯中文字词，必须包含数字（如 "100+", "1.2亿"）或特殊符号。

10. **严禁捏造人物**：quote / quote-no-avatar 布局中 cards.heading 的引用人姓名和身份必须完全来自 refChunks 原文，绝不允许凭空编造人名、头衔或引用内容。如原文无明确人物引语，应改用 cards-3 / text-bullets 等布局。\r
\r
11. **分点符号规范**：当 cards.body 或其他文本字段需要分点列举时，必须使用 "• "（Unicode 圆点 U+2022 + 空格）作为前缀，严禁使用 "- "（短横线）。短横线会与正文中的连接符混淆，导致导出格式错误。

12. **忠实原文关键信息**：refChunks 中的具体数据（如百分比、金额、指标）、专有名词（如机构名、产品名、技术名）、量化成果（如"缩短40%""提升300%"）必须原样保留在文案中，严禁用"显著提升""大幅改善"等模糊表述替代。每页文案应覆盖 refChunks 对应段落的全部核心论点，不得丢弃次要但有价值的信息。

[字段形状规则]
1. cards-* / list-featured / quote / quote-no-avatar / staggered-cards / features-list-image / team-members 必须输出 "cards"。
2. timeline / milestone-list 必须输出 "events"。
3. metrics / metrics-rings 必须输出 "metrics"。
4. image-text / text-image / image-center / text-bullets / text-center 必须输出 "body"。
5. comparison 必须输出 "left" 和 "right"，且 "subtitle" 为必填项（不得为空字符串），用于概括对比的核心维度或结论。
6. chart-* 必须输出 "chart"。

[项数约束]
${itemCountConstraints}

[图表规则]
若参考文本含真实数字，优先保留原始数值。

${charConstraints}`,

    user: `页面元信息：
- 固定标题: ${outline.title}
- 固定副标题: ${outline.subtitle || ''}
- layout: ${outline.layout}
- requirement: ${outline.contentHint}
- imageIndex: ${outline.imageIndex !== undefined ? outline.imageIndex : '未分配'} (若已分配，请优先确保文案能与其描述贴合)
${outline.imageHint ? `- image hint: ${outline.imageHint}` : ''}
- language: ${language}

参考内容：
${refContent || '（无参考内容，请根据标题和 requirement 生成，但必须保持语义贴合。）'}

请按以下 JSON schema 输出：
${schema}`,
  }
}
