import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';

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
  { name: 'Products', path: '', hasDropdown: true },
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
const DOCK_MAX_SCALE = 1.08;
// How far the item lifts (negative y) at peak scale
const DOCK_MAX_LIFT = -2;
// Delay (ms) before closing the dropdown after the pointer leaves, to avoid flicker
// when crossing the small gap between the trigger and the panel.
const DROPDOWN_CLOSE_DELAY = 150;
// Scroll distance (px) after which the pill/nav chrome is considered "scrolled"
const SCROLL_THRESHOLD = 12;

// A single, restrained easing curve used everywhere so every transition in the
// bar feels like it belongs to the same system (quint-out — fast start, soft landing).
const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

// Springs tuned for a tight, controlled feel rather than a bouncy one.
// Higher damping relative to stiffness removes overshoot/jitter.
const SPRING_SNAPPY = { type: 'spring', stiffness: 420, damping: 38, mass: 0.7 } as const;
const SPRING_SOFT = { type: 'spring', stiffness: 300, damping: 32, mass: 0.6 } as const;

// ---------------------------------------------------------------------------
// Scroll position hook (used to give the bar depth once the page moves)
// ---------------------------------------------------------------------------

const useScrolled = (threshold: number) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
};

// ---------------------------------------------------------------------------
// Dock-style nav item (macOS application-bar hover feel)
// ---------------------------------------------------------------------------

interface DockNavItemProps {
  link: NavLinkItem;
  isActive: boolean;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  reduceMotion: boolean;
  onOpenDropdown?: () => void;
  onCloseDropdown?: () => void;
  isDropdownOpen?: boolean;
}

