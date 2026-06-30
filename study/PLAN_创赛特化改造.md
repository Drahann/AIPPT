> ⚠️ **已被取代（2026-06-27）**：本文(及其 P-mirror/pptx_to_svg 自动转 SVG 路线)是早期探索，部分结论被实测推翻。**当前唯一基准 = `ARCH_复刻驱动生成.md`**(解析真OOXML→脚手架→LLM有界生成→代码渲染)。本文留作历史，勿当现状。

# 创赛 PPT 生成系统 · 特化改造硬规格（PLAN v1 · 已被 ARCH 取代）

> 目标：把开源的通用 `ppt-master` **特化（fork）为创赛专用生成系统**。
> 立场：保留 ppt-master 扎实的机械层（SVG→原生 pptx 导出、字体栈、icon、live-preview），**驯化/覆盖**与创赛对着干的通用默认，**新增**一整层创赛专用智能。
> 权威级别：本文 = 落地蓝图与契约定义；与 `CODEX_创赛风格圣经.md`（风格真值）、`assets_lib/`（素材真值）配套。
> 读者：实现者（人或 AI）。每条都要精确到"改哪个文件、加哪个字段、什么 schema、什么验收"。

---

## Part 0 · 根因复盘（为什么前几次失败）—— 三条断链

| # | 断链 | 证据 | 后果 |
|---|---|---|---|
| 1 | **大纲是"信息大纲"，不是"构图大纲"** | Strategist §IX 只产出"每页讲什么"，不带原型/密度/装饰/素材/金句 | 信息大纲天然产不出创赛 → 回退西式留白 |
| 2 | **契约不携带创赛智能，且部分语义反创赛** | `spec_lock` 只锁 color/font/icon/image/rhythm；`breathing` 语义=「裸文字+留白」，与 CODEX「锚点放空=满铺氛围」**正相反** | 越是封面/章节这种创赛最有辨识度的页，契约越把模型往纯留白推 |
| 3 | **素材库只有"零件"，丢了"构图"** | `harvest_assets.py:76` 只抠 `ppt/media/*`；`00_corpus_index.csv` 只到 deck 级 | 1360 张积木无拼装图纸 → AI 不知道哪里放什么 → 用得少、用得蠢 |

**改造的核心命题：把"创赛风格"从"指令"变成"规格 + 参照 + 反馈"。**
- 不靠 guideline 让模型"记得要致密"（长 deck 必漂移）；
- 靠**已填好构图的镜像模板 + 已落盘的真素材 + 必须通过的密度检查**，让模型**没有发挥（=回退）的余地**。
- pilot（B1→B3）成功就是因为它无意中具备了这三件；全流程失败就是因为三件全断。

---

## Part I · 架构总览 —— 两个本质不同的活儿，串行做

ppt-master 把"内容创作"和"风格还原"揉进一次 Strategist + 一次 Executor，于是**风格的活儿永远输给内容的活儿**。特化版强制拆开、串行：

```
┌─ 活儿 B：内容创作（真·LLM 创造性）──────────────┐   ┌─ 活儿 A：风格还原（接近确定性·誊抄）──────────────┐
│ postppt.json                                      │   │ 构图大纲（已选好真实构图 + 已解析真素材）          │
│   → 内容模型(facts + 叙事节拍 + 逐节金句)         │ → │   → 镜像誊抄生成 + 密度机检 + render-back 对比      │
└───────────────────────────────────────────────────┘   └────────────────────────────────────────────────────┘
        S0 摄取        S2 叙事         S3 构图大纲      S4 素材策展        S5 誊抄生成      S6 后处理导出
```

**两条贯穿全程的"真值轴"：**
- **风格真值** = `CODEX` + `ARCHETYPE_SPECS`（逐原型处方）。
- **构图/素材真值** = **构图语料库（slide 级，新建·中枢）** + 原子素材库（`assets_lib`，已建·补丁）。

---

## Part II · ★中枢重建：构图语料库（Composition Corpus）

> 这是本次改造**最高杠杆**的新增物，直接回应"没发挥模板库威力"。
> 一句话：**把 1522 个 deck 不只抠成零件，更要编目成"逐页构图范例"，让生成阶段不是"发明构图"，而是"检索一个国金设计师已经排好的真实构图，誊抄进去"。**

### II.1 三级素材智能（重新定义"提取"）

