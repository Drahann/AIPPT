'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group10SectionHeader(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#000000', fontFamily: "'Unbounded', sans-serif" }}>
      <div className="absolute left-[64px] top-1/2 -translate-y-1/2">
        {subtitle && (
          <p className="text-[28px] text-[#5e6168] mb-[30px]" style={{ fontFamily: "'Geist', sans-serif" }}>{subtitle}</p>
        )}
        <p className="text-[96px] font-semibold leading-none tracking-[-2.88px] text-white w-[1400px]">{title}</p>
      </div>
    </div>
  )
}
