# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:current-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install

# Copy source and build
COPY . .

# Accept the API URL at build time (overrides .env)
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=${VUE_APP_API_URL}

RUN npm run build

