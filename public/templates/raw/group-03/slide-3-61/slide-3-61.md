# Slide 3:61 · Cover（蓝底 + VERSION 2.0 + 双行标题 + 作者日期 + 右侧几何装饰）

**Frame ID**: `3:61`  
**布局**: 蓝底 #2569ed；左 VERSION 2.0 Body 36px + 双行 Title 96px「Finessing UI/UX Design Presentations」+ Heading 2 48px 作者 + Caption 24px 日期；右装饰几何图形 opacity-10；中部小图标装饰。

## 样式
- **Title**: Manrope Bold 96px, lineHeight 1.2, letterSpacing -2, #fafbff
- **Heading 2**: Manrope Bold 48px, lineHeight 1.25, letterSpacing -1.5
- **Body**: Manrope Medium 36px, lineHeight 1.5
- **Caption**: Manrope Medium 24px

## 参考代码 (React + Tailwind)

**资源**: 多组 img Group、imgFrame、imgPolygon。Figma MCP asset 约 7 天后失效。

```tsx
const imgGroup = "./imgGroup.svg";
const imgGroup1 = "./imgGroup1.svg";
const imgGroup2 = "./imgGroup2.svg";
const imgGroup3 = "./imgGroup3.svg";
const imgGroup4 = "./imgGroup4.svg";
const imgFrame1618872749 = "./imgFrame1618872749.svg";
const imgPolygon1 = "./imgPolygon1.svg";
const imgFrame1618872751 = "./imgFrame1618872751.svg";

export default function Frame() {
  return (
    <div className="bg-[#2569ed] relative size-full" data-name="Frame" data-node-id="3:61">
      <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] left-[168px] text-[#fafbff] text-[36px] top-[334px] tracking-[-0.54px] whitespace-nowrap" data-node-id="3:62">VERSION 2.0</p>
      <div className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.2] left-[168px] text-[#fafbff] text-[96px] top-[411px] tracking-[-1.92px] whitespace-nowrap" data-node-id="3:63">
        <p className="mb-0">Finessing UI/UX</p>
        <p>Design Presentations</p>
      </div>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#fafbff] text-[48px] top-[836px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:64">Bright Chinenyeze</p>
      <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] left-[168px] text-[#fafbff] text-[24px] top-[914px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:65">June, 2024</p>
      <div className="absolute contents inset-[44.26%_47.03%_48.28%_47.19%]" data-node-id="3:66">
        <div className="absolute flex inset-[47.38%_47.16%_50.85%_51.95%] items-center justify-center">
          <div className="flex-none h-[17.775px] rotate-[5.4deg] w-[15.572px]">
            <div className="relative size-full" data-name="Group" data-node-id="3:67"><img alt="" className="absolute block max-w-none size-full" src={imgGroup} /></div>
          </div>
        </div>
        <div className="absolute flex inset-[50.84%_47.64%_48.33%_50.83%] items-center justify-center">
          <div className="flex-none h-[6.218px] rotate-[5.4deg] w-[28.899px]">
            <div className="relative size-full" data-name="Group" data-node-id="3:69"><img alt="" className="absolute block max-w-none size-full" src={imgGroup1} /></div>
          </div>
        </div>
        <div className="absolute flex inset-[48.82%_48.48%_50.2%_50.85%] items-center justify-center">
          <div className="flex-none h-[9.492px] rotate-[5.4deg] w-[12.112px]">
            <div className="relative size-full" data-name="Group" data-node-id="3:71"><img alt="" className="absolute block max-w-none size-full" src={imgGroup2} /></div>
          </div>
        </div>
        <div className="absolute flex inset-[45.18%_48.79%_53.29%_50.6%] items-center justify-center">
          <div className="flex-none h-[15.61px] rotate-[5.4deg] w-[10.276px]">
            <div className="relative size-full" data-name="Group" data-node-id="3:73"><img alt="" className="absolute block max-w-none size-full" src={imgGroup3} /></div>
          </div>
        </div>
        <div className="absolute flex inset-[44.26%_48.19%_49.42%_47.24%] items-center justify-center">
          <div className="flex-none h-[60.813px] rotate-[5.4deg] w-[82.533px]">
            <div className="relative size-full" data-name="Group" data-node-id="3:75"><img alt="" className="absolute block max-w-none size-full" src={imgGroup4} /></div>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-start left-[1527px] opacity-10 top-[calc(50%-0.01px)]" data-node-id="3:77">
        <div className="relative shrink-0 size-[269.996px]" data-node-id="3:78"><img alt="" className="absolute block max-w-none size-full" src={imgFrame1618872749} /></div>
        <div className="relative shrink-0 size-[270px]" data-node-id="3:80"><div className="absolute bottom-1/4 left-[13.2%] right-[13.2%] top-[8.9%]"><img alt="" className="block max-w-none size-full" src={imgPolygon1} /></div></div>
        <div className="relative shrink-0 size-[269.996px]" data-node-id="3:81"><div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#fafbff] left-[calc(50%-0.09px)] rounded-[14.81px] size-[177.718px] top-[calc(50%-0.09px)]" data-node-id="3:82" /></div>
        <div className="relative shrink-0 size-[269.996px]" data-node-id="3:83"><img alt="" className="absolute block max-w-none size-full" src={imgFrame1618872751} /></div>
        <div className="relative shrink-0 size-[270px]" data-node-id="3:85"><div className="absolute bottom-1/4 left-[13.2%] right-[13.2%] top-[8.9%]"><img alt="" className="block max-w-none size-full" src={imgPolygon1} /></div></div>
      </div>
    </div>
  );
}
```
