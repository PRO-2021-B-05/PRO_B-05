FROM node:15.12.0-alpine

RUN apk update && apk add build-base git python

COPY package.json .
COPY yarn.lock .
COPY ./dist ./dist
COPY ./views ./views
COPY ./public ./public

RUN yarn install --production

EXPOSE 8081
ENV PORT 8081
ENV NODE_ENV production

CMD ["yarn", "start:prod"]
