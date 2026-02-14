import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const initAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        // Obtener credenciales desde variables de entorno
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@inventory.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456';
        const adminName = process.env.ADMIN_NAME || 'Administrador';
        const adminPhone = process.env.ADMIN_PHONE || '+573001234567';

        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Usuario admin ya existe');
            console.log(`Email: ${adminEmail}`);
            process.exit(0);
        }

        // Crear admin
        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            phone: adminPhone
        });

        console.log('✅ Usuario admin creado exitosamente');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('⚠️ IMPORTANTE: Cambia la contraseña después del primer inicio de sesión');

        process.exit(0);
    } catch (error) {
        console.error('Error al crear admin:', error);
        process.exit(1);
    }
};

initAdmin();
