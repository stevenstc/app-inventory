import { useState, useEffect } from 'react';
import { reportsAPI, productsAPI } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, lowStockRes] = await Promise.all([
                reportsAPI.getDashboard(),
                productsAPI.getLowStock()
            ]);
            setStats(statsRes.data);
            setLowStock(lowStockRes.data);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Resumen general del negocio</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dbeafe' }}>💰</div>
                    <div className="stat-content">
                        <h3>Ventas Hoy</h3>
                        <p className="stat-value">${stats?.todaySales?.total?.toFixed(2) || '0.00'}</p>
                        <span className="stat-label">{stats?.todaySales?.count || 0} transacciones</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dcfce7' }}>📦</div>
                    <div className="stat-content">
                        <h3>Total Productos</h3>
                        <p className="stat-value">{stats?.products?.total || 0}</p>
                        <span className="stat-label">Productos activos</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fed7aa' }}>⚠️</div>
                    <div className="stat-content">
                        <h3>Stock Bajo</h3>
                        <p className="stat-value">{stats?.products?.lowStock || 0}</p>
                        <span className="stat-label">Requieren atención</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e9d5ff' }}>💼</div>
                    <div className="stat-content">
                        <h3>Valor Inventario</h3>
                        <p className="stat-value">${stats?.inventoryValue?.toFixed(2) || '0.00'}</p>
                        <span className="stat-label">Valor total</span>
                    </div>
                </div>
            </div>

            {lowStock.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">⚠️ Productos con Stock Bajo</h2>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Producto</th>
                                    <th>Stock Actual</th>
                                    <th>Stock Mínimo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStock.slice(0, 5).map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.sku}</td>
                                        <td>{product.name}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.minStock}</td>
                                        <td>
                                            <span className="badge badge-warning">Bajo</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
