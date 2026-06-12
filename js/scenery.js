/* =========================================================
   SCENERY — NỀN ĐEN ARCADE × ĐÔNG SƠN (flat, không glow)
   Xây nền bằng SVG dài (N×100vh):
   — Đen tuyền + scanline CRT mờ
   — Dấu + rải rác (arcade grid) · họa tiết Đông Sơn chìm
   — Vài cánh chim Lạc trôi chậm
   Giữ contract --bg-shift để main.js cuộn nền theo slide.
========================================================= */

function renderScenes(sceneLayer) {
  const n = (typeof SLIDE_META !== "undefined" ? SLIDE_META.length : 3);

  const scroll = document.createElement("div");
  scroll.id = "sceneScroll";
  scroll.style.height = "100vh";
  scroll.dataset.segments = String(n);

  const bgHeight = 100 * n * 10;   // hệ toạ độ viewBox

  /* Dấu + rải rác */
  const crosses = [[80, 80], [240, 200], [420, 140], [600, 260], [820, 90], [1000, 180],
    [1200, 120], [1350, 240], [130, 320], [350, 400], [550, 350], [750, 420],
    [980, 300], [1150, 380], [60, 500], [280, 560], [480, 490], [700, 540],
    [900, 460], [1100, 510], [1300, 470]]
    .map(([x, y]) =>
      `<path d="M${x - 6},${y} L${x + 6},${y} M${x},${y - 6} L${x},${y + 6}" stroke-width="1.5"/>`
    ).join("");

  /* Vòng-tròn-chấm Đông Sơn chìm */
  const dotRings = [[180, 150], [760, 220], [1240, 340], [420, 520], [1050, 90], [620, 60]]
    .map(([x, y]) => `
      <circle cx="${x}" cy="${y}" r="10" fill="none" stroke-width="1.2"/>
      <circle cx="${x}" cy="${y}" r="2"/>`
    ).join("");

  /* Scanline CRT mờ */
  const scan = Array.from({ length: 26 }, (_, i) =>
    `<line x1="0" y1="${i * 40 * 10}" x2="1440" y2="${i * 40 * 10}"/>`
  ).join("");

  /* 2 chim Lạc flat trôi chậm */
  const bird = `
    <path d="M -14 3 Q -8 0 -3 0 Q 1 -6 8 -8 L 5 -2
             Q 12 -4 18 -8 Q 16 -1 8 2 Q 1 4 -4 3 Q -9 7 -14 3 Z" fill="#C8AA6E"/>
  `;

  const bgSvg = `
    <svg class="scene-long" viewBox="0 0 1440 ${bgHeight}"
         preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
         style="transform: translateY(var(--bg-shift, 0px))">
      <rect width="100%" height="100%" fill="#000000"/>

      <g stroke="#C8AA6E" opacity="0.045">${scan}</g>
      <g stroke="#C8AA6E" fill="none" opacity="0.12">${crosses}</g>
      <g stroke="#C8AA6E" fill="#C8AA6E" opacity="0.10">${dotRings}</g>

      <g class="scene-bird" style="animation-delay:0s" opacity="0.20"
         transform="translate(300, 120) scale(2.4)">${bird}</g>
      <g class="scene-bird" style="animation-delay:9s" opacity="0.14"
         transform="translate(1150, 300) scale(1.8)">${bird}</g>
    </svg>
  `;

  scroll.innerHTML = `
    <div class="scene-longwrap">
      ${bgSvg}
    </div>
    <div class="scene-veil scene-veil--long"></div>
  `;
  sceneLayer.appendChild(scroll);
}
