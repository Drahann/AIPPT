'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group08Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px] overflow-hidden" style={{ fontFamily: "'Shippori Mincho', serif" }}>
      {/* Yellow decorative block */}
      <div className="absolute right-[100px] top-[100px] w-[300px] h-[200px] rounded-[20px] opacity-[0.15] rotate-[-5deg]" style={{ background: '#e8c840' }} />

      {/* Quote content */}
      <div className="absolute left-[200px] top-1/2 -translate-y-1/2 w-[1200px]">
        <p className="text-[48px] leading-[1.3] text-black mb-[40px]">
          {quote?.text || ''}
        </p>
        {quote?.attribution && (
          <div>
            <p className="text-[28px] font-normal text-black">{quote.attribution.split(',')[0]}</p>
            {quote.attribution.includes(',') && (
              <p className="text-[22px] italic text-[#555555]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {quote.attribution.split(',').slice(1).join(',')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Vertical side text */}
      <div className="absolute right-[60px] top-1/2 -translate-y-1/2 w-[50px] flex items-center justify-center">
        <div className="rotate-90">
          <p className="text-[20px] italic text-black opacity-20 w-[400px] text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Words of inspiration
          </p>
        </div>
      </div>
    </div>
  )
}
