# 创赛 PPT 复刻生成 · 引擎手册（经验沉淀 v1 · 2026-06-28）

> 这是 `study/engine/` 的权威说明。架构原理见 `study/ARCH_复刻驱动生成.md`，本文是**落地配方 + schema + 坑**。
> 一句话：**LLM 只产 `binding`（填什么/图走哪条路），确定性 Python 渲染器扣到锁死的真模板脚手架上出图。坐标/色/字漂移在结构上不可能。**

---

## 0 · 心智模型
一页 = **锁死的 plate**（chrome/装饰，COM 烤死的底图）+ **一个可编辑的组件清单**（slots ∪ extras ∪ repeat-groups）。
- `slot`：解析出的真文本框（box+真字体真色），binding 只换 WHAT it says。
- `extra`：声明式画的资产（image / pie / cards / line），用于 content-regen 图、矢量数据图表、数量自适应卡片。
- 增/删/换槽 = 改组件清单 + 改 plate 的 kill 集。**几何永远算出来或克隆出来，绝不手摆。**

三档自由（默认 guided）：strict(纯代码填) / **guided(LLM 只出 binding，代码渲染)** / free(LLM 手写整页 SVG，已弃)。保真 > 自由，宁死板不失真。

---

## 1 · 运行时管线（6 阶段，对应 ARCH §3）
```
计划书md ─► S0摄取(按H2切页) ─► S1选页 ─► S2绑定(=大纲/契约) ─► S3素材 ─► S4拼装 ─► S5审查 ─► S6导出
                                  └查corpus      └每槽填什么+每图三路+图表type/data+skin锁   └生图/换皮/矢量图表  └确定性渲染器  └渲回对比修  └svg→pptx
```
- **S1 选页** = 用 corpus 的 deck/page 描述 + `slot_signature` 按**内容形状**匹配（不是找最像，是找槽位结构最贴）。
- **S2 绑定** = 你记的"大纲阶段"，但它是**执行契约**不是松散大纲：`binding.json`（本轮手写，全自动版由冷启动 Claude 看 records+计划书产出）。
- **S3+S4** = 你记的"生成阶段"。**S4 拼装是纯代码无 LLM**。

---

## 2 · 引擎工具（`study/engine/`）
| 脚本 | 作用 | 关键点 |
|---|---|---|
| `parse_page.py` | 单页几何真值 → `page_record.raw.json` | 组变换/flip/rot/srcRect/gradFill/duotone/alpha + **schemeClr→theme+lumMod/shade/tint 颜色解析**(修灰导航/金姓名坑) + lstStyle 继承色 + 稳定 id `shNN` |
| `parse_chrome.py` | 版式/母版 chrome 清单 | 整页底图常在版式不在单页 |
| `build_bg.py` | COM 复制本页→清空全部文字→导出 | = 纯 reuse-verbatim 底图（不删图/装饰） |
| `make_plate.py` | **关键**：复制 pptx→删"要重画的形状"→COM 导出保真 plate | `--kill-text/-charts/-pic-native/-boxsize/-region/-names/-keep-names`；**组内形状按绝对坐标匹配**（threads group transform） |
| `extract_deck.py` | theme1.xml + 实测字体 → `deck_record.json`(skin) | clrScheme 12色 + fontScheme + 各槽实测显示字聚合 |
| `render_page.py` | **确定性 guided 渲染器** → SVG | plate + 文字(容量缩字/CJK换行/竖排/渐变/占位符丢/resolve role→skin) + `extras`(image含`blend:screen` / pie / cards) |
| `render_ref.py` | COM 导出真模板页 PNG（参考真值） | **`Slides.Item(i)` 1-based**；`Slides[i]` 下标是 0-based 会错位一页！ |
| `svg_to_png.py` | headless Chrome 渲 SVG→PNG（verify） | 必须 Chrome 顶层加载 + `file:///` 绝对 plate href |
| `dashscope_t2i.py`(旧`_scripts`) | 万相 wan2.2 文生图（content-regen） | 异步 submit→poll→download |
| `vlm.py` | 多 key 负载均衡 Qwen-VL 客户端（建库用） | round-robin 5 keys；模型 `qwen-vl-max`/`qwen3-vl-plus` |
| `build_corpus.py` | 离线建库：deck→render+parse+VLM描述→records→`corpus/` | 重度并行廉价模型 |

