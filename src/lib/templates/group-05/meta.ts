import { TemplatePack } from '../index'

const group05: TemplatePack = {
  id: 'group-05',
  name: '风格 05',
  description: '黑金对比风格，适合战略与高层汇报',
  previewColor: '#000000',

  colors: {
    primary: '#000000',
    primaryLight: '#f5f1e9',
    secondary: '#222222',
    background: '#000000',
    surface: '#f5f1e9',
    surfaceAlt: '#ede8dc',
    text: '#000000',
    textSecondary: '#555555',
    accent: '#e8c840',
    positive: '#4caf50',
    negative: '#e53935',
    border: '#d4cfc3',
  },

  fonts: {
    heading: "'Plus Jakarta Sans', 'Noto Sans SC', sans-serif",
    body: "'Plus Jakarta Sans', 'Noto Sans SC', sans-serif",
  },

  cardRadius: 15,
  cardStyle: 'bordered',

  figmaLayouts: ['cover', 'section-header', 'quote', 'ending'],

  decorations: {},

  cssClass: 'tpl-group05',
}

export default group05
