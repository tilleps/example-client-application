# syntax=docker/dockerfile:1

#
# STAGE: build
#
FROM node:18-alpine as build
RUN npm install pm2 -g

WORKDIR /var/opt
COPY --chown=node:node package*.json .
RUN npm install --production

#
# STAGE: Test
#
FROM build as test

#
# STAGE: Runner
#
FROM build as runner

# Allow the git commit to be passed in
ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

WORKDIR /var/opt
COPY --from=build /var/opt/node_modules/ node_modules/
COPY lib lib/
COPY --chown=node:node config.mjs index.mjs package.json README.md .
USER node
CMD ["pm2-runtime", "--raw", "--instances", "1", "--name", "app", "--no-autorestart", "start", "index.mjs"]
