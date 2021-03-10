FROM node:10.12.0-alpine

WORKDIR /usr/app
COPY . .
RUN npm install