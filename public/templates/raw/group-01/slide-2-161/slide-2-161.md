# Slide 2:161 · Table（Meet the team：表头 + 8 行 Row）

**Frame ID**: `2:161`  
**布局**: 白底；顶部居中 Headline「Meet the team」48px；Labels 行 Geist Mono 20px #6c6c6c（Name, Title, Department, Email）；多行 Row，每行 border-bottom #dbe0ec，py-24，gap-24，四列：姓名 Radio Canada Big Medium 30px、Job Title / Department / Email 为 Source Serif Pro 30px，Email 右对齐+下划线。

**样式**: Label 1 (Geist Mono 20px), Subheadline 5 (30px), Body (30px), Subheadline 2 (48px)。颜色 --color-7: #dbe0ec。

无图片。

## 参考代码 (React + Tailwind)

```tsx
export default function Frame() {
  return (
    <div className="bg-[var(--color-2,white)] relative size-full" data-name="Frame" data-node-id="2:161">
      <div className="absolute content-stretch flex font-['Geist_Mono:Regular',sans-serif] font-normal gap-[24px] items-center leading-none left-[60px] text-[20px] text-[color:var(--color-6,#6c6c6c)] top-[304px] w-[1800px]" data-name="Labels" data-node-id="2:162">
        <p className="flex-[1_0_0] min-h-px min-w-px relative" data-node-id="2:163">Name</p>
        <p className="flex-[1_0_0] min-h-px min-w-px relative" data-node-id="2:164">Title</p>
        <p className="flex-[1_0_0] min-h-px min-w-px relative" data-node-id="2:165">Department</p>
        <p className="flex-[1_0_0] min-h-px min-w-px relative text-right" data-node-id="2:166">Email</p>
      </div>
      <ul className="absolute border-[var(--color-7,#dbe0ec)] border-b border-solid border-t content-stretch flex gap-[24px] items-center leading-[0] left-[60px] py-[24px] text-[color:var(--color-1,black)] top-[348px] w-[1800px]" data-name="Row" data-node-id="2:167">
        <li className="block flex-[1_0_0] font-['Radio_Canada_Big:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[30px] tracking-[-0.6px]" data-node-id="2:168"><p className="leading-none">Firstname Lastname</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:169"><p className="leading-[1.2]">Job Title</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:170"><p className="leading-[1.2]">Department</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[0px] text-right tracking-[-1.2px]" data-node-id="2:171"><p className="[text-decoration-skip-ink:none] decoration-solid leading-[1.2] text-[30px] underline">email@domain.com</p></li>
      </ul>
      <ul className="absolute border-[var(--color-7,#dbe0ec)] border-b border-solid content-stretch flex gap-[24px] items-center leading-[0] left-[60px] py-[24px] text-[color:var(--color-1,black)] top-[432px] w-[1800px]" data-name="Row" data-node-id="2:172">
        <li className="block flex-[1_0_0] font-['Radio_Canada_Big:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[30px] tracking-[-0.6px]" data-node-id="2:173"><p className="leading-none">Firstname Lastname</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:174"><p className="leading-[1.2]">Job Title</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:175"><p className="leading-[1.2]">Department</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[0px] text-right tracking-[-1.2px]" data-node-id="2:176"><p className="[text-decoration-skip-ink:none] decoration-solid leading-[1.2] text-[30px] underline">email@domain.com</p></li>
      </ul>
      <ul className="absolute border-[var(--color-7,#dbe0ec)] border-b border-solid content-stretch flex gap-[24px] items-center leading-[0] left-[60px] py-[24px] text-[color:var(--color-1,black)] top-[516px] w-[1800px]" data-name="Row" data-node-id="2:177">
        <li className="block flex-[1_0_0] font-['Radio_Canada_Big:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[30px] tracking-[-0.6px]" data-node-id="2:178"><p className="leading-none">Firstname Lastname</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:179"><p className="leading-[1.2]">Job Title</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:180"><p className="leading-[1.2]">Department</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[0px] text-right tracking-[-1.2px]" data-node-id="2:181"><p className="[text-decoration-skip-ink:none] decoration-solid leading-[1.2] text-[30px] underline">email@domain.com</p></li>
      </ul>
      <ul className="absolute border-[var(--color-7,#dbe0ec)] border-b border-solid content-stretch flex gap-[24px] items-center leading-[0] left-[60px] py-[24px] text-[color:var(--color-1,black)] top-[600px] w-[1800px]" data-name="Row" data-node-id="2:182">
        <li className="block flex-[1_0_0] font-['Radio_Canada_Big:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[30px] tracking-[-0.6px]" data-node-id="2:183"><p className="leading-none">Firstname Lastname</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:184"><p className="leading-[1.2]">Job Title</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:185"><p className="leading-[1.2]">Department</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[0px] text-right tracking-[-1.2px]" data-node-id="2:186"><p className="[text-decoration-skip-ink:none] decoration-solid leading-[1.2] text-[30px] underline">email@domain.com</p></li>
      </ul>
      <ul className="absolute border-[var(--color-7,#dbe0ec)] border-b border-solid content-stretch flex gap-[24px] items-center leading-[0] left-[60px] py-[24px] text-[color:var(--color-1,black)] top-[684px] w-[1800px]" data-name="Row" data-node-id="2:187">
        <li className="block flex-[1_0_0] font-['Radio_Canada_Big:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[30px] tracking-[-0.6px]" data-node-id="2:188"><p className="leading-none">Firstname Lastname</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:189"><p className="leading-[1.2]">Job Title</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:190"><p className="leading-[1.2]">Department</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[0px] text-right tracking-[-1.2px]" data-node-id="2:191"><p className="[text-decoration-skip-ink:none] decoration-solid leading-[1.2] text-[30px] underline">email@domain.com</p></li>
      </ul>
      <ul className="absolute border-[var(--color-7,#dbe0ec)] border-b border-solid content-stretch flex gap-[24px] items-center leading-[0] left-[60px] py-[24px] text-[color:var(--color-1,black)] top-[768px] w-[1800px]" data-name="Row" data-node-id="2:192">
        <li className="block flex-[1_0_0] font-['Radio_Canada_Big:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[30px] tracking-[-0.6px]" data-node-id="2:193"><p className="leading-none">Firstname Lastname</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:194"><p className="leading-[1.2]">Job Title</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:195"><p className="leading-[1.2]">Department</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[0px] text-right tracking-[-1.2px]" data-node-id="2:196"><p className="[text-decoration-skip-ink:none] decoration-solid leading-[1.2] text-[30px] underline">email@domain.com</p></li>
      </ul>
      <ul className="absolute border-[var(--color-7,#dbe0ec)] border-b border-solid content-stretch flex gap-[24px] items-center leading-[0] left-[60px] py-[24px] text-[color:var(--color-1,black)] top-[852px] w-[1800px]" data-name="Row" data-node-id="2:197">
        <li className="block flex-[1_0_0] font-['Radio_Canada_Big:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[30px] tracking-[-0.6px]" data-node-id="2:198"><p className="leading-none">Firstname Lastname</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:199"><p className="leading-[1.2]">Job Title</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:200"><p className="leading-[1.2]">Department</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[0px] text-right tracking-[-1.2px]" data-node-id="2:201"><p className="[text-decoration-skip-ink:none] decoration-solid leading-[1.2] text-[30px] underline">email@domain.com</p></li>
      </ul>
      <ul className="absolute border-[var(--color-7,#dbe0ec)] border-b border-solid content-stretch flex gap-[24px] items-center leading-[0] left-[60px] py-[24px] text-[color:var(--color-1,black)] top-[936px] w-[1800px]" data-name="Row" data-node-id="2:202">
        <li className="block flex-[1_0_0] font-['Radio_Canada_Big:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[30px] tracking-[-0.6px]" data-node-id="2:203"><p className="leading-none">Firstname Lastname</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:204"><p className="leading-[1.2]">Job Title</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[30px] tracking-[-1.2px]" data-node-id="2:205"><p className="leading-[1.2]">Department</p></li>
        <li className="block flex-[1_0_0] font-['Source_Serif_Pro:Regular',sans-serif] min-h-px min-w-px not-italic relative text-[0px] text-right tracking-[-1.2px]" data-node-id="2:206"><p className="[text-decoration-skip-ink:none] decoration-solid leading-[1.2] text-[30px] underline">email@domain.com</p></li>
      </ul>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Radio_Canada_Big:Medium',sans-serif] font-medium justify-center leading-[0] left-[60px] right-[60px] text-[48px] text-[color:var(--color-1,black)] text-center top-[146.5px] tracking-[-1.44px]" data-node-id="2:207">
        <p className="leading-[1.1]">Meet the team</p>
      </div>
    </div>
  );
}
```

*Figma MCP 资源链接约 7 天有效。*
