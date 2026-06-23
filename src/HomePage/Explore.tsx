"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const items = [
  {
    title: "Herbal",
    image:
      "/Homepage/Organic.png",
    color: "bg-[#C38046]",
      borderColor: "#C38046",
    textColor: "#C38046",

  },
  {
    title: "Nutraceutical",
    image:
      "/Homepage/Nutra.png",
    color: "bg-[#4AA3A7]",
      borderColor: "#4AA3A7",
    textColor: "#4AA3A7",
  },
  {
    title: "Organic",
    image:
      "/Homepage/Herbal.png",
    color: "bg-[#547A3D]",
       borderColor: "#547A3D",
    textColor: "#547A3D",
  },
];

const Explore = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* <h3 className=" text-4xl  mb-3">
    {item.title}
  </h3> */}
              {/* Circle Wrapper */}
              <div className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px]">
                {/* Rotating Circular Text */}
              <motion.svg
  viewBox="0 0 300 300"
  className="absolute inset-0 w-full h-full"
  animate={{
    rotate: hoveredIndex === index ? 25 : 0,
  }}
  transition={{
    duration: 1.4,
    ease: [0.22, 1, 0.36, 1],
  }}
>
  <defs>
    <path
      id={`circlePath-${index}`}
      d="
        M 150,150
        m -118,0
        a 118,118 0 1,1 236,0
        a 118,118 0 1,1 -236,0
      "
    />
  </defs>

  {/* Outer border circle */}
<circle cx="150" cy="150" r="145" fill="none" stroke={item.borderColor} strokeWidth="1" />

{/* Inner border circle */}
<circle cx="150" cy="150" r="108" fill="none" stroke={item.borderColor} strokeWidth="1" />

{/* Text */}
<text
  fill={item.textColor}
  fontSize="13"
  letterSpacing="4.2"
  fontWeight="400"
>
    <textPath
      href={`#circlePath-${index}`}
      startOffset="0%"
    >
      {`${item.title} • `.repeat(20)}
    </textPath>
  </text>
</motion.svg>


{/* Main Circle — inset matches inner border r=108 → inset ~42px */}
<div className="absolute inset-[48px] rounded-full overflow-hidden shadow-lg">
  
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 "
                  />

{/* Hover Overlay — bottom to top reveal */}
<div
  className={`absolute inset-0 ${item.color}
  flex flex-col items-center justify-center
  text-center p-6
  transition-[clip-path]
duration-700
ease-[cubic-bezier(0.22,1,0.36,1)]
  [clip-path:inset(100%_0_0_0)]
  group-hover:[clip-path:inset(0%_0_0_0)]`}
>
  <h3 className="text-white text-xl font-semibold mb-3">
    {item.title}
  </h3>
  <p className="text-white text-sm leading-relaxed">
    Lorem ipsum dolor sit amet consectetur adipisicing elit.
  </p>
</div>
                  </div>
                </div>
              </div>

              
           
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;