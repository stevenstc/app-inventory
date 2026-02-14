#!/bin/bash

echo "🚀 Iniciando InventoryManager..."

# Iniciar docker compose
docker-compose up -d

echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Crear usuario admin
echo "👤 Creando usuario administrador..."
docker-compose exec backend npm run init-admin

echo ""
echo "✅ ¡Sistema listo!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000/api"
echo ""
echo "👤 Credenciales de admin:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "Para ver logs: docker-compose logs -f"
echo "Para detener: docker-compose down"
