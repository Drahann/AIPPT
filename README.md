# AIPPT — AI 驱动的智能演示文稿生成引擎

上传 Word / Markdown 文档，AI 自动解析文档结构、生成大纲、编排 30+ 种专业布局，输出可编辑的高质量 PPTX 演示文稿。

## ✨ 核心特性

- **智能文档解析** — 支持 DOCX / Markdown / TXT，自动识别章节层级
- **AI 大纲编排** — LLM 驱动的幻灯片结构规划，自动匹配最佳布局类型
- **30+ 种布局模板** — 覆盖封面、文字、图表、卡片、对比、时间轴、指标、引用等
- **10 组主题配色** — group-01 ~ group-10，一键切换配色方案
- **智能排版引擎** — 基于 Pretext 的内容感知字体缩放与字符预算系统
- **高质量 PPTX 导出** — DOM 快照驱动，所见即所得
- **在线编辑** — TipTap 富文本编辑器，支持逐页内容修改

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI | React 19 + Zustand 5 |
| AI | OpenAI SDK（兼容 Qwen / DeepSeek / 智谱等） |
| 文档解析 | Mammoth (DOCX) + Markdown 原生支持 |
| PPTX 导出 | PptxGenJS 4 + DOM 快照 |
| 排版引擎 | @chenglou/pretext |
| 编辑器 | TipTap 3 |

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx                    # 首页（文档上传 + 主题选择）
│   ├── generate/page.tsx           # 生成进度页
│   ├── editor/page.tsx             # 在线编辑页
│   ├── render/page.tsx             # 内部渲染页（API版，供 Playwright 使用）
│   └── api/
│       ├── generate/route.ts       # 前端版生成接口（SSE）
│       ├── export/route.ts         # PPTX 导出接口
│       ├── report-to-ppt/route.ts  # ⭐ API 版入口（Markdown → PPT → COS → 回调）
│       └── render-data/route.ts    # 临时数据服务（API版内部使用）
├── components/slides/
│   ├── SlideRenderer.tsx           # 幻灯片渲染器
│   └── layouts/                    # 26 种布局组件
├── lib/
│   ├── ai/
│   │   ├── pipeline.ts             # 生成管线（解析 → 大纲 → 内容 → 排版）
│   │   ├── outline.ts              # LLM 大纲生成
│   │   ├── slide-gen.ts            # LLM 逐页内容生成
│   │   └── llm.ts                  # LLM 调用（多 Key 负载均衡 + 重试）
│   ├── export/
│   │   └── universal-exporter.ts   # PPTX 导出器（DOM 快照 → PptxGenJS）
│   ├── parser/
│   │   └── docx-parser.ts          # 文档解析（DOCX / Markdown）
│   ├── server/                     # ⭐ API 版服务模块
│   │   ├── cos-upload.ts           # 腾讯云 COS 上传
│   │   ├── callback.ts             # 回调通知
│   │   ├── image-downloader.ts     # MD 外部图片下载
│   │   └── snapshot-renderer.ts    # Playwright 快照采集
│   ├── templates/                  # 10 组主题配色包
│   └── utils/
│       ├── pretext-engine.ts       # 排版测量引擎
│       └── layout-snapshot.ts      # DOM 快照采集工具
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入 LLM API 密钥：

| 变量 | 说明 | 示例 |
|------|------|------|
| `LLM_API_KEY` | 大模型 API Key | DeepSeek / Qwen / OpenAI |
| `LLM_BASE_URL` | API 地址（OpenAI 兼容） | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `LLM_MODEL` | 模型名称 | `qwen3-max` |

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)，上传文档即可生成 PPT。

---

## 🐳 Docker 部署（API 版推荐）

### 方式一：Docker Compose（推荐）

