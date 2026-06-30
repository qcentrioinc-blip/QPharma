import img1 from "/Gallery/Gallery1.png";
import img2 from "/Gallery/Gallery2.png";
import img3 from "/Gallery/Gallery3.png";
import img4 from "/Gallery/LongGallery.png";
import img5 from "/Gallery/Gallery5.png";

import {
  CalendarDays,
  BarChart3,
  FileText,
  Mail,
} from "lucide-react";


import { motion } from "framer-motion";

const ManufacturingHighlight = () => {
  const cards = [
    {
      icon: CalendarDays,
      title: "Lorem ipsum dolor sit adipiscing elit. Cursus",
    },
    {
      icon: BarChart3,
      title: "Lorem ipsum dolor sit adipiscing elit. Cursus",
    },
    {
      icon: FileText,
      title: "Lorem ipsum dolor sit adipiscing elit. Cursus",
    },
    {
      icon: Mail,
      title: "Lorem ipsum dolor sit adipiscing elit. Cursus",
    },
  ];

 const fadeUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
};

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Collage */}
      <div className="absolute inset-0 z-0">
        <div className="grid grid-cols-3 h-1/2">
          <img src={img1} alt="" className="w-full h-full object-cover" />
          <img src={img2} alt="" className="w-full h-full object-cover" />
          <img src={img3} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-3 h-1/2">
          <div className="col-span-2">
            <img src={img4} alt="" className="w-full h-full object-cover" />
          </div>

          <div>
            <img src={img5} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 z-10" />

      {/* Content */}
      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Heading */}
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            className="text-white font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Lorum Ipsum Dolor
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-white/90 text-sm sm:text-base md:text-lg leading-8"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Cursus imperdiet sed id elementum. Quam vel aliquam sit
            vulputate. Faucibus. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Cursus imperdiet sed id
            elementum. Quam vel aliquam sit vulputate. Faucibus.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Cursus imperdiet sed id elementum.
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div
          className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8 max-w-4xl mx-auto"
          variants={staggerContainer}
        >
          {cards.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                variants={fadeUp}
                className="
                  flex items-center gap-5
                  rounded-3xl
                  border border-white/40
                  bg-white/10
                  backdrop-blur-md
                  px-6 py-5
                  transition-all duration-300
                  hover:bg-white/15
                "
              >
                <Icon
                  size={32}
                  className="text-white flex-shrink-0"
                />

                <p className="text-white py-4 font-semibold text-base md:text-xl leading-relaxed">
                  {item.title}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ManufacturingHighlight;