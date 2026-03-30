# Slide 3:248 · Research Methodology（左 Method 1/2/3 列表 + 右维恩图 + Footer）

**Frame ID**: `3:248`  
**布局**: 白底 #fafbff；左「Research Methodology」+「Data Collection Strategies」+ 三组 Option（Sub-Header 40px + Caption 24px）；右维恩图 + Method 1/2/3 标签；Footer。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Heading 1**: Manrope SemiBold 64px
- **Sub-Header**: Manrope SemiBold 40px
- **Caption**: Manrope Medium 24px

## 参考代码 (React + Tailwind)

```tsx
const imgFrame1618872693 = "./imgFrame1618872693.svg";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:248">
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:249">Research Methodology</p>
      <p className="absolute font-['Manrope:SemiBold',sans-serif] font-semibold leading-[1.2] left-[168px] text-[#000614] text-[64px] top-[220px] tracking-[-0.96px] whitespace-nowrap" data-node-id="3:250">Data Collection Strategies</p>
      <div className="absolute content-stretch flex flex-col gap-[48px] items-start left-[168px] text-[#000614] top-[378.67px] w-[658px]" data-node-id="3:251">
        {[1, 2, 3].map((i) => (
          <div key={i} className="content-stretch flex flex-col gap-[10.55px] items-start relative shrink-0 w-full" data-name="Option">
            <p className="font-['Manrope:SemiBold',sans-serif] font-semibold leading-[1.3] relative shrink-0 text-[40px] tracking-[-0.6px] w-[658px]">Method {i}</p>
            <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] min-w-full opacity-85 relative shrink-0 text-[24px] tracking-[-0.36px] w-[min-content]">This would be a brief on a method you employed during your research and how it contributes to the desired outcome.</p>
          </div>
        ))}
      </div>
      <div className="absolute h-[535px] left-[990px] top-[361px] w-[762px]" data-node-id="3:261">
        <div className="absolute h-[535.186px] left-[124px] top-0 w-[546.845px]" data-node-id="3:262"><img alt="" className="absolute block max-w-none size-full" src={imgFrame1618872693} /></div>
        <div className="absolute bg-[#fafbff] content-stretch flex items-center justify-center left-[92px] p-[8px] top-[422px]"><p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[356px] whitespace-pre-wrap">{`Method  3`}</p></div>
        <div className="absolute bg-[#fafbff] content-stretch flex items-center justify-center left-[-63px] p-[8px] top-[138px] w-[343px]"><p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] whitespace-nowrap">Method 1</p></div>
        <div className="absolute bg-[#fafbff] content-stretch flex items-center justify-center left-[490px] p-[8px] top-[103px] w-[320px]"><p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[279px] whitespace-pre-wrap">{`Method  2`}</p></div>
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:285" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:286">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:287"><img alt="" className="absolute block max-w-none size-full" src={imgGroup2} /></div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:291">Company Name</p>
      </div>
    </div>
  );
}
```
