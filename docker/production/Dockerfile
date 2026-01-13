# syntax=docker/dockerfile:1.7

########## Stage 1: PHP vendor (cached)
FROM php:8.4-cli-alpine AS vendor
RUN apk add --no-cache unzip
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/tmp/composer \
    composer install \
      --no-dev --prefer-dist --no-interaction --no-progress \
      --optimize-autoloader \
      --no-scripts

########## Stage 2: Frontend build (Vite/Tailwind)
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
# Add these 4 lines after line 16
ARG VITE_PUSHER_APP_KEY
ARG VITE_PUSHER_APP_CLUSTER
ENV VITE_PUSHER_APP_KEY=$VITE_PUSHER_APP_KEY
ENV VITE_PUSHER_APP_CLUSTER=$VITE_PUSHER_APP_CLUSTER
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build && npm prune --production

########## Stage 3: Runtime (ServersideUp = Nginx + PHP-FPM ready)
# (Keep amd64 in CI only)
FROM serversideup/php:8.4-fpm-nginx

WORKDIR /var/www/html

# Copy app code first, then vendor and built assets
COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

# Ensure views dir exists and fix ownership/permissions
USER root

# 🔴 IMPORTANT: clear Laravel caches that may reference dev-only packages (like Pail)
RUN rm -f bootstrap/cache/packages.php \
       bootstrap/cache/services.php \
       bootstrap/cache/config.php || true
       
RUN mkdir -p resources/views \
 && mkdir -p storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache \
 && chown -R www-data:www-data resources storage bootstrap/cache vendor public \
 && chmod -R 775 storage bootstrap/cache \
 && chmod -R 755 vendor public

# Create a script to clear bootstrap cache at runtime (before Laravel automations run)
# This runs before the serversideup entrypoint executes Laravel automations
# The script clears cached package discovery files that may reference dev-only packages
RUN echo '#!/bin/sh' > /usr/local/bin/clear-laravel-cache.sh && \
    echo 'echo "Clearing Laravel bootstrap cache to remove dev package references..."' >> /usr/local/bin/clear-laravel-cache.sh && \
    echo 'rm -f /var/www/html/bootstrap/cache/packages.php 2>/dev/null || true' >> /usr/local/bin/clear-laravel-cache.sh && \
    echo 'rm -f /var/www/html/bootstrap/cache/services.php 2>/dev/null || true' >> /usr/local/bin/clear-laravel-cache.sh && \
    echo 'rm -f /var/www/html/bootstrap/cache/config.php 2>/dev/null || true' >> /usr/local/bin/clear-laravel-cache.sh && \
    echo 'echo "Bootstrap cache cleared successfully"' >> /usr/local/bin/clear-laravel-cache.sh && \
    chmod +x /usr/local/bin/clear-laravel-cache.sh

# Install composer in runtime stage (needed for package discovery)
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Rebuild autoload AFTER app code is present (runs package:discover, etc.)
# This ensures autoload files don't reference dev dependencies
RUN composer dump-autoload -o --no-dev || true

USER www-data
EXPOSE 8080