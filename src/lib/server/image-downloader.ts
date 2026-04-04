/**
 * 处理 Markdown 中的外部图片 URL → 下载为 base64 data URL。
 * 报告中的图片存放在 COS 上，如 https://res.chumojy.cn/xxx.png，
 * 需要下载后才能嵌入 PPT。
 */

export async function processMarkdownImages(
  markdown: string
): Promise<{
  processedMarkdown: string
  images: { url: string; description: string }[]
}> {
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  const images: { url: string; description: string }[] = []
  const replacements: { original: string; replacement: string }[] = []

  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(markdown)) !== null) {
    const alt = match[1] || '图片'
    const url = match[2]

    // 只处理外部 HTTP(S) URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) continue

    try {
      const base64 = await downloadImageAsBase64(url)
      if (base64) {
        replacements.push({ original: match[0], replacement: `![${alt}](${base64})` })
        images.push({ url: base64, description: alt })
        console.log(`[ImageDL] Downloaded: ${url.slice(0, 80)}...`)
      }
    } catch (e) {
      console.warn(`[ImageDL] Failed to download ${url}:`, e)
      // 下载失败的图片保留原始 URL
      images.push({ url, description: alt })
    }
  }

  let processedMarkdown = markdown
  for (const r of replacements) {
    processedMarkdown = processedMarkdown.replace(r.original, r.replacement)
  }

  return { processedMarkdown, images }
}

async function downloadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) return null

    const contentType = response.headers.get('content-type') || 'image/png'
    const buffer = Buffer.from(await response.arrayBuffer())
    return `data:${contentType};base64,${buffer.toString('base64')}`
  } catch {
    return null
  }
}
