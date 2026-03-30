# Slide 2:223 · Poll（渐变背景 + 居中 Headline）

**Frame ID**: `2:223`  
**布局**: 渐变 from #a8d3ff to #fff4df；居中 Headline 48px「Headline」。设计稿中下方为 Poll 互动组件，MCP 未导出组件内部。

**样式**: Subheadline 2 (Radio Canada Big Medium 48px)。

## 参考代码 (React + Tailwind)

```tsx
export default function Frame() {
  return (
    <div className="bg-gradient-to-b from-[var(--color-10,#a8d3ff)] relative size-full to-[var(--color-11,#fff4df)]" data-name="Frame" data-node-id="2:223">
      <p className="-translate-x-1/2 absolute font-['Radio_Canada_Big:Medium',sans-serif] font-medium leading-[1.1] left-[960px] text-[48px] text-[color:var(--color-1,black)] text-center top-[292.5px] tracking-[-1.44px] w-[1200px]" data-node-id="2:224">Headline</p>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
