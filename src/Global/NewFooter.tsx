import { useEffect, useRef } from "react";

const NewFooter = () => {
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
    { name: "Blogs", url: "/blog" },
  ];

  const careLinks = [
    { name: "My Account", url: "/user-profile" },
    { name: "Track Order", url: "/track-order" },
    { name: "Cookie Policy", url: "/cookies" },
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

    // Track mouse positioning relative to canvas bounds
    const mouse: { x: number | null; y: number | null; active: boolean } = {
      x: null,
      y: null,
      active: false,
    };

    // Render at device pixel ratio so heavy/thick strokes stay crisp on
    // high-DPI screens instead of looking soft/thin.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize line particles
    const lineCount = 14;
    const lines: Array<{
      angle: number;
      baseLength: number;
      currentLength: number;
      targetLength: number;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
      seed: number;
    }> = [];

    for (let i = 0; i < lineCount; i++) {
      // Linear layout across the 180 degree arc over the bottom center anchor
      const angle = Math.PI + (i / (lineCount - 1)) * Math.PI;
      const seed = Math.random();

      // Structural parameters
      const baseLength = 500 + seed * 250;
      const targetLength = baseLength;
      // Heavier, more visible opacity range than before (was 0.08–0.26)
      const opacity = 0.22 + Math.random() * 0.28;
      const pulseSpeed = 0.005 + Math.random() * 0.005;
      const pulseOffset = Math.random() * Math.PI * 2;

      lines.push({
        angle,
        baseLength,
        currentLength: baseLength,
        targetLength,
        opacity,
        pulseSpeed,
        pulseOffset,
        seed,
      });
    }

    let time = 0;

    // Animation Tick Engine
    const animate = () => {
      time += 1;

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);

      // Base anchor origin node coordinates (Bottom middle)
      const originX = width / 2;
      const originY = height + 120;

      lines.forEach((line) => {
        // 1. Structural Idle Pulsation (Wave Effect)
        const idleWave = Math.sin(time * line.pulseSpeed + line.pulseOffset) * 15;
        let finalTarget = line.baseLength + idleWave;

        // Base structural path ending point without distortion
        const nativeEndX = originX + Math.cos(line.angle) * finalTarget;
        const nativeEndY = originY + Math.sin(line.angle) * finalTarget;

        // 2. Interactive Dynamic Mouse Tracking Logic
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - nativeEndX;
          const dy = mouse.y - nativeEndY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 260; // Distance reach of spike distortion

          if (distance < influenceRadius) {
            // Stronger pull factor if the cursor gets closer
            const power = (influenceRadius - distance) / influenceRadius;
            // Extend the lines outward along their angle toward mouse proximity
            finalTarget += power * 120 * (line.seed * 0.5 + 0.5);
          }
        }

        // 3. Smooth Lerp Physics Interpolation
        line.currentLength += (finalTarget - line.currentLength) * 0.1;

        // Calculate actual render endpoints
        const renderEndX = originX + Math.cos(line.angle) * line.currentLength;
        const renderEndY = originY + Math.sin(line.angle) * line.currentLength;

        // 4. Draw Heavy Radial Spikes
        const gradient = ctx.createLinearGradient(
          originX,
          originY,
          renderEndX,
          renderEndY
        );

        // Brighter, more solid core that holds further along the spoke
        // before fading out — this is what gives the "heavy ray" look
        // instead of a thin wisp.
        gradient.addColorStop(0, `rgba(154,212,133,${line.opacity})`);
        gradient.addColorStop(0.35, `rgba(82,182,140,${line.opacity * 0.85})`);
        gradient.addColorStop(0.75, `rgba(52,152,119,${line.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(52,152,119,0)`);

        // Soft outer glow pass first (so the crisp core renders on top)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(renderEndX, renderEndY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 54 + line.seed * 36;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.18;
        ctx.filter = "blur(18px)";
        ctx.stroke();
        ctx.restore();

        // Crisp, heavy core stroke
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(renderEndX, renderEndY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 22 + line.seed * 34;
        ctx.lineCap = "round";
        ctx.stroke();

        // 5. Draw Endpoint Node Dot
        ctx.beginPath();
        ctx.fillStyle = `rgba(154,212,133,${Math.min(line.opacity * 1.5, 1)})`;
        ctx.arc(renderEndX, renderEndY, 6 + line.seed * 5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Event Bindings
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

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
    { title: "100 % Natural", desc: "Pure ingredients" },
    { title: "100 % Natural", desc: "Pure ingredients" },
    { title: "100 % Natural", desc: "Pure ingredients" },
    { title: "100 % Natural", desc: "Pure ingredients" },
  ];

  return (
  <>
    {/* ── Top Features Strip (Cleaned & Centered) ── */}
    <div className="w-full bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="w-full bg-[#F7F8F2] rounded-3xl py-14 border border-[#e2e8f0]/50 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 place-items-center">
            {featuress.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left max-w-[240px]"
              >
                {/* Fixed container sizing for the leaf image */}
                <div className="flex items-center justify-center shrink-0 bg-transparent w-12 h-12">
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

    {/* ── Footer ── */}
    <footer
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-t-4xl text-white pt-16 pb-8"
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg,#113227 18%,#349877 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[35%]"
        style={{
          background: "linear-gradient(to left, rgba(0,0,0,.45), transparent)",
        }}
      />

      {/* Background Canvas Interactive Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      />

      {/* Main Footer Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 lg:gap-8 xl:gap-20 mb-16">
          {/* 1. Brand Column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex items-center justify-center shrink-0 bg-transparent mb-2 w-32">
              <img
                src="/Global/Logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-white/60 tracking-wider mb-6 font-light">
              Organic. Nuetra. Pharma
            </p>
            <p className="text-[15px] text-white/80 leading-[1.6] max-w-[280px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna.
            </p>
          </div>

          {/* 2. Shop Links */}
          <div className="text-center sm:text-left lg:pl-8">
            <h3 className="text-[26px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
              shop
            </h3>
            <ul className="space-y-[18px]">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-[15px] text-white hover:text-[#9ad485] transition-colors font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Company Links */}
          <div className="text-center sm:text-left lg:pl-4">
            <h3 className="text-[26px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
              Company
            </h3>
            <ul className="space-y-[18px]">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-[15px] text-white hover:text-[#9ad485] transition-colors font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Care Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-[26px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
              Care
            </h3>
            <ul className="space-y-[18px]">
              {careLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-[15px] text-white hover:text-[#9ad485] transition-colors font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Features Strip Inside Footer (Perfectly Centered) ── */}
        <div className="border border-white/20 rounded-[18px] py-8 px-6 bg-black/5 backdrop-blur-sm mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left max-w-[220px]"
              >
                <div className="rounded-full flex items-center justify-center shrink-0 bg-transparent w-14 h-14">
                  <img
                    src="/Global/LeafIcon.png"
                    alt="Leaf icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white leading-tight">
                    {f.title}
                  </h4>
                  <p className="text-[13px] text-white/70 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Payment Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
          <p className="text-[13px] text-white/70 font-light tracking-wide order-2 md:order-1">
            @2026 All rights reserved.
          </p>

          <div className="flex items-center gap-4 order-1 md:order-2">
            <a
              href="/privacy"
              className="text-[13px] text-white/70 hover:text-white transition-colors font-light tracking-wide"
            >
              Privacy Policy
            </a>
            <span className="text-white/40 text-[13px]">|</span>
            <a
              href="terms"
              className="text-[13px] text-white/70 hover:text-white transition-colors font-light tracking-wide"
            >
              Terms and Conditions
            </a>
          </div>

          <div className="flex items-center gap-3 order-3">
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[36px]">
              <span className="text-[#1a1f71] text-[11px] font-extrabold italic tracking-tighter">
                VISA
              </span>
            </div>
            <div className="bg-white rounded px-2 py-[3px] flex items-center justify-center h-6 min-w-[36px]">
              <div className="flex">
                <div className="w-3.5 h-3.5 bg-[#eb001b] rounded-full opacity-90 z-10"></div>
                <div className="w-3.5 h-3.5 bg-[#f79e1b] rounded-full opacity-90 -ml-1.5"></div>
              </div>
            </div>
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[36px]">
              <span className="text-[#000] text-[10px] font-bold tracking-tight">
                UPI
              </span>
            </div>
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[40px]">
              <span className="text-[#00b9f5] text-[10px] font-bold tracking-tight">
                paytm
              </span>
            </div>
            <div className="bg-white rounded px-2.5 py-0.75 flex items-center justify-center h-6 min-w-10">
              <span className="text-[#5f6368] text-[10px] font-medium tracking-tight">
                <span className="text-[#ea4335] font-bold">G</span> Pay
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </>
);
};

export default NewFooter;