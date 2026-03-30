'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { LayoutType, SlideContent } from '@/lib/types'

const layoutOptions: { value: LayoutType; label: string; icon: string }[] = [
  { value: 'text-bullets', label: '要点列表', icon: '☰' },
  { value: 'image-text', label: '左图右文', icon: '🖼' },
  { value: 'text-image', label: '左文右图', icon: '📄' },
  { value: 'cards-3', label: '三列卡片', icon: '▦' },
  { value: 'cards-split', label: '左总概右图文', icon: '◧' },
  { value: 'list-featured', label: '重点列表', icon: '⋮' },
  { value: 'comparison', label: '左右对比', icon: '⚖' },
  { value: 'metrics', label: '指标数据', icon: '📊' },
  { value: 'metrics-rings', label: '环形指标', icon: '◎' },
  { value: 'timeline', label: '时间线', icon: '⏱' },
  { value: 'milestone-list', label: '里程碑列表', icon: '▤' },
  { value: 'chart-bar', label: '柱状图', icon: '▮' },
  { value: 'quote', label: '引用', icon: '❝' },
  { value: 'quote-no-avatar', label: '引用（无头像）', icon: '❞' },
  { value: 'image-center', label: '居中大图', icon: '🖼' },
  { value: 'section-header', label: '章节页', icon: '§' },
]

function createEmptySlide(layout: LayoutType): SlideContent {
  const base: SlideContent = { layout, title: '新页面标题' }

  switch (layout) {
    case 'text-bullets':
      return { ...base, body: [{ type: 'bullet', items: ['要点一', '要点二', '要点三'] }] }
    case 'image-text':
    case 'text-image':
      return { ...base, body: [{ type: 'bullet', items: ['说明一', '说明二'] }], image: { prompt: '', alt: '示意图' } }
    case 'cards-3':
      return {
        ...base,
        cards: [
          { heading: '模块一', body: '模块一说明' },
          { heading: '模块二', body: '模块二说明' },
          { heading: '模块三', body: '模块三说明' },
        ],
      }
    case 'cards-split':
      return {
        ...base,
        title: '能力概览',
        subtitle: '核心能力一览',
        cards: [
          { heading: '能力一', body: '能力一说明' },
          { heading: '能力二', body: '能力二说明' },
          { heading: '能力三', body: '能力三说明' },
        ],
      }
    case 'list-featured':
      return {
        ...base,
        title: '重点列表',
        subtitle: '核心要点',
        cards: [
          { heading: '要点一', body: '要点一说明', icon: 'target' },
          { heading: '要点二', body: '要点二说明', icon: 'star' },
          { heading: '要点三', body: '要点三说明', icon: 'zap' },
        ],
      }
    case 'comparison':
      return {
        ...base,
        title: '对比分析',
        left: { heading: '方案 A', items: ['优势 1', '优势 2'], tone: 'positive' },
        right: { heading: '方案 B', items: ['特点 1', '特点 2'], tone: 'neutral' },
      }
    case 'metrics':
      return {
        ...base,
        title: '核心指标',
        metrics: [
          { value: '99%', label: '完成率', icon: 'trending-up' },
          { value: '50+', label: '客户数', icon: 'star' },
          { value: '3x', label: '增长倍数', icon: 'zap' },
        ],
      }
    case 'metrics-rings':
      return {
        ...base,
        title: '关键数据',
        metrics: [
          { value: '75%', label: '指标一', icon: 'target' },
          { value: '62%', label: '指标二', icon: 'star' },
          { value: '81%', label: '指标三', icon: 'trending-up' },
        ],
      }
    case 'timeline':
      return {
        ...base,
        title: '项目时间线',
        events: [
          { date: '阶段一', title: '启动', description: '完成目标定义与资源准备' },
          { date: '阶段二', title: '推进', description: '完成方案开发与验证' },
        ],
      }
    case 'milestone-list':
      return {
        ...base,
        title: '里程碑',
        subtitle: '项目节点',
        events: [
          { date: '2023', title: '启动阶段', description: '完成立项与需求梳理' },
          { date: '2024', title: '建设阶段', description: '完成核心功能开发与验证' },
          { date: '2025', title: '扩展阶段', description: '进入规模化应用' },
        ],
      }
    case 'chart-bar':
      return {
        ...base,
        title: '数据对比',
        chart: {
          type: 'bar',
          title: '指标值',
          categories: ['A', 'B', 'C', 'D'],
          series: [{ name: '本期', values: [72, 58, 81, 64] }],
        },
      }
    case 'quote':
      return { ...base, title: '引用观点', quote: { text: '在这里填写一句核心引用。', attribution: '署名' } }
    case 'quote-no-avatar':
      return {
        ...base,
        title: '引用观点',
        cards: [
          { heading: '作者 · 职位', body: '引用内容 1' },
          { heading: '作者 · 职位', body: '引用内容 2' },
          { heading: '作者 · 职位', body: '引用内容 3' },
        ],
      }
    case 'image-center':
      return { ...base, image: { prompt: '', alt: '示意图' } }
    case 'section-header':
      return { ...base, subtitle: '章节副标题' }
    default:
      return base
  }
}

export function AddSlideButton({ afterIndex }: { afterIndex: number }) {
  const [showPicker, setShowPicker] = useState(false)
  const { addSlide } = useAppStore()

  const handleAdd = (layout: LayoutType) => {
    addSlide(afterIndex, createEmptySlide(layout))
    setShowPicker(false)
  }

  return (
    <div className="relative flex justify-center py-1">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] border border-transparent hover:border-[var(--color-primary)]/20 transition-all opacity-0 hover:opacity-100 focus:opacity-100"
        style={{ opacity: showPicker ? 1 : undefined }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        添加页面
      </button>

      {showPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
          <div className="absolute top-full mt-1 z-50 bg-white rounded-xl border border-[var(--color-border)] shadow-xl p-2 w-64 grid grid-cols-2 gap-1">
            {layoutOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAdd(opt.value)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs hover:bg-[var(--color-surface-alt)] transition-colors text-left"
              >
                <span className="text-base w-5 text-center">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
