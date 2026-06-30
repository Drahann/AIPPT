---
name: chuangsai-deck-gen
description: 从计划书(按H2切页)生成"金奖级"创赛PPT页。参考驱动(非模板填槽)——以语料库提取的真模板为"设计语言参照",Claude在该语言内自由设计,内容零删减。触发：用户要生成/复刻创赛PPT页、做样张、验证某H2成页效果。
---

# 创赛 PPT 生成（参考驱动 · 内容零删减）

你是这套系统的 **orchestrator**。读完本 skill 直接进入流程。权威细节见 `W:\ppt\study\engine\PIPELINE.md`（必读：6阶段、三层schema、五大坑、§7功能装饰库）。

## 0 · 铁律（血换的，别违反）
1. **参考驱动，不是模板填槽**。选中的参考页是**设计语言的范本**(配色/字感/布局呼吸/装饰套路)，**不是要逐槽填满的模具**。你按它的语言**自由设计**本页。
2. **内容零删减**。版面由**内容**驱动：内容多就加卡/加列/**拆续页**，绝不为塞进模板而删原文。先前最大教训就是删了内容——不可接受。
3. **保真单位 = 设计系统**(skin tokens + 功能装饰件 + 网格)，不是某页的固定坐标。色/字/装饰从库取真值(不会失真)；版面你自己排，但要有纪律(对齐/等距/不重叠)。
4. **创赛的"创赛感"=每处文字底下都垫图片装饰**：标题旁有麦穗/双chevron、数字后有衬板、卡片有外框、四角有HUD、到处是光效/螺旋/分子。**图多、光足、字大清晰、字体好看**。没有这些就是"光秃秃的PPT",不是创赛。**生成时主动给文字配 `function` 装饰件**(从 assets_lib 取，或用万相生成)。
5. **★字要大才饱满**(人工审查头号问题)：标题区按参考 deck `type_ramp` 的**上半段**——主标题/页标题 ≥40px、大数字 ≥64px(可到100+)、小节标题 28–36px、正文 18–22px、注释 ≥14px。**禁止小字稀疏**。字号从 `design_system.type_ramp` 取,别自己拍小。
6. **★装饰与内容必须同框对齐(co-register)**(头号错位根因)：一个"组件"=**一个box**,该box里**先放装饰垫板(image/rect/pill,尺寸==box),再放内容(文字/图表,内缩进同一box)**。麦穗里的点、环里的饼图——装饰和内容**共用同一 box**,绝不各摆各的。
7. **★底图要干净·加法合成**(背景残留根因)：**不要用 `make_plate` 的拍平底图**(它会带进参考的残留文字/校名logo/总结条等没法替换又错位的元素)。用 **`clean_base.py <deck_id> base.png`** 出**无内容的纯场景底**,然后**自己把装饰一张张精确放上去**(尺寸严格、位置精确)。需要顶部导航条/四角HUD等 chrome,也从 assets_lib 取或 `gen_deco` 生,加法摆上,不靠拍平继承。

## 1 · 输入
- 计划书：`W:\ppt\postppt.json`(utf-8，content 按 `## H2` 切页)。当前项目=谷原焕生(大米蛋白医用涂层)。
- 语料库：`W:\ppt\study\corpus\<deck>/{deck_record.json, pages/<id>.json, renders/, assets/}`。
- 功能装饰库：`W:\ppt\study\assets_lib/<function>/<family>/` + `index.jsonl`。

> ⚠️ **资产库巨大(数百套deck/数千页/上万装饰件)，禁止整库读进上下文。一律用 §3.0 检索工具查→只取命中项。**

## 2 · 流程
**S1 选参考页**：读目标 H2 的内容形状(几条要点/有无数据/有无人物/有无流程) → **`corpus_search.py`** 按 `--archetype/--family/--sig/--kw` 检索结构最贴的页(看返回的 `render` 路径确认观感) → 选一，`get_record.py <page_id>` **只取那一页**的全详情。记 `reference_id`。
**S2 取设计语言**：`corpus_search.py --mode decks --family <f>` 看候选 skin；`get_record.py <deck_id> deck` 取该 deck 的 skin(palette/真family名/`design_system` tokens) + `assets_search.py` 查同 family 的功能装饰件。
**S3 内容优先布局(组件化)**：把 H2 全文解析成结构 → 决定布局,**以装下全部内容为准**(超了拆续页,同 skin)。产出**组件清单**:每个组件 = `{box[x,y,w,h], 装饰function, 内容, 字号(取type_ramp上半段)}`。**组件之间留间距不重叠**(参考 `design_system.content_margins`+栏距);组件内装饰与内容同 box(§0.6)。
**S4 造资产(干净·加法)**：
  - **底图**：`clean_base.py <deck_id> base.png` 出**无内容纯场景底**(§0.7,**别用 make_plate 拍平**)。
  - **每个组件的装饰垫板**(必做,§0.4)：尺寸==组件box。①查库 `assets_search.py --function <f> --family <fam> [--montage]` 取路径；②库里没合适→`gen_deco.py --function <f> --theme "英文主题" --palette "#a,#b" --box WxH -o out.png` 现造(黑底+`composite:screen`)。**三卡/多卡每张都要各自垫板,不能裸卡。**
  - **chrome**(顶部导航条/四角HUD/标题旗)：同样加法摆——assets_lib 取或 gen_deco 生,放准位置。
  - 内容图/主视觉：`dashscope_t2i.py`(content-regen)。**key 自动读 `engine/keys.local.json`,不必手传。**
  - 数据图表：矢量重画(真数据,pie/cards extra)，永不AI生/永不照抄模板数。**图表要落进它的装饰环/框里(同box)。**
**S5 渲染**：`render_page.py`(clean base + 文字 + `extras`{image/rect/pill/pie/cards/line}) → `svg_to_png.py`。
**S6 自检(必做·逐项过)**：渲 PNG 对比参考 → ①**内容全**(对原文零删减) ②**字够大**(标题≥40/数字≥64,不稀疏) ③**对齐**(装饰box==内容box,点在麦穗里、饼在环里) ④**无残留**(没有参考的校名/logo/总结条等没替换的元素——用了clean_base就不该有) ⑤**每处文字有装饰垫板**、组件不重叠 ⑥设计语言一致(色/字/装饰密度像该family)。任一不过→回 S3/S4 修,再渲。

## 3.0 · 检索工具（★建库产物 · 像 ppt-master 一样查，不灌上下文）
先确保索引最新：`python corpus_index.py`(建库后跑一次)。
- `corpus_search.py [--mode pages|decks] [--family F] [--archetype A] [--sig S] [--kw 词...] [--limit N]` → 紧凑命中行(id/archetype/slot_signature/render路径/desc 或 deck skin/tokens)。**选页/选skin用。**
- `get_record.py <page_id> | <deck_id> [deck]` → 打印**单条**完整记录(slots/images/decor_shapes 或 deck skin/design_system)。命中后才取。
- `assets_search.py [--function F] [--family Fam] [--theme T] [--limit N] [--montage out.png]` → 功能装饰件文件路径(+可出预览网格肉眼挑)。**配装饰用。**
- 索引文件：`corpus/_pages_index.jsonl`、`corpus/_decks_index.jsonl`、`assets_lib/index.jsonl`(直接 grep 也行)。

## 3 · 工具（`W:\ppt\study\engine\`，PowerShell 调）
- `parse_page.py <pptx> <n> <out>`：单页全参数(几何/字/色/geom/line/effects/paras)。
- `clean_base.py <deck_id> <out.png>`：**无内容纯场景底图**(加法合成首选,§0.7)。
- `parse_chrome.py` / `build_bg.py`：版式 chrome / 纯底图。
- `make_plate.py <pptx> <n> <out.png> [--kill-*]`：拍平保真底板(**慎用·会带残留**;偏好 clean_base)。
- `render_page.py --record R --binding B --deck D --plate P --out svg`：确定性渲染。binding={slots:{id:text|""}, extras:[{type:image|pie|cards|line,...}], drop_unbound_placeholders:true}。
- `svg_to_png.py <svg> <png>`；`render_ref.py <pptx> <out> [n...]`(COM, Slides.Item 1-based)。
- `dashscope_t2i.py [--key k] --size 1024*1024 --prompt "..." --negative "text,logo,people" -o out.png`(万相内容图/主视觉)。
- `gen_deco.py [--key k] --function <f> --family <fam> --theme "X" --palette "#a,#b" --box WxH -o out.png`(**AI 现造功能装饰**，函数感知 prompt + 合成提示)。
- **key**：上面两个 gen 脚本默认自动读 `engine/keys.local.json`(5 个临时 DashScope key，可不传 --key)；VLM 同样。

### AI 生图尺寸/参数(★精确,别用错)
- **传 `--box WxH`(目标框尺寸),脚本自动按框比例选生成尺寸**(`gen_deco.pick_size`：单边∈[512,1440],长边~1280,匹配框宽高比)。wan2.2 接受自定义尺寸,故常规框=**生成比例==框比例**。
- **渲染按 sidecar 贴**：`gen_deco` 写 `<out>.json`(size/composite/preserveAspectRatio/aspect_matched)。在 `render_page` 的 image extra 里用 **`"preserve":"none"`**(精确铺满框、不留边不裁) + **`"blend":"screen"`**(黑底装饰自动消黑成发光叠加;bg_panel 用 normal)。
- **极端比例**(如 7:1 金句条/导航条,超 2.81:1)→ 自动 clamp 到最近可行比例,`aspect_matched=false`,沿长轴**拉伸**(光带/分隔条可接受);真要细长锐利的线就**矢量画**别 AI。
- 参数:`watermark=false`、装饰 `prompt_extend=false`(防自动改写加文字/杂物)、negative 含 text/logo/words。内容图用 `dashscope_t2i.py` 时按框比例传 `--size`(可调 `gen_deco.pick_size`)。

## 4 · 五大坑（务必避，详见 PIPELINE.md §4）
COM `Slides.Item(i)` 1-based / SVG→PNG 必 Chrome 顶层+`file:///`绝对plate / 显示字列中文名+拉丁名双写 / make_plate 删组内形状按绝对坐标 / 生图纯黑底+`mix-blend:screen` 变全息。

## 5 · 字体（render_page FONTMAP 已含；新字按真 family 名加，缺则替同类）
潮字社曾玉波手书简=REEJI-CHAO-ZengGB · 汉仪粗宋简→方正粗宋_GBK(FZCuSong-B09) · 汉仪雅酷黑→阿里汉仪智能黑体(AliHYAiHei) · 字体圈欣意冠黑体=Fontquan-XinYiGuanHeiTi。

## 6 · 交付
每页输出：`replica.svg` + `replica.png` + `binding.json`(决策留痕) + 与参考 render 的 side-by-side。报告：内容覆盖率(对照原文)、设计语言一致性、装饰使用、残留问题。
