import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productsAPI.getAll({ search });
            setProducts(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadProducts();
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Productos</h1>
                <p className="page-subtitle">Gestión de inventario de productos</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Buscar por nombre o SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ maxWidth: '400px' }}
                        />
                        <button type="submit" className="btn btn-primary">Buscar</button>
                    </form>
                    <button className="btn btn-success">+ Nuevo Producto</button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Stock</th>
                                <th>Precio Venta</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.sku}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category || '-'}</td>
                                    <td>
                                        <span className={product.stock <= product.minStock ? 'badge badge-warning' : ''}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>${product.salePrice.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${product.active ? 'badge-success' : 'badge-danger'}`}>
                                            {product.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Products;
