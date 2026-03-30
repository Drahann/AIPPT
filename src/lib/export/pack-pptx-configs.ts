/**
 * Per-Pack PPTX Rendering Configs
 * 
 * Each TemplatePack has unique Figma component layouts for cover/section-header/
 * quote/ending. This file provides the PPTX-equivalent positioning and styling
 * for each pack, so the exported PPTX matches the frontend Figma rendering.
 * 
 * Coordinate conversion:
 *   Figma px → PPTX inches (width):  px / 1920 * 13.33
 *   Figma px → PPTX inches (height): px / 1080 * 7.5
 */

import PptxGenJS from 'pptxgenjs'

// Shorthand converters
const fxW = (px: number) => +(px / 1920 * 13.33).toFixed(2)
const fxH = (px: number) => +(px / 1080 * 7.5).toFixed(2)

type Slide = PptxGenJS.Slide

export interface PackSlideConfig {
  render: (s: Slide, title: string, subtitle?: string, fH?: string, fB?: string) => void
}

export interface PackPptxConfig {
  cover: PackSlideConfig
  sectionHeader: PackSlideConfig
  quote: PackSlideConfig
  ending: PackSlideConfig
}

// =============================================================================
// Group 01 — 商务蓝风格（Radio Canada Big，白底蓝强调）
// =============================================================================
const group01Config: PackPptxConfig = {
  cover: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'FFFFFF' }
      // Top gradient accent bar
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: 0, y: 0, w: 13.33, h: 0.04, fill: { color: '2683eb' },
      })
      // Title at left-center: Figma left:120, top:400, w:1400, 80px
      s.addText(title, {
        x: fxW(120), y: fxH(400), w: fxW(1600), h: fxH(200),
        fontSize: 40, fontFace: fH, color: '000000', bold: true,
        fit: 'shrink'
      })
      if (subtitle) {
        s.addText(subtitle, {
          x: fxW(120), y: fxH(340), w: fxW(800), h: fxH(50),
          fontSize: 16, fontFace: fH, color: '6c6c6c',
        })
      }
      // Bottom accent line
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: fxW(120), y: fxH(930), w: fxW(200), h: 0.03, fill: { color: '2683eb' },
      })
    },
  },
  sectionHeader: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'f6f8fb' }
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: 0, y: 0, w: 0.06, h: 7.5, fill: { color: '2683eb' },
      })
      s.addText(title, {
        x: 1.0, y: 2.0, w: 10, h: 2,
        fontSize: 36, fontFace: fH, color: '2683eb', bold: true, align: 'center', valign: 'bottom',
      })
      if (subtitle) {
        s.addText(subtitle, {
          x: 1.0, y: 4.3, w: 8, h: 1,
          fontSize: 18, fontFace: fH, color: '6c6c6c',
        })
      }
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'f6f8fb' }
      s.addText('\u201C', { x: 3, y: 1, w: 1, h: 1, fontSize: 72, fontFace: 'Georgia', color: '2683eb' })
      s.addText(title, {
        x: 2, y: 2, w: 9, h: 3,
        fontSize: 22, fontFace: fH, italic: true, align: 'center', valign: 'middle', color: '000000',
      })
    },
  },
  ending: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: '2683eb' }
      s.addText(title || '封面标题', {
        x: 0.8, y: 2, w: 11.5, h: 2,
        fontSize: 44, fontFace: fH, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle',
      })
      if (subtitle) {
        s.addText(subtitle, {
          x: 2, y: 4.5, w: 9, h: 0.8,
          fontSize: 16, fontFace: fH, color: 'FFFFFF', align: 'center',
        })
      }
    },
  },
}

