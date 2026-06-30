# gen5 子agent 提示词（Opus，参考驱动生成5页）· 2026-06-28

> 启动参数：`subagent_type=general-purpose`, `model=opus`, `run_in_background=true`。
> 用途：归档存证。这是产出 `runs/gen5/` 5 页（里程碑测试）所用的原始提示词。

---

You are the orchestrator for "创赛 PPT 生成" (golden-award competition slides). Windows; use PowerShell/Bash tools. Quality bar is HIGH — design like a top deck designer, be self-critical, iterate until each page looks like a real 金奖 slide.

STEP 1 — read fully before doing anything:
- W:\ppt\.claude\skills\chuangsai-deck-gen\SKILL.md   (your process + tools + traps — follow it)
- W:\ppt\study\engine\PIPELINE.md                      (schema, 5 traps)

PROJECT: W:\ppt\postppt.json (UTF-8; content = markdown split by `## H2`; project 谷原焕生 = rice-protein medical coating for vascular interventional catheters). It's a medical+tech project.

CORPUS just built: 55 decks / 989 pages / 9166 functional decorations under W:\ppt\study\corpus\ and W:\ppt\study\assets_lib\. DO NOT browse it raw — use the query tools (corpus_search.py / get_record.py / assets_search.py) so you don't flood context.

TASK: generate **5 complementary pages** (distinct archetypes). Suggested H2→archetype spread: 市场分析→market, 商业模式→solution/flow, 团队结构→team, 创新技术(or 创新成果)→solution/content, 融资计划→financing. Prefer reference pages from family med_blue_white or blue_tech, cross-family allowed if structure fits better.

CORE RULES (from SKILL — non-negotiable):
1. REFERENCE-DRIVEN, not slot-fill: the chosen corpus page is a *design-language reference*, you design freely in that language.
2. ZERO content deletion: layout follows content; overflow → continuation page, never cut plan text.
3. 创赛 aesthetic: every text block sits on a decoration backing (card_frame / title_flank / number_backplate / bg_panel / glow / corner_hud). Pull parts via assets_search.py, OR MINT via gen_deco.py (black bg + composite per sidecar). Imagery-rich, big clean fonts. No bare text.
4. Skin LOCKED from the reference deck's deck_record: measured skin colors + design_system type_ramp; real font family names.

GENERATION MECHANISM: compose SVG via render_page.py, then rasterize via svg_to_png.py.
- render_page.py --record R.json --binding B.json --deck D.json --plate plate.png --out page.svg
  - R.json = {"canvas":[1280,720],"shapes":[{"id","kind":"text","box":[x,y,w,h],"font","font_px","color"|"grad","align"}...]}
  - B.json = {"slots":{id:text}, "extras":[image|pie|cards|line], "drop_unbound_placeholders":true}
  - plate.png from make_plate.py <source_pptx> <slide> <out> [--kill-*] (deck_record has source_pptx); or compose.
- AI images: pass --box WxH; place with sidecar preserveAspectRatio("none") + blend("screen"). Charts = vector, real numbers.

KEYS: gen_deco.py/dashscope_t2i.py/vlm.py auto-read engine/keys.local.json. No --key needed.

OUTPUT under W:\ppt\study\runs\gen5\<h2>\ (page.svg/png, record/binding json, decos). Verify each vs reference + content completeness; iterate.

REPORT: per page — H2, reference deck+page, PNG path, content-coverage vs original (prove zero loss), library vs AI-minted decorations, honest verdict. Overall: did reference-driven + deco tooling produce 金奖 pages? biggest weakness? tool friction.

---

## 说明（归档备注）
- 子agent 的**实时 thinking 转录未持久化**（Agent 的 .output 文件完成后为空）。本目录保留：本提示词 + 子agent 的**最终报告**（`SUBAGENT_gen5_report.md`，含它的过程自述与改动）。
- 子agent 在执行中**修改了 `render_page.py`**（FONTMAP 扩到已装字体 + 新增 rect/pill 图元）——快照见 `engine_snapshot/render_page.py`，要点见 `SUBAGENT_gen5_report.md` 末尾“Tool friction / fixes made”。
