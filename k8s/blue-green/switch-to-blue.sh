#!/bin/bash

echo "Переключение трафика с green на blue deployment..."

# Обновление службы-роутера для направления трафика на blue-версию
kubectl patch service webapp-router -p '{"spec":{"selector":{"version":"blue"}}}'

echo "Трафик успешно переключен на blue-версию!" 