# Slide 2:47 · Image Right + Text Left (图右半 + Subheadline + Headline)

**Frame ID**: `2:47`  
**布局**: 白底；右半全高图 960×1080；左侧 Subheadline + Headline（左对齐）。

## 样式
- **Subheadline 4**: Source Serif Pro Regular 32px, #6c6c6c, letterSpacing -4
- **Subheadline 1**: Radio Canada Big Medium 64px, black, lineHeight 1.1, letterSpacing -3

## 参考代码 (React + Tailwind)

```tsx
const imgImage = "./imgImage.png";

export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:47">
      <div className="absolute aspect-[960/1080] bottom-0 right-0 top-0" data-name="Image" data-node-id="2:48">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[120px] not-italic text-[32px] text-[color:var(--color-6,#6c6c6c)] top-[369.5px] tracking-[-1.28px] w-[730px]" data-node-id="2:49">
        Our vision
      </p>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-[1.1] left-[120px] text-[64px] text-[color:var(--color-1,black)] top-[431.5px] tracking-[-1.92px] w-[730px]" data-node-id="2:50">
        Aetherfield helps organizations measure, model, and act on sustainability.
      </p>
    </div>
  );
}
```

**图片**: Figma MCP asset，约 7 天后失效。
