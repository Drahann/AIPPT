# AIPPT · 复刻驱动的创赛 PPT 生成系统

从计划书自动生成「金奖级」创赛（挑战杯 / 互联网+ / 创青春）PPT 页。核心方法是**复刻驱动**：每一页先从约 800 套真实国金模板里选一张**结构最贴本页内容**的参考页，再用项目自己的内容把它**复刻**出来——同底图、同配色、同装饰、同布局，只替换文字、统一字体，内容零删减。**「像不像那张参考」是第一质量指标**，目标是首过即像。

成品既可导出为**一页一张全幅图**的忠实 `.pptx`，也可导出为**原生可编辑文本框**的 `.pptx`。

---

## 核心原则

1. **复刻，不是填模板**：选一张真页，把它的底图/配色/装饰/布局重画一遍，只换文字。
2. **用参考自己的皮**：每页用所选参考所在 deck 的底图 + 配色 + 装饰；整本只统一「大类（科技/医疗/红旅/农业）+ 字体字号」。
3. **装饰是真图，不是自画矢量**：卡框、要点底板、徽章、箭头、连接线等一切小装饰都用真图（复用参考素材或按框 AI 生成）；只有数据图表（饼/柱/折）和整体结构逻辑图（时间轴/金字塔/流程）可用矢量。
4. **每页冷启动**：排到某个框才按框尺寸现取/现生装饰；禁跨页复用 AI 生图、禁同图铺不同比例。
5. **内容零删减 + 字号有下限**：字号取自真实模板统计（最小 18px）；装不下就拆续页、减元素、加列，不缩字、不删点。
6. **干净底 + 加法合成 + 真数据矢量图**：底图用无内容的 `clean_base`，装饰逐张精确叠加；数据图用真实数字矢量重画。

---

## 运行时流水线（S1–S6）

```
计划书(postppt.json) ─ 按 H2 切页 ─► 每页: S1 选参考 → S2 取皮 → S3 复刻布局
   → S4 现场上装饰 → S5 渲染(SVG→PNG) → S6 过门(page_gate) ─► 导出 .pptx
```

工具链在 [`study/engine/`](study/engine)：

| 工具 | 作用 |
|---|---|
| `corpus_search.py` | 按 family / archetype / 槽位形状检索参考页或 deck |
| `get_record.py` · `deco_skeleton.py` | 取参考页完整记录 / 抽装饰位(function@box)+真字号+密度 |
| `clean_base.py` | 从 deck 生成无内容的纯场景底图 |
| `gen_deco.py` | AI 生成功能装饰（full-bleed + 真 alpha + 5-key 轮询；`--prompt` 现场设计提示词） |
| `render_page.py` · `svg_to_png.py` | 确定性渲染（真坐标/字体/字号填文字 + 叠装饰）→ 栅格化 |
| `page_gate.py` | S6 强制门（见下） |
| `export_pptx.py` | 拼成 16:9 `.pptx`（`--editable` 输出原生可编辑文本框，否则一页一图） |

## 强制门 `page_gate.py`

一页只有在 `page_gate.py <page_dir> --ref <参考页id> --cards N` 全绿才算完成。它串起：

- **PROVENANCE** — 本页素材不得与任何其它页的素材字节重复（禁跨页复用）。
- **FONT-FLOOR** — 所有文字 ≥ 18px，且不允许发生自动缩字（防同卡并列字号不一）。
- **deco_check** — 卡片必有真 `card_frame` 图、结构功能齐备、装饰只多不少、同图不同比例判负（SIZE-FIT）、自画底板/胶囊/箭头判负（NO-SELF-DRAW）、单图拉伸判负（STRETCH）。

---

## 目录结构

```
.claude/skills/chuangsai-deck-gen/SKILL.md   操作规范（权威操作手册）
study/engine/        工具链
study/_scripts/      OOXML 解析 + 文生图客户端
study/runs/          各 deck 的生成页（示例与产物）
study/*.md           设计文档（架构 / 原型处方 / 风格规范）
postppt.json         示例计划书（稀土回收项目）
study/corpus/        参考语料库（~800 模板，~12GB，体积过大未入库，另行提供）
study/assets_lib/    功能装饰库（~11GB，同上）
```

> 语料库 `study/corpus/`（约 12GB）与装饰库 `study/assets_lib/`（约 11GB）因体积超出 Git 仓库实用范围，未随仓库上传，需另行获取后置于上述路径。其余代码与示例产物均在仓库内。

## 示例产物

`study/runs/rareearth/`（稀土回收 deck）下的成页，如 `p18_财务规划` / `p20_社会影响`，每页含 `page.svg` / `page.png` / `page.record.json` / `page.binding.json` 及独立 `_assets/`；`_export/` 内有拼合导出的 `.pptx`（image 版与 editable 版）。

## 用法

环境：Windows + 已安装 Google Chrome（SVG→PNG）+ Python（含 `python-pptx`、`Pillow`）+ 模板所需中文字体。

```bash
# 1) 配置生图密钥（DashScope / 百炼）
#    新建 study/engine/keys.local.json: {"keys": ["sk-..."], "base_url": "..."}

# 2) 生成一页（页模块定义 DECK/BASE/build()）
cd study/runs/<deck> && python drive.py <page_module>

# 3) 过门
python study/engine/page_gate.py study/runs/<deck>/<page_dir> --ref <参考页id> --cards N

# 4) 导出 .pptx
python study/engine/export_pptx.py -o deck.pptx --deck study/runs/<deck> [--editable] [--hires]
```

操作细节以 [`SKILL.md`](.claude/skills/chuangsai-deck-gen/SKILL.md) 为准。
