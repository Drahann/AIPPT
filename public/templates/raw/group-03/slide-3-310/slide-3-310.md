# Slide 3:310 · Features Enhanced（10 个 pill/card 标签网格 + Footer）

**Frame ID**: `3:310`  
**布局**: 白底 #fafbff；标题居中「Here are the features we enhanced in the new version!」Heading 2 48px 蓝；10 个 pill 圆角标签（Dark Mode、AI Chat、Comments 等）四行网格布局；Footer 黑条 + Logo + Company Name。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Pill 标签**: Manrope Medium 36px, 白底黑框 rounded-48px, 396×54
- **Caption**: Manrope Medium 24px, #fafbff

## 参考代码 (React + Tailwind)

**资源**: imgGroup2。Figma MCP asset 约 7 天后失效。

```tsx
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:310">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[43.327px] leading-[normal] left-[186.67px] not-italic text-[#000614] text-[45.608px] top-[-1023.33px] w-[469.759px]" data-node-id="3:311">
        Overview
      </p>
      <p className="-translate-x-1/2 absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[960px] text-[#2569ed] text-[48px] text-center top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:312">
        Here are the features we enhanced in the new version!
      </p>
      <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-[318px] top-[252px]" data-node-id="3:313">
        <div className="content-stretch flex gap-[48px] items-start relative shrink-0" data-node-id="3:314">
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:315">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:316">
              Dark Mode
            </p>
          </div>
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:317">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:318">
              AI Chat
            </p>
          </div>
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:319">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:320">
              Comments
            </p>
          </div>
        </div>
        <div className="content-stretch flex gap-[48px] items-start relative shrink-0" data-node-id="3:321">
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:322">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:323">
              Offline Save
            </p>
          </div>
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:324">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:325">
              Mobile tracker
            </p>
          </div>
        </div>
        <div className="content-stretch flex gap-[48px] items-start relative shrink-0" data-node-id="3:326">
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:327">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:328">
              Plugins
            </p>
          </div>
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:329">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:330">
              The Bright Effect
            </p>
          </div>
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:331">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:332">
              Widgets
            </p>
          </div>
        </div>
        <div className="content-stretch flex gap-[48px] items-start relative shrink-0" data-node-id="3:333">
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:334">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:335">
              API/Web-hooks
            </p>
          </div>
          <div className="bg-[#fafbff] border-2 border-[#000614] border-solid content-stretch flex items-center justify-center px-[32px] py-[24px] relative rounded-[48px] shrink-0 w-[396px]" data-name="_interactiveComponents_" data-node-id="3:336">
            <p className="font-['Manrope:Medium',sans-serif] font-medium h-[54px] leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[330px]" data-node-id="3:337">
              Community Chat
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:338" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:339">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:340">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup2} />
        </div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:344">
          Company Name
        </p>
      </div>
    </div>
  );
}
```
