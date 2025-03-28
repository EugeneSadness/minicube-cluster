# Установка и настройка

В этом документе описываются шаги по установке и настройке тестового кластера Minikube.

## Предварительные требования

Перед началом установки убедитесь, что у вас установлены следующие компоненты:

- Docker
- Minikube
- kubectl

## Установка Minikube

Если у вас еще не установлен Minikube, вы можете установить его, следуя инструкциям для вашей операционной системы:

### Linux

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### MacOS

```bash
brew install minikube
```

### Windows

```powershell
choco install minikube
```

## Установка kubectl

Если у вас еще не установлен kubectl, вы можете установить его, следуя инструкциям для вашей операционной системы:

### Linux

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### MacOS

```bash
brew install kubectl
```

### Windows

```powershell
choco install kubernetes-cli
```

## Запуск Minikube

Для запуска Minikube выполните следующую команду:

```bash
minikube start
```

После успешного запуска Minikube вы можете проверить статус кластера:

```bash
minikube status
kubectl get nodes
```

## Подготовка хранилища данных

Для работы базы данных PostgreSQL нам необходимо создать директорию для хранения данных на узле Minikube:

```bash
minikube ssh "sudo mkdir -p /mnt/data && sudo chmod -R 777 /mnt/data"
```

## Дополнительные настройки

Если вы хотите использовать Docker-образы, собранные локально, вы можете настроить Docker для работы с Minikube:

```bash
eval $(minikube docker-env)
```

Эта команда настраивает Docker CLI на использование Docker-демона Minikube. После этого все собранные образы будут доступны в кластере Minikube без необходимости их загрузки в реестр. 