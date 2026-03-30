'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

/** Group 05 Cover — Black + cream card, Plus Jakarta Sans, styled after slide 4:40 */
export default function Group05Cover(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-black relative w-[1920px] h-[1080px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top info bar */}
      <div className="absolute top-[16px] left-[19px] right-[19px] flex justify-between text-[22px] font-semibold text-[#f5f1e9] tracking-[1.54px] uppercase">
        <span>{subtitle || ''}</span>
      </div>

      {/* Cream center card */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[55px] w-[1882px] h-[1011px] bg-[#f5f1e9] rounded-[15px] overflow-hidden">
        {/* Main title — ultra large */}
        <p className="absolute left-[137px] top-[160px] w-[1034px] text-[150px] font-semibold leading-[1.1] text-black">
          {title.split(/\s+/).slice(0, 2).join('\n') || title}
        </p>
        {/* Subtitle */}
        {subtitle && (
          <p className="absolute left-[135px] top-[520px] w-[1036px] text-[150px] font-light leading-[1.1] text-black opacity-40">
            {subtitle.split(/\s+/).slice(0, 3).join(' ')}
          </p>
        )}
      </div>
    </div>
  )
}
