'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group04SectionHeader(props: FigmaSlideProps) {
  const { title } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex" style={{ fontFamily: "'Crimson Pro', serif" }}>
      <div className="flex items-center justify-center flex-1" style={{ background: '#1c0033' }}>
        <p className="font-light leading-[1.1] text-center" style={{ fontSize: fitText(96, props), color: '#ffbde8', maxWidth: 800, letterSpacing: '-2px' }}>
          {title}
        </p>
      </div>
      <div className="flex-1" style={{ background: '#e7e3d9' }} />
    </div>
  )
}
