'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group06Ending(props: FigmaSlideProps) {
  const { title } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex items-center justify-center" style={{ background: 'white', fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col items-center text-center gap-[24px]">
        <div className="rounded-[16px]" style={{ width: 160, height: 80, background: 'linear-gradient(90deg, #9bbcc3, #cba5d1)' }} />
        <p className="font-medium text-black mt-[16px]" style={{ fontSize: fitText(40, props) }}>{title || ''}</p>
      </div>
    </div>
  )
}
