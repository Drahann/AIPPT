# Slide 2:43 · Title + Image (Subheadline + Headline + 大图)

**Frame ID**: `2:43`  
**布局**: 白底；左上 Subheadline + 右侧 Headline；下方全宽大图 1880×622。

## 样式
- **Subheadline 4**: Source Serif Pro Regular 32px, color #6c6c6c, letterSpacing -4
- **Subheadline 1**: Radio Canada Big Medium 64px, black, lineHeight 1.1, letterSpacing -3

## 参考代码 (React + Tailwind)

```tsx
const imgImage = "./imgImage.png";

export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:43">
      <div className="absolute h-[622px] left-[20px] top-[438px] w-[1880px]" data-name="Image" data-node-id="2:44">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[121.88%] left-0 max-w-none top-[-1.13%] w-full" src={imgImage} />
        </div>
      </div>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[120px] not-italic text-[32px] text-[color:var(--color-6,#6c6c6c)] top-[149px] tracking-[-1.28px] w-[260px]" data-node-id="2:45">
        The challenge
      </p>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-[1.1] left-[426px] text-[64px] text-[color:var(--color-1,black)] top-[149px] tracking-[-1.92px] w-[1374px]" data-node-id="2:46">
        Climate and ESG data is fragmented, complex, and often inaccessible to decision-makers.
      </p>
    </div>
  );
}
```

**图片**: Figma MCP asset，约 7 天后失效，需替换为本地或持久 URL。
