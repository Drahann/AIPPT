'use client'

import { FigmaSlideProps } from '../index'

export default function Group01Ending(props: FigmaSlideProps) {
  const { title, subtitle } = props
  return (
    <div className="relative w-[1920px] h-[1080px]" style={{ background: '#f4c542', fontFamily: "'Radio Canada Big', sans-serif" }}>
      <p className="absolute left-[120px] top-[80px] text-[20px] text-black opacity-60"
         style={{ fontFamily: "'Source Serif Pro', serif" }}>
        {subtitle || ''}
      </p>

      <p className="absolute left-[120px] top-[380px] w-[1000px] text-[96px] font-bold leading-[1.05] tracking-[-2.88px] text-black">
        {title || ''}
      </p>

      <div className="absolute right-[200px] bottom-[200px] w-[300px] h-[150px] rounded-full opacity-[0.15]" style={{ background: '#2683eb' }} />
      <div className="absolute bottom-0 left-0 right-0 h-[6px]" style={{ background: 'linear-gradient(90deg, #2683eb 0%, #1a5cc8 100%)' }} />
    </div>
  )
}