| 级别 | 粒度 | 内容 | 现状 | 用途 |
|---|---|---|---|---|
| **L2 构图级**（新·核心） | 一张幻灯片 | 整页构图：原型/密度/槽位/用了哪些资产/金句/标题字效/可编辑形式 | ❌ 缺失 | **检索一张真实构图当镜像底**——"哪里放什么"由真人金奖设计师决定 |
| **L1 关系级**（新·轻量） | 资产↔幻灯片 | 共现：选了这张背景，通常配哪些装饰 | ❌ 缺失（但 MANIFEST 留了 `src_deck`/`sha1`，可派生） | 补丁智能：gap 该配什么 |
| **L0 原子级**（已建） | 一张 PNG | 去重零件：bg/fx/decoration/cutout + family/category | ✅ 1360 张 | **gap 填充 + 换 family 皮**（换色靠换图） |

**前任只做了 L0，且只把它当孤立零件用。L2 才是模板库的真正威力。**

### II.2 构图语料的 schema（`study/corpus/slides_index.jsonl`，一行一页）

```jsonc
{
  "slide_uid":   "<deck_sha1>_<NN>",        // 主键
  "deck":        "创赛精选PPT/深瞳智检.pptx",  // relpath（来自 00_corpus_index.csv）
  "family":      "tech_blue",               // 色系（来自 corpus_index.family；逐页可被 VLM 修正）
  "track":       "keji",                    // 赛道
  "gold":        true,                       // 是否金奖级（corpus_index.gold）
  "slide_idx":   8,  "slide_count": 28,      // 位置 → 原型先验（首页=cover；末页=ending）
  "thumb":       "corpus/thumb/<uid>.png",   // 缩略图（检索/人审/VLM 输入）
  "render":      "corpus/render/<uid>.png",  // 高清渲染（镜像参照对照）
  "archetype":   "solution",                 // 原型（见 ARCHETYPE_SPECS 枚举）
  "arch_conf":   0.82,                        // 置信度（启发式低则 VLM 复核）
  "density":     96,                          // 绘制元素数（python-pptx 统计）
  "slot_sig":    "3col",                     // 槽位签名：3col/4kpi/2chart/hero/portrait_grid/numbered_menu...
  "has_ribbon":  true,                        // 检出金句条
  "has_chrome":  true,                        // 检出赛事条/校徽
  "title_fx":    "gold-glow",                // 标题字效
  "media_sha1":  ["ab12..","cd34.."],        // 本页用到的原子资产（回链 MANIFEST/L1）
  "editable":    "svg",                       // svg=pptx_to_svg 可转镜像 | fill=只能 native 填字 | none
  "src_pptx_slide": "corpus/slides_pptx/<uid>.pptx"  // 单页 pptx（template-fill 用）
}
```

### II.3 提取流水线（重写 harvest，多粒度）

> 新脚本目录 `study/_scripts/corpus/`。复用已有 `render_decks.ps1`（COM 渲染，已装 299 字体）。

1. **`render_slides.ps1`**（改造 `render_decks.ps1`）：每个 deck **逐页**导出 PNG → `corpus/thumb/`（小）+ `corpus/render/`（大）。这是 L2 的视觉底座。
2. **`index_slides.py`**（新）：用 python-pptx 遍历每页 →
   - 统计 `density`（shape 数）、抽 `media_sha1`（回链 L0）、检测 `has_ribbon`（底部整幅大色条+大字）/`has_chrome`（顶部赛事条/角落小 logo）/`slot_sig`（按 shape 聚类与位置推断）。
   - 写 `slides_index.jsonl` 草稿（`archetype` 先用**启发式**：`slide_idx==0→cover`；含"谢谢/感谢/联系"→`ending`；含巨型数字+章节名→`chapter`；含图表 shape→`data`；3 个等宽面板+ribbon→`content/solution`；人像网格→`team`）。
3. **`classify_archetype.py`**（新·可选 VLM）：对 `arch_conf<0.7` 或启发式冲突的页，把 `thumb` 喂视觉模型分类（你们已有图像 API，加一个 vision 端点即可）。**这一步是"提取需要再思考"的关键**——原型分类必须看图，不能只看 XML。
4. **`build_corpus_sheets.py`**（复用 `build_contact_sheet.py`）：按 `(archetype × family)` 出 contact-sheet，供人审抽查与挑"金范例"（标 `gold_pick`）。
5. **L1 共现**：从 `media_sha1` + `deck` 派生 `cooccur.json`（资产 A 与 B 在同页出现的频次），喂 gap 填充。

