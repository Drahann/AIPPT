# 复刻驱动的创赛 PPT 生成 · 架构设计（ARCH v1）

> ⚠️ **当前操作以 `.claude/skills/chuangsai-deck-gen/SKILL.md` 为准。** 本文是早期架构原理，部分已演进：
> ①目标收敛为"**复刻参考页、首过即像**"(像不像参考是第一指标)；②**"deck skin lock 锁一套皮"已废**——改为**每页用所选参考自己的皮**(底图/配色/装饰)，整本只统一"大类(科技/医疗/红旅/农业)+字体字号"，以最大化对参考的相似度；③装饰=真图片(复用 corpus 真图或按框 AI 生同类)，**禁手画矢量、禁跨页复用 AI 图、禁同图铺不同比例**；④**页级冷启动**(每页独立选参考/读json+png/现场按框生图)，不在开工前批量备图。

> 由"手把手复刻一页 med_jiyin s13"收敛出的架构。前置事实：本项目输入**永远是计划书 md，按二级标题(H2)切页，每个 H2 内容高度同构**；参考库≈800 份真模板，**页面级模板驱动**。
> 配套：`PLAN_创赛特化改造.md`(总规划) · `ARCHETYPE_SPECS.md`(原型处方) · 复刻工具链 `study/_scripts/{parse_slide,parse_chrome,build_replica}.py`。

---

## 0 · 地基原理（本轮血换的铁律 · 已修正）

**LLM 不"凭空/看 PNG 画"，但可以"带着真实数据脚手架、有设计余地地生成 SVG"。**

翻车有两个真因，只否定第二个：
- ❌ 真因1 = **没有真实数据**(只有 PNG，靠眼睛猜坐标/字体/颜色/图片) → "半点不像"。
- ❌ 真因2 = 从零硬画。
- ✅ 正解：LLM 拿到的是**参考页的真实代码 + 全参数(坐标/翻转/字体/字号/颜色/图片位置+描述/槽位容量) + 资源目录**当**精确脚手架**——它在**改编一份精确规格**，不是凭空想。**保真来自"脚手架是真数据" + verify环，不来自"代码死摆"。**

**用户定调：保真 > 自由，"死板也好过与参考不像"。⇒ 默认锁死，自由是枚举出来的例外，拿不准就锁。**

### 0.1 自由预算（写死的清单，默认锁）
| 维度 | 锁/放 | 边界 |
|---|---|---|
| 坐标 x,y / 尺寸 w,h | 🔒锁 | "像参考"的命根，LLM 绝不动 |
| 颜色 / 字体(=skin token) | 🔒锁 | 不许漂 |
| 结构/网格/有哪些装饰 | 🔒锁 | 6卡=6卡骨架；chevron/金句条/HUD 一个不少 |
| 图片放在哪个框 | 🔒锁 | 框+角色固定 |
| 文字**内容** | 🟢放 | 本就要换 |
| 文字**适配**(缩字号/换行/截断) | 🟢放·有界 | 框内、字号有下限 |
| **数量自适应**(7人vs6卡) | 🟡先选页解决，被迫才放 | **优先选槽位数匹配的参考页**；真要加只能**照搬同一卡样式+间距复制**，绝不自由重排 |
| 生成图**题材/构图** | 🟢放·有界 | 锁定框+比例+角色内决定画什么 |

### 0.2 强制锁的机制 —— 三档，默认中档
- **strict(兜底)**：纯代码填(`build_replica`)，零几何自由。某页必须分毫不差时用。
- **guided(默认·推荐)**：**LLM 不吐 `<rect x=..>`，只产出结构化 `page_binding`**(每槽填什么+缩多大、每图画什么、几张卡)；**确定性渲染器扣到锁死脚手架上** → **坐标/色/字漂移在结构上不可能**，而"设计判断"全在 binding 里。同时满足"有设计判断 + 不可能不像"。
- **free(默认关)**：LLM 吐整页 SVG + 强制 conformance 校验(逐元素比对参考，漂了 snap 回)。因"宁死板"，默认不用。

