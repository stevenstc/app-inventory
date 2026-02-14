import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';

// @desc    Generar reporte de ventas
// @route   GET /api/reports/sales
// @access  Private
export const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, groupBy } = req.query;

        let query = {};
        if (startDate && endDate) {
            query.saleDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const sales = await Sale.find(query)
            .populate('user', 'name')
            .populate('items.product', 'name category')
            .sort('-saleDate');

        const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalTransactions = sales.length;

        // Ventas por método de pago
        const paymentMethodStats = sales.reduce((acc, sale) => {
            acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
            return acc;
        }, {});

        // Ventas por día
        const salesByDate = sales.reduce((acc, sale) => {
            const date = sale.saleDate.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { date, total: 0, count: 0 };
            }
            acc[date].total += sale.total;
            acc[date].count += 1;
            return acc;
        }, {});

        // Productos más vendidos
        const productSales = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                const productId = item.product._id.toString();
                if (!productSales[productId]) {
                    productSales[productId] = {
                        name: item.productName,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productSales[productId].quantity += item.quantity;
                productSales[productId].revenue += item.subtotal;
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        res.json({
            summary: {
                totalSales,
                totalTransactions,
                averageTicket: totalTransactions > 0 ? totalSales / totalTransactions : 0
            },
            paymentMethodStats,
            salesByDate: Object.values(salesByDate),
            topProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generar reporte de inventario
// @route   GET /api/reports/inventory
// @access  Private
export const getInventoryReport = async (req, res) => {
    try {
        const products = await Product.find({ active: true })
            .populate('supplier', 'name');

        // Calcular métricas
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, p) => sum + (p.stock * p.purchasePrice), 0);
        const totalSaleValue = products.reduce((sum, p) => sum + (p.stock * p.salePrice), 0);

        // Productos con stock bajo
        const lowStockProducts = products.filter(p => p.stock <= p.minStock);

        // Productos sin stock
        const outOfStockProducts = products.filter(p => p.stock === 0);

        // Productos por categoría
        const byCategory = products.reduce((acc, product) => {
            const cat = product.category || 'Sin categoría';
            if (!acc[cat]) {
                acc[cat] = { count: 0, value: 0 };
            }
            acc[cat].count += 1;
            acc[cat].value += product.stock * product.purchasePrice;
            return acc;
        }, {});

        res.json({
            summary: {
                totalProducts,
                totalValue,
                totalSaleValue,
                potentialProfit: totalSaleValue - totalValue,
                lowStockCount: lowStockProducts.length,
                outOfStockCount: outOfStockProducts.length
            },
            lowStockProducts: lowStockProducts.map(p => ({
                _id: p._id,
                name: p.name,
                sku: p.sku,
                stock: p.stock,
                minStock: p.minStock
            })),
            outOfStockProducts: outOfStockProducts.map(p => ({
                _id: p._id,
                name: p.name,
                sku: p.sku
            })),
            byCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener estadísticas del dashboard
// @route   GET /api/reports/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Ventas de hoy
        const todaySales = await Sale.find({
            saleDate: { $gte: today },
            status: 'completada'
        });

        const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);

        // Productos con stock bajo
        const lowStockCount = await Product.countDocuments({
            $expr: { $lte: ['$stock', '$minStock'] },
            active: true
        });

        // Total de productos activos
        const totalProducts = await Product.countDocuments({ active: true });

        // Valor del inventario
        const products = await Product.find({ active: true });
        const inventoryValue = products.reduce((sum, p) => sum + (p.stock * p.purchasePrice), 0);

        // Ventas de los últimos 7 días
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weekSales = await Sale.find({
            saleDate: { $gte: sevenDaysAgo },
            status: 'completada'
        });

        const salesByDay = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            salesByDay[dateStr] = 0;
        }

        weekSales.forEach(sale => {
            const dateStr = sale.saleDate.toISOString().split('T')[0];
            if (salesByDay[dateStr] !== undefined) {
                salesByDay[dateStr] += sale.total;
            }
        });

        res.json({
            todaySales: {
                count: todaySales.length,
                total: todayTotal
            },
            products: {
                total: totalProducts,
                lowStock: lowStockCount
            },
            inventoryValue,
            weekSalesChart: Object.entries(salesByDay).map(([date, total]) => ({
                date,
                total
            })).reverse()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