// =============================================================================
// Group 02 — 极简黑白（Inter，纯黑白）
// =============================================================================
const group02Config: PackPptxConfig = {
  cover: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'FFFFFF' }
      s.addText(title, {
        x: 0.5, y: 2.2, w: 12.33, h: 2.5,
        fontSize: 54, fontFace: fH, color: '000000', bold: true, align: 'center', valign: 'middle',
        fit: 'shrink'
      })
      if (subtitle) {
        s.addText(subtitle, {
          x: fxW(256), y: 4.2, w: fxW(2400), h: 0.8,
          fontSize: 36, fontFace: fH, color: '000000',
        })
      }
    },
  },
  sectionHeader: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'FFFFFF' }
      s.addText(title, {
        x: 1.0, y: 2.5, w: 11.33, h: 2,
        fontSize: 48, fontFace: fH, color: '000000', bold: true, align: 'center', valign: 'middle',
        fit: 'shrink'
      })
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'FFFFFF' }
      s.addText(`"${title}"`, {
        x: 2, y: 2.5, w: 9, h: 2,
        fontSize: 44, fontFace: fH, italic: true, align: 'center', valign: 'middle', color: '000000',
      })
    },
  },
  ending: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      s.addText(title || '封面标题', {
        x: 0.8, y: 2.5, w: 11.5, h: 2,
        fontSize: 54, fontFace: fH, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle',
        fit: 'shrink'
      })
    },
  },
}

// =============================================================================
// Group 03 — UI/UX 科技蓝（Manrope，几何感）
// =============================================================================
const group03Config: PackPptxConfig = {
  cover: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: '2569ed' }
      if (subtitle) {
        s.addText(subtitle, {
          x: fxW(168), y: fxH(334), w: fxW(800), h: fxH(60),
          fontSize: 18, fontFace: fH, color: 'fafbff',
        })
      }
      s.addText(title, {
        x: fxW(168), y: fxH(411), w: fxW(1200), h: fxH(300),
        fontSize: 48, fontFace: fH, color: 'fafbff', bold: true,
      })
    },
  },
  sectionHeader: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '2569ed' }
      s.addText(title, {
        x: 1, y: 2.5, w: 11, h: 2,
        fontSize: 36, fontFace: fH, color: 'fafbff', bold: true, align: 'center', valign: 'middle',
      })
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'eef3ff' }
      s.addText('\u201C', { x: 3, y: 1, w: 1, h: 1, fontSize: 72, fontFace: 'Georgia', color: '2569ed' })
      s.addText(title, {
        x: 2, y: 2, w: 9, h: 3,
        fontSize: 22, fontFace: fH, italic: true, align: 'center', valign: 'middle', color: '222222',
      })
    },
  },
  ending: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: '2569ed' }
      s.addText(title || 'Thank You', {
        x: 0.8, y: 2, w: 11.5, h: 2,
        fontSize: 44, fontFace: fH, color: 'fafbff', bold: true, align: 'center', valign: 'middle',
      })
      if (subtitle) {
        s.addText(subtitle, {
          x: 2, y: 4.3, w: 9, h: 0.8,
          fontSize: 16, fontFace: fH, color: 'fafbff', align: 'center',
        })
      }
      // Footer bar
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: 0, y: 7.08, w: 13.33, h: 0.42, fill: { color: '1a4fc8' },
      })
    },
  },
}

// =============================================================================
// Group 04 — 深紫粉配色（Crimson Pro）
// =============================================================================
const group04Config: PackPptxConfig = {
  cover: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: '1c0033' }
      // Large centered title
      s.addText(title, {
        x: 0.5, y: 1.8, w: 12.33, h: 3.5,
        fontSize: 56, fontFace: fH, color: 'ffbde8', align: 'center', valign: 'middle',
        fit: 'shrink'
      })
      if (subtitle) {
        s.addText(subtitle, {
          x: 3, y: 5.5, w: 7, h: 0.8,
          fontSize: 36, fontFace: fH, color: 'ffbde8', align: 'center',
        })
      }
      // Top-left project name
      s.addText('PROJECT NAME', {
        x: fxW(200), y: fxH(92), w: 3, h: 0.3,
        fontSize: 20, fontFace: fH, color: 'e7e3d9',
      })
    },
  },
  sectionHeader: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      // Split layout: left purple, right beige
      s.background = { fill: 'e7e3d9' }
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: 0, y: 0, w: 6.66, h: 7.5, fill: { color: '1c0033' },
      })
      s.addText(title, {
        x: 0.5, y: 1.5, w: 5.6, h: 4.5,
        fontSize: 64, fontFace: fH, color: 'ffbde8', align: 'center', valign: 'middle',
        fit: 'shrink'
      })
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '1c0033' }
      s.addText(`"${title}"`, {
        x: 0.8, y: 3, w: fxW(2800), h: 3,
        fontSize: 56, fontFace: fH, color: 'ffbde8', valign: 'bottom',
      })
    },
  },
  ending: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '1c0033' }
      s.addText(title || 'END', {
        x: 0.8, y: 3, w: 11.5, h: 1.5,
        fontSize: 28, fontFace: fH, color: 'e7e3d9', align: 'center', valign: 'middle',
      })
    },
  },
}

