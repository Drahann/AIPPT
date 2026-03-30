# Slide 3:86 · Cover 白底版（COMPANY NAME + 双行标题 + 作者 + 右 Logo + 右下装饰图）

**Frame ID**: `3:86`  
**布局**: 白底 #fafbff；左 COMPANY NAME Body 36px 蓝 + 双行 Title 96px「Design Project Title Goes Here」+ 作者 Heading 2 + Caption；右上 Logo；右下装饰几何图。

## 样式
- **Title**: Manrope Bold 96px, #000614
- **Heading 2**: Manrope Bold 48px
- **Body**: Manrope Medium 36px, #2569ed
- **Caption**: Manrope Medium 24px

## 参考代码 (React + Tailwind)

```tsx
const imgGroup16 = "./imgGroup16.svg";
const imgFrame1618872664 = "./imgFrame1618872664.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:86">
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[168px] top-[328px]" data-node-id="3:87">
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#2569ed] text-[36px] tracking-[-0.54px] w-[1080px]" data-node-id="3:88">COMPANY NAME</p>
        <div className="font-['Manrope:Bold',sans-serif] font-bold leading-[1.2] relative shrink-0 text-[#000614] text-[96px] tracking-[-1.92px] w-[1080px] whitespace-pre-wrap" data-node-id="3:89"><p className="mb-0">{`Design Project `}</p><p>Title Goes Here</p></div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[168px] text-[#000614] top-[839px] whitespace-nowrap" data-node-id="3:90">
        <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] relative shrink-0 text-[48px] tracking-[-0.72px]" data-node-id="3:91">Your Full Name</p>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[24px] tracking-[-0.36px]" data-node-id="3:92">{`Other details you'd like to share (Date & Time)`}</p>
      </div>
      <div className="absolute content-stretch flex gap-[17px] items-center left-[1635px] top-[89px]" data-node-id="3:93">
        <div className="h-[49px] relative shrink-0 w-[117.282px]" data-node-id="3:94"><img alt="" className="absolute block max-w-none size-full" src={imgGroup16} /></div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#000614] text-[24px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:98">Logo</p>
      </div>
      <div className="absolute h-[366.498px] left-[1583px] top-[714.5px] w-[339.961px]" data-node-id="3:99"><img alt="" className="absolute block max-w-none size-full" src={imgFrame1618872664} /></div>
    </div>
  );
}
```
