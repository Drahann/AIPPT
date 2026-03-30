# AIPPT — 智能演示文稿生成

上传 Word 文档，AI 自动生成大纲、布局和配图。

## API 密钥配置

1. 在项目根目录找到 **`.env.local`**（没有则复制 `.env.example` 并重命名为 `.env.local`）。

2. 填写以下变量：

| 变量 | 说明 | 示例 |
|------|------|------|
| **LLM_API_KEY** | 大模型 API Key（用于大纲 + 内容生成） | DeepSeek / OpenAI / 通义 / 智谱 等 |
| **LLM_BASE_URL** | 大模型 API 地址（OpenAI 兼容格式） | `https://api.deepseek.com` |
| **LLM_MODEL** | 模型名称 | `deepseek-chat`、`gpt-4o` 等 |
| **IMAGE_API_KEY** | 图片生成 API Key | OpenAI 或兼容 DALL-E 的服务 |
| **IMAGE_BASE_URL** | 图片 API 地址 | `https://api.openai.com/v1` |
| **IMAGE_MODEL** | 图片模型 | `dall-e-3` |

3. 保存后**重启开发服务器**（`npm run dev`），配置才会生效。

**注意**：`.env.local` 已在 `.gitignore` 中，不会被提交到 Git，可放心填写密钥。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
