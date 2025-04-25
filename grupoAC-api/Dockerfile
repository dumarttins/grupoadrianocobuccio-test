FROM php:8.2-fpm

# Instalar dependências
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libzip-dev \
    libonig-dev

# Limpar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl
RUN docker-php-ext-install gd

# Obter e instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /var/www

# Copiar código-fonte da aplicação
COPY . /var/www

# Configurar permissões para o diretório de armazenamento
RUN chmod -R 775 /var/www/storage

# Expor porta 9000 para o servidor PHP-FPM
EXPOSE 9000

# Iniciar o servidor PHP-FPM
CMD ["php-fpm"]