> **"设计感"放在 `binding` 的决策里，不放在"手摆坐标"里。** LLM 决定"画什么/裁多短/加不加卡"，"摆哪/什么色/什么字"由锁死脚手架定。拿不准 → 退 strict。
> 廉价模型吃可并行叶子活(描述/裁/提示词/审)；`page_binding` 由强模型主笔(跨元素一致性强)；渲染是代码；verify-repair 兜底。

---

## 1 · 利用"固定格式"这个杀手锏（必须吃满）

输入恒为「计划书 md / H2 切页 / H2 同构」+ 参考库页面级驱动 ⇒ **本系统可以远比通用 PPT 生成器确定**：

- **H2 → 参考页"剧本(playbook)"**：H2 标题半标准化(项目背景/产业现状/创新技术/创新成果/市场分析/商业模式/团队结构/…)。为每类 H2 **预先策展**一组首选参考页(按色系/原型/槽位形状),检索时直接命中,不每次从零判断。
- 于是绝大多数工作退化为"**把已知模板的槽位，用预算过的内容填满 + 解析每张图怎么处理**"。LLM 的活儿很轻、很可并行。
- ⚠️ 改进点：不是"每页找一个相似页"就完事，是"找一个**槽位结构与本 H2 内容形状匹配**的页"(见 §4 选页)。

---

## 2 · 参考库（离线一次性构建，最大的长杆）

**两级结构：deck 级(PPT级 skin) + page 级(结构)。分离的目的——可以"取 B 套的版式，套 A 套的皮"。**

### 2.0 deck_record（PPT 级，每套模板一条）
```jsonc
{
  "deck_id":"...", "theme":"tech_blue|med|red_tour|agri_green|heritage_gold",
  "palette": {                                 // 来自 ppt/theme/theme1.xml <a:clrScheme> + 全 deck 用色聚合
    "bg_deep":"#04102B", "primary":"#1769E0", "accent_cyan":"#19E0FF",
    "accent_gold":{"grad":["#F8ECA9","#F1CE7D"]}, "text":"#EAF3FF", "alert":"#FF8A6B" },
  "typography": {                              // 来自 <a:fontScheme> + 各槽实测
    "title_family":"阿里妈妈数黑体", "name_family":"思源宋体 CN Heavy",
    "body_family":"OPPOSans M", "nav_family":"阿里巴巴普惠体",
    "size_ramp":{"title":48,"name":37,"role":19,"body":15,"nav":21} },
  "pages":[ "deck<sha>_p01", ... ]
}
```
> theme1.xml 直接给 12 色 clrScheme + major/minor 字体；再用各页实测值补全。**这就是你说的"参考库要有 PPT 级信息"。**

### 2.1 page_record（页级，三层分离）—— **颜色/字体存"语义角色"，不存死值**

> 关键改动：槽位/图片里**不硬编码 `#F1CE7D`**，而记 `fill_role:"accent_gold"`、`font_role:"name_family"`。
> 渲染时 `resolve(page, deck_skin)`：把角色解析成"**当前所选 deck skin**"的真值。
> ⇒ **取 B 页的结构 + 套 A 套的 palette/typography = 自动同步颜色字体**（你那个"团队页借别套、把本套颜色同步进来"的例子，成了一行 `resolve(B_page, A_skin)`）。

### 2.2 装饰也跟着换皮（跨套混搭的难点）

根因：文字靠"语义角色→A色板"能自动换皮，但**装饰是 B 色烤死的 PNG，不会自己变**。解法同文字——**装饰也存"角色槽"，不存烤死的图**：

- 页里装饰记 `{role: title_frame / ribbon_side_deco / corner_hud / background / divider, box, theme_meaning}`，**不绑死具体哪张图**。
- **skin 比"色板+字体"更厚，还含「主题装饰集 + 背景」**：来自该套 deck 自带资产 + `assets_lib`(按 `family×category×role` 索引——这正是 assets_lib 的用途)。`deck_record.skin.deco_set = {title_frame:[...], ribbon_deco:[...], background:[...], corner_hud:[...]}`。
- `resolve(B结构, A_skin)` 给每个装饰槽**填 A 主题的版本**，三路兜底(=§5 三路，由换皮触发)：①库里取 A 主题同 role 同比例的装饰(红旗飘带→科技圆环)；②取不到→PIL 按 A accent 重上色(简单单色装饰)；③再不行→prompt-smith 按"原 role 构图 + A rendering×palette + 框比例"AI 生图。
- **背景同理走 A 的**(借 B 版式但底子用 A，团队页才和 A 套其它页一致)。

