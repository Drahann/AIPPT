'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group04Cover(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#1c0033', fontFamily: "'Crimson Pro', serif" }}>
      <div className="absolute flex flex-col items-center justify-center text-center" style={{ inset: 0 }}>
        <p className="font-extralight leading-none" style={{ fontSize: fitText(200, props), color: '#ffbde8', letterSpacing: '-6px', maxWidth: 1720 }}>
          {title}
        </p>
      </div>
      {subtitle && (
        <div className="absolute flex flex-col items-center text-center" style={{ bottom: 120, left: 0, right: 0, fontFamily: "'Rethink Sans', sans-serif" }}>
          <p style={{ fontSize: 36, color: '#ffbde8', letterSpacing: '-1.08px' }}>{subtitle}</p>
        </div>
      )}
      <p className="absolute uppercase" style={{ left: 100, top: 46, fontSize: 20, color: '#e7e3d9', fontFamily: "'Rethink Sans', sans-serif", fontWeight: 600, letterSpacing: '0.4px' }}>
        PROJECT NAME
      </p>
    </div>
  )
}
