# Slide 3:133 · Overview（标题 + 两段 Body + 底部 Caption + Footer）

**Frame ID**: `3:133`  
**布局**: 白底 #fafbff；标题「Overview」Heading 2 48px 蓝；两段 Body 36px 黑，gap-64；底部 Caption 24px「A subtle text goes right here」；Footer 黑条 + Logo + Company Name。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Body**: Manrope Medium 36px, #000614, opacity-85
- **Caption**: Manrope Medium 24px

## 参考代码 (React + Tailwind)

```tsx
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:133">
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:134" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:135">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:136"><img alt="" className="absolute block max-w-none size-full" src={imgGroup2} /></div>
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.6] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.528px] whitespace-nowrap" data-node-id="3:140">Company Name</p>
      </div>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:141">Overview</p>
      <div className="absolute content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[64px] items-start leading-[1.5] left-[168px] opacity-85 text-[#000614] text-[36px] top-[218px] tracking-[-0.54px] w-[1169px]" data-node-id="3:142">
        <p className="min-w-full relative shrink-0 w-[min-content]" data-node-id="3:143">Briefly write a sentence describing or giving an overview on the subject or the design you are about to present.</p>
        <p className="relative shrink-0 w-[927px]" data-node-id="3:144">The goal of the presentation is to...</p>
      </div>
      <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] left-[168px] opacity-85 text-[#000614] text-[24px] top-[916px] tracking-[-0.36px] w-[991.968px]" data-node-id="3:145">A subtle text goes right here</p>
    </div>
  );
}
```
