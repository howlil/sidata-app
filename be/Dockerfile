FROM node:alpine

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package*.json .

RUN pnpm install

COPY . .

EXPOSE 8080

CMD ["pnpm","start"]


