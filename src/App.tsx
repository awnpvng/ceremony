import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { slides, steps, chapterCount } from "./slides";
import Theater, { OPEN_MS } from "./components/Theater";
import PhotoReveal from "./components/PhotoReveal";
import GroupReveal from "./components/GroupReveal";
import TarotSpread from "./components/TarotSpread";
import ProgressDots from "./components/ProgressDots";
import InviteCard, { GOLD_CONFETTI } from "./components/InviteCard";
import "./App.css";
import "./scenes.css";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

const drop = (delay = 0) => ({
  initial: { y: -30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0, transition: { duration: 0.25 } },
  transition: { type: "spring" as const, stiffness: 120, damping: 14, delay },
});

const firstStepOf = slides.map((_, i) => steps.findIndex((s) => s.slide === i));

function Audience() {
  const heads = Array.from({ length: 22 }, (_, i) => {
    const x = (i / 21) * 100;
    const r = 2.6 + ((i * 7) % 5) * 0.25;
    const y = 18 - ((i * 13) % 4);
    return { x, r, y };
  });
  return (
    <svg className="audience" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 30 L0 24 Q50 18 100 24 L100 30 Z" fill="#050102" />
      {heads.map((h, i) => (
        <g key={i} className={i % 5 === 2 ? "head-sway" : undefined}>
          <ellipse cx={h.x} cy={h.y + h.r * 1.9} rx={h.r * 1.5} ry={h.r * 1.2} fill="#070203" />
          <ellipse cx={h.x} cy={h.y} rx={h.r * 0.8} ry={h.r} fill="#0a0304" />
        </g>
      ))}
    </svg>
  );
}

function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const busy = useRef(false);
  const total = steps.length;
  const step = steps[stepIndex];
  const slide = slides[step.slide];

  const goTo = useCallback(
    (target: number) => {
      if (busy.current) return;
      if (!started) {
        busy.current = true;
        setStarted(true);
        setTimeout(() => {
          confetti({ colors: GOLD_CONFETTI, particleCount: 120, spread: 100, origin: { y: 0.4 }, disableForReducedMotion: true });
        }, 600);
        setTimeout(() => (busy.current = false), OPEN_MS);
        return;
      }
      setStepIndex(Math.max(0, Math.min(total - 1, target)));
    },
    [started, total],
  );

  const next = useCallback(() => goTo(stepIndex + 1), [goTo, stepIndex]);
  const prev = useCallback(() => goTo(stepIndex - 1), [goTo, stepIndex]);

  useEffect(() => {
    for (const s of steps.slice(stepIndex + 1, stepIndex + 4)) {
      if (s.image) new Image().src = `/img/${s.image}.jpg`;
    }
  }, [stepIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onHallClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    next();
  };

  const touchX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next();
    else prev();
  };

  const isLast = started && stepIndex === total - 1;
  const zoomed = started && stepIndex > 0;
  const chaptersDone = slides.slice(0, step.slide + 1).filter((s) => s.kind === "story").length;
  const finale = slide.kind === "transition" || slide.kind === "invite";
  const lit = finale ? chapterCount : chaptersDone;

  return (
    <MotionConfig reducedMotion="user">
    <div className="hall" onClick={onHallClick} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="sconce sconce-l" />
      <div className="sconce sconce-r" />
      <div className="spot spot-l" />
      <div className="spot spot-r" />

      {started && (
        <ProgressDots total={slides.length} current={step.slide} onJump={(i) => goTo(firstStepOf[i])} />
      )}

      <Theater open={started} started={started} zoomed={zoomed} lit={started ? lit : 0} formation={finale}
        label={slide.kind === "transition"}
      >
        {started && (
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className={`scene scene-${slide.kind}`}
              exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
            >
              {slide.kind === "title" && (
                <>
                  <motion.div className="scene-kicker" {...drop(0.5)}>Prologue</motion.div>
                  <motion.h1 {...drop(0.65)}>{slide.text}</motion.h1>
                  <motion.div className="ornament" {...drop(0.8)}>❦</motion.div>
                  <motion.p className="scene-sub" {...drop(0.9)}>{slide.note}</motion.p>
                </>
              )}

              {slide.kind === "story" && (
                <>
                  <motion.div className="scene-kicker" {...drop(0.2)}>
                    Màn {ROMAN[chaptersDone - 1]} <span aria-hidden="true">{slide.sticker}</span>
                    {step.subCount > 1 && (
                      <span className="sub-count">
                        {step.sub + 1}/{step.subCount}
                      </span>
                    )}
                  </motion.div>
                  <div className="photo-slot">
                    <AnimatePresence mode="wait">
                      {step.layout === "tarot" && step.images ? (
                        <TarotSpread key="tarot" deck={step.images} active={step.sub} />
                      ) : (step.layout === "wings" || step.layout === "levelup") && step.images ? (
                        <GroupReveal key={step.layout} layout={step.layout} images={step.images} />
                      ) : (
                        step.image &&
                        step.reveal && <PhotoReveal key={step.image} reveal={step.reveal} n={step.image} badge={slide.badge} />
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.div
                    className="banner"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0, transition: { duration: 0.25 } }}
                    transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.5 }}
                  >
                    <h2>{slide.text}</h2>
                    {slide.note && <p>{slide.note}</p>}
                  </motion.div>
                </>
              )}

              {slide.kind === "transition" && (
                <motion.h1
                  className="anime-title"
                  initial={{ opacity: 0, scale: 1.25, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {slide.text}
                </motion.h1>
              )}

              {slide.kind === "invite" && (
                <>
                  <motion.h2 className="invite-headline" {...drop(0.25)}>
                    {slide.text}
                  </motion.h2>
                  <InviteCard />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </Theater>

      <Audience />

      <div className="controls">
        {started && stepIndex > 0 && (
          <button
            type="button"
            className="ctrl ctrl-prev"
            aria-label="Quay lại"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            className="ctrl ctrl-next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            {started ? "Tiếp theo" : "Mở màn"}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
    </MotionConfig>
  );
}

export default App;
