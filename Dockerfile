FROM node:latest

WORKDIR /app

COPY . .

RUN npm i

RUN npm run db:generate
# RUN npm run db:migrate

# RUN npm run dev
CMD ["npm", "run", "dev"]