'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group10Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#000000', fontFamily: "'Unbounded', sans-serif" }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[200px]">
        <p className="text-[80px] text-[#6c7aff] opacity-30 leading-none mb-[20px]">&ldquo;</p>
        <p className="text-[48px] font-semibold leading-[1.2] tracking-[-1.44px] text-white mb-[40px] max-w-[1200px]">
          {quote?.text || ''}
        </p>
        {quote?.attribution && (
          <p className="text-[24px] text-[#b8bec5]" style={{ fontFamily: "'Geist', sans-serif" }}>— {quote.attribution}</p>
        )}
      </div>
    </div>
  )
}
