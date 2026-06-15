import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import { CartProvider } from './context/CartContext'
import HomePage from './HomePage/HomePage'
import AboutUS from './AboutUS/AboutUS'
import Privacy from './Global/Privacy/Privacy'
import AuthPage from './pages/AuthPage'

import BlogPage from './pages/Blog/BlogPage'
import BlogDetailPage from './pages/Blog/BlogDetailPage'
// 
import Terms from './Global/Terms/Terms'
import ProductDetail from './components/ProductsDetail.tsx/ProductDetail'

import PaymentGate from './Global/Payment/PaymentGate'
// import PharmaProduct from './Products/PharmaProduct'
import ProductPage from './ProductPage/ProductPage'



import CheckoutPage from './ProductPage/CheckoutPage'
import TrackOrder from './ProductPage/TrackOrder'

import HelpCenter from './Global/HelpCenter/HelpCenter'
import CustomerService from './Global/CustomerService/CustomerService'
import ProductionPage from './pages/ProductionPage'
// import RnDPage from './pages/RnDPage'
import GalleryPage from './pages/GalleryPage'





import Organic from './Organic/Organic'
import Research from './components/Research/Research'

function App() {
  return (
    <>
      <CartProvider>
        <BrowserRouter>

     
          <Routes>
           
     
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />

            {/* Privacy Route */}
             <Route path="/privacy" element={<Privacy />} />
             <Route path="/terms" element={<Terms />} />

      {/* Product Detail Route */}
      <Route path="/product/:slug" element={<ProductDetail />} />

      {/* research route */}

      <Route path="/research" element={<Research/>}/>


{/* Payments */}
<Route path="/payment" element={<PaymentGate />} />

      {/* Blog Routes */}
<Route path="/blog" element={<BlogPage />} />
<Route path="/blog/:slug" element={<BlogDetailPage />} />  {/* dynamic URL */}
  <Route path="/aboutus" element={<AboutUS />} />



  <Route path="/aboutus" element={<AboutUS />} />

            {/* Product Page Route */}
            <Route path="/productpage" element={<ProductPage />} />
 
           
           {/* conditional rendeing  */}
 {/* <Route path="/organic" element={<OrganicPage/>} />

        <Route path="/herbal" element={<HerbalPage />} />

        <Route
          path="/nutraceutical"
          element={<NutraceuticalPage />}
        /> */}

        <Route path="/:category" element={<Organic />} />
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
            {/* <Route path="/rnd" element={<RnDPage />} /> */}
            <Route path="/gallery" element={<GalleryPage />} />
    </Routes>
    </BrowserRouter>
     
 {/* <div>
        <PharmaProduct />
      </div> */}
      
      
    
          
      </CartProvider>
    </>
  )
}

export default App
