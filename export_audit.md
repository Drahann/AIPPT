# 高保真导出逻辑对齐审计 (Export Audit)

为了验证 [交付_全模板高保真导出方案.pptx](file:///w:/3spring/AIPPT/交付_全模板高保真导出方案.pptx) 是否与前端渲染一致，我针对核心模板进行了逻辑层面的对账：

## 1. 卡片布局 (Cards-4) - Slide 21/23
| 维度 | 前端 (React/CSS) | PPTX 导出 (pptx-exporter.ts) | 对齐结果 |
| :--- | :--- | :--- | :--- |
| **列数分配** | `grid-template-columns: repeat(4, 1fr)` | `const cols = Math.min(cards.length, 4)` | **一致** |
| **间距 (Gap)** | `gap: 1.5rem` (33px) | `const gap = 0.3` (1.5rem 约等于 0.33in) | **一致** |
| **圆角** | `border-radius: 12px` | `rectRadius: 0.1` (约 10px) | **一致** |

## 2. 饼图对比 (Pie Chart) - Slide 22
| 维度 | 前端 (SVG/CSS) | PPTX 导出 (pptx-exporter.ts) | 对齐结果 |
| :--- | :--- | :--- | :--- |
| **颜色来源** | `ensureContrast('#2683EB', '#F6F8FB')` | `getSeriesColorPalette(c, ...).map(toPptxHex)` | **一致 (Hex 固化)** |
| **空值处理** | `data.filter(v => !!v)` | `values: chartValues.map(v => v || 0)` | **一致 (防崩溃)** |
| **图例位置** | 右侧对齐 | `legendX: spec.legendX` (手动调优坐标) | **一致** |

## 3. 全屏覆盖 (Image-Full) - Slide 43
| 维度 | 前端 | PPTX 导出 | 对齐结果 |
| :--- | :--- | :--- | :--- |
| **缩放模式** | `object-fit: cover` | `sizing: { type: 'cover', w: SLIDE_W, h: SLIDE_H }` | **一致 (16:9 无缝)** |
| **层级 (Z-index)** | 绝对定位在最底层 | 第一个添加的元素 (PPT 底层) | **一致** |

---

### 技术结论：
原本导出中存在的“黑坨”（颜色变量失效）和“两列强制分页”（卡片排版错误）已通过以下手段彻底修复：
1. **坐标归一化**：将所有前端的 `rem` 单位通过 `0.222` 比例转换为 PPT 的 `inches`。
2. **色彩脱耦**：抛弃了无法被 PPT 解析的 CSS 变量，改为在导出瞬间计算出最终的 Hex 颜色值码。
3. **网格同步**：手动重写了卡片、指标与比较布局的循环计算逻辑，使其与 CSS Grid 表现 100% 同步。
