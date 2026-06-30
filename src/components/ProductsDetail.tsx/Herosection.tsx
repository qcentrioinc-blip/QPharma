"use client";

import { useState } from "react";
import {
  Heart,
  Share2,
  Check,
  Plus,
  Truck,
  Star,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Global/UseCart";




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
interface CartItem {
  id: number;
  qty: number;
}
export default function HeroSection() {
  const navigate = useNavigate();

  const [selectedPack, setSelectedPack] = useState("30");
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [selectedThumb, setSelectedThumb] = useState(0);

  // Cart items with qty state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, qty: 1 },
    { id: 2, qty: 1 },
    { id: 3, qty: 1 },
  ]);

  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

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

  const itemPrice = 500;
  const itemOldPrice = 750;

  const { addToCart } = useCart();
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
                  src={productImages[selectedThumb]}
                  alt="Product"
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

              {/* Title + Price + Share/Heart row */}
              <div className="flex items-start justify-between gap-4">

                {/* Title */}
                <h1 className="text-[20px] sm:text-[24px] xl:text-[32px]  font-semibold text-black ">
                  Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit.
                </h1>

                {/* Price + Share/Heart stacked */}
                <div className="flex flex-col items-end gap-3 shrink-0">

                  {/* Share + Heart pill */}
                  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white">
                    <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition border-r border-gray-200">
                      <Share2 size={15} className="text-gray-500" />
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition">
                      <Heart size={15} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Price */}
                  <h2 className="text-[26px] sm:text-[30px] font-extrabold text-black tracking-tight">
                    $22.95
                  </h2>
                </div>
              </div>

              {/* Feature list */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-3 text-gray-600 text-[18px]">
                  <div className="w-8 h-8 rounded-sm bg-gray-800 text-white flex items-center justify-center shrink-0">
                    <Check size={11} />
                  </div>
                  <p>Lorem ipsum dolor sit amet,</p>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-[18px]">
                  <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0">
                    <Plus size={11} />
                  </div>
                  <p>Lorem ipsum dolor sit amet,</p>
                </div>
              </div>

              {/* Country */}
              <div className="mt-5">
                <p className="text-[15px] font-bold text-black">
                  Country of Origin: USA
                </p>
              </div>

              {/* Description */}
              <div className="mt-4">
                <p className="text-black text-[14px] leading-[1.8]">
                  <span className="font-bold">Description:</span>{" "}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut{" "}
                  <span className="text-[#74a82a] underline cursor-pointer">more</span>
                </p>
              </div>

              {/* Pack selector + Add to Cart */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {["30", "60"].map((pack) => (
                  <button
                    key={pack}

                    onClick={() => setSelectedPack(pack)}
                    className={`min-w-[100px] h-[42px] rounded-full border text-[14px] font-medium transition ${selectedPack === pack
                        ? "border-[#74a82a] bg-[#74a82a] text-white"
                        : "border-gray-300 bg-white text-black hover:border-[#74a82a]"
                      }`}
                  >
                    {pack} Tabs
                  </button>
                ))}

                <button onClick={addToCart} className="flex h-[44px]  px-10 items-center justify-center rounded-lg bg-[#74a82a] hover:bg-[#5f9021] active:scale-[0.98] text-white font-semibold text-[15px] transition">
                  Add to Cart
                </button>
              </div>

              {/* Shipping */}
              <div className="mt-24 flex items-start  gap-4">
                <Truck size={80} className="text-[#5f8f52] shrink-0 mt-0.5" />
                <p className="text-[26px] leading-[1.6] text-black">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do
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

      {/* ───────────────── SHOPPING CART SECTION ───────────────── */}
      <section className="w-full bg-[#f5f5f5] pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="border-t border-gray-300 pt-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-black font-medium text-sm hover:text-[#74a82a] transition"
            >
              <ChevronLeft size={16} />
              Shopping Continue
            </button>
          </div>

          <div className="mt-5">
            <div className="w-full h-5 rounded-full bg-[#b9dfb6] flex items-center px-5 text-[11px] font-semibold text-[#4f7e42]">
              $ 90 saved on this order
            </div>
            <div className="w-full h-11 rounded-2xl bg-white mt-3 shadow-sm border border-gray-100" />
          </div>

          <div className="mt-7">
            <h2 className="text-xl font-bold text-black">Shopping cart</h2>
            <p className="text-gray-500 text-sm mt-1">
              You have {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-5 mt-5">

            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
              {cartItems.length === 0 && (
                <p className="text-center text-gray-400 py-10 text-sm">Your cart is empty.</p>
              )}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-[64px] h-[64px] rounded-xl border border-gray-200 flex items-center justify-center bg-[#fafafa] shrink-0">
                      <img src="/Global/Bottle.png" alt="product" className="w-[38px] object-contain -rotate-12" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-black truncate">Lorum Ipsum</h3>
                      <p className="text-gray-400 text-xs leading-5 mt-0.5 line-clamp-2">
                        Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">

                    {/* Qty stepper — functional */}
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden h-[38px] w-[108px]">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-9 h-full flex items-center justify-center text-base font-bold hover:bg-gray-100 active:bg-gray-200 transition"
                      >
                        −
                      </button>
                      <div className="flex-1 text-center text-sm font-semibold">{item.qty}</div>
                      <button
                        onClick={() => updateQty(item.id, +1)}
                        className="w-9 h-full flex items-center justify-center text-base font-bold hover:bg-gray-100 active:bg-gray-200 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[80px]">
                      <p className="text-[22px] leading-none font-extrabold text-black">
                        ${itemPrice * item.qty}
                      </p>
                      <p className="text-gray-400 line-through text-base mt-0.5">
                        ${itemOldPrice * item.qty}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 hover:text-red-500 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4h6v3m-7 4v6m4-6v6m4-6v6M5 7l1 13h12l1-13" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-fit">
              <h3 className="text-base font-bold text-black mb-4">Bill Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Item Total</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-gray-400">
                      ${cartItems.reduce((sum, i) => sum + itemOldPrice * i.qty, 0)}
                    </span>
                    <span className="font-bold text-black">
                      ${cartItems.reduce((sum, i) => sum + itemPrice * i.qty, 0)}
                    </span>
                  </div>
                </div>
                {["Delivery", "Tax", "Discount"].map((label, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-black">$1.99</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-base font-semibold text-black">Total Price</span>
                  <span className="text-base font-extrabold text-black">
                    ${(cartItems.reduce((sum, i) => sum + itemPrice * i.qty, 0) + 5.97).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Q - Pharma points</span>
                  <span className="font-semibold text-black">$0.00</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/payment')}
                className="w-full h-[48px] rounded-xl bg-[#5f8d3b] hover:bg-[#4f7731] active:scale-[0.98] transition text-white font-bold mt-6"
              >
                Check Out
              </button>
            </div>
          </div>

          <button className="mt-4 border border-gray-300 bg-white rounded-xl px-5 h-[38px] text-sm font-medium hover:bg-gray-50 transition">
            + Add more items
          </button>
        </div>
      </section>
    </>
  );
}