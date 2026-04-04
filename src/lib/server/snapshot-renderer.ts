import { chromium, Browser, BrowserContext } from 'playwright'
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { Presentation } from '../types'

const TEMP_DIR = join(process.cwd(), 'tmp', 'render-data')

// Browser instance reuse to avoid cold-start on every request
let browserInstance: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance
  }
  browserInstance = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })
  return browserInstance
}

/**
 * 使用 Playwright 无头浏览器渲染幻灯片并采集 DOM 快照。
 *
 * 流程：
 * 1. 将 Presentation JSON 写入临时文件
 * 2. 启动 Chromium 无头浏览器
 * 3. 导航到 http://localhost:PORT/render?id=xxx
 * 4. 等待 window.__SNAPSHOTS_READY === true
 * 5. 获取 window.__SNAPSHOTS 数据
 * 6. 清理临时文件
 */
export async function captureSnapshots(
  presentation: Presentation,
  port: number = 3000
): Promise<any[]> {
  // 1. Write presentation to temp file
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true })
  }
  const tempId = randomUUID().slice(0, 12)
  const tempFile = join(TEMP_DIR, `${tempId}.json`)
  writeFileSync(tempFile, JSON.stringify(presentation), 'utf-8')
  console.log(`[Snapshot] Temp file written: ${tempId}`)

  let context: BrowserContext | null = null

  try {
    // 2. Launch browser
    const browser = await getBrowser()
    context = await browser.newContext({
      viewport: { width: 1024, height: 768 },
    })
    const page = await context.newPage()

    // 3. Navigate to render page
    const url = `http://localhost:${port}/render?id=${tempId}`
    console.log(`[Snapshot] Navigating to: ${url}`)
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    // 4. Wait for snapshots to be ready
    await page.waitForFunction(
      () => (window as any).__SNAPSHOTS_READY === true,
      { timeout: 30000 }
    )

    // 5. Extract snapshots
    const snapshots = await page.evaluate(() => (window as any).__SNAPSHOTS)
    console.log(`[Snapshot] Captured ${snapshots?.length || 0} snapshots`)

    if (!snapshots || snapshots.length === 0) {
      throw new Error('No snapshots captured')
    }

    return snapshots
  } catch (error) {
    console.error('[Snapshot] Failed:', error)
    throw error
  } finally {
    // Cleanup
    if (context) {
      await context.close().catch(() => {})
    }
    try {
      if (existsSync(tempFile)) unlinkSync(tempFile)
    } catch {}
  }
}

/**
 * Cleanup browser on process exit
 */
process.on('beforeExit', async () => {
  if (browserInstance) {
    await browserInstance.close().catch(() => {})
    browserInstance = null
  }
})
