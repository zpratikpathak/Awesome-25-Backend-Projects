FROM node:22-alpine
RUN apk add --no-cache ffmpeg && mkdir -p /media && chown node:node /media
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .
USER node
EXPOSE 3000
CMD ["npm", "start"]