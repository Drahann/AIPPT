import type { Metadata } from 'next'
import {
  Inter, Noto_Sans_SC,
  DM_Sans, DM_Serif_Display, DM_Serif_Text,
  Shippori_Mincho, Playfair_Display, Bricolage_Grotesque,
} from 'next/font/google'
import './globals.css'
import '@/styles/slide-layouts.css'
import '@/styles/homepage.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif-display',
})

const dmSerifText = DM_Serif_Text({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif-text',
})

// Pastel Papercut fonts
const shipporiMincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-shippori-mincho',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
})

// Curve Study font
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
})

export const metadata: Metadata = {
  title: 'AIPPT - AI 演示生成',
  description: '基于文档自动生成并导出 PPTX 的 AI 演示工具',
}

const fontVars = [
  inter, notoSansSC,
  dmSans, dmSerifDisplay, dmSerifText,
  shipporiMincho, playfairDisplay,
  bricolageGrotesque,
].map(f => f.variable).join(' ')

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${fontVars} antialiased`}>{children}</body>
    </html>
  )
}

