---
name: chuangsai-deck-gen
description: 从计划书(按 H2 切页)生成"金奖级"创赛 PPT 页。复刻驱动——每页选一张真实参考页，用我们的内容把它"复刻"出来：成品要肉眼像那张参考(同底图/同配色/同装饰/同布局)，只换文字、统一字体，内容零删减。触发：用户要生成/复刻创赛 PPT 页、做样张、验证某 H2 成页效果。
---

# 创赛 PPT 生成 · 复刻参考页（首过即像）

**一句话**：每页选一张结构最贴内容的真实参考页，照它**复刻**一遍——同底图、同配色、同装饰、同布局，只把文字换成我们的、字体统一。**"像不像那张参考"是第一质量指标**，目标是**首过就像**；检查工具(deco_check 等)只是安全网，不是用来反复打回的主手段。权威细节见 `W:\ppt\study\engine\PIPELINE.md`。

## 0 · 七条核心（照做，首过就对）

1. **复刻，不是填槽、也不是另起炉灶**。选一张真页，把它的底图/配色/装饰/布局**重画一遍**，只换文字。不要"在参考的语言里自由发挥"——那会越走越不像。先对着参考想"这页长什么样"，再用我们的内容把它实现出来。

2. **用参考自己的皮，不换皮**。每页用它所在 deck 的 `clean_base` 底图 + 它的配色 + 它的装饰资产。**不强求整本同背景/同色**——只要求：①所选参考都同属一个**大类**(科技 / 医疗 / 红旅 / 农业)；②**字体与字号 ramp 全本统一**。放开皮锁正是为了让每页能贴着参考复刻、最大化相似度；整本的统一感由"同大类 + 统一字体"提供。

3. **一切装饰底层都是图片（含年份胶囊/标签/导航条/底板），绝对禁止自画矢量充数**。卡片套 `card_frame` 图、要点坐 `pill/bullet_marker` 背景图、大数字垫 `number_backplate` 图、标题配 `title_flank`、四角 `corner_hud`、主视觉 `motif`、年份/序号/小标签也要坐**真徽章/胶囊/标签条图**(库件或 `gen_deco`)。**任何 `pill`/填充 `polygon`/圆角底板 `rect` 自画矢量当装饰背景 = 直接判负**(`deco_check` 的 NO-SELF-DRAW 门，2026-06-30 用户问题3)。只有：纯数据图(`pie/cards/bar`)、坐标轴/分隔细线、整版 scrim 可用矢量。**优先复用参考自己的装饰图**(`deco_skeleton` 的 corpus 真图路径)；不合适就 `gen_deco` 按这个框尺寸现生。

4. **每页冷启动、独立文件夹、零跨页复用**。每页一个 `pXX_<名>/_assets/`，里面**只准**放：(a)从**原参考 deck 的 `corpus/<deck>/assets/`** 拷来的真装饰，或 (b)为**本页这些框**新生的 AI 图。**严禁** `cp` 隔壁页 `_assets` 的任何 AI 生图(底图/导航/光晕/分子…一律不许)——那是跨页复用，`page_gate` 的 PROVENANCE 门按字节哈希判负(2026-06-30 用户问题1)。"同尺寸框可复用同一张"**只在本页内部**成立，**不跨页**。排到框才按框尺寸现生，禁开工前批量备图。

   **生图必须铺满整张图 + 真透明**(2026-06-30 用户问题2/4)：`gen_deco` 已固化——①框/面板类(card_frame/bg_panel/ribbon/title_flank…)prompt 强制 full-bleed(主体顶到四边、零黑边)，否则裁完比例≠框→**拉伸缩水**；②框比例过极端(超出 0.42–2.40)会被**拒绝生成**，要改用不那么极端的框或拆成堆叠行；③产物**亮度键出为真 alpha**(近黑→透明)、用 **normal 混合**摆放，**不再用 `blend:screen`**(screen 把非纯黑底**加亮**成比背景更浅的光晕=问题4)。摆放后 `deco_check` 的 STRETCH 门按"资源原始比例 vs 框比例">1.15 判负。

5. **内容零删减 + 字按真实模板统计起手(门=18px) + 并列同字号**。字号 ramp 来自 5 套真 blue_tech 模板 958 条可读文字统计(中位 26px、p10≈17px)：**注释/最小可读 ≥18(硬门)、正文 20–22、次级 24–26、卡/小节标题 28–36、headline 38–44、页标题 48–56、大数字 64+**。从 `page_gate.RAMP` 取名用，**禁 14/16px**。
   - **并列元素必须同一字号**(同卡内各要点 / 各卡标题 / 并列标签)：`render_page` 对**每个框独立**做容量自动缩字，所以**长的那条会被缩小、短的保持大→同卡字忽大忽小**(2026-06-30 用户问题1)。做法：把每个框按**最长那条**留够宽/行数，让**没有任何框触发缩字**。`page_gate` 的 FONT-FLOOR 现在**只要发生自动缩字就判负**(读 `page.fit.json`)。
   - 装不下=**拆续页 / 减元素 / 加列 / 把框做大**，**不是缩字、更不是删点**。

