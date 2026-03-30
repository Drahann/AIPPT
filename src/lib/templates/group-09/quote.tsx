'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group09Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex items-center justify-center" style={{ background: '#1a4a5a', fontFamily: "'Bricolage Grotesque', sans-serif", padding: '0 120px' }}>
      <div className="flex flex-col items-center text-center gap-[32px]" style={{ maxWidth: 1300 }}>
        <p className="font-light leading-[1.3]" style={{ fontSize: fitText(56, props), color: 'white', letterSpacing: '-1.0px' }}>
          "{quote?.text}"
        </p>
        {quote?.attribution && (
          <p style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>— {quote.attribution}</p>
        )}
      </div>
      {/* Decorative curve at bottom */}
      <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.05))', borderRadius: '50% 50% 0 0' }} />
    </div>
  )
}
