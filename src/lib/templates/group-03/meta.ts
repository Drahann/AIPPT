import { TemplatePack } from '../index'

const group03: TemplatePack = {
  id: 'group-03',
  name: '风格 03',
  description: '几何视觉与蓝色强调，适合产品与技术主题',
  previewColor: '#2569ed',

  colors: {
    primary: '#2569ed',
    primaryLight: '#eef3ff',
    secondary: '#1a4fc8',
    background: '#fafbff',
    surface: '#ffffff',
    surfaceAlt: '#f0f4ff',
    text: '#1a1a1a',
    textSecondary: '#555555',
    accent: '#ff6b35',
    positive: '#34c759',
    negative: '#ff3b30',
    border: '#e0e6f0',
  },

  fonts: {
    heading: "'Manrope', 'Noto Sans SC', sans-serif",
    body: "'Manrope', 'Noto Sans SC', sans-serif",
  },

  cardRadius: 12,
  cardStyle: 'elevated',

  figmaLayouts: ['cover', 'section-header', 'quote', 'ending'],

  decorations: {
    accentSvg: '/templates/group-03/assets/geometric-shapes.svg',
    footerLogo: '/templates/group-03/assets/footer-bar.svg',
  },

  cssClass: 'tpl-group03',
}

export default group03
