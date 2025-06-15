# File: angular-frontend/Dockerfile
# Action: CORRECTED

# --- Stage 1: Build the Angular application ---
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Use the production configuration for the build
RUN npm run build -- --configuration production

# --- Stage 2: Serve the application with Nginx ---
FROM nginx:stable-alpine

# Copy the built Angular app to Nginx's web root
# The path /app/dist/primebox/browser should match your angular.json output path
COPY --from=build /app/dist/primebox/browser /usr/share/nginx/html

# Copy a dedicated Nginx config file instead of using shell commands
# This config ensures that all routes are directed to index.html for a Single Page Application (SPA)
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

# Expose Nginx's default port
EXPOSE 80