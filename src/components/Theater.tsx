import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import StarMap from "./StarMap";
import AnimeSky from "./AnimeSky";

export const OPEN_MS = 1400;

const EASE = [0.65, 0, 0.35, 1] as const;

function Crest() {
  return (
    <div className="crest" aria-hidden="true">
      <svg viewBox="0 0 400 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbe7a1" />
            <stop offset="0.45" stopColor="#d4a64a" />
            <stop offset="1" stopColor="#7a5718" />
          </linearGradient>
        </defs>
        <path
          d="M4 98 Q40 98 58 78 Q70 64 62 54 Q90 50 110 36 Q150 6 200 4 Q250 6 290 36 Q310 50 338 54 Q330 64 342 78 Q360 98 396 98 Z"
          fill="url(#gold)"
          stroke="#5a3e10"
          strokeWidth="2"
        />
        <path d="M80 92 Q120 40 200 30 Q280 40 320 92" fill="none" stroke="#5a3e10" strokeWidth="1.5" opacity="0.6" />
        <path d="M100 94 Q140 52 200 44 Q260 52 300 94" fill="none" stroke="#fbe7a1" strokeWidth="1" opacity="0.5" />
        <circle cx="62" cy="64" r="7" fill="url(#gold)" stroke="#5a3e10" strokeWidth="1.5" />
        <circle cx="338" cy="64" r="7" fill="url(#gold)" stroke="#5a3e10" strokeWidth="1.5" />
      </svg>
      <span className="crest-title">Théâtre An An</span>
    </div>
  );
}

function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="hills"
        d="M0 120 Q120 70 260 100 T520 92 T780 104 T1000 86 L1000 160 L0 160 Z"
      />
      <path
        className="city"
        d="M0 140 L0 118 L40 118 L40 100 L70 100 L70 122 L110 122 L110 92 L128 92 L128 80 L146 80 L146 108 L190 108 L190 124 L230 124 L230 96 L260 96 L260 128
           L300 128 L300 104 L330 104 L330 84 L352 84 L352 118 L400 118 L400 132 L440 132 L440 108 L470 108 L470 50 L478 50 L480 18 L486 4 L492 18 L494 50 L502 50
           L502 112 L540 112 L540 90 L568 90 L568 126 L610 126 L610 100 L640 100 L640 78 L662 78 L662 116 L700 116 L700 130 L740 130 L740 98 L772 98 L772 120
           L820 120 L820 88 L846 88 L846 110 L890 110 L890 126 L930 126 L930 104 L960 104 L960 122 L1000 122 L1000 160 L0 160 Z"
      />
      {Array.from({ length: 42 }, (_, i) => {
        const x = 20 + ((i * 97) % 960);
        const y = 110 + ((i * 37) % 24);
        return <rect key={i} className="window" x={x} y={y} width="4" height="5" style={{ animationDelay: `${(i % 7) * 0.9}s` }} />;
      })}
    </svg>
  );
}

const closedL = "polygon(0% 0%, 100% 0%, 100% 30%, 100% 50%, 100% 62%, 100% 78%, 100% 100%, 0% 100%)";
const openL = "polygon(0% 0%, 100% 0%, 88% 30%, 62% 50%, 40% 62%, 58% 78%, 74% 100%, 0% 100%)";
const closedR = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 78%, 0% 62%, 0% 50%, 0% 30%)";
const openR = "polygon(12% 0%, 100% 0%, 100% 100%, 26% 100%, 42% 78%, 60% 62%, 38% 50%, 12% 30%)";

type Props = {
  open: boolean;
  started: boolean;
  zoomed: boolean;
  lit: number;
  formation: boolean;
  label: boolean;
  children: ReactNode;
};

type Fit = { s: number; tx: number; ty: number };

function useOverviewFit(ref: React.RefObject<HTMLDivElement | null>) {
  const [fit, setFit] = useState<Fit | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const vw = window.innerWidth;
      const topSpace = 24;
      const availH = window.innerHeight - topSpace - 88;
      const s = Math.min(Math.min(vw * 0.94, 1100) / w, availH / h);
      setFit({ s, tx: (vw - s * w) / 2, ty: topSpace + (availH - s * h) / 2 - el.offsetTop });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [ref]);
  return fit;
}

export default function Theater({ open, started, zoomed, lit, formation, label, children }: Props) {
  const t = { duration: OPEN_MS / 1000, ease: EASE };
  const boothRef = useRef<HTMLDivElement>(null);
  const fit = useOverviewFit(boothRef);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!fit || ready) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [fit, ready]);

  const transform = zoomed || !fit ? "none" : `translate(${fit.tx}px, ${fit.ty}px) scale(${fit.s})`;

  return (
    <div
      ref={boothRef}
      className={`booth ${ready ? "booth-ready" : ""}`}
      style={{ transform, visibility: fit ? "visible" : "hidden" }}
    >
      <Crest />
      <div className="proscenium">
        <div className="stage">
          <div className="backdrop">
            <div className="moon" />
            <Skyline />
            <AnimatePresence>{formation && <AnimeSky key="anime" />}</AnimatePresence>
            <StarMap lit={lit} formation={formation} label={label} />
            <div className="floor" />
          </div>

          <div className="beam" />
          <div className="dust" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <span
                key={i}
                style={{
                  left: `${38 + ((i * 41) % 24)}%`,
                  animationDelay: `${(i * 0.73) % 9}s`,
                  animationDuration: `${8 + (i % 5) * 2}s`,
                }}
              />
            ))}
          </div>

          <div className="stage-content">{children}</div>

          <motion.div
            className="curtain curtain-left"
            initial={false}
            animate={{ width: open ? "15%" : "51%", clipPath: open ? openL : closedL }}
            transition={t}
          >
            <motion.span className="sash" initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: open ? 1 : 0 }} />
          </motion.div>
          <motion.div
            className="curtain curtain-right"
            initial={false}
            animate={{ width: open ? "15%" : "51%", clipPath: open ? openR : closedR }}
            transition={t}
          >
            <motion.span className="sash" initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: open ? 1 : 0 }} />
          </motion.div>

          <motion.div
            className="cover-sign"
            initial={false}
            animate={{ opacity: started ? 0 : 1, y: started ? -80 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="cover-rope cover-rope-l" />
            <span className="cover-rope cover-rope-r" />
            <small>Thiệp mời</small>
            <strong>Lễ Tốt Nghiệp</strong>
            <em>của An An</em>
          </motion.div>

          <div className="valance">
            <div className="fringe" />
          </div>
          <div className="footlights" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="lamp">
                <span className="bulb" style={{ animationDelay: `${i * 0.21}s` }} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="booth-base">
        <span>✦ Lễ Tốt Nghiệp · 26.11.2026 ✦</span>
      </div>
    </div>
  );
}
