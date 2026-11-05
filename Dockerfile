FROM node:26-slim AS build
ENV NODE_ENVIRONMENT=production
WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
RUN npm ci

COPY . /app/
RUN npm run db:generate
RUN npm run build

FROM dhi.io/node:26-alpine
ENV NODE_ENVIRONMENT=production
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/ ./dist
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/.env.development ./.env.production

CMD ["node", "/app/dist/src/main.js"]