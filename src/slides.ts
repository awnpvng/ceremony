export type Slide = {
  id: string;
  kind: "title" | "story" | "transition" | "invite";
  text: string;
  note?: string;
  images?: number[];
  sticker?: string;
  layout?: "wings" | "levelup" | "tarot";
  badge?: string;
};

export const slides: Slide[] = [
  {
    id: "title",
    kind: "title",
    text: "Hành trình đi học của An An",
    note: "Vở kịch 14 màn · Diễn viên chính: Trương Hoàng Thành An",
  },
  {
    id: "s1",
    kind: "story",
    text: `28 tháng 8 năm 2023, xuất nhập khẩu thành "du học sinh" Sài Gòn`,
    images: [19],
    sticker: "🧳",
  },
  {
    id: "s2",
    kind: "story",
    text: "Đầu tháng 9, gặp boss UIT lần 1",
    images: [14, 3],
    sticker: "🏫",
  },
  {
    id: "s3",
    kind: "story",
    text: "Kỷ niệm ngày đầu gặp gỡ các đồng IT",
    images: [7],
    sticker: "💻",
  },
  {
    id: "s4",
    kind: "story",
    text: "Buổi học lần đầu",
    note: "(lúc này còn siêng học)",
    images: [4],
    sticker: "📚",
  },
  {
    id: "s5",
    kind: "story",
    text: "Thăm ngàn cùng anh em",
    images: [5, 8, 24, 25],
    sticker: "🌲",
  },
  {
    id: "s6",
    kind: "story",
    text: "Lần đầu đi trại trên đại học",
    images: [1],
    sticker: "⛺",
  },
  {
    id: "s7",
    kind: "story",
    text: "Nhập kho khu quân sự",
    images: [9],
    sticker: "🪖",
  },
  {
    id: "s8",
    kind: "story",
    text: "Học nhiều quá sảng",
    images: [6],
    sticker: "🤯",
  },
  {
    id: "s9",
    kind: "story",
    text: "Dù đổi rất nhiều nơi",
    images: [10, 21],
    sticker: "🏃",
    layout: "wings",
  },
  {
    id: "s10",
    kind: "story",
    text: "Mỗi nơi lại kết nạp thêm giang hồ",
    images: [20, 23, 28, 30, 32],
    sticker: "😎",
  },
  {
    id: "s11",
    kind: "story",
    text: "Level up từ không có gì",
    images: [27, 26],
    sticker: "🚀",
    layout: "levelup",
  },
  {
    id: "s12",
    kind: "story",
    text: "Thành thất nghiệp toàn thời gian",
    images: [31],
    sticker: "💤",
    badge: "Lv.MAX",
  },
  {
    id: "s13",
    kind: "story",
    text: "Nhưng dù sao thì...",
    note: "(khúc này là môn cuối)",
    images: [15],
    sticker: "📝",
  },
  {
    id: "s14",
    kind: "story",
    text: "An An cũng tốt nghiệp thành công!",
    images: [18, 35, 34],
    sticker: "🎓",
    layout: "tarot",
  },
  {
    id: "s15",
    kind: "transition",
    text: "Thế nên là...",
    sticker: "✨",
  },
  {
    id: "invite",
    kind: "invite",
    text: "Cả nhà mình đến chung vui An An nheeeeee x3.14",
    sticker: "🎉",
  },
];

export const REVEALS = ["puppet", "hang", "spotlight", "flip", "easel", "scroll", "popup", "balloon"] as const;
export type Reveal = (typeof REVEALS)[number];

export type Step = {
  slide: number;
  image?: number;
  images?: number[];
  reveal?: Reveal;
  layout?: Slide["layout"];
  sub: number;
  subCount: number;
};

let photoNo = 0;
export const steps: Step[] = slides.flatMap((s, slide): Step[] => {
  const imgs = s.images ?? [];
  if (!imgs.length) return [{ slide, sub: 0, subCount: 1 }];
  if (s.layout === "wings" || s.layout === "levelup") {
    return [{ slide, images: imgs, layout: s.layout, sub: 0, subCount: 1 }];
  }
  if (s.layout === "tarot") {
    return imgs.map((image, sub) => ({ slide, image, images: imgs, layout: "tarot", sub, subCount: imgs.length }));
  }
  return imgs.map((image, sub) => ({
    slide,
    image,
    reveal: REVEALS[photoNo++ % REVEALS.length],
    sub,
    subCount: imgs.length,
  }));
});

export const chapterCount = slides.filter((s) => s.kind === "story").length;