```bash
# 1. 切到 api-integration 分支
git checkout api-integration

# 2. 创建 .env.local（填入密钥配置）
cp .env.example .env.local
# 编辑 .env.local 填入 LLM_API_KEY、COS_SECRET_ID 等

# 3. 一键构建并启动
docker compose up -d --build

# 4. 查看日志
docker compose logs -f
```

### 方式二：手动 Docker 构建

```bash
# 构建镜像（约 5-10 分钟）
docker build -t aippt-api .

# 运行容器
docker run -d \
  --name aippt-api \
  -p 3000:3000 \
  --env-file .env.local \
  --memory=4g \
  aippt-api
```

### 测试接口

```bash
curl -X POST http://localhost:3000/api/report-to-ppt \
  -H "Content-Type: application/json" \
  -d '{"reportId":"test-001","content":"# 测试\n\n## 概述\n\n测试内容"}'
```

> **注意**：首次构建需下载 Playwright Chromium（~200MB），镜像总大小约 **1.5GB**。服务器需至少 **2GB RAM**。

---

## 🔀 分支说明

| 分支 | 说明 |
|------|------|
| `main` | **前端版** — 通过浏览器上传文档，在线预览和编辑，手动导出 PPTX |
| `api-integration` | **接口版** — 提供服务端 API，接收 Markdown → 自动生成 PPT → 上传 COS → 回调通知 |

---

## 📡 API 版使用指南（`api-integration` 分支）

### 额外配置

在 `.env.local` 中补充以下变量：

| 变量 | 说明 |
|------|------|
| `COS_SECRET_ID` | 腾讯云 COS SecretId |
| `COS_SECRET_KEY` | 腾讯云 COS SecretKey |
| `COS_REGION` | COS 地域（如 `ap-shanghai`） |
| `COS_BUCKET` | COS Bucket 名称 |
| `REPORT_CALLBACK_URL` | 生成完成后的回调 URL |

此外需要安装 Playwright 浏览器：

```bash
npx playwright install chromium
```

### API 端点

```
POST /api/report-to-ppt
Content-Type: application/json
```

**请求体：**

```json
{
  "reportId": "report-001",
  "content": "# 报告标题\n\n## 第一章\n\n内容...",
  "fileUrl": "upload/xxx/report.docx",
  "themeId": "group-01"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `reportId` | ✅ | 报告 ID，用于 COS 路径和回调 |
| `content` | ✅ | Markdown 格式的报告内容 |
| `fileUrl` | ❌ | 报告原文 URL（随回调传递） |
| `themeId` | ❌ | 主题包 ID，默认 `group-01` |

**响应：**

```json
{
  "success": true,
  "reportId": "report-001",
  "pptUrl": "ppt/report-001/报告标题.pptx",
  "slideCount": 12,
  "title": "报告标题",
  "callback": { "success": true }
}
```

### 工作流程

```
报告服务 POST Markdown
  → 下载 MD 中的 COS 图片
  → AI Pipeline 生成 Presentation
  → Playwright 无头渲染 + DOM 快照
  → universal-exporter 生成 PPTX
  → 上传到腾讯云 COS
  → 回调通知业务后端
```

---

## 📐 支持的布局类型

| 类别 | 布局 |
|------|------|
| 结构 | `cover`, `section-header`, `ending` |
| 文字 | `text-bullets`, `text-center` |
| 图文 | `image-text`, `text-image`, `image-center`, `image-full` |
| 卡片 | `cards-2`, `cards-3`, `cards-4`, `cards-split`, `cards-3-stack`, `cards-3-featured`, `cards-4-featured` |
| 特色 | `list-featured`, `staggered-cards`, `features-list-image`, `grid-2x2-featured` |
| 数据 | `metrics`, `metrics-rings`, `chart-bar`, `chart-line`, `chart-pie`, `chart-bar-compare` |
| 时间 | `timeline`, `milestone-list` |
| 引用 | `quote`, `quote-no-avatar` |
| 对比 | `comparison` |
| 团队 | `team-members` |
