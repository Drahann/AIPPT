# 里程碑存档 · 2026-06-28 · 参考驱动 5 页生成（首个"金奖级"成果）

这是一个**只读存档/回退点**。背景：用参考驱动(非模板填槽)生成了 5 页谷原焕生 PPT，人工审查认为"确实不错，里程碑级"。随后按审查意见做了三处方法修正。把当时的状态全部留档，以便日后若改坏了能**回退或 bisect 定位**。

## 目录内容
| 文件/夹 | 是什么 |
|---|---|
| `outputs/_ALL5.png` + `{market,team,flow,tech,financing}.png` | **里程碑 5 页成果**（被认可的那版） |
| `SUBAGENT_gen5_prompt.md` | 给 Opus 子agent 的**原始提示词** |
| `SUBAGENT_gen5_report.md` | 子agent 的**最终报告**（含过程自述/每页决策/它做的工具改动）。⚠️实时thinking转录系统未持久化(.output完成后为空)，此报告是可得的最完整过程记录 |
| `SUBAGENT_validation_report.md` | 之前那个验证子agent的报告（揪出抽取硬伤的那次） |
| `engine_snapshot/` | **当时全部引擎脚本快照**（含本次三修后的状态）= 代码回退基线 |
| `SKILL_snapshot.md` | 当时的生成 SKILL 快照 |
| `CHANGELOG_post_review.md` | 人工审查三问 → 我的**逐条修改记录**（"刚刚的修改"，无git故用此代diff）+ 回退指引 |

## 关键事实（给新对话冷启动）
- **当前架构 = 参考驱动**：参考页是"设计语言范本"，不是填槽模具；内容零删减；保真单位=设计系统(skin+功能装饰+网格)。
- **资产库已建**：`study/corpus/`(55套/989页) + `study/assets_lib/`(9166功能装饰，按 function×family)。检索工具：`corpus_search/get_record/assets_search`。建库后 `corpus_index.py` 刷索引。
- **生成机制**：`render_page.py` 出 SVG → `svg_to_png.py` 出 PNG（→ 未来 svg_to_pptx 出可编辑.pptx）。LLM 只产 record+binding(数据)，代码确定性出图。
- **三修后未重测**：本 5 页是**修正前**的产物。修正(clean_base/co-register/大字)是否真的更好，**下一步要用新方法重做验证**（见 CHANGELOG 回退/bisect 指引）。
- **已知弱点**：AI生图喷乱码文字(用英文主题+裁文字区+抽象绕过)；字体未装会回退雅黑(FONTMAP已映射)。

## 入口文档
- 权威架构：`study/ARCH_复刻驱动生成.md`
- 引擎手册：`study/engine/PIPELINE.md`
- 生成流程：`.claude/skills/chuangsai-deck-gen/SKILL.md`
- 记忆索引：`~/.claude/projects/W--ppt/memory/MEMORY.md` → `chuangsai-fork-architecture.md`
