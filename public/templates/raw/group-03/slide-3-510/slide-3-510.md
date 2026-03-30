# Slide 3:510 · Product Screens（15 台手机 mock 倾斜簇 + 白底圆角框 + Footer）

**Frame ID**: `3:510`  
**布局**: 白底 #fafbff；标题「Product Screens」Heading 2 48px 蓝；中央 1584×717 白底圆角框内，15 台手机 mock 以 -15° 倾斜簇状排列（3×5 网格）；无 Footer。

## 样式
- **Heading 2**: Manrope Bold 48px, #2569ed
- **手机 mock**: 291×598 rounded-32，屏内图 262×568
- **容器**: 1584×717 rounded-24 overflow-clip

## 参考代码 (React + Tailwind)

**资源**: imgImage6。Figma MCP asset 约 7 天后失效。

```tsx
const imgImage6 = "./imgImage6.png";

export default function Frame() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="Frame" data-node-id="3:510">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#fafbff] h-[717px] left-1/2 overflow-clip rounded-[24px] top-[calc(50%+52.5px)] w-[1584px]" data-name="Screens" data-node-id="3:511">
        <div className="absolute flex h-[2338.6px] items-center justify-center left-[-400px] top-[-810px] w-[2266.678px]">
          <div className="-rotate-15 flex-none">
            <div className="h-[1930.954px] leading-[0] relative w-[1829.24px]" data-name="Cluster" data-node-id="3:512">
              <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-[-3.43px] top-[241.05px]" data-name="Screens" data-node-id="3:513">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:514">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:515">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:516" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:517">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:518">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:519">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:520" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:521">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:522">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:523">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:524" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:525">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-[632.09px] top-[241.55px]" data-name="Screens" data-node-id="3:526">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:527">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:528">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:529" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:530">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:531">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:532">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:533" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:534">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:535">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:536">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:537" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:538">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-[1267.88px] top-[241.09px]" data-name="Screens" data-node-id="3:539">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:540">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:541">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:542" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:543">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:544">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:545">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:546" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:547">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:548">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:549">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:550" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:551">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-[317.91px] top-0" data-name="Screens" data-node-id="3:552">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:553">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:554">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:555" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:556">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:557">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:558">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:559" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:560">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:561">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:562">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:563" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:564">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-[950.33px] top-[12.09px]" data-name="Screens" data-node-id="3:565">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:566">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:567">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:568" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:569">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:570">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:571">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:572" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:573">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:574">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:575">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:576" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:577">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-[1585.85px] top-[12.6px]" data-name="Screens" data-node-id="3:578">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:579">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:580">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:581" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:582">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:583">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:584">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:585" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:586">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-node-id="3:587">
                  <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-node-id="3:588">
                    <div className="bg-[#000614] col-1 h-[597.815px] ml-0 mt-0 rounded-[32px] row-1 w-[291px]" data-name="MobileScreen_default" data-node-id="3:589" />
                  </div>
                  <div className="col-1 h-[568px] ml-[15px] mt-[15px] relative row-1 w-[262px]" data-name="image 6" data-node-id="3:590">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] left-[168px] text-[#2569ed] text-[48px] top-[128px] tracking-[-0.72px] whitespace-nowrap" data-node-id="3:591">
        Product Screens
      </p>
    </div>
  );
}
```
