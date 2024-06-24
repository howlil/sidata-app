# Stage 1: Build the React app
FROM node:alpine as builder

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
