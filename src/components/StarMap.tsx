import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const RING: [number, number][] = [
  [18, 68], [14, 56], [15, 44], [19, 32], [26, 22], [36, 16], [46, 13],
  [56, 13], [66, 16], [75, 22], [82, 32], [86, 44], [86, 56], [82, 68],
];

// graduation cap drawn in a 100 x 60 box
const CAP: [number, number][] = [
  [5, 24], [50, 4], [95, 24], [50, 44], [23, 32], [23, 50], [50, 58],
  [77, 50], [77, 32], [50, 24], [70, 27], [88, 31], [88, 45], [90, 54],
];
const CAP_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12], [12, 13],
];

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Props = {
  lit: number;
  formation: boolean;
  label: boolean;
};

export default function StarMap({ lit, formation, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 600 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const field = useMemo(() => {
    const rand = mulberry32(7);
    return Array.from({ length: 70 }, () => ({
      x: rand() * 100,
      y: rand() * 68,
      s: rand() * 1.6 + 0.6,
      d: rand() * 4 + 2,
      o: rand() * 3,
    }));
  }, []);

  const { w, h } = size;
  const fh = Math.min(h * 0.42, (w * 0.62) / (100 / 60));
  const fw = fh * (100 / 60);
  const fx = w / 2 - fw / 2;
  const fy = h * 0.16;

  const pos = (i: number): [number, number] =>
    formation
      ? [fx + (CAP[i][0] / 100) * fw, fy + (CAP[i][1] / 60) * fh]
      : [(RING[i][0] / 100) * w, (RING[i][1] / 100) * h];

  const ringEdges = RING.slice(0, -1).map((_, i) => [i, i + 1] as [number, number]);

  return (
    <div className={`starmap ${formation ? "starmap-anime" : ""}`} ref={ref} aria-hidden="true">
      {field.map((s, i) => (
        <span
          key={i}
          className="twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animationDuration: `${s.d}s`,
            animationDelay: `${s.o}s`,
          }}
        />
      ))}
      <span className="shooting-star" />

      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <radialGradient id="starGlow">
            <stop offset="0" stopColor="#fffbe8" stopOpacity="1" />
            <stop offset="0.35" stopColor="#ffe9a8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffd56b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="animeLine" gradientUnits="userSpaceOnUse" x1={fx} y1={fy} x2={fx + fw} y2={fy + fh}>
            <stop offset="0" stopColor="#8fe3ff" />
            <stop offset="0.5" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ff8fd0" />
          </linearGradient>
        </defs>

        {ringEdges.map(([a, b]) => {
          const [x1, y1] = pos(a);
          const [x2, y2] = pos(b);
          const show = !formation && b < lit;
          return (
            <motion.line
              key={`r${a}`}
              className="ring-line"
              initial={false}
              animate={{ x1, y1, x2, y2, opacity: show ? 0.45 : 0 }}
              transition={{ duration: formation ? 0.5 : 0.9 }}
            />
          );
        })}

        {CAP_EDGES.map(([a, b], i) => {
          const [x1, y1] = pos(a);
          const [x2, y2] = pos(b);
          return (
            <motion.path
              key={`c${i}`}
              className="cap-line"
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
              initial={false}
              animate={{ pathLength: formation ? 1 : 0, opacity: formation ? 1 : 0 }}
              transition={{ duration: 0.6, delay: formation ? 1.5 + i * 0.12 : 0 }}
            />
          );
        })}

        {formation &&
          CAP_EDGES.map(([a, b], i) => {
            const [x1, y1] = pos(a);
            const [x2, y2] = pos(b);
            return (
              <path
                key={`f${i}`}
                className="cap-flow"
                pathLength={1}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                style={{ animationDelay: `${3 + i * 0.15}s` }}
              />
            );
          })}

        {RING.map((_, i) => {
          const [x, y] = pos(i);
          const on = i < lit;
          const current = !formation && i === lit - 1;
          return (
            <motion.g
              key={i}
              initial={false}
              animate={{ x, y }}
              transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1], delay: formation ? i * 0.05 : 0 }}
            >
              <motion.circle
                r={on ? (current ? 22 : 13) : 0}
                fill="url(#starGlow)"
                initial={false}
                animate={{ opacity: on ? (current ? [0.7, 1, 0.7] : 0.8) : 0 }}
                transition={current ? { duration: 1.6, repeat: Infinity } : { duration: 0.6 }}
              />
              <motion.path
                d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z"
                fill={on ? "#fffbe8" : "rgba(255,255,255,0.35)"}
                initial={false}
                animate={{ scale: on ? (current ? 1.25 : 0.85) : 0.35, rotate: current ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 10 }}
              />
              {formation && (
                <>
                  <motion.circle
                    className="star-burst"
                    initial={{ r: 0, opacity: 0.9 }}
                    animate={{ r: 34, opacity: 0 }}
                    transition={{ duration: 1.1, delay: 1.45 + i * 0.05, ease: "easeOut" }}
                  />
                  <g className="star-glint" style={{ animationDelay: `${(i % 5) * 0.6}s` }}>
                    <path d="M-26 0 L26 0 M0 -26 L0 26" />
                  </g>
                </>
              )}
            </motion.g>
          );
        })}
      </svg>

      <motion.div
        className="constellation-label"
        style={{ top: fy + fh + 14 }}
        initial={false}
        animate={{ opacity: formation && label ? 1 : 0, y: formation && label ? 0 : 10 }}
        transition={{ duration: 0.8, delay: formation ? 2.8 : 0 }}
      >
        ✦ Chòm sao Tốt Nghiệp ✦
      </motion.div>
    </div>
  );
}
