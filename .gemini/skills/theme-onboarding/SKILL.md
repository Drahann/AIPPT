---
name: theme-onboarding
description: 基于 Figma 节点代码和截图精确复刻 LayoutSpec。用于将 PPTtemplate/groupXX 中的设计批量转换为 spec-engine 格式的 all-layouts.ts 文件。
---

# Theme Onboarding — Figma → LayoutSpec 精确复刻

## 概述

本 Skill 指导你将 Figma 提取的节点代码（React+Tailwind）精确转换为 AIPPT spec-engine 的 LayoutSpec TypeScript 定义。每个 Figma 页面对应一个 LayoutSpec，最终整合为主题的 `all-layouts.ts` 文件。

## 输入

| 输入 | 路径 | 说明 |
|------|------|------|
| Figma 节点代码 | `w:\3spring\PPTtemplate\groupXX\code\Node_*.tsx` | React+Tailwind 代码，包含精确坐标和样式 |
| 对应截图 | `w:\3spring\PPTtemplate\groupXX\screenshots\Screenshot_*.png` | 节点 ID 与代码文件名一致 |
| 素材文件夹 | `w:\3spring\PPTtemplate\groupXX\assets\` | 已下载的 SVG/PNG，文件名为 hash |
| 主题已部署素材 | `w:\3spring\AIPPT\public\themes\{theme-id}\` | 已复制到 public 的素材 |

### 主题映射表

| groupXX | 主题 ID | 前缀 | 输出路径 |
|---------|---------|------|----------|
| group02 | pastel-papercut | `pp-` | `src/lib/spec-engine/themes/pastel-papercut/all-layouts.ts` |
| group03 | curve-study | `cs-` | `src/lib/spec-engine/themes/curve-study/all-layouts.ts` |

## 工作流程

### 步骤 0: 准备工作

1. 查看目标主题的 `index.ts`，了解 ThemeSpec 结构和 defaults
2. 查看已有的 `all-layouts.ts`（如果存在），了解命名模式
3. 扫描 `PPTtemplate/groupXX/code/` 获取所有节点列表
4. 扫描 `PPTtemplate/groupXX/assets/` 获取所有素材文件名

### 步骤 1: 逐个节点处理

对每个 `Node_X-XXXX.tsx` 文件：

#### 1a. 查看截图

用 `view_file` 查看对应 `Screenshot_X-XXXX.png`，判断：
- 这是什么类型的布局？（见下方类型判断规则）
- 有哪些内容区域？
- 有哪些装饰元素？

#### 1b. 分析节点代码

从 React+Tailwind 代码中提取：

```
1. Canvas 背景
   - 根 div 的 bg-[...] → canvas.background
   - 如果有噪点/纸纹装饰图（通常是第一个超大 image 元素）→ canvas.backgroundImage

2. 装饰元素 (decorations[])
   - data-name="Decorative" 的元素
   - SVG 装饰图
   - 分隔线、色块等非内容视觉元素
   - 提取: x, y, w, h, rotate, opacity, src (hash 文件名)

3. 内容槽位 (slots[])
   - <p> / <h1> 文字元素 → type: 'text'
   - 图片容器 → type: 'image'
   - 提取: x, y, w, h, fontFamily, fontSize, fontWeight, color, lineHeight, letterSpacing, align
