# Slide 3:605 · Meet the Team（8 人头像网格 2×4 + 圆角照片框 + Footer）

**Frame ID**: `3:605`  
**布局**: 白底 #fafbff；标题「Meet the Team」Heading 2 48px 蓝；8 个成员卡片 2 行 4 列：180×180 圆角头像 + Full Name Caption 24px + Role Subtext 22px；Footer 黑条 + Logo + Company Name。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Caption**: Manrope Medium 24px, #000614
- **Subtext**: Manrope Medium 22px, #000614 opacity-65
- **头像框**: 180×180 rounded-tr-48px, border #2569ed

## 参考代码 (React + Tailwind)

**资源**: imgFrame1618872753, imgGroup2。Figma MCP asset 约 7 天后失效。

```tsx
const imgFrame1618872753 = "./imgFrame1618872753.png";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:605">
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.2] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-1.056px] whitespace-nowrap" data-node-id="3:606">
        Meet the Team
      </p>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:607" />
      <div className="absolute content-stretch flex gap-[1519px] items-center left-[64px] top-[calc(100%-62px)]" data-node-id="3:608">
        <div className="h-[43.451px] relative shrink-0 w-[103.998px]" data-node-id="3:609">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup2} />
        </div>
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.6] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.528px] whitespace-nowrap" data-node-id="3:613">
          Company Name
        </p>
      </div>
      <div className="absolute content-stretch flex gap-[196px] items-start left-[169px] top-[235px]" data-node-id="3:614">
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:615">
          <div className="border border-[#2569ed] border-solid relative rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px] shrink-0 size-[180px]" data-node-id="3:616">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px]">
              <img alt="" className="absolute h-[105.08%] left-0 max-w-none top-[-2.54%] w-full" src={imgFrame1618872753} />
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center leading-[1.5] relative shrink-0 text-[#000614] text-center" data-node-id="3:617">
            <p className="relative shrink-0 text-[24px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:618">
              Full Name
            </p>
            <p className="opacity-65 relative shrink-0 text-[22px] tracking-[-0.33px] w-[178px]" data-node-id="3:619">
              Role Here
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:620">
          <div className="border border-[#2569ed] border-solid relative rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px] shrink-0 size-[180px]" data-node-id="3:621">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px]">
              <img alt="" className="absolute h-[105.08%] left-0 max-w-none top-[-2.54%] w-full" src={imgFrame1618872753} />
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center leading-[1.5] relative shrink-0 text-[#000614] text-center" data-node-id="3:622">
            <p className="relative shrink-0 text-[24px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:623">
              Full Name
            </p>
            <p className="opacity-65 relative shrink-0 text-[22px] tracking-[-0.33px] w-[178px]" data-node-id="3:624">
              Role Here
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:625">
          <div className="border border-[#2569ed] border-solid relative rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px] shrink-0 size-[180px]" data-node-id="3:626">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px]">
              <img alt="" className="absolute h-[105.08%] left-0 max-w-none top-[-2.54%] w-full" src={imgFrame1618872753} />
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center leading-[1.5] relative shrink-0 text-[#000614] text-center" data-node-id="3:627">
            <p className="relative shrink-0 text-[24px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:628">
              Full Name
            </p>
            <p className="opacity-65 relative shrink-0 text-[22px] tracking-[-0.33px] w-[178px]" data-node-id="3:629">
              Role Here
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:630">
          <div className="border border-[#2569ed] border-solid relative rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px] shrink-0 size-[180px]" data-node-id="3:631">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px]">
              <img alt="" className="absolute h-[105.08%] left-0 max-w-none top-[-2.54%] w-full" src={imgFrame1618872753} />
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center leading-[1.5] relative shrink-0 text-[#000614] text-center" data-node-id="3:632">
            <p className="relative shrink-0 text-[24px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:633">
              Full Name
            </p>
            <p className="opacity-65 relative shrink-0 text-[22px] tracking-[-0.33px] w-[178px]" data-node-id="3:634">
              Role Here
            </p>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[196px] items-start left-[168px] top-[575px]" data-node-id="3:635">
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:636">
          <div className="border border-[#2569ed] border-solid relative rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px] shrink-0 size-[180px]" data-node-id="3:637">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px]">
              <img alt="" className="absolute h-[105.08%] left-0 max-w-none top-[-2.54%] w-full" src={imgFrame1618872753} />
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center leading-[1.5] relative shrink-0 text-[#000614] text-center" data-node-id="3:638">
            <p className="relative shrink-0 text-[24px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:639">
              Full Name
            </p>
            <p className="opacity-65 relative shrink-0 text-[22px] tracking-[-0.33px] w-[178px]" data-node-id="3:640">
              Role Here
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:641">
          <div className="border border-[#2569ed] border-solid relative rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px] shrink-0 size-[180px]" data-node-id="3:642">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px]">
              <img alt="" className="absolute h-[105.08%] left-0 max-w-none top-[-2.54%] w-full" src={imgFrame1618872753} />
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center leading-[1.5] relative shrink-0 text-[#000614] text-center" data-node-id="3:643">
            <p className="relative shrink-0 text-[24px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:644">
              Full Name
            </p>
            <p className="opacity-65 relative shrink-0 text-[22px] tracking-[-0.33px] w-[178px]" data-node-id="3:645">
              Role Here
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:646">
          <div className="border border-[#2569ed] border-solid relative rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px] shrink-0 size-[180px]" data-node-id="3:647">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px]">
              <img alt="" className="absolute h-[105.08%] left-0 max-w-none top-[-2.54%] w-full" src={imgFrame1618872753} />
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center leading-[1.5] relative shrink-0 text-[#000614] text-center" data-node-id="3:648">
            <p className="relative shrink-0 text-[24px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:649">
              Full Name
            </p>
            <p className="opacity-65 relative shrink-0 text-[22px] tracking-[-0.33px] w-[178px]" data-node-id="3:650">
              Role Here
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:651">
          <div className="border border-[#2569ed] border-solid relative rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px] shrink-0 size-[180px]" data-node-id="3:652">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[48px]">
              <img alt="" className="absolute h-[105.08%] left-0 max-w-none top-[-2.54%] w-full" src={imgFrame1618872753} />
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Manrope:Medium',sans-serif] font-medium gap-[4px] items-center leading-[1.5] relative shrink-0 text-[#000614] text-center" data-node-id="3:653">
            <p className="relative shrink-0 text-[24px] tracking-[-0.36px] whitespace-nowrap" data-node-id="3:654">
              Full Name
            </p>
            <p className="opacity-65 relative shrink-0 text-[22px] tracking-[-0.33px] w-[178px]" data-node-id="3:655">
              Role Here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```
