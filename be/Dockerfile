FROM node:alpine

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package*.json .
COPY pnpm-lock.yaml .

RUN pnpm install

RUN pnpm add prisma --save-dev

COPY . .

RUN pnpx prisma generate

EXPOSE 8080

CMD ["pnpm","start"]


