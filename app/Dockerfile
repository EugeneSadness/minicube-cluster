FROM node:18-alpine

# Создание директории приложения
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода приложения
COPY . .

# Порт, который будет прослушиваться
EXPOSE 3000

# Переменная окружения для версии приложения
ENV APP_VERSION=1.0.0

# Запуск приложения
CMD ["node", "index.js"] 