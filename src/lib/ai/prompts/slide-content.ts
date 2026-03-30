import { SlideOutline, DocumentChunk } from '../../types'
import { getItemCountConstraintLines } from '../../layout-rules'

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
    { "type": "bullet", "items": ["要点1", "要点2", "要点3", "要点4", "要点5", "要点6"] }
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
    { "heading": "卡片标题1", "body": "- 核心要点A\\n- 核心要点B\\n- 相关补充详述" },
    { "heading": "卡片标题2", "body": "- 核心要点C\\n- 核心要点D\\n- 相关补充详述" }
  ]
}`,
  'cards-3': `{
  "layout": "cards-3",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "icon": "bar-chart", "heading": "卡片标题1", "body": "卡片说明1" },
    { "icon": "globe", "heading": "卡片标题2", "body": "卡片说明2" },
    { "icon": "code", "heading": "卡片标题3", "body": "卡片说明3" }
  ]
}`,
  'cards-4': `{
  "layout": "cards-4",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "icon": "terminal", "heading": "卡片标题1", "body": "卡片说明1" },
    { "icon": "settings", "heading": "卡片标题2", "body": "卡片说明2" },
    { "icon": "search", "heading": "卡片标题3", "body": "卡片说明3" },
    { "icon": "money", "heading": "卡片标题4", "body": "卡片说明4" }
  ]
}`,
comparison: `{
  "layout": "comparison",
  "title": "与当前页面语义一致的标题",
  "subtitle": "对比场景说明",
  "left": {
    "heading": "正向侧标题",
    "items": ["共同点", "!关键优势", "说明3"],
    "tone": "positive"
  },
  "right": {
    "heading": "反向侧标题",
    "items": ["共同点", "!关键挑战", "说明3"],
    "tone": "negative"
  }
}`,
  timeline: `{
  "layout": "timeline",
  "title": "与当前页面语义一致的标题",
  "events": [
    { "date": "2025 Q1", "title": "阶段1", "description": "阶段说明1" },
    { "date": "2025 Q2", "title": "阶段2", "description": "阶段说明2" },
    { "date": "2025 Q3", "title": "阶段3", "description": "阶段说明3" }
  ]
}`,
  'milestone-list': `{
  "layout": "milestone-list",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "events": [
    { "date": "2022", "title": "成果1", "description": "成果说明1" },
    { "date": "2023", "title": "成果2", "description": "成果说明2" },
    { "date": "2024", "title": "成果3", "description": "成果说明3" },
    { "date": "2025", "title": "成果4", "description": "成果说明4" }
  ]
}`,
  metrics: `{
  "layout": "metrics",
  "title": "与当前页面语义一致的标题",
  "subtitle": "左侧概述",
  "metrics": [
    { "value": "82%", "label": "指标1", "icon": "bar-chart" },
    { "value": "120+", "label": "指标2", "icon": "target" },
    { "value": "3.2x", "label": "指标3", "icon": "star" }
  ]
}`,
  'metrics-rings': `{
  "layout": "metrics-rings",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "metrics": [
    { "value": "75%", "label": "指标1", "icon": "target" },
    { "value": "62%", "label": "指标2", "icon": "star" },
    { "value": "81%", "label": "指标3", "icon": "trending-up" }
  ]
}`,
  quote: `{
  "layout": "quote",
  "title": "与当前页面语义一致的标题",
  "cards": [
    { "heading": "引用人1 - 身份", "body": "引用内容1" },
    { "heading": "引用人2 - 身份", "body": "引用内容2" },
    { "heading": "引用人3 - 身份", "body": "引用内容3" }
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
    { "type": "paragraph", "text": "左侧对图表的详细描述性文字或一段核心分析结论" }
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
  "body": [
    { "type": "paragraph", "text": "对类别A的数据意义与影响进行的详细解释文字" },
    { "type": "paragraph", "text": "对类别B的差异化分析结论" },
    { "type": "paragraph", "text": "对类别C的市场或业务洞察" }
  ],
  "chart": {
    "type": "pie",
    "title": "占比图标题",
    "categories": ["类别A", "类别B", "类别C"],
    "series": [{ "name": "占比", "values": [40, 35, 25] }]
  }
}`,
  'list-featured': `{
  "layout": "list-featured",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "icon": "trending-up", "heading": "观点1", "body": "观点说明1" },
    { "icon": "shield", "heading": "观点2", "body": "观点说明2" },
    { "icon": "zap", "heading": "观点3", "body": "观点说明3" },
    { "icon": "star", "heading": "观点4", "body": "观点说明4" }
  ]
}`,
  'cards-split': `{
  "layout": "cards-split",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "heading": "亮点1", "body": "亮点说明1", "image": { "url": "https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&q=80&w=1400" } },
    { "heading": "亮点2", "body": "亮点说明2", "image": { "url": "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=1400" } },
    { "heading": "亮点3", "body": "亮点说明3", "image": { "url": "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80&w=1400" } },
    { "heading": "亮点4", "body": "亮点说明4", "image": { "url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400" } }
  ]
}`,
  'features-list-image': `{
  "layout": "features-list-image",
  "title": "与当前页面语义一致的标题",
  "subtitle": "可选副标题",
  "cards": [
    { "heading": "功能1", "body": "功能说明1", "image": { "prompt": "English prompt for feature 1", "alt": "图片1" } },
    { "heading": "功能2", "body": "功能说明2", "image": { "prompt": "English prompt for feature 2", "alt": "图片2" } },
    { "heading": "功能3", "body": "功能说明3", "image": { "prompt": "English prompt for feature 3", "alt": "图片3" } }
  ]
}`,
  'staggered-cards': `{
  "layout": "staggered-cards",
  "title": "与当前页面语义一致的标题",
  "cards": [
    { "icon": "target", "heading": "要点1", "body": "要点说明1" },
    { "icon": "users", "heading": "要点2", "body": "要点说明2" },
    { "icon": "settings", "heading": "要点3", "body": "要点说明3" }
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

  return {
    system: `你是专业的演示文稿文案生成助手，请仅输出 JSON。
[硬性规则]
1. 只输出 JSON，不要输出解释。
2. 严格遵循给定 schema。
3. 所有 JSON key 与字符串都必须使用双引号。

[标题规则]
1. 页面标题默认继承 outline.title，不要改成“核心要点”“三项能力”“关键观点”“引用观点”“解决方案覆盖”等通用标题。
2. 如果 outline.title 已经明确，就直接沿用。
3. subtitle 仅在当前页确有必要时填写，否则可留空。

[语言规则]
1. 可见文案（title / subtitle / body / cards / events / metrics / chart 文本）统一为简体中文。
2. 不要中英混写，不要输出乱码字符。
3. image.prompt 必须是英文且具体；image.alt 保持中文。

[内容规则]
1. 页面可见文案必须来自当前 outline + refChunks 语义。
2. 不允许复用模板示例标题或模板样例正文。
3. 若参考内容不足，可以补充概括，但不得写成泛化空话。
4. text-bullets 优先 6-8 条。
5. 卡片类文字规则：
   - cards-2: 必须提供详尽的信息量（建议 2-4 个分点陈述），总字数控制在 80-150 字以内，避免溢出。
   - team-members: 严格保持 1 句极其精炼的角色描述（20字以内），严禁使用分点。
   - 其他卡片 (cards-3/4/split等): 严格保持 1-2 句极其精炼的短句，严禁使用分点或换行。
6. image-text / text-image: 文字内容严禁超过 60 字，若原文较长，必须进行精简总结后再填入。
7. comparison 布局中关键差异项前缀 "!"。
8. image-center 必须提供 body，不要留空。
9. metrics / metrics-rings: "value" 字段严禁出现纯中文字词（如“无损化”“数字化”），必须包含数字（阿拉伯数字）、百分号（%）、加号（+）、倍数（x）或【数字+单位】（如 "100+家", "50人", "1.2亿"）。若参考文本无具体数字，请根据语境合理估算或使用范围。

[字段形状规则]
1. cards-* / list-featured / quote / quote-no-avatar / staggered-cards / features-list-image / team-members 必须输出 "cards"。
2. timeline / milestone-list 必须输出 "events"。
3. metrics / metrics-rings 必须输出 "metrics"。
4. image-text / text-image / image-center / text-bullets / text-center 必须输出 "body"。
5. comparison 必须输出 "left" 和 "right"。
6. chart-* 必须输出 "chart"。

[项数约束]
${itemCountConstraints}

[图表规则]
若参考文本含真实数字，优先保留原始数值。`,

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
