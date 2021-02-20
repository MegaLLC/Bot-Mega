FROM node:15-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache python3 py3-pip
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

FROM node:15-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache python3 py3-pip
RUN apk add ffmpeg
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
COPY beg.mp3 .
CMD npm start
