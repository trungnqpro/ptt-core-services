FROM node:14-alpine as builder

RUN apk update \
    && apk add --no-cache python \
    g++ \
    build-base

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production \
    && yarn global add pm2 \
    && mkdir /home/node/upload \
    && chown -R node:node /home/node

COPY . /app

USER node
EXPOSE 3000

CMD ["pm2-docker", "start", "process.config.js", "--no-auto-exit"]
