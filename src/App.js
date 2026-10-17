import './App.css';
import { Navbar } from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Product } from './Pages/Product';
import { Shop } from './Pages/Shop';
import { Home } from './Pages/Home';
import { Cart } from './Pages/Cart';
import { LoginSignup } from './Pages/LoginSignup';
import { Footer } from './Components/Footer/Footer';
import { ScrollToTop } from './Components/ScrollToTop/ScrollToTop';
import { AdminRoute } from './Components/AdminRoute/AdminRoute';
import { AdminProducts } from './Pages/Admin/AdminProducts';
import { AdminProductForm } from './Pages/Admin/AdminProductForm';
import { Profile } from './Pages/Profile';

function App() {
  return <div><BrowserRouter><ScrollToTop /><Navbar /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/men" element={<Navigate to="/shop?category=men" replace />} />
    <Route path="/women" element={<Navigate to="/shop?category=women" replace />} />
    <Route path="/kids" element={<Navigate to="/shop?category=unisex" replace />} />
    <Route path="/product/:productId" element={<Product />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/login" element={<LoginSignup />} />
    <Route path="/admin" element={<AdminRoute><AdminProducts /></AdminRoute>} />
    <Route path="/admin/product/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
    <Route path="/admin/product/:productId/edit" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
    <Route path="/profile" element={<Profile />} />
  </Routes><Footer /></BrowserRouter></div>;
}
export default App;