---

## 3 · 资产库 schema（三层 · 让冷启动 Claude 不看像素也能精确生成）
> **铁律：几何/颜色/字体 = 永远来自 parse 真 XML；role/描述/标签 = 来自 VLM 看图。两者各管一段，都要。**

### 3.1 deck_record（每套一条 · 整体风格）
```jsonc
{
 "deck_id","family","track","gold",
 "palette": { /* theme1.xml clrScheme 12色 + 实测聚合 */ },
 "typography": { "title_family","body_family","number_family",   // 真 family 名(含拉丁名!)
                 "size_ramp": {"title":48,"body":18,...} },
 "skin": { "primary","accent_cyan","bg_deep","text", "deco_set":{...}, "background":[...] },
 "style_desc": "VLM一句话：深蓝科技医疗风，全息HUD边框，城市夜景底，金青点缀，书法标题",
 "render_tags": ["科技","医疗","深蓝","金奖"],
 "pages": ["deck<sha>_p01", ...]
}
```

### 3.2 page_record（每页一条 · 整页描述 + 结构）
```jsonc
{
 "id","source_deck","slide_idx","render":"<png>",
 "archetype": "cover|toc|content|team|expert|financing|roadmap|market|solution|bignum|chart|closing",
 "slot_signature": "5way_pie+4_spend_cards+contract",   // 结构指纹(选页主键)
 "content_shape": "饼图股权 + N资金项 + 协议金额",          // 装得下什么形状内容
 "page_desc": "VLM整页：左饼图股权结构，右上4资金卡，右下协议+合同扫描",
 "tags": ["融资","股权","金奖"],
 "chrome": [ {kind,asset,box,desc,role:"reuse"} ],          // 持久层默认 reuse
 "slots":  [ {id,box,role,font:{fam,px,color|grad,align}, cap:{cpl,lines}, placeholder} ],
 "images": [ {id,asset,box,flip,srcRect,duotone,alpha,
              role:"chrome|decoration|icon|content-placeholder|hero|chart",   // ←换/留唯一判据(desc=画的是什么)
              function:"见 §7 功能分类",   // ←★怎么用(组合功能)：card_frame / title_flank(麦穗/双chevron) / number_backplate / icon_pedestal / divider / corner_hud / bullet_marker / ribbon / avatar_ring / bg_panel / connector / glow / motif
              desc, theme_meaning, treatment:"reuse|theme-swap|content-regen", gen_hint:{subject,aspect,bg},
              reusable:true } ],   // function≠content 的装饰件 → 收进 assets_lib 供跨页复用
 "repeat_groups": [ {id, track:{area|anchors,dir,gap}, count_range, cell:{w,h,slots:[...],deco:[...]}} ]  // 数量自适应
}
```

### 3.3 component 级 = 上面 slots[]/images[] 的每个元素（box 来自 parse，role+desc 来自 VLM）

---

## 4 · 五大坑（已固化，别再踩）
1. **COM 索引**：`render_ref`/`build_bg` 用 `Slides.Item(i)`(1-based)；pywin32 `Slides[i]` 下标 0-based 会错位一页。
2. **SVG→PNG**：必须 Chrome 顶层 + `file:///` 绝对路径；`<img>` 内嵌 svg 禁外链图→底图全黑。
3. **字体**：显示字常按拉丁名注册（字体圈欣意冠黑体→`Fontquan-XinYiGuanHeiTi`），CSS 只写中文名会回退雅黑→FONTMAP 中+拉丁名双写；未装字体替同类（汉仪粗宋简→方正粗宋_GBK `FZCuSong-B09`；汉仪雅酷黑→阿里汉仪智能黑体 `AliHYAiHei`）。
4. **组内形状删除**：`make_plate` 删形状要按**绝对坐标**匹配（threads group transform），否则组里的台座/引线删不掉。
5. **生图透明**：万相出不了透明 → prompt 纯黑底 + `mix-blend-mode:screen` 变全息融进深底；或背景去除兜底。

