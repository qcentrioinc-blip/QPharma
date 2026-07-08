import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    id: 1,
    title: "HERBAL MEDICINE ",
    description:
      "Natural extracts and traditional formulas for joint and muscle support. Natural extracts and traditional formulas for joint and muscle support.Natural extracts and traditional formulas for joint and muscle support",
    color: "#3FB369",
    image: "/Homepage/HerbalBottle.png",
    buttonText: "Explore Solutions",
  },
  {
    id: 2,
    title: "NUTRACEUTICAL",
    description:
      "Science-backed supplements to support daily nutrition and vitality. Science-backed supplements to support daily nutrition and vitality. Science-backed supplements to support daily nutrition and vitality.",
    color: "#247D7D",
    image: "/Homepage/NutraBottle.png",
    buttonText: "Explore Solutions",
  },
  {
    id: 3,
    title: "ORGANIC MEDICINE",
    description:
      "Certified organic formulations focused on clean, effective care. Certified organic formulations focused on clean, effective care. Certified organic formulations focused on clean, effective care.",
    color: "#F99526",
    image: "/Homepage/OrganicBottle.png",
    buttonText: "Explore Solutions",
  },
];

const AUTOPLAY_DELAY = 5000;
const TRANSITION_DURATION = 900; // ms, matches the framer-motion transition below

