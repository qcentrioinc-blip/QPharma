import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../Global/Navbar";
import Footer from "../Global/Footer";

const svgToDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const herbalBottle = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 250">
  <defs>
    <linearGradient id="hb" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8FC44B"/>
      <stop offset="100%" stop-color="#5A9A2A"/>
    </linearGradient>
    <linearGradient id="hl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4AD25B"/>
      <stop offset="100%" stop-color="#1F9C3E"/>
    </linearGradient>
    <filter id="hs" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#6a7a5f" flood-opacity="0.18"/>
    </filter>
  </defs>
  <g filter="url(#hs)">
    <ellipse cx="135" cy="218" rx="68" ry="10" fill="#d5dcc9"/>
    <rect x="78" y="48" width="116" height="132" rx="18" fill="#e8f0d8"/>
    <rect x="78" y="80" width="116" height="78" fill="url(#hb)"/>
    <rect x="90" y="18" width="92" height="36" rx="8" fill="#5e7a50"/>
    <rect x="84" y="42" width="104" height="12" rx="4" fill="#93a882"/>
    <rect x="112" y="92" width="20" height="52" fill="#e8e8e8"/>
    <rect x="96" y="108" width="52" height="20" fill="#e8e8e8"/>
  </g>
  <g filter="url(#hs)">
    <ellipse cx="223" cy="208" rx="50" ry="9" fill="#d1dbc8"/>
    <path d="M199 128C219 104 242 104 258 124C251 157 230 180 199 182C190 160 189 143 199 128Z" fill="url(#hl)"/>
    <path d="M165 147C191 129 214 136 226 158C218 186 195 204 166 198C156 176 156 159 165 147Z" fill="#17973C"/>
    <path d="M207 166C226 139 253 139 272 157C270 189 252 208 222 212C207 201 201 186 207 166Z" fill="#0D8B37"/>
  </g>
