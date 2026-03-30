# Slide 3:292 · Constraints（左蓝底标题区 + 右白底双段描述 + Footer）

**Frame ID**: `3:292`  
**布局**: 左 876px 蓝底 #2569ed，「Constraints」+「Dealing with constraints」Title 96px + Logo；右 708px 白底两段 Constraint title + Body 36px；无传统 Footer 黑条，左侧区含 Logo。

## 样式
- **Title**: Manrope Bold 96px, #fafbff
- **Heading 2**: Manrope Bold 48px
- **Sub-Header**: Manrope SemiBold 40px
- **Body**: Manrope Medium 36px

## 参考代码 (React + Tailwind)

```tsx
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:292">
      <div className="-translate-y-1/2 absolute bg-[#2569ed] h-[1080px] left-0 overflow-clip top-1/2 w-[876px]" data-node-id="3:302">
        <div className="absolute content-stretch flex flex-col font-['Manrope:Bold',sans-serif] font-bold gap-[124px] items-start left-[166px] text-[#fafbff] top-[128px]" data-node-id="3:303">
          <p className="leading-[1.25] relative shrink-0 text-[48px] tracking-[-0.72px] w-[610px]" data-node-id="3:304">Constraints</p>
          <p className="leading-[1.2] relative shrink-0 text-[96px] tracking-[-1.92px] w-[610px]" data-node-id="3:305">Dealing with constraints</p>
        </div>
        <div className="absolute h-[43.451px] left-[64px] top-[1017px] w-[104px]" data-node-id="3:306"><img alt="" className="absolute block max-w-none size-full" src={imgGroup2} /></div>
      </div>
      <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-start justify-center left-[calc(75%-42px)] top-[128px] w-[708px]" data-node-id="3:293">
        <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full" data-node-id="3:294">
          {[1, 2].map((i) => (
            <div key={i} className="content-stretch flex flex-col gap-[21.333px] items-start relative shrink-0 text-[#000614] w-[707px]">
              <p className="font-['Manrope:SemiBold',sans-serif] font-semibold leading-[1.3] relative shrink-0 text-[40px] tracking-[-0.6px] w-[707px]">Constraint title here</p>
              <div className="flex flex-col font-['Manrope:Medium',sans-serif] font-medium justify-end leading-[0] opacity-85 relative shrink-0 text-[36px] tracking-[-0.54px] w-[707px]">
                <p className="leading-[1.5]">What stood in the way of your team from the goal? Identify any limitations, risks and constraints that impacted the design process. Explain how these constraints were managed or addressed.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```
