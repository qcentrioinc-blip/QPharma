import { Search, ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      className="w-full min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen bg-center bg-cover xl:bg-contain  bg-no-repeat flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/Global/LandingPageBG.png')",
      }}
    >
      <div className="w-full max-w-5xl flex flex-col items-center text-center">
        {/* Heading */}
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font- mb-6 sm:mb-8">
          Buy Medicines
        </h1>

        {/* Search Box */}
        <div className="relative w-full max-w-3xl">
          <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg h-14 sm:h-16">
            {/* Category */}
            <div className="hidden sm:flex items-center gap-2 px-5 border-r border-gray-200 text-gray-700 text-sm font-medium whitespace-nowrap">
              All Categories
              <ChevronDown size={16} />
            </div>

            {/* Search Input */}
            <div className="flex-1 relative h-full">
              <input
                type="text"
                placeholder=""
                className="w-full h-full px-4 sm:px-6 outline-none text-sm sm:text-base text-gray-700 bg-transparent"
              />

              {/* Typing Animation */}
            <span className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base pointer-events-none typing-text"></span>
            </div>

            {/* Search Icon */}
            <button className="px-4 sm:px-6 text-gray-500 hover:text-green-600 transition">
              <Search size={22} />
            </button>
          </div>

        
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button className="px-6 py-2 rounded-full bg-[#68A833] text-white text-sm sm:text-base hover:scale-105 transition">
            Organic
          </button>

          <button className="px-6 py-2 rounded-full border border-green-400 text-white text-sm sm:text-base hover:bg-green-500/20 transition">
            Nutraceutical 
          </button>

          <button className="px-6 py-2 rounded-full border border-orange-400 text-white text-sm sm:text-base hover:bg-orange-500/20 transition">
            Herbal
          </button>
        </div>
      </div>

      {/* Typing Animation Style */}
    <style>{`
  .typing-text::before {
    content: "";
    animation: typingWords 12s infinite;
  }

  @keyframes typingWords {

    /* ORGANIC */
    0% { content: ""; }
    2% { content: "O"; }
    4% { content: "Or"; }
    6% { content: "Org"; }
    8% { content: "Orga"; }
    10% { content: "Organ"; }
    12% { content: "Organi"; }
    14% { content: "Organic"; }

    20% { content: "Organic"; }

    22% { content: "Organi"; }
    24% { content: "Organ"; }
    26% { content: "Orga"; }
    28% { content: "Org"; }
    30% { content: "Or"; }
    32% { content: "O"; }
    34% { content: ""; }

    /* HERBAL */
    36% { content: "H"; }
    38% { content: "He"; }
    40% { content: "Her"; }
    42% { content: "Herb"; }
    44% { content: "Herba"; }
    46% { content: "Herbal"; }

    52% { content: "Herbal"; }

    54% { content: "Herba"; }
    56% { content: "Herb"; }
    58% { content: "Her"; }
    60% { content: "He"; }
    62% { content: "H"; }
    64% { content: ""; }

    /* NUTRACEUTICAL */
    66% { content: "N"; }
    68% { content: "Nu"; }
    70% { content: "Nut"; }
    72% { content: "Nutr"; }
    74% { content: "Nutra"; }
    76% { content: "Nutrace"; }
    78% { content: "Nutraceu"; }
    80% { content: "Nutraceut"; }
    82% { content: "Nutraceuti"; }
    84% { content: "Nutraceutic"; }
    86% { content: "Nutraceutica"; }
    88% { content: "Nutraceutical"; }

    94% { content: "Nutraceutical"; }

    96% { content: "Nutraceut"; }
    97% { content: "Nutra"; }
    98% { content: "Nu"; }
    100% { content: ""; }
  }
`}</style>  
    </section>
  );
};

export default HeroSection;