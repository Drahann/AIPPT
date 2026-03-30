'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

/** Group 01 Quote — adapted from Figma slide 2:124 */
export default function Group01Quote(props: FigmaSlideProps) {
  const { quote } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px]" style={{ fontFamily: "'Radio Canada Big', sans-serif" }}>
      {/* Left accent block */}
      <div className="absolute left-[120px] top-[240px] bottom-[240px] w-[4px] rounded-full" style={{ background: '#2683eb' }} />

      {/* Quote mark */}
      <p className="absolute left-[180px] top-[260px] text-[120px] leading-none opacity-20 text-[#2683eb]"
         style={{ fontFamily: "Georgia, serif" }}>
        &ldquo;
      </p>

      {/* Quote text */}
      <p className="absolute left-[180px] top-[380px] w-[1200px] text-[56px] font-medium leading-[1.15] tracking-[-1.68px] text-black">
        {quote?.text || ''}
      </p>

      {/* Attribution */}
      {quote?.attribution && (
        <p className="absolute left-[180px] top-[700px] text-[28px] text-[#6c6c6c]"
           style={{ fontFamily: "'Source Serif Pro', serif" }}>
          — {quote.attribution}
        </p>
      )}

      {/* Decorative sticker ellipses top-right */}
      <div className="absolute right-[60px] top-[-30px]">
        <div className="w-[426px] h-[210px] rounded-full opacity-[0.08] rotate-[7deg]" style={{ background: '#2683eb' }} />
      </div>
    </div>
  )
}
