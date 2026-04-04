/**
 * 上传成功后，通知业务后端。
 * 仿照 server/image2.png 中 notify_report_server() 的 payload 结构。
 */
export async function notifyReportServer(
  reportId: string,
  fileUrl: string,
  pptUrl: string
): Promise<{ success: boolean; error?: string }> {
  const callbackUrl = process.env.REPORT_CALLBACK_URL
  if (!callbackUrl) {
    console.warn('[Callback] REPORT_CALLBACK_URL not configured, skipping')
    return { success: false, error: 'REPORT_CALLBACK_URL not configured' }
  }

  // 回调侧要求 fileUrl 不带域名，统一转换为相对路径
  const normalizeToRelative = (url: string) => {
    if (!url) return ''
    try {
      const parsed = new URL(url)
      if (parsed.protocol && parsed.hostname) {
        return parsed.pathname.replace(/^\//, '')
      }
    } catch {
      // not a full URL, treat as relative
    }
    return url.replace(/^\//, '')
  }

  const payload = {
    success: 'success',
    msg: '报告上传成功',
    data: {
      reportId,
      fileUrl: normalizeToRelative(fileUrl),
      pptUrl: normalizeToRelative(pptUrl),
    },
  }

  try {
    const response = await fetch(callbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    })

    if (!response.ok) {
      throw new Error(`Callback responded with ${response.status}`)
    }

    const result = await response.json()
    console.log('[Callback] Success:', JSON.stringify(result))
    return { success: true }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[Callback] Failed:', msg)
    return { success: false, error: msg }
  }
}