---

## 5 · 增/删/换槽（数量自适应）
- **排布原语** `distribute(area,n,gap)`：n 个等宽 box，增删槽只改 n。
- **增槽·A 矢量参数化**（已实现 = `extras:cards`）：`n=len(items)` 自动重排，适合卡片/网格/列表/饼图。
- **增槽·B OOXML 克隆**（待实现，高保真）：`copy.deepcopy(shape._element)` + 平移 `off.x` + COM 烤 = 字节一致的第 N 张。
- **换槽·同页**（已实现 = 财务页饼图）：`make_plate --kill-region` 旧 + binding 残留置`""` + 加 extra 新。
- **换槽·跨页(取B套A皮)**：B 页 slot/group 记录粘进 A 清单，`resolve(role→A.skin)` 自动换色字（槽存语义角色不存死值）。

---

## 7 · 功能装饰库 assets_lib（★模板"好看"的秘密 · 2026-06-28 用户点出）
模板好看不只靠主视觉，靠的是**功能性装饰件**：卡片外框、重点两侧的麦穗/双 chevron、大数字背后的衬板、图标台座、分隔花纹……这些"零件"一旦抽出来按**功能**编目，做卡片/做强调就能**一键套上 → 如鱼得水**。这正是模板一直在干的事，也是我那版财务卡"做得不好看"的根因——我画了**光秃秃的矢量圆角矩形**，而没有：①复用抠出来的 `$台座`(icon_pedestal) ②给卡片套 `card_frame` ③标题旁加 `title_flank` 麦穗。

**因此图片资产=两段信息**：`desc`(画的是什么) + `function`(怎么用)。`function` 分类（= assets_lib 的 category）：
`card_frame` 卡片外框 · `title_flank` 标题/重点两侧对称装饰(麦穗/chevron/花纹) · `number_backplate` 大数字衬板 · `icon_pedestal` 图标台座 · `divider` 分隔条 · `corner_hud` 四角装饰 · `bullet_marker` 列表装饰点 · `ribbon` 金句条/标签带 · `avatar_ring` 人像框 · `bg_panel` 半透内容面板 · `connector` 流程箭头 · `glow` 光效 · `motif` 主题主视觉(分子/麦穗/地图)。

**建库时 harvest**：`build_corpus` 把 `role∈{decoration,icon}` 且 `function≠None` 的图，连同 `family/theme_meaning/aspect/朝向(对称用L/R)` 一起收进 `study/assets_lib/<function>/<family>/`，建索引 `function × family × aspect`。
**生成时消费**：`render_page` 的 `cards/pie/title/emphasis` 等 builder 不再画秃图，而是 `pick(function, family, aspect)` 取装饰件贴上——卡片自动套框、标题自动配麦穗、数字自动加衬板。这一步把"自造组件"升级成"用模板同款零件拼"，是保住卖相的关键。
> 下一步落地：build_corpus 加 harvest + 索引；render_page 的 draw_cards/标题加 `frame`/`flank`/`pedestal` 参数从 assets_lib 取。

## 6 · 验证记录
- `runs/sci_demo/`（科技风通用×谷原焕生）：严格槽填，p02目录/p14团队/p19路线图，chrome 逐像素=真模板。
- `runs/liangyao/`（良药智纪医学×谷原焕生）：解死板版——封面 content-regen 全息主视觉 + 4字书法换皮；融资页矢量饼图(5片真股权)+资金卡 3→4 count-adapt。见 `_cmp_cover.png`/`_cmp_fin.png`、`IMAGE_USAGE.md`。
