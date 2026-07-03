import React, { useEffect, useState, useRef } from 'react';
import type { MouseEvent } from 'react';

interface TileData {
  id: number;
  size: number;
  posX: number;
  posY: number;
  baseZ: number;
  floatDepth: number;
  duration: number;
  delay: string;
  opacity: number;
}

export const EtCtaSection: React.FC = () => {
  const [tiles, setTiles] = useState<TileData[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Configuration for 3D Tile Generation
  const TOTAL_TILES = 18;
  const MIN_SIZE = 60;
  const MAX_SIZE = 160;

  // Initialize tiles on client-side mount (Safe for SSR frameworks like Next.js)
  useEffect(() => {
    const generatedTiles: TileData[] = Array.from({ length: TOTAL_TILES }).map((_, i) => {
      const size = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE)) + MIN_SIZE;
      const posX = Math.floor(Math.random() * 95);
      const posY = Math.floor(Math.random() * 95);
      const baseZ = Math.floor(Math.random() * 240) - 120;
      const floatDepth = Math.floor(Math.random() * 40) + 30;
      const duration = Math.floor(Math.random() * 6) + 5;
      const delay = (Math.random() * -10).toFixed(2);
      const opacity = parseFloat((Math.random() * 0.45 + 0.45).toFixed(2));

      return {
        id: i,
        size,
        posX,
        posY,
        baseZ,
        floatDepth,
        duration,
        delay,
        opacity,
      };
    });

    setTiles(generatedTiles);
  }, []);

  // High-performance Parallax Tilt using direct Ref mutations
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current || !sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Subtle isometric tilt modulations
    const rotateXModifier = 55 - (y / rect.height) * 10;
    const rotateZModifier = -45 + (x / rect.width) * 10;

    gridRef.current.style.transform = `rotateX(${rotateXModifier}deg) rotateZ(${rotateZModifier}deg)`;
  };

  // Reset alignment smoothly when cursor departs
  const handleMouseLeave = () => {
    if (!gridRef.current) return;
    gridRef.current.style.transform = 'rotateX(55deg) rotateZ(-45deg)';
  };

  return (
    <>
      {/* Injecting keyframe animations natively to keep component drop-in ready */}
      <style>{`
        @keyframes etFloat {
          0% {
            transform: translateZ(var(--base-z)) translateY(0px);
          }
          100% {
            transform: translateZ(calc(var(--base-z) + var(--float-depth))) translateY(-25px);
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={styles.section}
      >
        {/* Animated Background Canvas */}
        <div style={styles.animationLayer}>
          <div ref={gridRef} style={styles.isometricGrid}>
            {tiles.map((tile) => (
              <div
                key={tile.id}
                style={{
                  ...styles.tile,
                  width: `${tile.size}px`,
                  height: `${tile.size}px`,
                  left: `${tile.posX}%`,
                  top: `${tile.posY}%`,
                  opacity: tile.opacity,
                  animationDuration: `${tile.duration}s`,
                  animationDelay: `${tile.delay}s`,
                  // Cast properties safely as custom CSS variables
                  ['--base-z' as any]: `${tile.baseZ}px`,
                  ['--float-depth' as any]: `${tile.floatDepth}px`,
                }}
              >
                {/* 3D Extrusion Depth Backing Layer */}
                <div style={styles.tileExtrusion} />
              </div>
            ))}
          </div>
        </div>

        {/* Foreground Action Content */}
        <div style={styles.content}>
          <h2 style={styles.title}>
            974,872 customers are already building amazing websites with Divi.{' '}
            <span style={styles.highlight}>Join the most empowered WordPress community.</span>
          </h2>
          <div style={styles.actions}>
            <a href="#" style={{ ...styles.btn, ...styles.btnPrimary }}>
              Sign up today
            </a>
            <a href="#" style={{ ...styles.btn, ...styles.btnSecondary }}>
              Explore Divi
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

// Production inline-styles fallback structure (Can readily change to CSS Modules or Tailwind classes)
const styles: Record<string, React.CSSProperties> = {
  section: {
    position: 'relative',
    width: '100%',
    minHeight: '550px',
    padding: '120px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 50% 50%, #17193b 0%, #090b14 100%)',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  animationLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    perspective: '1400px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  isometricGrid: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    top: '-10%',
    left: '-10%',
    transformStyle: 'preserve-3d',
    transform: 'rotateX(55deg) rotateZ(-45deg)',
    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  tile: {
    position: 'absolute',
    transformStyle: 'preserve-3d',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.75) 0%, rgba(29, 78, 216, 0.35) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    animationName: 'etFloat',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
    animationTimingFunction: 'linear',
  },
  tileExtrusion: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(30, 64, 175, 0.4)',
    borderRadius: '16px',
    transform: 'translateZ(-15px)',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    maxWidth: '860px',
    width: '100%',
    textAlign: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: '2.75rem',
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1.35,
    letterSpacing: '-0.02em',
    marginBottom: '40px',
  },
  highlight: {
    background: 'linear-gradient(120deg, #38bdf8 0%, #60a5fa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 36px',
    fontSize: '1.05rem',
    fontWeight: 600,
    borderRadius: '50px',
    textDecoration: 'none',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
  },
  btnSecondary: {
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
};