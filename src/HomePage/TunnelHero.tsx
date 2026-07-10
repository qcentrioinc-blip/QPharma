  import React, { useEffect, useRef } from "react";

  /**
   * TunnelHero
   * -----------
   * Recreates the Elegant Themes / Divi "blue tunnel" section.
   *
   * How the real animation actually works (confirmed from a screen recording):
   *  - It is NOT a WebGL/Three.js camera flythrough, and there is NO hover
   *    or mouse-parallax interaction.
   *  - It is built from two layered, rounded-corner "panels" per side:
   *      1. An outer panel with a bright blue glow gradient.
   *      2. A translucent frosted "glass" panel layered in front of it,
   *         rotated slightly further on the Y axis.
   *    Both are flat rounded rectangles rotated in 3D (CSS perspective +
   *    rotateY), which is what gives them their trapezoid look with rounded
   *    corners.
   *  - The ONLY animation trigger is scroll position: as the section moves
   *    through the viewport, the panel group scales up (anchored toward the
   *    bottom), simulating moving deeper into the tunnel. There's no
   *    autoplay loop and no pointer interaction.
   *
   * This component reproduces that exact behavior with plain CSS 3D
   * transforms driven by a scroll listener — no WebGL/Three.js dependency
   * required, which also makes it considerably cheaper to render.
   */

  export interface TunnelCta {
    label: string;
    href: string;
  }

  export interface TunnelHeroProps {
    heading: string;
    primaryCta?: TunnelCta;
    secondaryCta?: TunnelCta;
    /** How much the tunnel scales up by the time the section has fully passed through view. Default: 0.6 (i.e. up to 1.6x). */
    maxScaleBoost?: number;
    minHeight?: string;
    className?: string;
  }

  const TunnelHero: React.FC<TunnelHeroProps> = ({
    heading,
    primaryCta,
    secondaryCta,
    maxScaleBoost = 0.6,
    minHeight = "100vh",
    className = "",
  }) => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
      const sectionEl = sectionRef.current;
      const stageEl = stageRef.current;
      if (!sectionEl || !stageEl) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Show a static, fully-scaled frame and skip the scroll listener entirely.
        stageEl.style.transform = `scale(${1 + maxScaleBoost})`;
        return;
      }

      let ticking = false;

      function computeProgress(): number {
        const rect = sectionEl!.getBoundingClientRect();
        const viewportH = window.innerHeight;

        // Progress goes from 0 (section just entering the bottom of the
        // viewport) to 1 (section's top has reached the top of the viewport).
        // This mirrors the "scroll past = zoom in" behavior observed on the
        // reference site.
        const total = rect.height + viewportH;
        const traveled = viewportH - rect.top;
        const progress = traveled / total;

        return Math.min(Math.max(progress, 0), 1);
      }

      function applyProgress() {
        const p = computeProgress();
        const scale = 1 + p * maxScaleBoost;
        stageEl!.style.transform = `scale(${scale})`;
        ticking = false;
      }

      function onScroll() {
        if (!ticking) {
          ticking = true;
          rafRef.current = requestAnimationFrame(applyProgress);
        }
      }

      applyProgress();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(rafRef.current);
      };
    }, [maxScaleBoost]);

    return (
      <section
        ref={sectionRef}
        className={`tunnel-hero ${className}`.trim()}
        style={{ minHeight }}
      >
        <div ref={stageRef} className="tunnel-hero__stage">
          <div className="tunnel-hero__group tunnel-hero__group--left">
            <div className="tunnel-hero__panel tunnel-hero__panel--blue tunnel-hero__panel--left-outer" />
            <div className="tunnel-hero__panel tunnel-hero__panel--glass tunnel-hero__panel--left-inner" />
          </div>
          <div className="tunnel-hero__group tunnel-hero__group--right">
            <div className="tunnel-hero__panel tunnel-hero__panel--blue tunnel-hero__panel--right-outer" />
            <div className="tunnel-hero__panel tunnel-hero__panel--glass tunnel-hero__panel--right-inner" />
          </div>
        </div>

        <div className="tunnel-hero__content">
          <h2 className="tunnel-hero__heading">{heading}</h2>
          {(primaryCta || secondaryCta) && (
            <div className="tunnel-hero__actions">
              {primaryCta && (
                <a href={primaryCta.href} className="tunnel-hero__btn tunnel-hero__btn--solid">
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta && (
                <a href={secondaryCta.href} className="tunnel-hero__btn tunnel-hero__btn--outline">
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>

        <style>{`
          .tunnel-hero {
            position: relative;
            width: 100%;
            background: #000000;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .tunnel-hero__stage {
            position: absolute;
            inset: 0;
            perspective: 1400px;
            will-change: transform;
            transform: scale(1);
          }

          .tunnel-hero__group {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 50%;
            transform-style: preserve-3d;
          }
          .tunnel-hero__group--left { left: 0; }
          .tunnel-hero__group--right { right: 0; }

          .tunnel-hero__panel {
            position: absolute;
            top: 50%;
            width: 50vw;
            height: 140vh;
            max-height: 900px;
            border-radius: 32px;
          }

          /* Bright blue glow panel, behind the glass panel */
          .tunnel-hero__panel--blue {
            background:
              radial-gradient(circle at 20% 80%, rgba(124, 255, 182, 0.95) 0%, rgba(41, 170, 92, 0.7) 28%, rgba(11, 67, 38, 0.35) 55%, rgba(0,0,0,0) 72%),
              linear-gradient(135deg, #082117 0%, #1f7a45 55%, #0b2417 100%);
          }

          /* Translucent frosted glass panel, layered in front */
          .tunnel-hero__panel--glass {
            background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(180,190,220,0.08) 45%, rgba(255,255,255,0.02) 100%);
            backdrop-filter: blur(1px);
          }

          .tunnel-hero__panel--left-outer {
            left: -10vw;
            transform: translateY(-50%) rotateY(56deg);
            transform-origin: left center;
          }
          .tunnel-hero__panel--left-inner {
            left: -4vw;
            transform: translateY(-50%) rotateY(66deg) translateZ(6px);
            transform-origin: left center;
          }
          .tunnel-hero__panel--right-outer {
            right: -10vw;
            transform: translateY(-50%) rotateY(-56deg);
            transform-origin: right center;
          }
          .tunnel-hero__panel--right-inner {
            right: -4vw;
            transform: translateY(-50%) rotateY(-66deg) translateZ(6px);
            transform-origin: right center;
          }

          .tunnel-hero__content {
            position: relative;
            z-index: 2;
            max-width: 900px;
            padding: 0 24px;
            text-align: center;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }

          .tunnel-hero__heading {
            font-size: clamp(1.6rem, 4vw, 2.6rem);
            font-weight: 700;
            line-height: 1.25;
            letter-spacing: -0.01em;
            margin-bottom: 28px;
            text-shadow: 0 2px 24px rgba(0, 0, 0, 0.6);
          }

          .tunnel-hero__actions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            flex-wrap: wrap;
          }

          .tunnel-hero__btn {
            font-family: inherit;
            font-size: 0.95rem;
            font-weight: 600;
            padding: 14px 28px;
            border-radius: 999px;
            cursor: pointer;
            transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
            border: 1.5px solid transparent;
            text-decoration: none;
            display: inline-block;
          }

          .tunnel-hero__btn--solid {
            background: #ffffff;
            color: #0f1f17;
          }
          .tunnel-hero__btn--solid:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(124, 255, 182, 0.24);
          }

          .tunnel-hero__btn--outline {
            background: transparent;
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.8);
          }
          .tunnel-hero__btn--outline:hover {
            background: rgba(124, 255, 182, 0.14);
            transform: translateY(-2px);
          }

          @media (max-width: 600px) {
            .tunnel-hero__heading {
              font-size: 1.35rem;
              margin-bottom: 22px;
            }
            .tunnel-hero__btn {
              padding: 12px 22px;
              font-size: 0.88rem;
            }
            .tunnel-hero__panel {
              width: 90vw;
              height: 60vh;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .tunnel-hero__stage {
              transition: none;
            }
          }
        `}</style>
      </section>
    );
  };

  export default TunnelHero;