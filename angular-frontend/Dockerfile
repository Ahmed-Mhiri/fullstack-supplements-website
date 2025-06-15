# File: angular-frontend/Dockerfile

# --- Stage 1: Build the Angular application ---
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# THIS IS THE CORRECTED LINE:
# We add '-- --configuration production' to tell Angular to use environment.prod.ts
RUN npm run build -- --configuration production


# --- Stage 2: Serve the application with Nginx ---
FROM nginx:stable-alpine

# This path appears correct for your project named 'primebox'
COPY --from=build /app/dist/primebox/browser /usr/share/nginx/html

# This Nginx configuration is correct for a single-page application.
# It ensures that refreshing the browser on different routes (e.g., /products/123) works.
RUN printf 'server {\n' > /etc/nginx/conf.d/default.conf && \
    printf '\tlisten 80;\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\troot /usr/share/nginx/html;\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\tindex index.html;\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\tlocation / {\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\t\ttry_files $uri /index.html;\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\t}\n' >> /etc/nginx/conf.d/default.conf && \
    printf '}\n' >> /etc/nginx/conf.d/default.conf

# Expose Nginxs port
EXPOSE 80