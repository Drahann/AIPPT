import mammoth from 'mammoth'
import { DocumentChunk } from '../types'
import { normalizeMojibake } from '../ai/text-normalizer'

interface ParsedSection {
  heading: string
  headingLevel: number
  content: string
  tables: string[]
}

const ITEM_PER_SLIDE_SECTION_PATTERNS = [
  /核心技术/i,
  /创新技术/i,
  /主要产品/i,
  /核心优势/i,
  /应用企业/i,
  /产业验证/i,
  /应用案例/i,
  /应用场景/i,
  /应用公司/i,
  /应用部门/i,
  /core\s*technolog/i,
  /key\s*technolog/i,
  /application\s*(enterprise|company|case)/i,
  /鏍稿績鎶€鏈?/i,
  /搴旂敤浼佷笟/i,
]

export async function parseDocx(
  buffer: Buffer
): Promise<{ chunks: DocumentChunk[]; docxImages: { url: string; description: string }[] }> {
  let html: string

  const isZip = buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4b
  if (isZip) {
    const result = await mammoth.convertToHtml({ buffer })
    html = result.value
  } else {
    html = markdownToHtml(buffer.toString('utf-8'))
  }

  const docxImages: { url: string; description: string }[] = []
  const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/gi
  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(html)) !== null) {
    const url = match[1]
    if (!url.startsWith('data:image/')) continue

    const start = Math.max(0, match.index - 150)
    const end = Math.min(html.length, match.index + match[0].length + 150)
    const contextHtml = html.substring(start, end)
    const description = normalizeMojibake(contextHtml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || '图片')
    docxImages.push({ url, description })
  }

  const cleanHtml = html.replace(/<img[^>]*>/gi, '')
  const sections = extractSections(cleanHtml)
  const chunks = buildChunks(sections)
  return { chunks, docxImages }
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^(?!<h[1-5]>)(.+)$/gm, '<p>$1</p>')
    .replace(/<p>\s*<\/p>/g, '')
}

function extractSections(html: string): ParsedSection[] {
  const sections: ParsedSection[] = []
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi
  let match: RegExpExecArray | null
  const matches: Array<{ level: number; text: string; index: number; fullLength: number }> = []

  while ((match = headingRegex.exec(html)) !== null) {
    matches.push({
      level: parseInt(match[1], 10),
      text: normalizeMojibake(stripHtml(match[2])),
      index: match.index,
      fullLength: match[0].length,
    })
  }

  if (matches.length === 0) {
    const cleaned = htmlToText(html)
    if (cleaned.trim()) {
      sections.push({
        heading: '未命名章节',
        headingLevel: 1,
        content: cleaned,
        tables: extractTables(html),
      })
    }
    return sections
  }

  const h2Matches = matches.filter((item) => item.level === 2)
  if (h2Matches.length > 0) {
    const preamble = html.substring(0, h2Matches[0].index)
    const preambleText = htmlToText(preamble)
    if (preambleText.trim().length > 20) {
      sections.push({
        heading: '引言',
        headingLevel: 1,
        content: preambleText,
        tables: extractTables(preamble),
      })
    }

    for (let i = 0; i < h2Matches.length; i += 1) {
      const current = h2Matches[i]
      const contentStart = current.index + current.fullLength
      const contentEnd = i + 1 < h2Matches.length ? h2Matches[i + 1].index : html.length
      const contentHtml = html.substring(contentStart, contentEnd)

      // For special sections (产业验证, 创新技术, etc.), split by H3 sub-headings
      if (shouldSplitSectionByItems(current.text)) {
        const h3Subs = extractH3SubSections(current.text, contentHtml)
        if (h3Subs.length > 0) {
          sections.push(...h3Subs)
          continue
        }
      }

      sections.push({
        heading: current.text || `章节 ${i + 1}`,
        headingLevel: 2,
        content: htmlToText(contentHtml),
        tables: extractTables(contentHtml),
      })
    }
    return sections
  }

  const preamble = html.substring(0, matches[0].index)
  const preambleText = htmlToText(preamble)
  if (preambleText.trim().length > 20) {
    sections.push({
      heading: '引言',
      headingLevel: 1,
      content: preambleText,
      tables: extractTables(preamble),
    })
  }

  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i]
    const contentStart = current.index + current.fullLength
    const contentEnd = i + 1 < matches.length ? matches[i + 1].index : html.length
    const contentHtml = html.substring(contentStart, contentEnd)
    const contentText = htmlToText(contentHtml)
    if (contentText.trim().length > 0 || current.text.trim().length > 0) {
      sections.push({
        heading: current.text,
        headingLevel: current.level,
        content: contentText,
        tables: extractTables(contentHtml),
      })
    }
  }

  return sections
}

