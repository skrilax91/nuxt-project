FROM node:18.13.0-alpine

WORKDIR /app

RUN npm install -g @localazy/cli

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

RUN localazy download

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]