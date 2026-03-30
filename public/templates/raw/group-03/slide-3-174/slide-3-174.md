# Slide 3:174 · Problem Statement（左文右图 + Footer）

**Frame ID**: `3:174`  
**布局**: 白底 #fafbff；左 708px Problem Statement Heading 2 48px 蓝 + Body 36px 两段；右 708×744 大图；Footer 黑条 + Logo + Company Name。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Body**: Manrope Medium 36px, #000614, opacity-85

## 参考代码 (React + Tailwind)

```tsx
const imgImage8 = "./imgImage8.png";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:174">
      <div className="absolute content-stretch flex gap-[168px] items-center left-[168px] top-[128px] w-[1584px]" data-node-id="3:175">
        <div className="content-stretch flex flex-col gap-[32px] items-start opacity-85 relative shrink-0 w-[708px]" data-node-id="3:176">
          <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] relative shrink-0 text-[#2569ed] text-[48px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:177">Problem Statement</p>
          <div className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#000614] text-[36px] tracking-[-0.54px] w-[708px]" data-node-id="3:178">
            <p className="mb-0">Write a sentence stating the problem you plan to solve for and why it is important to solve this problem. What pain points are you dealing with and how it is expected to make the users life better whilst achieving business goals.</p>
            <p>Write a sentence stating the problem you plan to solve for and why it is important to solve this problem. What pain points are you dealing with and how it is expected to make the users life better whilst achieving business goals.</p>
          </div>
        </div>
        <div className="h-[744px] relative shrink-0 w-[708px]" data-name="image 8" data-node-id="3:179"><img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage8} /></div>
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:180" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:181">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:182"><img alt="" className="absolute block max-w-none size-full" src={imgGroup2} /></div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:186">Company Name</p>
      </div>
    </div>
  );
}
```
