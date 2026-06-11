import React, { useState, useEffect, useRef, useCallback } from 'react'

interface Banner {
  id: number
  bg: string
  badge?: string
  headline: string
  subline: string
  highlight: string
  cta: string
  accent: string
  image: string
  footer?: string[]
  trust?: { icon: string; label: string; sub: string }[]
}

const banners: Banner[] = [
  {
    id: 1,
    bg: 'from-[#e8f5e9] to-[#f1fdf3]',
    badge: 'Q Pharma Medicines',
    headline: 'UP TO',
    highlight: '60% OFF',
    subline: 'On All Medicines',
    cta: 'Save more on your health',
    accent: '#22c55e',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
    footer: ['Trusted Medicines', 'Best Prices Guaranteed', '100% Secure & Confidential'],
  },
  {
    id: 2,
    bg: 'from-[#e0f7f4] to-[#f0fffe]',
    badge: 'FLAT',
    headline: '25%',
    highlight: 'OFF',
    subline: 'On Every Medicine — Order above ₹999',
    cta: '( For Q Pharma Members )',
    accent: '#0d9488',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    footer: ['*T&C Apply'],
  },
  {
    id: 3,
    bg: 'from-[#fefce8] to-[#fffbeb]',
    headline: 'Trusted Medicines,',
    highlight: 'Caring for You',
    subline: '',
    cta: 'Quality You Can Trust | Health Comes First',
    accent: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
    trust: [
      { icon: '✓', label: '100% Genuine Medicines', sub: 'Sourced from trusted manufacturers' },
      { icon: '✓', label: 'Best Prices Guaranteed', sub: 'Affordable healthcare for everyone' },
      { icon: '✓', label: 'Safe & Reliable', sub: 'Your health, our priority' },
    ],
  },
  {
    id: 4,
    bg: 'from-[#eff6ff] to-[#dbeafe]',
    badge: 'NEW ARRIVALS',
    headline: 'UP TO',
    highlight: '40% OFF',
    subline: 'On Health Supplements',
    cta: 'Shop Now',
    accent: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=400&q=80',
    footer: ['Free Delivery', 'Easy Returns', 'Genuine Products'],
  },
  {
    id: 5,
    bg: 'from-[#fdf4ff] to-[#fae8ff]',
    badge: 'SPECIAL OFFER',
    headline: 'BUY 2',
    highlight: 'GET 1 FREE',
    subline: 'On Selected Vitamins & Supplements',
    cta: 'Explore Deals',
    accent: '#a855f7',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80',
    footer: ['Lab Tested', 'Doctor Recommended', 'Fast Delivery'],
  },
]

const INTERVAL = 3500
const GAP = 16

