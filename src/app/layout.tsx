import type { Metadata } from 'next'
import { Inter, Noto_Sans_SC } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'AIPPT - AI 演示生成',
  description: '基于文档自动生成并导出 PPTX 的 AI 演示工具',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${notoSansSC.variable} antialiased`}>{children}</body>
    </html>
  )
}
