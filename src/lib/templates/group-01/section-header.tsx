'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

/** Group 01 Section Header — adapted from Figma slide style */
export default function Group01SectionHeader(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-[#f6f8fb] relative w-[1920px] h-[1080px]" style={{ fontFamily: "'Radio Canada Big', sans-serif" }}>
      {/* Left accent bar */}
      <div className="absolute left-0 top-[200px] bottom-[200px] w-[8px]" style={{ background: '#2683eb' }} />

      {/* Subtitle */}
      {subtitle && (
        <p className="absolute left-[120px] top-[360px] w-[600px] text-[32px] leading-[1.2] tracking-[-1.28px] text-[#6c6c6c]"
           style={{ fontFamily: "'Source Serif Pro', serif" }}>
          {subtitle}
        </p>
      )}

      {/* Title */}
      <p className="absolute left-[120px] top-[420px] w-[1200px] text-[64px] font-medium leading-[1.1] tracking-[-1.92px] text-black">
        {title}
      </p>

      {/* Decorative ellipse top-right */}
      <div className="absolute right-[100px] top-[80px] w-[200px] h-[100px] rounded-full opacity-[0.06]" style={{ background: '#2683eb' }} />
    </div>
  )
}
