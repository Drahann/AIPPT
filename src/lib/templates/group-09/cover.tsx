'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group09Cover(props: FigmaSlideProps) {
  const { title } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#f3f3f3', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      <p className="absolute uppercase leading-none" style={{ left: 64, top: '14.29%', fontSize: fitText(180, props), fontWeight: 200, color: 'black', letterSpacing: '-5.4px', width: 1180 }}>
        {title}
      </p>
      <p className="absolute uppercase" style={{ left: 64, top: 64, fontSize: 28, fontWeight: 600, fontFamily: "'Inter', sans-serif", color: 'black' }}>
        Caption
      </p>
      {/* Decorative curve */}
      <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, transparent 0%, rgba(247,127,0,0.15) 100%)', borderRadius: '50% 50% 0 0' }} />
    </div>
  )
}