const BannerCard = ({ banner }: { banner: Banner }) => (
  <div
    className={`rounded-2xl overflow-hidden bg-gradient-to-br ${banner.bg} h-[220px] sm:h-[240px] md:h-[260px] flex flex-col justify-between`}
    style={{ userSelect: 'none' }}
  >
    <div className="flex items-start justify-between p-4 sm:p-5 gap-2 flex-1">
      <div className="flex flex-col justify-between h-full flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black"
            style={{ backgroundColor: banner.accent }}
          >Q</div>
          <div>
            <p className="text-[9px] font-extrabold text-gray-800 leading-none tracking-wide">PHARMA</p>
            <p className="text-[7px] text-gray-500 leading-none">HEALTHCARE, SIMPLIFIED</p>
          </div>
        </div>
        {banner.badge && (
          <p className="text-[10px] sm:text-xs text-gray-600 font-medium mb-0.5">{banner.badge}</p>
        )}
        <div className="flex-1">
          <p className="text-sm sm:text-base font-bold text-gray-800 leading-tight">{banner.headline}</p>
          <p className="text-2xl sm:text-3xl font-black leading-none mb-1" style={{ color: banner.accent }}>
            {banner.highlight}
          </p>
          {banner.subline && (
            <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">{banner.subline}</p>
          )}
        </div>
        {banner.trust ? (
          <div className="space-y-1 mt-1">
            {banner.trust.map((t, i) => (
              <div key={i} className="flex items-start gap-1">
                <span className="text-[10px] font-bold mt-0.5" style={{ color: banner.accent }}>{t.icon}</span>
                <div>
                  <p className="text-[9px] font-semibold text-gray-700 leading-none">{t.label}</p>
                  <p className="text-[8px] text-gray-500 leading-none">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button
            className="mt-2 flex items-center gap-1 text-white text-[9px] sm:text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: banner.accent }}
          >
            <span>✓</span> {banner.cta}
          </button>
        )}
      </div>
      <div className="flex-shrink-0 w-[90px] sm:w-[110px] h-full flex items-center justify-end">
        <img
          src={banner.image}
          alt={banner.headline}
          className="w-full h-[130px] sm:h-[150px] object-cover rounded-xl"
          draggable={false}
        />
      </div>
    </div>
    {banner.footer && (
      <div className="flex items-center justify-around px-3 py-2 gap-2" style={{ backgroundColor: banner.accent }}>
        {banner.footer.map((f, i) => (
          <React.Fragment key={i}>
            <span className="text-white text-[8px] sm:text-[9px] font-semibold text-center leading-tight">{f}</span>
            {i < banner.footer!.length - 1 && <span className="text-white/50 text-[8px]">|</span>}
          </React.Fragment>
        ))}
      </div>
    )}
    {banner.trust && (
      <div className="px-3 py-2 flex items-center justify-center" style={{ backgroundColor: banner.accent }}>
        <span className="text-white text-[8px] sm:text-[9px] font-semibold">{banner.cta}</span>
      </div>
    )}
  </div>
)

const ImageBanner = () => {
  const total = banners.length
  const slides = [...banners, ...banners, ...banners]

  const [index, setIndex] = useState(total)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [activeDot, setActiveDot] = useState(0)
  const isAnimating = useRef(false)

  const getVisible = () => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 768) return 2
    return 3
  }
  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const update = () => setVisibleCount(getVisible())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Single step forward — called by the interval
  const stepForward = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true
    setIsTransitioning(true)
    setIndex(prev => prev + 1)
    setActiveDot(prev => (prev + 1) % total)
  }, [total])

  // After slide transition ends: silently reset if we've left the middle copy
  const onTransitionEnd = useCallback(() => {
    isAnimating.current = false
    setIndex(prev => {
      if (prev >= total * 2) {
        setIsTransitioning(false)
        return prev - total
      }
      if (prev < total) {
        setIsTransitioning(false)
        return prev + total
      }
      return prev
    })
  }, [total])

  // Re-enable CSS transition after a silent (instant) position reset
  useEffect(() => {
    if (!isTransitioning) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsTransitioning(true))
      )
      return () => cancelAnimationFrame(id)
    }
  }, [isTransitioning])

  // Auto-play: use a ref for stepForward so the interval never needs to restart
  const stepRef = useRef(stepForward)
  useEffect(() => { stepRef.current = stepForward }, [stepForward])

  useEffect(() => {
    const id = setInterval(() => stepRef.current(), INTERVAL)
    return () => clearInterval(id)
  }, []) // ← stable: runs once, never restarts

  const goToDot = (i: number) => {
    if (isAnimating.current) return
    const diff = i - activeDot
    if (diff === 0) return
    isAnimating.current = true
    setIsTransitioning(true)
    setIndex(prev => prev + diff)
    setActiveDot(i)
  }

  const cardWidthCalc = `calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`
  const translateCalc = `calc(${index} * ((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount} + ${GAP}px) * -1)`

  return (
    <section className="w-full py-6">
      <div className="relative max-w-full mx-auto">
        {/* Viewport */}
        <div className="overflow-hidden">
          {/* Track */}
          <div
            className="flex"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(${translateCalc})`,
              transition: isTransitioning ? 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              willChange: 'transform',
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {slides.map((banner, i) => (
              <div key={i} style={{ width: cardWidthCalc, flexShrink: 0 }}>
                <BannerCard banner={banner} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goToDot(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeDot
                  ? 'w-2.5 h-2.5 bg-green-700'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImageBanner