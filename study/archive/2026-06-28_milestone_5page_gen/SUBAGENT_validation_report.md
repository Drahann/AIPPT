# 验证子agent 报告（条件早于 gen5）· 2026-06-28 · 归档摘要

> 这是在建 50 套库之前跑的验证子agent：测"参考驱动 vs 填槽" + 审 liangyao 抽取质量。
> 它揪出的抽取硬伤，已在建大库前全部修复（见下）。实时转录未持久化，此为报告摘要。

## 结论
- **参考驱动完胜填槽**：内容超多的「落地前景」拆 3 续页，**69/69 句零删减**（填槽老版会删塞不下的内容）。设计语言一致性立住。
- 抽取质量：parse 层(几何/字/色/paras/decor_shapes)可靠；但 cold-start 语义层有硬伤↓。

## 它揪出的 5 个抽取硬伤（均已修，见 CHANGELOG「里程碑期间」）
1. **skin 取了 theme accent → 橙底黑字**（实为蓝deck）→ 改取实测 common_colors + 采样底图角（现 primary 青 / bg 深蓝）。
2. **密集页 archetype=other、slot_signature 空**（选页主键）→ page 调用 max_tokens 900→3000（富分类输出截断致 JSON 解析失败）。
3. **function 稀疏、assets_lib 近空**（无 card_frame 等）→ 矢量装饰也进同一次 VLM 分类 + 从 render 裁剪 harvest（现 9166 件）。
4. **custom geom 只有框无路径**（螺旋不可重建）→ parse 存归一化 path（可重渲可换色）。
5. **deck 未存 source_pptx**（plate 没法重建）→ 已存。

## 它当时也指出的"渲染侧"问题（部分在 gen5 期间/之后处理）
- render_page 读 `REC['shapes']` 旧格式 vs 语料页 `slots/images/decor_shapes` → 子agent 用 authoring 格式绕过；schema 对齐仍是 TODO。
- render_page 无"文字垫板"图元 → gen5 子agent 补了 rect/pill；装饰也可走 image extra（gen_deco 现造）。
