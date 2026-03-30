import { TemplatePack } from '../index'

const group08: TemplatePack = {
  id: 'group-08',
  name: '风格 08',
  description: '文艺衬线风格，适合叙事型与品牌型内容',
  previewColor: '#8B6DB5',

  colors: {
    primary: '#8B6DB5',
    primaryLight: '#f5f0fa',
    secondary: '#4a9b7f',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#faf8f5',
    text: '#000000',
    textSecondary: '#555555',
    accent: '#e8c840',
    positive: '#4a9b7f',
    negative: '#e05555',
    border: '#e8e4df',
  },

  fonts: {
    heading: "'Shippori Mincho', 'Noto Sans SC', serif",
    body: "'Playfair Display', 'Noto Sans SC', serif",
    accent: "'Playfair Display', serif",
  },

  cardRadius: 16,
  cardStyle: 'flat',

  figmaLayouts: ['cover', 'section-header', 'quote', 'ending'],

  decorations: {
    backgroundImage: '/templates/group-08/assets/paper-texture.jpg',
    accentSvg: '/templates/group-08/assets/decorative-strip.svg',
  },

  cssClass: 'tpl-group08',
}

export default group08
