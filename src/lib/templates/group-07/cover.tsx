'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group07Cover(props: FigmaSlideProps) {
  const { title } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: 'black', fontFamily: "'Work Sans', sans-serif" }}>
      <div className="absolute" style={{ left: 40, bottom: 112, width: 1060 }}>
        <p className="font-medium leading-[0.85] uppercase" style={{ fontSize: fitText(160, props), color: '#dcdbce', letterSpacing: '-6.4px' }}>
          {title}
        </p>
      </div>
      {/* Geometric shape decoration */}
      <div className="absolute" style={{ right: 120, top: 58, width: 780, height: 780, borderRadius: '50%', border: '4px solid rgba(220,219,206,0.2)' }} />
      <p className="absolute uppercase" style={{ left: 40, top: 30, fontSize: 22, color: '#dcdbce', fontFamily: "'Cutive Mono', monospace", letterSpacing: '2.2px' }} />
      <p className="absolute uppercase text-right" style={{ right: 40, bottom: 30, fontSize: 22, color: '#dcdbce', fontFamily: "'Cutive Mono', monospace", letterSpacing: '2.2px' }} />
    </div>
  )
}
