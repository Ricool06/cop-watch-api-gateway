FROM node:lts-alpine as builder
COPY package.json package-lock.json ./
RUN npm ci --only=production && mkdir /app && mv ./node_modules ./app
WORKDIR /app
COPY . .
EXPOSE 9091 9090 8090
ENTRYPOINT ["npm", "run", "start"]
LABEL traefik.enable="true" \
      traefik.frontend.rule="Host:api.localhost,api.cop-watch-production-environment.egbk2sq3vn.eu-west-1.elasticbeanstalk.com" \
      traefik.port=8090
