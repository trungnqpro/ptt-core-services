FROM node:14-alpine as builder

RUN apk update \
    && apk add --no-cache python3 \
    g++ \
    build-base

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

RUN yarn install \
    && yarn global add pm2 \
    && mkdir /node/upload \
    && chown -R node:node /node

COPY . /app

USER node
EXPOSE 3000

CMD ["pm2-docker", "start", "process.config.js", "--no-auto-exit"]
