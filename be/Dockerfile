FROM node:alpine

WORKDIR /usr/src/app

RUN npm i -g pnpm


COPY package*.json .

RUN pnpm install

RUN pnpm add @prisma/cli

COPY . .

RUN pnpm dlx prisma generate


EXPOSE 8080

CMD ["pnpm","start"]


