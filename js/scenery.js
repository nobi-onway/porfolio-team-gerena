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

        <!-- Doodle blur filter (mềm hơn neon glow của index.html) -->
        <filter id="doodleGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Base gradient -->
      <rect width="100%" height="100%" fill="url(#arcaneGrad)" />

      <!-- Ink light shafts (dải teal/gold rất mờ — Arcane atmosphere) -->
      <g opacity="0.05">
        <path d="M -200 0 Q 200 ${bgHeight*2} 400 ${bgHeight*4}"
              stroke="#0BC4C2" stroke-width="120" fill="none" stroke-linecap="round" />
        <path d="M 1200 100 Q 900 ${bgHeight*1.5} 800 ${bgHeight*3.5}"
              stroke="#C8AA6E" stroke-width="100" fill="none" stroke-linecap="round" />
        <path d="M 600 50 Q 700 ${bgHeight*2.2} 650 ${bgHeight*4}"
              stroke="#0BC4C2" stroke-width="80" fill="none" stroke-linecap="round" />
      </g>

      <!-- Floating ink doodles (hand-drawn squiggles, Arcane style) -->
      <!-- Doodle 1: wavy line (teal) -->
      <g class="neon-doodle" style="animation: driftDown ${15 + 1*2}s ease-in-out infinite; animation-delay: 0s">
        <path d="M 150 50 Q 180 70 150 90 Q 120 110 150 130"
              stroke="#0BC4C2" stroke-width="2.5" fill="none" stroke-linecap="round"
              filter="url(#doodleGlow)" opacity="0.45" />
      </g>

      <!-- Doodle 2: loop (gold) -->
      <g class="neon-doodle" style="animation: driftDown ${15 + 2*2}s ease-in-out infinite; animation-delay: ${15 + 1}s">
        <path d="M 1300 100 C 1320 80, 1350 110, 1330 140"
              stroke="#C8AA6E" stroke-width="2" fill="none" stroke-linecap="round"
              filter="url(#doodleGlow)" opacity="0.40" />
      </g>

      <!-- Doodle 3: spiral (teal) -->
      <g class="neon-doodle" style="animation: driftDown ${15 + 3*2}s ease-in-out infinite; animation-delay: ${15 + 2}s">
        <path d="M 700 60 Q 720 40, 740 60 Q 720 80, 700 60"
              stroke="#0BC4C2" stroke-width="1.8" fill="none" stroke-linecap="round"
              filter="url(#doodleGlow)" opacity="0.40" />
      </g>

      <!-- Doodle 4: zig-zag (gold) -->
      <g class="neon-doodle" style="animation: driftDown ${15 + 4*2}s ease-in-out infinite; animation-delay: ${15 + 3}s">
        <path d="M 300 120 L 330 100 L 360 120 L 390 100"
              stroke="#C8AA6E" stroke-width="1.8" fill="none" stroke-linecap="round"
              filter="url(#doodleGlow)" opacity="0.35" />
      </g>

      <!-- Doodle 5: arc (teal) -->
      <g class="neon-doodle" style="animation: driftDown ${15 + 5*2}s ease-in-out infinite; animation-delay: ${15 + 4}s">
        <path d="M 950 200 Q 980 180, 1010 200 Q 980 220, 950 200"
              stroke="#0BC4C2" stroke-width="2" fill="none" stroke-linecap="round"
              filter="url(#doodleGlow)" opacity="0.40" />
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