### II.4 检索接口（构图语料如何"嵌进流程"）—— `corpus_query.py`（新）

生成阶段不再"发明构图"，而是**检索**：

```bash
python corpus_query.py --archetype solution --family tech_blue \
       --slot 3col --density-min 85 --gold-only --topk 5
# → 返回 5 张最匹配的真实幻灯片（uid + thumb 路径 + density + slot_sig + editable）
#   供构图大纲选作镜像底；--copy <proj>/refs/ 同时落地参照图与单页 pptx
```

排序：`gold` > `slot_sig` 精确匹配 > `density` 落在原型目标带 > `family` 命中 > `arch_conf`。

**这一步把"模板库威力"真正接入：每页 = 从 ~万张真实国金构图里检索一个最贴的，誊抄。**

---

## Part III · 生成路径决策（誊抄的三种实现）

> 关键工程取舍：同一个"誊抄"理念，有三条实现路径，**按页型路由**（写进 ARCHETYPE_SPECS）。

| 路径 | 机制 | 保真度 | 灵活度（改数据/换色/换family） | 适用页型 |
|---|---|---|---|---|
| **P-mirror（SVG 镜像）** ⏸️ **PARKED**（冒烟测试否决） | `pptx_to_svg.py` 把真页转 SVG → mirror 只改文字 | ~~高~~ → **不足**：丢深色底/图塌1×1/特效降级（`smoke_pptx_to_svg/FINDINGS.md`） | — | ~~content/section~~ → 全部改 P-roster+COM-PNG参照 |
| **P-roster + COM-PNG 参照（★主路径）** | `corpus_query` 返回真页 **COM 渲染 PNG** 当可见参照 → Executor 照着 PNG + 取 assets_lib 真零件 → 手写干净 SVG 骨架 | **高**（参照真值保真；输出可控） | **高** | **所有原型** |
| **P-fill（原生填字）** ⏸️ **PARKED** | `template_fill_pptx.py` 直接在真页 native pptx 上换文字 | **最高**（就是真页本身） | 低（只能填进现有文本框；不能重构图表/换色） | ~~cover/chapter/toc/ending~~ → **暂由 P-mirror 顶替**（决策 IX.2：SVG 优先，导出后议） |
| **P-roster（参数化骨架）** | 手写干净 SVG 骨架（`chuangsai_keji` 家族），可换 family 皮、可画图表 | 中（取决于手写质量） | **高** | data/KPI/chart、team——重项目数据、需重排/换色 |

**核心洞察（冒烟测试后修订）：唯一完全保真的产物是 COM 渲染的真页 PNG。** `pptx_to_svg` 会丢深色底/塌图/降特效（已验，FINDINGS.md），所以不把真页当"可编辑镜像底"，而把它的 **COM 渲染 PNG 当"可见视觉参照"**——模型能直接*看见*金奖设计师的构图/密度/资产位置，照着在干净可编辑 SVG 里复刻，并从 `assets_lib` 取真零件补皮。**这既让模型没有"回退留白"的余地（有真页摆在眼前对照 + density_check 兜底），又绕开转换器数据丢失，输出还干净可换色可改图表。**

> `replication_mode: mirror`（ppt-master 内置誊抄原语）暂不启用——依赖 pptx_to_svg 保真，已 parked。待转换器修复 white-bg / 1×1-image 两 bug 后可作为补充路径回归。

---

## Part IV · 流水线分步硬规格（S0–S6）

> 形态建议：**新建创赛专用 skill**（`skills/chuangsai/SKILL.md`），复用 ppt-master 的 scripts/templates/icons，但用自己的 step 序列与契约。下表"对应 ppt-master"列标注 keep/modify/replace/add。

### S0 · 摄取 Intake　（对应 Step1+2，modify）
- **输入**：`postppt.json`（结构：`title[]`={sub_questionText, sub_answer} + `content` markdown）。
- **新脚本 `chuangsai_intake.py`**：**注意编码**（postppt.json 实测为 GBK/含替换符，必须 `chardet` 探测后解码，不能默认 utf-8）。
- **输出 `content_model.json`**（纯内容，无风格）：
```jsonc
{
  "facts": { "project_name":"", "one_liner":"", "track":"", "school":"",
             "leader":"", "advisor":"", "group":"", "competition_full":"", "logo_hint":"" },
  "raw_sections": [ {"q":"项目简介","a":"..."} ],   // 来自 title[] + content 切分
  "hard_data": [ {"label":"市场规模","value":"68%","note":"..."} ]  // 抽出的可视化数据点
}
```
- **验收**：facts 至少抓到 project_name + track；hard_data ≥ 文档中出现的数字指标数。

