# Slide 2:220 · Facepile（背景 #f6f8fb + 居中 Headline）

**Frame ID**: `2:220`  
**布局**: 背景 --color-9 #f6f8fb；仅居中 Headline 48px「Headline」。设计稿中下方为 Facepile 互动组件，MCP 未导出组件内部。

**样式**: Subheadline 2 (Radio Canada Big Medium 48px)。

## 参考代码 (React + Tailwind)

```tsx
export default function Frame() {
  return (
    <div className="bg-[var(--color-9,#f6f8fb)] relative size-full" data-name="Frame" data-node-id="2:220">
      <p className="-translate-x-1/2 absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium h-[53px] leading-[1.1] left-[960px] text-[48px] text-[color:var(--color-1,black)] text-center top-[358.5px] tracking-[-1.44px] w-[1200px]" data-node-id="2:221">Headline</p>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