> 即：**文字 + 装饰 + 背景，页里全存"角色槽"，`resolve(page, skin)` 一起换成当前 skin 真值。** "借 B 版式套 A 皮" = 把 A 的**整套皮(色+字+装饰集+底)**扣到 B 骨架上。

```jsonc
{
  "id": "deck<sha>_p13", "source_deck": "...", "slide_idx": 13,
  "render": "lib/render/<id>.png",            // COM 渲染真值(选页/审查用)
  "family": "tech_blue", "archetype": "team",
  "slot_signature": "6_person_grid",          // 槽位形状(选页主键之一)
  "content_shape": "6 人 × (姓名+角色+3要点+1职责)",
  "description": "深蓝实验室宇宙底，chevron金标题，6张蓝色半透人像卡(金色衬线名)，蓝金句条，底部6段nav",  // VLM 生成
  "tags": ["团队","人员配置","深蓝","金奖"],
  "canvas": [1280,720],

  "chrome": [                                  // 持久层(版式/母版)：默认 reuse-verbatim
    {"kind":"bg_image","asset":"L01.png","box":[0,0,1280,720],"desc":"深蓝科研实验室+四周HUD边框+顶部居中HUD装饰","role":"reuse"},
    {"kind":"nav_bar","asset":"pic02.png","box":[0,667,1279,114],"desc":"底部蓝色导航条","role":"reuse"} ],

  "slots": [                                   // 内容槽：填新内容，遵守容量
    {"id":"sec_title","box":[460,78,359,68],"role":"title","font":{"fam":"阿里妈妈数黑体","px":48,"align":"LEFT","fill":"#EAF8FF"},"cap":{"cpl":7,"lines":1},"placeholder":"技术专利的展示"},
    {"id":"name_1","box":[65,326,148,59],"role":"person_name","font":{"fam":"思源宋体 CN Heavy","px":37,"fill":{"grad":["#F8ECA9","#F1CE7D"]}},"cap":{"cpl":3,"lines":1}},
    {"id":"ribbon_big","box":[291,554,698,100],"role":"takeaway","font":{"fam":"梦源黑体 CN W23","px":37},"cap":{"cpl":18,"lines":1}}
    // ...每个文本框：box+真字体+真字号+真颜色(含gradFill)+对齐+容量
  ],

  "images": [                                  // 装饰/照片/示意图：按 role 决定处理方式
    {"id":"avatar_1","asset":"pic03.png","box":[62,185,131,125],"flipV":true,"srcRect":{"t":0.325},
     "role":"placeholder_photo","desc":"米白人物半身剪影(占位头像)，渲染时蓝色duotone","effects":["duotone→blue","alpha"],
     "treatment":"content-regen","gen_hint":{"subject":"professional portrait","aspect":1.05,"bg":"transparent-or-tinted"}},
    {"id":"title_deco","asset":"pic01.png","box":[222,86,851,66],"role":"decoration",
     "desc":"蓝色HUD标题框，两侧金色双chevron箭头","theme_meaning":"科技/HUD","treatment":"reuse|theme-swap",
     "gen_hint":{"subject":"sci-fi HUD title frame with chevrons","aspect":12.9,"bg":"transparent"}},
    {"id":"ribbon_deco_R","asset":"pic11.png","box":[1013,535,185,163],"flipH":true,"role":"decoration",
     "desc":"青蓝渐变速度箭头(金句条右侧)","treatment":"reuse|theme-swap"}
  ]
}
```

