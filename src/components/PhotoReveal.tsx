import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import type { Reveal } from "../slides";
import { imageSizes } from "../imageSizes";

type Anim = {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
  idle?: TargetAndTransition;
  idleTransition?: Transition;
};

const OUT = { duration: 0.38, ease: "easeIn" } as const;
const loop = (duration: number): Transition => ({
  duration,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
});

const ANIMS: Record<Reveal, Anim> = {
  puppet: {
    initial: { y: "170%" },
    animate: { y: 0, transition: { type: "spring", stiffness: 110, damping: 12, delay: 0.15 } },
    exit: { y: "170%", transition: OUT },
    idle: { y: [0, -7], rotate: [-1.2, 1.2] },
    idleTransition: loop(1.4),
  },
  hang: {
    initial: { y: "-170%" },
    animate: { y: 0, transition: { type: "spring", stiffness: 80, damping: 10, delay: 0.1 } },
    exit: { y: "-170%", transition: OUT },
    idle: { rotate: [-2.2, 2.2] },
    idleTransition: loop(2.2),
  },
  spotlight: {
    initial: { clipPath: "circle(0% at 50% 50%)", filter: "brightness(2.2)" },
    animate: {
      clipPath: "circle(75% at 50% 50%)",
      filter: "brightness(1)",
      transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.35 },
    },
    exit: { clipPath: "circle(0% at 50% 50%)", transition: { duration: 0.4 } },
  },
  flip: {
    initial: { rotateY: 100, scale: 0.8, opacity: 0 },
    animate: { rotateY: 0, scale: 1, opacity: 1, transition: { type: "spring", stiffness: 70, damping: 11 } },
    exit: { rotateY: -100, scale: 0.8, opacity: 0, transition: OUT },
  },
  easel: {
    initial: { x: "-160%", rotate: -8 },
    animate: { x: 0, rotate: 0, transition: { type: "spring", stiffness: 60, damping: 9 } },
    exit: { x: "160%", rotate: 8, transition: OUT },
  },
  scroll: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -30, transition: OUT },
  },
  popup: {
    initial: { rotateX: 88, opacity: 0.3 },
    animate: { rotateX: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 8, delay: 0.1 } },
    exit: { rotateX: 88, opacity: 0, transition: OUT },
  },
  balloon: {
    initial: { y: "180%", rotate: 6 },
    animate: { y: 0, rotate: 0, transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { y: "-220%", transition: { duration: 0.6, ease: "easeIn" } },
    idle: { y: [-6, 6], rotate: [-1.5, 1.5] },
    idleTransition: loop(2.6),
  },
};

export function Photo({ n }: { n: number }) {
  const [w, h] = imageSizes[n] ?? [4, 3];
  return (
    <img
      className="photo"
      src={`/img/${n}.jpg`}
      width={w}
      height={h}
      style={{ "--r": w / h } as React.CSSProperties}
      alt={`Ảnh kỷ niệm số ${n}`}
      draggable={false}
    />
  );
}

