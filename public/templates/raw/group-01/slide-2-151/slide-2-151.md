# Slide 2:151 · 3-Image（左一大图 930×1040 + 右上/右下各 930×510）

**Frame ID**: `2:151`  
**布局**: 白底；左侧整块图 930×1040；右上、右下各 930×510 图。

**资源**: imgImage, imgImage1, imgImage2 — Figma MCP，7 天失效。

## 参考代码 (React + Tailwind)

```tsx
const imgImage = "./imgImage.png";
const imgImage1 = "./imgImage1.png";
const imgImage2 = "./imgImage2.png";

export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:151">
      <div className="absolute bottom-[20px] h-[510px] right-[20px] w-[930px]" data-name="Image" data-node-id="2:152">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
      <div className="absolute h-[510px] right-[20px] top-[20px] w-[930px]" data-name="Image" data-node-id="2:153">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <div className="absolute aspect-[930/1040] bottom-[20px] left-[20px] top-[20px]" data-name="Image" data-node-id="2:154">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
