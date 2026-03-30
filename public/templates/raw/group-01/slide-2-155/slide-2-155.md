# Slide 2:155 · Text Left + Image Right（Founder’s story：Subheadline + Headline + Body + 右图 + 左下小图）

**Frame ID**: `2:155`  
**布局**: 白底；左侧 Subheadline「Founder's story」+ Headline「Eunji Park」+ Body；右侧全高图 620×1040；左下小图 380×220。

**样式**: Subheadline 4 (30px #6c6c6c), Subheadline 1 (64px), Body (30px)。

**资源**: imgImage, imgImage1 — Figma MCP，7 天失效。

## 参考代码 (React + Tailwind)

```tsx
const imgImage = "./imgImage.png";
const imgImage1 = "./imgImage1.jpg";

export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:155">
      <div className="absolute aspect-[620/1040] bottom-[20px] right-[20px] top-[20px]" data-name="Image" data-node-id="2:156">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
      <div className="-translate-y-1/2 absolute h-[220px] left-[220px] top-[calc(50%+250px)] w-[380px]" data-name="Image" data-node-id="2:157">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[220px] not-italic text-[30px] text-[color:var(--color-1,black)] top-[366px] tracking-[-1.2px] w-[840px]" data-node-id="2:158">Eunji founded Aetherfield with one goal: to help companies take climate action without waiting for a perfect plan. With a background in environmental systems and software design, she's spent the past decade building tools that turn impact goals into real-world outcomes. She still insists on biking to every investor meeting.</p>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-[1.1] left-[220px] text-[64px] text-[color:var(--color-1,black)] top-[232px] tracking-[-1.92px] w-[840px]" data-node-id="2:159">Eunji Park</p>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[220px] not-italic text-[30px] text-[color:var(--color-6,#6c6c6c)] top-[180px] tracking-[-1.2px] w-[840px]" data-node-id="2:160">Founder's story</p>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
