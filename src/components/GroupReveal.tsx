import { motion } from "framer-motion";
import { Photo } from "./PhotoReveal";

const OUT = { duration: 0.35, ease: "easeIn" } as const;

function Wings({ images }: { images: number[] }) {
  return (
    <div className="group group-wings">
      {images.map((n, i) => {
        const side = i === 0 ? -1 : 1;
        return (
          <motion.div
            key={n}
            className="reveal"
            initial={{ x: `${side * 170}%`, rotate: side * 10 }}
            animate={{ x: 0, rotate: side * -2.5, transition: { type: "spring", stiffness: 60, damping: 10, delay: 0.15 } }}
            exit={{ x: `${side * 170}%`, transition: OUT }}
          >
            <div className="gilt">
              <Photo n={n} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function LevelUp({ images }: { images: number[] }) {
  const [before, after] = images;
  return (
    <div className="group group-levelup">
      <motion.div
        className="reveal lv-before"
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: -4, transition: { type: "spring", stiffness: 160, damping: 12, delay: 0.2 } }}
        exit={{ scale: 0, transition: OUT }}
      >
        <div className="polaroid">
          <Photo n={before} />
        </div>
        <span className="lv-badge">Lv.1</span>
      </motion.div>

      <svg className="lv-arrow" viewBox="0 0 100 100" aria-hidden="true">
        <motion.path
          d="M10 85 Q40 80 55 55 T88 14"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
        />
        <motion.path
          d="M70 12 L90 12 L88 32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        />
      </svg>

      <motion.div
        className="reveal lv-after"
        initial={{ scale: 0, rotate: 14 }}
        animate={{ scale: 1, rotate: 3, transition: { type: "spring", stiffness: 160, damping: 11, delay: 1.45 } }}
        exit={{ scale: 0, transition: OUT }}
      >
        <div className="polaroid">
          <Photo n={after} />
        </div>
        <span className="lv-badge lv-badge-max">Lv.36</span>
        <motion.span
          className="lv-burst"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 11, delay: 1.9 }}
        >
          LEVEL UP!
        </motion.span>
      </motion.div>
    </div>
  );
}

export default function GroupReveal({ layout, images }: { layout: "wings" | "levelup"; images: number[] }) {
  return layout === "wings" ? <Wings images={images} /> : <LevelUp images={images} />;
}
