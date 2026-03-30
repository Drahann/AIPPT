# Slide 3:371 · Solutions（中央手机 mock + Feature A/B/C 标注线 + Footer）

**Frame ID**: `3:371`  
**布局**: 白底 #fafbff；标题「Solutions」Heading 2 48px 蓝；中央 368×756 手机 mock；周围三组标注（粉/绿/黄）：Feature A 右侧、Feature B 左侧、Feature C 右下，各接 Caption 24px 描述；Footer。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Caption**: Manrope Medium 24px, #000614
- **手机 mock**: 368×756 rounded-32，屏内 332×720

## 参考代码 (React + Tailwind)

**资源**: imgImage5, imgFrame1618872717/8/9, imgGroup2。Figma MCP asset 约 7 天后失效。

```tsx
const imgImage5 = "./imgImage5.png";
const imgFrame1618872717 = "./imgFrame1618872717.svg";
const imgFrame1618872718 = "./imgFrame1618872718.svg";
const imgFrame1618872719 = "./imgFrame1618872719.svg";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:371">
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:372">
        Solutions
      </p>
      <div className="absolute contents left-[775px] top-[160px]" data-node-id="3:373">
        <div className="absolute bg-[#000614] h-[756px] left-[775px] rounded-[32px] top-[160px] w-[368px]" data-name="MobileScreen_default" data-node-id="3:374" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[720px] left-[calc(50%-1px)] top-[calc(50%-2px)] w-[332px]" data-name="image 5" data-node-id="3:375">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage5} />
        </div>
      </div>
      <div className="absolute h-[128px] left-[744px] top-[234px] w-[603px]" data-node-id="3:376">
        <div className="absolute inset-[0_-0.33%_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgFrame1618872717} />
        </div>
      </div>
      <div className="absolute h-[216px] left-[581px] top-[430px] w-[526px]" data-node-id="3:379">
        <div className="absolute inset-[0_0_0_-0.38%]">
          <img alt="" className="block max-w-none size-full" src={imgFrame1618872718} />
        </div>
      </div>
      <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] left-[1368px] opacity-85 text-[#000614] text-[24px] top-[241px] tracking-[-0.36px] w-[304px]" data-node-id="3:382">
        Feature A and how it has been improved to enhance user experience.
      </p>
      <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] left-[264px] opacity-85 text-[#000614] text-[24px] top-[483px] tracking-[-0.36px] w-[304px]" data-node-id="3:383">
        Feature B and how it has been improved to enhance user experience.
      </p>
      <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] left-[1285px] opacity-85 text-[#000614] text-[24px] top-[744px] tracking-[-0.36px] w-[304px]" data-node-id="3:384">
        Feature C and how it has been improved to enhance user experience.
      </p>
      <div className="absolute flex h-[202px] items-center justify-center left-[878px] top-[697px] w-[375px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[202px] relative w-[375px]" data-node-id="3:385">
            <div className="absolute inset-[0_-0.18%_0_-0.53%]">
              <img alt="" className="block max-w-none size-full" src={imgFrame1618872719} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:389" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:390">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:391">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup2} />
        </div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:395">
          Company Name
        </p>
      </div>
    </div>
  );
}
```
