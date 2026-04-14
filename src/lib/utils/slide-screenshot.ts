import { toPng } from 'html-to-image'

/**
 * 将一个 DOM 元素截图为 PNG dataUrl。
 * 
 * slide-card 的实际渲染容器是 960×540 (或者在导出时 1920×1080)，
 * 内部 Spec 渲染通过 transform: scale(0.5) 缩放。
 * 直接截图 slide-card 即可获取正确的视觉效果。
 * 
 * @param element - 要截图的 DOM 元素（通常是 .slide-card）
 * @param scale - 缩放倍率（默认 1x 节省内存，debug 用途不需要高清）
 * @returns base64 dataUrl 字符串
 */
export async function captureElementAsPng(
  element: HTMLElement,
  scale: number = 1
): Promise<string> {
  // Get the actual rendered size of the element
  const rect = element.getBoundingClientRect()
  
  return toPng(element, {
    quality: 0.92,
    pixelRatio: scale,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    skipFonts: false,
    cacheBust: true,
    style: {
      // Ensure no margin/transform affects the screenshot
      margin: '0',
      transform: 'none',
    },
    filter: (node: HTMLElement) => {
      // Skip the slide-number badge in screenshots
      if (node.classList?.contains('slide-number')) return false
      return true
    },
  })
}

/**
 * 截图并上传到 debug API。
 * 
 * @param element - 要截图的 DOM 元素
 * @param sessionId - debug session ID
 * @param slideIndex - 幻灯片索引
 * @param source - 来源: 'render' (前端预览) 或 'export' (导出时)
 */
export async function captureAndSaveSlideScreenshot(
  element: HTMLElement,
  sessionId: string,
  slideIndex: number,
  source: 'render' | 'export' = 'render'
): Promise<boolean> {
  try {
    const dataUrl = await captureElementAsPng(element)

    const res = await fetch('/api/debug/screenshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, slideIndex, source, dataUrl }),
    })

    return res.ok
  } catch (err) {
    console.warn(`[Debug] Screenshot capture failed for slide ${slideIndex}:`, err)
    return false
  }
}
