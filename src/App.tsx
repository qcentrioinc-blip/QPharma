 
 
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage/LandingPage'
 
import Privacy from './Global/Privacy/Privacy'
import AuthPage from './pages/AuthPage'
import CookiePolicy from './Global/CookiePolicy/CookiePolicy'
import BlogPage from './pages/Blog/BlogPage'
import BlogDetailPage from './pages/Blog/BlogDetailPage'
import Contact from './Global/ContactPage/Contact'
import UserProfile from './components/UserProfile/UserProfile'

function App() {
 

  return (
    <>   
    <BrowserRouter>
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/contact" element={<Contact />} />

      {/* Privacy Route */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} /> 

{/* UserProfile */}
      <Route path="/profile" element={<UserProfile />} />

      {/* Blog Routes */}
<Route path="/blog" element={<BlogPage />} />
<Route path="/blog/:slug" element={<BlogDetailPage />} />  {/* dynamic URL */}
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
