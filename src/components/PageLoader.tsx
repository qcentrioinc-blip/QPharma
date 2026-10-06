import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { TextRotate } from "@/components/ui/text-rotate";
import VitalcoreLogoVideo from "@/components/VitalcoreLogoVideo";
import { retryPlay } from "@/lib/play-video";
import "./pageLoader.css";

const MIN_LOADER_MS = 1200;
/** Leaf travel, then the overlay fade finishes. Homepage appears under a second. */
const ENTER_AFTER_MS = 860;

const ROTATING_TEXTS = [
  "Herbaceutical",
  "Nutraceutical",
  "Organic",
];

type PageLoaderProps = {
  ready: boolean;
  onEnter: () => void;
};

const ENTER_LEAF = "/brand/enter-leaf.jpg";
const GLOW_LEAF = "/brand/enter-leaf-glow-filled.png";

export default function PageLoader({ ready, onEnter }: PageLoaderProps) {
  const reduced = Boolean(useReducedMotion());
  const enteredRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(Date.now());
  const [canEnter, setCanEnter] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showLine, setShowLine] = useState(reduced);
  const [finePointer] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(pointer: fine)").matches;
  });
  const [holdBackground, setHoldBackground] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduced || holdBackground) {
      video.pause();
      return;
    }

    const cancel = retryPlay(video);
    return () => {
      cancel();
      video.pause();
    };
  }, [reduced, holdBackground]);

  useEffect(() => {
    if (!ready) return;
    const elapsed = Date.now() - mountedAt.current;
    const wait = Math.max(0, MIN_LOADER_MS - elapsed);
    const t = window.setTimeout(() => setCanEnter(true), wait);
    return () => window.clearTimeout(t);
  }, [ready]);

  const enter = useCallback(() => {
    if (!canEnter || enteredRef.current) return;
    enteredRef.current = true;
    setExiting(true);
    window.setTimeout(onEnter, reduced ? 120 : ENTER_AFTER_MS);
  }, [canEnter, onEnter, reduced]);

  useEffect(() => {
    if (!canEnter) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canEnter, enter]);

  const moveCursor = (e: MouseEvent) => {
    const node = cursorRef.current;
    if (!node) return;
    node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    node.classList.add("is-on");
  };

  return createPortal(
    <div
      className={`zephyr-page-loader${canEnter ? " is-ready" : ""}${exiting ? " zephyr-page-loader--exit" : ""}${finePointer ? " has-leaf-cursor" : ""}`}
      onMouseMove={finePointer ? moveCursor : undefined}
      onClick={canEnter ? enter : undefined}
      onKeyDown={(e) => {
        if (!canEnter) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          enter();
        }
      }}
      role={canEnter ? "button" : undefined}
      tabIndex={canEnter ? 0 : -1}
      aria-busy={!canEnter}
      aria-label={canEnter ? "For a better tomorrow" : undefined}
    >
      <div className="zephyr-page-loader__media" aria-hidden>
        <video
          ref={videoRef}
          className="zephyr-page-loader__video"
          src="/videos/page-lock.mp4"
          muted
          loop
          playsInline
          preload={holdBackground ? "none" : "auto"}
        />
        <div className="zephyr-page-loader__overlay" />
      </div>

      {canEnter && finePointer ? (
        <div ref={cursorRef} className="zephyr-page-loader__cursor" aria-hidden>
          <div className={`zephyr-page-loader__cursor-leaf${reduced ? " is-still" : ""}`}>
            <img src={GLOW_LEAF} alt="" draggable={false} />
            <span className="zephyr-page-loader__cursor-label">
              <span>Click to</span>
              <span>enter</span>
            </span>
          </div>
        </div>
      ) : null}

      <div className="zephyr-page-loader__copy">
        <VitalcoreLogoVideo
          className="zephyr-page-loader__logo"
          onPlaybackSettled={() => {
            setHoldBackground(false);
            setShowLine(true);
          }}
        />
        <LayoutGroup>
          <motion.p
            className="zephyr-page-loader__headline"
            initial={false}
            animate={{ opacity: showLine ? 1 : 0, y: showLine ? 0 : 12 }}
            transition={
              reduced ? { duration: 0.2 } : { duration: 0.45, ease: "easeOut" }
            }
            aria-hidden={!showLine}
          >
            <motion.span
              className="zephyr-page-loader__lead"
              layout
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
            >
              Partner for
            </motion.span>
            <TextRotate
              texts={ROTATING_TEXTS}
              mainClassName="text-white overflow-hidden justify-center"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
              auto={showLine && !reduced}
            />
          </motion.p>
        </LayoutGroup>
        {showLine && canEnter ? (
          <motion.div
            className="zephyr-page-loader__capsule"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0.2 }
                : { type: "spring", damping: 22, stiffness: 320, mass: 0.85 }
            }
            aria-hidden
          >
            <span className="zephyr-page-loader__track">
              <span
                className="zephyr-page-loader__reveal"
                style={{ backgroundImage: `url("${ENTER_LEAF}")` }}
              />
              <span
                className="zephyr-page-loader__capsule-knob"
                style={{ backgroundImage: `url("${ENTER_LEAF}")` }}
              />
              <span className="zephyr-page-loader__capsule-label">FOR A BETTER TOMORROW</span>
            </span>
          </motion.div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