// =============================================================================
// Group 05 — 黑金奶油风（Plus Jakarta Sans）
// =============================================================================
const group05Config: PackPptxConfig = {
  cover: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      // Cream center card: Figma 1882×1011, starts top:55
      s.addShape('roundRect' as PptxGenJS.ShapeType, {
        x: fxW(19), y: fxH(55), w: fxW(1882), h: fxH(1011),
        fill: { color: 'f5f1e9' }, rectRadius: 0.1,
      })
      // Title inside cream card
      s.addText(title, {
        x: fxW(156), y: fxH(215), w: fxW(1034), h: fxH(300),
        fontSize: 60, fontFace: fH, color: '000000', bold: true,
      })
    },
  },
  sectionHeader: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      s.addText(title, {
        x: 1, y: 2.5, w: 11, h: 2,
        fontSize: 36, fontFace: fH, color: 'f5f1e9', bold: true, align: 'center', valign: 'middle',
      })
      if (subtitle) {
        s.addText(subtitle, {
          x: 1, y: 4.8, w: 11, h: 0.8,
          fontSize: 16, fontFace: fH, color: 'd4cfc3',
        })
      }
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      s.addText(`"${title}"`, {
        x: 2, y: 2, w: 9, h: 3,
        fontSize: 22, fontFace: fH, color: 'f5f1e9', italic: true, align: 'center', valign: 'middle',
      })
    },
  },
  ending: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      s.addText(title || '封面标题', {
        x: 0.8, y: 2.5, w: 11.5, h: 2,
        fontSize: 44, fontFace: fH, color: 'f5f1e9', bold: true, align: 'center', valign: 'middle',
      })
    },
  },
}

// =============================================================================
// Group 06 — 深灰渐变风（Inter）
// =============================================================================
const group06Config: PackPptxConfig = {
  cover: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '343232' }
      // Can't do gradient text in PPTX, use white
      s.addText(title, {
        x: 0.5, y: 1.5, w: 12.33, h: 3.5,
        fontSize: 56, fontFace: fH, color: 'FFFFFF', align: 'center', valign: 'middle',
        fit: 'shrink'
      })
      // Status bar at bottom
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: 0, y: 7.0, w: 13.33, h: 0.5,
        line: { color: 'E6E6E6', width: 0.5 },
      })
      s.addText('', {
        x: 0.5, y: 7.1, w: 3, h: 0.3,
        fontSize: 16, fontFace: fH, color: 'CCCCCC',
      })
    },
  },
  sectionHeader: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '343232' }
      s.addText(title, {
        x: 1, y: 2.5, w: 11.33, h: 2,
        fontSize: 48, fontFace: fH, color: 'FFFFFF', align: 'center', valign: 'middle',
        fit: 'shrink'
      })
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'FFFFFF' }
      s.addText(`"${title}"`, {
        x: 2, y: 2.5, w: 9, h: 2,
        fontSize: 40, fontFace: fH, color: '333333', align: 'center', valign: 'middle',
      })
    },
  },
  ending: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'FFFFFF' }
      s.addText(title || '', {
        x: 0.8, y: 3, w: 11.5, h: 1.5,
        fontSize: 48, fontFace: fH, color: '000000', align: 'center', valign: 'middle',
      })
    },
  },
}

