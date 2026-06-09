 
const images = [
  {
    src: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',
    alt: 'Back muscles anatomy',
    label: null,
    rotate: '-rotate-6',
    translate: 'translate-y-3',
    zIndex: 'z-10',
  },
  {
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    alt: 'Tug of war strength',
    label: null,
    rotate: '-rotate-3',
    translate: '-translate-y-1',
    zIndex: 'z-20',
  },
  {
    src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    alt: 'Heart Support',
    label: 'Heart Support',
    rotate: 'rotate-0',
    translate: '-translate-y-4',
    zIndex: 'z-30',
  },
  {
    src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
    alt: 'Fit physique',
    label: null,
    rotate: 'rotate-3',
    translate: '-translate-y-1',
    zIndex: 'z-20',
  },
  {
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    alt: 'Gym workout',
    label: null,
    rotate: 'rotate-6',
    translate: 'translate-y-3',
    zIndex: 'z-10',
  },
]

const CTA = () => {
  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Text content */}
      <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl  tracking-tight text-gray-900 mb-4 sm:mb-6">
          Lorum IPsum
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-full mx-auto">
          lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum
          ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum
          lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum lorum ipsum
        </p>
      </div>

      {/* Arc image row */}
      <div className="relative flex items-end justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px] px-2 sm:px-4">
        {images.map((img, i) => (
          <div
            key={i}
            className={`
              relative flex-shrink-0
              w-[14vw] sm:w-[13vw] md:w-[160px] lg:w-[180px] xl:w-[200px]
              aspect-[3/4]
              ${img.rotate}
              ${img.translate}
              ${img.zIndex}
              rounded-2xl sm:rounded-3xl
              overflow-hidden
              shadow-lg
              transition-transform duration-300 hover:scale-105 hover:z-40
            `}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
            {/* Overlay label */}
            {img.label && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-3">
                <p className="text-white text-[10px] sm:text-xs font-semibold text-center tracking-wide">
                  {img.label}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default CTA