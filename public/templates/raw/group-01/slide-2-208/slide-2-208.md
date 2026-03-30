# Slide 2:208 · CTA（渐变背景 + 左 Paragraph + Buttons + 右 Desktop app screen）

**Frame ID**: `2:208`  
**布局**: 渐变 from #a8d3ff to #fff4df；左侧 Paragraph（标题 64px「Join Aetherfield」+ 正文 36px）；下方两按钮黑底白字（Request a demo / Learn more），Geist Mono Medium 22px；右侧居中偏右 1400×886 圆角 35px、3px 黑边桌面屏图。

**样式**: Button CTA (Geist Mono Medium 22px), Subheadline 1 (64px), Body large (36px)。

**资源**: imgDesktopAppScreen — Figma MCP，7 天失效。

## 参考代码 (React + Tailwind)

```tsx
const imgDesktopAppScreen = "./imgDesktopAppScreen.png";

export default function Frame() {
  return (
    <div className="bg-gradient-to-b from-[var(--color-10,#a8d3ff)] relative size-full to-[var(--color-11,#fff4df)]" data-name="Frame" data-node-id="2:208">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute border-3 border-[var(--color-1,black)] border-solid h-[886px] left-[calc(50%+700px)] rounded-[35px] top-1/2 w-[1400px]" data-name="Desktop app screen" data-node-id="2:209">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[35px] size-full" src={imgDesktopAppScreen} />
      </div>
      <div className="absolute content-stretch flex gap-[24px] items-center left-[120px] top-[626.5px]" data-name="Buttons" data-node-id="2:210">
        <div className="bg-[var(--color-1,black)] content-stretch flex gap-[16px] items-center justify-center p-[24px] relative shrink-0" data-name="Button" data-node-id="2:211">
          <div className="bg-[var(--color-2,white)] shrink-0 size-[6.485px]" data-name="Rectangle" data-node-id="2:212" />
          <p className="font-['Geist_Mono:Medium',sans-serif] font-medium leading-none relative shrink-0 text-[22px] text-[color:var(--color-2,white)] whitespace-nowrap" data-node-id="2:213">Request a demo</p>
        </div>
        <div className="bg-[var(--color-1,black)] content-stretch flex gap-[16px] items-center justify-center p-[24px] relative shrink-0" data-name="Button" data-node-id="2:214">
          <div className="bg-[var(--color-2,white)] shrink-0 size-[6.485px]" data-name="Rectangle" data-node-id="2:215" />
          <p className="font-['Geist_Mono:Medium',sans-serif] font-medium leading-none relative shrink-0 text-[22px] text-[color:var(--color-2,white)] whitespace-nowrap" data-node-id="2:216">Learn more</p>
        </div>
      </div>
      <div className="absolute bottom-[509.5px] content-stretch flex flex-col gap-[24px] items-start left-[120px] text-[color:var(--color-1,black)] w-[720px]" data-name="Paragraph" data-node-id="2:217">
        <p className="font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[64px] tracking-[-1.92px] w-full" data-node-id="2:218">Join Aetherfield</p>
        <p className="font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.3] not-italic relative shrink-0 text-[36px] tracking-[-1.44px] w-full" data-node-id="2:219">Help your business take climate action with clarity today. Free trials available.</p>
      </div>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
