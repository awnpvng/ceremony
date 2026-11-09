# Thiệp mời tốt nghiệp — An An 🎓

Thiệp mời động, mỗi click/chạm mở ra một chặng trong hành trình đi học
của Trương Hoàng Thành An, kết thúc bằng thông tin buổi lễ tốt nghiệp.

Xây bằng Vite + React + TypeScript + Framer Motion + canvas-confetti.

## Phát triển

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # xuất ra dist/
npm run preview
```

## Deploy lên Vercel

Repo đã sẵn sàng cho Vercel zero-config (framework: Vite, build:
`npm run build`, output: `dist`). Chỉ cần import repo GitHub
`awnpvng/ceremony` vào Vercel và deploy.

## Nội dung

- `src/slides.ts` — toàn bộ nội dung từng trang (text + ảnh).
- `public/img/` — ảnh kỷ niệm (ảnh gốc lưu ở `img/` ở thư mục gốc,
  không commit vào git).
- `src/components/InviteCard.tsx` — thẻ thông tin buổi lễ (thời gian,
  địa điểm, link bản đồ, link thêm vào lịch).
