import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

const ADDRESS =
  "Trường Đại học Công nghệ Thông tin (UIT) – ĐHQG TP.HCM, Khu phố 34, Phường Linh Xuân, Thành phố Thủ Đức, TP. Hồ Chí Minh";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const CALENDAR_URL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  "Lễ mừng tốt nghiệp An An 🎓",
)}&dates=20261126T033000Z/20261126T050000Z&details=${encodeURIComponent(
  "Trương Hoàng Thành An mời cả nhà đến chung vui lễ tốt nghiệp!",
)}&location=${encodeURIComponent(ADDRESS)}`;

export const GOLD_CONFETTI = ["#d4a64a", "#fbe7a1", "#a3172c", "#f3e3b5", "#ffffff"];

export default function InviteCard() {
  useEffect(() => {
    const burst = (opts: confetti.Options) =>
      confetti({ colors: GOLD_CONFETTI, particleCount: 80, spread: 75, disableForReducedMotion: true, ...opts });
    const t1 = setTimeout(() => {
      burst({ angle: 60, origin: { x: 0, y: 0.75 } });
      burst({ angle: 120, origin: { x: 1, y: 0.75 } });
    }, 700);
    const t2 = setTimeout(() => burst({ angle: 90, spread: 130, origin: { y: 0.6 } }), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      className="playbill"
      initial={{ y: "-110vh", rotate: -3 }}
      animate={{ y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.4 }}
    >
      <div className="playbill-top">✦ Trân trọng kính mời ✦</div>
      <h2>Lễ Mừng Tốt Nghiệp</h2>
      <div className="playbill-rule" />
      <dl>
        <div>
          <dt>Người mời</dt>
          <dd>Trương Hoàng Thành An</dd>
        </div>
        <div>
          <dt>Kính mời</dt>
          <dd>anh em thân thiết của An An</dd>
        </div>
        <div>
          <dt>Thời gian</dt>
          <dd>10h30 – 12h00 · Thứ Năm, 26/11/2026</dd>
        </div>
        <div>
          <dt>Địa điểm</dt>
          <dd>
            Trường Đại học Công nghệ Thông tin (UIT) – ĐHQG TP.HCM
            <br />
            Khu phố 34, Phường Linh Xuân, Thành phố Thủ Đức, TP. Hồ Chí Minh
          </dd>
        </div>
      </dl>
      <div className="invite-actions">
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="invite-btn">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          Xem bản đồ
        </a>
        <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="invite-btn">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15" rx="2" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
          </svg>
          Thêm vào lịch
        </a>
      </div>
    </motion.div>
  );
}
