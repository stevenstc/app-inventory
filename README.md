# InventoryManager - Sistema de Administración de Inventarios

Sistema completo de administración de inventarios con punto de venta, gestión de productos, proveedores y reportes.

## 🚀 Características

- **Dashboard:** Resumen de ventas y alertas de stock bajo
- **Gestión de Productos:** CRUD completo con control de inventario
- **Punto de Venta (POS):** Interfaz intuitiva para ventas rápidas
- **Gestión de Proveedores:** Administración de proveedores
- **Reportes:** Estadísticas de ventas e inventario
- **Control de Usuarios:** Sistema de roles (Admin, Vendedor, Almacenista)
- **Autenticación JWT:** Seguridad en todas las operaciones

## 🏗️ Stack Tecnológico

### Backend
- Node.js + Express
- MongoDB con Mongoose
- JWT para autenticación
- bcryptjs para encriptación

### Frontend
- React 18
- Vite
- React Router
- Axios

### Infraestructura
- Docker & Docker Compose
- MongoDB en contenedor

## 📦 Instalación Rápida con Docker

### Prerequisitos
- Docker
- Docker Compose

### Pasos

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd app-inventory
```

2. **Iniciar todos los servicios**
```bash
docker-compose up -d
```

Esto levantará:
- MongoDB en puerto 27017
- Backend API en puerto 5000
- Frontend en puerto 3000

3. **Acceder a la aplicación**

Abrir en el navegador: `http://localhost:3000`

## 👤 Usuario Administrador

El sistema crea **automáticamente** un usuario administrador al iniciar el servidor por primera vez.

### Credenciales por Defecto

Las credenciales del usuario administrador se configuran en el archivo [`backend/.env`](backend/.env):

```env
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@inventory.com
ADMIN_PASSWORD=Admin123456
ADMIN_PHONE=+573001234567
```

### Acceso al Sistema

Una vez que el servidor esté corriendo, puedes iniciar sesión con:

- **Email:** `admin@inventory.com`
- **Password:** `Admin123456`

### ⚠️ Seguridad

**IMPORTANTE:** Se recomienda cambiar estas credenciales por defecto, especialmente en entornos de producción. Puedes modificarlas en el archivo `.env` antes de iniciar el servidor por primera vez.

### Más Información

Para más detalles sobre la configuración del usuario administrador, consulta [`backend/ADMIN_SETUP.md`](backend/ADMIN_SETUP.md)

## 🔧 Comandos Útiles

### Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Backend solamente
docker-compose logs -f backend

# Frontend solamente
docker-compose logs -f frontend
```

### Reiniciar servicios
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar backend
docker-compose restart backend
```

### Detener servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (elimina datos de BD)
```bash
docker-compose down -v
```

## 🛠️ Desarrollo Sin Docker

### Backend

```bash
cd backend
npm install
npm run dev
```

Configurar `.env` basado en `.env.example`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (Admin)
- `GET /api/auth/me` - Usuario actual

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/low-stock/list` - Productos con stock bajo

### Ventas
- `GET /api/sales` - Listar ventas
- `GET /api/sales/:id` - Obtener venta
- `POST /api/sales` - Crear venta
- `GET /api/sales/today/summary` - Ventas de hoy

### Proveedores
- `GET /api/suppliers` - Listar proveedores
- `POST /api/suppliers` - Crear proveedor
- `PUT /api/suppliers/:id` - Actualizar proveedor
- `DELETE /api/suppliers/:id` - Eliminar proveedor

### Inventario
- `GET /api/inventory` - Historial de movimientos
- `POST /api/inventory/adjust` - Ajustar inventario
- `GET /api/inventory/value` - Valor del inventario

### Reportes
- `GET /api/reports/sales` - Reporte de ventas
- `GET /api/reports/inventory` - Reporte de inventario
- `GET /api/reports/dashboard` - Estadísticas del dashboard

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `PUT /api/users/:id` - Actualizar usuario (Admin)
- `DELETE /api/users/:id` - Eliminar usuario (Admin)

## 👥 Roles y Permisos

### Admin
- Acceso completo a todos los módulos
- Gestión de usuarios
- Reportes completos

### Vendedor
- Dashboard
- Punto de venta
- Historial de ventas

### Almacenista
- Dashboard
- Gestión de productos
- Control de inventario

## 📁 Estructura del Proyecto

```
app-inventory/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Autenticación
│   │   ├── models/         # Modelos Mongoose
│   │   ├── routes/         # Rutas de API
│   │   ├── utils/          # Utilidades
│   │   └── server.js       # Punto de entrada
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── context/        # Context API
│   │   ├── pages/          # Páginas/Vistas
│   │   ├── services/       # API calls
│   │   ├── styles/         # CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación JWT
- Validación de datos en servidor
- CORS configurado
- Rate limiting implementado

## 📝 Notas

- El sistema está configurado para desarrollo. Para producción, cambiar variables de entorno
- Cambiar `JWT_SECRET` en producción
- Configurar backup de MongoDB
- Implementar HTTPS en producción

## 🐛 Solución de Problemas

### MongoDB no se conecta
```bash
docker-compose restart mongodb
docker-compose logs mongodb
```

### Backend no inicia
```bash
docker-compose logs backend
# Verificar variables de entorno en docker-compose.yml
```

### Frontend no carga
```bash
docker-compose logs frontend
# Verificar que backend esté corriendo
```

### Limpiar todo y empezar de cero
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build -d
```

## 📧 Soporte

Para problemas o preguntas, crear un issue en el repositorio.

## 📄 Licencia

MIT

---

**¡Listo para usar! 🎉**

Plug and Play - Solo ejecuta `docker-compose up -d` y comienza a trabajar.
