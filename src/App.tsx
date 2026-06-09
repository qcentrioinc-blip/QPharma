import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import { CartProvider } from './context/CartContext'
import HomePage from './HomePage/HomePage'
import AboutUS from './AboutUS/AboutUS'
import Privacy from './Global/Privacy/Privacy'
import AuthPage from './pages/AuthPage'
import ProductPage from './ProductPage/ProductPage'
import HerbalPage from './ProductPage/HerbalPage'
import NutraceuticalPage from './ProductPage/NutraceuticalPage'
// import OrganicPage from './ProductPage/OrganicPage'
import CheckoutPage from './ProductPage/CheckoutPage'
import TrackOrder from './ProductPage/TrackOrder'

import HelpCenter from './Global/HelpCenter/HelpCenter'
import CustomerService from './Global/CustomerService/CustomerService'
import ProductionPage from './pages/ProductionPage'
import RnDPage from './pages/RnDPage'
import GalleryPage from './pages/GalleryPage'
import Organic from './Organic/Organic'

function App() {
  return (
    <>
      <CartProvider>
        <BrowserRouter>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* Privacy Route */}
            <Route path="/privacy" element={<Privacy />} />

            {/* AboutUS Route */}
            <Route path="/aboutus" element={<AboutUS />} />

            {/* Product Page Route */}
            <Route path="/productpage" element={<ProductPage />} />

            {/* Category Routes */}
            <Route path="/herbal" element={<HerbalPage />} />
            <Route path="/nutraceutical" element={<NutraceuticalPage />} />
            <Route path="/organic" element={<Organic />} />

            {/* Checkout Route */}
            <Route path="/checkout/:orderId" element={<CheckoutPage />} />

            {/* Track Order Route */}
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/track-order/:orderId" element={<TrackOrder />} />

            {/* Help & Support Routes */}
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/customer-service" element={<CustomerService />} />

            {/* New Routes */}
            <Route path="/production" element={<ProductionPage />} />
            <Route path="/rnd" element={<RnDPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </>
  )
}

export default App
