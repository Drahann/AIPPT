# 复刻驱动生成引擎（guided 档实现）· engine/

ARCH_复刻驱动生成.md 的可运行实现。落地 §0.2 **guided 档**：LLM 只产 `binding`，
确定性渲染器把内容扣到**锁死的真模板脚手架**上 → 坐标/色/字漂移结构上不可能。

## 管线（6 步，全部跑通）

```
真模板.pptx ─┬─ parse_page.py   →  page_record.raw.json  (每形状真 box/flip/srcRect/字体/字号/颜色)
             ├─ parse_chrome.py →  chrome.json           (版式/母版持久层)
             ├─ build_bg.py     →  plate.png             (COM 清空所有文字=reuse-verbatim 底图)
             └─ extract_deck.py →  deck_record.json      (theme1.xml 调色板+实测字体=skin)

binding.json (← orchestrator/LLM：每槽填什么) ─┐
page_record + plate + deck_record  ────────────┴─ render_page.py → replica.svg → svg_to_png.py → replica.png
                                                                                 (Chrome headless, 系统字体)
verify: 与 render_ref.py 的 COM 真渲染并排比对
```

## 各脚本

| 脚本 | 作用 | 关键点 |
|---|---|---|
| `parse_page.py` | 单页全几何→page_record | 组变换展平成绝对坐标；srcRect/alpha/duotone；**颜色解析 schemeClr→theme + lumMod/lumOff/shade/tint**(坑②)；gradFill；lstStyle 继承色兜底；稳定 id `shNN` |
| `parse_chrome.py` | 版式/母版持久 chrome | 背景 blip + 版式图片 box（坑③） |
| `build_bg.py` | 渲染 chrome 底图 | COM 复制本页→**递归清空全部文字**(含组内)→导出；图片/矢量框/底图原样保留 = reuse-verbatim |
| `extract_deck.py` | deck 级 skin | theme1.xml clrScheme(12色)+fontScheme + 全 deck 实测字体聚合(size_ramp/title/body family) |
| `render_page.py` | **确定性 guided 渲染器** | 在 plate 上画文字：binding 覆盖内容、未绑定占位符丢弃、未绑定真文字(导航)原样留；容量自动缩字 + CJK 换行 + 竖排标签(writing-mode) + 渐变字 + `resolve(role→skin)` |
| `render_ref.py` | COM 导出真模板 PNG | verify 真值；`Slides.Item(i)` = 1-based(勿用 `[i]`=0-based) |
| `svg_to_png.py` | SVG→PNG | Chrome **顶层加载**(非 `<img>`，否则禁外链图)；`file:///` 绝对 plate href |

## 验证结果（runs/sci_demo/）

实测：`【科技风】挑战杯及互联网+通用模板.pptx` × `postppt.json`(谷原焕生·医用涂层项目)。
三种原型端到端跑通，见 `_FINAL_compare.png`（左真模板/右生成）：
- **p02 目录**：6 条 H2 章节自动填充。
- **p14 团队结构**：6 人卡（计划书 7 人表取 6），姓名/竖排职务/职责/成果；导航+标题换皮；照片 reuse（content-regen 钩子见 binding 注释）。
- **p19 落地前景**：3 阶段 × 3 子项路线图。

chrome（底图/照片/卡框/导航/徽标）逐像素=真模板；文字=真项目内容、落在真槽位、真字体真色。

## 复现

```powershell
$P="...\【科技风】挑战杯及互联网+通用模板.pptx"; $E="W:\ppt\study\engine"; $R="W:\ppt\study\runs\sci_demo"
python $E\extract_deck.py $P $R
foreach ($s in 2,14,19){ $d="$R\p$('{0:00}' -f $s)"
  python $E\parse_page.py $P $s $d; python $E\parse_chrome.py $P $s $d
  python $E\build_bg.py $P $s "$d\plate.png"; python $E\render_ref.py $P "$R\ref_fixed" $s }
# author $d\binding.json, then:
foreach ($s in '02','14','19'){ $d="$R\p$s"
  python $E\render_page.py --record $d\page_record.raw.json --binding $d\binding.json --deck $R\deck_record.json --plate $d\plate.png --out $d\replica.svg
  python $E\svg_to_png.py $d\replica.svg $d\replica.png }
```

## 尚未做（诚实清单）
- **图片三路 content-regen/theme-swap**：本轮照片 reuse；AI 生图需 DASHSCOPE key（`dashscope_t2i.py` 就绪）。
- **数据页矢量图表**（独立资产类）：未演示。
- **S1 选页 + worker 池**：binding 本轮手工编排（即 guided 契约本身），尚未接 LLM 自动化。