</svg>
`);

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-[#7d838a]" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21c-.3 0-.6-.1-.8-.3C5.3 15.6 2 12.6 2 8.8 2 6 4.2 4 7 4c1.8 0 3.5.9 4.5 2.3C12.5 4.9 14.2 4 16 4c2.8 0 5 2 5 4.8 0 3.8-3.3 6.8-9.2 11.9-.2.2-.5.3-.8.3Z" />
    </svg>
);

const ShareIcon = () => (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-[#7d838a]" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3h7v7h-2V6.41l-8.29 8.3-1.42-1.42L17.59 5H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z" />
    </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
);

const NoResultsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-16 w-16 text-[#c2d1b2]">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const herbalProducts = [
    { id: 1, title: "Ashwagandha Root Extract Capsules", subtitle: "Herbal Supplement", price: "₹245.00", mrp: "₹499.00", save: "Save 50.90%" },
    { id: 2, title: "Tulsi Green Tea Immunity Blend", subtitle: "Herbal Tea", price: "₹189.00", mrp: "₹350.00", save: "Save 46.00%" },
    { id: 3, title: "Neem & Turmeric Face Wash", subtitle: "Herbal Skincare", price: "₹155.00", mrp: "₹299.00", save: "Save 48.16%" },
    { id: 4, title: "Brahmi Memory Booster Syrup", subtitle: "Herbal Tonic", price: "₹320.00", mrp: "₹650.00", save: "Save 50.77%" },
    { id: 5, title: "Amla Vitamin C Rich Tablets", subtitle: "Herbal Vitamin", price: "₹175.00", mrp: "₹399.00", save: "Save 56.14%" },
    { id: 6, title: "Triphala Digestive Support Powder", subtitle: "Herbal Digestive", price: "₹210.00", mrp: "₹450.00", save: "Save 53.33%" },
    { id: 7, title: "Shatavari Women's Health Capsules", subtitle: "Herbal Wellness", price: "₹290.00", mrp: "₹580.00", save: "Save 50.00%" },
    { id: 8, title: "Giloy Immunity Support Drops", subtitle: "Herbal Drops", price: "₹199.00", mrp: "₹420.00", save: "Save 52.62%" },
];

const titleFont = { fontFamily: '"Cormorant Garamond", Georgia, serif' };

export default function HerbalPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { addToCart } = useCart();
    const [addedProducts, setAddedProducts] = useState<Record<number, boolean>>({});

    const handleAddToCart = (product: typeof herbalProducts[0]) => {
        addToCart({
            id: product.id,
            title: product.title,
            subtitle: product.subtitle,
            price: product.price,
            mrp: product.mrp,
            save: product.save,
            category: "Herbal",
            image: herbalBottle,
        });

        // Show "Added" animation briefly
        setAddedProducts((prev) => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedProducts((prev) => ({ ...prev, [product.id]: false }));
        }, 800);
    };

    const filteredProducts = herbalProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8f7f3]">
            <Navbar />

            {/* Hero Banner */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#e8f5d8] via-[#d4eabc] to-[#c2e0a0] px-4 py-16 md:py-24">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-[#7D9851] blur-3xl" />
                    <div className="absolute right-[15%] top-[40%] h-40 w-40 rounded-full bg-[#4f7d22] blur-3xl" />
                </div>
                <div className="relative mx-auto max-w-[1180px] text-center">
                    <span className="mb-4 inline-block rounded-full bg-[#7D9851]/20 px-4 py-1.5 text-sm font-medium text-[#4f7d22]">
                        🌿 100% Natural Ingredients
                    </span>
                    <h1
                        style={titleFont}
                        className="mx-auto max-w-[800px] text-[38px] font-bold leading-[1.05] tracking-[-0.02em] text-[#1E4734] sm:text-[48px] md:text-[64px]"
                    >
                        Herbal Products
                    </h1>
                    <p className="mx-auto mt-5 max-w-[600px] text-[16px] leading-7 text-[#4a5a42] md:text-[18px]">
                        Discover the power of ancient Ayurvedic herbs, carefully sourced and
                        crafted to support your holistic well-being naturally.
                    </p>
                    <Link
                        to="/productpage"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#4f7d22] underline decoration-[#4f7d22]/40 underline-offset-4 transition hover:decoration-[#4f7d22]"
                    >
                        ← Back to All Products
                    </Link>
                </div>
            </section>

            {/* Search and Products Section */}
            <section className="w-full px-4 py-12 md:px-8">
                <div className="mx-auto max-w-[1180px]">
                    {/* Search Bar Container */}
                    <div className="mb-14 flex flex-col items-center">
                        <h2
                            style={titleFont}
                            className="mb-8 text-center text-[28px] font-semibold text-[#234936] md:text-[36px]"
                        >
                            Our Herbal Collection
                        </h2>

                        <div className="relative w-full max-w-[500px]">
                            <div className="group relative flex h-[54px] items-center rounded-2xl border border-[#d8e0cc] bg-white px-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 focus-within:border-[#7D9851] focus-within:shadow-[0_8px_20px_rgba(125,152,81,0.12)]">
                                <SearchIcon className="h-[20px] w-[20px] text-[#7D9851]" />
                                <input
                                    type="text"
                                    placeholder="Search herbal products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="ml-3 h-full w-full bg-transparent text-[16px] text-[#2c3e2e] placeholder:text-[#9fb39c] focus:outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#f0f4e8] text-[#7D9851] transition-colors hover:bg-[#7D9851] hover:text-white"
                                        aria-label="Clear search"
                                    >
                                        <CloseIcon />
                                    </button>
                                )}
                            </div>
                            {searchQuery && (
                                <p className="mt-3 text-center text-sm text-[#7a8c71]">
                                    Showing {filteredProducts.length} results for "{searchQuery}"
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <NoResultsIcon />
                            <p className="mt-5 text-[20px] font-semibold text-[#234936]">No products found</p>
                            <p className="mt-2 text-[15px] text-[#7a8c71]">Try searching for something else like "Ashwagandha" or "Tea"</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-6 text-[14px] font-medium text-[#7D9851] underline decoration-[#7D9851]/30 underline-offset-4 hover:decoration-[#7D9851]"
                            >
                                Clear search and see all products
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
                            {filteredProducts.map((product) => (
                                <article
                                    key={product.id}
                                    className="group mx-auto flex w-full max-w-[260px] flex-col rounded-2xl border border-[#e8e8e8] bg-white px-4 pb-4 pt-3 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                                >
                                    {/* Image + action icons */}
                                    <div className="relative mb-3 flex items-center justify-center rounded-xl bg-[#f5f6f2] px-3 py-4">
                                        <img
                                            src={herbalBottle}
                                            alt={product.title}
                                            className="h-[110px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute right-2 top-2 flex flex-col items-center gap-2">
                                            <button aria-label="Add to wishlist" className="rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110">
                                                <HeartIcon />
                                            </button>
                                            <button aria-label="Share product" className="rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110">
                                                <ShareIcon />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[#9a9a9a]">
                                        {product.subtitle}
                                    </p>

                                    <h3 className="mb-3 line-clamp-2 min-h-[36px] text-[15px] font-semibold leading-snug text-[#1b1b1b]">
                                        {product.title}
                                    </h3>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[18px] font-bold leading-none text-[#2a2a2a]">
                                                {product.price}
                                            </span>
                                            <span className="text-[12px] leading-none text-[#999999] line-through">
                                                {product.mrp}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[12px] font-medium leading-none text-[#4a8c2a]">
                                            {product.save}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className={`mt-auto flex h-[34px] items-center justify-center gap-2 rounded-full text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(114,181,77,0.25)] transition-all duration-200 active:scale-[0.98] ${addedProducts[product.id]
                                            ? "bg-[#4a8c2a] scale-[0.98]"
                                            : "bg-[linear-gradient(90deg,#5B9740_0%,#8ED460_100%)] hover:shadow-[0_6px_18px_rgba(114,181,77,0.35)] hover:brightness-[1.04]"
                                            }`}
                                    >
                                        {addedProducts[product.id] ? (
                                            <>
                                                <CheckIcon />
                                                Added!
                                            </>
                                        ) : (
                                            "Add To Cart"
                                        )}
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
