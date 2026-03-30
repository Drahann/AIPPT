# AIPPT 部署指南

由于本项目基于 **Next.js** 开发，您可以根据需求选择以下两种部署方式：

## 1. 推荐方案：Vercel 部署（最简单、全自动）

Vercel 是 Next.js 官方提供的云平台，支持 GitHub 联动，只需几分钟即可完成。

### 步骤：
1. **代码推送**：将 `AIPPT` 文件夹的代码上传到您的 GitHub/GitLab 仓库。
2. **导入项目**：登录 [Vercel](https://vercel.com/)，点击 "Add New" -> "Project"，导入对应的代码库。
3. **配置环境变量**：在部署设置的 "Environment Variables" 中，**必须**添加以下 Key（直接从 `.env.local` 复制）：
    - `LLM_API_KEY` (支持多个 Key 用逗号分隔)
    - `LLM_BASE_URL`
    - `LLM_MODEL`
    - `IMAGE_API_KEY`
    - `IMAGE_BASE_URL`
    - `IMAGE_MODEL`
4. **部署配置**：项目框架会自动识别为 `Next.js`，点击 "Deploy" 即可。
5. **超时设置（重要）**：由于 AI 生成 PPT 可能超过默认的 10 秒限制，如果有权限，请在 Vercel 设置中将 `maxDuration`（Serverless Function Timeout）调大（例如 60）。

---

## 2. 传统方案：私有服务器 / Docker 部署

适合需要将数据保留在内网或私有云的情况。

### 环境要求：
- Node.js 18.x 或更高版本
- 足够运行 Next.js 编译任务的内存（推荐 2GB+）

### 部署步骤：
1. **安装依赖**：
   ```bash
   npm install
   ```
2. **编译代码**：
   ```bash
   npm run build
   ```
3. **设置生产环境变量**：
   在服务器上创建 `.env.production` 或直接设置系统环境变量（参考上方 Vercel 部分）。
4. **启动服务**：
   ```bash
   npm run start
   ```
   *建议使用 `pm2` 管理进程：`pm2 start npm --name "aippt" -- start`*

---

## 3. 注意事项
- **API 限制**：部署后，请确保服务器所在的 IP 不会被您的 API 提供商（如 DeepSeek/OpenAI）封禁。
- **静态资源**：PPTX 导出是在服务端完成的，确保服务器有足够的算力处理高并发请求。
- **反向代理**：如果使用 Nginx，请确保配置了足够大的 `proxy_read_timeout` 和 `client_max_body_size`（应对长文档解析）。
