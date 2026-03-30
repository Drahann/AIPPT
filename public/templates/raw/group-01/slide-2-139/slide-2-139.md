# Slide 2:139 · Metrics（左栏标题+正文 + 右侧 2×2 Metric+Body）

**Frame ID**: `2:139`  
**布局**: 白底；左侧 720px 宽背景 #f6f8fb，标题「Proof and momentum」48px + 正文 36px；右侧 2×2 四格：每格大数字 120px + 下方 Body 30px（20+, 60%, 91%, 3.5×）。

**样式**: Headline 2 (Radio Canada Big 120px), Body 30px, Body large 36px, Subheadline 2 (48px)。

无图片资源，纯文字+色块。

## 参考代码 (React + Tailwind)

```tsx
export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:139">
      <div className="absolute bg-[var(--color-9,#f6f8fb)] bottom-0 left-0 top-0 w-[720px]" data-name="Background" data-node-id="2:140" />
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[1360px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[704px] tracking-[-1.2px] w-[400px]" data-node-id="2:141">Increase in actionable insights per reporting cycle</p>
      <p className="absolute font-['Radio_Canada_Big:Regular',sans-serif] font-normal leading-none left-[1360px] text-[120px] text-[color:var(--color-1,black)] top-[572px] tracking-[-6px] w-[400px]" data-node-id="2:142">3.5×</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[880px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[704px] tracking-[-1.2px] w-[400px]" data-node-id="2:143">Less manual data cleanup compared to competitors</p>
      <p className="absolute font-['Radio_Canada_Big:Regular',sans-serif] font-normal leading-none left-[880px] text-[120px] text-[color:var(--color-1,black)] top-[572px] tracking-[-6px] w-[400px]" data-node-id="2:144">91%</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[1360px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[436px] tracking-[-1.2px] w-[400px]" data-node-id="2:145">Reduction in reporting time for sustainability teams</p>
      <p className="absolute font-['Radio_Canada_Big:Regular',sans-serif] font-normal leading-none left-[1360px] text-[120px] text-[color:var(--color-1,black)] top-[304px] tracking-[-6px] w-[400px]" data-node-id="2:146">60%</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[880px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[436px] tracking-[-1.2px] w-[400px]" data-node-id="2:147">Climate-forward orgs trust Aetherfield</p>
      <p className="absolute font-['Radio_Canada_Big:Regular',sans-serif] font-normal leading-none left-[880px] text-[120px] text-[color:var(--color-1,black)] top-[304px] tracking-[-6px] w-[400px]" data-node-id="2:148">20+</p>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-[1.1] left-[120px] text-[48px] text-[color:var(--color-1,black)] top-[306px] tracking-[-1.44px] w-[480px]" data-node-id="2:149">Proof and momentum</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.3] left-[120px] not-italic text-[36px] text-[color:var(--color-1,black)] top-[399px] tracking-[-1.44px] w-[480px]" data-node-id="2:150">Aetherfield is trusted by leading organizations driving measurable climate progress. Our platform turns complex sustainability data into clarity—empowering teams to act faster, report smarter, and make lasting impact.</p>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
