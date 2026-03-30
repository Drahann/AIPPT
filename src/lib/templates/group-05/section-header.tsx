'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group05SectionHeader(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-black relative w-[1920px] h-[1080px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute left-1/2 -translate-x-1/2 top-[35px] w-[1882px] h-[1011px] bg-[#f5f1e9] rounded-[15px] overflow-hidden flex items-center">
        <div className="pl-[137px]">
          {subtitle && (
            <p className="text-[28px] font-semibold text-black opacity-40 tracking-[1.5px] uppercase mb-[20px]">{subtitle}</p>
          )}
          <p className="text-[96px] font-semibold leading-[1.05] tracking-[-2.88px] text-black w-[1000px]">{title}</p>
        </div>
      </div>
    </div>
  )
}
