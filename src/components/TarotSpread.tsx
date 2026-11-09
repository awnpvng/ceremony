import { motion } from "framer-motion";
import { imageSizes } from "../imageSizes";

const ARCANA = [
  { no: "XIX", name: "The Sun" },
  { no: "XVII", name: "The Star" },
  { no: "0", name: "The Fool" },
];

const EASE = [0.65, 0, 0.35, 1] as const;

export default function TarotSpread({ deck, active }: { deck: number[]; active: number }) {
  return (
    <div className="tarot">
      {deck.map((n, i) => {
        const offset = i - active;
        const revealed = i <= active;
        const arcana = ARCANA[i % ARCANA.length];
        const [w, h] = imageSizes[n] ?? [3, 4];
        return (
          <motion.div
            key={n}
            className={`tarot-card ${offset === 0 ? "is-active" : ""}`}
            style={{ zIndex: 10 - Math.abs(offset) }}
            initial={{ y: "-130%", x: 0, rotate: 0, scale: 0.7, opacity: 0 }}
            animate={{
              y: offset === 0 ? 0 : "6%",
              x: `${offset * 64}%`,
              rotate: offset * 9,
              scale: offset === 0 ? 1 : 0.78,
              opacity: 1,
              filter: offset === 0 ? "brightness(1)" : "brightness(0.6)",
            }}
            exit={{ y: "-130%", opacity: 0, transition: { duration: 0.35, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.1 + i * 0.12 }}
          >
            <motion.div
              className="tarot-inner"
              initial={{ rotateY: 180 }}
              animate={{ rotateY: revealed ? 0 : 180 }}
              transition={{ duration: 1, ease: EASE, delay: revealed ? 0.7 : 0 }}
            >
              <div className="tarot-face tarot-front">
                <span className="tarot-no">{arcana.no}</span>
                <div className="tarot-window">
                  <img src={`/img/${n}.jpg`} width={w} height={h} alt={`Lá bài ${arcana.name}: ảnh kỷ niệm số ${n}`} draggable={false} />
                </div>
                <span className="tarot-name">{arcana.name}</span>
                <span className="tarot-sheen" aria-hidden="true" />
              </div>
              <div className="tarot-face tarot-back">
                <img src="/img/tarot-back.jpg" alt="" draggable={false} />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