function Harlequin() {
  return (
    <svg className="harlequin" viewBox="0 0 140 150" aria-hidden="true">
      <defs>
        <radialGradient id="skin" cx="45%" cy="40%">
          <stop offset="0" stopColor="#fff1e2" />
          <stop offset="1" stopColor="#e9bf9c" />
        </radialGradient>
        <pattern id="diamonds" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#a3172c" />
          <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="#d4a64a" />
        </pattern>
      </defs>
      <path d="M30 150 Q34 112 70 108 Q106 112 110 150 Z" fill="url(#diamonds)" stroke="#4e0812" strokeWidth="2" />
      <path
        d="M36 112 L44 102 L52 112 L60 102 L70 112 L80 102 L88 112 L96 102 L104 112 Q70 124 36 112 Z"
        fill="#fffaf0"
        stroke="#b9a98a"
        strokeWidth="1.5"
      />
      <circle cx="70" cy="74" r="30" fill="url(#skin)" stroke="#b98a68" strokeWidth="1.5" />
      <path d="M38 62 Q30 26 6 30 Q22 36 30 58 Z" fill="#a3172c" stroke="#4e0812" strokeWidth="2" />
      <path d="M102 62 Q110 26 134 30 Q118 36 110 58 Z" fill="#1f4e79" stroke="#0e2740" strokeWidth="2" />
      <path d="M40 60 Q52 8 70 4 Q88 8 100 60 Q70 48 40 60 Z" fill="#d4a64a" stroke="#6b4a14" strokeWidth="2" />
      <path d="M40 60 Q70 50 100 60 L100 66 Q70 56 40 66 Z" fill="#a3172c" stroke="#4e0812" strokeWidth="1.5" />
      <circle cx="6" cy="30" r="5" fill="#fbe7a1" stroke="#8a6420" strokeWidth="1.5" />
      <circle cx="134" cy="30" r="5" fill="#fbe7a1" stroke="#8a6420" strokeWidth="1.5" />
      <circle cx="70" cy="4" r="5" fill="#fbe7a1" stroke="#8a6420" strokeWidth="1.5" />
      <g className="eyes">
        <ellipse cx="58" cy="74" rx="3.6" ry="4.6" fill="#2b1810" />
        <ellipse cx="82" cy="74" rx="3.6" ry="4.6" fill="#2b1810" />
      </g>
      <path d="M53 66 Q58 63 63 66 M77 66 Q82 63 87 66" stroke="#2b1810" strokeWidth="1.6" fill="none" />
      <circle cx="49" cy="86" r="5" fill="#f28c9b" opacity="0.6" />
      <circle cx="91" cy="86" r="5" fill="#f28c9b" opacity="0.6" />
      <circle cx="70" cy="82" r="4.5" fill="#d63a4f" />
      <path d="M58 92 Q70 102 82 92" stroke="#7a1426" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Balloons() {
  const colors = ["#d63a4f", "#d4a64a", "#1f4e79"];
  return (
    <svg className="balloons" viewBox="0 0 160 130" aria-hidden="true">
      {[
        [40, 40, -14],
        [80, 28, 0],
        [120, 40, 14],
      ].map(([cx, cy, tilt], i) => (
        <g key={i}>
          <path d={`M${cx} ${cy + 30} Q${cx + tilt / 2} ${cy + 70} 80 128`} stroke="rgba(255,245,220,0.8)" strokeWidth="1" fill="none" />
          <ellipse cx={cx} cy={cy} rx="22" ry="27" fill={colors[i]} transform={`rotate(${tilt} ${cx} ${cy})`} />
          <ellipse cx={cx - 7} cy={cy - 10} rx="5" ry="8" fill="rgba(255,255,255,0.45)" transform={`rotate(${tilt} ${cx} ${cy})`} />
          <path d={`M${cx - 3} ${cy + 27} L${cx + 3} ${cy + 27} L${cx} ${cy + 32} Z`} fill={colors[i]} />
        </g>
      ))}
    </svg>
  );
}

function Framed({ reveal, n }: { reveal: Reveal; n: number }) {
  switch (reveal) {
    case "puppet":
      return (
        <div className="rig rig-puppet">
          <Harlequin />
          <div className="board">
            <span className="tape tape-l" />
            <span className="tape tape-r" />
            <Photo n={n} />
            <span className="mitt mitt-l" />
            <span className="mitt mitt-r" />
          </div>
        </div>
      );
    case "hang":
      return (
        <div className="rig rig-hang">
          <div className="polaroid">
            <Photo n={n} />
          </div>
        </div>
      );
    case "spotlight":
      return (
        <div className="rig rig-spotlight">
          <div className="matte">
            <Photo n={n} />
          </div>
        </div>
      );
    case "flip":
      return (
        <div className="rig rig-flip">
          <div className="card">
            <Photo n={n} />
          </div>
        </div>
      );
    case "easel":
      return (
        <div className="rig rig-easel">
          <div className="gilt">
            <Photo n={n} />
          </div>
          <svg className="easel-legs" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
            <line x1="28" y1="0" x2="8" y2="30" />
            <line x1="72" y1="0" x2="92" y2="30" />
            <line x1="50" y1="0" x2="50" y2="24" />
          </svg>
        </div>
      );
    case "scroll":
      return (
        <div className="rig rig-scroll">
          <span className="roller" />
          <motion.div
            className="parchment"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.25 }}
          >
            <Photo n={n} />
          </motion.div>
          <motion.span
            className="roller roller-bottom"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.25 }}
          />
        </div>
      );
    case "popup":
      return (
        <div className="rig rig-popup">
          <div className="polaroid">
            <Photo n={n} />
          </div>
        </div>
      );
    case "balloon":
      return (
        <div className="rig rig-balloon">
          <Balloons />
          <div className="polaroid">
            <Photo n={n} />
          </div>
        </div>
      );
  }
}

export default function PhotoReveal({ reveal, n, badge }: { reveal: Reveal; n: number; badge?: string }) {
  const a = ANIMS[reveal];
  return (
    <motion.div className={`reveal reveal-${reveal}`} initial={a.initial} animate={a.animate} exit={a.exit}>
      {reveal === "spotlight" && (
        <motion.div
          className="spot-glow"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
        />
      )}
      <motion.div className="reveal-idle" animate={a.idle} transition={a.idleTransition}>
        <Framed reveal={reveal} n={n} />
        {badge && <span className="lv-badge lv-badge-ultra">{badge}</span>}
      </motion.div>
    </motion.div>
  );
}
