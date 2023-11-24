FROM node:16.20.0-alpine3.18

ENV NPM_CONFIG_CACHE /tmp/npm
RUN mkdir -p /tmp/npm \
    && chmod -R 777 /tmp/npm

RUN mkdir -p /logs \
    && chmod 755 /logs

WORKDIR /opt/app-root/src
RUN ln -s /logs .

COPY package*.json ./
RUN npm ci

COPY . /opt/app-root/src

EXPOSE 443 8080
CMD ["npm", "start"]