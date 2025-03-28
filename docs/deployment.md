# Инструкции по деплою

В этом документе описываются шаги по развертыванию приложения в кластере Minikube.

## Сборка Docker-образа

Перед развертыванием необходимо собрать Docker-образ приложения:

```bash
# Переходим в директорию приложения
cd app

# Собираем Docker-образ
docker build -t minikube-test-app:v1.0.0 .

# Настраиваем Docker для работы с Minikube
eval $(minikube docker-env)

# Собираем образ еще раз (чтобы он был доступен в Minikube)
docker build -t minikube-test-app:v1.0.0 .
```

## Развертывание базы данных

Для развертывания базы данных PostgreSQL выполните следующие команды:

```bash
# Создаем PersistentVolume и PersistentVolumeClaim
kubectl apply -f k8s/postgres/persistent-volume.yaml

# Создаем ConfigMap для настройки PostgreSQL
kubectl apply -f k8s/postgres/configmap.yaml

# Создаем Deployment для PostgreSQL
kubectl apply -f k8s/postgres/deployment.yaml

# Создаем Service для PostgreSQL
kubectl apply -f k8s/postgres/service.yaml
```

Проверьте, что под PostgreSQL успешно запущен:

```bash
kubectl get pods -l app=postgres
```

## Развертывание приложения (стандартный способ)

Для развертывания приложения выполните следующие команды:

```bash
# Создаем ConfigMap для настройки приложения
kubectl apply -f k8s/app/configmap.yaml

# Создаем Deployment для приложения
kubectl apply -f k8s/app/deployment.yaml

# Создаем Service для приложения
kubectl apply -f k8s/app/service.yaml
```

Проверьте, что под приложения успешно запущен:

```bash
kubectl get pods -l app=webapp
```

Для доступа к приложению выполните:

```bash
minikube service webapp
```

## Развертывание приложения с использованием Blue-Green Deployment

Для развертывания приложения с использованием стратегии Blue-Green Deployment выполните следующие команды:

```bash
# Создаем Blue Deployment
kubectl apply -f k8s/blue-green/blue-deployment.yaml

# Создаем Green Deployment
kubectl apply -f k8s/blue-green/green-deployment.yaml

# Создаем Service для Blue версии
kubectl apply -f k8s/blue-green/blue-service.yaml

# Создаем Service для Green версии
kubectl apply -f k8s/blue-green/green-service.yaml

# Создаем Router Service (изначально направляет трафик на Blue версию)
kubectl apply -f k8s/blue-green/router-service.yaml
```

Проверьте, что поды Blue и Green версий успешно запущены:

```bash
kubectl get pods -l app=webapp
```

Для доступа к приложению выполните:

```bash
minikube service webapp-router
``` 