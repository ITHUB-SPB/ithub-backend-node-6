FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p /app/storage/logs
RUN NODE_ENV=production \
    PORT=8000 \
    LOG_LEVEL=info \
    LOG_RETENTION=30d \
    ALLOWED_ORIGINS=localhost \
    MAIL_HOST=localhost \
    MAIL_PORT=1025 \
    MAIL_SECURE=false \
    MAIL_FROM=build@example.com \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=build-only-password \
    POSTGRES_DB=auth \
    POSTGRES_HOST=localhost \
    POSTGRES_PORT=5432 \
    REDIS_HOST=localhost \
    REDIS_PORT=6379 \
    JWT_SECRET=build-only-jwt-secret \
    JWT_EXPIRES_IN=6h \
    JWT_REFRESH_SECRET=build-only-refresh-secret \
    JWT_REFRESH_EXPIRES_IN=7d \
    ./node_modules/.bin/prisma generate \
    && npm run build \
    && npm prune --omit=dev

FROM dhi.io/node:24-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=8000
WORKDIR /app

COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/storage ./storage

USER node
EXPOSE 8000
CMD ["node", "dist/src/main.js"]
