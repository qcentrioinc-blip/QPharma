import { AnimatePresence, motion } from "framer-motion";

interface ProductBottleProps {
  image: string;
  title: string;
  direction: number;
}

const easeBezier = [0.22, 1, 0.36, 1] as const;

const bottleVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    y: 180,
    rotate: direction > 0 ? 20 : -20,
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
      duration: 1.2,
      ease: easeBezier,
    },
  },

  exit: (direction: number) => ({
    x: direction > 0 ? -500 : 500,
    y: -180,
    rotate: direction > 0 ? -20 : 20,
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 1,
      ease: easeBezier,
    },
  }),
};

const ProductBottle = ({
  image,
  title,
  direction,
}: ProductBottleProps) => {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={image}
        custom={direction}
        variants={bottleVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="relative z-20"
      >
        <div className="relative flex h-[650px] w-[650px] items-center justify-center">
          <img
            src={image}
            alt={title}
            className="
              pointer-events-none
              select-none
              max-h-full
              max-w-full
              object-contain
              drop-shadow-[0_40px_80px_rgba(0,0,0,0.18)]
            "
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductBottle;