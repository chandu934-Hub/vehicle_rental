# Stage 1: Build Vite React frontend
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default assets
RUN rm -rf ./*

# Copy built artifacts
COPY --from=builder /app/dist .

# Copy Nginx SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
