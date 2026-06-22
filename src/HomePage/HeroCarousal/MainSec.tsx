import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import OrbitAnimation from "./OrbitAnimation";
import ProductBottle from "./ProductBottle";
import HeroNavigation from "./HeroNavigation";
import { Products } from "./Products";

const MainSec = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    setDirection(1);

    setCurrent((prev) =>
      prev === Products.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);

    setCurrent((prev) =>
      prev === 0 ? Products.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const product = Products[current];

  return (
    <motion.section
      animate={{
        background: product.gradient,
      }}
      transition={{
        duration: 1.2,
      }}
      className="relative min-h-screen overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          key={product.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="h-[1000px] w-[1000px] rounded-full bg-white/20 blur-[220px]"
        />
      </div>

      <HeroNavigation
        onPrev={prevSlide}
        onNext={nextSlide}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.h1
            key={product.id}
            initial={{
              clipPath: "inset(100% 0 0 0)",
            }}
            animate={{
              clipPath: "inset(0% 0 0 0)",
            }}
            exit={{
              clipPath: "inset(0 0 100% 0)",
            }}
            transition={{
              duration: 0.8,
            }}
            className="font-bricolage text-center text-[70px] font-extrabold text-white/30 lg:text-[150px]"
          >
            {product.title}
          </motion.h1>
        </AnimatePresence>

        <motion.p
          key={`desc-${product.id}`}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="mt-6 max-w-xl text-center text-xl text-white"
        >
          Crafted with premium ingredients and backed by quality standards,
          supporting healthier lifestyles and long-term wellness.
        </motion.p>

        <button className="group mt-8 flex items-center gap-3 rounded-full bg-white px-8 py-4">
          <span className="font-semibold italic text-black">
            Explore Solutions
          </span>

          <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>

        <div className="relative mt-10 flex h-[650px] w-full items-center justify-center">
          <OrbitAnimation/>

          <ProductBottle
            image={product.image}
            title={product.title}
            direction={direction}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default MainSec;