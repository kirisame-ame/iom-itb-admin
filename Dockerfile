# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:current-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install

# Copy source and build
COPY . .

# Accept frontend environment values at build time (overrides .env)
ARG VUE_APP_API_URL
ARG VUE_APP_API_UPLOAD
ARG VUE_APP_KEYCLOAK_URL
ARG VUE_APP_KEYCLOAK_REALM
ARG VUE_APP_KEYCLOAK_CLIENT_ID=iom-itb-admin

ENV VUE_APP_API_URL=${VUE_APP_API_URL}
ENV VUE_APP_API_UPLOAD=${VUE_APP_API_UPLOAD}
ENV VUE_APP_KEYCLOAK_URL=${VUE_APP_KEYCLOAK_URL}
ENV VUE_APP_KEYCLOAK_REALM=${VUE_APP_KEYCLOAK_REALM}
ENV VUE_APP_KEYCLOAK_CLIENT_ID=${VUE_APP_KEYCLOAK_CLIENT_ID}

RUN npm run build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

COPY --from=builder /app/dist /.static

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 6767

CMD ["nginx", "-g", "daemon off;"]