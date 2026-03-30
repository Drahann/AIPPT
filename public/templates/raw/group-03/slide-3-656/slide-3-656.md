# Slide 3:656 · Thank You（居中标题 + Logo + Design Title + 邮箱 + 无 Footer）

**Frame ID**: `3:656`  
**布局**: 白底 #fafbff；中央「Thank You」Title 96px  bold；下方三个几何 Logo 图标；底部 Design Title Body 36px opacity-25 + Caption 24px fullname@email.com；无 Footer。

## 样式
- **Title**: Manrope Bold 96px, #000614
- **Body**: Manrope Medium 36px, opacity-25
- **Caption**: Manrope Medium 24px
- **Logo**: 117×49 几何图形

## 参考代码 (React + Tailwind)

**资源**: imgGroup15。Figma MCP asset 约 7 天后失效。

```tsx
const imgGroup15 = "./imgGroup15.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:656">
      <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] left-[calc(50%+0.5px)] opacity-25 text-[#000614] text-[36px] text-center top-[895px] tracking-[-0.54px] w-[1583px]" data-node-id="3:657">
        Design Title Goes Here
      </p>
      <p className="-translate-x-1/2 absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.2] left-1/2 text-[#000614] text-[96px] text-center top-[calc(50%-94px)] tracking-[-1.92px] whitespace-nowrap" data-node-id="3:658">
        Thank You
      </p>
      <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] left-1/2 text-[#000614] text-[24px] text-center top-[calc(100%-115px)] tracking-[-0.36px] w-[464px]" data-node-id="3:659">
        fullname@email.com
      </p>
      <div className="absolute h-[49px] left-[901px] top-[586px] w-[117.284px]" data-node-id="3:660">
        <img alt="" className="absolute block max-w-none size-full" src={imgGroup15} />
      </div>
    </div>
  );
}
```
