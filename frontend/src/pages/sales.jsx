import { useState, useEffect } from 'react';
import { productsAPI, salesAPI } from '../services/api';

function Sales() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('efectivo');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.product === product._id);
        if (existing) {
            setCart(cart.map(item =>
                item.product === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product: product._id, name: product.name, price: product.salePrice, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product !== productId));
    };

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCheckout = async () => {
        try {
            const items = cart.map(item => ({
                product: item.product,
                quantity: item.quantity
            }));

            await salesAPI.create({ items, paymentMethod });
            alert('Venta realizada con éxito');
            setCart([]);
        } catch (error) {
            alert('Error al procesar venta: ' + error.response?.data?.message);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Punto de Venta</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {filteredProducts.slice(0, 12).map(product => (
                            <div
                                key={product._id}
                                onClick={() => addToCart(product)}
                                style={{
                                    padding: '1rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{product.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{product.sku}</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-color)', marginTop: '0.5rem' }}>
                                    ${product.salePrice.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Carrito</h3>

                    {cart.length === 0 ? (
                        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>
                            Carrito vacío
                        </p>
                    ) : (
                        <>
                            {cart.map(item => (
                                <div key={item.product} style={{
                                    padding: '0.75rem',
                                    borderBottom: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                            {item.quantity} x ${item.price.toFixed(2)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                        <button
                                            onClick={() => removeFromCart(item.product)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'var(--danger-color)',
                                                fontSize: '1.25rem'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div style={{ padding: '1rem 0', borderTop: '2px solid var(--border-color)', marginTop: '1rem' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', textAlign: 'right' }}>
                                    Total: ${getTotal().toFixed(2)}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Método de Pago</label>
                                <select
                                    className="form-select"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="transferencia">Transferencia</option>
                                </select>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="btn btn-success"
                                style={{ width: '100%' }}
                            >
                                Procesar Venta
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sales;
