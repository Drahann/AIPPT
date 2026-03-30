'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group07Ending(props: FigmaSlideProps) {
  const { title } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex items-center justify-center" style={{ background: 'black', fontFamily: "'Work Sans', sans-serif" }}>
      <p className="font-medium text-center" style={{ fontSize: fitText(64, props), color: '#dcdbce', letterSpacing: '-2px' }}>
        {title || ''}
      </p>
    </div>
  )
}
