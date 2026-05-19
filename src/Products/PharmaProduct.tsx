import { useState } from "react";
import { Check, Plus, Share2, Heart, Truck } from "lucide-react";

const mainImg =
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop";
const thumbs = [
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
];

export default function PharmaProduct() {
  const [size, setSize] = useState<"30" | "60">("30");
  const [activeDot, setActiveDot] = useState(0);

  return (
    <div className="min-h-screen bg-white px-6 py-10 font-sans text-gray-900">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        {/* Left: gallery */}
        <div>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white">
            <img src={mainImg} alt="AuraFlow Nootropics bottle" className="h-full w-full object-contain" />
          </div>

          {/* dots */}
          <div className="mt-4 flex items-center gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveDot(i)}
                className={`h-1.5 rounded-full transition-all ${
                  activeDot === i ? "w-6 bg-gray-800" : "w-1.5 bg-gray-300"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* thumbnails */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {thumbs.map((src, i) => (
              <button
                key={i}
                className="aspect-square overflow-hidden rounded-md border border-gray-200 bg-white hover:border-gray-400"
              >
                <img src={src} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: details */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <a href="#" className="text-sm text-gray-700 underline underline-offset-2">
              Lorem ipsum dolor
            </a>
            <div className="flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1.5 shadow-sm">
              <button className="rounded-full p-1.5 hover:bg-gray-100" aria-label="Share">
                <Share2 className="h-4 w-4 text-gray-700" />
              </button>
              <button className="rounded-full p-1.5 hover:bg-gray-100" aria-label="Favorite">
                <Heart className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-start justify-between gap-6">
            <h1 className="max-w-md text-2xl font-bold leading-snug text-gray-900">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h1>
            <div className="whitespace-nowrap text-2xl font-bold text-gray-900">$22.95</div>
          </div>

          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-3 text-gray-800">
              <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-gray-900">
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </span>
              Lorem ipsum dolor sit amet,
            </li>
            <li className="flex items-center gap-3 text-gray-800">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900">
                <Plus className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </span>
              Lorem ipsum dolor sit amet,
            </li>
          </ul>

          <p className="mt-6 font-semibold text-gray-900">
            Country of Origin: <span className="font-semibold">USA</span>
          </p>

          <p className="mt-4 text-gray-800 leading-relaxed">
            <span className="font-semibold">Description</span>: Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut{" "}
            <a href="#" className="text-green-700 underline underline-offset-2">more</a>
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setSize("30")}
              className={`rounded-full border px-6 py-2.5 text-sm font-medium transition ${
                size === "30"
                  ? "border-gray-900 text-gray-900"
                  : "border-gray-300 text-gray-700 hover:border-gray-500"
              }`}
            >
              30 Tabs
            </button>
            <button
              onClick={() => setSize("60")}
              className={`rounded-full border px-6 py-2.5 text-sm font-medium transition ${
                size === "60"
                  ? "border-gray-900 text-gray-900"
                  : "border-gray-300 text-gray-700 hover:border-gray-500"
              }`}
            >
              60 Tabs
            </button>

            <button className="ml-auto rounded-full bg-gradient-to-b from-[#8FC78A] to-[#4E9446] px-10 py-3 text-base font-semibold text-white shadow-md transition hover:brightness-105">
              Add to Cart
            </button>
          </div>

          <div className="mt-10 flex items-center gap-5">
            <Truck className="h-12 w-12 text-green-700" strokeWidth={1.5} />
            <p className="text-gray-800 leading-snug">
              Lorem ipsum dolor sit amet,
              <br />
              consectetur adipiscing elit. Sed do
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
