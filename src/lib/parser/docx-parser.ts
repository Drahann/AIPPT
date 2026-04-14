import mammoth from 'mammoth'
import { DocumentChunk, ChunkImage } from '../types'
import { normalizeMojibake } from '../ai/text-normalizer'

interface ParsedSection {
  heading: string
  headingLevel: number
  content: string
  tables: string[]
  images: ChunkImage[]
}

/** Headings that indicate a metadata-only section to be skipped */
const METADATA_SECTION_PATTERNS = [
  /相关图片信息/,
  /图片信息$/,
  /^附录.*图片/,
]

// Only these H2 sections should be split by H3 sub-headings into individual slides.
// Other sections (创新成果, 核心成果, etc.) should keep their natural structure.
const ITEM_PER_SLIDE_SECTION_PATTERNS = [
  /创新技术/i,
  /核心技术/i,
  /产业验证/i,
  /core\s*technolog/i,
  /key\s*technolog/i,
]

export async function parseDocx(
  buffer: Buffer
): Promise<{ chunks: DocumentChunk[]; docxImages: { url: string; description: string }[]; detectedLanguage: string }> {
  let html: string

  const isZip = buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4b
  if (isZip) {
    const result = await mammoth.convertToHtml({ buffer })
    html = result.value
  } else {
    html = markdownToHtml(buffer.toString('utf-8'))
  }

  // Extract DOCX-embedded base64 images (legacy path for .docx files)
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

  // Extract sections — images will be bound per-section
  const sections = extractSections(html)
  const chunks = buildChunks(sections)

  // Auto-detect language from content
  const detectedLanguage = detectLanguage(chunks)

  return { chunks, docxImages, detectedLanguage }
}

/**
 * Detect document language based on CJK character ratio.
 * Returns 'zh-CN' if Chinese characters make up >15% of text, otherwise 'en'.
 */
function detectLanguage(chunks: DocumentChunk[]): string {
  const sampleText = chunks
    .slice(0, 5)
    .map((c) => c.heading + ' ' + c.content.slice(0, 300))
    .join(' ')

  if (sampleText.length === 0) return 'zh-CN'

  // Count CJK characters (Chinese/Japanese/Korean)
  const cjkChars = sampleText.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g)
  const cjkRatio = (cjkChars?.length || 0) / sampleText.length

  return cjkRatio > 0.15 ? 'zh-CN' : 'en'
}

function markdownToHtml(markdown: string): string {
  // Clean server-side Mermaid remnants (BeginMermaid...EndMermaid blocks)
  const cleaned = markdown
    .replace(/BeginMermaid[\s\S]*?EndMermaid/g, '')
    .replace(/```mermaid[\s\S]*?```/g, '')

  return cleaned
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Preserve images as <img> tags for per-section binding (instead of deleting)
    .replace(/!\[([^\]]*)\]\(([^)]+?)(?:\s+"[^"]*")?\)/g, '<img src="$2" alt="$1" />')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^(?!<h[1-5]>|<img )(.+)$/gm, '<p>$1</p>')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p>(<img [^>]+>)<\/p>/g, '$1')
}

/** Check if a heading indicates a metadata-only section that should be skipped */
function isMetadataSection(heading: string): boolean {
  const normalized = normalizeMojibake((heading || '').trim())
  return METADATA_SECTION_PATTERNS.some((pattern) => pattern.test(normalized))
}

