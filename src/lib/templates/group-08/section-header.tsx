'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group08SectionHeader(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px] overflow-hidden" style={{ fontFamily: "'Shippori Mincho', serif" }}>
      {/* Left purple decorative strip */}
      <div className="absolute left-[60px] top-[150px] w-[30px] h-[780px] rounded-[15px] opacity-[0.3]" style={{ background: '#8B6DB5' }} />

      {subtitle && (
        <p className="absolute left-[140px] top-[360px] text-[28px] italic text-[#555555]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {subtitle}
        </p>
      )}
      <p className="absolute left-[140px] top-[420px] w-[1200px] text-[72px] leading-none text-black">
        {title}
      </p>

      {/* Vertical side text */}
      <div className="absolute right-[80px] top-1/2 -translate-y-1/2 w-[50px] flex items-center justify-center">
        <div className="rotate-90">
          <p className="text-[20px] italic text-black opacity-20 w-[500px] text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Section overview
          </p>
        </div>
      </div>
    </div>
  )
}
