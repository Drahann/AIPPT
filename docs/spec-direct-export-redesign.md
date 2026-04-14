# AIPPT 重构方案

> **目标**：重构渲染 + 导出 + 模板体系，使 AIPPT 生成的 PPTX 完美还原 Figma 设计，文字可编辑。
>
> **日期**：2026-04-13 | **状态**：待实施

---

## 1. 问题诊断

### 1.1 导出链路（保留）

```
LayoutSpec → SpecRenderer (React DOM) → HiddenRenderEngine (离屏)
→ layout-snapshot.ts (采样) → universal-exporter.ts (pptxgenjs) → .pptx
```

快照方法本身没问题——旧模板导出效果很好。

### 1.2 新 Spec 模板导出崩溃的 4 个根因

| # | 问题 | 根因 | 修复方向 |
|---|------|------|---------|
| 1 | 文字重叠 | Slot 的父子 div 都有 `innerText`，被快照同时捕获 | SlotRenderer 扁平化为 `<h1>/<p>` |
| 2 | 背景丢失 | 纸纹 `left:-38px` 被过滤；localhost URL 解析失败 | 纸纹改 CSS background；修路径解析 |
| 3 | SVG 颜色丢失 | `var(--fill-0)` 在序列化时无法解析 | 预替换 CSS 变量 |
| 4 | 字体覆盖 | `mapFontFamily()` 硬编码 STSong/SimHei | 改为透传原始字体 |

### 1.3 现有 LayoutSpec 与 Figma 设计不符

现有 pastel-papercut (35个) 和 curve-study (31个) 的 LayoutSpec 是人工估算的，多个布局与 Figma 原始设计严重偏差。

**案例**：`pp-timeline-large` — Figma 是横向交错 5 节点时间轴+连接线，LayoutSpec 简化成了 4 行竖排文字。

**结论**：所有 66 个 LayoutSpec 需要基于 Figma 精确数据完全重写。

---

## 2. 架构设计

### 2.1 三层渲染模型

```
┌──────────────────────────────────────────┐
│  L2: 内容层 — 语义标签 h1/h2/p           │  ← 快照友好
├──────────────────────────────────────────┤
│  L1: 装饰层 — SVG/纹理 + data-decoration │  ← 快照特殊处理
├──────────────────────────────────────────┤
│  L0: 背景层 — CSS background             │  ← getComputedStyle 直接获取
└──────────────────────────────────────────┘
```

### 2.2 模板体系

```
┌─────────────────────────────────────────────────────┐
│  Spec 主题 (pastel-papercut, curve-study, ...)      │
│  → 每个布局有独立设计、字体、装饰、精确坐标          │
├─────────────────────────────────────────────────────┤
│  公共模板库 (themeId='common')                       │
│  → 主题缺少的布局自动 fallback                       │
│  → 颜色/字体从当前 Spec 主题的 defaults 继承         │
│  → 无装饰，简洁排版                                  │
└─────────────────────────────────────────────────────┘

旧 10 个主题 (group-01~10) → 全部废除
旧 26 个 React 组件 → 全部删除
SlideRenderer → 统一为 SpecRenderer 一条路径
```

---

## 3. 代码修复清单（6 个文件）

### 3.1 SlotRenderer.tsx — 文字层扁平化

- 标题 → `<h1>`/`<h2>`，正文 → `<p>`（不再嵌套 div）
- 文字叶子元素加 `data-slot-id="title"` 等标记
- 容器加 `data-slot-container="true"`，快照跳过容器

### 3.2 DecorationRenderer.tsx — 装饰层标记

- 纸纹改为 CSS `background-image`（不再用 `<img>` + 负坐标）
- 所有装饰元素加 `data-decoration="true"`
- SVG 装饰保留 `<img>` 但标记为装饰

### 3.3 SpecRenderer.tsx — Canvas 背景整合

- 纸纹纹理从 `decorations[]` 移入 canvas 的 `background-image`
- 在 canvas 容器定义 CSS 变量供子元素继承

### 3.4 layout-snapshot.ts — 快照增强

- 跳过 `[data-slot-container]`（只捕获叶子文字元素）
- 保留 `[data-decoration]` 元素的负坐标
- SVG 序列化时预替换 `var()` CSS 变量

### 3.5 universal-exporter.ts — 导出修复

- `mapFontFamily()` 透传原始字体，不硬编码
- 取消 `rawX < -5` 负坐标过滤（或仅过滤非装饰元素）
- `resolveImageForPptx()` 改进 localhost public/ 路径匹配
- 处理装饰元素的 `backgroundImage` URL

