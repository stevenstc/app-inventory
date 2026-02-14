import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['entrada', 'salida', 'ajuste'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    previousStock: {
        type: Number,
        required: true
    },
    newStock: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        trim: true
    },
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale'
    }
}, {
    timestamps: true
});

export default mongoose.model('InventoryLog', inventoryLogSchema);
