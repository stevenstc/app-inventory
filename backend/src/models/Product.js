import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor ingrese el nombre del producto'],
        trim: true
    },
    sku: {
        type: String,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    purchasePrice: {
        type: Number,
        required: [true, 'Por favor ingrese el precio de compra'],
        min: 0
    },
    salePrice: {
        type: Number,
        required: [true, 'Por favor ingrese el precio de venta'],
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    minStock: {
        type: Number,
        default: 10,
        min: 0
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    category: {
        type: String,
        trim: true
    },
    unit: {
        type: String,
        default: 'unidad',
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Generar SKU automático si no se proporciona
productSchema.pre('save', async function (next) {
    if (!this.sku) {
        const count = await mongoose.model('Product').countDocuments();
        this.sku = `PRD-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

export default mongoose.model('Product', productSchema);