// =============================================================================
// Group 07 — 黑棕商务风（Work Sans）
// =============================================================================
const group07Config: PackPptxConfig = {
  cover: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      // Title bottom-left, uppercase, Figma: left:40, bottom area, 160px
      s.addText(title.toUpperCase(), {
        x: 0.5, y: 3.0, w: 12.33, h: 4.0,
        fontSize: 56, fontFace: fH, color: 'dcdbce', align: 'center', valign: 'bottom',
        fit: 'shrink'
      })
      // Corner labels
      s.addText('', {
        x: fxW(80), y: fxH(60), w: 3, h: 0.3,
        fontSize: 20, fontFace: 'Courier New', color: 'dcdbce',
      })
      s.addText('', {
        x: 10, y: 7.0, w: 3, h: 0.3,
        fontSize: 20, fontFace: 'Courier New', color: 'dcdbce', align: 'right',
      })
    },
  },
  sectionHeader: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'f5f0e6' }
      s.addText(title, {
        x: 1, y: 2.5, w: 11.33, h: 2,
        fontSize: 44, fontFace: fH, color: '1a1a1a', bold: true, align: 'center', valign: 'middle',
        fit: 'shrink'
      })
      if (subtitle) {
        s.addText(subtitle, {
          x: 1, y: 4.8, w: 8, h: 0.8,
          fontSize: 28, fontFace: fH, color: '666666',
        })
      }
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'f5f0e6' }
      s.addText(`"${title}"`, {
        x: 2, y: 2.5, w: 9, h: 2,
        fontSize: 44, fontFace: fH, color: '1a1a1a', align: 'center', valign: 'middle',
      })
    },
  },
  ending: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      s.addText(title || '', {
        x: 0.8, y: 2.5, w: 11.5, h: 2,
        fontSize: 48, fontFace: fH, color: 'dcdbce', align: 'center', valign: 'middle',
        fit: 'shrink'
      })
    },
  },
}

// =============================================================================
// Group 08 — 文艺柔和风（Shippori Mincho）
// =============================================================================
const group08Config: PackPptxConfig = {
  cover: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'FFFFFF' }
      // Pastel gradient background decoration
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: 0, y: 0, w: 13.33, h: 7.5,
        fill: { color: 'ece8ff' },
        // Light pastel tint
      })
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: 0, y: 0, w: 13.33, h: 7.5,
        fill: { color: 'FFFFFF' },
      })
      // Title top-left: Figma left:90, top:90, 90px
      s.addText(title, {
        x: fxW(90), y: fxH(90), w: fxW(1435), h: fxH(200),
        fontSize: 44, fontFace: fH, color: '000000',
      })
      // Subtitle (in PPTX we can't rotate easily, place it at bottom-right as regular text)
      if (subtitle) {
        s.addText(subtitle, {
          x: fxW(1500), y: fxH(200), w: fxW(350), h: fxH(600),
          fontSize: 14, fontFace: fH, color: '666666', italic: true,
          valign: 'middle', align: 'center',
          rotate: 90,
        })
      }
    },
  },
  sectionHeader: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'faf8f5' }
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: 0, y: 0, w: 0.04, h: 7.5, fill: { color: '8B6DB5' },
      })
      s.addText(title, {
        x: 0.8, y: 2.5, w: 11, h: 2,
        fontSize: 32, fontFace: fH, color: '8B6DB5', align: 'center', valign: 'middle',
      })
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'faf8f5' }
      s.addText('\u201C', { x: 3, y: 1, w: 1, h: 1, fontSize: 72, fontFace: 'Georgia', color: '8B6DB5' })
      s.addText(title, {
        x: 2, y: 2, w: 9, h: 3,
        fontSize: 22, fontFace: fH, italic: true, align: 'center', valign: 'middle', color: '333333',
      })
    },
  },
  ending: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'faf8f5' }
      s.addText(title || '封面标题', {
        x: 0.8, y: 2.5, w: 11.5, h: 2,
        fontSize: 40, fontFace: fH, color: '8B6DB5', align: 'center', valign: 'middle',
      })
    },
  },
}

