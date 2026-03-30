'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

/** Group 08 Cover — Pastel Papercut, Shippori Mincho, styled after slide 4:2072 */
export default function Group08Cover(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px] overflow-hidden" style={{ fontFamily: "'Shippori Mincho', serif" }}>
      {/* Pastel decorative background block - rotated */}
      <div className="absolute left-[-38px] top-[-49px] w-[1995px] h-[1409px] flex items-center justify-center">
        <div className="rotate-90">
          <div className="w-[1409px] h-[1995px] rounded-[40px] opacity-[0.08]" 
               style={{ background: 'linear-gradient(135deg, #a0c4ff 0%, #c4b5fd 50%, #fbc4ab 100%)' }} />
        </div>
      </div>

      {/* Second decorative layer */}
      <div className="absolute left-[395px] top-[129px] w-[1690px] h-[1232px] flex items-center justify-center">
        <div className="-scale-y-100">
          <div className="w-[1690px] h-[1232px] rounded-[40px] opacity-[0.04]"
               style={{ background: 'linear-gradient(45deg, #c4b5fd 0%, #a0c4ff 100%)' }} />
        </div>
      </div>

      {/* Main Title */}
      <p className="absolute left-[90px] top-[90px] w-[1435px] text-[90px] leading-none text-black">
        {title}
      </p>

      {/* Vertical side description */}
      {subtitle && (
        <div className="absolute right-[125px] top-1/2 -translate-y-1/2 w-[70px] flex items-center justify-center">
          <div className="rotate-90">
            <p className="text-[28px] italic leading-[1.25] text-center text-black w-[597px]"
               style={{ fontFamily: "'Playfair Display', serif" }}>
              {subtitle}
            </p>
          </div>
        </div>
      )}

      {/* Bottom date and page */}
      <div className="absolute left-[90px] bottom-[60px] flex justify-end w-[calc(100%-180px)]">
        <p className="text-[20px] text-black" style={{ fontFamily: "'Playfair Display', serif" }}>1</p>
      </div>
    </div>
  )
}
