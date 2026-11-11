FROM node:26-slim AS builder

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run db:generate

RUN npm run build


FROM dhi.io/node:26 AS production

ENV NODE_ENVIRONMENT=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

EXPOSE 3000

CMD ["node", "dist/main.js"]