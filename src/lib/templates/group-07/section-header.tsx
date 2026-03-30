'use client'
import { FigmaSlideProps } from '../index'
import { fitText } from '@/lib/utils/text-fit'

export default function Group07SectionHeader(props: FigmaSlideProps) {
  const { title, subtitle } = props;
  return (
    <div className="relative w-[1920px] h-[1080px] flex" style={{ background: '#f5f0e6', fontFamily: "'Work Sans', sans-serif" }}>
      <div className="flex flex-col justify-center" style={{ padding: '0 80px', flex: 1 }}>
        <p className="font-semibold leading-[1.1]" style={{ fontSize: fitText(56, props), color: '#1a1a1a' }}>
          {title}
        </p>
        {subtitle && (
          <p className="mt-[16px] font-normal" style={{ fontSize: 28, color: '#666' }}>{subtitle}</p>
        )}
      </div>
      <div className="flex items-end justify-end" style={{ width: 400, padding: 60 }}>
        <p className="font-bold" style={{ fontSize: fitText(160, props), color: 'rgba(0,0,0,0.06)' }}>01</p>
      </div>
    </div>
  )
}
