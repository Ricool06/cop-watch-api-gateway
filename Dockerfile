FROM node:lts-alpine as builder
COPY package.json package-lock.json ./
RUN npm ci --only=production && mkdir /app && mv ./node_modules ./app
WORKDIR /app
COPY . .
EXPOSE 9091 9090 8080
ENTRYPOINT ["npm", "run", "start"]
