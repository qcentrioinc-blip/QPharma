import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
 
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
 
interface NavLinkItem {
  name: string;
  path: string;
  hasDropdown?: boolean;
}
 
interface ProductLink {
  name: string;
  path: string;
}

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------
const NAV_LINKS: NavLinkItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/productpage', hasDropdown: true },
  { name: 'R & D', path: '/research' },
  { name: 'Production', path: '/production' },
  { name: 'Get In Touch', path: '/contact' },
];
 
const PRODUCT_LINKS: ProductLink[] = [
  { name: 'Herbal', path: '/herbal' },
  { name: 'Nutraceutical', path: '/nutraceutical' },
  { name: 'Organic', path: '/organic' },
];
 
// Distance (px) from cursor to item center at which the dock effect has no influence
const DOCK_MAX_DISTANCE = 140;
// Peak scale applied to the item directly under the cursor
const DOCK_MAX_SCALE = 1.12;
// How far the item lifts (negative y) at peak scale
const DOCK_MAX_LIFT = -3;
// Delay (ms) before closing the dropdown after the pointer leaves, to avoid flicker
// when crossing the small gap between the trigger and the panel.
const DROPDOWN_CLOSE_DELAY = 150;
 
// ---------------------------------------------------------------------------
// Dock-style nav item (macOS application-bar hover feel)
// ---------------------------------------------------------------------------
 
interface DockNavItemProps {
  link: NavLinkItem;
  isActive: boolean;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  onOpenDropdown?: () => void;
  onCloseDropdown?: () => void;
  isDropdownOpen?: boolean;
}
 
