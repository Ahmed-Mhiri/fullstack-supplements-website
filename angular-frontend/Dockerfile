FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production
FROM nginx:stable-alpine
COPY --from=build /app/dist/primebox/browser /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf