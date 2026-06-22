import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";


const SLIDES = [
  {
    id: 1,
    title: "Herbal Medicine",
    bg: "#3FB369",
    route: "/herbal",
    titleColor: "#FFFFFF",
    btnColor: "#3FB369",
    imgSrc: "/Homepage/HerbalBottle.png",
    desc: "From fast-growing startups to global enterprises, we connect data and modernize core platforms.",
      desc2:
    "From fast-growing startups to global enterprises, we connect data and modernize core platforms. From fast-growing startups to global enterprises, we connect data and modernize core platforms."
  },
  {
    id: 2,
    title: "Nutraeuticals",
    bg: "#247D7D",
     route: "/nutraceutical",
    titleColor: "#FFFFFF",
    btnColor: "#247D7D",
    imgSrc: "/Homepage/NutraBottle.png",
    desc: "From fast-growing startups to global enterprises, we connect data and modernize core platforms.",
      desc2:
    "From fast-growing startups to global enterprises, we connect data and modernize core platforms. From fast-growing startups to global enterprises, we connect data and modernize core platforms."
  },
  {
    id: 3,
    title: "Organic Medicine",
    bg: "#B97941",
    route: "/organic",
    titleColor: "#FFFFFF",
    btnColor: "#B97941",
    imgSrc: "/Homepage/OrganicBottle.png",
    desc: "From fast-growing startups to global enterprises, we connect data and modernize core platforms.",
      desc2:
    "From fast-growing startups to global enterprises, we connect data and modernize core platforms. From fast-growing startups to global enterprises, we connect data and modernize core platforms."
  },
];

const Zephyr = () => {
  const navigate= useNavigate();
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
    maxWidth: "1550px",
    nodeSize: "16px",
  };

  // ── CURVED PATH TRAJECTORY ANIMATIONS ──
  // Adjusted Y-values so the item stays elevated in the center and moves down toward the nodes
  const productVariants: Variants = {
    initial: (dir: number) => ({
      x: dir === 1 ? 380 : -380,   // Slide in from right endpoint or left endpoint
      y: 120,                     // Lower elevation at sides to track the ellipse curve
      scale: 0.45,
      opacity: 0,
    }),
    animate: {
      x: 0,
      y: 20,                      // Lifted higher in the center completely above the line
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: [0.25, 1, 0.5, 1],  // Clean custom cubic-bezier ease out
      },
    },
    exit: (dir: number) => ({
      x: dir === 1 ? -380 : 380,  // Slide out to opposite side node
      y: 120,                     // Drop back down down toward track horizon line
      scale: 0.45,
      opacity: 0,
      transition: {
        duration: 0.85,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between transition-colors duration-700"
      style={{ backgroundColor: slide.bg }}
    >
      {/* ── BACKGROUND WATERMARK CONTAINER ── */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start pointer-events-none select-none z-0 overflow-hidden">
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
      {/* TOP DESCRIPTION */}
<div className="absolute top-40 left-8 md:left-16 z-20 max-w-sm">
  <p className="text-white text-lg leading-relaxed font-thin">
    {slide.desc}
  </p>
</div>

      {/* ── CENTER STAGE (3D ELLIPSE ORBIT) ── */}
      <div className="relative flex-1 w-full flex items-center justify-center z-10 px-6 ">
        
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
        <div className="relative flex flex-col items-center justify-center w-full max-w-5xl h-[500px]">
          
          {/* Products Container - MULTIPLE COMPONENT SHIFT VIA POPLAYOUT */}
          <div className="absolute inset-0 z-20 flex items-start justify-center pointer-events-none">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={`product-${current}`}
                custom={direction}
                variants={productVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute"
                style={{ pointerEvents: "auto", top: "10%" }}
              >
                <img
                  src={slide.imgSrc}
                  alt={slide.title}
                  className="w-[180px] sm:w-[240px] md:w-[280px] lg:w-[350px] object-contain drop-shadow-[0_35px_45px_rgba(0,0,0,0.4)] select-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Outer Ring Orbit Path Layout ── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-4 pointer-events-none"
            style={{
              width: "110%",
              maxWidth: trackSettings.maxWidth,
              height: "360px",
              borderRadius: "50%",
              transform: "perspective(1200px) rotateX(64deg) rotateZ(-10deg)",
              transformStyle: "preserve-3d",
              zIndex: 10,
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.05) 80%)",
              backgroundOrigin: "border-box",
              backgroundClip: "border-box",
              WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          >
            {/* Left Endpoint Dot */}
            <div
              className="absolute rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1)]"
              style={{ 
                width: trackSettings.nodeSize, 
                height: trackSettings.nodeSize,
                left: "14%", 
                top: "24%", 
                transform: "translate(-50%, -50%)" 
              }}
            />
            
            {/* Right Endpoint Dot */}
            <div
              className="absolute rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1)]"
              style={{ 
                width: trackSettings.nodeSize, 
                height: trackSettings.nodeSize,
                right: "14%", 
                bottom: "24%", 
                transform: "translate(50%, 50%)" 
              }}
            />
          </div>

        </div>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div
  className="
    absolute
    left-8 md:left-16
    bottom-16
    z-20
    max-w-full
  "
>
      
      </div>

      {/* Bottom Content */}
<div
  className="
    absolute
    left-8 md:left-16
    bottom-24
    z-20
    max-w-lg
  "
>
  <p className="text-white text-sm font-bold tracking-wide ">
    {slide.title}
  </p>

  <p className="text-white/80 text-xs md:text-sm leading-relaxed">
    {slide.desc2}
  </p>
</div>

{/* CTA Button */}
<button
onClick={() => navigate(slide.route)}
  className="
    absolute
    right-8 md:right-16
    bottom-24
    z-20
    px-6 py-3
    rounded-full
    bg-white
    text-sm
    font-semibold
    shadow-md
  "
  style={{ color: slide.btnColor }}
>
  Explore Solutions →
</button>

    </div>
  );
};

export default Zephyr;