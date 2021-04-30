###############################################################################
###############################################################################
##                      _______ _____ ______ _____                           ##
##                     |__   __/ ____|  ____|  __ \                          ##
##                        | | | (___ | |__  | |  | |                         ##
##                        | |  \___ \|  __| | |  | |                         ##
##                        | |  ____) | |____| |__| |                         ##
##                        |_| |_____/|______|_____/                          ##
##                                                                           ##
## description     : Dockerfile for TsED Application                         ##
## author          : TsED team                                               ##
## date            : 20190820                                                ##
## version         : 1.0                                                     ##
###############################################################################
###############################################################################
FROM node:12.13.0-alpine

RUN apk update && apk add build-base git python

COPY package.json .
COPY yarn.lock .
COPY ./dist ./dist
COPY ./resources ./resources
COPY ./spec ./spec
RUN yarn install --production

EXPOSE 8081
ENV PORT 8081
ENV NODE_ENV production
ENV DATABASE_HOST studimax-cloud.ch
ENV DATABASE_PORT 3308
ENV DATABASE_USER root
ENV DATABASE_PASSWORD itK9@EqtT!3E6m@r
ENV DATABASE_DB project
ENV DATABASE_LOGIN true
ENV S3_ACCESS_KEY stArt
ENV S3_SECRET_KEY 6sY5$MayTG6?5$f$

CMD ["yarn", "start:prod"]
