import { TemplatePack } from '../index'

const group01: TemplatePack = {
  id: 'group-01',
  name: '风格 01',
  description: '蓝色主色，轻量现代，适合通用商务汇报',
  previewColor: '#2683eb',

  colors: {
    primary: '#2683eb',
    primaryLight: '#f6f8fb',
    secondary: '#1a5cc8',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#f6f8fb',
    text: '#000000',
    textSecondary: '#6c6c6c',
    accent: '#f4c542',
    positive: '#34c759',
    negative: '#ff3b30',
    border: '#e8eaed',
  },

  fonts: {
    heading: "'Radio Canada Big', 'Noto Sans SC', sans-serif",
    body: "'Source Serif Pro', 'Noto Sans SC', serif",
    accent: "'IBM Plex Serif', serif",
  },

  cardRadius: 8,
  cardStyle: 'flat',

  figmaLayouts: ['cover', 'section-header', 'quote', 'ending'],

  decorations: {
    accentSvg: '/templates/group-01/assets/sticker-ellipse.svg',
    divider: '/templates/group-01/assets/divider.svg',
  },

  cssClass: 'tpl-group01',
}

export default group01
