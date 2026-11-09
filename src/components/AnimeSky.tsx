import { motion } from "framer-motion";

const CLOUDS_BACK: [number, number, number][] = [
  [60, 210, 70], [140, 190, 90], [240, 215, 70], [330, 200, 80], [640, 205, 80], [730, 185, 95], [830, 210, 75], [930, 195, 85],
];
const CLOUDS_FRONT: [number, number, number][] = [
  [-10, 270, 80], [80, 255, 75], [170, 275, 70], [260, 262, 60], [700, 268, 62], [790, 252, 78], [880, 268, 70], [990, 258, 85],
  [400, 300, 70], [500, 292, 80], [600, 302, 70],
];

const GLINTS: [number, number, number][] = [
  [12, 14, 0], [30, 8, 0.8], [62, 10, 1.6], [84, 18, 0.4], [20, 40, 2.2], [78, 44, 1.2], [92, 30, 2.8], [8, 28, 3.2],
];

function Clouds() {
  return (
    <svg className="anime-clouds" viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="cloudBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9c2" />
          <stop offset="0.3" stopColor="#f59ab8" />
          <stop offset="0.75" stopColor="#7b4fa8" />
          <stop offset="1" stopColor="#3d2b78" />
        </linearGradient>
        <linearGradient id="cloudFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9d6" />
          <stop offset="0.22" stopColor="#ffa9b9" />
          <stop offset="0.6" stopColor="#5e3f99" />
          <stop offset="1" stopColor="#24195a" />
        </linearGradient>
      </defs>
      <g opacity="0.75">
        {CLOUDS_BACK.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="url(#cloudBack)" />
        ))}
      </g>
      <g>
        {CLOUDS_FRONT.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="url(#cloudFront)" />
        ))}
      </g>
    </svg>
  );
}

export default function AnimeSky() {
  return (
    <motion.div
      className="anime-sky"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.6, ease: "easeInOut" }}
    >
      <div className="anime-gradient" />
      <div className="god-rays" />
      <div className="milkyway" />
      <div className="comet comet-main" />
      <div className="comet comet-split" />
      {GLINTS.map(([x, y, d], i) => (
        <svg key={i} className="glint" viewBox="-10 -10 20 20" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }}>
          <path d="M0 -10 L1.2 -1.2 L10 0 L1.2 1.2 L0 10 L-1.2 1.2 L-10 0 L-1.2 -1.2 Z" />
        </svg>
      ))}
      <Clouds />
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i * 0.9) % 7}s`,
            animationDuration: `${7 + (i % 4) * 1.5}s`,
          }}
        />
      ))}
    </motion.div>
  );
}
