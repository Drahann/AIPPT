/**
 * Themes Registry — 所有主题的注册入口
 */

import { registerTheme } from '../theme-registry'
import { commonTheme } from './common'
import { pastelPapercut } from './pastel-papercut'
import { curveStudy } from './curve-study'

/** 注册所有可用主题到 registry */
export function initThemes(): void {
  // 公共模板库必须第一个注册（其他主题可能依赖它做 fallback）
  registerTheme(commonTheme)
  registerTheme(pastelPapercut)
  registerTheme(curveStudy)
}

// 自动执行注册
initThemes()
