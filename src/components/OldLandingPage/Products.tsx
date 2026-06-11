import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const productSections = [
  {
    title: "Organic Medicines",
    buttonColor: "bg-[#68A833]",
    borderColor: "border-[#A5A5A5]",
    lineColor: "bg-[#68A833]",
  },
  {
    title: "Nuetra Medicines",
    buttonColor: "bg-[#3C8F84]",
    borderColor: "border-[#A5A5A5]",
    lineColor: "bg-[#3D9B95]",
  },
  {
    title: "Herbal Medicines",
    buttonColor: "bg-[#E8AC44]",
    borderColor: "border-[#A5A5A5]",
    lineColor: "bg-[#E0A23A]",
  },
];

const products = Array(8).fill({
  name: "Lorum Ipsum Lorum ipsum",
  price: "$ 32.00",
  oldPrice: "MRP $50.00",
  save: "Save 67.68%",
  image: "/Global/Tablet.png",
  slug: "lorum-ipsum-lorum-ipsum",
});

const ProductSection = () => {
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const scroll = (index: number, direction: "left" | "right") => {
    if (scrollRefs.current[index]) {
      scrollRefs.current[index]?.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {productSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>

            {/* Heading + Desktop Arrows */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black">
                {section.title}
              </h2>

              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => scroll(sectionIndex, "left")}
                  className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={() => scroll(sectionIndex, "right")}
                  className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>

            {/* Slider Wrapper */}
            <div className="relative">
              <button
                onClick={() => scroll(sectionIndex, "right")}
                className="md:hidden absolute right-1 top-[35%] -translate-y-1/2 z-20 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
              >
                <ChevronRight size={18} />
              </button>

              <div
                ref={(el) => { scrollRefs.current[sectionIndex] = el; }}
                className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2"
              >
                {products.map((product, index) => (
                  <div
                    key={index}
                    className={`min-w-[180px] sm:min-w-[220px] md:min-w-[250px] border rounded-2xl p-3 bg-white shadow-sm hover:shadow-md transition cursor-pointer ${section.borderColor}`}
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >

                    {/* Icons — stop propagation so clicks don't navigate */}
                    <div className="flex justify-end">
                      <div className="flex flex-col gap-2">
                        <Heart
                          size={16}
                          className="cursor-pointer hover:text-red-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Share2
                          size={15}
                          className="cursor-pointer hover:text-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Image */}
                    <div className="w-full h-36 sm:h-48 bg-[#F8F8F8] rounded-xl flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-28 w-full sm:h-full object-contain"
                      />
                    </div>

                    <p className="text-[10px] text-gray-400 mt-3">
                      Lorum Ipsum Lorum Ipsum
                    </p>

                    <h3 className="text-sm sm:text-lg font-medium text-black leading-snug mt-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="font-bold text-black text-sm sm:text-lg">
                        {product.price}
                      </span>
                      <span className="text-gray-400 text-xs sm:text-sm line-through">
                        {product.oldPrice}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">({product.save})</p>

                    <button
                      className={`w-full mt-4 ${section.buttonColor} text-white py-2 rounded-lg text-sm sm:text-base hover:opacity-90 transition`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Add To Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ProductSection;