**构建流水线（离线，重度用并行廉价模型 = "api 管够"的最大兑现处）**：
1. `parse_slide` + `parse_chrome` 抽**全参数**(本轮已实现：坐标/组变换/flip/rot/字体/字号pt→px/颜色含gradFill/srcRect/alpha + 版式背景)。
2. **VLM-describe 批(廉价模型海量并行)**：对每张抠出的图 → 生成 `desc` + `role`(background/decoration/icon/photo/diagram/hero) + `theme_meaning` + `treatment` 建议 + `gen_hint`(题材/比例/透明)；对每页 render → 生成 `description`+`archetype`+`slot_signature`+`tags`。**这是你"图片也要描述、页面也要标签"的核心,且必须看图(VLM),纯 XML 推不出'红旗飘带'语义。**
3. **去重**：模板页大量重复(同一套模板多次售卖)，按结构指纹去重，几万页压到几千代表页。
4. 入库 `study/corpus/pages/<id>.json` + render + 抠图，建检索索引(family×archetype×slot_signature×tags)。

> 长杆提醒：800 deck × ~20–130 页 ≈ 数万页，每页 parse + 多次 VLM。这是几小时~几天级离线批，但**一次建成、长期复用**，且天然可并行——正是廉价模型管够的用武之地。先按 §1 的 H2 剧本覆盖到的色系/原型优先建。

---

## 3 · 运行时流水线（6 阶段）

```
计划书md ─► S0 摄取 ─► S1 选页 ─► S2 绑定(大纲) ─► S3 素材解析 ─► S4 拼装 ─► S5 审查修复 ─► S6 导出
            按H2切      每H2选参考页   内容→槽位+图片决策   复用/换肤/AI生图   build_replica   渲染对比+修   svg→pptx
```

- **S0 摄取**：md 按 H2 切页 → 每页 `content_model`(标题/要点/数据点/可填字段)。
- **S1 选页**：每个 H2 → 用 playbook + 检索(archetype×family×**slot_signature 与内容形状匹配**) → top-K 参考页 → 选一(强模型定夺)。
- **S2 绑定 = 大纲(核心契约)**：把内容**绑进所选参考页的槽位**，产出 `page_binding`：
  - 每个 slot：填什么文字(**按 `cap` 容量预算**，超了就让"内容适配 worker"压缩)；
  - 每张 image：决策 **reuse / theme-swap / content-regen**(见 §5) + 若需生成则写好 `gen_request`(题材+box+比例+透明+skin)；
  - **deck skin lock**：全 deck 统一色板/字体/生图风格(防止多参考页拼出来花，见 §6)。
  - ⚠️ 大纲不再是"信息大纲",是"**每槽位/每图都已解析到具体动作**的执行契约"。
- **S3 素材解析**：执行 image 决策——reuse 直接拷；theme-swap 从库按新主题取同类装饰 或 AI 生图；content-regen 必 AI 生图。所有"图片渲染指令"(裁切/透明/重上色)在此**烘焙进 PNG**(本轮证明 SVG 滤镜在 Chrome 不可靠,且导出 PPTX 会丢)。
- **S4 拼装**：`build_replica`(确定性,无 LLM)——真背景+图(带 flip)按真坐标摆 + 文字按真字体真字号填绑定内容 + 容量自动缩字。
- **S5 审查修复**：每页 render → **VLM 对比参考 render + 机检(槽位溢出/图缺失/比例错/色板偏)** → 缺陷清单 → 强模型决策修复 → 回 S3/S4。
- **S6 导出**：finalize + svg_to_pptx。

---

## 4 · Agent / API 拓扑（你没想好的执行阶段，按 orchestrator–workers 设计）

**强模型(Claude，编排者)拥有"全局判断与一致性"；廉价模型(worker 池，按页/按资产并行)做"可验证的叶子任务"。** 这是 map-reduce。

