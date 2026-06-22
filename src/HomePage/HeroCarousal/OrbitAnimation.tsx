import React from "react";

const OrbitAnimation = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        className="w-[1000px] h-[420px] -rotate-6"
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

        <circle
          cx="85"
          cy="200"
          r="10"
          fill="white"
        />

        <circle
          cx="1115"
          cy="195"
          r="10"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default OrbitAnimation;