# Stage 1: Build dependencies
FROM node:22-slim AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY /src .

# Stage 2: Run with Distroless
FROM gcr.io/distroless/nodejs22

WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app

# Set env
ENV HOST=0.0.0.0
ENV PORT=3000

ENV URL_MODEL=http:\\ml-container:5000

EXPOSE 3000
CMD ["server.js"]