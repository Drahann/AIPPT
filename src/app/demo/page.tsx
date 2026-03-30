'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Presentation, SlideContent } from '@/lib/types'

const demoSlides: SlideContent[] = [
  {
    layout: 'cover',
    title: '智能停车场管理系统',
    subtitle: '基于物联网的城市停车解决方案 — 2026年度项目汇报',
  },
  {
    layout: 'section-header',
    title: '项目背景',
    subtitle: '城市停车难题的现状与挑战',
  },
  {
    layout: 'image-text',
    title: '城市停车现状',
    body: [
      {
        type: 'bullet',
        items: [
          '中国汽车保有量突破 3.2 亿辆，年增长 6.8%',
          '城市核心区停车位缺口率高达 40%-60%',
          '驾驶员平均寻找车位时间超过 15 分钟',
          '传统停车场人工管理效率低，高峰期拥堵严重',
        ],
      },
    ],
    image: {
      prompt: 'urban parking lot',
      alt: '城市停车场拥堵场景',
    },
  },
  {
    layout: 'cards-3',
    title: '核心问题分析',
    cards: [
      { icon: 'search', heading: '车位难找', body: '驾驶员平均花费15分钟寻找车位，高峰期甚至超过30分钟' },
      { icon: 'clock', heading: '效率低下', body: '人工收费导致出入口排队，单车通行时间超过45秒' },
      { icon: 'alert', heading: '管理混乱', body: '无法实时掌握车位状态，资源调度完全依赖经验' },
    ],
  },
  {
    layout: 'comparison',
    title: '智能方案 vs 传统方案',
    left: {
      heading: '传统人工管理',
      items: ['人工巡检车位', '纸质记录台账', '现金/刷卡收费', '无数据分析能力'],
      tone: 'negative',
    },
    right: {
      heading: '智能管理系统',
      items: ['传感器实时感知', '云端自动记录', '无感支付通行', 'AI 数据决策'],
      tone: 'positive',
    },
  },
  {
    layout: 'text-bullets',
    title: '技术架构概览',
    body: [
      {
        type: 'bullet',
        items: [
          '感知层：地磁传感器 + 车牌识别摄像头，实现车位状态实时检测',
          '网络层：NB-IoT + 5G 双模通信，保证数据传输稳定性',
          '平台层：微服务架构，支持百万级设备并发接入',
          '应用层：移动端 App + 管理后台 + 数据大屏',
        ],
      },
    ],
  },
  {
    layout: 'cards-4',
    title: '核心技术模块',
    cards: [
      { icon: 'target', heading: '智能感知', body: '地磁+视觉融合感知，车位检测准确率 99.5%' },
      { icon: 'globe', heading: '云端平台', body: 'Kubernetes 微服务架构，支持弹性扩缩容' },
      { icon: 'users', heading: '用户终端', body: 'React Native 跨平台 App，覆盖 iOS/Android' },
      { icon: 'settings', heading: 'AI 引擎', body: '基于 LSTM 的车位预测模型，准确率 92%' },
    ],
  },
  {
    layout: 'metrics',
    title: '实现成果',
    metrics: [
      { value: '40%', label: '车位利用率提升', icon: 'trending-up' },
      { value: '60%', label: '寻位时间缩短', icon: 'clock' },
      { value: '3.2s', label: '平均通行时间', icon: 'zap' },
      { value: '99.7%', label: '系统可用性', icon: 'shield' },
    ],
  },
  {
    layout: 'timeline',
    title: '项目里程碑',
    events: [
      { date: '2025.05', title: '项目立项', description: '完成可行性分析和技术选型' },
      { date: '2025.08', title: '原型开发', description: '核心感知模块和后端平台搭建完成' },
      { date: '2025.11', title: '试点部署', description: '在 3 个停车场完成试点运行' },
      { date: '2026.02', title: '正式上线', description: '覆盖城区 20 个停车场，服务 10 万+用户' },
    ],
  },
  {
    layout: 'image-center',
    title: '系统运行数据大屏',
    image: {
      prompt: 'data dashboard',
      alt: '数据监控大屏',
    },
  },
  {
    layout: 'quote',
    title: '',
    quote: {
      text: '智慧停车不仅是技术问题，更是城市治理能力现代化的重要组成部分。',
      attribution: '项目首席架构师',
    },
  },
  {
    layout: 'text-center',
    title: '未来展望',
    body: [
      {
        type: 'paragraph',
        text: '下一阶段将引入自动驾驶泊车技术，实现从"找车位"到"车自己停"的跨越式升级。同时计划接入城市交通大脑，实现停车资源的全局最优调度。',
      },
    ],
  },
  {
    layout: 'ending',
    title: '感谢聆听',
    subtitle: '欢迎提问与交流',
  },
]

export default function DemoPage() {
  const router = useRouter()
  const { setPresentation } = useAppStore()

  useEffect(() => {
    const presentation: Presentation = {
      id: 'demo-001',
      title: '智能停车场管理系统',
      themeId: 'group-01',
      slides: demoSlides,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setPresentation(presentation)
    router.push('/edit')
  }, [router, setPresentation])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[var(--color-text-secondary)]">正在加载演示数据...</p>
      </div>
    </div>
  )
}