| 角色 | 模型 | 输入 | 输出 | 并行度 |
|---|---|---|---|---|
| **Orchestrator** | 强(Claude) | 全文 + 参考库 + 缺陷反馈 | 选页/大纲/skin锁/一致性/修复决策/最终装配 | 串行(全局) |
| **librarian-describe**(离线) | 廉价 VLM | 一张图 / 一页 render | desc+role+theme+gen_hint / 页description+tags | **海量并行** |
| **content-fitter** | 廉价 | H2 文本块 + 某槽 `cap` 预算 | 适配该槽的文字(压缩/改写) | 每槽并行 |
| **prompt-smith** | 廉价 | 图 desc + 新内容 + box比例 + 透明需求 + skin | 一条生图提示词(满足大小/形状/风格) | **每图并行** |
| **image-gen caller** | 图像API(万相) | prompt + size | PNG → fit/crop/抠透明 | 每图并行 |
| **page-reviewer** | 廉价 VLM | 参考 render + 本页 render | 缺陷清单(位置/颜色/溢出/风格) | 每页并行 |
| **page-builder** | **无LLM(代码)** | page_binding + 资产 | 页 SVG | 每页并行 |

> 你的两个直觉都对且已落位：① "几个 api 设计生图提示词" = **prompt-smith 每图一个、并行**，且必须吃到 box 的大小/比例/透明约束;② 关键是 orchestrator 守住跨页一致性与最终判断,别让廉价模型做全局决策。

---

## 5 · 图片子系统（你思路的精华，三路决策 + 生成规格）

**每张参考图按 `role`+`desc` 走三选一**(这正是你说的"原来红旗→我换科技圆环 / 原来机器人→我换网站"的形式化)：

| 决策 | 触发(role) | 动作 |
|---|---|---|
| **reuse 原样** | 持久 chrome(bg/frame/nav)、与主题无关的纯装饰 | 直接拷真图。最高保真，最省。 |
| **theme-swap 换皮** | 主题性装饰(红旗飘带↔科技圆环↔麦穗)，含义=`theme_meaning` | 按 deck 新色系，从库取同 role 同尺寸的装饰 **或** AI 生图(同 `gen_hint` 比例)。位置不动。 |
| **content-regen 换芯** | 内容性图(机器人示意图、产品图、网站截图、流程图) | **必 AI 生图**：prompt-smith 用「本页新内容 + 原图 desc 的构图意图 + box 比例 + skin」造词 → 生成 → 放回原位。 |

**生图规格(prompt-smith 必带)**：目标 `box W×H` 与比例、背景要求(透明/深底/白底)、deck 锁定的 rendering×palette、主体题材、**禁文字**(文字在 SVG 层)。生成后 fit/crop 到 box；需透明的装饰若万相出不干净 → 背景去除兜底。

**图标用 AI 生图 vs 图标库——我的建议(你提的,需纠偏)**：**混合,别一刀切**。
- **功能性小图标**(home/chart/users/箭头…)→ **保留矢量库**：一套风格统一、任意尺寸清晰、可换色、零成本、对齐稳。AI 逐个生图标会**风格漂移、对齐/尺寸难控、慢、贵、透明麻烦**。
- **装饰/主视觉/家族motif/中心产品/背景**→ **AI 生图**(本就该,且更好看)。
- 折中：若你坚持要 AI 风格图标,**一次性批量生成一整套锁定风格的图标集**(同 prompt 骨架、同尺寸网格),而非逐页现生——否则一套 deck 里图标互相不像。

---

## 6 · 一致性与质量（你方案缺的两块，必须补）

1. **Deck skin lock(防花)**：你"每页各找各的参考页"会导致**多模板拼贴 → 色板/字体/风格打架**。对策：①优先**同一套源模板**内选页(最稳);②跨模板时,S2 锁一套 deck 级 skin(色板/字体/生图风格),拼装时**覆盖**各参考页的局部皮(文字按 skin 重著色、生图按 skin 统一 rendering)。
2. **Verify-repair 环(防崩)**：每页必过 page-reviewer(对参考)+机检(槽位溢出/图缺/比例/色板)。本轮反复证明:没有"渲回对比"就会自我感觉良好地交错的。
3. **无匹配兜底**：某 H2 找不到好参考 → 取最近原型的参考页 + 调整,或退 `ARCHETYPE_SPECS` 的参数化骨架;并标记人工。
4. **保真 vs 原创两档**：`reuse-verbatim`(直接用真模板图,最像,但是用了别人模板的图)↔ `regen-in-style`(连 chrome 都按 skin 重新 AI 生成,原创、可商用,略不那么像)。按用途切档。

---

