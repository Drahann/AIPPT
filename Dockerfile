# ============================================================
# AIPPT API 版 Docker 镜像
# 包含：Next.js + Playwright Chromium + canvas 原生模块
# ============================================================

# --- Stage 1: 安装依赖 ---
FROM node:20-slim AS deps

WORKDIR /app

# 安装 canvas 原生模块所需的系统库
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci
# 安装 canvas（universal-exporter 需要）
RUN npm install canvas

# --- Stage 2: 构建 ---
FROM node:20-slim AS builder

WORKDIR /app

# 复制系统库（canvas 运行时需要）
COPY --from=deps /usr/lib/ /usr/lib/
COPY --from=deps /usr/include/ /usr/include/

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建 Next.js（standalone 模式，产物更小）
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Stage 3: 运行时 ---
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# 安装 canvas + Playwright 运行时所需的系统库
RUN apt-get update && apt-get install -y --no-install-recommends \
    # canvas 运行时
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    # Playwright Chromium 运行时
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangoft2-1.0-0 \
    libwayland-client0 \
    # 中文字体（PPT 导出需要）
    fonts-wqy-zenhei \
    fonts-wqy-microhei \
    && rm -rf /var/lib/apt/lists/*

# 先安装 Playwright Chromium（放在 COPY 之前以利用缓存）
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
RUN npx playwright install chromium

# 创建 tmp 目录
RUN mkdir -p tmp/render-data

# 再复制构建产物（代码变动只影响这里之后的层）
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