### 3.6 HiddenRenderEngine.tsx — 离屏渲染修复

- 确保 CSS 变量正确注入
- 图片加载完成后再进行快照采集

---

## 4. 公共模板库 + Fallback 机制

### 4.1 公共模板库概念

注册为 `themeId='common'`，当主题缺少某种布局时自动 fallback。

```
AI 选了 'chart-pie' → pastel-papercut 没定义
→ fallback 到公共模板库的 'chart-pie'
→ 颜色/字体自动继承 pastel-papercut 的 defaults
```

### 4.2 颜色策略：Token 引用

**公共模板不写死颜色**，使用 `$theme.xxx` 占位符，运行时替换为当前主题的 `defaults`：

```typescript
const commonCover: LayoutSpec = {
  canvas: { background: '$theme.colorBackground' },
  slots: [
    { id: 'title', color: '$theme.colorText', fontFamily: '$theme.fontHeading', ... },
  ]
}
// pastel-papercut 下: colorText→'#000', fontHeading→'Shippori Mincho'
// curve-study 下: colorText→'#000', fontHeading→'Bricolage Grotesque'
```

### 4.3 Fallback 优先级算法

```typescript
function resolveLayout(themeId: string, requestedLayout: string): LayoutSpec {
  // ① 主题精确匹配
  const exact = getLayoutSpec(themeId, requestedLayout)
  if (exact) return exact

  // ② 主题语义匹配（按 contentFields 能力）
  const semantic = findCompatibleLayout(themeId, inferCapability(requestedLayout))
  if (semantic) return semantic

  // ③ 公共库精确匹配（注入当前主题配色）
  const commonExact = getLayoutSpec('common', requestedLayout)
  if (commonExact) return applyThemeTokens(commonExact, themeId)

  // ④ 公共库语义匹配（注入当前主题配色）
  const commonSemantic = findCompatibleLayout('common', inferCapability(requestedLayout))
  if (commonSemantic) return applyThemeTokens(commonSemantic, themeId)

  // ⑤ 终极兜底
  return applyThemeTokens(getLayoutSpec('common', 'text-center')!, themeId)
}
```

### 4.4 公共模板库内容

| 布局 | 用途 | 优先级 |
|------|------|--------|
| `text-bullets` | 多要点列表 | 高 — 通用兜底 |
| `text-center` | 居中文本 | 高 — 通用兜底 |
| `cover` | 封面 | 高 |
| `ending` | 结尾 | 中 |
| `chart-bar` | 柱状图 | 高 — 图表常见 |
| `chart-line` | 折线图 | 高 |
| `chart-pie` | 饼图 | 高 |
| `chart-bar-compare` | 对比柱状图 | 中 |

---

## 5. 旧代码废除清单

### 5.1 旧 10 个主题（全部废除）

旧主题（group-01~10）的 32 种布局中 28 种共用旧 React 组件，仅 cover/ending/quote/section-header 有独立设计。配色不保留——公共模板从 Spec 主题继承。

删除：
```
src/lib/templates/group-01/ ~ group-10/    — 10 个主题目录
src/lib/templates/casual-pro/               — 过渡主题
src/lib/templates/pastel-papercut/meta.ts
src/lib/templates/curve-study/meta.ts
src/lib/templates/registry.ts
src/lib/templates/index.ts                  — TemplatePack 类型
src/lib/templates/shared/component-map.ts
```

### 5.2 旧 React 布局组件（全部废除）

```
src/components/slides/layouts/              — 26 个文件，支持 32 种布局
```

### 5.3 SlideRenderer 统一

删除 3 条渲染路径中的 2 条：
- ❌ Figma 组件路径 (`getFigmaComponent`)
- ❌ 旧语义组件路径 (`switch(slide.layout)`)
- ✅ 仅保留 SpecRenderer 路径

影响范围：`SlideRenderer.tsx`、主题选择器 UI、`store.ts`、`outline.ts`

---

## 6. 实施阶段

```
并行执行:
  Track A: Phase 1 (写 Skill) → Phase 3 (新对话重写 LayoutSpec)
  Track B: Phase 2 (基础设施修复)
合并后:
  Phase 4 (公共模板库) → Phase 5 (旧代码清理)
```

### Phase 1: 编写 theme-onboarding Skill ★ 优先

**路径**：`w:\3spring\AIPPT\.gemini\skills\theme-onboarding\SKILL.md`（项目级 Skill）

