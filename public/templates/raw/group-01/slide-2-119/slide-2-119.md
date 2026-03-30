# Slide 2:119 · Image Top + Text Below（全宽图 + 下方 Case study / 标题 / 正文）

**Frame ID**: `2:119`  
**布局**: 白底；顶部全宽图 1880×480；下方左侧 Subheadline「Case study」，右侧 Headline + Body 长文案。

**样式**: Subheadline 4 (32px #6c6c6c), Subheadline 5 (30px black), Body (30px)。

**资源**: imgImage — Figma MCP，7 天失效。

## 参考代码 (React + Tailwind)

```tsx
const imgImage = "./imgImage.png";

export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:119">
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[120px] not-italic text-[32px] text-[color:var(--color-6,#6c6c6c)] top-[659px] tracking-[-1.28px] w-[320px]" data-node-id="2:120">Case study</p>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-none left-[560px] text-[30px] text-[color:var(--color-1,black)] top-[659px] tracking-[-0.6px] w-[1240px]" data-node-id="2:121">Why Acme Inch chose Aetherfield</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[560px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[705px] tracking-[-1.2px] w-[1240px]" data-node-id="2:122">With fragmented data and increasing pressure to meet sustainability disclosure standards, Acme turned to Aetherfield to unify their ESG workflows across teams and regions. By centralizing carbon accounting, automating data validation, and visualizing key performance indicators in real time, Acme gained a single source of truth for environmental reporting. The result? Faster decisions, fewer spreadsheets, and 34% more coverage across their sustainability metrics—giving leadership clarity and confidence in every report.</p>
      <div className="absolute aspect-[1880/480] left-[20px] right-[20px] top-[20px]" data-name="Image" data-node-id="2:123">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
