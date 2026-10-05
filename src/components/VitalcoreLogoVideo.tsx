import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const LOGO_VIDEO = "/videos/Vitalcore_logo.mp4";
const LOGO_STILL = "/brand/vitalcore-logo.svg";

type VitalcoreLogoVideoProps = {
  className?: string;
  /** When false, the still mark stays up and the clip does not start. */
  play?: boolean;
};

function keyBlack(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const m = Math.max(r, g, b);
    if (m < 12) {
      data[i + 3] = 0;
      continue;
    }
    const alpha = Math.min(255, Math.round((m / 176) * 255));
    const scale = 255 / alpha;
    data[i] = Math.min(255, Math.round(r * scale));
    data[i + 1] = Math.min(255, Math.round(g * scale));
    data[i + 2] = Math.min(255, Math.round(b * scale));
    data[i + 3] = alpha;
  }
}

export default function VitalcoreLogoVideo({ className, play = true }: VitalcoreLogoVideoProps) {
  const reduced = Boolean(useReducedMotion());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useStill, setUseStill] = useState(reduced);

  useEffect(() => {
    if (reduced || !play) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setUseStill(true);
      return;
    }

    let frameId = 0;
    let stopped = false;
    let started = false;

    const paint = () => {
      if (video.readyState < 2) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      keyBlack(frame.data);
      ctx.putImageData(frame, 0, 0);
    };

    const pump = () => {
      if (stopped) return;
      paint();
      if (video.ended || video.paused) return;
      const withFrame = video as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => number;
      };
      if (withFrame.requestVideoFrameCallback) {
        frameId = withFrame.requestVideoFrameCallback(pump);
      } else {
        frameId = requestAnimationFrame(pump);
      }
    };

    const start = () => {
      if (started || stopped) return;
      started = true;
      video.muted = true;
      void video.play().then(pump).catch(() => setUseStill(true));
    };

    video.addEventListener("loadeddata", start);
    if (video.readyState >= 2) start();

    return () => {
      stopped = true;
      cancelAnimationFrame(frameId);
      video.removeEventListener("loadeddata", start);
      video.pause();
    };
  }, [reduced, play]);

  if (reduced || useStill || !play) {
    return <img src={LOGO_STILL} alt="Vitalcore" className={className} draggable={false} />;
  }

  return (
    <span className="relative inline-flex items-center">
      <video
        ref={videoRef}
        src={LOGO_VIDEO}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="pointer-events-none absolute h-px w-px opacity-0"
      />
      <canvas
        ref={canvasRef}
        width={1024}
        height={576}
        className={className}
        role="img"
        aria-label="Vitalcore"
      />
    </span>
  );
}
