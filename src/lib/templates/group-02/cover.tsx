'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group02Cover(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="absolute flex flex-col gap-[24px] items-start" style={{ left: 128, top: '50%', transform: 'translateY(-50%)', width: 1200 }}>
        <p className="font-bold leading-[1.2] text-black" style={{ fontSize: fitText(96, props), letterSpacing: '-1.92px' }}>
          {title}
        </p>
        {subtitle && (
          <p className="font-normal leading-[1.4] text-black" style={{ fontSize: 36, letterSpacing: '-0.36px' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
