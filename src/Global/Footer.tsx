import { useEffect, useRef } from "react";

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shopLinks = [
    { name: "Herbal Products", url: "/herbal" },
    { name: "Nuetra Products", url: "/nutraceutical" },
    { name: "Organic Products", url: "/organic" },
    { name: "Offers and Deals", url: "/" },
  ];

  const companyLinks = [
    { name: "About Us ", url: "/aboutus" },
    { name: "Research", url: "/research" },
    { name: "Production", url: "/production" },
    { name: "Blogs", url: "/blog" }
  ];

  const careLinks = [
    { name: "My Account", url: "/user-profile" },
    { name: "Track Order", url: "/track-order" },
    { name: "Cookie Policy", url: "/cookies" }
  ];

  const features = [
    { title: "Free Shipping", desc: "Lorem ipsum dolor sit" },
    { title: "Easy Returns", desc: "Lorem ipsum dolor sit" },
    { title: "Secure Payments", desc: "Lorem ipsum dolor sit" },
    { title: "24/7 Support", desc: "Lorem ipsum dolor sit" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: ReturnType<typeof requestAnimationFrame>;

    const mouse = { x: null as number | null, y: null as number | null, active: false };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ── Pixel-perfect blade data ───────────────────────────────────────────────
    // Measured directly from reference image (1485×664px).
    // Origin at (1320, 589) = (0.889W, 0.887H) — bottom-right corner.
    // All fractions are relative to footer WIDTH.
    // Angles in radians: π (180°) = pointing left, 1.5π (270°) = pointing up.
    // halfWidth ≈ 0.09–0.10W — this was the key fix (was 0.003W before).
    const bladeDefs: [number, number, number, number][] = [
      // [angleRad,  lengthFracW,  halfWidthFracW,  opacity]
      [3.15032, 0.8586, 0.1003, 0.13],  // 180.5° — longest, nearly horizontal
      [3.25504, 0.6956, 0.1057, 0.13],  // 186.5°
      [3.37721, 0.8222, 0.1044, 0.13],  // 193.5°
      [3.50811, 0.6768, 0.1057, 0.13],  // 201.0°
      [3.63028, 0.4801, 0.0902, 0.13],  // 208.0°
      [3.74373, 0.6862, 0.1003, 0.13],  // 214.5°
      [3.85718, 0.5636, 0.1017, 0.13],  // 221.0°
      [3.98808, 0.4155, 0.0882, 0.13],  // 228.5°
      [4.11025, 0.4384, 0.0849, 0.13],  // 235.5°
      [4.26733, 0.2296, 0.0714, 0.13],  // 244.5° — shortest, steepest
    ];

    const blades = bladeDefs.map(([angle, lenFrac, hwFrac, opacity]) => ({
      angle,
      baseLenFrac: lenFrac,
      baseHwFrac: hwFrac,
      opacity,
      currentLen: 0,
      currentHw: 0,
      pulseSpeed: 0.002 + Math.random() * 0.003,
      pulseOffset: Math.random() * Math.PI * 2,
      seed: Math.random(),
    }));

    // ── Draw a single tapered blade ────────────────────────────────────────────
    const drawBlade = (
      ox: number, oy: number,
      angle: number, len: number, hw: number, opacity: number
    ) => {
      const tipX = ox + Math.cos(angle) * len;
      const tipY = oy + Math.sin(angle) * len;
      const perp = angle + Math.PI / 2;

      // Wide base at origin
      const lx = ox + Math.cos(perp) * hw;
      const ly = oy + Math.sin(perp) * hw;
      const rx = ox - Math.cos(perp) * hw;
      const ry = oy - Math.sin(perp) * hw;

      // Taper control point at 40% length — blade narrows to rounded tip
      const mx = ox + Math.cos(angle) * len * 0.4;
      const my = oy + Math.sin(angle) * len * 0.4;
      const mhw = hw * 0.22;
      const mlx = mx + Math.cos(perp) * mhw;
      const mly = my + Math.sin(perp) * mhw;
      const mrx = mx - Math.cos(perp) * mhw;
      const mry = my - Math.sin(perp) * mhw;

      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.quadraticCurveTo(mlx, mly, tipX, tipY); // left edge → tip
      ctx.quadraticCurveTo(mrx, mry, rx, ry);     // tip → right edge
      ctx.closePath();

      ctx.fillStyle = `rgba(154, 212, 133, ${opacity})`;
      ctx.fill();
    };

    // ── Animation loop ─────────────────────────────────────────────────────────
    let time = 0;
    const animate = () => {
      time += 1;
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = W / dpr;

      ctx.clearRect(0, 0, W, H);

      // Responsive adjustments for different screen sizes
      const isMobile = displayWidth < 640;
      const isTablet = displayWidth >= 640 && displayWidth < 1024;

      // Use the larger dimension for length to ensure blades cover tall mobile viewports
      const lengthBase = Math.max(W, H * 0.85);
      const thicknessBase = W;

      // Adjust multipliers based on breakpoints
      const lenMult = isMobile ? 1.1 : (isTablet ? 1.05 : 1.0);
      const hwMult = isMobile ? 2.8 : (isTablet ? 1.6 : 1.0);
      const oxFrac = isMobile ? 0.96 : (isTablet ? 0.92 : 0.889);
      const baseOpacityMult = isMobile ? 0.7 : 1.0; // Slightly softer on mobile

      // Origin: bottom-right corner of footer
      const ox = W * oxFrac;
      const oy = H;

      blades.forEach((b) => {
        // Gentle idle breathing
        const wave = Math.sin(time * b.pulseSpeed + b.pulseOffset) * 0.012;
        let targetLen = (b.baseLenFrac + wave) * lengthBase * lenMult;
        const targetHw = b.baseHwFrac * thicknessBase * hwMult;

        // Mouse: blade tips extend toward cursor
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const tipX = ox + Math.cos(b.angle) * targetLen;
          const tipY = oy + Math.sin(b.angle) * targetLen;
          const dx = mouse.x * dpr - tipX;
          const dy = mouse.y * dpr - tipY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = W * 0.18;
          if (dist < influenceRadius) {
            const power = (influenceRadius - dist) / influenceRadius;
            targetLen += power * W * 0.06 * (b.seed * 0.5 + 0.5);
          }
        }

        b.currentLen += (targetLen - b.currentLen) * 0.07;
        b.currentHw += (targetHw - b.currentHw) * 0.07;

        drawBlade(ox, oy, b.angle, b.currentLen, b.currentHw, b.opacity * baseOpacityMult);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // ── Event listeners ────────────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => { mouse.active = false; };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);


  const featuress = [
    { title: "100% Organic", desc: "Chemical-free farming" },
    { title: "Sustainable", desc: "Eco-friendly methods" },
    { title: "Ethical Sourcing", desc: "Fair trade practices" },
    { title: "Lab Tested", desc: "Verified for purity" },
  ];

  return (
    <>
      <div className="w-full bg-white py-6 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="w-full bg-[#F7F8F2] rounded-[24px] py-10 md:py-14 px-6 md:px-10 border border-[#e2e8f0]/50 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 md:gap-x-12">
              {featuress.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-row items-center gap-4 justify-start sm:justify-center lg:justify-start"
                >
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <img
                      src="/Global/LeafIcon.png"
                      alt="Leaf icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-[15px] font-bold text-[#557c56] tracking-wide leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[13px] text-[#222222] font-medium leading-snug">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer
        ref={containerRef}
        className="relative w-full bg-[#143224] text-white overflow-hidden rounded-t-[32px] font-sans pt-12 md:pt-20 pb-8 px-4 sm:px-8 md:px-12"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 md:gap-14 lg:gap-8 xl:gap-20 mb-16 px-4 md:px-0">
            {/* 1. Brand Column */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-16 h-16 flex items-center justify-center shrink-0 mb-4">
                <img
                  src="/Global/LeafIcon.png"
                  alt="Leaf icon"
                  className="w-full h-full object-contain opacity-90"
                />
              </div>
              <h2 className="text-[34px] font-bold text-white tracking-wide mb-2 leading-none">
                Zephyr
              </h2>
              <p className="text-[11px] text-white/60 tracking-wider mb-6 font-light uppercase">
                Organic • Nuetra • Pharma
              </p>
              <p className="text-[15px] text-white/80 leading-[1.6] max-w-[280px]">
                Expertly crafted health solutions combining nature's wisdom with pharmaceutical excellence.
              </p>
            </div>

            {/* 2. Shop Links */}
            <div className="lg:pl-8 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-[24px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
                Shop
              </h3>
              <ul className="space-y-[15px]">
                {shopLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="text-[14px] md:text-[15px] text-white hover:text-[#9ad485] transition-colors font-light"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Company Links */}
            <div className="lg:pl-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-[24px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
                Company
              </h3>
              <ul className="space-y-[15px]">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.url} className="text-[14px] md:text-[15px] text-white hover:text-[#9ad485] transition-colors font-light">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Care Links */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-[24px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
                Care
              </h3>
              <ul className="space-y-[15px]">
                {careLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.url} className="text-[14px] md:text-[15px] text-white hover:text-[#9ad485] transition-colors font-light">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border border-white/20 rounded-[24px] py-8 px-6 sm:px-10 bg-white/5 backdrop-blur-sm mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x lg:divide-x-0 divide-white/10">
              {features.map((f, idx) => (
                <div key={f.title} className={`flex items-center gap-4 ${idx !== 0 ? 'pt-6 sm:pt-0 sm:pl-6 lg:pl-4' : ''}`}>
                  <div className="w-12 h-12 shrink-0">
                    <img
                      src="/Global/LeafIcon.png"
                      alt="Leaf icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-[14px] md:text-[15px] font-bold text-white leading-tight">{f.title}</h4>
                    <p className="text-[12px] md:text-[13px] text-white/70 mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-6 border-t border-white/10">
            <p className="text-[13px] text-white/50 font-light order-3 lg:order-1">
              © 2026 Zephyr. All rights reserved.
            </p>
            <div className="flex items-center gap-6 order-1 lg:order-2">
              <a href="/privacy" className="text-[13px] text-white/60 hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-[13px] text-white/60 hover:text-white transition-colors">Terms & Conditions</a>
            </div>
            <div className="flex items-center gap-3 order-2 lg:order-3">
              {[
                { label: 'VISA', color: '#1a1f71', font: 'italic font-black text-[10px]' },
                { isMastercard: true },
                { label: 'UPI', color: '#000', font: 'font-bold text-[10px]' },
                { label: 'paytm', color: '#00b9f5', font: 'font-bold text-[10px]' },
                { label: 'G Pay', color: '#5f6368', font: 'font-medium text-[10px]', hasG: true }
              ].map((p, i) => (
                <div key={i} className="bg-white rounded px-2.5 py-1 h-7 flex items-center justify-center min-w-[42px] shadow-sm">
                  {p.isMastercard ? (
                    <div className="flex">
                      <div className="w-3 h-3 bg-[#eb001b] rounded-full"></div>
                      <div className="w-3 h-3 bg-[#f79e1b] rounded-full -ml-1.5"></div>
                    </div>
                  ) : (
                    <span className={`${p.font}`} style={{ color: p.color }}>
                      {p.hasG ? <><span className="text-[#ea4335] font-bold">G</span> Pay</> : p.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;


// import { useRef } from "react";

// const Footer = () => {
//   const containerRef = useRef<HTMLDivElement>(null);


//   const shopLinks = [
//     { name: "Herbal Products", url: "/herbal" },
//     { name: "Nuetra Products", url: "/nutraceutical" },
//     { name: "Organic Products", url: "/organic" },
//     { name: "Offers and Deals", url: "/" },
//   ];

//   const companyLinks = [
//     { name: "About Us ", url: "/aboutus" },
//     { name: "Research", url: "/research" },
//     { name: "Production", url: "/production" },
//     { name: "Blogs", url: "/blog" }
//   ];

//   const careLinks = [
//     { name: "My Account", url: "/user-profile" },
//     { name: "Track Order", url: "/track-order" },
//     { name: "Cookie Policy", url: "/cookies" }
//   ];

//   const features = [
//     { title: "Free Shipping", desc: "Lorem ipsum dolor sit" },
//     { title: "Easy Returns", desc: "Lorem ipsum dolor sit" },
//     { title: "Secure Payments", desc: "Lorem ipsum dolor sit" },
//     { title: "24/7 Support", desc: "Lorem ipsum dolor sit" },
//   ];




//   const featuress = [
//     { title: "100 % Natural", desc: "Pure ingredients" },
//     { title: "100 % Natural", desc: "Pure ingredients" },
//     { title: "100 % Natural", desc: "Pure ingredients" },
//     { title: "100 % Natural", desc: "Pure ingredients" },
//   ];

//   return (
//     <>
//       <div className="w-full bg-white py-6 px-4 sm:px-6 md:px-12">
//         <div className="max-w-7xl mx-auto">
//           <div className="w-full bg-[#F7F8F2] rounded-[24px] py-10 md:py-14 px-6 md:px-10 border border-[#e2e8f0]/50 shadow-sm">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 md:gap-x-12">
//               {featuress.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="flex flex-row items-center gap-4 justify-start sm:justify-center lg:justify-start"
//                 >
//                   <div className="w-12 h-12 flex items-center justify-center shrink-0">
//                     <img
//                       src="/Global/LeafIcon.png"
//                       alt="Leaf icon"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                   <div className="flex flex-col space-y-1">
//                     <span className="text-[15px] font-bold text-[#557c56] tracking-wide leading-tight">
//                       {item.title}
//                     </span>
//                     <span className="text-[13px] text-[#222222] font-medium leading-snug">
//                       {item.desc}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <footer
//         ref={containerRef}
//         className="relative group w-full bg-[#143224] text-white overflow-hidden rounded-t-[32px] font-sans pt-12 md:pt-20 pb-8 px-4 sm:px-8 md:px-12"
//       >
//         <img
//           src="/Clippath.svg"
//           alt="clippath"
//           className="absolute inset-0 w-full h-full object-cover object-right-bottom pointer-events-none opacity-80 mix-blend-screen transition-transform duration-1000 ease-out group-hover:scale-110"
//         />

//         <div className="relative z-10 max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 md:gap-14 lg:gap-8 xl:gap-20 mb-16 px-4 md:px-0">
//             {/* 1. Brand Column */}
//             <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
//               <div className="w-16 h-16 flex items-center justify-center shrink-0 mb-4">
//                 <img
//                   src="/Global/LeafIcon.png"
//                   alt="Leaf icon"
//                   className="w-full h-full object-contain opacity-90"
//                 />
//               </div>
//               <h2 className="text-[34px] font-bold text-white tracking-wide mb-2 leading-none">
//                 Zephyr
//               </h2>
//               <p className="text-[11px] text-white/60 tracking-wider mb-6 font-light uppercase">
//                 Organic • Nuetra • Pharma
//               </p>
//               <p className="text-[15px] text-white/80 leading-[1.6] max-w-[280px]">
//                 Expertly crafted health solutions combining nature's wisdom with pharmaceutical excellence.
//               </p>
//             </div>

//             {/* 2. Shop Links */}
//             <div className="lg:pl-8 flex flex-col items-center lg:items-start text-center lg:text-left">
//               <h3 className="text-[24px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
//                 Shop
//               </h3>
//               <ul className="space-y-[15px]">
//                 {shopLinks.map((link) => (
//                   <li key={link.name}>
//                     <a
//                       href={link.url}
//                       className="text-[14px] md:text-[15px] text-white hover:text-[#9ad485] transition-colors font-light"
//                     >
//                       {link.name}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* 3. Company Links */}
//             <div className="lg:pl-4 flex flex-col items-center lg:items-start text-center lg:text-left">
//               <h3 className="text-[24px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
//                 Company
//               </h3>
//               <ul className="space-y-[15px]">
//                 {companyLinks.map((link) => (
//                   <li key={link.name}>
//                     <a href={link.url} className="text-[14px] md:text-[15px] text-white hover:text-[#9ad485] transition-colors font-light">
//                       {link.name}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* 4. Care Links */}
//             <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
//               <h3 className="text-[24px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
//                 Care
//               </h3>
//               <ul className="space-y-[15px]">
//                 {careLinks.map((link) => (
//                   <li key={link.name}>
//                     <a href={link.url} className="text-[14px] md:text-[15px] text-white hover:text-[#9ad485] transition-colors font-light">
//                       {link.name}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="border border-white/20 rounded-[24px] py-8 px-6 sm:px-10 bg-white/5 backdrop-blur-sm mb-12">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x lg:divide-x-0 divide-white/10">
//               {features.map((f, idx) => (
//                 <div key={f.title} className={`flex items-center gap-4 ${idx !== 0 ? 'pt-6 sm:pt-0 sm:pl-6 lg:pl-4' : ''}`}>
//                   <div className="w-12 h-12 shrink-0">
//                     <img
//                       src="/Global/LeafIcon.png"
//                       alt="Leaf icon"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                   <div>
//                     <h4 className="text-[14px] md:text-[15px] font-bold text-white leading-tight">{f.title}</h4>
//                     <p className="text-[12px] md:text-[13px] text-white/70 mt-1">{f.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-6 border-t border-white/10">
//             <p className="text-[13px] text-white/50 font-light order-3 lg:order-1">
//               © 2026 Zephyr. All rights reserved.
//             </p>
//             <div className="flex items-center gap-6 order-1 lg:order-2">
//               <a href="/privacy" className="text-[13px] text-white/60 hover:text-white transition-colors">Privacy Policy</a>
//               <a href="/terms" className="text-[13px] text-white/60 hover:text-white transition-colors">Terms & Conditions</a>
//             </div>
//             <div className="flex items-center gap-3 order-2 lg:order-3">
//               {[
//                 { label: 'VISA', color: '#1a1f71', font: 'italic font-black text-[10px]' },
//                 { isMastercard: true },
//                 { label: 'UPI', color: '#000', font: 'font-bold text-[10px]' },
//                 { label: 'paytm', color: '#00b9f5', font: 'font-bold text-[10px]' },
//                 { label: 'G Pay', color: '#5f6368', font: 'font-medium text-[10px]', hasG: true }
//               ].map((p, i) => (
//                 <div key={i} className="bg-white rounded px-2.5 py-1 h-7 flex items-center justify-center min-w-[42px] shadow-sm">
//                   {p.isMastercard ? (
//                     <div className="flex">
//                       <div className="w-3 h-3 bg-[#eb001b] rounded-full"></div>
//                       <div className="w-3 h-3 bg-[#f79e1b] rounded-full -ml-1.5"></div>
//                     </div>
//                   ) : (
//                     <span className={`${p.font}`} style={{ color: p.color }}>
//                       {p.hasG ? <><span className="text-[#ea4335] font-bold">G</span> Pay</> : p.label}
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// };

// export default Footer;