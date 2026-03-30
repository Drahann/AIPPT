# Slide 3:592 · Quote（居中引号 + 引用文本 + 作者 + Footer）

**Frame ID**: `3:592`  
**布局**: 白底 #fafbff；中央大引号「"」Orbit Blue 96px + 两行引用文本 Sub-Header 40px + 作者 Caption 24px；Footer 黑条 + Logo + Company Name。

## 样式
- **Quote 符号**: Manrope Bold 96px, #00ceff
- **Sub-Header**: Manrope SemiBold 40px, #000614
- **Caption**: Manrope Medium 24px, #000614 opacity-85

## 参考代码 (React + Tailwind)

**资源**: imgGroup2。Figma MCP asset 约 7 天后失效。

```tsx
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:592">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[10px] items-start left-1/2 top-1/2" data-node-id="3:593">
        <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[1.2] relative shrink-0 text-[#00ceff] text-[96px] tracking-[-1.92px] whitespace-nowrap" data-node-id="3:594">
          "
        </p>
        <div className="content-stretch flex flex-col gap-[32px] items-start py-[64px] relative shrink-0 text-[#000614]" data-node-id="3:595">
          <div className="font-['Manrope:SemiBold',sans-serif] font-semibold leading-[1.3] relative shrink-0 text-[40px] tracking-[-0.6px] w-[1210px] whitespace-pre-wrap" data-node-id="3:596">
            <p className="mb-0">{`This is a sample quote text. Insert your own text here! `}</p>
            <p>{`Great design is achieved when a spark of creativity is... `}</p>
          </div>
          <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] min-w-full opacity-85 relative shrink-0 text-[24px] tracking-[-0.36px] w-[min-content]" data-node-id="3:597">
            - Add Author Name Here
          </p>
        </div>
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:598" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:599">
        <div className="h-[43.451px] relative shrink-0 w-[103.998px]" data-node-id="3:600">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup2} />
        </div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:604">
          Company Name
        </p>
      </div>
    </div>
  );
}
```
