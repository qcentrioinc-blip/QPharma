import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const images = [
  {
    src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    alt: "Back Support",
  },
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    alt: "Strength",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    alt: "Heart Support",
    label: "Heart Support",
  },
  {
    src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    alt: "Fitness",
  },
  {
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    alt: "Workout",
  },
];

const waveform = [
  4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20,
  24, 28, 32, 36, 42, 50, 64, 78, 92,
  120,
  92, 78, 64, 50, 42, 36, 32, 28, 24,
  20, 18, 16, 14, 12, 10, 8, 7, 6, 5, 4,
];

// ---------- Mobile / Tablet animated coverflow carousel ----------
function MobileCarousel() {
  const [active, setActive] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const getPosition = (index: number) => {
    const total = images.length;

    let diff = index - active;

    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    return diff;
  };

  return (
    <div className="lg:hidden mt-10 sm:mt-14">
      <div className="relative h-[320px] sm:h-[380px] overflow-hidden">
        {images.map((img, index) => {
          const pos = getPosition(index);

          let width = 120;
          let height = 190;
          let opacity = 0.45;
          let scale = 0.8;
          let zIndex = 10;

          if (pos === 0) {
            width = 230;
            height = 320;
            opacity = 1;
            scale = 1;
            zIndex = 50;
          } else if (Math.abs(pos) === 1) {
            width = 165;
            height = 245;
            opacity = 0.8;
            scale = 0.92;
            zIndex = 30;
          }

          const x =
            pos === 0
              ? 0
              : pos === -1
              ? -135
              : pos === 1
              ? 135
              : pos < 0
              ? -230
              : 230;

          return (
            <motion.div
              key={index}
              className="absolute left-1/2 top-0 rounded-2xl sm:rounded-[28px] overflow-hidden shadow-2xl"
              animate={{
                x,
                y: pos === 0 ? 0 : 40,
                width,
                height,
                opacity,
                scale,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                zIndex,
                marginLeft: -(width / 2),
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {pos === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent py-5 sm:py-6"
                >
                  <p className="text-white text-center text-base sm:text-lg font-medium">
                    {img.alt}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      
    </div>
  );
}

// ---------- Main CTA section ----------
const CTA = () => {
  return (
    <section className="bg-white overflow-hidden py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="max-w-5xl mx-auto text-center px-2 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-black">
            Lorem Ipsum
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed max-w-4xl mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Lorem ipsum dolor sit amet. Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Lorem ipsum dolor sit amet.
          </p>
        </div>

        {/* Desktop Arc Layout (lg and up) — unchanged */}
        <div className="hidden lg:flex justify-center mt-10 mb-6">
          <div className="relative w-full max-w-7xl mx-auto h-[clamp(320px,38vw,400px)]">
            {/* Card 1 */}
            <div
              className="absolute bottom-[clamp(60px,8vw,80px)] rounded-[clamp(20px,2.5vw,32px)] overflow-hidden shadow-xl"
              style={{
                left: "clamp(0px,2vw,20px)",
                width: "clamp(110px,12vw,160px)",
                height: "clamp(180px,20vw,250px)",
              }}
            >
              <img
                src={images[0].src}
                alt={images[0].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Card 2 */}
            <div
              className="absolute bottom-[clamp(30px,4vw,40px)] rounded-[clamp(20px,2.5vw,32px)] overflow-hidden shadow-xl"
              style={{
                left: "clamp(130px,16vw,210px)",
                width: "clamp(150px,18vw,220px)",
                height: "clamp(230px,26vw,320px)",
              }}
            >
              <img
                src={images[1].src}
                alt={images[1].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Center Card */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-0 rounded-[clamp(24px,3vw,36px)] overflow-hidden shadow-2xl z-20"
              style={{
                width: "clamp(220px,26vw,300px)",
                height: "clamp(290px,34vw,400px)",
              }}
            >
              <img
                src={images[2].src}
                alt={images[2].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {images[2].label && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent py-6 sm:py-8">
                  <p className="text-white text-lg sm:text-xl text-center font-medium">
                    {images[2].label}
                  </p>
                </div>
              )}
            </div>

            {/* Card 4 */}
            <div
              className="absolute bottom-[clamp(30px,4vw,40px)] rounded-[clamp(20px,2.5vw,32px)] overflow-hidden shadow-xl"
              style={{
                right: "clamp(130px,16vw,210px)",
                width: "clamp(150px,18vw,220px)",
                height: "clamp(230px,26vw,320px)",
              }}
            >
              <img
                src={images[3].src}
                alt={images[3].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Card 5 */}
            <div
              className="absolute bottom-[clamp(60px,8vw,80px)] rounded-[clamp(20px,2.5vw,32px)] overflow-hidden shadow-xl"
              style={{
                right: "clamp(0px,2vw,20px)",
                width: "clamp(110px,12vw,160px)",
                height: "clamp(180px,20vw,250px)",
              }}
            >
              <img
                src={images[4].src}
                alt={images[4].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Mobile / Tablet animated carousel */}
        <MobileCarousel />

        {/* Waveform */}
        <div className="flex justify-center mt-8 lg:mt-0 px-4">
          <div className="flex items-center gap-[2px] sm:gap-[3px] overflow-x-auto max-w-full">
            {waveform.map((height, index) => {
              const center = index === Math.floor(waveform.length / 2);

              return (
                <div
                  key={index}
                  className={`rounded-full flex-shrink-0 ${
                    center ? "bg-teal-500 w-[3px] sm:w-[4px]" : "bg-gray-300 w-[2px] sm:w-[3px]"
                  }`}
                  style={{
                    height: `clamp(${Math.max(height / 4, 6)}px, ${height / 2}px, ${height / 2}px)`,
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