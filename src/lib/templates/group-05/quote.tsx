'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group05Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="bg-black relative w-[1920px] h-[1080px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute left-1/2 -translate-x-1/2 top-[35px] w-[1882px] h-[1011px] bg-[#f5f1e9] rounded-[15px] overflow-hidden flex flex-col items-center justify-center text-center px-[200px]">
        <p className="text-[80px] leading-none text-black opacity-15 mb-[30px]">&ldquo;</p>
        <p className="text-[48px] font-semibold leading-[1.2] tracking-[-1.44px] text-black mb-[40px] max-w-[1200px]">
          {quote?.text || ''}
        </p>
        {quote?.attribution && (
          <p className="text-[24px] font-light text-black opacity-50">— {quote.attribution}</p>
        )}
      </div>
    </div>
  )
}
