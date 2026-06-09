import { useState } from 'react';

export default function Promotion() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendLink = (e) => {
    e.preventDefault();
    // Handle link sending logic here
    console.log('Sending link to:', phoneNumber);
  };

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 py-8 font-sans antialiased">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Card: Promo Banner */}
        <div className="md:col-span-5 bg-[#1b7333] rounded-[24px] p-8 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
          <div className="z-10 max-w-[65%]">
            <h2 className="text-white font-bold text-xl leading-tight uppercase tracking-wide">
              Lorum Ipsum Lorum Ipsum
            </h2>
            <p className="text-gray-200 text-xs mt-2 font-medium leading-relaxed">
              Fuka Relax Full Body Massage Chair
            </p>
          </div>
          
          <div className="z-10 mt-6">
            <button className="bg-white text-black hover:bg-gray-100 transition-colors duration-200 font-bold text-xs px-6 py-3 rounded-full shadow-sm">
              Shop Now
            </button>
          </div>

          {/* Pixel-Perfect Custom SVG Truck Graphics */}
          <div className="absolute right-4 bottom-4 top-4 w-[40%] flex items-center justify-center pointer-events-none opacity-95">
            <svg 
              viewBox="0 0 160 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-auto text-white"
            >
              {/* Main Truck Body Frame */}
              <path 
                d="M10 15 H110 V30 H140 L155 55 V80 H135 M105 80 H50 M20 80 H10 V15 Z" 
                stroke="currentColor" 
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {/* Cab Window Divider */}
              <path 
                d="M110 30 H125 L135 50 H110 V30 Z" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinejoin="round"
              />
              {/* Medical Cross Sign */}
              <path 
                d="M50 47.5 H70 M60 37.5 V57.5" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeLinecap="round"
              />
              {/* Left Wheel Outer & Inner */}
              <circle cx="35" cy="80" r="14" stroke="currentColor" strokeWidth="5" fill="#1b7333" />
              <circle cx="35" cy="80" r="5" fill="currentColor" />
              {/* Right Wheel Outer & Inner */}
              <circle cx="120" cy="80" r="14" stroke="currentColor" strokeWidth="5" fill="#1b7333" />
              <circle cx="120" cy="80" r="5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Right Card: App Download Banner */}
        <div className="md:col-span-7 bg-[#222325] rounded-[24px] p-8 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
          <div className="z-10 max-w-[65%] flex-grow flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-5">
                <h2 className="text-white font-semibold text-2xl tracking-tight leading-none">
                  Download <br />our app
                </h2>
              </div>
              <div className="lg:col-span-7">
                <p className="text-gray-400 text-[11px] leading-normal font-light pt-1">
                  Enter your phone number and we'll send you a download link.
                </p>
              </div>
            </div>

            {/* Input & Form Area */}
            <form onSubmit={handleSendLink} className="flex flex-wrap items-center gap-4 mt-8 w-full max-w-md">
              <div className="relative flex-1 min-w-[180px]">
                <input
                  type="tel"
                  placeholder="(+xx) xxx..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#2d2e30] text-gray-300 placeholder-gray-500 text-xs rounded-lg px-4 py-3 outline-none border border-transparent focus:border-gray-600 transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="text-[#1b7333] hover:text-[#249243] font-bold text-xs uppercase tracking-wider transition-colors duration-200 whitespace-nowrap px-2 py-2"
              >
                Send Link
              </button>
            </form>
          </div>

          {/* App UI Mockup Visuals */}
          <div className="absolute right-0 bottom-0 top-0 w-[40%] hidden sm:block pointer-events-none">
            <div className="relative w-full h-full">
              {/* Yellow Top Phone Mockup */}
              <img 
                src="https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=300&q=80" 
                alt="App Interface Yellow" 
                className="absolute right-14 top-4 w-[85px] h-[150px] rounded-[14px] object-cover border-[3px] border-black shadow-2xl transform rotate-[-2deg] z-10 brightness-95 contrast-125 bg-yellow-400"
              />
              {/* Black Bottom Phone Mockup */}
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=300&q=80" 
                alt="App Interface Black" 
                className="absolute right-4 bottom-2 w-[75px] h-[130px] rounded-[12px] object-cover border-[3px] border-black shadow-2xl z-20 brightness-75 grayscale"
              />
              {/* Concrete Platform Pedestal Element */}
              <div className="absolute right-0 bottom-0 w-[140px] h-[55px] bg-gradient-to-tr from-gray-400 to-gray-200 rounded-tl-md transform skew-x-12 opacity-40 z-0"></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}