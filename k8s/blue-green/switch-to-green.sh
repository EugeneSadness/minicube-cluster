#!/bin/bash

echo "Переключение трафика с blue на green deployment..."

# Обновление службы-роутера для направления трафика на green-версию
kubectl patch service webapp-router -p '{"spec":{"selector":{"version":"green"}}}'

echo "Трафик успешно переключен на green-версию!" 