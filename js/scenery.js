/* =========================================================
   SCENERY — DARK ARCANE HEXTECH BACKDROP (thay thế cuộn tranh Thủy Mặc)

   Thay vì ảnh .jpg, xây dựng nền bằng SVG + CSS gradient.
   — Lớp gradient tối (teal/magenta quầng hextech)
   — Doodle scribbles (nét vẽ tay phát sáng drifting)
   — Giữ --bg-shift contract để main.js cuộn nền theo slide
========================================================= */

/* Bỏ BG_IMAGE (không còn dùng ảnh JPG) */
const BG_IMAGE = null;

/* ---------- DỰNG BACKDROP HEXTECH ---------- */
function renderScenes(sceneLayer) {
  const n = MEMBERS.length;

  const scroll = document.createElement("div");
  scroll.id = "sceneScroll";
  scroll.style.height = "100vh";
  scroll.dataset.segments = String(n);

  // Tạo SVG background dài (N×100vh) với doodle + hextech glow
  const bgHeight = 100 * n;  // viewport units
  const bgSvg = `
    <svg class="scene-long" viewBox="0 0 1440 ${bgHeight * 10}"
         preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="transform: translateY(var(--bg-shift, 0px))">
      <defs>
        <linearGradient id="arcaneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#0e0e1a;stop-opacity:1" />
          <stop offset="30%" style="stop-color:#0a0a14;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#070710;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#050508;stop-opacity:1" />
        </linearGradient>

      </defs>

      <!-- Base gradient -->
      <rect width="100%" height="100%" fill="url(#arcaneGrad)" />

      <!-- Scan lines ngang mờ (arcade CRT feel) -->
      <g stroke="#C8AA6E" stroke-width="1" opacity="0.04">
        ${Array.from({length: 18}, (_, i) => `<line x1="0" y1="${i * 55 * 10}" x2="1440" y2="${i * 55 * 10}"/>`).join('')}
      </g>

      <!-- Dot grid tĩnh (scattered X marks) -->
      <g fill="#C8AA6E" opacity="0.12">
        ${[[80,80],[240,200],[420,140],[600,260],[820,90],[1000,180],[1200,120],[1350,240],
           [130,320],[350,400],[550,350],[750,420],[980,300],[1150,380],[60,500],[280,560],
           [480,490],[700,540],[900,460],[1100,510],[1300,470]].map(([x,y]) =>
          `<path d="M${x-6},${y} L${x+6},${y} M${x},${y-6} L${x},${y+6}" stroke="#C8AA6E" stroke-width="1.5" fill="none" opacity="0.8"/>`
        ).join('')}
      </g>

      <!-- Diamond shapes trang trí tĩnh -->
      <g fill="none" stroke-width="1.5" opacity="0.10">
        <polygon points="160,420 175,435 160,450 145,435" stroke="#0BC4C2"/>
        <polygon points="1280,300 1295,315 1280,330 1265,315" stroke="#C8AA6E"/>
        <polygon points="720,180 735,195 720,210 705,195" stroke="#BE1E37"/>
        <polygon points="400,600 420,620 400,640 380,620" stroke="#0BC4C2"/>
        <polygon points="1050,500 1065,515 1050,530 1035,515" stroke="#C8AA6E"/>
      </g>

      <!-- Square outlines trang trí -->
      <g fill="none" stroke-width="1.5" opacity="0.08">
        <rect x="50" y="150" width="30" height="30" stroke="#C8AA6E"/>
        <rect x="1360" y="400" width="24" height="24" stroke="#0BC4C2"/>
        <rect x="680" y="340" width="20" height="20" stroke="#BE1E37"/>
        <rect x="200" y="480" width="26" height="26" stroke="#C8AA6E"/>
        <rect x="1100" y="220" width="22" height="22" stroke="#0BC4C2"/>
      </g>

      <!-- 2 geometric elements drift nhẹ -->
      <g class="neon-doodle" style="animation: driftDown 22s ease-in-out infinite; animation-delay: 0s" opacity="0.18">
        <polygon points="0,0 14,14 0,28 -14,14" fill="#C8AA6E" transform="translate(200, 60)"/>
      </g>
      <g class="neon-doodle" style="animation: driftDown 28s ease-in-out infinite; animation-delay: 8s" opacity="0.15">
        <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="#0BC4C2" stroke-width="2" transform="translate(1200, 100) rotate(15)"/>
      </g>
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

/* CSS keyframe for doodles drifting down (inject into <style>) */
const doodleStyle = document.createElement("style");
doodleStyle.textContent = `
  @keyframes driftDown {
    0%, 100% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(20vh) translateX(10px); }
    50% { transform: translateY(40vh) translateX(-8px); }
    75% { transform: translateY(60vh) translateX(5px); }
  }

  .neon-doodle {
    will-change: transform;
  }
`;
if (document.head) document.head.appendChild(doodleStyle);
