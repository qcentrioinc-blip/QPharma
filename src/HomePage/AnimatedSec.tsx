import React from "react";
import TunnelHero from "./TunnelHero";

/**
 * Example usage of TunnelHero, matching the Elegant Themes / Divi
 * reference section.
 */
const AnimatedSec: React.FC = () => {
  return (
    <TunnelHero
      heading="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet."
      primaryCta={{ label: "View Demo", href: "#" }}
      secondaryCta={{ label: "Explore", href: "#" }}
    />
  );
};

export default AnimatedSec;