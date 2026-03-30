'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group03Ending(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#2569ed', fontFamily: "'Manrope', sans-serif" }}>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[80px] font-bold leading-[1.1] tracking-[-2.4px] text-[#fafbff] mb-[24px]">
          {title || 'Thank You'}
        </p>
        {subtitle && (
          <p className="text-[28px] font-medium text-[#fafbff] opacity-70">
            {subtitle}
          </p>
        )}
      </div>
      {/* Footer bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-[#1a4fc8]">
      </div>
    </div>
  )
}
