# Menggunakan Node.js versi 22-slim sebagai base image
FROM node:22-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

ENV KunciRumah=APALAH-ITU-KUNCI-RUMAH
ENV URL_MODEL=MODEL-RUMAH
ENV URL_DB=DRAGON-BALL
ENV projectId=FREE-CAPSTONE

EXPOSE 5000
CMD ["npm", "start"]