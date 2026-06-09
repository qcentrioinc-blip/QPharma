// import React from 'react';

export default function HealthFitnessSection() {
  // Array of image placeholders matching the categories in the mockup
  const cards = [
    {
      id: 1,
      imgUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
      alt: 'Anatomy Back Spine'
    },
    {
      id: 2,
      imgUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
      alt: 'Tug of war rope tension'
    },
    {
      id: 3,
      imgUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=400&q=80',
      alt: 'Heart Support Medical'
    },
    {
      id: 4,
      imgUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=400&q=80',
      alt: 'Abs Fitness Muscle'
    },
    {
      id: 5,
      imgUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
      alt: 'Gym Fitness Athlete'
    }
  ];

  // Generate bar heights for the visualizer at the bottom
  const totalBars = 39;
  const visualizerBars = Array.from({ length: totalBars }).map((_, index) => {
    // Creating a symmetric bell-curve height distribution
    const distanceFromCenter = Math.abs(index - Math.floor(totalBars / 2));
    const maxHeight = 32; 
    const minHeight = 4;
    const height = Math.max(minHeight, maxHeight - (distanceFromCenter * 1.5));
    
    // The middle bars get the signature teal color from the image
    const isCenter = index >= 18 && index <= 20;
    return { height, isCenter };
  });

  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 py-12 bg-white font-sans antialiased select-none">
      
      {/* Top Main Heading */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-black text-4xl sm:text-5xl font-normal tracking-wide mb-3">
          Lorum IPsum
        </h1>
        <p className="text-gray-500 text-[10px] sm:text-[11px] leading-relaxed tracking-tight max-w-2xl mx-auto uppercase">
          lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum
        </p>
      </div>

      {/* 5-Column Image Card Slider Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-center justify-center px-2">
        {cards.map((card) => (
          <div 
            key={card.id}
            className="relative aspect-[4/5] w-full overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg bg-gray-100
              /* Custom asymmetric rounded corners matching the source image */
              rounded-tl-[32px] rounded-br-[32px] rounded-tr-[16px] rounded-bl-[16px]"
          >
            <img 
              src={card.imgUrl} 
              alt={card.alt}
              className="w-full h-full object-cover object-center pointer-events-none"
            />
            
            {/* Overlay treatment specifically for Card 3 (Heart Support) */}
            {card.id === 3 && (
              <div className="absolute inset-0 bg-blue-900/10 flex flex-col justify-between p-4 items-center text-center">
                <div className="w-full flex justify-center mt-6">
                  {/* Heart Glow Vector */}
                  <div className="w-16 h-16 bg-red-500 rounded-full blur-md opacity-70 absolute animate-pulse"></div>
                  <span className="text-3xl relative z-10">❤️</span>
                </div>
                <span className="text-white font-medium text-xs tracking-wide bg-black/20 px-2 py-1 rounded-md backdrop-blur-xs w-full">
                  Heart Support
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Equalizer / Waveform Graphic */}
      <div className="flex items-center justify-center gap-[3px] h-10 mt-14">
        {visualizerBars.map((bar, index) => (
          <div
            key={index}
            style={{ height: `${bar.height}px` }}
            className={`w-[2px] rounded-full transition-all duration-300 ${
              bar.isCenter ? 'bg-[#008080]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

    </section>
  );
}