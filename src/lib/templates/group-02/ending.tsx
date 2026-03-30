'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group02Ending(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-black relative w-[1920px] h-[1080px] flex flex-col items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
      <p className="font-bold leading-[1.2] text-white text-center" style={{ fontSize: fitText(80, props), letterSpacing: '-1.6px' }}>
        {title || '谢谢聆听'}
      </p>
      {subtitle && (
        <p className="font-normal text-white/70 mt-[24px] text-center" style={{ fontSize: 32 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
