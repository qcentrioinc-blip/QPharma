import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [productsOpen, setProductsOpen] = useState(false);
  const { items } = useCart();
  const location = useLocation();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products +', path: '/productpage', hasDropdown: true },
    { name: 'R & D', path: '/research' },
    { name: 'Production', path: '/production' },
    { name: 'Get In Touch', path: '/contact' },
  ];

  return (
    <nav className="w-full bg-transparent backdrop-blur-md fixed top-0 z-[100] px-4 md:px-8 py-2  ">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">

        {/* Left - Navigation Pill */}
        <div className="hidden xl:flex items-center bg-[#F1F3F4] rounded-full px-1.5 py-1 shadow-sm">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <div key={link.name} className="relative group">
                <Link
                  to={link.path}
                  className={`
                                        flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[14.5px] font-medium transition-all duration-300
                                        ${isActive
                      ? 'bg-[#2D2E32] text-white'
                      : 'text-[#4A4B4F] hover:text-black'
                    }
                                    `}
                  onMouseEnter={() => link.hasDropdown && setProductsOpen(true)}
                >
                  {link.name}
                </Link>

                {/* Simple Dropdown for Products */}
                {link.hasDropdown && productsOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                    onMouseLeave={() => setProductsOpen(false)}
                  >
                    <Link to="/herbal" className="block px-5 py-3 text-sm text-[#4A4B4F] hover:bg-gray-50 hover:text-black transition-colors font-medium">Herbal</Link>
                    <Link to="/nutraceutical" className="block px-5 py-3 text-sm text-[#4A4B4F] hover:bg-gray-50 hover:text-black transition-colors font-medium">Nutraceutical</Link>
                    <Link to="/organic" className="block px-5 py-3 text-sm text-[#4A4B4F] hover:bg-gray-50 hover:text-black transition-colors font-medium">Organic</Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Center - Zephyr Logo */}
        <div className="flex-shrink-0 flex justify-center">
          <Link to="/">
            <img
              src="/Global/Logo.png"
              alt="Zephyr Logo"
              className="h-12 md:h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search Bar Pill */}
          <div className="hidden sm:flex items-center bg-[#F1F3F4] rounded-full px-5 py-2.5 w-[200px] md:w-[280px] group focus-within:bg-[#E8EAED] transition-all duration-300">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-[14px] w-full outline-none text-black placeholder:text-[#80868B] font-medium"
            />
            <Search className="w-[18px] h-[18px] text-[#5F6368] group-hover:text-black transition-colors" />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <button
              className="p-3 text-black hover:bg-[#F1F3F4] rounded-full transition-all relative group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-[22px] h-[22px]" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm transform group-hover:scale-110">
                  {itemCount}
                </span>
              )}
            </button>

            <Link
              to="/login"
              className="p-3 text-black hover:bg-[#F1F3F4] rounded-full transition-all"
              aria-label="User Profile"
            >
              <User className="w-[22px] h-[22px]" />
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
