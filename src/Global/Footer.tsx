const Footer = () => {
  const shopLinks = ["Herbal Products", "Nuetra Products", "Organic Products", "Offers and Deals"];
  const companyLinks = ["About Us", "Our Story", "Blogs", "Contact Us"];
  const careLinks = ["My Account", "Track order", "FAQ's", "T & Conditions"];

  const topBannerItems = [
    { title: "100 % Natural", desc: "Pure ingredients" },
    { title: "100 % Natural", desc: "Pure ingredients" },
    { title: "100 % Natural", desc: "Pure ingredients" },
    { title: "100 % Natural", desc: "Pure ingredients" },
  ];

  const features = [
    { title: "Free Shipping", desc: "Lorem ipsum dolor sit" },
    { title: "Easy Returns", desc: "Lorem ipsum dolor sit" },
    { title: "Secure Payments", desc: "Lorem ipsum dolor sit" },
    { title: "24/7 Support", desc: "Lorem ipsum dolor sit" },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>

      {/* ── Top Banner Strip (cream/beige background) ── */}
      <div className="w-full ">
        <div className="max-w-7xl mx-auto rounded-lg my-10 bg-[#F7F8F2] px-6 sm:px-8 lg:px-10 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {topBannerItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {/* Circle with leaf icon */}
                <div className="w-18 h-18    shrink-0 flex items-center justify-center">
                  <img
                    src="/Global/LeafIcon.png"
                    alt="leaf"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <p className="text-md font-bold text-[#547A3D] leading-tight">{item.title}</p>
                  <p className="text-xs text-[#113227]/70 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="w-full rounded-t-4xl bg-[#113227]">

        {/* ── Main grid ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-10 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-x-16 xl:gap-x-24 gap-y-8">

            {/* ── Brand Column ── */}
            <div className="lg:pr-8">
              <div className="w-32 h-32 rounded-full flex items-center justify-center mb-4 overflow-visible">
                <img
                  src="/Global/LeafIcon.png"
                  alt="Leaf"
                  className="w-20 h-20 object-contain"
                />
              </div>

              <h2 className="text-3xl font-bold text-white leading-tight">Q Pharma</h2>
              <p className="text-xs tracking-widest text-white/60 mt-1 mb-4">
                Organic. Nuetra. Pharma
              </p>
              <p className="text-sm text-white/80 leading-snug max-w-95">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna.
              </p>
            </div>

            {/* ── Shop ── */}
            <div className="xl:pt-10">
              <h3 className="text-[28px] text-[#BAEB9C] underline underline-offset-4 mb-4">
                shop
              </h3>
              <ul className="space-y-4">
                {shopLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Company ── */}
            <div className="xl:pt-10">
              <h3 className="text-[28px] text-[#BAEB9C] underline underline-offset-4 mb-4">
                Company
              </h3>
              <ul className="space-y-4">
                {companyLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Care ── */}
            <div className="xl:pt-10">
              <h3 className="text-[28px] text-[#BAEB9C] underline underline-offset-4 mb-4">
                Care
              </h3>
              <ul className="space-y-4">
                {careLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ── Features strip ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="border-2 border-white/20 px-8 sm:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center overflow-visible">
                    <img
                      src="/Global/LeafIcon.png"
                      alt="leaf"
                      className="w-9 h-9 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{f.title}</p>
                    <p className="text-xs text-white/60 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-xs text-white/60 order-2 sm:order-1">
              @2026 All rights reserved.
            </p>

            <div className="flex items-center gap-3 order-1 sm:order-2">
              <a href="#" className="text-xs text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-white/30 text-xs">|</span>
              <a href="#" className="text-xs text-white/70 hover:text-white transition-colors">
                Terms and Conditions
              </a>
            </div>

            <div className="flex items-center gap-2 order-3">
              <span className="text-[10px] font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1 tracking-wide">
                VISA
              </span>
              <span className="bg-white/10 border border-white/20 rounded px-2 py-1 flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block -ml-1.5" />
              </span>
              <span className="text-[10px] font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1 tracking-wide">
                UPU
              </span>
              <span className="text-[10px] font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1 tracking-wide">
                PayTM
              </span>
              <span className="text-[10px] font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1 tracking-wide">
                GPay
              </span>
            </div>

          </div>
        </div>

      </footer>
    </div>
  );
};

export default Footer;