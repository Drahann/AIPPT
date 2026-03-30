'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group10Ending(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#000000', fontFamily: "'Unbounded', sans-serif" }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[120px] font-semibold leading-none tracking-[-3.6px] text-white mb-[30px]">
          {title || ''}
        </p>
        {subtitle && (
          <p className="text-[28px] text-[#b8bec5]" style={{ fontFamily: "'Geist', sans-serif" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
