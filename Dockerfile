# syntax=docker/dockerfile:1

FROM node:18-alpine as configure
RUN npm install pm2 -g

FROM configure as build
WORKDIR /var/opt
COPY --chown=node:node package*.json .
RUN npm install --production

FROM configure as runner
WORKDIR /var/opt
COPY --from=build /var/opt/node_modules/ node_modules/
COPY lib lib/
COPY --chown=node:node config.mjs index.mjs package.json README.md .
USER node
CMD ["pm2-runtime", "--raw", "--instances", "max", "--name", "app", "--no-autorestart", "start", "index.mjs"]
