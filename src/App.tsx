import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

import { CartProvider } from './context/CartContext'
import HomePage from './HomePage/HomePage'
import AboutUS from './AboutUS/AboutUS'
import Privacy from './Global/Privacy/Privacy'
import AuthPage from './pages/AuthPage'

import BlogPage from './pages/Blog/BlogPage'
import BlogDetailPage from './pages/Blog/BlogDetailPage'
import Terms from './Global/Terms/Terms'
import ProductDetail from './components/ProductsDetail.tsx/ProductDetail'

import HelpCenter from './Global/HelpCenter/HelpCenter'
import CustomerService from './Global/CustomerService/CustomerService'

import Organic from './Organic/Organic'
import Research from './components/Research/Research'
import Production from './components/Production/Production'
import Contact from './Global/ContactPage/Contact'
import UserProfile from './components/UserProfile/UserProfile'
import CookiePolicy from './Global/CookiePolicy/CookiePolicy'
import Navbar from './Global/Navbar'
import NewFooter from './Global/NewFooter'
import Breadcrumbs from './components/Breadcrumbs'

function AppContent() {
  const location = useLocation()
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup'

  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/signup'

  return (
    <div className="relative">
      {!hideNavbar && <Navbar />}
      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<CookiePolicy />} />

        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/research" element={<Research />} />
        <Route path="/production" element={<Production />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user-profile" element={<UserProfile />} />

        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/aboutus" element={<AboutUS />} />

        <Route path="/:category" element={<Organic />} />

        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/customer-service" element={<CustomerService />} />
      </Routes>

      {!hideFooter && <NewFooter />}
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
