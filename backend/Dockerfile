# Base image
FROM php:8.2-fpm

# Set working directory
WORKDIR /app/backend

# Install system dependencies
RUN apt-get update -y && apt-get install -y \
    openssl \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libzip-dev

ENV COMPOSER_ALLOW_SUPERUSER=1

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install PHP extensions
RUN docker-php-ext-install mysqli pdo_mysql

# Copy Laravel project files
COPY . .

# Install project dependencies
COPY .env.example .env

# Set directory permissions
RUN chown -R www-data:www-data /app/backend/storage /app/backend/bootstrap/cache


# Expose port
EXPOSE 8000

CMD bash -c "composer install && php artisan migrate --force && php artisan passport:install && php artisan serve --host 0.0.0.0"