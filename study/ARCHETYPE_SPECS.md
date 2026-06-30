# 创赛页面原型处方 · ARCHETYPE_SPECS（v1）

> P0 交付物。把 `CODEX_创赛风格圣经.md` 从"描述创赛是什么"升级为"逐原型、可机检、能直接驱动生成的处方"。
> **三处共用此字典**：S2 叙事(`archetype` 枚举) · S3 构图大纲(生成 `page_plan`) · 构图语料(`classify_archetype` 分类标签 + `corpus_query` 默认过滤) · S5(`density_check` 校验)。
> 数值真值来源：`CODEX Part II/III/IV/VII`、`assets_lib/RULES.md §5`、`chuangsai_keji/design_spec.md §VI`。
> 路径约束（决策 IX.2 + 2026-06-26 冒烟测试）：唯一主路径 = **`P-roster + COM-PNG参照`**（`corpus_query` 返回真页 COM 渲染 PNG 当可见参照 → Executor 照着 + 取 assets_lib 真零件 → 手写干净 SVG）。**P-mirror（pptx_to_svg）与 P-fill 均已 parked**（前者丢深色底/塌图/降特效，证据 `study/build_loop/smoke_pptx_to_svg/`）。

---

## 0 · 字段定义（schema）

每个原型一节，字段固定，机器可读：

| 字段 | 含义 | 取值 |
|---|---|---|
| `archetype` | 原型 id（枚举主键） | cover/toc/chapter/pain_point/solution/data/business/team/ending |
| `gen_path` | 首选生成路径 + 备选 | `P-mirror`(真页 pptx_to_svg 镜像誊抄) / `P-roster`(参数化骨架) |
| `rhythm` | 节奏 | `anchor`(放空但满铺氛围) / `dense`(填满) |
| `density_target` | 绘制元素数下限（tech_blue 锚点；按 §0.1 family 系数缩放） | 整数区间 |
| `slot_sig` | 槽位签名（corpus 检索 + 内容装配） | 见各节 |
| `required_chrome` | 必现赛事身份件 | 子集 of {赛事条, 常驻校徽, 参赛pill块, 章节nav} |
| `required_decor` | 必现装饰（→ `assets_lib` 的 `category.subtype`，density_check 据此校验命中） | 见各节 |
| `takeaway` | 金句条 | `required` / `optional` / `n/a` |
| `title_fx` | 标题字效 | 见 §0.2 |
| `corpus_filter` | `corpus_query` 默认过滤参数 | jsonc |
| `fallback` | 检索无果/保真不足时的退路 | 路径或骨架 |
| `content_fit` | 构图规则（CODEX Part III 实测） | 散文 |

### 0.1 family 密度系数（density_target × 系数）

> 锚点 = tech_blue（=1.00）。来源 CODEX Part VII：BP30 · red48–50 · redgold76 · green83 · med71–97 · blue109 · dark115–130。

| family | 系数 | family | 系数 |
|---|---|---|---|
| `dark_gold` | 1.15 | `agri_green` | 0.78 |
| `tech_blue` | 1.00 | `heritage_gold` | 0.70 |
| `med` | 0.85 | `red` | 0.48 |

`density_check` 实际下限 = `floor(density_target_low × family系数)`。例：solution 95 × red 0.48 ≈ 46。

### 0.2 标题字效词汇（title_fx，CODEX Part IV）

`gold-glow`(金渐变填充 + feGaussianBlur 外发光，无 feOffset) · `stroke`(描边) · `single-char-accent`(单字异色) · `motif-hung`(字挂 DNA/电路/茶/麦穗) · `en-subtitle`(英文译名) · `category-tag`(品类标签)。
两大字脉（由 brand 决定，此处仅声明）：`modern-hei`（tech_blue/med/agri/dark_gold：优设标题黑 + 思源黑体）· `tradition-song`（heritage_gold/red：思源宋 Heavy + 毛笔体 + 金渐变）。

