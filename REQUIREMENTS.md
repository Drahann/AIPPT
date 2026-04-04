# AIPPT — 环境与依赖要求

## 运行环境

| 项目 | 最低版本 | 推荐版本 |
|-----|---------|---------|
| Node.js | 18.x | 20.x+ |
| npm | 9.x | 10.x+ |
| 内存 | 2 GB | 4 GB+ |
| 操作系统 | Windows / macOS / Linux | — |

---

## 生产依赖 (dependencies)

| 包名 | 版本 | 用途 |
|------|------|------|
| `next` | ^16.1.6 | Web 框架 (App Router + SSR) |
| `react` | ^19.2.3 | UI 渲染 |
| `react-dom` | ^19.2.3 | DOM 渲染 |
| `openai` | ^6.27.0 | LLM API 调用 (OpenAI 兼容格式) |
| `mammoth` | ^1.11.0 | DOCX 文件解析为 HTML |
| `pptxgenjs` | ^4.0.1 | PPTX 文件生成与导出 |
| `zustand` | ^5.0.11 | 全局状态管理 (localStorage 持久化) |
| `canvas` | ^3.2.2 | Node.js Canvas 实现 (服务端文字测量) |
| `framer-motion` | ^12.35.2 | 页面/幻灯片切换动画 |
| `lucide-react` | ^0.577.0 | 图标库 |
| `uuid` | ^13.0.0 | 唯一 ID 生成 |
| `@chenglou/pretext` | ^0.0.3 | 文字排版测量引擎 |
| `@tiptap/react` | ^3.20.1 | 富文本编辑器核心 |
| `@tiptap/starter-kit` | ^3.20.1 | Tiptap 基础扩展合集 |
| `@tiptap/pm` | ^3.20.1 | ProseMirror 底层适配 |
| `@tiptap/extension-color` | ^3.20.1 | 文字颜色扩展 |
| `@tiptap/extension-text-style` | ^3.20.1 | 文字样式扩展 |
| `@tiptap/extension-text-align` | ^3.20.1 | 文字对齐扩展 |
| `@tiptap/extension-underline` | ^3.20.1 | 下划线扩展 |
| `@tiptap/extension-image` | ^3.20.1 | 图片插入扩展 |
| `@tiptap/extension-placeholder` | ^3.20.1 | 占位文字扩展 |
| `@tiptap/extension-dropcursor` | ^3.20.1 | 拖拽光标扩展 |

---

## 开发依赖 (devDependencies)

| 包名 | 版本 | 用途 |
|------|------|------|
| `typescript` | ^5 | TypeScript 编译 |
| `tailwindcss` | ^4 | CSS 工具类框架 |
| `@tailwindcss/postcss` | ^4 | TailwindCSS PostCSS 插件 |
| `eslint` | ^9 | 代码静态检查 |
| `eslint-config-next` | ^16.1.6 | Next.js ESLint 规则 |
| `playwright` | ^1.58.2 | 端到端测试 / 浏览器自动化 |
| `@types/node` | ^20 | Node.js 类型定义 |
| `@types/react` | ^19 | React 类型定义 |
| `@types/react-dom` | ^19 | React DOM 类型定义 |
| `@types/uuid` | ^10.0.0 | uuid 类型定义 |

---

## 环境变量 (.env.local)

| 变量名 | 必填 | 说明 | 示例 |
|-------|------|------|------|
| `LLM_API_KEY` | ✅ | LLM API Key，多 Key 用逗号分隔 | `sk-xxx,sk-yyy` |
| `LLM_BASE_URL` | ✅ | LLM API 地址 (OpenAI 兼容) | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `LLM_MODEL` | ❌ | 模型名，默认 `qwen3-max` | `qwen3-max` |
| `IMAGE_API_KEY` | ❌ | 图片生成 API Key | `sk-xxx` |
| `IMAGE_BASE_URL` | ❌ | 图片 API 地址 | `https://api.openai.com/v1` |
| `IMAGE_MODEL` | ❌ | 图片模型 | `dall-e-3` |

---

## 外部服务依赖

| 服务 | 协议 | 用途 |
|-----|------|------|
| LLM API (Qwen / DeepSeek / OpenAI 等) | HTTPS, OpenAI Chat Completions 兼容 | 大纲生成、逐页内容生成、AI Agent 对话 |
| 图片生成 API (可选) | HTTPS, DALL-E 兼容 | AI 配图生成 |

---

## 快速安装

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入 API Key

# 3. 启动开发服务器
npm run dev
```

> ⚠️ `canvas` 包需要系统级编译环境。Windows 上通常自动安装预编译二进制；Linux 上可能需要 `sudo apt install build-essential libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev`。