6. **装饰与内容同框对齐**。一个组件 = 一个 box：先放装饰垫板(image，尺寸==box)，再把文字/图表内缩进**同一个 box**。点在麦穗里、饼在环里——不许各摆各的。

7. **干净底 + 加法合成 + 矢量真数据图**。底图用 `clean_base`(无内容纯场景)，装饰一张张精确摆上(不用 `make_plate` 拍平，会带残留)。数据图表(饼/柱/折)用**真数字矢量重画**，永不 AI 生数据图、永不照抄模板里的数。

## 1 · 输入
- 计划书：`W:\ppt\postppt.json`(utf-8，`content` 按 `## H2` 切页；`### H3` 视情况再切)。当前项目看 `content` 自判。
- 语料库：`W:\ppt\study\corpus\<deck>/{deck_record.json, pages/<id>.json, renders/, assets/}` —— **资产主源**(每页 json 含每个装饰的描述/位置/图片路径)。
- 功能装饰库 `assets_lib/` 为辅助检索。
> 库巨大，**禁止整库读进上下文**，一律用 §3 检索工具查→只取命中项。

## 2 · 每页流程（一页独立跑完 S1→S6，再做下一页）
- **S1 选参考(同大类)**：按本页内容形状(几条要点/有无数据/人物/流程)，`corpus_search.py --archetype <A> --family <本大类family>` 选**结构最贴**的真页（**别为省事挑装饰少的**）。两样都读：`get_record.py <page_id>`(json：装饰 desc/位置/图片路径) + **打开它的 `render` PNG 看像素**；`deco_skeleton.py <page_id>` 抽装饰位(function@box + corpus 真图路径) + 文字槽真字号 + 装饰密度。
- **S2 取皮(参考自己的)**：`clean_base.py <参考的 deck_id> base.png` 出底；配色从该 deck_record 取；字体走**全本统一**的 ramp。
- **S3 复刻布局**：照骨架把装饰位 + 文字槽摆出来；文字填我们的内容(零删减，多了拆续页 / 克隆带装饰的单元)。组件间留距不重叠，组件内装饰与内容同 box。
- **S4 现场上装饰**：逐个装饰位——复用参考真图，或**按这个框的尺寸 `gen_deco.py --function <f> --box WxH`(颜色词非 hex) 现生一张同类图**。产物已是 **full-bleed + 真 alpha**，一律 **normal 混合**摆放(`pg.img(..., blend=None)`，别再传 `screen`)。**卡片每张必有 card_frame 图、要点坐 pill/bg_panel 图、年份/序号坐真徽章图**。不 `cp` 隔壁页的图，不同比例不复用同图。
- **S5 渲染**：`render_page.py --record R --binding B --deck D --plate base --out svg` → `svg_to_png.py svg png`。
- **S6 自检 = 一条命令过全部硬门**：`python page_gate.py <pXX 目录> --ref <page_id> --cards <卡数>` 必须 **PASS ✅** 才算这页完成。它串起 ①PROVENANCE(无跨页复用) ②FONT-FLOOR(全文字≥18px) ③deco_check(card_frame≥卡数 / 结构功能齐 / ONLY-MORE / SIZE-FIT / **NO-SELF-DRAW** / **STRETCH**)。**再**人眼对参考 render side-by-side：①像不像 ②内容零删减 ③同框对齐。门红或不像→回 S3/S4 修。**这一页 gate 全绿才下一页。**

## 3 · 检索/生成工具（`W:\ppt\study\engine\`）
- `corpus_search.py [--mode pages|decks] [--family F] [--archetype A] [--sig S] [--kw …]` → 选页/选 deck。
- `get_record.py <page_id>|<deck_id> [deck]` → 单条完整记录(slots/images/decor_shapes 或 skin/design_system)。
- `deco_skeleton.py <page_id>` → 装饰位 function@box + corpus 真图路径 + 文字槽真字号 + 密度。**选页后必跑。**
- `assets_search.py --function F --family Fam --clean [--montage out.png]` → 干净装饰件路径(辅助挑件)。
- `deco_check.py <binding> --ref <page_id> [--cards N]` → 安全网：card_frame≥卡数、结构功能有真图、ONLY-MORE、SIZE-FIT、**NO-SELF-DRAW**(自画胶囊/底板判负)、**STRETCH**(资源原始比例≠框>1.15 判负)。
- **`page_gate.py <pXX 目录> --ref <page_id> --cards N` → S6 一键全门(PROVENANCE+FONT-FLOOR+deco_check)。这页 gate 全绿=完成。`RAMP`/`FONT_FLOOR` 字号常量也在此文件。**
- `clean_base.py <deck_id> <out.png>` → 无内容纯场景底图。
- `render_page.py` → 确定性渲染(plate + 文字 shapes + extras{image/pie/cards/line/rect/pill})；`svg_to_png.py` → 栅格化。
- `gen_deco.py --function <f> --box WxH [--prompt "现场设计的完整提示词"] [--palette "颜色词"] -o out.png` → AI 生功能装饰(默认 `qwen-image-2.0-pro`；**已固化 full-bleed + 真 alpha + 自适应 keyout + 极端比例拒绝 + 5-key 轮询 + 防塑料 negative**)。**`--prompt` = prompt-smith 现场设计(首选)**；省略则用固定模板兜底。`dashscope_t2i.py` → 内容图/主视觉。key 自动读 `engine/keys.local.json`。
- `deco_stats.py` / `reclassify_family.py` / `corpus_index.py` → 装饰密度参照 / 修 family 错标 / 重建索引。

