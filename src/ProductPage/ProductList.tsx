import { useState } from "react";
import { useCart } from "../context/CartContext";

const svgToDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const productBottle = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 250">
  <defs>
    <linearGradient id="bodyBlue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#54B8FF"/>
      <stop offset="100%" stop-color="#2493EA"/>
    </linearGradient>
    <linearGradient id="leafA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4AD25B"/>
      <stop offset="100%" stop-color="#1F9C3E"/>
    </linearGradient>
    <linearGradient id="leafB" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1EB14B"/>
      <stop offset="100%" stop-color="#0D8B37"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#7f8a8f" flood-opacity="0.18"/>
    </filter>
  </defs>

  <g filter="url(#shadow)">
    <ellipse cx="135" cy="218" rx="68" ry="10" fill="#d9dde0"/>
    <rect x="78" y="48" width="116" height="132" rx="18" fill="#d7e7f5"/>
    <rect x="78" y="80" width="116" height="78" fill="url(#bodyBlue)"/>
    <rect x="90" y="18" width="92" height="36" rx="8" fill="#5e7690"/>
    <rect x="84" y="42" width="104" height="12" rx="4" fill="#93a4b8"/>
    <rect x="112" y="92" width="20" height="52" fill="#e8e8e8"/>
    <rect x="96" y="108" width="52" height="20" fill="#e8e8e8"/>

    <rect x="90" y="18" width="7" height="36" fill="#516a82" opacity="0.55"/>
    <rect x="105" y="18" width="7" height="36" fill="#516a82" opacity="0.55"/>
    <rect x="120" y="18" width="7" height="36" fill="#516a82" opacity="0.55"/>
    <rect x="135" y="18" width="7" height="36" fill="#516a82" opacity="0.55"/>
    <rect x="150" y="18" width="7" height="36" fill="#516a82" opacity="0.55"/>
    <rect x="165" y="18" width="7" height="36" fill="#516a82" opacity="0.55"/>
  </g>

  <g filter="url(#shadow)">
    <ellipse cx="223" cy="208" rx="50" ry="9" fill="#d8ddd9"/>
    <path d="M199 128C219 104 242 104 258 124C251 157 230 180 199 182C190 160 189 143 199 128Z" fill="url(#leafA)"/>
    <path d="M165 147C191 129 214 136 226 158C218 186 195 204 166 198C156 176 156 159 165 147Z" fill="url(#leafB)"/>
    <path d="M207 166C226 139 253 139 272 157C270 189 252 208 222 212C207 201 201 186 207 166Z" fill="#17973C"/>
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

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
  </svg>
);

const CartPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.18 3H17.25a.75.75 0 0 1 .727.936l-2.5 9A.75.75 0 0 1 14.75 13.5H6.5a.75.75 0 0 1-.727-.564L3.345 3H1.75A.75.75 0 0 1 1 1.75ZM5.656 5l1.944 7h6.594l1.944-7H5.656Z" />
    <path d="M8 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
  </svg>
);

const SearchResultIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-16 w-16 text-[#c5c9cc]">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const categories = [
  {
    id: "herbal",
    label: "Herbal",
    activeBg: "bg-[#E6E7D9] text-[#111111] border border-transparent",
    inactiveBg: "bg-transparent text-[#111111] border border-[#C5CDB0]",
  },
  {
    id: "nutraceutical",
    label: "Nutraceutical",
    activeBg: "bg-[#D4EEEF] text-[#111111] border border-transparent",
    inactiveBg: "bg-transparent text-[#111111] border border-[#9ED8DA]",
  },
  {
    id: "organic",
    label: "Organic",
    activeBg: "bg-[#F0E6CE] text-[#111111] border border-transparent",
    inactiveBg: "bg-transparent text-[#111111] border border-[#E3C98E]",
  },
];

const herbalProducts = [
  { id: 1, title: "Ashwagandha Root Extract Capsules", subtitle: "Herbal Supplement", price: "₹245.00", mrp: "₹499.00", save: "Save 50.90%" },
  { id: 2, title: "Tulsi Green Tea Immunity Blend", subtitle: "Herbal Tea", price: "₹189.00", mrp: "₹350.00", save: "Save 46.00%" },
  { id: 3, title: "Neem & Turmeric Face Wash", subtitle: "Herbal Skincare", price: "₹155.00", mrp: "₹299.00", save: "Save 48.16%" },
  { id: 4, title: "Brahmi Memory Booster Syrup", subtitle: "Herbal Tonic", price: "₹320.00", mrp: "₹650.00", save: "Save 50.77%" },
  { id: 5, title: "Amla Vitamin C Rich Tablets", subtitle: "Herbal Vitamin", price: "₹175.00", mrp: "₹399.00", save: "Save 56.14%" },
  { id: 6, title: "Triphala Digestive Support Powder", subtitle: "Herbal Digestive", price: "₹210.00", mrp: "₹450.00", save: "Save 53.33%" },
  { id: 7, title: "Shatavari Women's Health Capsules", subtitle: "Herbal Wellness", price: "₹175.00", mrp: "₹580.00", save: "Save 50.00%" },
  { id: 8, title: "Giloy Immunity Support Drops", subtitle: "Herbal Drops", price: "₹199.00", mrp: "₹420.00", save: "Save 52.62%" },
];