const MainSec: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs avoid the stale-closure problem that state has inside setInterval /
  // rapid-fire click handlers. The ref is always read synchronously and is
  // the single source of truth for "are we mid-transition right now".
  const isAnimatingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAutoplay = () => {
    clearAutoplay();
    intervalRef.current = setInterval(() => {
      goToSlide((c) => (c + 1) % products.length, 1);
    }, AUTOPLAY_DELAY);
  };

  // Central, race-condition-safe slide changer. Every navigation path
  // (autoplay, prev/next buttons, indicator dots) goes through this.
  const goToSlide = (
    resolveIndex: (current: number) => number,
    dir: number
  ) => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setIsAnimating(true);
    setDirection(dir);
    setCurrent(resolveIndex);

    // Safety-net unlock: in case onAnimationComplete never fires (e.g. tab
    // backgrounded, animation interrupted by unmount), don't leave the
    // carousel stuck locked forever.
    if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
    unlockTimeoutRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
    }, TRANSITION_DURATION + 150);
  };

  const handleAnimationComplete = () => {
    if (unlockTimeoutRef.current) {
      clearTimeout(unlockTimeoutRef.current);
      unlockTimeoutRef.current = null;
    }
    isAnimatingRef.current = false;
    setIsAnimating(false);
  };

  const nextSlide = () => goToSlide((c) => (c + 1) % products.length, 1);
  const prevSlide = () =>
    goToSlide((c) => (c === 0 ? products.length - 1 : c - 1), -1);

  const goToIndex = (index: number) => {
    if (index === current) return;
    goToSlide(() => index, index > current ? 1 : -1);
  };

  // Autoplay: starts on mount, restarts every time the user manually
  // navigates so a manual click never races against a pending tick.
  useEffect(() => {
    startAutoplay();
    return clearAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    return () => {
      clearAutoplay();
      if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
    };
  }, []);

  const product = products[current];

  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      y: 60,
      scale: 0.45,
      rotateY: dir > 0 ? 35 : -35,
      rotateZ: dir > 0 ? 8 : -8,
      opacity: 0,
      filter: "blur(8px)",
    }),

    center: {
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      rotateZ: 0,
      opacity: 1,
      filter: "blur(0px)",

      transition: {
        duration: 0.9,
        ease: [0.25, 1, 0.5, 1] as const,
      },
    },

    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      y: 60,
      scale: 0.45,
      rotateY: dir > 0 ? -35 : 35,
      rotateZ: dir > 0 ? -8 : 8,
      opacity: 0,
      filter: "blur(8px)",

      transition: {
        duration: 0.9,
        ease: [0.25, 1, 0.5, 1] as const,
      },
    }),
  };

  return (
    <motion.section
      animate={{
        backgroundColor: product.color,
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative overflow-hidden  h-screen"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0  flex items-center justify-center">
        <motion.div
          key={product.id}
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1.1,
            opacity: 1,
          }}
          transition={{
            duration: 1.2,
          }}
          className="absolute h-[900px] w-[900px] rounded-full bg-white/50 blur-[220px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-12 lg:px-16 h-full">
        {/* Heading */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={product.id}
              initial={{
                clipPath: "inset(100% 0 0 0)",
                opacity: 0,
              }}
              animate={{
                clipPath: "inset(0% 0 0 0)",
                opacity: 1,
              }}
              exit={{
                clipPath: "inset(0 0 100% 0)",
                opacity: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="
               pt-10
              text-nowrap
                font-bricolage
                font-extrabold
                leading-none
                text-white/30
                text-[52px]
                sm:text-[70px]
                md:text-[90px]
                lg:text-[92px]
                xl:text-[140px]
                2xl:text-[150px]
                text-center
                px-4
              "
            >
              {product.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Description */}
        <div className="mt-8 max-w-md">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`desc-${product.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="text-md  leading-relaxed text-white md:text-md"
            >
              {product.description}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`btn-${product.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <motion.button
                type="button"
                aria-label={product.buttonText}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="inline-flex w-fit items-center rounded-full bg-white px-5 py-2 text-sm font-medium text-black shadow-sm lg:text-base"
              >
                <motion.span
                  variants={{
                    rest: { gap: "8px" },
                    hover: { gap: "12px" },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center"
                >
                  {product.buttonText}
                  <motion.span
                    variants={{
                      rest: { x: 0 },
                      hover: { x: 6 },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex shrink-0"
                  >
                    <ArrowRight size={16} />
                  </motion.span>
                </motion.span>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="hidden lg:block">
          <button
            type="button"
            onClick={prevSlide}
            disabled={isAnimating}
            aria-label="Previous product"
            className={`absolute left-6 top-[80%] flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition hover:bg-white/10 ${
              isAnimating ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={isAnimating}
            aria-label="Next product"
            className={`absolute right-6 top-[80%] flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition hover:bg-white/10 ${
              isAnimating ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Product Area */}
        <div className="relative -mt-32 flex h-[380px] md:h-[420px] lg:h-[500px] justify-center">
          {/* Fixed Orbit */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg
              className="absolute h-[360px] w-[900px] translate-y-16 -rotate-6"
              viewBox="0 0 1200 420"
              fill="none"
            >
              <ellipse
                cx="600"
                cy="210"
                rx="520"
                ry="120"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
              />

              <circle cx="85" cy="200" r="10" fill="white" />
              <circle cx="1115" cy="195" r="10" fill="white" />
            </svg>
          </div>

          {/* Product Image */}
          {/* `perspective` must live on a non-animating PARENT wrapper.
              Putting it on the same element that rotates (as the old code
              did) means the rotation has no real depth to project onto,
              which is what produced the abrupt "glitchy" snap, especially
              when a transition was interrupted mid-flight. */}
          <div
            className="relative z-20 -translate-y-10 md:-translate-y-16 lg:-translate-y-20"
            style={{ perspective: 1200 }}
          >
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={product.id}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onAnimationComplete={handleAnimationComplete}
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  draggable={false}
                  className="
                    pointer-events-none
                    select-none
                    w-[180px]
                    sm:w-[220px]
                    md:w-[320px]
                    lg:w-[420px]
                    xl:w-[480px]
                    object-contain
                    drop-shadow-[0_50px_100px_rgba(0,0,0,0.25)]
                  "
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Indicators (bottom-right) */}
      <div className="absolute right-6 bottom-6 flex gap-3 z-30">
        {products.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => goToIndex(index)}
            disabled={isAnimating}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              current === index
                ? "w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                : "w-2 bg-white/50"
            } ${isAnimating ? "pointer-events-none" : ""}`}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default MainSec;