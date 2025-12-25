import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Shipping from './pages/Shipping';
import Privacy from './pages/Privacy';
import Lookbook from './pages/Lookbook';
import PersonalShopper from './pages/PersonalShopper';
import Brands from './pages/Brands';
import Dashboard from './pages/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';

import { useAuthStore } from './store/authStore';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="personal-shopper" element={<PersonalShopper />} /> {/* Added route */}
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="lookbook" element={<Lookbook />} />
          <Route path="brands" element={<Brands />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
        </Route>

        {/* Admin Routes - Moved outside MainLayout to avoid Navbar overlap */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

      </Routes>
    </BrowserRouter >
  );
}

export default App;
