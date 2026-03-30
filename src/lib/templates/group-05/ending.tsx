'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group05Ending(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-black relative w-[1920px] h-[1080px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute left-1/2 -translate-x-1/2 top-[35px] w-[1882px] h-[1011px] bg-[#f5f1e9] rounded-[15px] overflow-hidden flex flex-col items-center justify-center text-center">
        <p className="text-[120px] font-semibold leading-[1.05] tracking-[-3.6px] text-black mb-[24px]">
          {title || ''}
        </p>
        {subtitle && (
          <p className="text-[36px] font-light text-black opacity-50">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
