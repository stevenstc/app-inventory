import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

function Sidebar() {
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/', icon: '📊', label: 'Dashboard', roles: ['admin', 'vendedor', 'almacenista'] },
        { path: '/products', icon: '📦', label: 'Productos', roles: ['admin', 'almacenista'] },
        { path: '/suppliers', icon: '🏢', label: 'Proveedores', roles: ['admin'] },
        { path: '/sales', icon: '💰', label: 'Punto de Venta', roles: ['admin', 'vendedor'] },
        { path: '/sales-history', icon: '📋', label: 'Historial de Ventas', roles: ['admin', 'vendedor'] },
        { path: '/inventory', icon: '📈', label: 'Inventario', roles: ['admin', 'almacenista'] },
        { path: '/reports', icon: '📊', label: 'Reportes', roles: ['admin'] },
        { path: '/users', icon: '👥', label: 'Usuarios', roles: ['admin'] }
    ];

    const filteredMenu = menuItems.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>InventoryManager</h2>
                <div className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">{user?.role}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {filteredMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="link-icon">{item.icon}</span>
                        <span className="link-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="btn-logout">
                    <span style={{ marginRight: '0.5rem' }}>🚪</span>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
