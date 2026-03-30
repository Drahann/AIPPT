'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group09Ending(props: FigmaSlideProps) {
  const { title } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex items-center justify-center" style={{ background: '#1a4a5a', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      <p className="font-light uppercase text-center" style={{ fontSize: fitText(72, props), color: 'white', letterSpacing: '-2px' }}>
        {title || 'ONE MORE THING...'}
      </p>
      {/* Decorative orange arc */}
      <div className="absolute" style={{ right: 0, top: '20%', width: 240, height: 560, borderRadius: '240px 0 0 240px', background: 'rgba(247,127,0,0.3)' }} />
    </div>
  )
}
