'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group07Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex items-center justify-center" style={{ background: '#f5f0e6', fontFamily: "'Work Sans', sans-serif", padding: '0 120px' }}>
      <div className="flex flex-col items-center text-center gap-[32px]" style={{ maxWidth: 1200 }}>
        <p className="font-normal leading-[1.4]" style={{ fontSize: fitText(44, props), color: '#1a1a1a', letterSpacing: '-1.0px' }}>
          "{quote?.text}"
        </p>
        {quote?.attribution && (
          <p style={{ fontSize: 26, color: '#888', fontFamily: "'Cutive Mono', monospace" }}>— {quote.attribution}</p>
        )}
      </div>
    </div>
  )
}
