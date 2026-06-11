/* =========================================================
   Cấu hình Tailwind (CDN) — bảng màu & font ARCANE NEON × DOODLE
   Nạp SAU thẻ <script src="cdn.tailwindcss.com"> và TRƯỚC render.
========================================================= */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#F0E6D3",          // text: warm parchment
        inksoft: "#C8AA6E",      // text secondary: Riot gold
        paper: "#0a0a14",        // bg: navy-black
        paper2: "#12121e",
        seal: "#BE1E37",         // Arcane crimson
        "seal-dark": "#8C1528",
        red: "#BE1E37",          // Arcane crimson
        orange: "#0BC4C2",       // teal (was neon orange)
        gold: "#C8AA6E",         // Riot gold
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        doodle: ['"Patrick Hand"', 'cursive'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
      },
    },
  },
};
