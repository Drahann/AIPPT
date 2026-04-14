# 模板引擎重构 — 设计上下文文档

> 本文档记录了 2026-04-13 brainstorming 会话的全部上下文和决策，供后续会话参考。
> 新会话时直接 `@` 此文件即可恢复完整上下文。

## 当前分支

- **已提交分支**: `server-content-adapt` — 包含 outline.ts 标题对齐/截断 + docx-parser.ts H3分页逻辑优化
- **新工作分支**: `feature/template-engine` — 从 server-content-adapt 检出，用于模板引擎重构

## 背景问题

用户对 AIPPT 当前的 PPT 视觉效果不满意，主要表现为：
- 卡片/元素太"扁"——缺乏层次感、阴影、质感
- 排版太"安全"——所有元素规规矩矩的网格，缺乏视觉张力
- 配色太"通用"——10 个 group 只在颜色/字体层面有差异，内容页看起来几乎一样
- 封面/尾页太简单
- 整体感觉像"PPT 模板免费版"

## 已有资产盘点

### 1. Figma 原稿 (w:\3spring\figma-slides)
- 10 组、294 张 Figma slide，每张都有完整的样式文档和 React+Tailwind 参考代码
- 每张 slide 的代码是 1920×1080 绝对定位布局（Figma 直出）
- 索引：`figma-slides/url-groups-INDEX.md`

### 2. 精选布局文档 (w:\3spring\specific styles)
- 58 种精心设计的布局规范，含完整的间距、字体、装饰元素描述
- 按类型分类：基础展示类、核心叙事类、逻辑关系类、列表与数据类、图表类
- 定义了 2 套风格套系：Aetherfield（极简商业/衬线）和 Space-Blue（现代技术/无衬线）
- 清单见：`specific styles/待优化.md`

### 3. AIPPT 现有模板系统 (AIPPT/src/lib/templates/)
- 10 个 group（group-01 ~ group-10），每个只有 4 个特殊页组件：cover/section-header/quote/ending
- 这 4 种页面用 1920×1080 绝对定位（Figma 还原度高）
- **其余所有内容页共享同一套语义化布局组件**（cards-3/text-bullets/comparison 等约 30 种）
- group 之间的内容页差异只有颜色和字体——这就是"退化"的根源

### 4. 技术基础设施
- **pretext** (@chenglou/pretext)：CJK 排版引擎，已集成，可在固定宽度框内可靠地排版文字
- **DOM 快照导出**：`layout-snapshot.ts` 遍历 DOM 采集 computed style → `universal-exporter.ts` 用 PptxGenJS 逐元素重建为原生 DrawingML PPTX（不是截图！）
- **主题系统**：8 个 CSS 变量主题（ocean/midnight/rose 等）+ 10 个 group 的 TemplatePack

## PPT Master 对比分析

### PPT Master 的模板理念
- 模板只定义 4-5 个 SVG "装饰框架"（页头/页脚/品牌色条），内容区域 `{{CONTENT_AREA}}` 留白
- AI（Executor）在内容区域自由画 SVG —— 这是它好看的核心原因
- 最终 SVG → DrawingML 转换为原生可编辑 PPTX

### AIPPT vs PPT Master
- AIPPT：模板定义完整布局，AI 只负责填文字 → 一致性好但视觉受限
- PPT Master：模板只定义装饰框架，AI 自由画内容 → 灵活但需要强 AI + 人在 loop
- AIPPT 的优势：全自动 API、pretext 排版、DOM 快照导出
- PPT Master 的启示：模板的价值在于"视觉一致性的装饰框架"，不在于控制内容布局

## 选定方案：方案 C — 模板规格引擎

### 核心思路
建立一个通用模板渲染引擎，每种布局不再是一个 React 组件，而是一份 **JSON 布局规格**（Layout Spec）。引擎读取 spec 后自动渲染为 1920×1080 绝对定位的 DOM。

### Layout Spec JSON 格式（草案）
```typescript
interface LayoutSpec {
  id: string              // 如 "left-text-right-chart"
  group: string           // 如 "aetherfield"
  canvas: {
    w: number             // 1920
    h: number             // 1080
    bg: string            // 背景色或渐变
  }
  decorations: Array<{    // 装饰元素（不随内容变化）
    type: "rect" | "line" | "ellipse" | "svg" | "gradient"
    x: number; y: number; w: number; h: number
    fill?: string; stroke?: string; opacity?: number
    svgPath?: string      // 自定义 SVG 装饰
  }>
  slots: Array<{          // 内容槽位（由 AI 内容填充）
    id: string            // 如 "title", "body", "card-1", "chart"
    x: number; y: number; w: number; h: number
    type: "text" | "image" | "chart" | "icon" | "metric"
    font?: "heading" | "body" | "accent"
    size?: number         // 字号
    color?: string
    align?: string
    bold?: boolean
  }>
}
```

### 三步实施计划
1. **设计 Layout Spec JSON 格式** — 定义 slot 系统（位置、字号、装饰元素的描述格式）
2. **构建通用渲染引擎** — 一个 React 组件，读取 JSON spec → 渲染 1920×1080 绝对定位 DOM
3. **从 specific styles 提取 spec** — 把现有的 58 种设计文档转换为 JSON spec

### 关键约束
- DOM 快照 → PPTX 导出链路不能动（引擎输出标准 DOM 即可）
- pretext 在 slot 内负责文字 fit
- 现有的 SlideContent JSON 结构（title/cards/bullets/metrics 等）作为数据源

## 相关文件路径

| 文件 | 作用 |
|------|------|
| `AIPPT/src/lib/templates/shared/component-map.tsx` | 当前 Figma 组件映射（只映射 4 种特殊页） |
| `AIPPT/src/lib/templates/group-*/meta.ts` | 每个 group 的配色/字体/装饰定义 |
| `AIPPT/src/lib/themes/presets.ts` | 8 个 CSS 主题变量 |
| `AIPPT/src/lib/utils/layout-snapshot.ts` | DOM 快照采集（导出关键链路） |
| `AIPPT/src/lib/export/universal-exporter.ts` | PptxGenJS 导出引擎（当前生效的导出器） |
| `AIPPT/src/lib/export/pptx-exporter.ts` | 已弃用的导出器 |
| `AIPPT/src/lib/layout-specs.ts` | 当前的布局间距规格 |
| `AIPPT/src/components/slides/SlideRenderer.tsx` | 当前的 slide 渲染入口 |
| `AIPPT/src/components/export/HiddenRenderEngine.tsx` | 导出时的隐藏渲染容器 |
| `specific styles/待优化.md` | 58 种布局的完整清单 |
| `specific styles/风格套系定义.md` | 2 套风格套系的定义 |
| `figma-slides/url-groups-INDEX.md` | 294 张 Figma slide 的索引 |
| `ppt-master/skills/ppt-master/SKILL.md` | PPT Master 的核心流程 |
| `ppt-master/docs/zh/technical-design.md` | PPT Master 技术架构 |
