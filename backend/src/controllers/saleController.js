import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';

// @desc    Obtener todas las ventas
// @route   GET /api/sales
// @access  Private
export const getSales = async (req, res) => {
    try {
        const { startDate, endDate, userId } = req.query;
        let query = {};

        if (startDate && endDate) {
            query.saleDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (userId) {
            query.user = userId;
        }

        const sales = await Sale.find(query)
            .populate('user', 'name')
            .populate('items.product', 'name sku')
            .sort('-saleDate');

        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener una venta por ID
// @route   GET /api/sales/:id
// @access  Private
export const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name sku');

        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ message: 'Venta no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Crear una venta
// @route   POST /api/sales
// @access  Private
export const createSale = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;

        // Validar stock y calcular total
        let total = 0;
        const saleItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: `Producto ${item.product} no encontrado`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
                });
            }

            const subtotal = item.quantity * product.salePrice;
            total += subtotal;

            saleItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.salePrice,
                subtotal
            });

            // Actualizar stock
            const previousStock = product.stock;
            product.stock -= item.quantity;
            await product.save();

            // Registrar movimiento de inventario
            await InventoryLog.create({
                product: product._id,
                user: req.user._id,
                type: 'salida',
                quantity: item.quantity,
                previousStock,
                newStock: product.stock,
                reason: 'Venta'
            });
        }

        // Crear venta
        const sale = await Sale.create({
            user: req.user._id,
            items: saleItems,
            total,
            paymentMethod
        });

        const populatedSale = await Sale.findById(sale._id)
            .populate('user', 'name')
            .populate('items.product', 'name sku');

        res.status(201).json(populatedSale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Obtener ventas de hoy
// @route   GET /api/sales/today/summary
// @access  Private
export const getTodaySales = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const sales = await Sale.find({
            saleDate: { $gte: today, $lt: tomorrow },
            status: 'completada'
        }).populate('user', 'name');

        const total = sales.reduce((sum, sale) => sum + sale.total, 0);

        res.json({
            count: sales.length,
            total,
            sales
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
