import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/sales';
import './styles/global.css';

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                    <Route path="/sales" element={<PrivateRoute><Sales /></PrivateRoute>} />
                    <Route path="/suppliers" element={<PrivateRoute><div className="page-container"><h1>Proveedores</h1><p>Módulo en desarrollo</p></div></PrivateRoute>} />
                    <Route path="/sales-history" element={<PrivateRoute><div className="page-container"><h1>Historial de Ventas</h1><p>Módulo en desarrollo</p></div></PrivateRoute>} />
                    <Route path="/inventory" element={<PrivateRoute><div className="page-container"><h1>Inventario</h1><p>Módulo en desarrollo</p></div></PrivateRoute>} />
                    <Route path="/reports" element={<PrivateRoute><div className="page-container"><h1>Reportes</h1><p>Módulo en desarrollo</p></div></PrivateRoute>} />
                    <Route path="/users" element={<PrivateRoute><div className="page-container"><h1>Usuarios</h1><p>Módulo en desarrollo</p></div></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
