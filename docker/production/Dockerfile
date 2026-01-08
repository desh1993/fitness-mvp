# syntax=docker/dockerfile:1.7

########## Stage 1: PHP vendor (cached)
FROM composer:2.7 AS vendor
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
# RUN mkdir -p resources/views \
#  && mkdir -p storage/logs storage/framework/{cache,sessions,views} bootstrap/cache \
#  && chown -R www-data:www-data resources storage bootstrap/cache vendor public \
#  && chmod -R 775 storage bootstrap/cache \
#  && chmod -R 755 vendor public
RUN mkdir -p resources/views \
 && mkdir -p storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache \
 && chown -R www-data:www-data resources storage bootstrap/cache vendor public \
 && chmod -R 775 storage bootstrap/cache \
 && chmod -R 755 vendor public

# Rebuild autoload AFTER app code is present (runs package:discover, etc.)
#RUN composer dump-autoload -o

USER www-data
EXPOSE 8080