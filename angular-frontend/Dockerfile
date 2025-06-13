# --- Stage 1: Build the Angular application ---
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This runs the build using your now-corrected angular.json
RUN npm run build

# --- Stage 2: Serve the application with Nginx ---
FROM nginx:stable-alpine

# Copy the compiled application from the correct build path
COPY --from=build /app/dist/primebox/browser /usr/share/nginx/html

# Programmatically create the Nginx config to guarantee correct formatting
RUN printf 'server {\n' > /etc/nginx/conf.d/default.conf && \
    printf '\tlisten 80;\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\troot /usr/share/nginx/html;\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\tindex index.html;\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\tlocation / {\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\t\ttry_files $uri /index.html;\n' >> /etc/nginx/conf.d/default.conf && \
    printf '\t}\n' >> /etc/nginx/conf.d/default.conf && \
    printf '}\n' >> /etc/nginx/conf.d/default.conf

# Expose Nginx's port
EXPOSE 80