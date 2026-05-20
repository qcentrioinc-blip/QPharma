 
 
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage/LandingPage'
 
import Privacy from './Global/Privacy/Privacy'
import AuthPage from './pages/AuthPage'

function App() {
 

  return (
    <>   
    <BrowserRouter>
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />

      {/* Privacy Route */}
      <Route path="/privacy" element={<Privacy />} /> 
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