### S1 · 选皮 Skin　（对应 Step3，replace 通用 free-design）
- **family 路由（确定性映射）**：项目领域 → 色系。规则表写进 `chuangsai/skin_router.md`（如：医疗器械/AI/工科→`tech_blue`；农业/乡村振兴/环保→`agri_green`；红旅/党政/公益→`red`；非遗/文创→`heritage_gold`）。postppt.json 这个高值医疗耗材/血管支架项目 → `tech_blue`。
- **锁定**：`brand=chuangsai_tech_blue` + `layout=chuangsai_keji`（参数化骨架）+ **构图语料检索域** `family=tech_blue`。
- **验收**：family 唯一确定；brand/layout 路径存在。

### S2 · 叙事 Authoring（活儿 B 创造性核心）　（对应 Strategist 内容部分，modify）
- LLM 把 `content_model` 重组成**路演叙事节拍**，按 CODEX 典型序列（封面→目录→章节→背景/痛点→方案/技术→数据/成果→商业→团队→结尾）。
- **每个节拍必须钦定 `takeaway`（金句）**——CODEX Part II.6：金句是创赛页的"句号"，AI 从不主动写。**这是 S2 不可省的产物。**
- **输出 `outline_content.json`**：
```jsonc
{ "beats": [
  { "id":"B03", "archetype":"pain_point", "intent":"高值耗材卡脖子",
    "payload": { "title":"", "kicker":"", "points":[...], "panels":[...] },
    "takeaway":"把高值耗材的命脉，焊回中国制造",
    "data_refs":["hard_data[2]"] } ] }
```
- **验收**：每个 content/data/solution 节拍都有非空 `takeaway`；archetype ∈ 枚举。

### S3 · 构图大纲 Composition Outline（活儿 A 规划·**单点最高杠杆**）　（replace §IX 信息大纲）
- 把每个 beat 落成**一页构图契约**：定原型→定生成路径→**检索真实构图底**（调 `corpus_query.py`）→定密度→定槽位→挂金句。
- **输出 `page_plan.json`**（一项一页）：
```jsonc
{ "page":"P07", "beat":"B05", "archetype":"solution",
  "gen_path":"P-mirror",                       // 来自 ARCHETYPE_SPECS 的路由
  "ref_slide":"a1b2_09",                        // corpus_query 选中的真实构图底（镜像源）
  "variant":"03_content.svg",                   // 若走 P-roster，则参数化骨架文件
  "rhythm":"dense", "density_target":95,
  "slots": { "header":"血源涂层一体化方案","kicker":"INTEGRATED COATING",
             "panels":[{...},{...},{...}], "takeaway":"…" },
  "assets": { "bg":"tech_blue_background_0012.png",
              "fx":"neutral_fx_lightarc_0003.png",
              "decor":["tech_blue_decoration_ring_0007.png"],
              "texture":"tech_chip.png",
              "gaps":[ {"need":"血管支架 3D 抠像","why":"方案页中心舞台","resolve":"ai"} ] },
  "decor_checklist":["bg","particles","hud_corners","sidebar_scale","ribbon"] }  // ❶..❿ 必现项
```
- **关键纪律**：构图大纲一旦长这样，生成=誊抄，不是发明。**信息大纲永远保不住风格，只有构图大纲能。**
- **验收**：每页有 archetype + gen_path + (ref_slide 或 variant) + density_target + 非空 takeaway；assets 全部解析到具体文件名或登记成 gap。

### S4 · 素材策展 Asset Resolution　（replace Step5，本地真库优先）
- **决策规则（消解你"该不该用那张装饰"的纠结，前移到此）**：
  1. 走 P-mirror/P-fill 的页：背景/装饰**已冻在真页里**，无需另取；只需 family 一致。
  2. 走 P-roster 的页：按 `archetype+family` 查 `MANIFEST`（`asset_query.py`，**已规划**）取 bg/fx/decoration/texture/cutout → 复制进 `images/` → 记确切文件名+放置(z序/缩放/alpha)。
  3. **gap（库里没有、原型按 CODEX 必须有）→ AI 生图**：写 `images/image_prompts.json`（ppt-master 标准 manifest），跑 `image_gen.py --manifest`（后期接 gpt-image）。
