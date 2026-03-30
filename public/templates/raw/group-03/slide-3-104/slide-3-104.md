# Slide 3:104 · Agenda（标题 + 5 项编号列表 + Divider + Footer）

**Frame ID**: `3:104`  
**布局**: 白底 #fafbff；标题「Agenda」Heading 2 48px 蓝；5 项：序号 1–5 Heading 1 64px 蓝 + 标题 SemiBold 64px 黑，Divider 分隔；底 Footer 黑条 + Logo + Company Name。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Heading 1**: Manrope SemiBold 64px；序号 #2569ed，文本 #000614
- **Caption**: Manrope Medium 24px, #fafbff

## 参考代码 (React + Tailwind)

```tsx
const imgVector63 = "./imgVector63.svg";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  const items = [
    { n: "1", t: "Problem" },
    { n: "2", t: "Solution" },
    { n: "3", t: "Improvements" },
    { n: "4", t: "Product" },
    { n: "5", t: "Solution Analysis" },
  ];
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:104">
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:105">Agenda</p>
      <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[168px] top-[220px] w-[1160px]" data-node-id="3:106">
        {items.map(({ n, t }, i) => (
          <div key={i}>
            <div className="content-stretch flex font-['Manrope:SemiBold',sans-serif] font-semibold gap-[16px] items-start leading-[1.2] py-[12px] relative shrink-0 text-[64px] tracking-[-0.96px] w-[1160px]">
              <p className="relative shrink-0 text-[#2569ed] text-center w-[100px]">{n}</p>
              <p className="relative shrink-0 text-[#000614] w-[1044px]">{t}</p>
            </div>
            {i < items.length - 1 && (
              <div className="h-0 relative shrink-0 w-[1160px]"><div className="absolute inset-[-0.5px_0]"><img alt="" className="block max-w-none size-full" src={imgVector63} /></div></div>
            )}
          </div>
        ))}
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:126" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:127">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:128"><img alt="" className="absolute block max-w-none size-full" src={imgGroup2} /></div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:132">Company Name</p>
      </div>
    </div>
  );
}
```
