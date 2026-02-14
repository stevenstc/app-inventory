# 🔑 Credenciales del Usuario Administrador

## Acceso al Sistema

Para acceder al sistema de gestión de inventarios, utiliza las siguientes credenciales:

### 📧 Datos de Acceso

| Campo | Valor |
|-------|-------|
| **Email** | `admin@inventory.com` |
| **Password** | `Admin123456` |
| **Rol** | Administrador |
| **Teléfono** | +573001234567 |

---

## 🚀 Inicio Rápido

1. **Iniciar el sistema:**
   ```bash
   docker-compose up -d
   ```

2. **Esperar a que los servicios estén listos** (aproximadamente 30 segundos)

3. **Acceder a la aplicación:**
   - Abrir navegador en: `http://localhost:3000`
   - Usar las credenciales mostradas arriba

4. **Primer inicio de sesión:**
   - Ingresa el email: `admin@inventory.com`
   - Ingresa la password: `Admin123456`
   - Haz clic en "Iniciar Sesión"

---

## 🎯 Funcionalidades del Administrador

Con este usuario administrador puedes:

✅ **Gestión de Usuarios**
- Crear nuevos usuarios (vendedores, almacenistas, administradores)
- Modificar información de usuarios existentes
- Activar/desactivar cuentas de usuario
- Asignar y cambiar roles

✅ **Gestión de Productos**
- Añadir productos al inventario
- Editar información de productos
- Eliminar productos
- Controlar stock y precios

✅ **Gestión de Proveedores**
- Registrar nuevos proveedores
- Actualizar información de contacto
- Gestionar relaciones comerciales

✅ **Punto de Venta (POS)**
- Realizar ventas
- Procesar transacciones
- Generar tickets

✅ **Reportes y Estadísticas**
- Ver reportes de ventas
- Analizar movimientos de inventario
- Consultar estadísticas del negocio
- Exportar datos

✅ **Gestión de Inventario**
- Monitorizar niveles de stock
- Recibir alertas de stock bajo
- Realizar ajustes de inventario
- Ver historial de movimientos

---

## 🔒 Recomendaciones de Seguridad

⚠️ **IMPORTANTE:** Por seguridad, se recomienda:

1. **Cambiar la contraseña** después del primer inicio de sesión
2. **Crear usuarios específicos** para cada persona que usará el sistema
3. **No compartir** las credenciales del administrador
4. **Asignar roles apropiados** según las responsabilidades de cada usuario

---

## 🔧 Cambiar las Credenciales

Si deseas cambiar las credenciales por defecto antes de iniciar el sistema:

1. Abre el archivo `backend/.env`
2. Modifica los siguientes valores:
   ```env
   ADMIN_NAME=Tu Nombre
   ADMIN_EMAIL=tu-email@ejemplo.com
   ADMIN_PASSWORD=TuPasswordSeguro
   ADMIN_PHONE=+57300XXXXXXX
   ```
3. Guarda el archivo
4. Inicia el sistema

---

## ❓ Problemas de Acceso

### No puedo iniciar sesión
- Verifica que el backend esté corriendo: `docker-compose logs backend`
- Confirma que MongoDB esté activo: `docker-compose ps`
- Revisa que las credenciales sean exactas (el email es case-sensitive)

### Olvidé la contraseña
1. Detén el sistema: `docker-compose down`
2. Modifica el archivo `backend/.env` con una nueva contraseña
3. Elimina el usuario admin de MongoDB o reinicia la base de datos
4. Inicia el sistema nuevamente: `docker-compose up -d`

---

## 📚 Documentación Adicional

- [`README.md`](README.md) - Guía general del proyecto
- [`backend/ADMIN_SETUP.md`](backend/ADMIN_SETUP.md) - Configuración detallada del administrador
- [`plans/plan.md`](plans/plan.md) - Plan de desarrollo del proyecto