写完后用户即可新开对话引用此 Skill，与 Phase 2 并行推进 LayoutSpec 重写。

#### Skill 核心内容

```
1. 输入
   - Figma 节点代码（PPTtemplate/groupXX/code/Node_*.tsx）
   - 对应截图（PPTtemplate/groupXX/screenshots/Screenshot_*.png）
   - 素材文件夹（PPTtemplate/groupXX/assets/）
   - 目标主题前缀（如 'pp-', 'cs-'）

2. 单个布局复刻流程
   a. 查看截图 → 判断布局类型标签（见下方规则）
   b. 查看节点代码 → 提取精确坐标 (x, y, w, h)
   c. 拆分为 canvas + decorations + slots
   d. 提取字体 (family, size, weight, lineHeight, letterSpacing)
   e. 识别装饰元素 → 关联已下载的 SVG/PNG 文件名
   f. 生成 LayoutSpec TypeScript 代码

3. 精度要求
   - 坐标误差 ±5px
   - 字号与 Figma 完全一致
   - SVG 位置/尺寸/旋转角度精确

4. 特殊处理
   - 复杂布局（如交错时间线）需要额外装饰（连接线 SVG）
   - 纸纹/纹理背景归入 canvas.backgroundImage
   - CSS 变量颜色记录 fallback 值
```

#### 布局类型标签识别规则（写入 Skill）

判断一个 Figma 页面属于哪种布局类型，核心依据是**内容的语义结构**：

| 标签 | 判断信号 | slot 命名 |
|------|---------|----------|
| `timeline` | 有日期/年份字段 + 条目间有连接线/时间轴 | `event-N-date` + `event-N-title` |
| `cards-N` | N 个平等并列项，无时序，无连接线 | `card-N-heading` + `card-N-body` |
| `metrics` | 主视觉是大号数字/百分比 + 小标签 | `metric-N-value` + `metric-N-label` |
| `comparison` | 左右两侧对称结构 | `left-heading/body` + `right-heading/body` |
| `quote` | 大号斜体引文 + 署名 | `title` (引文) + `body` (署名) |
| `image-text` | 一边大图一边文字 | `image` + `title` + `body` |
| `cover` | 全页只有标题+副标题 | `title` + `subtitle` |
| `ending` | 结尾感谢页 | `title` + `body` |
| `text` | 标题+正文段落，无结构化子项 | `title` + `body` |

**判断流程**：
```
1. 看截图整体视觉 → 初步分类
2. 看节点代码中的占位文字：
   - "2020/2021" 或 "Milestone" → timeline
   - "001/002/003" 或 "Feature" → cards
   - "85%" 或 "$1.2M" → metrics
3. 看有无 SVG 连接线元素 → 有线 = timeline
4. 结论写入 contentFields 和 slot 命名
```

contentFields 就是标签本身，它决定了 AI 如何填充数据和 fallback 如何匹配。

### Phase 2: 基础设施修复（DOM + 快照 + 导出）⟵ 可与 Phase 3 并行

修改 6 个文件（见第 3 节），让 SpecRenderer 的 DOM 对快照友好。

1. `SlotRenderer.tsx` — 文字层扁平化
2. `DecorationRenderer.tsx` — 装饰标记 + 纸纹背景化
3. `SpecRenderer.tsx` — canvas 背景整合
4. `layout-snapshot.ts` — 快照增强
5. `HiddenRenderEngine.tsx` — CSS 变量注入
6. `universal-exporter.ts` — 字体/路径/坐标修复

### Phase 3: 重写主题 LayoutSpec（新对话执行）⟵ 可与 Phase 2 并行

用户新开对话，引用 `@[AIPPT/.gemini/skills/theme-onboarding/SKILL.md]`，按 Skill 指导复刻 Figma 页面：

| 主题 | 节点数 | 资源路径 |
|------|--------|---------|
| pastel-papercut | 35 | `PPTtemplate/group02/` |
| curve-study | 31 | `PPTtemplate/group03/` |

输出：精确的 `all-layouts.ts`，覆盖现有的估算版本。

### Phase 4: 公共模板库构建

```
src/lib/spec-engine/themes/common/
├── index.ts           — 注册 themeId='common'
└── all-layouts.ts     — 公共布局（使用 $theme.xxx token）
```

1. 实现 `$theme.xxx` token 替换机制（`applyThemeTokens()`）
2. 实现 `resolveLayout()` 优先级算法
3. 编写公共布局 LayoutSpec（见 4.4 节）
4. 集成到 SlideRenderer