const DockNavItem = ({
  link,
  isActive,
  mouseX,
  onOpenDropdown,
  onCloseDropdown,
  isDropdownOpen,
}: DockNavItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
 
  const distance = useTransform(mouseX, (value) => {
    const bounds = itemRef.current?.getBoundingClientRect();
    if (!bounds) return DOCK_MAX_DISTANCE;
    const center = bounds.left + bounds.width / 2;
    return value - center;
  });
 
  const scaleRaw = useTransform(
    distance,
    [-DOCK_MAX_DISTANCE, 0, DOCK_MAX_DISTANCE],
    [1, DOCK_MAX_SCALE, 1]
  );
  const liftRaw = useTransform(
    distance,
    [-DOCK_MAX_DISTANCE, 0, DOCK_MAX_DISTANCE],
    [0, DOCK_MAX_LIFT, 0]
  );
 
  const scale = useSpring(scaleRaw, { mass: 0.1, stiffness: 200, damping: 14 });
  const y = useSpring(liftRaw, { mass: 0.1, stiffness: 200, damping: 14 });
 
  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={() => link.hasDropdown && onOpenDropdown?.()}
      onMouseLeave={() => link.hasDropdown && onCloseDropdown?.()}
    >
      <motion.div style={{ scale, y }} className="relative">
        <Link
          to={link.path}
          aria-haspopup={link.hasDropdown ? 'menu' : undefined}
          aria-expanded={link.hasDropdown ? isDropdownOpen : undefined}
          className={`
            relative flex items-center gap-1 px-3 xl:px-6 py-2.5 rounded-full text-[13px] xl:text-[14.5px]
            font-medium whitespace-nowrap transition-colors duration-300
            ${isActive ? 'text-white' : 'text-[#4A4B4F] hover:text-black'}
          `}
        >
          {isActive && (
            <motion.span
              layoutId="nav-active-pill"
              className="absolute inset-0 -z-10 rounded-full bg-[#2D2E32]"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
          {link.name}
          {link.hasDropdown && (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </Link>
      </motion.div>
 
      {link.hasDropdown && (
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              // pt-3 (instead of a margin gap) keeps the hoverable region continuous
              // between the trigger and the panel so the dropdown doesn't flicker shut.
              className="absolute top-full left-0 pt-3 w-48 origin-top"
            >
              <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                {PRODUCT_LINKS.map((product) => (
                  <Link
                    key={product.path}
                    to={product.path}
                    role="menuitem"
                    className="block px-5 py-3 text-sm text-[#4A4B4F] hover:bg-gray-50 hover:text-black transition-colors font-medium"
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
 
// ---------------------------------------------------------------------------
// Mobile menu
// ---------------------------------------------------------------------------
 
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
}
 
const MobileMenu = ({ isOpen, onClose, activePath }: MobileMenuProps) => {
  const [productsExpanded, setProductsExpanded] = useState(false);
 
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="xl:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl mt-2 shadow-lg border border-gray-100"
        >
          <div className="flex flex-col p-3">
            {/* Search - mobile */}
            <div className="flex items-center bg-[#F1F3F4] rounded-full px-4 py-2.5 mb-2 sm:hidden">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent text-[14px] w-full outline-none text-black placeholder:text-[#80868B] font-medium"
              />
              <Search className="w-[18px] h-[18px] text-[#5F6368]" />
            </div>
 
            {NAV_LINKS.map((link) => {
              const isActive = activePath === link.path;
 
              if (link.hasDropdown) {
                return (
                  <div key={link.name}>
                    <button
                      type="button"
                      onClick={() => setProductsExpanded((prev) => !prev)}
                      aria-expanded={productsExpanded}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                        isActive ? 'bg-[#2D2E32] text-white' : 'text-[#4A4B4F] hover:bg-[#F1F3F4]'
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          productsExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {productsExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-4"
                        >
                          {PRODUCT_LINKS.map((product) => (
                            <Link
                              key={product.path}
                              to={product.path}
                              onClick={onClose}
                              className="block px-4 py-2.5 text-sm text-[#4A4B4F] hover:text-black"
                            >
                              {product.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
 
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className={`px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                    isActive ? 'bg-[#2D2E32] text-white' : 'text-[#4A4B4F] hover:bg-[#F1F3F4]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
 
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
              <Link
                to="/payment"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-[15px] font-medium text-[#4A4B4F] hover:bg-[#F1F3F4] flex-1"
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                Cart
              </Link>
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-[15px] font-medium text-[#4A4B4F] hover:bg-[#F1F3F4] flex-1"
              >
                <User className="w-[18px] h-[18px]" />
                Account
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
 
// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
 
const Navbar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const location = useLocation();
 
  const pillRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 
  // Motion value driving the dock hover effect; parked far offscreen so items
  // sit at rest scale until the pointer actually enters the pill.
  const mouseX = useMotionValue(Infinity);
 
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
 
  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };
 
  const openProductsDropdown = () => {
    clearCloseTimeout();
    setIsProductsOpen(true);
  };
 
  const scheduleCloseProductsDropdown = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, DROPDOWN_CLOSE_DELAY);
  };
 
  // Close dropdown + mobile menu on route change
  useEffect(() => {
    setIsProductsOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
 
  // Close the products dropdown on outside click and on Escape
  useEffect(() => {
    if (!isProductsOpen) return;
 
    const handleClickOutside = (event: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
    };
 
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProductsOpen(false);
    };
 
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProductsOpen]);
 
  useEffect(() => clearCloseTimeout, []);
 
  return (
    <nav className="w-full bg-transparent backdrop-blur-md fixed top-0 z-[100] px-4 md:px-8 py-2">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Left - Navigation Pill (desktop / xl+) */}
        <div
          ref={pillRef}
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="hidden xl:flex items-center bg-[#F1F3F4] rounded-full px-1.5 py-1 shadow-sm"
        >
          {NAV_LINKS.map((link) => (
            <DockNavItem
              key={link.name}
              link={link}
              isActive={location.pathname === link.path}
              mouseX={mouseX}
              isDropdownOpen={link.hasDropdown && isProductsOpen}
              onOpenDropdown={openProductsDropdown}
              onCloseDropdown={scheduleCloseProductsDropdown}
            />
          ))}
        </div>
 
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          className="xl:hidden p-2.5 text-black hover:bg-[#F1F3F4] rounded-full transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
 
        {/* Center - Zephyr Logo */}
        <div className="flex-shrink-0 flex justify-center xl:absolute xl:left-1/2 xl:-translate-x-1/2">
          <Link to="/">
            <img
              src="/Global/Logo.png"
              alt="Zephyr Logo"
              className="h-10 sm:h-12 md:h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
 
        {/* Right - Actions (desktop) */}
        <div className="hidden sm:flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-[#F1F3F4] rounded-full px-4 py-2.5 w-[140px] lg:w-[180px] xl:w-[280px] group focus-within:bg-[#E8EAED] transition-all duration-300">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-[14px] w-full outline-none text-black placeholder:text-[#80868B] font-medium"
            />
            <Search className="w-[18px] h-[18px] text-[#5F6368] group-hover:text-black transition-colors" />
          </div>
 
          <div className="flex items-center gap-2">
            <Link
              to="/payment"
              className="p-3 text-black hover:bg-[#F1F3F4] rounded-full transition-all relative group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-[22px] h-[22px]" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm transform group-hover:scale-110">
                  {itemCount}
                </span>
              )}
            </Link>
 
            <Link
              to="/login"
              className="p-3 text-black hover:bg-[#F1F3F4] rounded-full transition-all"
              aria-label="User Profile"
            >
              <User className="w-[22px] h-[22px]" />
            </Link>
          </div>
        </div>
 
        {/* Right - Actions (compact, below sm: cart icon only, rest lives in mobile menu) */}
        <div className="flex sm:hidden items-center">
          <Link
            to="/payment"
            className="p-2.5 text-black hover:bg-[#F1F3F4] rounded-full transition-all relative"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-[20px] h-[20px]" />
            {itemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
 
      {/* Mobile dropdown panel */}
      <div className="max-w-[1440px] mx-auto">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activePath={location.pathname}
        />
      </div>
    </nav>
  );
};
 
export default Navbar;
 
