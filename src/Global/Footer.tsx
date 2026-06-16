import  { useEffect, useRef } from "react";


const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

 const shopLinks = [
    { name: "Herbal Products", url: "/herbal" },
    { name: "Nuetra Products", url: "/nutraceutical" },
    { name: "Organic Products", url: "/organic" },
    { name: "Offers and Deals", url: "/" },
  ];
  // const companyLinks = ["About Us", "R & D Production", "Blogs", "Contact Us"];
  const companyLinks=[
{name: "About Us ", url:"/aboutus"},
{name: "Research", url:"/research"},
{name: "Production",  url:"/production"},
{name: "Blogs", url:"/blog"}


  ]
  // const careLinks = ["My Account", "Track order", "FAQ's", "T & Conditions"];
   const careLinks=[
    {name: "My Account", url:"/user-profile"},
    {name: "Track Order", url:"/track-order"},
    {name: "Cookie Policy", url:"/cookies"}
   ]

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

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize line particles
    const lineCount = 140;
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
      const baseLength = 300 + seed * 340;
      const targetLength = baseLength;
      const opacity = 0.02 + Math.random() * 0.2;
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
        seed
      });
    }

    let time = 0;

    // Animation Tick Engine
    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base anchor origin node coordinates (Bottom middle)
      const originX = canvas.width / 2;
      const originY = canvas.height;

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
          const influenceRadius = 180; // Distance reach of spike distortion

          if (distance < influenceRadius) {
            // Stronger pull factor if the cursor gets closer
            const power = (influenceRadius - distance) / influenceRadius;
            // Extend the lines outward along their angle toward mouse proximity
            finalTarget += power * 75 * (line.seed * 0.5 + 0.5);
          }
        }

        // 3. Smooth Lerp Physics Interpolation
        line.currentLength += (finalTarget - line.currentLength) * 0.1;

        // Calculate actual render endpoints 
        const renderEndX = originX + Math.cos(line.angle) * line.currentLength;
        const renderEndY = originY + Math.sin(line.angle) * line.currentLength;

        // 4. Draw Radial Spikes
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(renderEndX, renderEndY);
        ctx.strokeStyle = `rgba(154, 212, 133, ${line.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 5. Draw Endpoint Node Dot
        ctx.beginPath();
        ctx.arc(renderEndX, renderEndY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(154, 212, 133, ${line.opacity * 1.5})`;
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
     <div className="w-full bg-white  py-6">
      <div className="max-w-7xl mx-auto">
        <div className="w-full bg-[#F7F8F2] rounded-[24px] py-14 border border-[#e2e8f0]/50 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
            {featuress.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-4 justify-start sm:justify-center lg:justify-start"
              >
                {/* Thin outlined circle wrapper matching the image lines */}
                <div className=" flex items-center justify-center shrink-0 bg-transparent">
                  {/* Leaf Image */}
                  <img 
                    src="/Global/LeafIcon.png" 
                    alt="Leaf icon" 
                    className="w-full h-full  object-cover"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <span className="text-[15px] font-bold text-[#557c56] tracking-wide leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[13px] text-[#222222] font-medium mt-0.5 leading-snug">
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
      className="relative w-full bg-[#143224] text-white overflow-hidden rounded-t-[32px] font-sans pt-16 pb-8"
    >
      {/* ── Background Canvas Interactive Engine ── */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      />

      {/* ── Main Footer Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 lg:gap-8 xl:gap-20 mb-16">
          
          {/* 1. Brand Column */}
          <div className="flex flex-col items-center text-center ">
              <div className=" flex items-center justify-center shrink-0 bg-transparent">
                  {/* Leaf Image */}
                  <img 
                    src="/Global/LeafIcon.png" 
                    alt="Leaf icon" 
                    className="w-full h-full  object-cover"
                  />
                </div>  
            <h2 className="text-[34px] font-bold text-white tracking-wide mb-2 leading-none">
             Zephyr
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
          <div className="lg:pl-4">
            <h3 className="text-[26px] font-medium text-[#9ad485] mb-6 inline-block border-b border-[#9ad485] pb-1">
              Company
            </h3>
            <ul className="space-y-[18px]">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.url} className="text-[15px] text-white hover:text-[#9ad485] transition-colors font-light">
                    {link.name}
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
                <li key={link.name}>
                  <a href={link.url} className="text-[15px] text-white hover:text-[#9ad485] transition-colors font-light">
                    {link.name}
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
                  <div className=" rounded-full flex items-center justify-center shrink-0 bg-transparent">
                  {/* Leaf Image */}
                  <img 
                    src="/Global/LeafIcon.png" 
                    alt="Leaf icon" 
                    className="w-14 h-14  object-contain"
                  />
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
            <a href="/privacy" className="text-[13px] text-white/70 hover:text-white transition-colors font-light tracking-wide">
              Privacy Policy
            </a>
            <span className="text-white/40 text-[13px]">|</span>
            <a href="terms" className="text-[13px] text-white/70 hover:text-white transition-colors font-light tracking-wide">
              Terms and Conditions
            </a>
          </div>

          <div className="flex items-center gap-3 order-3">
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[36px]">
              <span className="text-[#1a1f71] text-[11px] font-extrabold italic tracking-tighter">VISA</span>
            </div>
            <div className="bg-white rounded px-2 py-[3px] flex items-center justify-center h-6 min-w-[36px]">
              <div className="flex">
                <div className="w-3.5 h-3.5 bg-[#eb001b] rounded-full opacity-90 z-10"></div>
                <div className="w-3.5 h-3.5 bg-[#f79e1b] rounded-full opacity-90 -ml-1.5"></div>
              </div>
            </div>
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[36px]">
              <span className="text-[#000] text-[10px] font-bold tracking-tight">UPI</span>
            </div>
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[40px]">
              <span className="text-[#00b9f5] text-[10px] font-bold tracking-tight">paytm</span>
            </div>
            <div className="bg-white rounded px-2.5 py-[3px] flex items-center justify-center h-6 min-w-[40px]">
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

export default Footer;