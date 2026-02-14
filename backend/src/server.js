import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import User from './models/User.js';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Configuración de variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar usuario administrador
const initializeAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@inventory.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456';
        const adminName = process.env.ADMIN_NAME || 'Administrador';
        const adminPhone = process.env.ADMIN_PHONE || '+573001234567';

        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            // Crear admin
            await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                phone: adminPhone
            });
            console.log('✅ Usuario admin creado exitosamente');
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`🔑 Password: ${adminPassword}`);
            console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión');
        } else {
            console.log('✓ Usuario admin ya existe');
        }
    } catch (error) {
        console.error('Error al inicializar admin:', error.message);
    }
};

// Ejecutar después de conectar a la base de datos
setTimeout(initializeAdmin, 2000);

const app = express();

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 peticiones por ventana
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
    res.json({ message: 'API de InventoryManager funcionando' });
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