### 生图要点
- **风格定调(2026-06-30 用户)**：学术严谨气质，但**别扁平成纯色块**——装饰要**精致、有质感、可带纹理/角部装饰/花纹**(科技网格、cyber 角标、等高线刻度、主题水印纹…)。**配色、繁简、华丽程度由你自由发挥**，可从克制到适度华丽；**唯一红线=别太光污染、别太塑料**(no 霓虹/bloom/塑料高光/3D/金属/游戏 HUD)。卡片**中心留干净给文字**，纹理集中边缘/角部。
- **优先 prompt-smith 现场设计**：`gen_deco --prompt "<你为这个装饰位现场写的完整提示词>"` 覆盖固定 SCAFFOLD（护栏=full-bleed/黑底/alpha keyout/防塑料 negative 仍自动加）。不传 `--prompt` 才退回 per-function 模板兜底。**别千篇一律套模板**——按这页内容/这个框的语义量身设计。
- 线稿 `motif` 用**亮色细线画在黑底**(模型爱画"深线条+白底"→keyout 失败；`gen_deco` 报 `OPAQUE` 警告则重生)。
- **先算 box 再生图**：每张装饰先定它在 1280×720 的目标 box(W×H)，用那个 box 传 `--box`，1:1 放(`preserve:none`)。卡框/pill/长条各按各自 box 分别生。
- **框比例别太极端**：full-bleed 类(card_frame/bg_panel/ribbon…)框比例须在 **0.42–2.40**，否则 `gen_deco` 直接拒绝(模型画不满→拉伸)。细长条要么拆成堆叠行、要么本就该是更矮胖的面板。
- `--palette` 传**颜色词不传 hex**(防烤乱码字)；徽章/数字衬板 AI 易烤字→优先库件或"空心几何无数字"重生。
- 产物=**真 alpha**，**一律 normal 混合**摆放。**不再用 `blend:screen`**(它把非纯黑底加亮成比背景更浅的光晕)。

## 4 · 五大坑
COM `Slides.Item(i)` 1-based · SVG→PNG 必 Chrome 顶层 + `file:///` 绝对 plate · 显示字中文名 + 拉丁名双写 · `make_plate` 删组内形状按绝对坐标 · **生图 full-bleed 顶满四边 + 亮度键出真 alpha + normal 摆放**(旧的"纯黑底+screen"已废：留黑边→裁完拉伸缩水、非纯黑→screen 加亮泛白)。

## 5 · 字体（render_page FONTMAP 已含；缺字替同类）
潮字社曾玉波手书简=REEJI-CHAO-ZengGB · 汉仪粗宋简→方正粗宋_GBK(FZCuSong-B09) · 汉仪雅酷黑→阿里汉仪智能黑体(AliHYAiHei) · 字体圈欣意冠黑体=Fontquan-XinYiGuanHeiTi。**全本用统一 ramp**(一款重黑做标题/数字 + 一款正文)；**字号取 `page_gate.RAMP`，最小 18px**。

## 6 · 交付
每页：`page.svg` + `page.png` + `page.record.json` + `page.binding.json` + 与参考 render 的 `_cmp.png`。报告：参考 page_id、内容覆盖(零删减)、与参考相似度、装饰(库件/AI 生各几张·是否按框各自生)、**`page_gate` 全绿截图/输出**、诚实问题。

**整本导出 .pptx**：所有页都 `page_gate` 全绿后，`python export_pptx.py -o deck.pptx --deck runs/<deck> [--hires]` → 按页号把各页拼成 **16:9 .pptx**(一页一张全幅图=已过门的渲染，`--hires` 用 SVG 2x 重栅格更清晰)。也可显式给页目录定顺序。注：当前是"一页一图"忠实导出(文字已烤进图、不可在 PPT 内编辑)；可编辑文字的原生 pptx 路径仍 parked。
