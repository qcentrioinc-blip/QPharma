import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    id: 1,
    title: "Herbal Medicine",
    color: "#3FB369",
    image: "/Homepage/HerbalBottle.png",
  },
  {
    id: 2,
    title: "Nutraceuticals",
    color: "#247D7D",
    image: "/Homepage/NutraBottle.png",
  },
  {
    id: 3,
    title: "Organic Medi",
    color: "#F99526",
    image: "/Homepage/OrganicBottle.png",
  },
];

const MainSec: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setDirection(-1);

    setCurrent((prev) =>
      prev === 0 ? products.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const product = products[current];

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 450 : -450,
      y: 150,
      rotate: direction > 0 ? 18 : -18,
      scale: 0.8,
      opacity: 0,
    }),

    center: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },

    exit: (direction: number) => ({
      x: direction > 0 ? -450 : 450,
      y: -150,
      rotate: direction > 0 ? -18 : 18,
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
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
      className="relative overflow-hidden"
    >
      {/* Background Circle */}
      <div className="absolute left-1/2 -top-[500px] h-[2000px] w-[2000px] -translate-x-1/2 rounded-full bg-white opacity-10" />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
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
          className="absolute h-[500px] w-[500px] rounded-full bg-white/70 blur-[220px]"
        />

      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-12 lg:px-16">
        {/* Heading */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
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
              className="font-bricolage text-[64px] font-extrabold leading-none text-white/30 md:text-[100px] lg:text-[150px]"
            >
              {product.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Description */}
        <div className="mt-8 max-w-md">
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${product.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="text-lg leading-relaxed text-white md:text-xl"
            >
              Crafted with premium ingredients and backed by quality standards,
              our wellness solutions support healthier lifestyles and long-term
              well-being for modern consumers.
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.button
              key={`btn-${product.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="group mt-6 flex items-center gap-3 rounded-full bg-white px-8 py-4 transition-all duration-300 hover:scale-105"
            >
              <span className="font-semibold italic text-black">
                Explore Solutions
              </span>

              <ArrowUpRight
                size={18}
                className="text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </motion.button>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="hidden lg:block">
          <button
            onClick={prevSlide}
            className="absolute left-6 top-[58%] flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-[58%] flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition hover:bg-white/10"
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Product Area */}
        <div className="relative mt-4 flex h-[340px] justify-center">
          {/* Fixed Orbit */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg
              className="absolute h-[420px] w-[1000px] -translate-y-4 -rotate-6"
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
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={product.id}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative z-20 -translate-y-20 md:-translate-y-28 lg:-translate-y-64"
            >
              <img
                src={product.image}
                alt={product.title}
                className="
                  pointer-events-none
                  select-none
                  w-[320px]
                  object-contain
                  drop-shadow-[0_40px_80px_rgba(0,0,0,0.18)]
                  md:w-[480px]
                  lg:w-[520px]
                "
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 pb-10">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                current === index
                  ? "w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                  : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default MainSec;