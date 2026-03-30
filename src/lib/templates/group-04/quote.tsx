'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group04Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex flex-col justify-end" style={{ background: '#1c0033', fontFamily: "'Crimson Pro', serif", padding: '0 120px 160px' }}>
      <p className="font-extralight leading-[1.2]" style={{ fontSize: fitText(80, props), color: '#ffbde8', maxWidth: 1400, letterSpacing: '-2px' }}>
        "{quote?.text}"
      </p>
      {quote?.attribution && (
        <p className="mt-[32px]" style={{ fontSize: 28, color: '#e7e3d9', opacity: 0.7, fontFamily: "'Rethink Sans', sans-serif" }}>
          — {quote.attribution}
        </p>
      )}
    </div>
  )
}