function buildChunks(sections: ParsedSection[]): DocumentChunk[] {
  const chunks: DocumentChunk[] = []
  let order = 0

  for (const section of sections) {
    if (section.headingLevel === 2 && shouldSplitSectionByItems(section.heading)) {
      const items = splitSectionItems(section.content)
      if (items.length > 0) {
        for (const item of items) {
          chunks.push({
            id: `chunk-${order}`,
            heading: `${section.heading} - ${item.title}`,
            headingLevel: section.headingLevel,
            content: item.content,
            order: order++,
          })
        }
        continue
      }
    }

    chunks.push({
      id: `chunk-${order}`,
      heading: section.heading,
      headingLevel: section.headingLevel,
      content: section.content,
      tables: section.tables.length > 0 ? section.tables : undefined,
      order: order++,
    })
  }

  return chunks
}

/**
 * Split a special H2 section's HTML by its H3 sub-headings.
 * Returns an array of ParsedSection where each H3 becomes an independent section
 * with heading format "H2标题 - H3标题" and headingLevel 3.
 * Any content before the first H3 is included as the parent H2 section.
 */
function extractH3SubSections(h2Heading: string, contentHtml: string): ParsedSection[] {
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gi
  const h3Matches: Array<{ text: string; index: number; fullLength: number }> = []
  let match: RegExpExecArray | null

  while ((match = h3Regex.exec(contentHtml)) !== null) {
    h3Matches.push({
      text: normalizeMojibake(stripHtml(match[1])),
      index: match.index,
      fullLength: match[0].length,
    })
  }

  if (h3Matches.length === 0) return []

  const results: ParsedSection[] = []

  // Content before the first H3 (preamble of the H2 section)
  const preambleHtml = contentHtml.substring(0, h3Matches[0].index)
  const preambleText = htmlToText(preambleHtml)
  if (preambleText.trim().length > 10) {
    results.push({
      heading: h2Heading,
      headingLevel: 2,
      content: preambleText,
      tables: extractTables(preambleHtml),
    })
  }

  // Each H3 becomes an independent section
  for (let j = 0; j < h3Matches.length; j++) {
    const h3 = h3Matches[j]
    const h3ContentStart = h3.index + h3.fullLength
    const h3ContentEnd = j + 1 < h3Matches.length ? h3Matches[j + 1].index : contentHtml.length
    const h3ContentHtml = contentHtml.substring(h3ContentStart, h3ContentEnd)

    const cleanText = h3.text.replace(/^[0-9]+[、.，\s]+/, '')
    results.push({
      heading: `${h2Heading}：${cleanText}`,
      headingLevel: 3,
      content: htmlToText(h3ContentHtml),
      tables: extractTables(h3ContentHtml),
    })
  }

  return results
}

function shouldSplitSectionByItems(heading: string): boolean {
  const normalized = normalizeMojibake((heading || '').trim())
  return ITEM_PER_SLIDE_SECTION_PATTERNS.some((pattern) => pattern.test(normalized))
}

function splitSectionItems(content: string): Array<{ title: string; content: string }> {
  const lines = content
    .split('\n')
    .map((line) => normalizeMojibake(line.trim()))
    .filter((line) => line.length > 0)
  if (lines.length === 0) return []

  const bulletRegex = /^([-*•]|#{1,3}|[0-9]+[.)、]|[A-Za-z][.)])\s*(.+)$/
  const items: Array<{ title: string; content: string }> = []
  let current: string[] = []

  const flushCurrent = () => {
    if (current.length === 0) return
    const first = current[0]
    const rest = current.slice(1).join(' ')
    items.push({
      title: first.length > 50 ? `${first.slice(0, 50)}...` : first,
      content: rest ? `${first}\n${rest}` : first,
    })
    current = []
  }

  for (const line of lines) {
    const bulletMatch = line.match(bulletRegex)
    if (bulletMatch) {
      flushCurrent()
      current.push(bulletMatch[2].trim())
      continue
    }
    current.push(line)
  }
  flushCurrent()

  if (items.length <= 1) {
    const fallback = content
      .split(/\n{2,}/)
      .map((block) => normalizeMojibake(block.trim()))
      .filter(Boolean)
      .map((block) => ({
        title: block.split('\n')[0].trim().slice(0, 50) || '条目',
        content: block,
      }))
    if (fallback.length > 1) return fallback
  }

  return items
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function htmlToText(html: string): string {
  return normalizeMojibake(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<\/tr>/gi, '\n')
      .replace(/<td[^>]*>/gi, ' | ')
      .replace(/<h[3-4][^>]*>(.*?)<\/h[3-4]>/gi, '\n\n### $1\n\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

function extractTables(html: string): string[] {
  const tables: string[] = []
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi
  let match: RegExpExecArray | null
  while ((match = tableRegex.exec(html)) !== null) {
    tables.push(htmlToText(match[0]))
  }
  return tables
}

