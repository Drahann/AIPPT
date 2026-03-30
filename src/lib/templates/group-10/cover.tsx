'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

/** Group 10 Cover — Pure black, Unbounded font, styled after slide 4:2929 */
export default function Group10Cover(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#000000', fontFamily: "'Unbounded', sans-serif" }}>
      {/* Abstract image decoration - gradient circle */}
      <div className="absolute right-[-200px] top-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.15]"
           style={{ background: 'radial-gradient(circle, #6c7aff 0%, #4a3fbf 40%, transparent 70%)' }} />

      {/* Year / subtitle in gray */}
      <p className="absolute left-[64px] top-[64px] text-[140px] font-semibold leading-none tracking-[-2.8px] text-[#5e6168] w-[1179px]">
        {subtitle || 'YEAR'}
      </p>

      {/* Main title in white */}
      <p className="absolute left-[64px] top-[260px] text-[140px] font-semibold leading-none tracking-[-2.8px] text-white w-[1179px]">
        {title}
      </p>

      {/* Footer tags */}
      <div className="absolute left-[64px] bottom-[60px] flex gap-[10px]" style={{ fontFamily: "'Geist', sans-serif" }}>
        <div className="bg-[#2a2a2a] px-[16px] py-[12px]">
          <p className="text-[24px] text-white">Presentation</p>
        </div>
        <div className="bg-[#b8bec5] px-[16px] py-[12px] rounded-full">
          <p className="text-[24px] text-black">Presentation</p>
        </div>
      </div>
    </div>
  )
}
