import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  return (
    <nav className="w-full bg-teal-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Left — Nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="bg-teal-600 text-white text-sm font-medium px-3 py-1.5 rounded"
            >
              Home
            </Link>
            <Link
              to="/help"
              className="text-white text-sm font-medium px-3 py-1.5 hover:bg-teal-500 rounded transition"
            >
              Help Center
            </Link>
            <Link
              to="/customer-service"
              className="text-white text-sm font-medium px-3 py-1.5 hover:bg-teal-500 rounded transition"
            >
              Customer Service
            </Link>
          </div>

          {/* Center — Brand */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-lg font-bold text-white tracking-wide whitespace-nowrap">
              Q - Pharma
            </Link>
          </div>

          {/* Right — Search + Icons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Search bar (desktop) */}
            <div className="hidden sm:flex items-center bg-white rounded overflow-hidden border border-teal-200">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm px-3 py-1 w-40 lg:w-56 outline-none text-gray-700"
              />
              <button className="px-2 py-1 text-gray-500 hover:text-teal-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>

            {/* Search icon (mobile) */}
            <button
              className="sm:hidden text-white hover:text-teal-100 transition"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>

            {/* Cart */}
            <button className="text-white hover:text-teal-100 transition relative" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13H5.4M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </button>

            {/* User */}
            <button  onClick={() => navigate('/signup')} className="text-white hover:text-teal-100 transition" aria-label="Account">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8.966 8.966 0 0 1 12 15c2.21 0 4.231.8 5.879 2.11M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
            </button>

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden text-white hover:text-teal-100 transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="sm:hidden pb-2">
            <div className="flex items-center bg-white rounded overflow-hidden border border-teal-200">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm px-3 py-1.5 flex-1 outline-none text-gray-700"
              />
              <button className="px-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            <Link to="/" onClick={() => setMenuOpen(false)}
              className="text-white text-sm font-medium px-3 py-2 hover:bg-teal-500 rounded transition">
              Home
            </Link>
            <Link to="/help" onClick={() => setMenuOpen(false)}
              className="text-white text-sm font-medium px-3 py-2 hover:bg-teal-500 rounded transition">
              Help Center
            </Link>
            <Link to="/customer-service" onClick={() => setMenuOpen(false)}
              className="text-white text-sm font-medium px-3 py-2 hover:bg-teal-500 rounded transition">
              Customer Service
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar