import { ChevronRight } from "lucide-react";

const categories = [
  {
    title: "Organic Medicines",
    subtitle: "Explore products",
    bg: "bg-[#DCEBCF]",
    text: "text-[#4D8B2A]",
    icon: "/Global/ScrubLeaf.png",
  },
  {
    title: "Nuetra",
    subtitle: "Explore products",
    bg: "bg-[#D6EBEA]",
    text: "text-[#3AA7A3]",
    icon: "/Global/ScrubLeaf.png",
  },
  {
    title: "Herbal",
    subtitle: "Explore products",
    bg: "bg-[#EFE6DA]",
    text: "text-[#E4A53D]",
    icon: "/Global/ScrubLeaf.png",
  },
];

const conditions = [
  "Diabetes Care",
  "Pain Relief",
  "Sickness",
  "Stomach Care",
  "Elderly Care",
];

const Banner = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Banner Cards */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
          
          {/* Left Text */}
          <h2 className="text-3xl sm:text-4xl font-medium text-black whitespace-nowrap">
            Lorum :
          </h2>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {categories.map((item, index) => (
              <div
                key={index}
                className={`${item.bg} rounded-2xl px-4 py-4 flex items-center justify-between hover:scale-[1.02] transition duration-300 cursor-pointer`}
              >
                <div className="flex items-center p-2 gap-3">
                  
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-black">
                      {item.title}
                    </h3>

                    <p className={`text-sm ${item.text}`}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="text-black" size={20} />
              </div>
            ))}
          </div>
        </div>

        {/* Health Conditions */}
        <div className="mt-14">
          <h2 className="text-center text-3xl sm:text-4xl font-medium text-black mb-10">
            Health Conditions
          </h2>

          {/* Condition Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {conditions.map((item, index) => (
              <div
                key={index}
                className="border border-[#B0AFAF] rounded-2xl bg-[#F1F1F1] p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition duration-300"
              >
                {/* Icon */}
                <div className="w-16 h-16 mb-4">
                  <img
                    src="/Global/ScrubLeaf.png"
                    alt={item}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Text */}
                <h3 className="text-lg font-medium text-black leading-tight">
                  {item}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  30 tabs Included
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;