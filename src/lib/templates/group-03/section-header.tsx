'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group03SectionHeader(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#2569ed', fontFamily: "'Manrope', sans-serif" }}>
      <div className="absolute left-[168px] top-1/2 -translate-y-1/2">
        {subtitle && (
          <p className="text-[28px] font-medium text-[#fafbff] opacity-60 mb-[16px]">{subtitle}</p>
        )}
        <p className="text-[72px] font-bold leading-[1.15] tracking-[-2.16px] text-[#fafbff] w-[1200px]">{title}</p>
      </div>
      {/* Geometric accent */}
      <div className="absolute right-[120px] top-[120px] w-[80px] h-[80px] rounded-full border-[3px] border-[#fafbff] opacity-20" />
      {/* Footer bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-[#1a4fc8]" />
    </div>
  )
}