const DockNavItem = ({
  link,
  isActive,
  mouseX,
  reduceMotion,
  onOpenDropdown,
  onCloseDropdown,
  isDropdownOpen,
}: DockNavItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (value) => {
    if (reduceMotion) return DOCK_MAX_DISTANCE;
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

  // Tighter spring: higher stiffness/damping ratio kills the "jelly" wobble
  // that made the original dock effect feel unpolished.
  const scale = useSpring(scaleRaw, { mass: 0.15, stiffness: 420, damping: 32 });
  const y = useSpring(liftRaw, { mass: 0.15, stiffness: 420, damping: 32 });

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
            relative z-10 flex items-center gap-1 px-3 xl:px-6 py-2.5 rounded-full text-[13px] xl:text-[14.5px]
            font-medium whitespace-nowrap transition-all duration-300 ease-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2
            ${isActive ? 'text-white font-semibold' : 'text-[#4A4B4F] hover:text-black'}
          `}
        >
          {isActive && (
            <motion.span
              layoutId="nav-active-pill"
              className="absolute inset-0 z-0 rounded-full bg-[#111315] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
              transition={SPRING_SNAPPY}
            />
          )}
          <span className="relative z-10">{link.name}</span>
          {link.hasDropdown && (
            <motion.span
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="flex"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.span>
          )}
        </Link>
      </motion.div>

      {link.hasDropdown && (
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE_PREMIUM }}
              // pt-3 (instead of a margin gap) keeps the hoverable region continuous
              // between the trigger and the panel so the dropdown doesn't flicker shut.
              className="absolute top-full left-0 pt-3 w-48 origin-top"
            >
              <div className="bg-white border border-gray-100 rounded-xl shadow-xl shadow-black/5 overflow-hidden">
                {PRODUCT_LINKS.map((product, index) => (
                  <motion.div
                    key={product.path}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: index * 0.03, ease: EASE_PREMIUM }}
                  >
                    <Link
                      to={product.path}
                      role="menuitem"
                      className="block px-5 py-3 text-sm text-[#4A4B4F] hover:bg-gray-50 hover:text-black transition-colors font-medium"
                    >
                      {product.name}
                    </Link>
                  </motion.div>
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
// Morphing menu button (two bars that rotate/cross into an X, instead of an
// icon swap — the continuity of motion reads as far more deliberate).
// ---------------------------------------------------------------------------

interface MenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuToggle = ({ isOpen, onClick }: MenuToggleProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
    className="xl:hidden relative w-10 h-10 flex items-center justify-center text-black hover:bg-[#F1F3F4] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
  >
    <motion.span
      className="absolute block w-5 h-[1.5px] bg-current rounded-full"
      animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -4 }}
      transition={{ duration: 0.28, ease: EASE_PREMIUM }}
    />
    <motion.span
      className="absolute block w-5 h-[1.5px] bg-current rounded-full"
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={{ duration: 0.15, ease: EASE_PREMIUM }}
    />
    <motion.span
      className="absolute block w-5 h-[1.5px] bg-current rounded-full"
      animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 4 }}
      transition={{ duration: 0.28, ease: EASE_PREMIUM }}
    />
  </button>
);

// ---------------------------------------------------------------------------
// Mobile menu
// ---------------------------------------------------------------------------

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
  activePath: string;
}

const MobileMenu = ({ isOpen, onClose, onOpenCart, activePath }: MobileMenuProps) => {
  const [productsExpanded, setProductsExpanded] = useState(false);

  // Collapse the products sub-list whenever the sheet itself closes, so it
  // doesn't reopen already-expanded next time.
  useEffect(() => {
    if (!isOpen) setProductsExpanded(false);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32, ease: EASE_PREMIUM }}
          className="xl:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl mt-2 shadow-xl shadow-black/5 border border-gray-100"
        >
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.28, delay: 0.05, ease: EASE_PREMIUM }}
            className="flex flex-col p-3"
          >
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
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
                        isActive ? 'bg-[#2D2E32] text-white' : 'text-[#4A4B4F] hover:bg-[#F1F3F4]'
                      }`}
                    >
                      {link.name}
                      <motion.span
                        animate={{ rotate: productsExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                        className="flex"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {productsExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.24, ease: EASE_PREMIUM }}
                          className="overflow-hidden pl-4"
                        >
                          {PRODUCT_LINKS.map((product) => (
                            <Link
                              key={product.path}
                              to={product.path}
                              onClick={onClose}
                              className="block px-4 py-2.5 text-sm text-[#4A4B4F] hover:text-black transition-colors"
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
                  className={`px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
                    isActive ? 'bg-[#2D2E32] text-white' : 'text-[#4A4B4F] hover:bg-[#F1F3F4]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-[15px] font-medium text-[#4A4B4F] hover:bg-[#F1F3F4] flex-1 transition-colors"
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                Cart
              </button>
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-[15px] font-medium text-[#4A4B4F] hover:bg-[#F1F3F4] flex-1 transition-colors"
              >
                <User className="w-[18px] h-[18px]" />
                Account
              </Link>
            </div>
          </motion.div>
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
  const { items, isCartOpen, openCart, closeCart } = useCart();
  const location = useLocation();
  const reduceMotion = Boolean(useReducedMotion());
  const scrolled = useScrolled(SCROLL_THRESHOLD);

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

  useEffect(() => {
    const handleOpenCart = () => openCart('cart');
    window.addEventListener('qpharma:open-cart', handleOpenCart);
    return () => window.removeEventListener('qpharma:open-cart', handleOpenCart);
  }, [openCart]);

  return (
  <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled ? '#ffffff' : '#ffffff',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.06)' : '0 0 0 rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
      className="w-full fixed top-0 z-[100] px-4 md:px-8 py-2"
    >
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
              reduceMotion={reduceMotion}
              isDropdownOpen={link.hasDropdown && isProductsOpen}
              onOpenDropdown={openProductsDropdown}
              onCloseDropdown={scheduleCloseProductsDropdown}
            />
          ))}
        </div>

        {/* Mobile menu trigger */}
        <MenuToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen((prev) => !prev)} />

        {/* Center - Zephyr Logo */}
        <div className="flex-shrink-0 flex justify-center xl:absolute xl:left-1/2 xl:-translate-x-1/2">
          <Link to="/">
            <motion.img
              src="/Global/Logo.png"
              alt="Zephyr Logo"
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="h-10 sm:h-12 md:h-15 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right - Actions (desktop) */}
        <div className="hidden sm:flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-[#F1F3F4] rounded-full px-4 py-2.5 w-[140px] lg:w-[180px] xl:w-[280px] group focus-within:bg-[#E8EAED] transition-colors duration-300">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-[14px] w-full outline-none text-black placeholder:text-[#80868B] font-medium"
            />
            <Search className="w-[18px] h-[18px] text-[#5F6368] group-hover:text-black transition-colors" />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openCart('cart')}
              className="p-3 text-black hover:bg-[#F1F3F4] rounded-full transition-colors relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-[22px] h-[22px]" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={SPRING_SOFT}
                    className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Link
              to="/login"
              className="p-3 text-black hover:bg-[#F1F3F4] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              aria-label="User Profile"
            >
              <User className="w-[22px] h-[22px]" />
            </Link>
          </div>
        </div>

        {/* Right - Actions (compact, below sm: cart icon only, rest lives in mobile menu) */}
        <div className="flex sm:hidden items-center">
          <button
            type="button"
            onClick={() => openCart('cart')}
            className="p-2.5 text-black hover:bg-[#F1F3F4] rounded-full transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-[20px] h-[20px]" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={SPRING_SOFT}
                  className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <div className="max-w-[1440px] mx-auto">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onOpenCart={() => {
            setIsMobileMenuOpen(false);
            openCart('cart');
          }}
          activePath={location.pathname}
        />
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </motion.nav>
  );
};

export default Navbar;