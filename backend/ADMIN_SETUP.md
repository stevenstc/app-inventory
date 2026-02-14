# Configuración de Usuario Administrador

## Variables de Entorno

El sistema crea automáticamente un usuario administrador al iniciar el servidor usando las variables de entorno definidas en el archivo `.env`.

### Variables Configurables

En el archivo `backend/.env`, encontrarás las siguientes variables para configurar el usuario administrador:

```env
# Admin User (Default credentials)
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@inventory.com
ADMIN_PASSWORD=Admin123456
ADMIN_PHONE=+573001234567
```

### Modificar las Credenciales del Administrador

1. Abre el archivo `backend/.env`
2. Modifica los valores de las variables según tus necesidades:
   - `ADMIN_NAME`: Nombre completo del administrador
   - `ADMIN_EMAIL`: Correo electrónico del administrador (usado para login)
   - `ADMIN_PASSWORD`: Contraseña del administrador (mínimo 6 caracteres)
   - `ADMIN_PHONE`: Teléfono del administrador

## Inicialización Automática

El usuario administrador se crea automáticamente cuando inicias el servidor si no existe en la base de datos.

### Iniciar el Servidor

```bash
npm start
```

o en modo desarrollo:

```bash
npm run dev
```

El servidor verificará si existe el usuario administrador y:
- Si **NO existe**: Lo creará automáticamente con las credenciales del `.env`
- Si **SÍ existe**: Solo mostrará un mensaje confirmando que ya existe

### Inicialización Manual (Opcional)

Si prefieres crear el usuario administrador manualmente antes de iniciar el servidor:

```bash
npm run init-admin
```

## Credenciales por Defecto

Las credenciales por defecto configuradas son:

- **Email**: admin@inventory.com
- **Password**: Admin123456
- **Rol**: admin

## ⚠️ Seguridad Importante

1. **Cambiar las credenciales**: Es altamente recomendable cambiar las credenciales por defecto, especialmente la contraseña, después del primer inicio de sesión.

2. **En producción**: 
   - Usa contraseñas fuertes y únicas
   - Considera usar variables de entorno del sistema operativo en lugar del archivo `.env`
   - No compartas el archivo `.env` en repositorios públicos

3. **Cambiar contraseña**: Una vez que inicies sesión con el usuario administrador, puedes cambiar la contraseña desde la interfaz de gestión de usuarios.

## Gestión de Usuarios

Con el usuario administrador puedes:

1. **Crear nuevos usuarios**: Accede a la sección de usuarios y crea cuentas para vendedores y almacenistas
2. **Asignar roles**: Cada usuario puede tener uno de estos roles:
   - `admin`: Acceso completo al sistema
   - `vendedor`: Puede gestionar ventas y consultar inventario
   - `almacenista`: Puede gestionar inventario y productos
3. **Activar/Desactivar usuarios**: Controla el acceso al sistema de cada usuario
4. **Modificar información**: Actualiza nombres, emails, teléfonos, etc.

## Endpoints de Autenticación

### Login
```
POST /api/auth/login
Body: {
  "email": "admin@inventory.com",
  "password": "Admin123456"
}
```

### Obtener Perfil
```
GET /api/auth/me
Headers: {
  "Authorization": "Bearer <token>"
}
```

## Solución de Problemas

### El usuario administrador no se crea
1. Verifica que el servidor MongoDB esté corriendo
2. Revisa que las variables de entorno estén correctamente configuradas en `.env`
3. Verifica los logs del servidor para identificar errores

### No puedo iniciar sesión
1. Verifica que el email y contraseña coincidan con los del `.env`
2. Asegúrate de que el usuario esté creado (revisa los logs del servidor)
3. Verifica que el email sea válido y la contraseña tenga al menos 6 caracteres

### Resetear el administrador
Si necesitas resetear el usuario administrador:
1. Elimina el usuario de la base de datos MongoDB
2. Reinicia el servidor, se creará automáticamente con las credenciales del `.env`
