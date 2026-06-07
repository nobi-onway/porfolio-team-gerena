/* =========================================================
   Cấu hình Tailwind (CDN) — bảng màu & font Thủy Mặc
   Nạp SAU thẻ <script src="cdn.tailwindcss.com"> và TRƯỚC render.
========================================================= */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#1c1a17",          // mực đen ngả nâu
        inksoft: "#4a4640",      // mực nhạt
        paper: "#f4efe4",        // giấy dó
        paper2: "#efe8d8",
        seal: "#b5362a",         // đỏ son
        "seal-dark": "#8f2a20",
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
      },
    },
  },
};
