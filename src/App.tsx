import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import AboutUS from './AboutUS/AboutUS'
import LandingPage from './components/LandingPage/LandingPage'
import Privacy from './Global/Privacy/Privacy'
import AuthPage from './pages/AuthPage'
import PharmaProduct from './Products/PharmaProduct'

function App() {
  return (
    <>
      <div>
        <PharmaProduct />
      </div>

      <BrowserRouter>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Privacy Route */}
          <Route path="/privacy" element={<Privacy />} />

          {/* AboutUS Route */}
          <Route path="/aboutus" element={<AboutUS />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
