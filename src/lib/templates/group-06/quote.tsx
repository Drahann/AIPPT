'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group06Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex items-center justify-center" style={{ background: 'white', fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col items-center text-center gap-[24px]" style={{ maxWidth: 1200, padding: '0 80px' }}>
        <p className="font-normal leading-[1.4] text-black/80" style={{ fontSize: fitText(40, props), letterSpacing: '-0.8px' }}>
          "{quote?.text}"
        </p>
        {quote?.attribution && (
          <p className="text-black/40 mt-[16px]" style={{ fontSize: 24 }}>— {quote.attribution}</p>
        )}
      </div>
    </div>
  )
}
