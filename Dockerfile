FROM node:latest

ENV NODE_ENVIRONMENT=production
WORKDIR /app

COPY . .

RUN npm i

RUN npm run db:generate
# RUN npm run db:migrate

RUN npm run build

CMD ["npm", "run", "start"]