### 0.3 §VI 装饰清单（content/solution/data/business 类逐页 checklist，命中 ❶❷❸ + ≥2 其它）

❶ 氛围背景(满铺暗场+渐变shade+vignette) ❷ 粒子/景深点场(18–28) ❸ HUD 角括号(四角+面板角) ❹ 侧栏 HUD 刻度条 ❺ 光束/速度线(2–3) ❻ 焦点环系(封面) ❼ 雪弗龙«»+连接器 ❽ 数据/状态 chip ❾ 巨型数字水印 ❿ 纹理内嵌图(clipPath rect + 蒙版 + caption)。
> 非科技 family 等价替换：heritage→麦穗花环/印章/祥云/汉字数字水印；red→红绸带/白鸽/红旗/金星；agri→上扬增长曲线/麦穗/田野照。

---

## 1 · cover（封面）

```
gen_path:        P-roster + COM-PNG参照 (骨架 01_cover.svg)   # P-mirror parked
rhythm:          anchor
density_target:  60–80
slot_sig:        hero
required_chrome: [赛事条, 常驻校徽, 参赛pill块]
required_decor:  [background.atmosphere|photo_scene(满铺),
                  fx.glow|light_arc(标题后焦点光),
                  decoration.numeral(可选), badge_icon.emblem(项目标记),
                  (可)cutout.object_3d|product(中心舞台)]
takeaway:        n/a
title_fx:        [gold-glow, stroke, en-subtitle, category-tag]
corpus_filter:   { archetype:"cover", family:auto, slot:"hero", gold:true, topk:5 }
fallback:        P-roster 01_cover.svg
content_fit:     超大展示标题占视觉中心 + 一句副标(/ 或 · 分隔) + 参赛信息 pill 块
                 (赛道/负责人/学校/组别/指导老师) + 满铺照片或氛围暗场 + 顶部赛事全名条 + 赛事/校 logo。
```

## 2 · toc（目录）

```
gen_path:        P-roster + COM-PNG参照   # P-mirror parked(冒烟测试否决)
rhythm:          anchor
density_target:  40–60
slot_sig:        numbered_menu
required_chrome: [常驻校徽]
required_decor:  [background.atmosphere, fx.glow(弱), decoration.numeral(01–0N 大编号)]
takeaway:        n/a
title_fx:        [gold-glow]
corpus_filter:   { archetype:"toc", family:auto, slot:"numbered_menu", gold:true, topk:5 }
fallback:        P-roster(环形/竖列编号菜单)
content_fit:     环形/编号菜单(01–0N 围绕中心字) 或 竖列大编号 + 章节名 + 英文小字。深底，疏。
```

## 3 · chapter（章节过渡）

```
gen_path:        P-roster + COM-PNG参照   # P-mirror parked(冒烟测试否决)
rhythm:          anchor
density_target:  30–50
slot_sig:        big_numeral
required_chrome: [常驻校徽, 章节nav]
required_decor:  [background.atmosphere, fx.glow(焦点), decoration.numeral(巨型 壹/01)]
takeaway:        n/a
title_fx:        [gold-glow, en-subtitle]
corpus_filter:   { archetype:"chapter", family:auto, slot:"big_numeral", gold:true, topk:5 }
fallback:        P-roster(巨型章节号 + 章节名 + 英文)
content_fit:     巨大 壹/01 或章节号 + 章节名 + 英文小字。深底，极简(锚点放空页)——
                 但"放空"=满铺氛围+焦点光+数字水印+chrome，绝非裸文字留白。
```

## 4 · pain_point（背景/痛点）

