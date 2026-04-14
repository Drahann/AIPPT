/**
 * 处理 Markdown 中的外部图片 URL → 下载为 base64 data URL。
 * 报告中的图片存放在 COS 上，如 https://res.chumojy.cn/xxx.png，
 * 需要下载后才能嵌入 PPT。
 *
 * 新增：返回每张图片最近的 H2 heading，用于与 chunk 绑定。
 */

export async function processMarkdownImages(
  markdown: string
): Promise<{
  processedMarkdown: string
  images: { url: string; description: string; nearestHeading: string }[]
}> {
  const imgRegex = /!\[([^\]]*)\]\(([^)]+?)(?:\s+"[^"]*")?\)/g
  const images: { url: string; description: string; nearestHeading: string }[] = []
  const replacements: { original: string; replacement: string }[] = []

  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(markdown)) !== null) {
    const alt = match[1] || '图片'
    const url = match[2]

    // Find nearest H2 heading above this image
    const textBefore = markdown.substring(0, match.index)
    const headingMatch = textBefore.match(/^##\s+(.+)$/gm)
    const nearestHeading = headingMatch
      ? headingMatch[headingMatch.length - 1].replace(/^##\s+/, '').trim()
      : ''

    // Only download external HTTP(S) URLs
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Non-HTTP images (mermaid local paths, etc.) — try reading from local filesystem
      const localBase64 = readLocalImageAsBase64(url)
      if (localBase64) {
        replacements.push({ original: match[0], replacement: `![${alt}](${localBase64})` })
        images.push({ url: localBase64, description: alt, nearestHeading })
        console.log(`[ImageDL] Read local file: ${url}`)
      } else {
        // File not found — keep original, still track position
        images.push({ url, description: alt, nearestHeading })
        console.warn(`[ImageDL] Local file not found: ${url}`)
      }
      continue
    }

    try {
      const base64 = await downloadImageAsBase64(url)
      if (base64) {
        replacements.push({ original: match[0], replacement: `![${alt}](${base64})` })
        images.push({ url: base64, description: alt, nearestHeading })
        console.log(`[ImageDL] Downloaded: ${url.slice(0, 80)}...`)
      }
    } catch (e) {
      console.warn(`[ImageDL] Failed to download ${url}:`, e)
      // Download failed — keep original URL, still track position
      images.push({ url, description: alt, nearestHeading })
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

/**
 * Read a local image file (e.g. mermaid diagram PNG) and convert to base64 data URL.
 * Paths like /root/rag-agent/media/mermaid/xxx.png come from the rag-agent container
 * and are accessible via shared volume mount.
 */
function readLocalImageAsBase64(filePath: string): string | null {
  try {
    const fs = require('fs')
    const path = require('path')
    if (!fs.existsSync(filePath)) return null
    const ext = path.extname(filePath).toLowerCase()
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
    }
    const mime = mimeMap[ext] || 'image/png'
    const buf = fs.readFileSync(filePath)
    return `data:${mime};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}
