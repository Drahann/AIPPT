# Slide 2:124 · Quote（左图 + 引号 + Quote + 署名 + 右上 Sticker）

**Frame ID**: `2:124`  
**布局**: 白底；左侧图 620×1040；右侧引号图标 + Quote 64px + Customer name + Title, Company Name；右上 Sticker（椭圆 + Aetherfield 等文案）。

**样式**: Body 30px, Subheadline 5 30px, Quote 64px；Sticker 内 Radio Canada Big SemiBold 39px #2683eb, IBM Plex Serif Medium 21px。

**资源**: imgImage, img (引号), imgEllipse38137/138/139, imgInformation — Figma MCP，7 天失效。

## 参考代码 (React + Tailwind)

```tsx
const imgImage = "./imgImage.png";
const img = "https://www.figma.com/api/mcp/asset/482266a7-01e8-4909-a372-b6d1503db8b6";
const imgEllipse38137 = "./imgEllipse38137.svg";
const imgEllipse38138 = "./imgEllipse38138.svg";
const imgEllipse38139 = "./imgEllipse38139.svg";
const imgInformation = "./imgInformation.svg";

export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:124">
      <div className="absolute aspect-[620/1040] bottom-[20px] left-[20px] top-[20px]" data-name="Image" data-node-id="2:125">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
      <div className="absolute h-[36px] left-[860px] top-[277px] w-[42px]" data-name={'"'} data-node-id="2:126">
        <img alt="" className="absolute block max-w-none size-full" src={img} />
      </div>
      <p className="absolute font-['Source_Serif_Pro:Regular',sans-serif] leading-[1.2] left-[860px] not-italic text-[30px] text-[color:var(--color-6,#6c6c6c)] top-[767.02px] tracking-[-1.2px] w-[840px]" data-node-id="2:127">Title, Company Name</p>
      <p className="absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-none left-[860px] text-[30px] text-[color:var(--color-1,black)] top-[723px] tracking-[-0.6px] w-[840px]" data-node-id="2:128">Customer name</p>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Radio_Canada_Big:Medium',sans-serif] font-medium justify-center leading-[0] left-[860px] text-[64px] text-[color:var(--color-1,black)] top-[518px] tracking-[-1.92px] w-[840px]" data-node-id="2:129">
        <p className="leading-[1.1]">This is a customer quote describing how this product is amazing</p>
      </div>
      <div className="absolute contents h-[260.351px] left-[1514px] top-[-32px] w-[448.417px]" data-name="Sticker" data-node-id="2:130">
        <div className="absolute flex h-[260.351px] items-center justify-center left-[1514px] top-[-32px] w-[448.417px]">
          <div className="flex-none rotate-7">
            <div className="h-[210px] relative w-[426px]" data-node-id="2:131">
              <div className="absolute inset-[-0.43%_-0.21%]"><img alt="" className="block max-w-none size-full" src={imgEllipse38137} /></div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[230.371px] items-center justify-center left-[1636.08px] top-[-17.01px] w-[204.251px]">
          <div className="flex-none rotate-7">
            <div className="h-[210px] relative w-[180px]" data-node-id="2:132">
              <div className="absolute inset-[-0.43%_-0.5%]"><img alt="" className="block max-w-none size-full" src={imgEllipse38138} /></div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[244.264px] items-center justify-center left-[1579.51px] top-[-23.96px] w-[317.401px]">
          <div className="flex-none rotate-7">
            <div className="h-[210px] relative w-[294px]" data-node-id="2:133">
              <div className="absolute inset-[-0.43%_-0.31%]"><img alt="" className="block max-w-none size-full" src={imgEllipse38139} /></div>
            </div>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[78.067px] items-center justify-center left-[1738.27px] top-[97.14px] w-[126.775px]">
          <div className="flex-none rotate-7">
            <div className="flex flex-col font-['Radio_Canada_Big:SemiBold',sans-serif] font-semibold h-[63.934px] justify-center leading-[0.95] relative text-[39.04px] text-[color:var(--color-5,#2683eb)] text-center tracking-[-0.3904px] w-[119.877px]" data-node-id="2:134">
              <p className="mb-0">Aether</p><p>field</p>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[26.683px] items-center justify-center left-[1716.62px] top-[163.89px] w-[25.131px]">
          <div className="flex-none rotate-7">
            <div className="h-[24.138px] relative w-[22.356px]" data-name="Information" data-node-id="2:135">
              <div className="absolute inset-[-0.78%_-0.84%]"><img alt="" className="block max-w-none size-full" src={imgInformation} /></div>
            </div>
          </div>
        </div>
        <div className="-translate-x-1/2 absolute flex h-[25.814px] items-center justify-center left-[1556.6px] top-[58.43px] w-[43.209px]">
          <div className="flex-none rotate-7">
            <p className="font-['IBM_Plex_Serif:Medium',sans-serif] h-[20.978px] leading-none not-italic relative text-[21.022px] text-[color:var(--color-5,#2683eb)] text-center tracking-[-0.8409px] w-[40.958px]" data-node-id="2:136">tech</p>
          </div>
        </div>
        <div className="-translate-x-1/2 absolute flex h-[27.031px] items-center justify-center left-[1748.42px] top-[1.27px] w-[53.124px]">
          <div className="flex-none rotate-7">
            <p className="font-['IBM_Plex_Serif:Medium',sans-serif] h-[20.978px] leading-none not-italic relative text-[21.022px] text-[color:var(--color-5,#2683eb)] text-center tracking-[-0.8409px] w-[50.948px]" data-node-id="2:137">earth</p>
          </div>
        </div>
        <div className="-translate-x-full absolute flex h-[25.935px] items-center justify-center left-[calc(100%+20.98px)] top-[102.85px] w-[44.201px]">
          <div className="flex-none rotate-7">
            <p className="font-['IBM_Plex_Serif:Medium',sans-serif] h-[20.978px] leading-none not-italic relative text-[21.022px] text-[color:var(--color-5,#2683eb)] text-right tracking-[-0.8409px] w-[41.957px]" data-node-id="2:138">data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
