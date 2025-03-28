# Minikube Cluster

Проект демонстрирует развертывание приложения в Minikube кластере с использованием различных стратегий деплоя, включая Blue-Green Deployment.

## Обзор

В этом проекте представлены:

- Настройка Minikube кластера для локальной разработки
- Развертывание базы данных PostgreSQL с использованием PersistentVolume
- Развертывание простого веб-приложения
- Реализация стратегии Blue-Green Deployment для обновления приложения без простоя
- Подробная документация по всем аспектам проекта

## Структура проекта

```
minikube-cluster/
├── app/                  # Исходный код приложения
├── docs/                 # Документация
│   ├── installation.md   # Инструкции по установке
│   ├── deployment.md     # Инструкции по деплою
│   ├── blue-green.md     # Руководство по Blue-Green Deployment
│   ├── architecture.md   # Описание архитектуры проекта
│   └── troubleshooting.md # Руководство по устранению неполадок
├── k8s/                  # Конфигурации Kubernetes
│   ├── postgres/         # Конфигурации для PostgreSQL
│   ├── webapp/           # Конфигурации для стандартного деплоя
│   └── blue-green/       # Конфигурации для Blue-Green Deployment
└── README.md             # Данный файл
```

## Быстрый старт

1. **Установка и настройка**:
   ```bash
   # Установка Minikube (для Linux)
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   sudo install minikube-linux-amd64 /usr/local/bin/minikube
   
   # Установка kubectl
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   
   # Запуск Minikube
   minikube start
   ```

2. **Деплой базы данных и приложения**:
   ```bash
   # Деплой PostgreSQL
   kubectl apply -f k8s/postgres/
   
   # Деплой приложения
   kubectl apply -f k8s/webapp/
   
   # Проверка статуса
   kubectl get pods
   ```

3. **Применение Blue-Green Deployment**:
   ```bash
   # Создание Blue и Green версий
   kubectl apply -f k8s/blue-green/
   
   # Проверка статуса
   kubectl get pods
   ```

## Документация

Подробная документация доступна в директории [docs](docs/):

- [Инструкции по установке](docs/installation.md)
- [Инструкции по деплою](docs/deployment.md)
- [Руководство по Blue-Green Deployment](docs/blue-green.md)
- [Архитектура проекта](docs/architecture.md)
- [Устранение неполадок](docs/troubleshooting.md)

## Требования

- Minikube v1.20+
- kubectl v1.20+
- Docker

## Лицензия

[MIT](LICENSE) 