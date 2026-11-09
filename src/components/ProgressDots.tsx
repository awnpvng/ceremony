type Props = {
  total: number;
  current: number;
  onJump: (index: number) => void;
};

export default function ProgressDots({ total, current, onJump }: Props) {
  return (
    <>
      <nav className="progress-dots" aria-label="Chọn màn">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-current={i === current ? "step" : undefined}
            aria-label={`Màn ${i + 1} / ${total}`}
            className={`dot ${i === current ? "dot-active" : ""} ${i < current ? "dot-done" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onJump(i);
            }}
          />
        ))}
      </nav>
      <div
        className="progress-bar"
        role="progressbar"
        aria-label="Tiến trình"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current + 1}
      >
        <span style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>
    </>
  );
}