- **AI 生图参数怎么记**（直接用 ppt-master 既有字段，留审计痕迹）：`{filename, prompt, deck_rendering, deck_palette, color_scheme{}, page_role, text_policy, aspect_ratio, image_size, status}`。提示词遵守：deck 级 rendering×palette 已锁→**提示词只写 subject+intent+composition，不重复风格词/HEX**；hybrid 铁律→**PNG 只做氛围/辉光/繁复装饰/抠像，chrome/文字一律矢量**。
- **铁律**：一个"自发想加的装饰" = page_plan 里的一个 gap，**必须在生成前解析成一个具体文件（库里的或 AI 的），绝不允许 Executor 生成时临时塞 `<image>`**。临时塞=不可控=回退先验。
- **验收**：page_plan 无悬空 gap（全部 → 文件 or `image_prompts.json` 条目 + 状态 Generated/Needs-Manual）。

### S5 · 誊抄生成 Transcription　（modify Step6，镜像优先 + 机检 + 反馈）
- **按 gen_path 路由**（见 Part III）。P-mirror：复制 `pptx_to_svg` 出的镜像 SVG → 只改 `<text>` 填 slots → family 一致则 href 不动。P-roster：继承骨架 + §VI 装饰系统填到密度。P-fill：native 换文字。
- **逐页机检（新脚本 `density_check.py`，扩展 `svg_quality_checker`）**：
  - 数绘制元素 → **< `density_target` 直接 FAIL**，打回重填。
  - 校验 `decor_checklist` 命中（❶❷❸ 必现）。
  - 校验所有 href family 一致（别拿蓝光当绿光）。
  - 校验金句条存在（has_ribbon）。
- **render-back 反馈环设为创赛默认（不是 opt-in）**：每页渲 PNG，与 `ref_slide` 真页 + 密度目标对照（`render_compare.py` 新，复用 COM 渲染）。pilot 赢的另一半就靠这个；通用 `visual-review` 是选项，创赛必须默认开。
- **覆盖通用反创赛默认**：
  - 新建 `modes/chuangsai.md`（叙事骨架）+ `visual-styles/chuangsai_keji.md`（致密合成美学，§2 标题字效=金渐变+发光+描边）。
  - **重定义 rhythm**：创赛 fork 里 `anchor` = "放空但满铺氛围+焦点光+数字水印+chrome"（不是裸文字留白）；删/改通用 `breathing`。因为 anchor 页走 P-mirror/P-fill 真页，密度天然保住——**镜像真页顺手把 breathing 反创赛问题消解了**。
- **spec_lock 创赛扩展**（让智能扛住逐页重读、抵抗漂移）：新增 per-page 段 `page_archetype` / `page_genpath` / `density_target` / `decor_checklist` / `page_takeaway` + deck 级 `family`。
- **验收**：每页过 density_check（≥目标、checklist 齐、family 一致、有金句条）；render-back 自评 ≥ 国金。

### S6 · 后处理导出　（对应 Step7，**keep 原样**）
- `total_md_split.py` → `finalize_svg.py` → `svg_to_pptx.py`。这套机械层扎实（pilot 验证），**不动**。
- 注意：P-fill 路径的页是 native pptx，需与 SVG 页合并导出——`pptx_template_import` + `svg_to_pptx` 的合流策略见 Part VII 开放问题。

---

## Part V · 要新建/改的清单（精确到文件）

### V.1 数据与契约（schema）
| 物 | 路径 | 状态 |
|---|---|---|
| 逐原型构图处方 | `study/ARCHETYPE_SPECS.md` | **新**（Part VI） |
| 构图语料索引 | `study/corpus/slides_index.jsonl` | **新** |
| 内容模型 | `<proj>/content_model.json` | **新** |
| 内容大纲 | `<proj>/outline_content.json` | **新** |
| 构图大纲 | `<proj>/page_plan.json` | **新**（替代 §IX） |
| spec_lock 创赛扩展段 | `<proj>/spec_lock.md` | **改**（加 5 个 per-page 段 + family） |
| family 路由 | `skills/chuangsai/skin_router.md` | **新** |

