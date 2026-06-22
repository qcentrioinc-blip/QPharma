import React from 'react';

interface TimelineEntry {
  year: string;
  description: string;
  fullDescription?: string;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const Timeline: React.FC = () => {
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: '/Research/Research1.png',
      alt: 'Laboratory research',
    },
    {
      id: 2,
      src: '/Research/Research2.png',
      alt: 'Scientific analysis',
    },
    {
      id: 3,
      src: '/Research/Research3.png',
      alt: 'Team research',
    },
  ];

  const timelineData: TimelineEntry[] = [
    {
      year: '2000',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      year: '2000',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      year: '2000',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      year: '2000',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      year: '2000',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      year: '2000',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Image Gallery */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-square sm:aspect-auto sm:h-64 lg:h-full group"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            from a retail store to the global chain of stores
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-full">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        </div>

        {/* Timeline Data / Text Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-8 sm:gap-y-10">
          {timelineData.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {item.year}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 ml-1 sm:ml-2 mr-3 sm:mr-4">
                  :
                </span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                  {item.description}
                </p>
                {item.fullDescription && (
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed mt-1">
                    {item.fullDescription}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Timeline;