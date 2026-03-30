# Slide 3:219 · Our Design Process（时间轴：Ideation / Research / Develop / Testing / Deploy + Research 详情列表 + Footer）

**Frame ID**: `3:219`  
**布局**: 白底 #fafbff；标题「Our Design Process」Heading 2 48px 蓝；五步流程：Ideation / Research / Develop / Testing / Deploy，Research 有蓝条 + 下接 Vector 线 + 详情列表（App Analytics, Heat Mapping 等）；Footer。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Sub-Header**: Manrope SemiBold 40px
- **Body**: Manrope Medium 36px

## 参考代码 (React + Tailwind)

```tsx
const imgVector59 = "./imgVector59.svg";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  const steps = [
    { name: "Ideation", active: false },
    { name: "Research", active: true },
    { name: "Develop", active: false },
    { name: "Testing", active: false },
    { name: "Deploy", active: false },
  ];
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:219">
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:220">Our Design Process</p>
      <div className="-translate-x-1/2 absolute content-stretch flex gap-[19px] items-start left-[calc(50%-0.25px)] top-[345px]" data-node-id="3:221">
        {steps.map(({ name, active }, i) => (
          <div key={i} className="content-stretch flex flex-col gap-[25.333px] items-center relative shrink-0">
            <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] tracking-[-0.54px] whitespace-nowrap">{name}</p>
            <div className={`h-[43px] rounded-[8px] shrink-0 w-[285px] ${active ? "bg-[#2569ed]" : "bg-[#2569ed] opacity-10"}`} />
          </div>
        ))}
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 absolute left-[calc(50%-152.75px)] top-[468px]">
        <div className="h-[130px] relative shrink-0 w-[305.5px]"><div className="absolute inset-[-1.03%_-0.44%]"><img alt="" className="block max-w-none size-full" src={imgVector59} /></div></div>
        <div className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] whitespace-nowrap">
          <p className="mb-0">App Analytics</p>
          <p className="mb-0">Heat Mapping</p>
          <p className="mb-0">User Surveys</p>
          <p className="mb-0">User Interviews</p>
          <p>A/B testing</p>
        </div>
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:241" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:242">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:243"><img alt="" className="absolute block max-w-none size-full" src={imgGroup2} /></div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:247">Company Name</p>
      </div>
    </div>
  );
}
```
