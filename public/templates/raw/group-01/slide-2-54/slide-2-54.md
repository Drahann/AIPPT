# Slide 2:54 · List/Accordion（左图 + 右侧多组 Divider + Subheadline + Label + Body）

**Frame ID**: `2:54`  
**布局**: 白底；顶部居中 Subheadline「The platform」+ Headline；左图 1006×648；右侧 4 组（Divider + Subheadline + Label 001/002/003/004 + Body）。

**样式**: Subheadline 5 (Radio Canada Big Medium 30px), Label 1 (Geist Mono 20px), Body (Source Serif Pro 30px), Subheadline 4 (32px), Subheadline 2 (48px)。

**资源**: imgImage, imgDivider — Figma MCP，7 天失效。

## 参考代码 (React + Tailwind)

```tsx
const imgImage = "./imgImage.png";
const imgDivider = "./imgDivider.svg";

export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:54">
      <div className="absolute h-0 left-[1126px] top-[372px] w-[734px]" data-name="Divider" data-node-id="2:55">
        <div className="absolute inset-[-1.45px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgDivider} />
        </div>
      </div>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-none left-[1126px] text-[30px] text-[color:var(--color-1,black)] top-[408px] tracking-[-0.6px] w-[674px]" data-node-id="2:56">Track</p>
      <p className="-translate-x-full absolute font-['Geist_Mono:Regular',sans-serif] font-normal leading-none left-[calc(100%-60px)] text-[20px] text-[color:var(--color-6,#6c6c6c)] text-right top-[408px] whitespace-nowrap" data-node-id="2:57">001</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[1126px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[462px] tracking-[-1.2px] w-[734px]" data-node-id="2:58">Emissions, energy, and waste across your value chain</p>
      <div className="absolute h-0 left-[1126px] top-[534px] w-[734px]" data-name="Divider" data-node-id="2:59">
        <div className="absolute inset-[-1.45px_0_0_0]"><img alt="" className="block max-w-none size-full" src={imgDivider} /></div>
      </div>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-none left-[1126px] text-[30px] text-[color:var(--color-1,black)] top-[570px] tracking-[-0.6px] w-[674px]" data-node-id="2:60">Model</p>
      <p className="-translate-x-full absolute font-['Geist_Mono:Regular',sans-serif] font-normal leading-none left-[calc(100%-60px)] text-[20px] text-[color:var(--color-6,#6c6c6c)] text-right top-[570px] whitespace-nowrap" data-node-id="2:61">002</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[1126px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[624px] tracking-[-1.2px] w-[734px]" data-node-id="2:62">Forecast performance and goal alignment</p>
      <div className="absolute h-0 left-[1126px] top-[696px] w-[734px]" data-name="Divider" data-node-id="2:63">
        <div className="absolute inset-[-1.45px_0_0_0]"><img alt="" className="block max-w-none size-full" src={imgDivider} /></div>
      </div>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-none left-[1126px] text-[30px] text-[color:var(--color-1,black)] top-[732px] tracking-[-0.6px] w-[674px]" data-node-id="2:64">Report</p>
      <p className="-translate-x-full absolute font-['Geist_Mono:Regular',sans-serif] font-normal leading-none left-[calc(100%-60px)] text-[20px] text-[color:var(--color-6,#6c6c6c)] text-right top-[732px] whitespace-nowrap" data-node-id="2:65">003</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[1126px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[786px] tracking-[-1.2px] w-[734px]" data-node-id="2:66">Generate ESG disclosures, automate frameworks</p>
      <div className="absolute h-0 left-[1126px] top-[858px] w-[734px]" data-name="Divider" data-node-id="2:67">
        <div className="absolute inset-[-1.45px_0_0_0]"><img alt="" className="block max-w-none size-full" src={imgDivider} /></div>
      </div>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-none left-[1126px] text-[30px] text-[color:var(--color-1,black)] top-[894px] tracking-[-0.6px] w-[674px]" data-node-id="2:68">Act</p>
      <p className="-translate-x-full absolute font-['Geist_Mono:Regular',sans-serif] font-normal leading-none left-[calc(100%-60px)] text-[20px] text-[color:var(--color-6,#6c6c6c)] text-right top-[894px] whitespace-nowrap" data-node-id="2:69">004</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[1126px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[948px] tracking-[-1.2px] w-[734px]" data-node-id="2:70">Surface insights and operational next steps</p>
      <div className="absolute h-0 left-[1126px] top-[calc(100%-60px)] w-[734px]" data-name="Divider" data-node-id="2:71">
        <div className="absolute inset-[-1.45px_0_0_0]"><img alt="" className="block max-w-none size-full" src={imgDivider} /></div>
      </div>
      <div className="absolute h-[648px] left-[60px] top-[372px] w-[1006px]" data-name="Image" data-node-id="2:72">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
      <p className="-translate-x-1/2 absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[960px] not-italic text-[32px] text-[color:var(--color-6,#6c6c6c)] text-center top-[128.5px] tracking-[-1.28px] w-[1680px]" data-node-id="2:73">The platform</p>
      <p className="-translate-x-1/2 absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-[1.1] left-[960px] text-[48px] text-[color:var(--color-1,black)] text-center top-[190.5px] tracking-[-1.44px] w-[1680px]" data-node-id="2:74">Everything you need to measure, model, and act on sustainability</p>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
