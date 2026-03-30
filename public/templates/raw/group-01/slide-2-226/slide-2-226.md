# Slide 2:226 · Ending（黄底 + Footer 图 + Logo + 顶部左右 Body）

**Frame ID**: `2:226`  
**布局**: 背景 #fff546；顶部左右 Body（www.aetherfield.com / © 2028 · All rights reserved）30px #66640f；中部 Footer image 1880×654 mix-blend-multiply opacity-90；底部居中 Logo 1880×309.29。

**样式**: Body (Source Serif Pro 30px), Subheadline 5 (Radio Canada Big Medium 30px)。--color-4: #66640f。

**资源**: imgFooterImage, imgLogo — Figma MCP，7 天失效。

## 参考代码 (React + Tailwind)

```tsx
const imgFooterImage = "./imgFooterImage.png";
const imgLogo = "./imgLogo.svg";

export default function Frame() {
  return (
    <div className="bg-[var(--color-3,#fff546)] relative size-full" data-name="Frame" data-node-id="2:226">
      <div aria-hidden="true" className="absolute aspect-[1880/654] left-[20px] mix-blend-multiply opacity-90 right-[20px] top-[76px]" data-name="Footer image" data-node-id="2:227" role="presentation">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFooterImage} />
      </div>
      <div className="-translate-x-1/2 absolute h-[309.29px] left-1/2 top-[750px] w-[1880px]" data-name="Logo" data-node-id="2:228">
        <img alt="" className="absolute block max-w-none size-full" src={imgLogo} />
      </div>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] not-italic right-[20px] text-[30px] text-[color:var(--color-4,#66640f)] text-right top-[20px] tracking-[-1.2px] w-[880px] whitespace-pre-wrap" data-node-id="2:239">{`© 2028  ·  All rights reserved`}</p>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-none left-[20px] text-[30px] text-[color:var(--color-4,#66640f)] top-[23px] tracking-[-0.6px] w-[880px]" data-node-id="2:240">www.aetherfield.com</p>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