const nutraceuticalProducts = [
  { id: 1, title: "Omega-3 Fish Oil Softgel Capsules", subtitle: "Heart Health", price: "₹399.00", mrp: "₹799.00", save: "Save 50.06%" },
  { id: 2, title: "Collagen Peptides Beauty Powder", subtitle: "Skin & Hair", price: "₹549.00", mrp: "₹1099.00", save: "Save 50.05%" },
  { id: 3, title: "Multivitamin Daily Health Tablets", subtitle: "Daily Nutrition", price: "₹275.00", mrp: "₹550.00", save: "Save 50.00%" },
  { id: 4, title: "Biotin 10000mcg Hair Growth Caps", subtitle: "Hair Supplement", price: "₹345.00", mrp: "₹699.00", save: "Save 50.64%" },
  { id: 5, title: "Probiotics 50 Billion CFU Capsules", subtitle: "Gut Health", price: "₹425.00", mrp: "₹850.00", save: "Save 50.00%" },
  { id: 6, title: "Vitamin D3 + K2 Sunshine Drops", subtitle: "Bone Health", price: "₹310.00", mrp: "₹620.00", save: "Save 50.00%" },
  { id: 7, title: "Whey Protein Isolate Chocolate", subtitle: "Sports Nutrition", price: "₹1299.00", mrp: "₹2499.00", save: "Save 48.02%" },
  { id: 8, title: "CoQ10 Antioxidant Heart Support", subtitle: "Antioxidant", price: "₹475.00", mrp: "₹950.00", save: "Save 50.00%" },
];

const organicProducts = [
  { id: 1, title: "Cold-Pressed Organic Coconut Oil", subtitle: "Organic Oil", price: "₹345.00", mrp: "₹699.00", save: "Save 50.64%" },
  { id: 2, title: "Organic Raw Honey Wildflower Blend", subtitle: "Organic Honey", price: "₹425.00", mrp: "₹849.00", save: "Save 49.94%" },
  { id: 3, title: "Organic Moringa Leaf Superfood Powder", subtitle: "Organic Superfood", price: "₹285.00", mrp: "₹570.00", save: "Save 50.00%" },
  { id: 4, title: "Organic Aloe Vera Moisturizing Gel", subtitle: "Organic Skincare", price: "₹195.00", mrp: "₹399.00", save: "Save 51.13%" },
  { id: 5, title: "Organic Flaxseed Omega-3 Capsules", subtitle: "Organic Supplement", price: "₹310.00", mrp: "₹620.00", save: "Save 50.00%" },
  { id: 6, title: "Organic Spirulina Detox Tablets", subtitle: "Organic Detox", price: "₹375.00", mrp: "₹750.00", save: "Save 50.00%" },
  { id: 7, title: "Organic Apple Cider Vinegar Raw", subtitle: "Organic Wellness", price: "₹260.00", mrp: "₹520.00", save: "Save 50.00%" },
  { id: 8, title: "Organic Quinoa Grain Protein Rich", subtitle: "Organic Food", price: "₹450.00", mrp: "₹899.00", save: "Save 49.94%" },
];

const productsByCategory: Record<string, typeof herbalProducts> = {
  herbal: herbalProducts,
  nutraceutical: nutraceuticalProducts,
  organic: organicProducts,
};

interface ProductListProps {
  searchQuery: string;
}

