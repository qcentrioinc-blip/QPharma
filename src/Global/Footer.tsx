import { useMemo } from "react";

// Custom Leaf SVG to match the exact logo perfectly
const LeafIcon = ({ className = "w-8 h-8", color = "#103023" }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <path
      d="M50 85 V50 C50 30, 30 20, 20 30 C10 40, 20 60, 40 60 C45 60, 50 55, 50 50"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M50 65 C50 45, 70 35, 80 45 C90 55, 80 75, 60 75 C55 75, 50 70, 50 65"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M25 45 L35 55" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M75 55 L65 65" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Footer = () => {
  const shopLinks = ["Herbal Products", "Nuetra Products", "Organic Products", "Offers and Deals"];
  const companyLinks = ["About Us", "R & D Production", "Blogs", "Contact Us"];
  const careLinks = ["My Account", "Track order", "FAQ's", "T & Conditions"];

  const features = [
    { title: "Free Shipping", desc: "Lorem ipsum dolor sit" },
    { title: "Easy Returns", desc: "Lorem ipsum dolor sit" },
    { title: "Secure Payments", desc: "Lorem ipsum dolor sit" },
    { title: "24/7 Support", desc: "Lorem ipsum dolor sit" },
  ];

  // Deterministically generate background radial lines for the "burst" effect
  const burstLines = useMemo(() => {
    let lines = [];
    for (let i = 0; i < 120; i++) {
      let pseudoRnd = Math.abs(Math.sin(i * 12.345));
      let angle = (i * (180 / 120)) * (Math.PI / 180) + Math.PI; // Spread top half
      let length = 20 + pseudoRnd * 80;
      let opacity = 0.05 + (pseudoRnd * 0.15);
      lines.push({
        x2: 50 + Math.cos(angle) * length * 1.5,
        y2: 100 + Math.sin(angle) * length,
        opacity,
      });
    }
    return lines;
  }, []);

  return (
    <footer className="relative w-full bg-[#143224] text-white overflow-hidden rounded-t-[32px] font-sans pt-16 pb-8">
      
      {/* ── Background Radial Burst Effect ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        {burstLines.map((line, idx) => (
          <line
            key={idx}
            x1="50%"
            y1="100%"
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="#9ad485"
            strokeWidth="0.75"
            opacity={line.opacity}
          />
        ))}
      </svg>

      {/* ── Main Footer Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 lg:gap-8 xl:gap-16 mb-16">
          
          {/* 1. Brand Column (Centered content) */}
          <div className="flex flex-col items-center text-center px-4">
            <div className="w-[88px] h-[88px] bg-[#f9fdf8] rounded-full flex items-center justify-center mb-5 shadow-sm">
              <LeafIcon />
            </div>
            <h2 className="text-[34px] font-bold text-white tracking-wide mb-2 leading-none">
              Q Pharma
            </h2>
            <p className="text-[11px] text-white/60 tracking-wider mb-6 font-light">
              Organic. Nuetra. Pharma
            </p>
            <p className="text-[15px] text-white/80 leading-[1.6] max-w-[280px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna.
            </p>
          </div>

          {/* 2. Shop Links */}
          <div className="lg:pl-8">
            <h3 className="text-[26px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
              shop
            </h3>
            <ul className="space-y-[18px]">
              {shopLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[15px] text-white hover:text-[#9ad485] transition-colors font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Company Links */}
          <div className="lg:pl-4">
            <h3 className="text-[26px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
              Company
            </h3>
            <ul className="space-y-[18px]">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[15px] text-white hover:text-[#9ad485] transition-colors font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Care Links */}
          <div>
            <h3 className="text-[26px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
              Care
            </h3>
            <ul className="space-y-[18px]">
              {careLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[15px] text-white hover:text-[#9ad485] transition-colors font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Features Strip ── */}
        <div className="border border-white/20 rounded-[18px] py-7 px-4 sm:px-8 bg-black/5 backdrop-blur-sm mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 lg:divide-x-0">
            {features.map((f, idx) => (
              <div key={f.title} className={`flex items-center gap-4 ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-4 lg:pl-0' : ''}`}>
                <div className="w-[42px] h-[42px] bg-white rounded-full shrink-0 flex items-center justify-center">
                  <LeafIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white leading-tight">{f.title}</h4>
                  <p className="text-[13px] text-white/70 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Legal & Payment Bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
          
          <p className="text-[13px] text-white/70 font-light tracking-wide order-2 md:order-1">
            @2026 All rights reserved.
          </p>

          <div className="flex items-center gap-4 order-1 md:order-2">
            <a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors font-light tracking-wide">
              Privacy Policy
            </a>
            <span className="text-white/40 text-[13px]">|</span>
            <a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors font-light tracking-wide">
              Terms and Conditions
            </a>
          </div>

          <div className="flex items-center gap-3 order-3">
            {/* VISA */}
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[36px]">
              <span className="text-[#1a1f71] text-[11px] font-extrabold italic tracking-tighter">VISA</span>
            </div>
            {/* Mastercard */}
            <div className="bg-white rounded px-2 py-[3px] flex items-center justify-center h-6 min-w-[36px]">
              <div className="flex">
                <div className="w-3.5 h-3.5 bg-[#eb001b] rounded-full opacity-90 z-10"></div>
                <div className="w-3.5 h-3.5 bg-[#f79e1b] rounded-full opacity-90 -ml-1.5"></div>
              </div>
            </div>
            {/* UPI */}
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[36px]">
              <span className="text-[#000] text-[10px] font-bold tracking-tight">UPI</span>
            </div>
            {/* Paytm */}
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[40px]">
              <span className="text-[#00b9f5] text-[10px] font-bold tracking-tight">paytm</span>
            </div>
            {/* GPay */}
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[40px]">
              <span className="text-[#5f6368] text-[10px] font-medium tracking-tight">
                <span className="text-[#ea4335] font-bold">G</span> Pay
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;