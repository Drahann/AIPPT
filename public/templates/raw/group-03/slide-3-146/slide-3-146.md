# Slide 3:146 · Old User Experience（标题 + 三台 Mobile 手机 mock + Footer）

**Frame ID**: `3:146`  
**布局**: 白底 #fafbff；标题「Old User Experience」Heading 2 48px 蓝；三列：Home Screen / Product Page / Checkout，各 Caption 24px + Mobile mock 291×598 rounded-32 + 屏内图 262×568；Footer 黑条 + Logo + Company Name。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Caption**: Manrope Medium 24px, #000614

## 参考代码 (React + Tailwind)

```tsx
const imgImage6 = "./imgImage6.png";
const imgGroup2 = "./imgGroup2.svg";

const MobileBlock = ({ label, nodeId }: { label: string; nodeId: string }) => (
  <div className="content-stretch flex flex-col gap-[51px] items-center justify-end relative shrink-0">
    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#000614] text-[24px] text-center tracking-[-0.36px] whitespace-nowrap">{label}</p>
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1">
        <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" />
      </div>
      <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]"><img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} /></div>
    </div>
  </div>
);

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:146">
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[calc(50%-792px)] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:147">Old User Experience</p>
      <div className="-translate-x-1/2 absolute content-stretch flex gap-[124px] items-end left-[calc(50%+0.5px)] top-[236px]" data-node-id="3:148">
        <MobileBlock label="Home Screen" nodeId="3:149" />
        <MobileBlock label="Product Page" nodeId="3:155" />
        <MobileBlock label="Checkout" nodeId="3:161" />
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:167" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:168">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:169"><img alt="" className="absolute block max-w-none size-full" src={imgGroup2} /></div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:173">Company Name</p>
      </div>
    </div>
  );
}
```