// =============================================================================
// Group 09 — 活力曲线风（Bricolage Grotesque）
// =============================================================================
const group09Config: PackPptxConfig = {
  cover: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'f3f3f3' }
      // Title left, uppercase: Figma left:64, top:14.29%
      s.addText(title.toUpperCase(), {
        x: 0.5, y: 2.8, w: 12.33, h: 3.5,
        fontSize: 56, fontFace: fH, color: '000000', align: 'center', valign: 'middle',
        fit: 'shrink'
      })
      // Caption
      s.addText('Caption', {
        x: fxW(128), y: fxH(128), w: 3, h: 0.3,
        fontSize: 28, fontFace: fH, color: '000000', bold: true,
      })
    },
  },
  sectionHeader: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: 'f3f3f3' }
      s.addText(title, {
        x: 1, y: 2.5, w: 11.33, h: 2,
        fontSize: 48, fontFace: fH, color: '000000', align: 'center', valign: 'middle',
        fit: 'shrink'
      })
      if (subtitle) {
        s.addText(subtitle, {
          x: 1, y: 4.8, w: 8, h: 0.8,
          fontSize: 28, fontFace: fH, color: '666666',
        })
      }
      // Bottom teal accent bar
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: 0, y: 7.47, w: 13.33, h: 0.03, fill: { color: '1a4a5a' },
      })
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '1a4a5a' }
      s.addText(`"${title}"`, {
        x: 2, y: 2, w: 9, h: 3,
        fontSize: 44, fontFace: fH, color: 'FFFFFF', align: 'center', valign: 'middle',
      })
    },
  },
  ending: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '1a4a5a' }
      s.addText(title || 'ONE MORE THING...', {
        x: 0.8, y: 2.5, w: 11.5, h: 2,
        fontSize: 48, fontFace: fH, color: 'FFFFFF', align: 'center', valign: 'middle',
        fit: 'shrink'
      })
    },
  },
}

// =============================================================================
// Group 10 — 深色未来风（Unbounded）
// =============================================================================
const group10Config: PackPptxConfig = {
  cover: {
    render: (s, title, subtitle, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      // Year/subtitle in gray
      s.addText(subtitle || new Date().getFullYear().toString(), {
        x: fxW(64), y: fxH(64), w: fxW(1179), h: fxH(200),
        fontSize: 60, fontFace: fH, color: '5e6168',
      })
      // Main title in white
      s.addText(title, {
        x: fxW(64), y: fxH(260), w: fxW(1179), h: fxH(300),
        fontSize: 60, fontFace: fH, color: 'FFFFFF', bold: true,
      })
      // Footer tags
      s.addShape('rect' as PptxGenJS.ShapeType, {
        x: fxW(64), y: fxH(940), w: 2, h: 0.35,
        fill: { color: '2a2a2a' },
      })
      s.addText('Presentation', {
        x: fxW(64), y: fxH(940), w: 2, h: 0.35,
        fontSize: 12, fontFace: fH, color: 'FFFFFF', align: 'center', valign: 'middle',
      })
    },
  },
  sectionHeader: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      s.addText(title, {
        x: 1, y: 2.5, w: 11, h: 2,
        fontSize: 36, fontFace: fH, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle',
      })
    },
  },
  quote: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '111111' }
      s.addText('\u201C', { x: 3, y: 1, w: 1, h: 1, fontSize: 72, fontFace: 'Georgia', color: '6c7aff' })
      s.addText(title, {
        x: 2, y: 2, w: 9, h: 3,
        fontSize: 22, fontFace: fH, italic: true, color: 'FFFFFF', align: 'center', valign: 'middle',
      })
    },
  },
  ending: {
    render: (s, title, _sub, fH = 'Microsoft YaHei') => {
      s.background = { fill: '000000' }
      s.addText(title || '封面标题', {
        x: 0.8, y: 2.5, w: 11.5, h: 2,
        fontSize: 44, fontFace: fH, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle',
      })
    },
  },
}

// =============================================================================
// Registry
// =============================================================================
const packPptxConfigs: Record<string, PackPptxConfig> = {
  'group-01': group01Config,
  'group-02': group02Config,
  'group-03': group03Config,
  'group-04': group04Config,
  'group-05': group05Config,
  'group-06': group06Config,
  'group-07': group07Config,
  'group-08': group08Config,
  'group-09': group09Config,
  'group-10': group10Config,
}

export function getPackPptxConfig(packId: string): PackPptxConfig | undefined {
  return packPptxConfigs[packId]
}
