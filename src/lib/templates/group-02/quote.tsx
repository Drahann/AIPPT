'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group02Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px] flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col items-center gap-[32px] px-[128px] max-w-[1400px] text-center">
        <p className="font-normal leading-[1.4] text-black italic" style={{ fontSize: fitText(44, props), letterSpacing: '-0.88px' }}>
          "{quote?.text}"
        </p>
        {quote?.attribution && (
          <p className="text-[#666] font-normal" style={{ fontSize: 28 }}>
            — {quote.attribution}
          </p>
        )}
      </div>
    </div>
  )
}
