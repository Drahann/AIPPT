# 修改存档：人工审查后的三大修正（"刚刚的修改"）· 2026-06-28

> 非 git 仓库，无法生成真 diff。**`engine_snapshot/` + `SKILL_snapshot.md` 就是这些修改之后的完整状态基线**。
> 本文逐条记录改了什么、为什么、动了哪些文件——便于日后若效果变差时定位"哪一步步子迈大了"并微调/回退。

## 触发：用户对 gen5 五页的人工审查（3 个问题）
1. 字偏小（参考里字都大，字大才饱满）。
2. 排版严重错位（市场定位右侧的点没进麦穗装饰；股权饼图没嵌进装饰环）。
3. 背景拍平残留：financing 三卡背景有个莫名蓝框且三卡无背景装饰、与上方组件重叠；tech 右下"医创先锋"右上"山河大学"是参考logo没替换；team 下方深蓝条+两侧装饰是参考的总结语装饰——都被拍平进背景没替换又错位。
   - 用户结论：既然有 AI 生图，**背景装饰自己按严格尺寸生成、精确摆放**即可。

## 改动清单

### A. 新增 `engine/clean_base.py`（核心新工具）
- 作用：产出**无内容纯场景底图**（取 `deck_record.skin.backgrounds` 的 bg 场景图缩放到 1280×720；无则按 `skin.bg_deep` 出竖向渐变）。
- 目的：替代 `make_plate` 的"拍平真模板底"——后者会把参考的残留文字/校名logo/总结条等带进来（问题3根因）。改为**干净底 + 加法摆装饰**。
- 已测：med 深蓝场景底，干净无残留。

### B. `.claude/skills/chuangsai-deck-gen/SKILL.md`（方法铁律 + 流程）
- **§0 铁律新增 3 条**：
  - §0.5 **字大才饱满**：标题≥40px / 大数字≥64px / 小节28-36 / 正文18-22 / 注释≥14；从 `design_system.type_ramp` 上半段取，禁小字稀疏。（修问题1）
  - §0.6 **co-register（装饰与内容同框）**：一组件=一box，box内先放装饰垫板(尺寸==box)再放内容(同box)；麦穗里的点、环里的饼共用同一box。（修问题2）
  - §0.7 **干净加法合成**：用 `clean_base.py` 出无内容底，装饰一张张精确加法摆上，chrome 也加法摆；**不用 make_plate 拍平**。（修问题3）
- **S3 改为组件化布局**：产出组件清单 `{box,装饰function,内容,字号}`，组件间留间距不重叠，组件内同box。
- **S4 改为"干净·加法"造资产**：clean_base 底；每个组件必配装饰垫板(尺寸==box，库取或 gen_deco 现造)，**多卡每张都要垫板不能裸卡**；chrome 加法摆；图表落进其装饰环/框(同box)。
- **S6 自检改为六项逐条**：①内容全 ②字够大 ③对齐(装饰box==内容box) ④无残留 ⑤每文字有垫板+不重叠 ⑥语言一致。
- **§3 工具表**：加 `clean_base.py`(加法首选)，`make_plate` 标注"慎用·会带残留"。

## 本里程碑期间（gen5 之前/之中）已落的工程（也在 snapshot 里，作基线）
- `parse_page.py`：升级为穷尽抽取（geom含custGeom归一path / fillp渐变stops+angle+alpha / line / effects shadow-glow-softEdge / 全paras全runs / tf anchor-ins / z序）。
- `build_corpus.py`：chrome装饰harvest + design_system tokens + 矢量装饰harvest(裁剪) + skin取实测色 + source_pptx；page调用 max_tokens=3000 + slot_signature 兜底。
- `vlm.py`：多key随机起点轮询；默认模型 `qwen3.7-max-2026-06-08`。
- `gen_deco.py`：函数感知装饰生成 + `pick_size`(按框比例精确出尺寸,[512,1440],preserve=none) + composite:screen + prompt_extend=false。
- `corpus_index.py / corpus_search.py / get_record.py / assets_search.py`：检索工具（仿 ppt-master）。
- `render_page.py`（gen5子agent改）：FONTMAP 扩到已装好字 + 语义别名；新增 rect/pill 图元。
- `build_batch.py`：去重 + ext过滤 + slide-limit。

## 回退指引
- 要回到本基线：用 `engine_snapshot/*` 覆盖 `study/engine/`（注意 `keys.local.json` 未入档，需保留现有的）、`SKILL_snapshot.md` 覆盖 skill。
- 若日后效果变差：对照本清单，A/B 两组改动逐项 bisect（先查 §0.6 co-register 与 §0.7 clean_base 是否被误用，再查字号、FONTMAP）。