## 7 · 对你方案的总评（你要的"指出不严谨处"）

| 你的设想 | 评价 | 改进 |
|---|---|---|
| 800 份逐页解析+配图组库 | ✅ 对，是地基 | 加**三层分离**(chrome/slots/images)+**去重**(几万→几千)+**slot 容量**字段 |
| 每图要描述 | ✅✅ 精华 | 必 **VLM 看图**生成(desc+role+theme+gen_hint),纯 XML 推不出语义；描述要**可驱动生图**(题材+比例+透明) |
| 每页要描述/标签 | ✅ 对 | 加 `archetype + slot_signature + content_shape`,选页靠**形状匹配**而非纯相似 |
| 每页都能找到参照(因格式固定) | ✅ 大体成立 | 配 **H2→参考页 playbook**;匹配按"槽位形状 vs 内容形状";**留无匹配兜底** |
| 大纲：参考列表+文档→规划→每页找参照 | ✅ 方向对 | 大纲=**绑定契约**:每槽位填什么(带容量预算)、每图三选一决策、deck skin 锁 |
| 执行：多 api 分工 | ⚠️ 你没想好 | **orchestrator(强)–workers(廉价并行)** map-reduce(§4):强模型守一致性,廉价模型并行做 fit/describe/prompt/review;**拼装是代码不是 LLM** |
| 多 api 设计生图提示词 | ✅ 对 | prompt-smith **每图一个并行**,必带 box 大小/比例/透明 |
| 图标也用 AI 生图更好看 | ⚠️ 部分对 | **混合**:功能图标留矢量库(统一/清晰/省),装饰主视觉才 AI;要 AI 图标则**整套锁风格批量生** |
| —(你没提) | 缺 | **一致性 skin lock + verify-repair 环 + 保真/原创双档**,必补 |

---

## 8 · 落地次序
1. **复刻工具链固化**：把本轮 `parse_slide/parse_chrome/build_replica` + PIL 图片效果烘焙,补 `srcRect/duotone/alpha` 完整还原,封成稳定模块。
2. **参考库小批验证**：先挑 H2 剧本覆盖的 ~30–50 页(几套医疗/科技模板)走完整流程(parse+VLM describe+入库)。
3. **跑通一页端到端**：选页→绑定→生图→拼装→审查,用焕白某 H2。
4. **接 worker 池**:把 describe/fit/prompt/review 拆成可并行廉价模型调用。
5. **扩到全 800 份**(离线批)+ **playbook 策展** + 端到端整本 deck。

## 9 · 验证发现 + 硬问题 × 阶段归属（2026-06-27，用「科技风通用模板」实测）

**实测对象**：`【科技风】挑战杯及互联网+通用模板.pptx`(25页) × `postppt.json`(28个H2)。
**关键事实**：
- 模板 25 页中 s01–03 是"字体&配色说明/换色教程"(s01 直接声明本套 skin：标题=圈欣意冠黑体、正文=OPPOSans R、主辅色)——**有些模板自带 skin 声明页，deck_record 可直接抽**；其余 ~22 页覆盖 **封面/目录/数据(原生图表)/内容/成果大数字/团队/专家/融资(3饼图)/市场/路线图/结尾 ~15 种原型**。
- **json content 内嵌 16 张 markdown 图 `![](res.chumojy.cn/...)`**=项目**内容图**(调研截图/技术路线图/检测报告/院士评价截图/媒体报道/产品图/2张Mermaid流程图)，**必须下载并填进"内容图槽"**。
- **数据(58亿→139亿/CAGR/专利3项/融资888万)全在文字里，json 不给饼图柱图**——数据页图表得按文字"造"。
- **28 H2 ≠ 22 页**：非 1:1，多个 H2 复用同一页型(项目背景/产业现状/深入调研/创新基础→同一内容版)。覆盖对**通用模板**已够好；长尾靠 800 套聚合 + 兜底。

