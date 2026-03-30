'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group06SectionHeader(props: FigmaSlideProps) {
  const { title } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex items-center justify-center" style={{ background: 'rgb(52,50,50)', fontFamily: "'Inter', sans-serif" }}>
      <p className="font-medium text-center leading-[1.1]" style={{
        fontSize: fitText(96, props), letterSpacing: '-4px', maxWidth: 1600, padding: '0 100px',
        background: 'linear-gradient(90deg, #9bbcc3 0%, #abc4e2 50%, #cba5d1 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        {title}
      </p>
    </div>
  )
}
