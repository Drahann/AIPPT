# Slide 3:187 · The PainPoint / Problem Statistics（三组圆形 XX% + 标签 + Footer）

**Frame ID**: `3:187`  
**布局**: 白底 #fafbff；标题「The PainPoint」Heading 2 48px 蓝；副标题「Problem Statistics」Heading 1 64px；三列：圆形图 320×320 + XX% Title 96px + Body 36px 标签（App Downloads / App Interactions / App Subscriptions）；Footer。

## 样式
- **Title**: Manrope Bold 96px
- **Heading 1**: Manrope SemiBold 64px
- **Sub-Header**: Manrope SemiBold 40px
- **Body**: Manrope Medium 36px

## 参考代码 (React + Tailwind)

```tsx
const imgGroup4 = "./imgGroup4.svg";
const imgGroup5 = "./imgGroup5.svg";
const imgGroup6 = "./imgGroup6.svg";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  const items = [
    { img: imgGroup4, label: "App Downloads" },
    { img: imgGroup5, label: "App Interactions" },
    { img: imgGroup6, label: "App Subscriptions" },
  ];
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:187">
      <p className="-translate-x-1/2 absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[calc(50%-632.5px)] text-[#2569ed] text-[48px] text-center top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:188">The PainPoint</p>
      <p className="-translate-x-1/2 absolute font-['Manrope:SemiBold',sans-serif] font-semibold leading-[1.2] left-[calc(50%-510.5px)] text-[#000614] text-[64px] text-center top-[218px] tracking-[-0.96px] whitespace-pre" data-node-id="3:211">{`Problem  Statistics`}</p>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[96px] items-center justify-center left-1/2 top-[calc(50%+49px)]" data-node-id="3:189">
        {items.map(({ img, label }, i) => (
          <div key={i} className="content-stretch flex flex-col gap-[32px] items-center justify-center opacity-85 relative shrink-0">
            <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
              <div className="relative shrink-0 size-[320px]"><img alt="" className="absolute block max-w-none size-full" src={img} /></div>
              <p className="-translate-x-1/2 absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.2] left-1/2 text-[#000614] text-[96px] text-center top-[calc(50%-57px)] tracking-[-1.92px] w-[276px]">XX%</p>
            </div>
            <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[400px]">{label}</p>
          </div>
        ))}
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:212" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:213">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:214"><img alt="" className="absolute block max-w-none size-full" src={imgGroup2} /></div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:218">Company Name</p>
      </div>
    </div>
  );
}
```
