'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

/** Group 03 Cover — Figma 1920×1080, styled after slide 3:61 (blue brand, geometric) */
export default function Group03Cover(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#2569ed', fontFamily: "'Manrope', sans-serif" }}>
      {/* Geometric decoration right side - circles stacked at 10% opacity */}
      <div className="absolute right-[40px] top-1/2 -translate-y-1/2 flex flex-col opacity-10">
        <div className="w-[270px] h-[270px] rounded-[15px] border-[3px] border-[#fafbff]" />
        <div className="w-[270px] h-[270px] flex items-center justify-center">
          <div className="w-[178px] h-[178px] rounded-[15px] bg-[#fafbff]" />
        </div>
        <div className="w-[270px] h-[270px] rounded-full border-[3px] border-[#fafbff]" />
      </div>

      {/* Subtitle / version */}
      {subtitle && (
        <p className="absolute left-[168px] top-[334px] text-[36px] font-medium leading-[1.5] tracking-[-0.54px] text-[#fafbff]">
          {subtitle}
        </p>
      )}

      {/* Main title */}
      <p className="absolute left-[168px] top-[411px] w-[1200px] text-[96px] font-bold leading-[1.2] tracking-[-1.92px] text-[#fafbff]">
        {title}
      </p>

      {/* Bottom info line */}
      <div className="absolute left-[168px] bottom-[80px] flex gap-[40px] text-[24px] font-medium text-[#fafbff] opacity-60"
           style={{ fontFamily: "'Manrope', sans-serif" }}>
      </div>
    </div>
  )
}
