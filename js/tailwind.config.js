/* =========================================================
   Cấu hình Tailwind (CDN) — bảng màu & font ARCADE × ĐÔNG SƠN
   Nền đen tuyền · vàng đồng + đỏ son · flat, không neon.
   Nạp SAU thẻ <script src="cdn.tailwindcss.com"> và TRƯỚC render.
========================================================= */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#F0E6D3",          // text: giấy dó ấm
        inksoft: "#C8AA6E",      // text secondary: vàng đồng
        paper: "#000000",        // bg: đen tuyền (arcade CRT)
        paper2: "#0d0b08",
        seal: "#BE1E37",         // đỏ son
        "seal-dark": "#8C1528",
        red: "#BE1E37",
        gold: "#C8AA6E",         // vàng đồng (trống đồng)
        bronze: "#8B6914",       // đồng sậm
        jade: "#3E8E7E",         // ngọc bích (accent phụ, flat)
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        doodle: ['"Patrick Hand"', 'cursive'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
      },
    },
  },
};