### V.2 脚本
| 脚本 | 作用 | 复用 |
|---|---|---|
| `corpus/render_slides.ps1` | deck 逐页渲 PNG | 改 `render_decks.ps1` |
| `corpus/index_slides.py` | python-pptx 编目（密度/槽位/ribbon/chrome/media 回链） | 新 |
| `corpus/classify_archetype.py` | VLM 看图分原型 | 新（接 vision API） |
| `corpus/build_corpus_sheets.py` | 按原型×family 出审图 | 改 `build_contact_sheet.py` |
| `corpus_query.py` | **检索真实构图底**（生成阶段调） | 新·中枢 |
| `asset_query.py` | 查 MANIFEST 取原子资产→copy | 新（RULES §2 已定逻辑） |
| `chuangsai_intake.py` | postppt.json→content_model（编码鲁棒） | 新 |
| `density_check.py` | 逐页密度/checklist/family 机检 | 扩 `svg_quality_checker.py` |
| `render_compare.py` | render-back 对照真页 | 复用 COM 渲染 |

### V.3 模板/参照资产
| 物 | 动作 |
|---|---|
| `chuangsai_keji` roster | **补全** toc/chapter/team/ending/business 变体（现仅 cover/content/data），并加**槽位变体**（content_3col/4col、data_4kpi/2chart…） |
| roster 各页设 `replication_mode` | content/data 类→可保留参数化；cover/chapter/ending→优先指向真页镜像 |
| 其它 family brand | 建 agri_green/red/heritage_gold/med 的 brand 皮（CODEX Part IV 已有真值 hex/字体） |
| `modes/chuangsai.md` + `visual-styles/chuangsai_keji.md` | 新建，覆盖通用反创赛默认 |

---

## Part VI · `ARCHETYPE_SPECS.md` 的结构（CODEX 从"描述"→"处方"）

每个原型一节，字段固定（生成阶段机器可读）：

```
## archetype: solution（方案/技术）
gen_path: P-mirror              # 首选生成路径（Part III）
rhythm: dense
density_target: 95              # 来自 CODEX 实测
slot_sig: 3col                  # 检索签名
required_chrome: [校徽常驻]
required_decor: [bg.atmosphere, fx.light_arc(中心舞台), hud.corner, decoration.ribbon(金句), particles]
                                # 对应 assets_lib category，density_check 据此校验
takeaway: required              # 金句必现
title_fx: gold-glow
corpus_filter: {family:auto, slot:3col, gold:true}   # corpus_query 默认过滤
fallback: P-roster(03_content.svg)                   # 检索无果时
content_fit: 中央设备/产品舞台 + 左右框面板 + 流程箭头 + 底金句   # CODEX Part III 构图规则
```

九个原型：`cover / toc / chapter / pain_point / solution / data / business / team / ending`（枚举 = S2/S3/语料分类共用字典）。逐项填，原料全在 `CODEX Part II/III/IV` + `RULES §5 recipe` + `chuangsai_keji §VI`。

---

## Part VII · 分阶段落地 + 验收门

| 阶段 | 交付 | 验收门（硬指标） |
|---|---|---|
| **P0 处方定型** | `ARCHETYPE_SPECS.md`（9 原型全字段） | 每原型有 density_target/required_decor/gen_path/corpus_filter；与 CODEX 数值一致 |
| **P1 构图语料** | `slides_index.jsonl` + thumb/render + `corpus_query.py` | 1522 deck 全逐页编目；随机抽 30 页人审，archetype 准确率 ≥85%；query 能按原型×family×slot 返回 topK |
| **P2 契约与默认覆盖** | spec_lock 扩展段 + `modes/chuangsai` + `visual-styles/chuangsai_keji` + rhythm 重定义 | 单页生成不再被 breathing 拉向留白；spec_lock per-page 段被逐页重读 |
| **P3 roster 补全** | toc/chapter/team/ending/business + 槽位变体 + 镜像化 | 每原型至少 1 个可誊抄底（真页镜像 or 参数化） |
| **P4 机检与反馈** | `density_check.py` + `render_compare.py` 默认接入 S5 | 低于密度目标的页被自动打回；每页有 render-back 对照 |
| **P5 端到端** | 用 `postppt.json` 跑全程（tech_blue 医疗项目） | 见下「黄金验收」 |

