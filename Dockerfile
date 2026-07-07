# syntax=docker/dockerfile:1.7

# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build
COPY . .
RUN npm run build

# ---- Runtime Stage ----
FROM nginx:1.27-alpine

# OCI image metadata
LABEL org.opencontainers.image.source="https://github.com/rothgar/timesync" \
      org.opencontainers.image.description="Timesync global timezone coordinator"

# Install curl for the HEALTHCHECK (not present by default in nginx:alpine)
RUN apk add --no-cache curl

# Ensure runtime directories are writable by the non-root nginx user
RUN mkdir -p /var/lib/nginx /var/cache/nginx /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/lib/nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

# Remove the stock default site (it listens on port 80) and replace with our config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy built static assets and our site configuration
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -fsS http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
