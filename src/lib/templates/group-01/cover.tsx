'use client'

import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

/** Group 01 Cover — Figma 1920×1080 absolute-positioned, styled after slide 2:25 */
export default function Group01Cover(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="bg-white relative w-[1920px] h-[1080px]" style={{ fontFamily: "'Radio Canada Big', sans-serif" }}>
      {/* Gradient accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-[6px]" style={{ background: 'linear-gradient(90deg, #2683eb 0%, #1a5cc8 100%)' }} />
      
      {/* Background subtle gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #f6f8fb 0%, #ffffff 40%, #f6f8fb 100%)' }} />

      {/* Decorative ellipses */}
      <div className="absolute right-[80px] top-[60px] w-[420px] h-[210px] rounded-full opacity-[0.08]" style={{ background: '#2683eb' }} />
      <div className="absolute right-[160px] top-[120px] w-[280px] h-[140px] rounded-full opacity-[0.05]" style={{ background: '#1a5cc8' }} />

      {/* Subtitle */}
      {subtitle && (
        <p className="absolute left-[120px] top-[340px] w-[800px] text-[32px] leading-[1.2] tracking-[-1.28px] text-[#6c6c6c]"
           style={{ fontFamily: "'Source Serif Pro', serif" }}>
          {subtitle}
        </p>
      )}

      {/* Main Title */}
      <p className="absolute left-[120px] top-[400px] w-[1400px] text-[80px] font-bold leading-[1.1] tracking-[-2.4px] text-black">
        {title}
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-[80px] left-[120px] w-[200px] h-[4px] rounded-full" style={{ background: '#2683eb' }} />
    </div>
  )
}
