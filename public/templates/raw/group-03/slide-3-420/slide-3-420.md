# Slide 3:420 · Product Performance Chart（分组柱状图 + Y/X 轴 + 图例 + Footer）

**Frame ID**: `3:420`  
**布局**: 白底 #fafbff；标题「Product Performance Chart」Heading 2 48px 蓝；左侧图表区：Y 轴 0–5、网格线、X 轴 6 项（Conversion Rate、Bounce Rate 等）；分组柱 Before/After Redesign（黄 #edb842 / 蓝 #2569ed）；右上图例；Footer。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **Subtext 1**: Manrope Medium 22px, #000614
- **Subtext 2**: Manrope Regular 18px
- **Caption**: Manrope Medium 24px, #fafbff
- **柱状色**: Aspen Yellow #EDB842, Space Blue #2569ED

## 参考代码 (React + Tailwind)

**资源**: imgVector5, imgVector6, imgGroup2。Figma MCP asset 约 7 天后失效。

```tsx
const imgVector5 = "./imgVector5.svg";
const imgVector6 = "./imgVector6.svg";
const imgGroup2 = "./imgGroup2.svg";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:420">
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:421">
        Product Performance Chart
      </p>
      <div className="absolute content-stretch flex flex-col gap-[10px] items-start left-[168px] overflow-clip px-[24px] py-[32px] right-[392px] rounded-[16px] top-[204px]" data-node-id="3:422">
        <div className="content-stretch flex flex-col gap-[27px] items-center relative shrink-0" data-node-id="3:423">
          <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] opacity-0 relative shrink-0 text-[#000614] text-[21.249px] whitespace-nowrap" data-node-id="3:424">
            X axis unit
          </p>
          <div className="content-stretch flex flex-col gap-[27px] items-end relative shrink-0" data-node-id="3:425">
            <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="3:426">
              <div className="flex h-[149px] items-center justify-center relative shrink-0 w-[33px]">
                <div className="-rotate-90 flex-none">
                  <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-85 relative text-[#000614] text-[22px] tracking-[-0.33px] whitespace-nowrap" data-node-id="3:427">
                    Y axis unit Title
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0" data-node-id="3:428">
                <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0" data-node-id="3:429">
                  <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="3:430">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-65 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:431">
                      5.0
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:432">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector5} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[24px] items-center opacity-25 relative shrink-0" data-node-id="3:433">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-0 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:434">
                      4.5
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:435">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector6} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0" data-node-id="3:436">
                  <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="3:437">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-65 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:438">
                      4.0
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:439">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector5} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[24px] items-center opacity-25 relative shrink-0" data-node-id="3:440">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-0 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:441">
                      3.5
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:442">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector6} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0" data-node-id="3:443">
                  <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="3:444">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-65 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:445">
                      3.0
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:446">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector5} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[24px] items-center opacity-25 relative shrink-0" data-node-id="3:447">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-0 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:448">
                      2.5
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:449">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector6} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0" data-node-id="3:450">
                  <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="3:451">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-65 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:452">
                      2.0
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:453">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector5} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[24px] items-center opacity-25 relative shrink-0" data-node-id="3:454">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-0 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:455">
                      2.5
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:456">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector6} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0" data-node-id="3:457">
                  <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="3:458">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-65 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:459">
                      1.0
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:460">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector5} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[24px] items-center opacity-25 relative shrink-0" data-node-id="3:461">
                    <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] opacity-0 relative shrink-0 text-[#000614] text-[21.249px] text-right whitespace-nowrap" data-node-id="3:462">
                      0.5
                    </p>
                    <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:463">
                      <div className="absolute inset-[-0.82px_0]">
                        <img alt="" className="block max-w-none size-full" src={imgVector6} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="3:464">
                  <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-65 relative shrink-0 text-[#000614] text-[22px] text-right tracking-[-0.33px] whitespace-nowrap" data-node-id="3:465">
                    0.0
                  </p>
                  <div className="h-0 relative shrink-0 w-[1144px]" data-node-id="3:466">
                    <div className="absolute inset-[-0.82px_0]">
                      <img alt="" className="block max-w-none size-full" src={imgVector5} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex h-[98px] items-center justify-center relative shrink-0 w-[32px]">
                <div className="-rotate-90 flex-none">
                  <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] opacity-0 relative text-[#000614] text-[21.249px] whitespace-nowrap" data-node-id="3:467">
                    Y axis unit
                  </p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-end px-[54px] relative shrink-0" data-node-id="3:468">
              <div className="content-stretch flex font-['Manrope:Regular',sans-serif] font-normal items-start justify-between leading-[1.2] relative shrink-0 text-[#000614] text-[18px] text-center tracking-[-0.27px] w-[1145px]" data-name="X Axis" data-node-id="3:469">
                <div className="flex-[1_0_0] min-h-px min-w-px opacity-65 relative" data-node-id="3:470">
                  <p className="mb-0">Conversion</p>
                  <p>Rate</p>
                </div>
                <div className="flex-[1_0_0] min-h-px min-w-px opacity-65 relative" data-node-id="3:471">
                  <p className="mb-0">Bounce</p>
                  <p>Rate</p>
                </div>
                <div className="flex-[1_0_0] min-h-px min-w-px opacity-65 relative" data-node-id="3:472">
                  <p className="mb-0">Task</p>
                  <p>Completion</p>
                </div>
                <div className="flex-[1_0_0] min-h-px min-w-px opacity-65 relative" data-node-id="3:473">
                  <p className="mb-0">App</p>
                  <p>Crashes</p>
                </div>
                <div className="flex-[1_0_0] min-h-px min-w-px opacity-65 relative" data-node-id="3:474">
                  <p className="mb-0">Sales</p>
                  <p>Conversion</p>
                </div>
                <div className="flex-[1_0_0] min-h-px min-w-px opacity-65 relative" data-node-id="3:475">
                  <p className="mb-0">User</p>
                  <p>Rating</p>
                </div>
              </div>
            </div>
          </div>
          <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[22px] tracking-[-0.33px] whitespace-nowrap" data-node-id="3:476">
            X axis unit Title
          </p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex items-end left-[calc(50%+27px)] top-[calc(50%-48px)]" data-node-id="3:477">
          <div className="content-stretch flex gap-[4px] items-end justify-center px-[28px] relative shrink-0" data-node-id="3:478">
            <div className="bg-[#edb842] h-[181px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:479" />
            <div className="bg-[#2569ed] h-[411px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:480" />
          </div>
          <div className="content-stretch flex gap-[4px] items-end justify-center px-[28px] relative shrink-0" data-node-id="3:481">
            <div className="bg-[#edb842] h-[173px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:482" />
            <div className="bg-[#2569ed] h-[99px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:483" />
          </div>
          <div className="content-stretch flex gap-[4px] h-[485px] items-end justify-center px-[28px] relative shrink-0" data-node-id="3:484">
            <div className="bg-[#edb842] h-[326px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:485" />
            <div className="bg-[#2569ed] h-[410px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:486" />
          </div>
          <div className="content-stretch flex gap-[4px] items-end justify-center px-[28px] relative shrink-0" data-node-id="3:487">
            <div className="bg-[#edb842] h-[403px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:488" />
            <div className="bg-[#2569ed] h-[169px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:489" />
          </div>
          <div className="content-stretch flex gap-[4px] items-end justify-center px-[28px] relative shrink-0" data-node-id="3:490">
            <div className="bg-[#edb842] h-[262px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:491" />
            <div className="bg-[#2569ed] h-[332px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:492" />
          </div>
          <div className="content-stretch flex gap-[4px] items-end justify-center px-[28px] relative shrink-0" data-node-id="3:493">
            <div className="bg-[#edb842] h-[206px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:494" />
            <div className="bg-[#2569ed] h-[428px] rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[64px]" data-node-id="3:495" />
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[1543px] top-[297px]" data-node-id="3:496">
        <div className="content-stretch flex gap-[15px] items-center relative shrink-0" data-node-id="3:497">
          <div className="bg-[#edb842] h-[12px] shrink-0 w-[32px]" data-node-id="3:498" />
          <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[22px] tracking-[-0.33px] whitespace-nowrap" data-node-id="3:499">
            Before Redesign
          </p>
        </div>
        <div className="content-stretch flex gap-[15px] items-center relative shrink-0" data-node-id="3:500">
          <div className="bg-[#2569ed] h-[12px] shrink-0 w-[32px]" data-node-id="3:501" />
          <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] opacity-85 relative shrink-0 text-[#000614] text-[22px] tracking-[-0.33px] whitespace-nowrap" data-node-id="3:502">
            After Redesign
          </p>
        </div>
      </div>
      <div className="absolute bg-[#000614] h-[80px] left-0 top-[calc(100%-80px)] w-[1920px]" data-node-id="3:503" />
      <div className="absolute content-stretch flex items-center justify-between left-[64px] top-[calc(100%-62px)] w-[1792px]" data-node-id="3:504">
        <div className="h-[43.451px] relative shrink-0 w-[104px]" data-node-id="3:505">
          <img alt="" className="absolute block max-w-none size-full" src={imgGroup2} />
        </div>
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.5] relative shrink-0 text-[#fafbff] text-[24px] text-right tracking-[-0.36px] whitespace-nowrap" data-node-id="3:509">
          Company Name
        </p>
      </div>
    </div>
  );
}
```
