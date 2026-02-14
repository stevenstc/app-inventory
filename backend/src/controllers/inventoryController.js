import InventoryLog from '../models/InventoryLog.js';
import Product from '../models/Product.js';

// @desc    Obtener historial de inventario
// @route   GET /api/inventory
// @access  Private
export const getInventoryLogs = async (req, res) => {
    try {
        const { productId, type, startDate, endDate } = req.query;
        let query = {};

        if (productId) {
            query.product = productId;
        }

        if (type) {
            query.type = type;
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const logs = await InventoryLog.find(query)
            .populate('product', 'name sku')
            .populate('user', 'name')
            .sort('-createdAt')
            .limit(1000);

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Ajustar inventario manualmente
// @route   POST /api/inventory/adjust
// @access  Private/Admin/Almacenista
export const adjustInventory = async (req, res) => {
    try {
        const { productId, quantity, reason } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const previousStock = product.stock;
        const newStock = previousStock + quantity;

        if (newStock < 0) {
            return res.status(400).json({
                message: 'El ajuste resultaría en stock negativo'
            });
        }

        product.stock = newStock;
        await product.save();

        const log = await InventoryLog.create({
            product: product._id,
            user: req.user._id,
            type: 'ajuste',
            quantity: Math.abs(quantity),
            previousStock,
            newStock,
            reason
        });

        const populatedLog = await InventoryLog.findById(log._id)
            .populate('product', 'name sku')
            .populate('user', 'name');

        res.status(201).json(populatedLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Obtener valor del inventario
// @route   GET /api/inventory/value
// @access  Private
export const getInventoryValue = async (req, res) => {
    try {
        const products = await Product.find({ active: true });

        const totalValue = products.reduce((sum, product) => {
            return sum + (product.stock * product.purchasePrice);
        }, 0);

        const saleValue = products.reduce((sum, product) => {
            return sum + (product.stock * product.salePrice);
        }, 0);

        res.json({
            totalProducts: products.length,
            totalValue,
            saleValue,
            profit: saleValue - totalValue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
