'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group09SectionHeader(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex flex-col justify-center" style={{ background: '#f3f3f3', fontFamily: "'Bricolage Grotesque', sans-serif", padding: '0 100px' }}>
      <p className="font-light leading-[1.1]" style={{ fontSize: fitText(80, props), color: 'black', letterSpacing: '-2px' }}>
        {title}
      </p>
      {subtitle && (
        <p className="mt-[24px] font-normal" style={{ fontSize: 28, color: '#666', fontFamily: "'Inter', sans-serif" }}>{subtitle}</p>
      )}
      <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: 8, background: 'linear-gradient(90deg, #9bbcc3, #1a4a5a)' }} />
    </div>
  )
}
