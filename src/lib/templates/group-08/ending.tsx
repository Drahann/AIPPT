'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group08Ending(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px] overflow-hidden" style={{ fontFamily: "'Shippori Mincho', serif" }}>
      {/* Purple decorative block */}
      <div className="absolute left-[90px] top-[200px] w-[400px] h-[600px] rounded-[20px] opacity-[0.1] rotate-[3deg]" 
           style={{ background: '#8B6DB5' }} />

      {/* Main text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[80px] leading-none text-black mb-[30px]">
          {title || ''}
        </p>
        {subtitle && (
          <p className="text-[28px] italic text-black opacity-50" style={{ fontFamily: "'Playfair Display', serif" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Vertical side text */}
      <div className="absolute right-[60px] top-1/2 -translate-y-1/2 w-[50px] flex items-center justify-center">
        <div className="rotate-90">
          <p className="text-[20px] italic text-black opacity-30 w-[400px] text-center"
             style={{ fontFamily: "'Playfair Display', serif" }}>
            {subtitle || ''}
          </p>
        </div>
      </div>
    </div>
  )
}
