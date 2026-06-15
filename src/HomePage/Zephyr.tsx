import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

const SLIDES = [
  {
    id: 1,
    title: "Herbal Medicine",
    bg: "#3FB369",
    titleColor: "#FFFFFF",
    btnColor: "#3FB369",
    imgSrc: "/Homepage/HerbalBottle.png",
    desc: "From fast-growing startups to global enterprises, we connect data and modernize core platforms.",
  },
  {
    id: 2,
    title: "Nutraeuticals",
    bg: "#247D7D",
    titleColor: "#FFFFFF",
    btnColor: "#247D7D",
    imgSrc: "/Homepage/NutraBottle.png",
    desc: "From fast-growing startups to global enterprises, we connect data and modernize core platforms.",
  },
  {
    id: 3,
    title: "Organic Medicine",
    bg: "#B97941",
    titleColor: "#FFFFFF",
    btnColor: "#B97941",
    imgSrc: "/Homepage/OrganicBottle.png",
    desc: "From fast-growing startups to global enterprises, we connect data and modernize core platforms.",
  },
];

const Zephyr = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p === 0 ? SLIDES.length - 1 : p - 1));
  };

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p === SLIDES.length - 1 ? 0 : p + 1));
  };

  const slide = SLIDES[current];

  // ── ELLIPSE TRACK SETTINGS ──
  const trackSettings = {
    maxWidth: "1450px",
    height: "520px",
    nodeSize: "16px",
  };

  // ── CURVED PATH ANIMATIONS (Following ellipse arc) ──
  const productVariants: Variants = {
    initial: (dir: number) => ({
      x: dir === 1 ? 400 : -400,  // Enter from right (next) or left (prev)
      y: 140,
      scale: 0.3,
      opacity: 0,
    }),
    animate: {
      x: 0,
      y: 140,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: (dir: number) => ({
      x: dir === 1 ? -420 : 420,  // Exit left (next direction) or right (prev direction)
      y: 160,
      scale: 0.35,
      opacity: 0,
      transition: {
        duration: 0.75,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),

    // NEXT PRODUCT (Right waiting position)
    rightPosition: {
      x: 400,
      y: 140,
      scale: 0.3,
      opacity: 0,
    },
    
    // NEXT PRODUCT (Ready at right - small, visible)
    rightReady: {
      x: 400,
      y: 150,
      scale: 0.32,
      opacity: 0.7,
      transition: { duration: 0 },
    },
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between transition-colors duration-700"
      style={{ backgroundColor: slide.bg }}
    >
      {/* ── BACKGROUND WATERMARK CONTAINER ── */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start  pointer-events-none select-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.h1
            key={current}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.12, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-[8rem] font-bold text-white text-center leading-none tracking-tight whitespace-nowrap"
          >
            {slide.title.toUpperCase()}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* ── TOP SECTION ── */}
      <div className="relative w-full px-8 md:px-16 pt-12 z-10 flex justify-between items-start">
        <div className="max-w-[280px]">
          <p className="text-white/80 text-xs md:text-sm leading-relaxed font-normal">
            {slide.desc}
          </p>
        </div>
        <div className="w-10 h-10" />
      </div>

      {/* ── CENTER STAGE (3D ELLIPSE ORBIT) ── */}
      <div className="relative flex-1 w-full flex items-center justify-center z-10 px-6 my-auto">
        
        {/* Navigation Controls */}
        <button
          onClick={prev}
          className="absolute left-6 md:left-12 z-40 w-12 h-12 rounded-full border border-white/40
                     bg-black/5 hover:bg-white/10 transition-all flex items-center justify-center text-white shadow-sm"
        >
          <svg className="w-5 h-5 transform -translate-x-px" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={next}
          className="absolute right-6 md:right-12 z-40 w-12 h-12 rounded-full border border-white/40
                     bg-black/5 hover:bg-white/10 transition-all flex items-center justify-center text-white shadow-sm"
        >
          <svg className="w-5 h-5 transform translate-x-px" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Presentation Stack */}
        <div className="relative flex flex-col items-start justify-center w-full max-w-5xl h-[600px]">
          
          {/* Products Container - 2 PRODUCTS WITH CURVED ANIMATION */}
          <div className="absolute inset-0 z-20 flex items-start justify-center pointer-events-none">
            
            <AnimatePresence mode="wait">
              
              {/* CURRENT PRODUCT (Center) - Animates In & Out */}
              <motion.div
                key={`current-${current}`}
                custom={direction}
                variants={productVariants}
                initial="initial"
                animate="animate"
                exit={((dir: any) => ({
                  x: dir === 1 ? -420 : 420,
                  y: 160,
                  scale: 0.25,
                  opacity: 0,
                  transition: {
                    duration: 0.75,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                  },
                })) as any}
                className="absolute z-30"
                style={{ pointerEvents: "auto" }}
              >
                <img
                  src={slide.imgSrc}
                  alt={slide.title}
                  className="w-[200px] sm:w-[260px] md:w-[320px] lg:w-[420px] object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.45)] select-none"
                />
              </motion.div>

              {/* NEXT PRODUCT (Right) - Waiting Position */}
              {/* <motion.div
                key={`next-${nextIdx}`}
                initial={productVariants.rightPosition}
                animate={productVariants.rightReady}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="absolute z-10"
                style={{ pointerEvents: "auto" }}
              >
                <img
                  src={SLIDES[nextIdx].imgSrc}
                  alt={SLIDES[nextIdx].title}
                  className="w-[120px] sm:w-[150px] md:w-[200px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] select-none"
                />
              </motion.div> */}

            </AnimatePresence>

          </div>

          {/* Outer Ring Orbit Path Layout - BOTTOM POSITIONED */}
          <div
            className="absolute z-0 bottom-0"
            style={{
              width: "100%",
              maxWidth: trackSettings.maxWidth,
              height: trackSettings.height,
              border: "2px solid rgba(255,255,255,0.18)",
              borderRadius: "50%",
              transform: "rotateX(72deg) rotateZ(-12deg)",
              transformStyle: "preserve-3d",
              pointerEvents: "none",
            }}
          >
            {/* Left Endpoint Dot */}
            <div
              className="absolute rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.85)]"
              style={{ 
                width: trackSettings.nodeSize, 
                height: trackSettings.nodeSize,
                left: "5%", 
                top: "30%", 
                transform: "translate(-50%, -50%)" 
              }}
            />
            
            {/* Right Endpoint Dot */}
            <div
              className="absolute rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.85)]"
              style={{ 
                width: trackSettings.nodeSize, 
                height: trackSettings.nodeSize,
                right: "5%", 
                bottom: "30%", 
                transform: "translate(50%, 50%)" 
              }}
            />
          </div>

        </div>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div className="relative w-full px-8 md:px-16 pb-12 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <div className="max-w-md">
          <p className="text-white text-sm font-bold tracking-wide mb-1">
            {slide.title}
          </p>
          <p className="text-white/80 text-xs md:text-sm leading-relaxed font-normal">
            {slide.desc}
          </p>
        </div>

        <button
          className="shrink-0 px-6 py-2.5 rounded-full bg-white font-semibold text-xs md:text-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
          style={{ color: slide.btnColor }}
        >
          Explore Formulas ▾
        </button>
      </div>

    </div>
  );
};

export default Zephyr;