'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group06Cover(props: FigmaSlideProps) {
  const { title } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: 'rgb(52,50,50)', fontFamily: "'Inter', sans-serif" }}>
      <div className="absolute" style={{ left: 132, top: 132 }}>
        <p className="font-medium leading-[1.1]" style={{
          fontSize: fitText(200, props), letterSpacing: '-12px', maxWidth: 1600,
          background: 'linear-gradient(90deg, #9bbcc3 1%, #abc4e2 55%, #cba5d1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {title}
        </p>
      </div>
      <div className="absolute flex items-center" style={{ bottom: 0, left: 0, right: 0, height: 64, borderTop: '2px solid rgba(230,230,230,0.3)', padding: '0 80px' }}>
        <span className="text-white/80 uppercase tracking-widest" style={{ fontSize: 16 }} />
      </div>
    </div>
  )
}
