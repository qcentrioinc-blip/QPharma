"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ExploreItem {
  title: string;
  image: string;
  color: string;
  borderColor: string;
  textColor: string;
  link: string;
}

const ITEMS: ExploreItem[] = [
  {
    title: "Herbal",
    image: "/Homepage/Organic.png",
    color: "bg-[#C38046]",
    borderColor: "#C38046",
    textColor: "#C38046",
    link: "/herbal"
  },
  {
    title: "Nutraceutical",
    image: "/Homepage/Nutra.png",
    color: "bg-[#4AA3A7]",
    borderColor: "#4AA3A7",
    textColor: "#4AA3A7",
    link: "/nutraceutical"
  },
  {
    title: "Organic",
    image: "/Homepage/Herbal.png",
    color: "bg-[#547A3D]",
    borderColor: "#547A3D",
    textColor: "#547A3D",
    link: "/organic"
  },
];

const ROTATION_ON_HOVER = 25;
const ROTATION_TRANSITION = {
  duration: 1.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

function CircularLabel({
  title,
  index,
  textColor,
  borderColor,
  rotated,
}: {
  title: string;
  index: number;
  textColor: string;
  borderColor: string;
  rotated: boolean;
}) {
  const pathId = `circlePath-${index}`;

  return (
    <motion.svg
      viewBox="0 0 300 300"
      className="absolute inset-0 w-full h-full"
      animate={{ rotate: rotated ? ROTATION_ON_HOVER : 0 }}
      transition={ROTATION_TRANSITION}
      aria-hidden="true"
    >
      <defs>
        <path
          id={pathId}
          d="
            M 150,150
            m -118,0
            a 118,118 0 1,1 236,0
            a 118,118 0 1,1 -236,0
          "
        />
      </defs>

      <circle cx="150" cy="150" r="145" fill="none" stroke={borderColor} strokeWidth="1" />
      <circle cx="150" cy="150" r="108" fill="none" stroke={borderColor} strokeWidth="1" />

      <text fill={textColor} fontSize="13" letterSpacing="4.2" fontWeight="400">
        <textPath href={`#${pathId}`} startOffset="0%">
          {`${title} • `.repeat(20)}
        </textPath>
      </text>
    </motion.svg>
  );
}

/**
 * A single circular card. `sizeClassName` controls the outer diameter and
 * `insetClassName` must match it proportionally (inner border sits at 72%
 * of the outer radius, i.e. r=108/150) so the image ring stays flush
 * against the inner SVG border at every size this card is used at.
 */
function ExploreCard({
  item,
  index,
  sizeClassName,
  insetClassName,
}: {
  item: ExploreItem;
  index: number;
  sizeClassName: string;
  insetClassName: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
  <Link
    to={item.link}
    className="flex flex-col items-center group cursor-pointer"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onTouchStart={() => setIsHovered(true)}
    onTouchEnd={() => setIsHovered(false)}
  >

      <div className={`relative ${sizeClassName}`}>
        <CircularLabel
          title={item.title}
          index={index}
          textColor={item.textColor}
          borderColor={item.borderColor}
          rotated={isHovered}
        />

        <div className={`absolute ${insetClassName} rounded-full overflow-hidden shadow-lg`}>
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500"
          />

          <div
            className={`absolute inset-0 ${item.color} flex flex-col items-center justify-center text-center p-3 sm:p-4 md:p-6 transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0%_0_0_0)]`}
          >
            <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2 md:mb-3">
              {item.title}
            </h3>
            <p className="text-white text-xs sm:text-sm leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Mobile-only semi-circle arc layout: same arc positions and circle sizes
 * as before, but static — no fan-out/fan-in animation on mobile.
 * The center circle stays layered above both side circles.
 *
 * Fixed: the previous container used `max-w-90 h-55`, which are not valid
 * Tailwind utilities (the default spacing scale has no 90 or 55 step), so
 * the container collapsed to zero height/width and the three circles
 * overflowed/overlapped the viewport on real phones. The container now
 * uses explicit arbitrary-value sizing so nothing clips off-screen at
 * 320px-wide viewports.
 */
function MobileArcLayout({ items }: { items: ExploreItem[] }) {
  const [left, center, right] = items;

  return (
    <div className="sm:hidden flex justify-center">
      <div className="relative w-full max-w-[340px] h-[200px]">
        {/* Left circle */}
        <div className="absolute bottom-0 left-0 z-10">
          <ExploreCard
  item={left}
  index={0}
  sizeClassName="w-[105px] h-[105px]"
  insetClassName="inset-[15px]"
/>
        </div>

        {/* Center circle — stays on top of both side circles */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 z-20">
          <ExploreCard
            item={center}
            index={1}
            sizeClassName="w-[150px] h-[150px]"
            insetClassName="inset-[21px]"
          />
        </div>

        {/* Right circle */}
        <div className="absolute bottom-0 right-0 z-10">
          <ExploreCard
            item={right}
            index={2}
            sizeClassName="w-[105px] h-[105px]"
            insetClassName="inset-[15px]"
          />
        </div>
      </div>
    </div>
  );
}

/** Tablet (sm–lg): a single horizontal row, sized to fit three circles side by side. */
function TabletRowLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="hidden sm:flex lg:hidden justify-center items-end gap-6 md:gap-10">
      {items.map((item, index) => (
        <ExploreCard
          key={item.title}
          item={item}
          index={index}
          sizeClassName="w-[190px] h-[190px] md:w-[230px] md:h-[230px]"
          insetClassName="inset-[27px] md:inset-[33px]"
        />
      ))}
    </div>
  );
}

/** Desktop (lg+): original evenly-spaced grid. */
function DesktopGridLayout({ items }: { items: ExploreItem[] }) {
  return (
    <div className="hidden lg:grid grid-cols-3 gap-10 place-items-center">
      {items.map((item, index) => (
        <ExploreCard
          key={item.title}
          item={item}
          index={index}
          sizeClassName="w-[350px] h-[350px]"
          insetClassName="inset-[49px]"
        />
      ))}
    </div>
  );
}

const Explore = () => {
  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MobileArcLayout items={ITEMS} />
        <TabletRowLayout items={ITEMS} />
        <DesktopGridLayout items={ITEMS} />
      </div>
    </section>
  );
};

export default Explore;