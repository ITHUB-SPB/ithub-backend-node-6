FROM node:26-slim

ENV NODE_ENVIRONMENT=production
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run db:generate

RUN npm run build