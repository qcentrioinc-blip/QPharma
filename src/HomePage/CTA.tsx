
const images = [
  {
    src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    alt: "Back Support",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    alt: "Strength",
    size: "medium",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    alt: "Heart Support",
    label: "Heart Support",
    size: "large",
  },
  {
    src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    alt: "Fitness",
    size: "medium",
  },
  {
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    alt: "Workout",
    size: "small",
  },
];

const waveform = [
  4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20,
  24, 28, 32, 36, 42, 50, 64, 78, 92,
  120,
  92, 78, 64, 50, 42, 36, 32, 28, 24,
  20, 18, 16, 14, 12, 10, 8, 7, 6, 5, 4,
];

const CTA = () => {
  return (
    <section className="bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-black">
          Lorem Ipsum
        </h2>

        <p className="mt-4 text-gray-500 leading-relaxed max-w-4xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
          amet consectetur adipisicing elit.
        </p>
      </div>

      {/* Desktop Arc Layout */}
      <div className="hidden lg:flex justify-center mt-10 mb-6">
        <div className="relative w-full max-w-7xl mx-auto h-[400px]">
          {/* Card 1 */}
          <div className="absolute left-[20px] bottom-[80px] w-[160px] h-[250px] rounded-[32px] overflow-hidden shadow-xl">
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 2 */}
          <div className="absolute left-[210px] bottom-[40px] w-[220px] h-[320px] rounded-[32px] overflow-hidden shadow-xl">
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center Card */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[300px] h-[400px] rounded-[36px] overflow-hidden shadow-2xl z-20">
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent py-8">
              <p className="text-white text-xl text-center font-medium">
                Heart Support
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="absolute right-[210px] bottom-[40px] w-[220px] h-[320px] rounded-[32px] overflow-hidden shadow-xl">
            <img
              src={images[3].src}
              alt={images[3].alt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 5 */}
          <div className="absolute right-[20px] bottom-[80px] w-[160px] h-[250px] rounded-[32px] overflow-hidden shadow-xl">
            <img
              src={images[4].src}
              alt={images[4].alt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Tablet/Mobile */}
      <div className="lg:hidden mt-16">
        <div className="flex items-end justify-center gap-3 overflow-x-auto px-4 pb-4">
          {images.map((img, index) => (
            <div
              key={index}
              className={`
                relative
                flex-shrink-0
                rounded-[28px]
                overflow-hidden
                shadow-xl
                ${
                  img.size === "large"
                    ? "w-[220px] h-[320px]"
                    : img.size === "medium"
                    ? "w-[170px] h-[260px]"
                    : "w-[140px] h-[220px]"
                }
              `}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />

              {img.label && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent py-5">
                  <p className="text-white text-center font-medium">
                    {img.label}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Waveform */}
      <div className="flex justify-center mt-0">
        <div className="flex items-center gap-[3px]">
          {waveform.map((height, index) => {
            const center = index === Math.floor(waveform.length / 2);

            return (
              <div
                key={index}
                className={`rounded-full ${
                  center ? "bg-teal-500 w-[4px]" : "bg-gray-300 w-[3px]"
                }`}
                style={{
                  height: `${height / 2}px`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
    </section>
  );
};

export default CTA;