import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.04 6.04a7.5 7.5 0 0 0 10.61 10.61Z"
    />
  </svg>
);

const BagIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M7 7V6a5 5 0 0 1 10 0v1h1.25A1.75 1.75 0 0 1 20 8.75v9.5A1.75 1.75 0 0 1 18.25 20h-12.5A1.75 1.75 0 0 1 4 18.25v-9.5A1.75 1.75 0 0 1 5.75 7H7Zm2 0h6V6a3 3 0 1 0-6 0v1Zm-1.5 3a1 1 0 0 0-1 1v.5a1 1 0 1 0 2 0V11a1 1 0 0 0-1-1Zm9 0a1 1 0 0 0-1 1v.5a1 1 0 1 0 2 0V11a1 1 0 0 0-1-1Z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

interface ProductProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Product({ searchQuery, onSearchChange }: ProductProps) {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Help Center", path: "/help-center" },
    { name: "Customer Service", path: "/customer-service" }
  ];
  const { totalItems } = useCart();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Close mobile search on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleClear = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  return (
    <header className="w-full bg-[#f7f6f3]">
      <div className="mx-auto flex min-h-[155px] w-full max-w-[1292px] items-center justify-between px-6 sm:px-10 md:px-[72px]">
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center rounded-full bg-[#d8e0e5] px-[28px] py-[22px]"
        >
          <ul className="flex items-center gap-[22px]">
            {navItems.map((item, index) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex h-[32px] items-center justify-center rounded-full text-[16px] leading-none transition-all duration-200 ${index === 0
                    ? "bg-[#0d6a88] px-[18px] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                    : "bg-transparent px-0 text-black hover:text-[#0d6a88]"
                    }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:hidden flex items-center gap-2 rounded-full bg-[#d8e0e5] px-3 py-2">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.path}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${index === 0
                ? "bg-[#0d6a88] text-white"
                : "text-black hover:text-[#0d6a88]"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-[34px] font-bold leading-none tracking-[0.2px] text-black [font-family:Georgia,'Times_New_Roman',serif]">
            Q - Pharma
          </h1>
        </div>

        <div className="flex items-center gap-[16px]">
          {/* Desktop search */}
          <div className="hidden md:flex h-[33px] w-[382px] items-center rounded-full bg-[#d8e0e5] pl-[28px] pr-[16px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0d6a88]/30 focus-within:bg-[#d0dae0]">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-full w-full bg-transparent text-[15px] text-[#333] placeholder:text-[#9aa6ad] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="mr-2 flex shrink-0 items-center justify-center rounded-full p-1 text-[#888] transition-colors hover:bg-[#c5cdd2] hover:text-[#333]"
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}
            <button
              aria-label="Search"
              className="ml-1 flex shrink-0 items-center justify-center text-black"
            >
              <SearchIcon className="h-[20px] w-[20px]" />
            </button>
          </div>

          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden flex h-[24px] w-[24px] items-center justify-center text-black"
            aria-label="Toggle search"
          >
            <SearchIcon className="h-[20px] w-[20px]" />
          </button>

          {/* Cart button with badge */}
          <button
            aria-label="Shopping bag"
            className="relative flex h-[36px] w-[36px] items-center justify-center rounded-full text-black transition-all duration-200 hover:bg-[#d8e0e5]"
          >
            <BagIcon className="h-[19px] w-[19px]" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#e63946] px-1 text-[11px] font-bold leading-none text-white shadow-[0_2px_6px_rgba(230,57,70,0.4)] animate-[cartBadgePop_0.3s_ease]">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${mobileSearchOpen ? "max-h-[70px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 pb-4">
          <div className="flex h-[42px] items-center rounded-full bg-[#d8e0e5] px-4">
            <SearchIcon className="h-[18px] w-[18px] shrink-0 text-[#9aa6ad]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="ml-3 h-full w-full bg-transparent text-[14px] text-[#333] placeholder:text-[#9aa6ad] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="flex shrink-0 items-center justify-center rounded-full p-1 text-[#888] hover:text-[#333]"
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cartBadgePop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </header>
  );
}