### 硬问题 → 哪个阶段答 + 决策规则
| 你的问题 | 阶段 | 规则(记录在哪) |
|---|---|---|
| **模板结构不适合内容** | S1选页→S2绑定 | 先按**内容形状**选最贴页；仍不匹配：内容少→留空/省槽；内容多→选更大容量页 or **拆成两页(continuation)** or 照搬slot模式复制；全无匹配→退 `ARCHETYPE_SPECS` 参数化骨架。记 `binding.fit_strategy` |
| **图片哪些换/哪些留** | 离线(打role)→S2 | 每张模板图离线 VLM 打 `role`：**content-placeholder→换**(填 json 内容图 或 AI生)；**decoration/chrome/background→留**。记 page_record.images[].role + binding 的 keep/replace |
| **json 图片链接** | S0/S3 | 下载 16 张 chumojy 图→按 H2+alt 编目→S2 绑到内容图槽(语义匹配 alt↔槽含义) |
| **某页参考哪一页** | S1选页 | H2→playbook(预策展映射) + 检索 archetype×slot_signature×family。记 `binding.reference_id` |
| **800套真能覆盖所有页型/槽位?** | — | **不保证逐套全，但聚合够**：单套通用模板已覆 ~15 原型；标准 H2(半固定)绝大多数命中；**长尾用参数化骨架兜底**。诚实结论：corpus 覆盖 80%，骨架补 20% |
| **数据页饼图——照抄还是改?AI生还是画?** | S2决策→S4建 | **改，不抄**：模板图表只给**类型+样式**；用 json 数字**重做数据**。**矢量画(不AI生)**——AI 生不准数据、矢量才保风格一致。结构取自**图表模板库**(ppt-master `templates/charts/` 70种)或读模板原生 chart 结构，套 skin。记 `binding.charts[]{type,data,chart_template}` |
| **参考没给柱状图,要做柱图怎么办** | S2/S4 | **图表是独立资产类**，不依赖页参考有没有：从图表模板库取柱图结构 + json 数据 + skin 矢量画。页参考缺图表不影响 |
| **这些思考在哪记录** | — | 绝大多数决策落在 **S2 的 `page_binding`**(选页/每槽内容/每图keep-replace/每图表type-data/fit策略)；图片role/skin 在离线 page_record/deck_record |

### 由验证新增的两条架构结论
1. **图表是独立资产类(vector,data-driven,skinned)**：不靠页参考自带，自有"图表模板库"(类型骨架)+ json 数据 + deck skin。**永远矢量画、永不 AI 生 / 永不照抄原数据**。
2. **图片 role 是"换/留"的唯一判据**，离线 VLM 打标；json 的 16 内容图按 H2+alt 语义绑进 content-placeholder 槽，decoration/chrome 一律留。

> 诚实评估：项目确实难，但**硬问题都有答案、且都能归到具体阶段**。最硬的残留=①数据页矢量图表重建(从文字数据)②结构不匹配的 count-adapt——都是真工程量，但有章可循(图表模板库 + 选页优先 + 拆页兜底)。

## Changelog
- v1.2(用户细调)：①**自由预算三档**(strict/guided/free，默认 guided=LLM 只产 `page_binding`、代码扣脚手架→坐标色字漂移结构上不可能；"保真>自由，宁死板不失真")；自由严重偏锁，只放内容/适配/数量(先选页)/生图题材。②**装饰也走角色槽**，skin 含「主题装饰集+背景」，`resolve` 把文字+装饰+底一起换皮(跨套混搭)。
- v1.1(用户修正)：松绑地基原理——**主路改为"LLM 带真实数据脚手架、有余地地生成 SVG"**(确定性只锁 skin token+chrome 位置,内容区交 LLM 设计,verify 兜底);确定性 build_replica 降级为基线/兜底。参考库加 **deck 级 skin(theme/palette/typography,来自 theme1.xml)**;page 级颜色字体改存**语义角色**,`resolve(page,skin)` 实现"取 B 版式套 A 皮"的跨套混搭。
- v1：确立"LLM 选/裁/写/审、代码拼装"地基；三层参考库 schema(chrome/slots/images,每图每页VLM描述+标签+生图hint+槽位容量);6阶段运行时;orchestrator–workers 拓扑;图片三路决策+生图规格;图标混合策略;skin锁+verify环+保真/原创双档;对用户方案逐条评注。