```
gen_path:        P-roster + COM-PNG参照   # 痛点真页 PNG 作参照；地图/剪报用 chart_map 真零件
rhythm:          dense
density_target:  75–95
slot_sig:        map_or_clip + pain_boxes
required_chrome: [常驻校徽, 章节nav]
required_decor:  [background.atmosphere, chart_map.china_map|infographic(一图读懂),
                  decoration.banner(黑斜切标题), badge_icon.circle(痛点框徽),
                  particles, hud.corner]
takeaway:        required
title_fx:        [stroke, en-subtitle]   # 黑斜切 banner 常配英文副标
corpus_filter:   { archetype:"pain_point", family:auto, topk:6 }
fallback:        P-roster(黑斜切 banner + 数据/地图 + 痛点要点框)
content_fit:     左上黑色斜切 banner 标题 + 英文副标 + 中国地图/数据/剪报 + 痛点要点框，常"一图读懂"。
                 §VI checklist：❶❷❸ + ❽(数据chip) + ❾(数字水印)。
```

## 5 · solution（方案/技术）

```
gen_path:        P-roster + COM-PNG参照   # 中心舞台用 cutout/AI-gen 填
rhythm:          dense
density_target:  95–115
slot_sig:        3col  (变体 4col)
required_chrome: [常驻校徽, 章节nav]
required_decor:  [background.atmosphere, fx.light_arc|glow(中心舞台焦点),
                  frame.pedestal_3d|device_mockup(中心舞台),
                  hud.corner(每面板角), badge_icon.circle|hex(面板徽),
                  decoration.ribbon(金句), particles, fx.light_strip(流程箭头/连接器)]
takeaway:        required
title_fx:        [gold-glow, motif-hung]
corpus_filter:   { archetype:"solution", family:auto, slot:"3col", gold:true, density_min:90, topk:5 }
fallback:        P-roster chuangsai_keji 02_content.svg
content_fit:     中央设备/产品"舞台"(3D基座/mockup) + 左右框面板×N(每面板=徽章+标题+正文+pill+图)
                 + 流程箭头 + 底金句条。§VI checklist：❶❷❸❼❿ + ❹/❺ 任一。项目特有方案数据 → 走 P-roster。
                 中心产品(本项目=血管支架/血源涂层)无现成真图 → 登记 cutout gap → AI 生图。
```

## 6 · data（数据/成果）

```
gen_path:        P-roster   # 图表必须用项目真数重画，不能复用栅格化真图表
rhythm:          dense
density_target:  90–115
slot_sig:        4kpi + chart  (变体 2chart)
required_chrome: [常驻校徽, 章节nav]
required_decor:  [background.atmosphere|gradient(数据页常切浅/白底，保图表可读),
                  decoration.numeral(巨型汉字数字水印 壹贰叁),
                  decoration.wreath(指标 pill 麦穗框 · heritage/agri),
                  decoration.swoosh(趋势手绘 ribbon · agri),
                  badge_icon.circle(KPI 徽), decoration.ribbon(底金句), hud.grid(网格底)]
takeaway:        required
title_fx:        [gold-glow]
corpus_filter:   { archetype:"data", family:auto, slot:"4kpi", gold:true, topk:5 }   # 仅借装饰/水印/ribbon 风格
fallback:        P-roster chuangsai_keji 03_data.svg
content_fit:     图表(3D金柱/折线/饼) + 巨型汉字数字水印 + 大数字 KPI + 指标 pill(麦穗框) + 趋势 ribbon + 底金句。
                 节奏切浅/白底 + 家族色描点(保图表可读)。图表坐标按 shared-standards §7 算。§VI：❶❸❽❾❿ + ribbon。
```

## 7 · business（商业模式）

```
gen_path:        P-roster + COM-PNG参照
rhythm:          dense
density_target:  90–110
slot_sig:        loop_modules
required_chrome: [常驻校徽, 章节nav]
required_decor:  [background.atmosphere, badge_icon.circle|hex(模块徽),
                  fx.light_strip(蓝/金连线 + 箭头闭环), hud.corner,
                  decoration.ribbon(金句), particles]
takeaway:        required
title_fx:        [gold-glow]
corpus_filter:   { archetype:"business", family:auto, slot:"loop_modules", gold:true, topk:5 }
fallback:        P-roster(多模块框 + 连线 + 箭头闭环)
content_fit:     多模块框 + 蓝/金连线 + 箭头闭环；保持家族皮肤。项目特有商业逻辑 → P-roster。§VI：❶❷❸❼ + ❽。
```

