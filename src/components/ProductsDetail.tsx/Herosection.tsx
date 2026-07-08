"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Share2,
  Check,
  Plus,
  Truck,
  ChevronLeft,
  Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { products } from "../../datas/product";




// All 4 thumbnail images — replace with your actual image paths
const productImages = [
  "/Global/Bottle.png",
  "/Global/Bottle.png",
  "/Global/Bottle.png",
  "/Global/Bottle.png",
];

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
}
export default function HeroSection() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [addedMessage, setAddedMessage] = useState(false);

const { slug } = useParams();

const product = products.find((p) => p.slug === slug);
if (!product) {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Product Not Found</h1>
    </div>
  );
}


  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, name: "John Doe", rating: 5, comment: "Amazing quality product. Highly recommended." },
  ]);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleAddReview = () => {
    if (!name || !comment || rating === 0) return;
    setReviews((prev) => [{ id: Date.now(), name, rating, comment }, ...prev]);
    setName(""); setComment(""); setRating(0);
  };

  const { addToCart, toggleWishlistItem, isInWishlist, openCart } = useCart();

  useEffect(() => {
    if (!addedMessage) return;
    const timer = window.setTimeout(() => setAddedMessage(false), 1400);
    return () => window.clearTimeout(timer);
  }, [addedMessage]);

  const productPayload = {
    id: product.id,
    title: product.title,
    subtitle: product.description,
    price: `₹${product.price.toFixed(2)}`,
    mrp: `₹${product.oldPrice.toFixed(2)}`,
    save: `₹${(product.oldPrice - product.price).toFixed(2)}`,
    category: product.badge,
    image: product.image,
  };

  const isFavorite = isInWishlist(product.id, product.badge);

  const handleAddToCart = () => {
    addToCart(productPayload);
    setAddedMessage(true);
  };

  const handleToggleWishlist = () => {
    toggleWishlistItem(productPayload);
    if (!isFavorite) {
      openCart("wishlist");
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      // ignore share errors
    }
  };
  return (
    <>
      {/* ───────── PRODUCT DETAIL HERO ───────── */}
      <section className="w-full bg-white py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-black transition mb-6"
          >
            <ChevronLeft size={16} />
            Back to Products
          </button>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 items-start">

            {/* ── LEFT: Main Image + Thumbnails ── */}
            <div className="flex flex-col items-center">

              {/* Main Image */}
              <div className="w-full max-w-[480px] bg-white rounded-2xl flex items-center justify-center overflow-hidden"
                style={{ minHeight: 380 }}>
                <img
                  key={selectedThumb}
            
    src={product.image}
    alt={product.title}

                  className="w-[220px] sm:w-[260px] lg:w-full object-cover py-8 transition-opacity duration-200"
                />
              </div>

              {/* Thumbnails — 4 column grid, click to swap */}
              <div className="grid grid-cols-4 gap-3 mt-4 w-full max-w-[480px]">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedThumb(i)}
                    className={`aspect-square bg-[#f8f8f8] rounded-xl flex items-center justify-center transition border-2 ${selectedThumb === i
                        ? "border-[#74a82a]"
                        : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className="w-[60%] object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Product Info ── */}
            <div className="w-full">

              {/* Breadcrumb */}
              <p className="text-[#8D8585] underline text-[26px] mb-3 cursor-pointer hover:text-[#74a82a] transition">
                Lorem ipsum dolor
              </p>

              {/* Title + Share/Heart row */}
              <div className="flex items-start justify-between gap-4">

                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold text-black">{product.title}</h1>
                  <div className="rounded-2xl border border-[#e8efe0] bg-[#f8fbf3] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5b9740]">
                      Wholesale ordering
                    </p>
                    <p className="mt-1 text-sm text-[#4b4b4b]">
                      MOQ and pricing are confirmed after your bulk order request for pharmacies and distributors.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#2f5f1d]">MOQ on request</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#2f5f1d]">Bulk packing available</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">

                  {/* Share + Heart pill */}
                  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition border-r border-gray-200"
                      aria-label="Share product"
                    >
                      <Share2 size={15} className="text-gray-500" />
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition"
                      aria-label="Add to wishlist"
                      aria-pressed={isFavorite}
                    >
                      <Heart size={15} className={isFavorite ? "fill-[#74a82a] text-[#74a82a]" : "text-gray-500"} />
                    </button>
                  </div>

                 
                </div>
              </div>

              {/* Wholesale benefits */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-3 text-gray-600 text-[18px]">
                  <div className="w-8 h-8 rounded-sm bg-[#5b9740] text-white flex items-center justify-center shrink-0">
                    <Check size={11} />
                  </div>
                  <p>Dedicated bulk-order support for pharmacies</p>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-[18px]">
                  <div className="w-8 h-8 rounded-full bg-[#5b9740] text-white flex items-center justify-center shrink-0">
                    <Plus size={11} />
                  </div>
                  <p>Secure supply chain and fast dispatch planning</p>
                </div>
              </div>

              {/* Country */}
              <div className="mt-5">
                <p className="text-[15px] font-bold text-black">
                Country of Origin: {product.country}
                </p>
              </div>

              {/* Description */}
              <div className="mt-4">
                <p className="text-black text-[14px] leading-[1.8]">
                  <span className="font-bold">Description:</span>{" "}
                  {product.longDescription}
                </p>
                <p className="mt-2 text-sm text-[#5b9740]">
                  Pricing is shared only after your bulk quantity request is reviewed.
                </p>
              </div>

              {/* Pack selector + Add to Cart */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
               

                <button
                  onClick={handleAddToCart}
                  className="flex h-[44px] px-10 items-center justify-center rounded-lg bg-[#74a82a] hover:bg-[#5f9021] active:scale-[0.98] text-white font-semibold text-[15px] transition"
                >
                  {addedMessage ? "Added to request list" : "Request bulk order"}
                </button>
              </div>

              {/* Wholesale note */}
              <div className="mt-24 flex items-start gap-4 rounded-2xl border border-[#e8efe0] bg-[#f8fbf3] p-5">
                <Truck size={60} className="text-[#5f8f52] shrink-0 mt-0.5" />
                <p className="text-[18px] leading-[1.6] text-black">
                  For large pharmacy and distributor orders, our team will share MOQ, packing options, and dispatch timelines after your request.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center gap-8 border-b border-gray-200 pb-3">
              {(["description", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-semibold uppercase tracking-wide transition relative pb-3 ${activeTab === tab ? "text-black" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab === "reviews" ? `Reviews (${reviews.length})` : "Description"}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#74a82a] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="mt-8">
                <h3 className="text-[20px] font-bold text-black">From the manufacturer</h3>
                <p className="mt-4 text-gray-500 leading-[1.9] text-[14px] max-w-5xl">
                  Dive into the blockbuster movies you can't wait to see. Switch between your
                  favorite apps quickly and easily. The new and improved octa-core processor
                  gives you the power and speed you need to see more and do more. Expand your
                  tablet's memory from 32GB to up to an additional 128GB and enjoy more of your
                  favorite music, photos, movies and games on the go with a microSD card. With
                  Quick Connect, start a show on your Smart TV and, with the touch of a button,
                  take it with you by moving it to your Galaxy Tab S2.
                </p>

                {/* ── Manufacturer Info Banner ── */}
                <div className="mt-10 w-full rounded-2xl   overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 min-h-[350px]">

                    {/* LEFT: feature list */}
                    <div className="flex flex-col justify-center gap-6 px-6 py-8   border-gray-200">
                      {[
                        { title: "Lorem Ipsum", desc: "Healthy Customers althy Custo Ithy Custo" },
                        { title: "Lorem Ipsum", desc: "Healthy Customers althy Custo Ithy Custo" },
                        { title: "Lorem Ipsum", desc: "Healthy Customers althy Custo Ithy Custo" },
                      ].map((item, i) => (
                        <div key={i} className="flex  max-w-lg items-center gap-10">
                          <div className="w-18 h-18 rounded-full bg-gray-200 shrink-0" />
                          <div>
                            <p className="text-[24px] font-semibold text-[#404040]">{item.title}</p>
                            <p className="text-[18px] text-[#404040] mt-0.5 leading-snug">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CENTER: product image */}
                    <div className="flex items-center justify-center ">
                      <img
                        src="/Global/Probiotic.png"
                        alt="Probiotic"
                        className="w-full "
                      />
                    </div>

                    {/* RIGHT: stat + feature */}
                    <div className="flex flex-col  space-y-8 justify-center gap-6 px-6 py-8   border-gray-200">
                      {/* Stat box */}
                      <div className="bg-[#D9D9D9] rounded-xl px-8 py-14">
                        <p className="text-[48px] font-semibold text-[#0A8180] leading-none">120k+</p>
                        <p className="text-[18px] text-gray-600 mt-1">Healthy Customers</p>
                      </div>

                      {/* Single feature row */}
                      <div className="flex  items-center gap-10">
                        <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
                        <div>
                          <p className="text-[24px] font-semibold text-black">Lorem Ipsum</p>
                          <p className="text-[18px] text-gray-500 mt-0.5 leading-snug">
                            Healthy Customers althy Custo Ithy Custo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Samsung description */}
                <div className="mt-8">
                  <h4 className="text-[16px] font-bold text-black">Semsong Galaxy Tab S2, 8-Inch, White</h4>
                  <p className="mt-2 text-gray-500 text-[13px] leading-[1.8] max-w-5xl">
                    The Samsung Galaxy Tab S2 offers dual cameras: a rear-facing 8-megapixel camera
                    with Auto Focus and a 2.1-megapixel camera on the front. Take high-quality pictures
                    and video or video chat with friends, family, and colleagues. Customize your Galaxy
                    Tab S2 with the apps you use most. The Samsung Galaxy Essentials widget provides a
                    collection of premium complimentary apps optimized for your Galaxy tablet screen.
                  </p>
                  <button className="mt-3 text-[#74a82a] text-[13px] font-semibold underline hover:opacity-80 transition">
                    SHOW MORE
                  </button>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="mt-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Add Your Review</h3>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#74a82a] transition mb-3 text-sm"
                  />
                  <textarea
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-24 rounded-xl border border-gray-300 p-4 outline-none focus:border-[#74a82a] transition resize-none text-sm"
                  />
                  <div className="flex items-center gap-2 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)}>
                        <Star className={`w-6 h-6 transition ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleAddReview}
                    className="mt-4 h-[44px] px-7 rounded-xl bg-[#74a82a] hover:bg-[#5f9021] text-white font-medium transition text-sm"
                  >
                    Submit Review
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-black">{review.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="mt-3 text-gray-500 leading-[1.8] text-[13px]">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      
    </>
  );
}