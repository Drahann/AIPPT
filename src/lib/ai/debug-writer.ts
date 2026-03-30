import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

type DebugEntry = {
  ts: string
  stage: string
  payload: unknown
}

export class DebugSession {
  readonly id: string
  readonly enabled: boolean
  readonly entries: DebugEntry[] = []

  constructor(enabled: boolean) {
    this.enabled = enabled
    this.id = `dbg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }

  log(stage: string, payload: unknown) {
    if (!this.enabled) return
    this.entries.push({
      ts: new Date().toISOString(),
      stage,
      payload,
    })
  }

  async flush(extra?: Record<string, unknown>): Promise<string | null> {
    if (!this.enabled) return null
    // Create a subfolder with the session ID to keep dbg-*.json and snapshots together
    const sessionDir = path.join(process.cwd(), 'debug-data', this.id)
    await mkdir(sessionDir, { recursive: true })
    const filePath = path.join(sessionDir, `manifest.json`) // Or rename to main dbg info
    const data = {
      id: this.id,
      createdAt: new Date().toISOString(),
      ...extra,
      entries: this.entries,
    }
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return filePath
  }
}