## 8 · team（团队）

```
gen_path:        P-roster   # 项目真人头像 → cutout gap；组织架构按项目重排
rhythm:          dense
density_target:  70–95
slot_sig:        portrait_grid
required_chrome: [常驻校徽, 章节nav]
required_decor:  [background.atmosphere, cutout.person(团队人像，圆/方框),
                  frame.photo_frame, badge_icon.circle(角色徽), hud.corner, particles]
takeaway:        optional
title_fx:        [gold-glow]
corpus_filter:   { archetype:"team", family:auto, slot:"portrait_grid", gold:true, topk:5 }   # 借栅格/框样式
fallback:        P-roster(人像网格 + 姓名800重 + 角色 + 组织架构)
content_fit:     人像(圆/方框) + 姓名(800重) + 角色 + 组织架构网格；纵向铺满。
                 真人头像无库图 → cutout gap → 用户提供 or AI 生图(注意肖像合规)。
```

## 9 · ending（结尾）

```
gen_path:        P-roster + COM-PNG参照   # P-mirror parked(冒烟测试否决)
rhythm:          anchor
density_target:  40–60
slot_sig:        thanks_hero
required_chrome: [常驻校徽]
required_decor:  [background.atmosphere, fx.glow(焦点),
                  frame.device_mockup(手机 mockup · 可选),
                  decoration.numeral|seal(家族底饰)]
takeaway:        optional   # 可放愿景金句
title_fx:        [gold-glow]
corpus_filter:   { archetype:"ending", family:auto, slot:"thanks_hero", gold:true, topk:5 }
fallback:        P-roster(谢谢观看巨字 + 联系方式/二维码/手机mockup)
content_fit:     谢谢观看/感谢聆听 巨字 + 联系方式/二维码/手机 mockup + 家族底饰。
```

---

## 10 · 路由汇总（冒烟测试后 · 统一主路径）

**全部 9 原型 = `P-roster + COM-PNG参照`**（不再按页型分叉 P-mirror/P-roster）。区别只在每原型"参照什么、取哪些真零件、密度多少"：

| 类别 | 原型 | 参照与素材重点 |
|---|---|---|
| 结构/低数据页 | cover · toc · chapter · pain_point · ending | COM-PNG 参照构图；背景/光效取 assets_lib 真图；文字替换为主 |
| 高项目数据页 | solution · data · business · team | COM-PNG 参照装饰/密度/资产位置；KPI/图表/团队用项目真数重画；中心舞台/人像走 cutout gap |

> **为何统一**：2026-06-26 冒烟测试证明 `pptx_to_svg` 丢深色底/塌图/降特效，P-mirror 不可用；而唯一完全保真的是 COM 渲染真页 PNG。故所有原型都"照着真页 PNG，用真零件，手写干净 SVG"。详见 `study/build_loop/smoke_pptx_to_svg/FINDINGS.md`。P-mirror 待转换器修 bug 后或可回归为补充路径。

## Changelog
- **v1.1（冒烟测试后 pivot）**：P-mirror/pptx_to_svg 经冒烟测试否决(丢深色底/塌图/降特效) → parked；全 9 原型统一 `gen_path = P-roster + COM-PNG参照`；§0 路径约束、各原型 gen_path、§10 路由汇总同步修订。证据 `study/build_loop/smoke_pptx_to_svg/`。
- **v1**：9 原型全字段处方；density_target 锚 tech_blue + family 系数表；required_decor 映射 assets_lib category；§0.3 §VI 装饰 checklist。
