FROM node:20-alpine3.21 as build-stage
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM caddy:2.4.6-alpine as caddy-stage

EXPOSE 2015
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build-stage /frontend/dist /srv