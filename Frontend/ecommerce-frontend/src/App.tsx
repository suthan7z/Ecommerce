import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoutes';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './components/Products/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './components/Cart/Checkout';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminProducts from './components/Admin/AdminProducts';
import AdminOrders from './components/Admin/AdminOrders';
import AdminUsers from './components/Admin/AdminUsers';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Admin routes — full screen, own layout, no main Navbar */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* All other routes — with Navbar */}
            <Route path="/*" element={
              <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  </Routes>
                </main>
              </div>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
