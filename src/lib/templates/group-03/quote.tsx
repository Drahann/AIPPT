'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group03Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[200px]">
        <p className="text-[100px] leading-none text-[#2569ed] opacity-30 mb-[20px]">&ldquo;</p>
        <p className="text-[48px] font-bold leading-[1.25] tracking-[-1.44px] text-[#1a1a1a] mb-[40px] max-w-[1200px]">
          {quote?.text || ''}
        </p>
        {quote?.attribution && (
          <p className="text-[24px] font-medium text-[#555555]">— {quote.attribution}</p>
        )}
      </div>
      {/* Footer bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-[#2569ed]" />
    </div>
  )
}
