
// import DeliveryImage from '/Global/Delivery.png'

import {
  Ambulance,
  ArrowRight,
  Smartphone,
} from "lucide-react";

const Delivery = () => {
  return (
    <section className="w-full py-10 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Card (uses image background) */}
          <div className="relative overflow-hidden rounded-[32px] min-h-[160px] lg:h-[200px]">
            {/* Background image (from public folder) */}
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
              alt="Herbal"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Optional overlay for text contrast */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 h-full p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-white text-xl lg:text-[28px] leading-tight font-medium max-w-[380px]">
                  LORUM IPSUM LORUM IPSUM
                </h2>

              

              
              </div>

              <button className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black shadow-sm transition-all duration-300 hover:gap-3 hover:shadow-lg lg:text-base">
                Shop Now
                <ArrowRight
                  size={16}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </button>
            </div>

            {/* Decorative Icon */}
            <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 opacity-90 pointer-events-none">
              <Ambulance
                size={120}
                strokeWidth={1.5}
                className="text-white hidden sm:block"
              />
            </div>
          </div>

          {/* Right Card */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#23272F] to-[#16181C] min-h-[160px] lg:h-[200px]">
            <div className="relative z-10 h-full p-6 lg:p-8 flex flex-col lg:flex-row justify-between gap-4 lg:gap-6">
              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-white text-xl lg:text-[26px] leading-tight font-medium max-w-[260px]">
                  Download our app
                </h2>

                <p className="mt-2 text-white/70 text-xs lg:text-sm max-w-[320px]">
                  Enter your phone number and we'll send you a download link.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center">
                  <input
                    type="text"
                    placeholder="(+XX) XXX..."
                    className="h-10 px-4 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/40 outline-none focus:border-green-500 transition-colors"
                  />

                  <button className="h-10 px-4 text-[#31E034] text-sm font-semibold whitespace-nowrap hover:opacity-80 transition-opacity">
                    SEND LINK
                  </button>
                </div>
              </div>

              {/* Placeholder Phones */}
              <div className="relative hidden lg:flex items-end justify-center min-w-[140px]">
                <div className="relative h-full flex items-end">
                  {/* Phone 1 */}
                  <div className="w-[60px] h-[110px] rounded-[14px] bg-black border border-white/20 shadow-2xl rotate-6 absolute -left-6 bottom-0 flex items-center justify-center">
                    <Smartphone className="text-white/40" size={24} />
                  </div>

                  {/* Phone 2 */}
                  <div className="w-[72px] h-[136px] rounded-[16px] bg-zinc-900 border border-white/20 shadow-2xl relative flex items-center justify-center">
                    <Smartphone className="text-white/40" size={28} />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute right-0 bottom-0 w-[200px] h-[200px] bg-green-500/10 blur-[100px] pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Delivery;