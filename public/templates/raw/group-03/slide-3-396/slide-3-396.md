# Slide 3:396 · Solutions（左文 New Admin features + 右平板/桌面 screen mock + Footer）

**Frame ID**: `3:396`  
**布局**: 白底 #fafbff；标题「Solutions」Heading 2 48px 蓝 + 「New Admin features!」Heading 1 64px；左两段 impact 描述（Sub-Header 40px + Caption 24px）；右 700×1002 平板/桌面 screen mock 竖屏；Footer。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Heading 1**: Manrope SemiBold 64px, #000614
- **Sub-Header**: Manrope SemiBold 40px
- **Body**: Manrope Medium 36px
- **Caption**: Manrope Medium 24px

## 参考代码 (React + Tailwind)

**资源**: imgImage7, imgGroup2。Figma MCP asset 约 7 天后失效。

```tsx
const imgImage7 = "./imgImage7.png";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:396">
      <div className="absolute contents left-[1161px] top-[190px]" data-node-id="3:397">
        <div className="absolute flex h-[700px] items-center justify-center left-[1161px] top-[190px] w-[1002.158px]">
          <div className="flex-none rotate-90">
            <div className="bg-[#000614] border-16 border-[#000614] border-solid h-[1002.158px] rounded-[28.962px] w-[700px]" data-node-id="3:398" />
          </div>
        </div>
        <div className="absolute h-[700px] left-[1161px] top-[190px] w-[1002px]" data-name="image 7" data-node-id="3:399">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
        </div>
      </div>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:400">
        Solutions
      </p>
      <p className="absolute font-['Manrope:SemiBold',sans-serif] font-semibold leading-[1.2] left-[168px] text-[#000614] text-[64px] top-[218px] tracking-[-0.96px] w-[948px]" data-node-id="3:401">
        New Admin features!
      </p>
      <div className="absolute content-stretch flex flex-col gap-[48px] items-start left-[168px] top-[343px]" data-node-id="3:402">
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] tracking-[-0.54px] w-[825px]" data-node-id="3:403">{`What's the impact? Did our efforts drive results? Share the metrics and data points that demonstrate the impact!`}</p>
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-[824px]" data-node-id="3:404">
          <div className="content-stretch flex items-start relative shrink-0 w-[824px]" data-name="Content" data-node-id="3:405">
            <div className="content-stretch flex flex-col gap-[21.333px] items-start relative shrink-0 text-[#000614] w-[824px]" data-node-id="3:406">
              <p className="font-['Manrope:SemiBold',sans-serif] font-semibold leading-[1.3] relative shrink-0 text-[40px] tracking-[-0.6px] w-[824px]" data-node-id="3:407">
                Here's an impact we made
              </p>
              <div className="flex flex-col font-['Manrope:Medium',sans-serif] font-medium justify-end leading-[0] opacity-85 relative shrink-0 text-[24px] tracking-[-0.36px] w-[824px]" data-node-id="3:408">
                <p className="leading-[1.5]">Explain the redesigned UI/UX through high-fidelity mockups or prototypes. Briefly explain how the design addresses the identified problems.</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-start relative shrink-0 w-[824px]" data-name="Content" data-node-id="3:409">
            <div className="content-stretch flex flex-col gap-[21.333px] items-start relative shrink-0 text-[#000614] w-[824px]" data-node-id="3:410">
              <p className="font-['Manrope:SemiBold',sans-serif] font-semibold leading-[1.3] relative shrink-0 text-[40px] tracking-[-0.6px] w-[824px]" data-node-id="3:411">
                Here's another impact the redesign had
              </p>
              <div className="flex flex-col font-['Manrope:Medium',sans-serif] font-medium justify-end leading-[0] opacity-85 relative shrink-0 text-[24px] tracking-[-0.36px] w-[824px]" data-node-id="3:412">
                <p className="leading-[1.5]">Explain the redesigned UI/UX through high-fidelity mockups or prototypes. Briefly explain how the design addresses the identified problems.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:413" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:414">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:415">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup2} />
        </div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:419">
          Company Name
        </p>
      </div>
    </div>
  );
}
```
