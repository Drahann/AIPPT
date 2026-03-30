import { TemplatePack } from '../index'

const group10: TemplatePack = {
  id: 'group-10',
  name: '风格 10',
  description: '深色科技风，适合数据和趋势展示',
  previewColor: '#1a1a2e',

  colors: {
    primary: '#b8bec5',
    primaryLight: '#2a2a2a',
    secondary: '#5e6168',
    background: '#000000',
    surface: '#111111',
    surfaceAlt: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b8bec5',
    accent: '#6c7aff',
    positive: '#00d084',
    negative: '#ff4757',
    border: '#2a2a2a',
  },

  fonts: {
    heading: "'Unbounded', 'Noto Sans SC', sans-serif",
    body: "'Geist', 'Noto Sans SC', sans-serif",
  },

  cardRadius: 0,
  cardStyle: 'flat',

  figmaLayouts: ['cover', 'section-header', 'quote', 'ending'],

  decorations: {},

  cssClass: 'tpl-group10',
}

export default group10
