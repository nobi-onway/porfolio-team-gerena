/* =========================================================
   SCENERY — NỀN ĐEN ARCADE × ĐÔNG SƠN
   — Lớp decor tĩnh: scanline CRT + dấu + + vòng-tròn-chấm
   — BÊN PHẢI: ảnh img/background.jpg cao hơn viewport;
     main.js đo bgTravel = (cao ảnh − 100vh) rồi dịch --bg-shift
     theo slide → tới slide cuối là vừa chạm ĐÁY ảnh.
   — 2 chim Lạc (ảnh bird.jpg lọc vàng đồng) bay ngang chậm.
========================================================= */

function renderScenes(sceneLayer) {
  const scroll = document.createElement("div");
  scroll.id = "sceneScroll";
  scroll.style.height = "100vh";

  /* ---- decor tĩnh ---- */
  const crosses = [[80, 80], [240, 200], [420, 140], [600, 260], [120, 420], [340, 520],
    [60, 640], [280, 720], [180, 860], [420, 800], [90, 300], [500, 400],
    [560, 620], [240, 950], [460, 60]]
    .map(([x, y]) =>
      `<path d="M${x - 6},${y} L${x + 6},${y} M${x},${y - 6} L${x},${y + 6}" stroke-width="1.5"/>`
    ).join("");

  const dotRings = [[180, 150], [380, 330], [140, 560], [330, 680], [520, 180], [80, 880]]
    .map(([x, y]) => `
      <circle cx="${x}" cy="${y}" r="10" fill="none" stroke-width="1.2"/>
      <circle cx="${x}" cy="${y}" r="2"/>`
    ).join("");

  const scan = Array.from({ length: 60 }, (_, i) =>
    `<line x1="0" y1="${i * 18}" x2="800" y2="${i * 18}"/>`
  ).join("");

  scroll.innerHTML = `
    <!-- decor tĩnh (nửa trái, không cuộn) -->
    <svg class="scene-decor" viewBox="0 0 800 1080" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
      <g stroke="#C8AA6E" opacity="0.05">${scan}</g>
      <g stroke="#C8AA6E" fill="none" opacity="0.12">${crosses}</g>
      <g stroke="#C8AA6E" fill="#C8AA6E" opacity="0.10">${dotRings}</g>
    </svg>

    <!-- ảnh nền phải — cuộn dọc theo slide -->
    <div class="scene-longwrap">
      <img class="scene-long" src="img/background.jpg" alt="" draggable="false"
           onload="window.__onSceneImg && window.__onSceneImg()"/>
      <div class="scene-veil scene-veil--long"></div>
    </div>

    <!-- chim Lạc bay ngang (ảnh thật, lọc vàng đồng) -->
    <img class="scene-birdimg scene-birdimg--1" src="img/bird.jpg" alt="" aria-hidden="true" draggable="false"/>
    <img class="scene-birdimg scene-birdimg--2" src="img/bird.jpg" alt="" aria-hidden="true" draggable="false"/>
  `;
  sceneLayer.appendChild(scroll);
}
