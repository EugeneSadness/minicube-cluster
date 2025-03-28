# Управление Blue-Green Deployment

В этом документе описываются команды для управления Blue-Green Deployment.

## Обзор

Blue-Green Deployment — это стратегия непрерывного развертывания, при которой поддерживаются две идентичные среды:
- **Blue** — текущая производственная среда (активная)
- **Green** — новая среда с обновленной версией (неактивная)

После развертывания новой версии в Green-среду и ее тестирования, трафик переключается с Blue на Green. Green-среда становится активной, а Blue-среда — неактивной. При следующем обновлении роли меняются.

## Проверка текущей активной среды

Чтобы узнать, какая среда сейчас активна (получает пользовательский трафик), выполните:

```bash
kubectl get service webapp-router -o=jsonpath='{.spec.selector.version}'
```

Результат будет либо `blue`, либо `green`.

## Переключение трафика с Blue на Green

Для переключения трафика с Blue-версии на Green-версию выполните:

```bash
./k8s/blue-green/switch-to-green.sh
```

Или вручную:

```bash
kubectl patch service webapp-router -p '{"spec":{"selector":{"version":"green"}}}'
```

## Переключение трафика с Green на Blue

Для переключения трафика с Green-версии на Blue-версию выполните:

```bash
./k8s/blue-green/switch-to-blue.sh
```

Или вручную:

```bash
kubectl patch service webapp-router -p '{"spec":{"selector":{"version":"blue"}}}'
```

## Обновление версии приложения

При обновлении приложения следуйте этим шагам:

1. Определите, какая версия сейчас неактивна (если активна Blue, то неактивна Green, и наоборот)
2. Обновите неактивную версию, изменив её Deployment (например, обновите образ)
3. Протестируйте неактивную версию, обращаясь к ней напрямую через её Service
4. Переключите трафик с активной версии на обновленную
5. Убедитесь, что приложение работает корректно

### Пример обновления Green-версии

Предположим, что текущая активная версия — Blue, и мы хотим обновить Green-версию.

```bash
# Проверяем, что активна Blue-версия
kubectl get service webapp-router -o=jsonpath='{.spec.selector.version}'

# Обновляем Green-версию (например, меняем образ)
kubectl set image deployment/webapp-green webapp=minikube-test-app:v1.1.0

# Проверяем, что обновление успешно
kubectl rollout status deployment/webapp-green

# Тестируем Green-версию напрямую
minikube service webapp-green

# Переключаем трафик на Green-версию
./k8s/blue-green/switch-to-green.sh

# Проверяем новую активную версию
kubectl get service webapp-router -o=jsonpath='{.spec.selector.version}'
```

## Откат изменений

Если после переключения на новую версию вы обнаружили проблемы, вы можете быстро вернуться к предыдущей версии:

```bash
# Если текущая активная версия — Green, переключаемся на Blue
./k8s/blue-green/switch-to-blue.sh

# Если текущая активная версия — Blue, переключаемся на Green
./k8s/blue-green/switch-to-green.sh
```

Это преимущество стратегии Blue-Green Deployment — возможность быстрого отката без простоя. 