# Slide 2:51 · Full-bleed Background + Desktop Screen

**Frame ID**: `2:51`  
**布局**: 白底；内边距 20px 的 Background 图铺满；居中 1400×886 圆角 35px、3px 黑边的 Desktop app screen 图。

## 参考代码 (React + Tailwind)

```tsx
const imgBackground = "./imgBackground.png";
const imgDesktopAppScreen = "./imgDesktopAppScreen.png";

export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:51">
      <div className="absolute inset-[20px]" data-name="Background" data-node-id="2:52">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBackground} />
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute border-3 border-[var(--color-1,black)] border-solid h-[886px] left-1/2 rounded-[35px] top-1/2 w-[1400px]" data-name="Desktop app screen" data-node-id="2:53">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[35px] size-full" src={imgDesktopAppScreen} />
      </div>
    </div>
  );
}
```

**图片**: Figma MCP assets，约 7 天后失效。
