'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group04Ending(props: FigmaSlideProps) {
  const { title } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex items-center justify-center" style={{ background: '#1c0033', fontFamily: "'Rethink Sans', sans-serif" }}>
      <p className="uppercase text-center" style={{ fontSize: fitText(120, props), color: '#e7e3d9', fontWeight: 600, letterSpacing: '2px' }}>
        {title || 'PROJECT NAME'}
      </p>
      <p className="absolute" style={{ bottom: 80, fontSize: 32, color: '#e7e3d9', opacity: 0.5 }}>
        END
      </p>
    </div>
  )
}