export default function ProductList({ searchQuery }: ProductListProps) {
  const [activeCategory, setActiveCategory] = useState("herbal");
  const { addToCart, items } = useCart();
  const [addedProducts, setAddedProducts] = useState<Record<string, boolean>>({});

  const isSearching = searchQuery.trim().length > 0;
  const query = searchQuery.toLowerCase().trim();

  // When searching, show results across all categories
  const getFilteredProducts = () => {
    if (!isSearching) {
      return productsByCategory[activeCategory].map((p) => ({
        ...p,
        category: activeCategory,
      }));
    }

    const allResults: Array<(typeof herbalProducts)[0] & { category: string }> = [];

    for (const [category, products] of Object.entries(productsByCategory)) {
      for (const product of products) {
        if (
          product.title.toLowerCase().includes(query) ||
          product.subtitle.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query)
        ) {
          allResults.push({ ...product, category });
        }
      }
    }

    return allResults;
  };

  const products = getFilteredProducts();

  const isInCart = (productId: number, category: string) => {
    return items.some(
      (item) => item.id === productId && item.category === category
    );
  };

  const handleAddToCart = (
    product: (typeof herbalProducts)[0],
    category: string
  ) => {
    const key = `${category}-${product.id}`;
    addToCart({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      mrp: product.mrp,
      save: product.save,
      category,
      image: productBottle,
    });

    // Show "Added" animation briefly
    setAddedProducts((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [key]: false }));
    }, 800);
  };

  return (
    <section className="w-full bg-[#f7f7f3] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-[1180px]">
        {/* Search results header */}
        {isSearching && (
          <div className="mb-8 text-center">
            <p className="text-[15px] text-[#888]">
              Showing results for "<span className="font-semibold text-[#0d6a88]">{searchQuery}</span>"
              <span className="ml-2 text-[#bbb]">
                — {products.length} {products.length === 1 ? "product" : "products"} found
              </span>
            </p>
          </div>
        )}

        {/* Category filters — hide when searching */}
        {!isSearching && (
          <div className="mb-12 flex flex-wrap items-center justify-center gap-6 md:mb-14 md:gap-[96px]">
            {categories.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id)}
                className={`flex h-[46px] min-w-[156px] cursor-pointer items-center justify-center rounded-full px-8 text-[18px] font-normal capitalize leading-none shadow-none transition-all duration-200 md:h-[48px] md:min-w-[220px] md:text-[22px] ${activeCategory === item.id ? item.activeBg : item.inactiveBg
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Products grid or empty state */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <SearchResultIcon />
            <p className="mt-4 text-[18px] font-semibold text-[#555]">No products found</p>
            <p className="mt-1 text-[14px] text-[#999]">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
            {products.map((product) => {
              const category = product.category;
              const key = `${category}-${product.id}`;
              const alreadyInCart = isInCart(product.id, category);
              const justAdded = addedProducts[key];

              return (
                <article
                  key={key}
                  className="group mx-auto flex w-full max-w-[260px] flex-col rounded-2xl border border-[#e8e8e8] bg-white px-4 pb-4 pt-3 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                >
                  {/* Image + action icons */}
                  <div className="relative mb-3 flex items-center justify-center rounded-xl bg-[#f5f6f2] px-3 py-4">
                    <img
                      src={productBottle}
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

                    {/* Category badge when searching */}
                    {isSearching && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#0d6a88]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#0d6a88]">
                        {category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[#9a9a9a]">
                    {product.subtitle}
                  </p>

                  <h3 className="mb-3 line-clamp-2 min-h-[36px] text-[15px] font-semibold leading-snug text-[#1b1b1b]">
                    {product.title}
                  </h3>

                  {/* Wholesale / Bulk info */}
                  <div className="mb-4 rounded-xl border border-[#eef2e7] bg-[#f8fbf3] px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5b9740]">
                      Wholesale / B2B
                    </p>
                    <p className="mt-1 text-[12px] font-medium text-[#4a4a4a]">
                      MOQ on request
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#6b6b6b]">
                      For large pharmacies & distributors
                    </p>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleAddToCart(product, category)}
                    className={`mt-auto flex h-[34px] items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition-all duration-200 active:scale-[0.98] ${justAdded
                      ? "bg-[#2a8c4a] text-white shadow-[0_4px_12px_rgba(42,140,74,0.25)]"
                      : alreadyInCart
                        ? "bg-[linear-gradient(90deg,#0d6a88_0%,#12849e_100%)] text-white shadow-[0_4px_12px_rgba(13,106,136,0.25)] hover:shadow-[0_6px_18px_rgba(13,106,136,0.35)] hover:brightness-[1.04]"
                        : "bg-[linear-gradient(90deg,#5B9740_0%,#8ED460_100%)] text-white shadow-[0_4px_12px_rgba(114,181,77,0.25)] hover:shadow-[0_6px_18px_rgba(114,181,77,0.35)] hover:brightness-[1.04]"
                      }`}
                  >
                    {justAdded ? (
                      <>
                        <CheckIcon />
                        Added to request list
                      </>
                    ) : alreadyInCart ? (
                      <>
                        <CartPlusIcon />
                        Added to quote
                      </>
                    ) : (
                      <>
                        <CartPlusIcon />
                        Request bulk order
                      </>
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}