# Устранение неполадок

В этом документе описаны типичные проблемы, которые могут возникнуть при работе с Minikube кластером, и способы их решения.

## Проблемы с Minikube

### Minikube не запускается

Если Minikube не запускается с ошибкой:

```
Error starting host: Error creating host: Error executing step: Creating VM
```

Попробуйте следующие решения:

1. Перезапустите сервис Docker:
   ```bash
   sudo systemctl restart docker
   ```

2. Установите последнюю версию Minikube:
   ```bash
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   sudo install minikube-linux-amd64 /usr/local/bin/minikube
   ```

3. Удалите существующий кластер и создайте новый:
   ```bash
   minikube delete
   minikube start
   ```

### Недостаточно ресурсов

Если при запуске Minikube возникает ошибка нехватки ресурсов:

```
Exiting due to GUEST_PROVISION: Requested memory allocation (4096MB) is greater than host memory (4000MB)
```

Запустите Minikube с указанием ограничений ресурсов:

```bash
minikube start --memory=2048 --cpus=2
```

## Проблемы с Kubernetes

### Поды не запускаются

Если поды остаются в статусе `Pending` или `ImagePullBackOff`:

1. Проверьте статус пода:
   ```bash
   kubectl describe pod <имя-пода>
   ```

2. Проверьте доступность образа:
   ```bash
   # Если используете локальный образ
   eval $(minikube docker-env)
   docker images | grep <имя-образа>
   ```

3. Запустите Minikube с доступом к локальному реестру Docker:
   ```bash
   minikube start --insecure-registry=localhost:5000
   ```

### Проблемы с PersistentVolume

Если PersistentVolumeClaim остается в статусе `Pending`:

1. Проверьте статус PVC:
   ```bash
   kubectl get pvc
   kubectl describe pvc <имя-pvc>
   ```

2. Проверьте созданные PersistentVolumes:
   ```bash
   kubectl get pv
   ```

3. Убедитесь, что директория для данных создана на узле:
   ```bash
   minikube ssh "ls -la /mnt/data"
   ```

## Проблемы с Blue-Green Deployment

### Переключение трафика не работает

Если при переключении трафика между Blue и Green версиями возникают проблемы:

1. Проверьте текущую конфигурацию router-сервиса:
   ```bash
   kubectl describe service webapp-router
   ```

2. Убедитесь, что все сервисы работают:
   ```bash
   kubectl get service
   ```

3. Проверьте, что все поды запущены:
   ```bash
   kubectl get pods -l app=webapp
   ```

4. Проверьте логи подов:
   ```bash
   kubectl logs -l app=webapp,version=blue
   kubectl logs -l app=webapp,version=green
   ```

## Миграция данных

### Резервное копирование PostgreSQL

Для создания резервной копии базы данных PostgreSQL:

```bash
# Получите имя пода PostgreSQL
POD_NAME=$(kubectl get pod -l app=postgres -o jsonpath="{.items[0].metadata.name}")

# Создайте дамп базы данных
kubectl exec -it $POD_NAME -- pg_dump -U postgres -d webapp > backup.sql
```

### Восстановление данных PostgreSQL

Для восстановления базы данных из резервной копии:

```bash
# Получите имя пода PostgreSQL
POD_NAME=$(kubectl get pod -l app=postgres -o jsonpath="{.items[0].metadata.name}")

# Скопируйте файл резервной копии в под
kubectl cp backup.sql $POD_NAME:/tmp/

# Восстановите базу данных
kubectl exec -it $POD_NAME -- psql -U postgres -d webapp -f /tmp/backup.sql
```

## Очистка ресурсов

Если необходимо очистить все ресурсы кластера:

```bash
# Удаление всех ресурсов
kubectl delete all --all

# Удаление PVC
kubectl delete pvc --all

# Удаление PV
kubectl delete pv --all

# Удаление ConfigMap
kubectl delete configmap --all

# Остановка Minikube
minikube stop

# Удаление кластера Minikube
minikube delete
``` 