/** Extract <img> tags from HTML, returning ChunkImage[] and cleaned HTML */
function extractImagesFromHtml(contentHtml: string): { images: ChunkImage[]; cleanHtml: string } {
  const images: ChunkImage[] = []
  const imgTagRegex = /<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi
  // Also match alt before src
  const imgTagRegex2 = /<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/gi
  let m: RegExpExecArray | null

  const seen = new Set<string>()
  for (const regex of [imgTagRegex, imgTagRegex2]) {
    regex.lastIndex = 0
    while ((m = regex.exec(contentHtml)) !== null) {
      const url = regex === imgTagRegex ? m[1] : m[2]
      const alt = regex === imgTagRegex ? m[2] : m[1]
      if (seen.has(url)) continue
      seen.add(url)

      let source: ChunkImage['source'] = 'user'
      if (url.startsWith('data:image/')) {
        source = 'docx'
      } else if (/mermaid/i.test(url)) {
        source = 'mermaid'
      }
      images.push({ url, description: normalizeMojibake(alt || '图片'), source })
    }
  }

  const cleanHtml = contentHtml.replace(/<img[^>]*>/gi, '')
  return { images, cleanHtml }
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
    const { images, cleanHtml } = extractImagesFromHtml(html)
    const cleaned = htmlToText(cleanHtml)
    if (cleaned.trim()) {
      sections.push({
        heading: '未命名章节',
        headingLevel: 1,
        content: cleaned,
        tables: extractTables(cleanHtml),
        images,
      })
    }
    return sections
  }

  const h2Matches = matches.filter((item) => item.level === 2)
  if (h2Matches.length > 0) {
    const preamble = html.substring(0, h2Matches[0].index)
    const { images: preambleImages, cleanHtml: preambleClean } = extractImagesFromHtml(preamble)
    const preambleText = htmlToText(preambleClean)
    if (preambleText.trim().length > 20) {
      sections.push({
        heading: '引言',
        headingLevel: 1,
        content: preambleText,
        tables: extractTables(preambleClean),
        images: preambleImages,
      })
    }

    for (let i = 0; i < h2Matches.length; i += 1) {
      const current = h2Matches[i]

      // Skip metadata-only sections (e.g. "相关图片信息")
      if (isMetadataSection(current.text)) continue

      const contentStart = current.index + current.fullLength
      const contentEnd = i + 1 < h2Matches.length ? h2Matches[i + 1].index : html.length
      const contentHtml = html.substring(contentStart, contentEnd)
      const { images: sectionImages, cleanHtml: sectionClean } = extractImagesFromHtml(contentHtml)

      // For special sections (产业验证, 创新技术, etc.), split by H3 sub-headings
      if (shouldSplitSectionByItems(current.text)) {
        const h3Subs = extractH3SubSections(current.text, sectionClean)
        if (h3Subs.length > 0) {
          // Distribute images to the preamble sub-section (first one with parent heading)
          if (sectionImages.length > 0 && h3Subs.length > 0) {
            const preambleSub = h3Subs.find(s => s.heading === current.text)
            if (preambleSub) {
              preambleSub.images = [...(preambleSub.images || []), ...sectionImages]
            } else {
              h3Subs[0].images = [...(h3Subs[0].images || []), ...sectionImages]
            }
          }
          sections.push(...h3Subs)
          continue
        }
      }

      sections.push({
        heading: current.text || `章节 ${i + 1}`,
        headingLevel: 2,
        content: htmlToText(sectionClean),
        tables: extractTables(sectionClean),
        images: sectionImages,
      })
    }
    return sections
  }

  const preamble = html.substring(0, matches[0].index)
  const { images: preambleImages, cleanHtml: preambleClean } = extractImagesFromHtml(preamble)
  const preambleText = htmlToText(preambleClean)
  if (preambleText.trim().length > 20) {
    sections.push({
      heading: '引言',
      headingLevel: 1,
      content: preambleText,
      tables: extractTables(preambleClean),
      images: preambleImages,
    })
  }

  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i]
    if (isMetadataSection(current.text)) continue

    const contentStart = current.index + current.fullLength
    const contentEnd = i + 1 < matches.length ? matches[i + 1].index : html.length
    const contentHtml = html.substring(contentStart, contentEnd)
    const { images: secImages, cleanHtml: secClean } = extractImagesFromHtml(contentHtml)
    const contentText = htmlToText(secClean)
    if (contentText.trim().length > 0 || current.text.trim().length > 0) {
      sections.push({
        heading: current.text,
        headingLevel: current.level,
        content: contentText,
        tables: extractTables(secClean),
        images: secImages,
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
          // Preamble items have empty title → use section heading directly
          const heading = item.title
            ? `${section.heading} - ${item.title}`
            : section.heading
          chunks.push({
            id: `chunk-${order}`,
            heading,
            headingLevel: section.headingLevel,
            content: item.content,
            images: section.images?.length > 0 ? section.images : undefined,
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
      images: section.images?.length > 0 ? section.images : undefined,
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

  // Content before the first H3 (preamble / intro of the H2 section)
  const preambleHtml = contentHtml.substring(0, h3Matches[0].index)
  let preambleText = htmlToText(preambleHtml)

  // Content after the last H3 (trailing summary of the H2 section)
  // Merge it into the preamble so front intro + back summary = 1 overview page
  const lastH3 = h3Matches[h3Matches.length - 1]
  const lastH3ContentStart = lastH3.index + lastH3.fullLength
  const lastH3FullHtml = contentHtml.substring(lastH3ContentStart)
  const lastH3FullText = htmlToText(lastH3FullHtml)

  // Detect trailing summary: check if there's a paragraph break after the H3 content
  // that looks like a standalone summary (not part of the H3's structured content)
  const trailingSplit = lastH3FullText.split(/\n{2,}/)
  let lastH3CleanText = lastH3FullText
  let trailingSummary = ''
  if (trailingSplit.length >= 2) {
    const lastParagraph = trailingSplit[trailingSplit.length - 1].trim()
    // If the last paragraph doesn't start with a structured marker (bold key, bullet, etc.)
    // and is reasonably long, treat it as a trailing summary
    if (
      lastParagraph.length > 30 &&
      !/^(\*\*|[-*•]|[0-9]+[.)、])/.test(lastParagraph)
    ) {
      trailingSummary = lastParagraph
      lastH3CleanText = trailingSplit.slice(0, -1).join('\n\n')
    }
  }

  if (trailingSummary) {
    preambleText = preambleText.trim()
      ? `${preambleText.trim()}\n\n${trailingSummary}`
      : trailingSummary
  }

  if (preambleText.trim().length > 10) {
    results.push({
      heading: h2Heading,
      // Use headingLevel 1 to prevent buildChunks from re-splitting via
      // shouldSplitSectionByItems (which only triggers on headingLevel === 2).
      headingLevel: 1,
      content: preambleText,
      tables: extractTables(preambleHtml),
      images: [],
    })
  }

  // Each H3 becomes an independent section
  for (let j = 0; j < h3Matches.length; j++) {
    const h3 = h3Matches[j]
    const h3ContentStart = h3.index + h3.fullLength
    const isLast = j === h3Matches.length - 1
    const h3ContentEnd = isLast ? contentHtml.length : h3Matches[j + 1].index
    const h3ContentHtml = contentHtml.substring(h3ContentStart, h3ContentEnd)

    const cleanText = h3.text.replace(/^[0-9]+[、.，\s]+/, '')
    results.push({
      heading: `${h2Heading} - ${cleanText}`,
      headingLevel: 3,
      // For the last H3, use the cleaned text without trailing summary
      content: isLast && trailingSummary ? lastH3CleanText : htmlToText(h3ContentHtml),
      tables: extractTables(h3ContentHtml),
      images: [],
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

  const bulletRegex = /^([-*•]|#{1,3}|[0-9]+[.)、]|[A-Za-z][.)]|[（(][0-9]+[)）])\s*(.+)$/
  const items: Array<{ title: string; content: string }> = []
  let current: string[] = []
  let firstBulletSeen = false

  const flushBulletItem = () => {
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
      if (!firstBulletSeen) {
        // Text accumulated before the first bullet is preamble (intro paragraph).
        // Save it as a special item with empty title so buildChunks uses
        // just the H2 heading, avoiding absurdly long titles.
        if (current.length > 0) {
          const preambleText = current.join('\n')
          if (preambleText.length > 20) {
            items.push({ title: '', content: preambleText })
          }
        }
        current = []
        firstBulletSeen = true
      } else {
        flushBulletItem()
      }
      current.push(bulletMatch[2].trim())
      continue
    }
    current.push(line)
  }
  flushBulletItem()

  // Count real bullet items (excluding preamble with empty title)
  const bulletItemCount = items.filter((item) => item.title !== '').length
  if (bulletItemCount < 2) {
    // Not enough structured items to warrant splitting.
    // Let the section stay as one chunk.
    return []
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

