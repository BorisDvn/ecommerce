# Stage 1
FROM node:16 AS builder
WORKDIR /app
RUN  npm install -g @angular/cli
COPY ./package.json .
RUN  npm install
COPY . .
RUN ng build

# Stage 2
FROM nginx as runtime
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
