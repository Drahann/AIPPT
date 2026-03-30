# Slide 3:345 · Outcomes（Old UI vs New UI 双手机 mock + 中间分隔线 + Footer）

**Frame ID**: `3:345`  
**布局**: 白底 #fafbff；标题「Outcomes」Heading 2 48px 蓝；左「Old UI」+ 手机 mock，右「New UI」+ 手机 mock，中间垂直 Constraint 分隔线；Footer 黑条 + Logo + Company Name。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Body**: Manrope Medium 36px, #000614
- **Mobile mock**: 291×598 rounded-32，屏内图 262×568
- **Caption**: Manrope Medium 24px, #fafbff

## 参考代码 (React + Tailwind)

**资源**: imgImage6, imgVector, imgConstraint, imgGroup2。Figma MCP asset 约 7 天后失效。

```tsx
const imgImage6 = "./imgImage6.png";
const imgVector = "./imgVector.svg";
const imgConstraint = "./imgConstraint.svg";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:345">
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:346">
        Outcomes
      </p>
      <p className="-translate-x-1/2 absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] left-[622.5px] opacity-85 text-[#000614] text-[36px] text-center top-[238px] tracking-[-0.54px] w-[129px]" data-node-id="3:347">
        Old UI
      </p>
      <div className="absolute content-stretch flex flex-col items-center left-[1291px] top-[238.5px]" data-node-id="3:348">
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[36px] text-center tracking-[-0.54px] w-[129px]" data-node-id="3:349">
          New UI
        </p>
        <div className="h-[7.008px] relative shrink-0 w-[88.671px]" data-name="Vector" data-node-id="3:350">
          <div className="absolute inset-[-8.48%_-0.67%]">
            <img alt="" className="block max-w-none size-full" src={imgVector} />
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[204px] items-center left-[477px] top-[317.41px]" data-node-id="3:351">
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="3:352">
          <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:353">
            <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:354" />
          </div>
          <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:355">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
          </div>
        </div>
        <div className="flex h-[533px] items-center justify-center relative shrink-0 w-[34px]">
          <div className="-rotate-90 flex-none">
            <div className="h-[34px] relative w-[533px]" data-name="Constraint" data-node-id="3:356">
              <div className="absolute inset-[0_-0.14%]">
                <img alt="" className="block max-w-none size-full" src={imgConstraint} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="3:360">
          <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:361">
            <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:362" />
          </div>
          <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:363">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:364" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:365">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:366">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup2} />
        </div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:370">
          Company Name
        </p>
      </div>
    </div>
  );
}
```
