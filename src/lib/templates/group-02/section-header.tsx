'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group02SectionHeader(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px] flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
      <p className="font-bold leading-[1.2] text-black" style={{ fontSize: fitText(64, props), letterSpacing: '-1.28px', paddingLeft: 128 }}>
        {title}
      </p>
    </div>
  )
}