```

#### 1c. Tailwind 坐标解析规则

**绝对坐标（直接值）:**
```
left-[90px]       → x: 90
top-[129px]       → y: 129
w-[1435px]        → w: 1435
h-[597px]         → h: 597
right-[125px]     → x: 1920 - 125 - w
bottom-[90px]     → y: 1080 - 90 - h
```

**百分比/calc 坐标:**
```
left-[calc(16.67%+75px)] → x: 1920 * 0.1667 + 75 ≈ 395
top-[calc(50%-299px)]     → y: 1080 * 0.5 - 299 = 241
top-[calc(100%-90px)]     → y: 1080 - 90 = 990
```

**负坐标（装饰溢出）:**
```
left-[-38px]  → x: -38  (纸纹通常溢出画布)
top-[-49px]   → y: -49
```

**旋转:**
```
rotate-90     → rotate: 90
-scale-y-100  → scaleY: -1 (翻转，记录在装饰的 rotate 或单独注释)
```

#### 1d. 字体解析规则

```
font-['Shippori_Mincho:Regular',sans-serif]  → fontFamily: "'Shippori Mincho', serif"
font-['Playfair_Display:Italic',sans-serif]  → fontFamily: "'Playfair Display', serif", fontStyle: 'italic'
font-['Bricolage_Grotesque:Bold',sans-serif] → fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700
text-[90px]  → fontSize: 90
text-[20px]  → fontSize: 20
leading-none → lineHeight: 1
leading-[1.25] → lineHeight: 1.25
font-normal  → fontWeight: 400
font-bold    → fontWeight: 700
italic       → fontStyle: 'italic'
```

#### 1e. 颜色解析规则

```
text-[color:var(--color-1,black)]  → color: '#000000' (使用 fallback 值)
bg-[var(--color-2,white)]          → background: '#ffffff'
text-[color:var(--color-1,#4a4a4a)] → color: '#4a4a4a'
text-white                          → color: '#ffffff'
```

**CSS 变量颜色**：记录变量名和 fallback 值，在 LayoutSpec 中直接使用 fallback 值。

#### 1f. 素材文件关联

代码中的 `http://localhost:3845/assets/HASH.ext` 对应 `PPTtemplate/groupXX/assets/HASH.ext`。

在 LayoutSpec 中使用相对路径：`src: 'HASH.ext'`
（运行时由 `assetBase` 前缀拼接为完整路径）

检查该文件是否已存在于 `public/themes/{theme-id}/` 目录。如果不存在，需要手动复制。

### 步骤 2: 布局类型判断

判断一个 Figma 页面属于哪种布局类型，核心依据是**内容的语义结构**：

| 标签 | 判断信号 | slot 命名 | contentFields |
|------|---------|----------|---------------|
| `timeline` | 有日期/年份字段 + 条目间有连接线/时间轴 | `event-N-date` + `event-N-title` | `['title', 'events:N']` |
| `cards-N` | N 个平等并列项，无时序，无连接线 | `card-N-heading` + `card-N-body` | `['title', 'cards:N']` |
| `metrics` | 主视觉是大号数字/百分比 + 小标签 | `metric-N-value` + `metric-N-label` | `['title', 'metrics:N']` |
| `comparison` | 左右两侧对称结构 | `left-heading/body` + `right-heading/body` | `['title', 'left', 'right']` |
| `quote` | 大号斜体引文 + 署名 | `title` (引文) + `body` (署名) | `['title', 'body']` |
| `image-text` | 一边大图一边文字 | `image` + `title` + `body` | `['title', 'body', 'image']` |
| `cover` | 全页只有标题+副标题 | `title` + `subtitle` | `['title', 'subtitle']` |
| `ending` | 结尾感谢页 | `title` + `body` | `['title', 'body']` |
| `text` | 标题+正文段落，无结构化子项 | `title` + `body` | `['title', 'body']` |
| `text-bullets` | 标题+列表正文 | `title` + `body` | `['title', 'body']` |
| `chart-bar` | 柱状图布局 | `title` + `body` | `['title', 'chart']` |
| `team-members` | 团队成员页 | `card-N-heading` + `card-N-body` | `['title', 'cards:N']` |

**判断流程**：
```
1. 看截图整体视觉 → 初步分类
2. 看节点代码中的占位文字：
   - "2020/2021" 或 "Milestone" → timeline
   - "001/002/003" 或 "Feature" → cards
   - "85%" 或 "$1.2M" → metrics
   - "Date" + large title → cover
   - 大号引文 → quote
3. 看有无 SVG 连接线元素 → 有线 = timeline
4. 结论写入 contentFields 和 slot 命名
```

### 步骤 3: 生成 LayoutSpec 代码

每个布局生成一个导出常量：

```typescript
import type { LayoutSpec } from '../../types'

export const ppCover: LayoutSpec = {
  id: 'pp-cover',                    // 主题前缀-语义名
  description: '封面页，全幅标题+副标题',  // AI 选择指导
  contentFields: ['title', 'subtitle'],  // 内容字段声明
  canvas: {
    w: 1920,
    h: 1080,
    background: '#ffffff',
    // backgroundImage: 'hash.png',   // 如有纸纹
    // backgroundOpacity: 0.4,        // 纸纹透明度
  },
  decorations: [
    // 按 zIndex 从低到高排列
    {
      type: 'image',
      x: -38, y: -49, w: 1995, h: 1409,
      src: '35e56626f174259f1ab7fce23e37eaf437c37a51.png',
      opacity: 0.4,
      zIndex: 0,
    },
    {
      type: 'svg',
      x: 395, y: 129, w: 1690, h: 1232,
      src: '26ba375a83c6b17998f90af04e168737e456c95d.svg',
      rotate: 0,
      zIndex: 0,
    },
  ],
  slots: [
    {
      id: 'title',
      type: 'text',
      x: 90, y: 90, w: 1435, h: 200,
      fontFamily: "'Shippori Mincho', serif",
      fontSize: 90,
      fontWeight: 400,
      lineHeight: 1,
      color: '#000000',
    },
    {
      id: 'subtitle',
      type: 'text',
      x: 90, y: 990, w: 163, h: 30,
      fontFamily: "'Playfair Display', serif",
      fontSize: 20,
      fontWeight: 400,
      lineHeight: 1,
      color: '#000000',
    },
  ],
}
```

### 步骤 4: 命名规范

布局 ID 格式：`{前缀}-{语义名}`

| 前缀 | 含义 |
|------|------|
| `pp-` | pastel-papercut |
| `cs-` | curve-study |

语义名采用 kebab-case，如 `cover`, `three-col`, `timeline-large`, `cards-grid`, `image-left`

### 步骤 5: 整合 all-layouts.ts

将所有 LayoutSpec 常量写入 `all-layouts.ts`，按视觉分组排列：

```typescript
import type { LayoutSpec } from '../../types'

// === 封面/结尾 ===
export const ppCover: LayoutSpec = { ... }
export const ppEnding: LayoutSpec = { ... }

// === 文字型 ===
export const ppTitleBody: LayoutSpec = { ... }
export const ppTextCenter: LayoutSpec = { ... }

// === 卡片型 ===
export const ppThreeCol: LayoutSpec = { ... }
// ... etc
```

### 步骤 6: 更新 index.ts

确保主题的 `index.ts` 正确导入和注册所有布局：

```typescript
import type { ThemeSpec } from '../../types'
import { ppCover, ppEnding, /* ... */ } from './all-layouts'

const allLayouts = [ppCover, ppEnding, /* ... */]

export const pastelPapercut: ThemeSpec = {
  id: 'pastel-papercut',
  name: 'Pastel Papercut',
  // ... defaults
  layouts: Object.fromEntries(allLayouts.map(spec => [spec.id, spec])),
  assetBase: '/themes/pastel-papercut/',
}
```

## 精度要求

| 项目 | 要求 |
|------|------|
| 坐标 (x, y, w, h) | 与 Figma 代码误差 ±5px |
| 字号 | 与 Figma 完全一致 |
| 字体 | 保留原始字体名 |
| SVG 装饰位置/尺寸/旋转 | 精确复刻 |
| 颜色 | 使用 CSS 变量的 fallback 值 |

## 特殊处理

### 纸纹/噪点纹理
通常是第一个超大 `<img>` 元素（尺寸远大于 1920×1080），位置有负偏移：
```typescript
// 不再作为 decoration，改为 canvas 属性
canvas: {
  w: 1920, h: 1080,
  background: '#faf3e8',
  backgroundImage: '35e56626...png',
  backgroundOpacity: 0.4,
}
```

### 复杂布局（如交错时间线）
- 连接线用 SVG 装饰元素
- 每个时间节点的文字分别映射为 `event-N-date`, `event-N-title`, `event-N-description`

### 翻转元素
`-scale-y-100` 或 `-scale-x-100` 在 Tailwind 中表示镜像翻转。记录为备注，装饰元素可以直接使用翻转后的素材或设置 CSS transform。

### 旋转文字
如 `rotate-90` 的侧边描述文字，记录 slot 的旋转角度，但需要注意旋转后的宽高交换。

## 验证清单

每个布局完成后检查：
- [ ] id 唯一，前缀正确
- [ ] description 准确描述用途
- [ ] contentFields 匹配 slot ID 命名
- [ ] canvas 宽高固定为 1920×1080
- [ ] 所有装饰元素的 src 文件存在于 assets/ 或 public/themes/
- [ ] 所有 text slot 有 fontFamily, fontSize, color
- [ ] 坐标在合理范围内（x: -100~1920, y: -100~1080）

## 批量执行建议

1. 先处理最简单的布局（cover, ending, text-center）建立模式
2. 再处理卡片类（cards-3, cards-4），形成模板
3. 最后处理复杂布局（timeline, comparison）
4. 每处理 5 个布局后，用 `npx tsc --noEmit` 检查类型错误
5. 完成所有布局后，更新 index.ts 并确保编译通过