**黄金验收（P5，用真文档）**：
1. 每个 content/solution/data 页 density ≥ 90；
2. 七大创赛标记齐全（赛事chrome·金渐变发光标题·参赛pill块·页眉牌+«»·三栏HUD面板·金句ribbon·底部章节nav）；
3. 每个 content/data 页有金句；
4. 真实素材被实际使用（每页 ≥1 个来自语料的真背景/特效/装饰，或 ≥1 个检索到的真页镜像）；
5. render-back 自评 ≥ 国金（对照 corpus 同原型金范例）。

---

## Part VIII · 回应你最初的子问题（逐条落点）

| 你的问题 | 本计划的落点 |
|---|---|
| 什么是创赛风格、特点是什么 | `CODEX`（已成）+ `ARCHETYPE_SPECS`（把描述变处方·Part VI） |
| 拿到 postppt.json 怎么给大纲、大纲写什么 | **构图大纲 page_plan**（S3）：原型/路径/真构图底/密度/槽位/金句/已解析素材——不是信息大纲 |
| 模板里那张装饰该不该用 / 自发想加但没现成 / AI 生图提示词放哪参数怎么记 | **S4 素材策展**：真库优先→gap 才 AI 生图；决策前移到规划期；参数记进 `image_prompts.json`（含 rendering/palette/aspect/placement） |
| 生成阶段怎么完美还原模板 | **S5 镜像誊抄**（`replication_mode: mirror`）+ density_check 机检 + render-back 默认反馈 + 覆盖反创赛默认 |
| 是风格指导错 / 大纲错 / 还是 ppt-master 局限 | 主因=大纲（信息→构图，S3）；其次=ppt-master 通用默认反创赛（Part 0 链2、S5 覆盖）；CODEX 方向对、缺处方化（Part VI）。**ppt-master 机械层留用，智能层特化重建。** |
| **没发挥模板库威力** | **Part II 构图语料库**：提取从"只抠零件(L0)"升级为"逐页构图编目(L2)+共现(L1)"；生成阶段 `corpus_query` 检索真实金奖构图当镜像底——"哪里放什么"由真人金奖设计师决定，不再靠 AI 猜 |

---

## Part IX · 决策（已锁定 2026-06-26）

1. **形态 → 独立 `skills/chuangsai/`**。复用 ppt-master 的 scripts/templates/icons/导出，但自带 step 序列与契约，不被通用默认污染。
2. **生成路径 → 全程 SVG（P-mirror + P-roster），P-fill 整体推迟**。决策依据：先把 SVG 质量验过关，再回头处理导出。
   - ⇒ **级联影响**：① 所有原型 `gen_path ∈ {P-mirror, P-roster}`，**不出 SVG 空间**；② P-fill(native 真页填字) 与 S6 的「SVG 页 / native 页混合导出」整块 **parked**，待 SVG 质量验收通过后再启。
   - ✅ **2026-06-26 冒烟测试已结门（证据 `study/build_loop/smoke_pptx_to_svg/`）**：`pptx_to_svg` 对复杂创赛页**结构性数据丢失**——深色氛围底被换成白底 rect、填充图塌成 1×1px、高端标题特效降级。**P-mirror 整体 parked**（留待转换器修 bug）。
   - ⇒ **路径 pivot：P-roster 成为唯一主路径**，但不再"凭空发明"——而是 `corpus_query` 检索 → 返回**真页的 COM 渲染 PNG 当可见视觉参照** → Executor 照着 PNG + 取 `assets_lib` 真零件 → 生成干净可编辑可换色 SVG。**制胜三件套 = COM真页PNG(参照) + assets_lib(真零件) + P-roster(可编辑)**。主路径**不再依赖 pptx_to_svg**。
3. **构图语料规模 → P1 先编目 763 个 .pptx**；759 个 legacy `.ppt`（COM 转 pptx）列 Phase-2。
4. **VLM 原型分类 → 引入**。对启发式低置信页用视觉模型分类原型 + 打分金范例（`classify_archetype.py`）。
5. **版权立场 → 用户拥有该模板库**，输出用途边界由用户把控（P-fill parked，暂不涉及）。

---

## Changelog
- **v1（本文）**：确立两活儿串行架构；**新增构图语料库为中枢**（修正"只抠零件"的提取哲学）；镜像誊抄为生成主原语；逐原型处方 ARCHETYPE_SPECS；三生成路径按页型路由；density_check + render-back 为默认；分阶段验收门 + 黄金端到端验收。