### Phase 5: 旧代码清理

1. 删除 `src/lib/templates/group-01/` ~ `group-10/` + `casual-pro/`
2. 删除 `src/lib/templates/registry.ts`、`index.ts`、`shared/`
3. 删除 `src/components/slides/layouts/` 下 26 个旧组件
4. SlideRenderer 合并为 SpecRenderer 单一路径
5. 更新主题选择器 UI — 只展示 Spec 主题
6. 更新 `outline.ts` — 删除旧主题布局清单分支

> **验证**：所有 Phase 完成后由用户统一验证。验证工具：`pptx2png.py` + Figma 截图对比。

---

## 7. 技术约束

### 7.1 坐标系

- **LayoutSpec**: 1920×1080 px
- **前端预览**: `transform: scale(0.5)` → 960×540 视觉
- **快照**: `getBoundingClientRect()` 返回 960px → `logicalWidth=1920`
- **导出**: `FONT_SCALE = 960/1920 = 0.5`
- **PPTX**: `LAYOUT_WIDE` = 10″ × 7.5″

### 7.2 字体策略

```typescript
function mapFontFamily(fontStr: string, role: 'heading' | 'body'): string {
  if (!fontStr) return role === 'heading' ? 'STSong' : 'SimHei'
  const cleaned = fontStr.split(',')[0].replace(/['"]/g, '').trim()
  if (cleaned && cleaned !== 'sans-serif' && cleaned !== 'serif') return cleaned
  return role === 'heading' ? 'STSong' : 'SimHei'
}
```

### 7.3 SVG CSS 变量

两处处理：
1. `layout-snapshot.ts` SVG 序列化时 `getPropertyValue()` 解析
2. `SpecRenderer.tsx` canvas 容器定义 CSS 变量供继承

### 7.4 纸纹背景

改前（装饰元素）：
```typescript
decorations: [{ type: 'image', x: -38, y: -49, w: 1995, h: 1409, src: '35e56626...png' }]
```
改后（canvas 背景）：
```typescript
canvas: { background: '#faf3e8', backgroundImage: '35e56626...png', backgroundOpacity: 0.4 }
```

---

## 8. 新增主题工作流（future）

今后引入新 Figma 主题的标准流程：

```
1. 在 Figma 上选中一套 PPT 模板
2. 用 Figma MCP 批量提取所有页面的设计上下文
3. 下载 SVG/PNG 素材 → PPTtemplate/groupXX/assets/
4. 部署 subagent + theme-onboarding Skill 自动生成 LayoutSpec
5. 部署素材到 public/themes/xxx/
6. 注册 ThemeSpec → 完成
```

Skill 位置：`w:\3spring\AIPPT\.gemini\skills\theme-onboarding\SKILL.md`

---

## 9. 关键文件索引

| 用途 | 路径 |
|------|------|
| Spec 渲染器 | `src/lib/spec-engine/SpecRenderer.tsx` |
| 装饰渲染器 | `src/lib/spec-engine/DecorationRenderer.tsx` |
| Slot 渲染器 | `src/lib/spec-engine/SlotRenderer.tsx` |
| 快照采集 | `src/lib/utils/layout-snapshot.ts` |
| 导出器 | `src/lib/export/universal-exporter.ts` |
| 离屏渲染 | `src/components/export/HiddenRenderEngine.tsx` |
| 主题注册表 | `src/lib/spec-engine/theme-registry.ts` |
| pastel-papercut 布局 | `src/lib/spec-engine/themes/pastel-papercut/` |
| curve-study 布局 | `src/lib/spec-engine/themes/curve-study/` |
| pastel-papercut 素材 | `public/themes/pastel-papercut/` (56文件) |
| Figma 截图(group02) | `PPTtemplate/group02/screenshots/` (35张) |
| Figma 节点代码(group02) | `PPTtemplate/group02/code/` (35个) |
| Figma 截图(group03) | `PPTtemplate/group03/screenshots/` (31张) |
| Figma 节点代码(group03) | `PPTtemplate/group03/code/` (31个) |
| PPTX→PNG 工具 | `scripts/pptx2png.py` |
| Pretext 引擎 | `src/lib/utils/pretext-engine.ts` |
| SlideRenderer 入口 | `src/components/slides/SlideRenderer.tsx` |
| 导出 API | `src/app/api/export/route.ts` |
| AI Outline Prompt | `src/lib/ai/prompts/outline.ts` |
| theme-onboarding Skill | `AIPPT/.gemini/skills/theme-onboarding/SKILL.md` |
