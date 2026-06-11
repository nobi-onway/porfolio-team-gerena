/* =========================================================
   RENDER — TEAM STORIES (5 layout riêng cho 5 thành viên)
   Phụ thuộc: MEMBERS, POSES (data.js)
   Xuất ra:  renderMembers(stage, navDots, onDotClick)
             renderDrum(container)
========================================================= */

/* =========================================================
   CÔNG CỤ — icon SVG hextech neon, hover glow
   (chỉ dùng cho Artist khi có m.skills)
========================================================= */
const INK_HEX = "ffffff";  /* neon cyan (xưa: ink black) */

function adobeBadge(letters) {
  return `<svg viewBox="0 0 48 48" class="ic-svg" xmlns="http://www.w3.org/2000/svg" style="filter:url(#neonGlowSoft)">
    <text x="24" y="32" text-anchor="middle"
          font-family="'Oswald', sans-serif" font-weight="700"
          font-size="22" fill="currentColor">${letters}</text>
  </svg>`;
}

const CUSTOM_ICONS = {
  ps: adobeBadge("Ps"),
  ai: adobeBadge("Ai"),
  ae: adobeBadge("Ae"),
  pr: adobeBadge("Pr"),
  spine: `<svg viewBox="0 0 48 48" class="ic-svg" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor">
      <path d="M18 12 q 6 -2.4 12 0 q -1.2 3.8 -6 4.3 q -4.8 -0.5 -6 -4.3 Z"/>
      <path d="M18.7 17.8 q 5.3 -2.1 10.6 0 q -1.1 3.4 -5.3 3.8 q -4.2 -0.4 -5.3 -3.8 Z"/>
      <path d="M19.4 23.4 q 4.6 -1.9 9.2 0 q -0.95 3.1 -4.6 3.5 q -3.65 -0.4 -4.6 -3.5 Z"/>
      <path d="M20.2 28.7 q 3.8 -1.7 7.6 0 q -0.85 2.7 -3.8 3 q -2.95 -0.3 -3.8 -3 Z"/>
      <path d="M21 33.6 q 3 -1.4 6 0 q -0.7 2.3 -3 2.6 q -2.3 -0.3 -3 -2.6 Z"/>
      <path d="M21.9 38 q 2.1 -1.1 4.2 0 q -0.6 1.9 -2.1 2.1 q -1.5 -0.2 -2.1 -2.1 Z"/>
    </g>
  </svg>`,
};

function skillTagHTML(s) {
  if (typeof s === "string") s = { name: s };
  const title = s.name || "";
  const brand = s.color ? `#${s.color}` : "var(--seal)";
  if (s.icon && CUSTOM_ICONS[s.icon]) {
    return `<span class="skill-chip skill-chip--framed skill-chip--svg" title="${title}" aria-label="${title}"
                  style="--brand:${brand}">${CUSTOM_ICONS[s.icon]}</span>`;
  }
  if (s.slug) {
    const inkSrc = `https://cdn.simpleicons.org/${s.slug}/${INK_HEX}`;
    const colorSrc = `https://cdn.simpleicons.org/${s.slug}/${s.color || INK_HEX}`;
    const fallback = `this.closest('.skill-chip').outerHTML='<span class=\\'skill-chip skill-chip--framed skill-chip--text\\' title=\\'${title}\\'>${title}</span>'`;
    return `<span class="skill-chip skill-chip--framed" title="${title}" aria-label="${title}" style="--brand:${brand}">
      <img class="ic ic-ink"   src="${inkSrc}"   alt="${title}" loading="lazy" draggable="false" onerror="${fallback}"/>
      <img class="ic ic-color" src="${colorSrc}" alt="" aria-hidden="true" loading="lazy" draggable="false"/>
    </span>`;
  }
  return `<span class="skill-chip skill-chip--framed skill-chip--text" title="${title}">${title}</span>`;
}

/* ---- Chọn pose theo role ---- */
function poseFor(role) {
  if (role === "Game Designer") return POSES.designer;
  if (role === "Game Artist") return POSES.artist;
  return POSES.developer;
}

/* ---- Chim Lạc doodle ink (hand-drawn, Arcane style) ---- */
function lacBird() {
  return `<g style="filter:url(#inkEdge)">
    <!-- cánh trái -->
    <path d="M -8 0 Q -15 -5 -20 -2" stroke="#C8AA6E" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <!-- cánh phải -->
    <path d="M 8 0 Q 15 -5 20 -2" stroke="#C8AA6E" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <!-- thân + cổ -->
    <path d="M 0 2 Q 0 8 2 12" stroke="#C8AA6E" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <!-- đầu -->
    <circle cx="3" cy="14" r="2" fill="#8B6914" stroke="#C8AA6E" stroke-width="0.8"/>
  </g>`;
}

function dongSonDrum() {
  const C = 100;

  // Neon hextech concentric circles + center glow (thay thế toàn bộ ray/dot/saw/bird logic)
  return `
    <svg class="dongson-drum" viewBox="0 0 200 200" aria-hidden="true" style="filter:url(#inkSplash)">
      <!-- Outer circle (gold) -->
      <circle class="neon-circle" cx="100" cy="100" r="95"
              fill="none" stroke="#C8AA6E" stroke-width="2" opacity="0.6"/>

      <!-- Mid circle (teal) -->
      <circle class="neon-circle" cx="100" cy="100" r="68"
              fill="none" stroke="#0BC4C2" stroke-width="1.8" opacity="0.4"/>

      <!-- Inner circle (gold) -->
      <circle class="neon-circle" cx="100" cy="100" r="45"
              fill="none" stroke="#C8AA6E" stroke-width="1.5" opacity="0.5"/>

      <!-- Center core (gold ink) -->
      <circle class="neon-core" cx="100" cy="100" r="12"
              fill="#8B6914" opacity="0.7"/>
      <circle class="neon-core" cx="100" cy="100" r="7"
              fill="#C8AA6E" opacity="0.85"/>

      <!-- Ink accent lines (6 rays, teal) -->
      <g stroke="#0BC4C2" stroke-width="1.2" opacity="0.3">
        <line x1="100" y1="100" x2="100" y2="20" />
        <line x1="100" y1="100" x2="160" y2="40" />
        <line x1="100" y1="100" x2="160" y2="160" />
        <line x1="100" y1="100" x2="100" y2="180" />
        <line x1="100" y1="100" x2="40" y2="160" />
        <line x1="100" y1="100" x2="40" y2="40" />
      </g>
    </svg>
  `;
}

/* ---- Avatar khung nét đứt + pose ---- */
function avatarHTML(m, size) {
  const sz = size || "w-full max-w-[300px]";
  return `
    <div class="avatar-frame ${sz} aspect-[3/4]">
      <span class="frame-label">ẢNH SẮP RA MẮT</span>
      <svg class="pose-svg" viewBox="0 0 100 140" preserveAspectRatio="xMidYMax meet"
           style="filter: drop-shadow(0 0 6px ${m.accent}55)">
        <g>${poseFor(m.role)}</g>
      </svg>
    </div>
  `;
}

/* ---- Tiêu đề nhỏ kiểu cổ ---- */
function sectionLabel(text) {
  return `<div class="sect-label">${text}</div>`;
}

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---- Cột Mốc — chấm tròn click mở modal ---- */
function milestonesHTML(milestones, memberIdx) {
  if (!milestones || !milestones.length) return "";
  const items = milestones.map((ms, i) => `
    <li class="ms-item">
      <button class="ms-dot js-ms-open" type="button"
              data-member="${memberIdx}" data-milestone="${i}"
              aria-label="${escAttr(ms.year + " — " + ms.event)}">
        <span class="ms-dot__inner"></span>
        <span class="ms-tooltip" role="tooltip">
          <span class="ms-tooltip__year">${ms.year}</span>
          <span class="ms-tooltip__event">${ms.event}</span>
          <span class="ms-tooltip__hint">Nhấn để xem chi tiết</span>
        </span>
      </button>
      <div class="ms-year font-display">${ms.year}</div>
      <div class="ms-event">${ms.event}</div>
    </li>
  `).join("");
  return `
    <div class="ms-strip">
      <div class="ms-rail" aria-hidden="true"></div>
      <ol class="ms-list">${items}</ol>
    </div>
  `;
}

/* ---- Cover thủy mặc (dùng cho intro) ---- */
function coverSVG(sceneKey, title, accent) {
  const W = 480, H = 300;
  const ink = "rgba(28,26,23,";
  let scene = "";
  if (sceneKey === "scene:mountain") {
    scene = `
      <path d="M0 ${H} L 70 220 L 130 250 L 200 170 L 270 235 L 340 195 L 420 250 L ${W} 215 L ${W} ${H} Z"
            fill="${ink}0.32)"/>
      <path d="M0 ${H} L 90 250 L 160 270 L 240 230 L 320 265 L 410 245 L ${W} 270 L ${W} ${H} Z"
            fill="${ink}0.55)"/>
      <path d="M-20 110 q 60 -30 130 0 t 130 10 t 140 -10 t 150 5" stroke="${ink}0.18)" stroke-width="1.2" fill="none"/>
      <path d="M-20 145 q 80 -20 160 -5 t 180 0 t 180 -10" stroke="${ink}0.12)" stroke-width="1" fill="none"/>
    `;
  } else if (sceneKey === "scene:river") {
    scene = `
      <path d="M-20 200 Q 120 170 240 210 T ${W+20} 200" stroke="${ink}0.45)" stroke-width="2" fill="none"/>
      <path d="M-20 230 Q 140 200 260 240 T ${W+20} 230" stroke="${ink}0.28)" stroke-width="1.4" fill="none"/>
      <path d="M-20 258 Q 130 230 250 268 T ${W+20} 258" stroke="${ink}0.18)" stroke-width="1.1" fill="none"/>
      <path d="M40 200 L 40 158 M 44 200 L 44 168 M 48 200 L 48 162" stroke="${ink}0.55)" stroke-width="1.6" fill="none"/>
      <path d="M${W-80} 200 L ${W-80} 162 M ${W-76} 200 L ${W-76} 170 M ${W-72} 200 L ${W-72} 158"
            stroke="${ink}0.5)" stroke-width="1.6" fill="none"/>
      <path d="M120 ${H} l -6 -20 l 12 0 z" fill="${ink}0.48)"/>
    `;
  } else if (sceneKey === "scene:bamboo") {
    scene = `
      <g stroke="${ink}0.55)" stroke-width="2.4" fill="none" stroke-linecap="round">
        <path d="M70 ${H} L 80 30"/>
        <path d="M70 80 L 80 80 M 70 140 L 80 140 M 70 200 L 80 200 M 70 250 L 80 250"/>
        <path d="M82 60 Q 130 50 165 30" />
        <path d="M82 130 Q 140 120 180 100" />
        <path d="M82 195 Q 130 185 165 165" />
      </g>
      <g stroke="${ink}0.32)" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M380 ${H} L 390 60"/>
        <path d="M380 110 L 390 110 M 380 170 L 390 170 M 380 230 L 390 230"/>
        <path d="M388 90 Q 350 80 320 65" />
        <path d="M388 160 Q 340 150 305 130" />
      </g>
      <path d="M0 ${H-30} Q ${W/2} ${H-50} ${W} ${H-30}" stroke="${ink}0.15)" stroke-width="1" fill="none"/>
    `;
  } else {
    scene = `<rect width="${W}" height="${H}" fill="${ink}0.08)"/>`;
  }
  return `
    <svg class="prod-cover-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="#0a0a0a"/>
          <stop offset="100%" stop-color="#050505"/>
        </linearGradient>
        <radialGradient id="mistGrad" cx="50%" cy="35%" r="60%">
          <stop offset="0%"  stop-color="rgba(255,255,255,0.55)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#paperGrad)"/>
      ${scene}
      <rect width="${W}" height="${H}" fill="url(#mistGrad)"/>
      <rect x="${W-44}" y="${H-44}" width="28" height="28" rx="2"
            fill="${accent || "#C8AA6E"}" opacity="0.92"/>
      <text x="${W-30}" y="${H-25}" text-anchor="middle"
            font-family="'Oswald', sans-serif" font-weight="700"
            font-size="14" fill="#ffffff">印</text>
    </svg>
  `;
}

/* ---- Cột Công Cụ — overlay dọc (Artist) ---- */
function toolsRailHTML(skills) {
  if (!skills || !skills.length) return "";
  return `
    <aside class="v2-tools-rail" aria-label="Công cụ thường dùng">
      ${skills.map(skillTagHTML).join("")}
    </aside>
  `;
}

/* =========================================================
   POLISH HELPERS — chất giấy & mực (dùng chung 5 layout)
========================================================= */

/* Mảng mực loang nền — div + radial gradient, blur cho mềm */
function inkBloom(cls, style) {
  return `<span class="ink-bloom ${cls || ""}" aria-hidden="true" style="${style || ""}"></span>`;
}

/* Nét doodle scribble NGANG — wavy underline neon */
function brushStrokeH(opts) {
  const w = (opts && opts.width)  || 220;
  const h = (opts && opts.height) || 18;
  const color = (opts && opts.color) || "var(--seal)";
  const op = (opts && opts.opacity) != null ? opts.opacity : 0.7;
  const cls = (opts && opts.cls) || "";
  return `
    <svg class="brush-stroke brush-stroke-h ${cls}"
         viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" style="filter:url(#neonGlowSoft)">
      <!-- wavy doodle scribble -->
      <path d="M 2 ${h*0.5} Q ${w*0.15} ${h*0.2}, ${w*0.3} ${h*0.5} T ${w*0.6} ${h*0.5} T ${w*0.9} ${h*0.5}"
            stroke="${color}" stroke-width="2"
            fill="none" stroke-linecap="round"
            opacity="${op}"/>
    </svg>
  `;
}

/* Nét doodle scribble DỌC */
function brushStrokeV(opts) {
  const w = (opts && opts.width)  || 14;
  const h = (opts && opts.height) || 140;
  const color = (opts && opts.color) || "var(--seal)";
  const op = (opts && opts.opacity) != null ? opts.opacity : 0.7;
  const cls = (opts && opts.cls) || "";
  return `
    <svg class="brush-stroke brush-stroke-v ${cls}"
         viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" style="filter:url(#neonGlowSoft)">
      <!-- zigzag doodle vertical -->
      <path d="M ${w*0.5} 2 L ${w*0.3} ${h*0.2} L ${w*0.7} ${h*0.35} L ${w*0.3} ${h*0.5} L ${w*0.7} ${h*0.65} L ${w*0.3} ${h*0.8} L ${w*0.5} ${h-3}"
            stroke="${color}" stroke-width="1.5"
            fill="none" stroke-linecap="round"
            opacity="${op}"/>
    </svg>
  `;
}

/* Khung cuộn tranh treo — bọc 1 khối nội dung */
function scrollFrame(inner, opts) {
  const tone = (opts && opts.tone) || "warm";
  return `
    <div class="scroll-frame scroll-frame--${tone}">
      <span class="scroll-frame__rod scroll-frame__rod--top" aria-hidden="true"></span>
      <span class="scroll-frame__tassel scroll-frame__tassel--l" aria-hidden="true"></span>
      <span class="scroll-frame__tassel scroll-frame__tassel--r" aria-hidden="true"></span>
      <div class="scroll-frame__paper">
        ${inner}
      </div>
      <span class="scroll-frame__rod scroll-frame__rod--bot" aria-hidden="true"></span>
      <span class="scroll-frame__seal" aria-hidden="true">印</span>
    </div>
  `;
}

/* =========================================================
   LAYOUT — 5 BIẾN THỂ MANIFESTO POSTER
   Tất cả đều typography-first: avatar 1/3 + tuyên ngôn lớn.
   Phân biệt nhau ở framing / layering / hướng chữ / màu.
========================================================= */

/* ---- helper: chia 1 từ ra để in-block riêng (cho hiệu ứng) ---- */
function splitWords(s) {
  return String(s).split(/\s+/).filter(Boolean);
}

/* =========================================================
   1 · TUYÊN NGÔN (Phạm Hùng Thiên) — manifesto
   Avatar trái 1/3. Phải 2/3: 2 stanza serif khổng lồ I/II,
   eyebrow nhỏ phía trên mỗi stanza, body 1 câu mảnh phía dưới.
========================================================= */
function layoutManifesto(m, i) {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">
      ${String(i + 1).padStart(2, "0")}
    </div>

    <div class="layout-manifesto w-full h-full max-w-[1400px] mx-auto px-10 md:px-14 lg:px-20 flex items-center">
      <div class="mf-grid">

        <aside class="mf-portrait reveal d1">
          ${avatarHTML(m, "w-full")}
        </aside>

        <div class="mf-deck">
          <section class="mf-stanza mf-stanza--passion reveal d2" style="--accent:${m.accent}">
            ${inkBloom("ink-bloom--mf", "left:-2%;top:-30%;width:280px;height:280px;")}
            <div class="mf-stanza__eyebrow">
              <span class="mf-num font-display">01</span>
              <span class="mf-tag">Niềm Đam Mê</span>
            </div>
            <h2 class="mf-stanza__head font-display">${m.passion.headline}</h2>
            ${brushStrokeH({ width: 320, height: 14, opacity: 0.55, cls: "mf-stanza__brush" })}
            <p class="mf-stanza__body">${m.passion.body}</p>
          </section>

          <div class="mf-divider" aria-hidden="true">
            ${brushStrokeH({ width: 320, height: 12, opacity: 0.42 })}
          </div>

          <section class="mf-stanza mf-stanza--journey reveal d4" style="--accent:${m.accent}">
            ${inkBloom("ink-bloom--mf", "right:-2%;top:-22%;width:260px;height:260px;")}
            <div class="mf-stanza__eyebrow">
              <span class="mf-num font-display">02</span>
              <span class="mf-tag">Hành Trình</span>
            </div>
            <h2 class="mf-stanza__head font-display">${m.journey.headline}</h2>
            ${brushStrokeH({ width: 320, height: 14, opacity: 0.55, cls: "mf-stanza__brush" })}
            <p class="mf-stanza__body">${m.journey.body}</p>
          </section>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   2 · CHỒNG LỚP (Đoàn Gia Bảo) — overprint / risograph
   Avatar phải 1/3. Trái 2/3: 2 cụm chữ chồng lớp với thanh
   ngang màu accent xuyên qua. Headline dạng outline + fill.
========================================================= */
function layoutOverprint(m, i) {
  const pWords = splitWords(m.passion.headline);
  const jWords = splitWords(m.journey.headline);
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">
      ${String(i + 1).padStart(2, "0")}
    </div>

    <div class="layout-overprint w-full h-full max-w-[1400px] mx-auto px-10 md:px-14 lg:px-20 flex items-center">
      <div class="op-grid">

        <div class="op-deck">
          <section class="op-block op-block--passion reveal d2" style="--accent:${m.accent}">
            ${inkBloom("ink-bloom--op", "left:-4%;top:10%;width:260px;height:200px;")}
            <span class="op-brush op-brush--left" aria-hidden="true">
              ${brushStrokeV({ width: 18, height: 160, opacity: 0.55 })}
            </span>
            <span class="op-tag">I · ĐAM MÊ</span>
            <h2 class="op-head font-display">
              ${pWords.map((w, k) =>
                `<span class="op-word ${k === 1 ? "is-outline" : ""}">${w}</span>`
              ).join("")}
            </h2>
            <p class="op-body">${m.passion.body}</p>
          </section>

          <section class="op-block op-block--journey reveal d4" style="--accent:${m.accent}">
            ${inkBloom("ink-bloom--op", "right:-4%;top:0;width:240px;height:200px;")}
            <span class="op-brush op-brush--left op-brush--accent" aria-hidden="true">
              ${brushStrokeV({ width: 18, height: 140, color: m.accent, opacity: 0.5 })}
            </span>
            <span class="op-tag">II · HÀNH TRÌNH</span>
            <h2 class="op-head font-display">
              ${jWords.map((w, k) =>
                `<span class="op-word ${k === 0 ? "is-outline" : ""}">${w}</span>`
              ).join("")}
            </h2>
            <p class="op-body">${m.journey.body}</p>
          </section>
        </div>

        <aside class="op-portrait reveal d1">
          ${avatarHTML(m, "w-full")}
        </aside>
      </div>
    </div>
  `;
}

/* =========================================================
   3 · CỘT CHỮ (Vũ Đình Khoa) — vertical Hán type
   Avatar giữa 1/3. Hai bên là 2 cuộn chữ DỌC: trái = passion
   (Hán "情"), phải = journey (Hán "途"). Headline ngang ở dưới.
========================================================= */
function layoutVertical(m, i) {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">
      ${String(i + 1).padStart(2, "0")}
    </div>

    <div class="layout-vertical w-full h-full max-w-[1320px] mx-auto px-8 md:px-12 lg:px-16 flex items-center">
      <div class="vt-grid">

        <div class="vt-col-wrap reveal d3">
          ${scrollFrame(`
            <section class="vt-col vt-col--left" style="--accent:${m.accent}">
              ${inkBloom("ink-bloom--vt", "right:6%;top:6%;width:200px;height:200px;")}
              <div class="vt-han font-display" aria-hidden="true">情</div>
              <div class="vt-tag">ĐAM MÊ</div>
              <h3 class="vt-head font-display">${m.passion.headline}</h3>
              ${brushStrokeH({ width: 220, height: 12, opacity: 0.5, cls: "vt-brush" })}
              <p class="vt-body">${m.passion.body}</p>
            </section>
          `, { tone: "warm" })}
        </div>

        <div class="vt-center reveal d2">
          <div class="vt-center__halo" aria-hidden="true"></div>
          ${avatarHTML(m, "w-full")}
        </div>

        <div class="vt-col-wrap reveal d4">
          ${scrollFrame(`
            <section class="vt-col vt-col--right" style="--accent:${m.accent}">
              ${inkBloom("ink-bloom--vt", "left:6%;bottom:6%;width:200px;height:200px;")}
              <div class="vt-han font-display" aria-hidden="true">途</div>
              <div class="vt-tag">HÀNH TRÌNH</div>
              <h3 class="vt-head font-display">${m.journey.headline}</h3>
              ${brushStrokeH({ width: 220, height: 12, opacity: 0.5, cls: "vt-brush" })}
              <p class="vt-body">${m.journey.body}</p>
            </section>
          `, { tone: "cool" })}
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   4 · KHUNG CỬA TRÒN (Nguyễn Trần Thanh Hằng) — moon gate
   Avatar nằm trong 1 khung tròn lớn (vòng mực đôi). 2 bên là
   câu đối: passion (trái, align phải), journey (phải, align trái).
   Triện ở 2 góc ngoài dưới. Bố cục 3-cột cân đối tuyệt đối.
========================================================= */

/* [DEPRECATED] foldingFanSVG — giữ để tham khảo, không còn dispatch */
function foldingFanSVG(accent) {
  const cx = 50, cy = 94, r = 78;
  const RIBS = 9;
  const A1 = -78, A2 = 78;            // độ, từ đứng-lên-trái → đứng-lên-phải
  const toRad = d => d * Math.PI / 180;
  const X = a => cx + r * Math.sin(toRad(a));
  const Y = a => cy - r * Math.cos(toRad(a));

  // Các nan quạt (đường mực mảnh) — vẽ cong nhẹ để đỡ cứng
  let ribs = "";
  for (let k = 0; k < RIBS; k++) {
    const a = A1 + (k * (A2 - A1) / (RIBS - 1));
    const ax = X(a), ay = Y(a);
    const mid = r * 0.55;
    const mx = cx + mid * Math.sin(toRad(a)) + Math.sin(k * 1.3) * 0.6;
    const my = cy - mid * Math.cos(toRad(a));
    ribs += `<path d="M ${cx} ${cy} Q ${mx.toFixed(2)} ${my.toFixed(2)} ${ax.toFixed(2)} ${ay.toFixed(2)}"
      stroke="rgba(28,26,23,0.45)" stroke-width="0.32" fill="none" stroke-linecap="round"/>`;
  }

  // Viền cung ngoài + 2 đường gấp phụ
  const arcAt = (rr) => {
    const x1 = cx + rr * Math.sin(toRad(A1)), y1 = cy - rr * Math.cos(toRad(A1));
    const x2 = cx + rr * Math.sin(toRad(A2)), y2 = cy - rr * Math.cos(toRad(A2));
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${rr} ${rr} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };
  const outer = `<path d="${arcAt(r)}" stroke="rgba(28,26,23,0.55)" stroke-width="0.45" fill="none"/>`;
  const inner1 = `<path d="${arcAt(r * 0.72)}" stroke="rgba(28,26,23,0.22)" stroke-width="0.3" stroke-dasharray="0.7 1.6" fill="none"/>`;
  const inner2 = `<path d="${arcAt(r * 0.45)}" stroke="rgba(28,26,23,0.18)" stroke-width="0.3" stroke-dasharray="0.5 1.2" fill="none"/>`;

  // Mặt quạt — wash màu accent rất nhạt
  const fanFill = `M ${cx} ${cy} L ${X(A1).toFixed(2)} ${Y(A1).toFixed(2)}
                   A ${r} ${r} 0 0 1 ${X(A2).toFixed(2)} ${Y(A2).toFixed(2)} Z`;

  // Cán quạt — 2 cánh ngoài cùng dày hơn (gỗ)
  const handleL = `<path d="M ${cx} ${cy} L ${X(A1 - 2).toFixed(2)} ${Y(A1 - 2).toFixed(2)}"
                     stroke="#2a1c10" stroke-width="0.9" stroke-linecap="round" fill="none" opacity="0.85"/>`;
  const handleR = `<path d="M ${cx} ${cy} L ${X(A2 + 2).toFixed(2)} ${Y(A2 + 2).toFixed(2)}"
                     stroke="#2a1c10" stroke-width="0.9" stroke-linecap="round" fill="none" opacity="0.85"/>`;

  return `
    <svg class="fn-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <radialGradient id="fanWash-${accent.replace("#","")}" cx="50%" cy="94%" r="86%">
          <stop offset="0%"  stop-color="${accent}" stop-opacity="0.10"/>
          <stop offset="55%" stop-color="${accent}" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <path d="${fanFill}" fill="url(#fanWash-${accent.replace("#","")})"/>
      ${outer}
      ${inner1}
      ${inner2}
      ${ribs}
      ${handleL}
      ${handleR}
      <!-- pivot đinh: 1 vòng đậm + 1 chấm sáng -->
      <circle cx="${cx}" cy="${cy}" r="2" fill="#A01530" opacity="0.95"/>
      <circle cx="${cx}" cy="${cy}" r="0.9" fill="#ffffff"/>
    </svg>
  `;
}

/* SVG quầng mực — nhiều vòng đồng tâm fade dần + wash accent rất nhạt */
function inkHaloSVG(accent) {
  const id = "haloAcc-" + accent.replace("#", "");
  return `
    <svg class="hl-halo" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <filter id="haloBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8"/>
        </filter>
        <radialGradient id="${id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="${accent}" stop-opacity="0.10"/>
          <stop offset="60%"  stop-color="${accent}" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="95"  fill="url(#${id})"/>
      <circle cx="100" cy="100" r="90"  stroke="rgba(28,26,23,0.05)" stroke-width="16" fill="none" filter="url(#haloBlur)"/>
      <circle cx="100" cy="100" r="72"  stroke="rgba(28,26,23,0.10)" stroke-width="11" fill="none" filter="url(#haloBlur)"/>
      <circle cx="100" cy="100" r="55"  stroke="rgba(28,26,23,0.18)" stroke-width="6"  fill="none" filter="url(#haloBlur)"/>
      <circle cx="100" cy="100" r="44"  stroke="rgba(28,26,23,0.32)" stroke-width="0.6" fill="none"/>
    </svg>
  `;
}

function layoutHalo(m, i) {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">
      ${String(i + 1).padStart(2, "0")}
    </div>

    <div class="layout-halo w-full h-full max-w-[1400px] mx-auto px-10 md:px-14 lg:px-20 relative flex items-center">
      ${toolsRailHTML(m.skills)}

      <div class="hl-stage">
        ${inkHaloSVG(m.accent)}

        <!-- AVATAR TÂM -->
        <div class="hl-avatar reveal d2">
          ${avatarHTML(m, "w-full")}
        </div>

        <!-- PASSION — góc trên-trái -->
        <section class="hl-text hl-text--passion reveal d3" style="--accent:${m.accent}">
          <header class="hl-text__meta">
            <span class="hl-text__no font-display">壹</span>
            <span class="hl-text__tag">Niềm Đam Mê</span>
          </header>
          <h3 class="hl-text__head font-display">${m.passion.headline}</h3>
          ${brushStrokeH({ width: 200, height: 12, opacity: 0.55 })}
          <p class="hl-text__body">${m.passion.body}</p>
        </section>

        <!-- JOURNEY — góc dưới-phải -->
        <section class="hl-text hl-text--journey reveal d4" style="--accent:${m.accent}">
          <header class="hl-text__meta">
            <span class="hl-text__no font-display">貳</span>
            <span class="hl-text__tag">Hành Trình</span>
          </header>
          <h3 class="hl-text__head font-display">${m.journey.headline}</h3>
          ${brushStrokeH({ width: 200, height: 12, opacity: 0.55 })}
          <p class="hl-text__body">${m.journey.body}</p>
        </section>
      </div>
    </div>
  `;
}

function layoutMoon(m, i) {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">
      ${String(i + 1).padStart(2, "0")}
    </div>

    <div class="layout-moon w-full h-full max-w-[1400px] mx-auto px-10 md:px-14 lg:px-20 relative flex items-center">
      ${toolsRailHTML(m.skills)}

      <div class="mn-grid">

        <!-- CỘT TRÁI: CÂU ĐỐI PASSION -->
        <section class="mn-couplet mn-couplet--left reveal d3" style="--accent:${m.accent}">
          <header class="mn-couplet__meta">
            <span class="mn-couplet__no font-display">壹</span>
            <span class="mn-couplet__tag">Niềm Đam Mê</span>
          </header>
          <h3 class="mn-couplet__head font-display">${m.passion.headline}</h3>
          ${brushStrokeH({ width: 200, height: 12, opacity: 0.55 })}
          <p class="mn-couplet__body">${m.passion.body}</p>
          <span class="mn-couplet__seal" aria-hidden="true">印</span>
        </section>

        <!-- KHUNG CỬA TRÒN + AVATAR -->
        <div class="mn-gate reveal d2">
          ${inkBloom("ink-bloom--mn", "inset:-12% -10%;width:auto;height:auto;")}
          <span class="mn-gate__ring mn-gate__ring--outer" aria-hidden="true"></span>
          <span class="mn-gate__ring mn-gate__ring--inner" aria-hidden="true"></span>
          <!-- 4 đinh nhỏ ở 4 hướng (N E S W) — chi tiết kiến trúc -->
          <span class="mn-gate__stud mn-gate__stud--n" aria-hidden="true"></span>
          <span class="mn-gate__stud mn-gate__stud--e" aria-hidden="true"></span>
          <span class="mn-gate__stud mn-gate__stud--s" aria-hidden="true"></span>
          <span class="mn-gate__stud mn-gate__stud--w" aria-hidden="true"></span>
          <div class="mn-gate__avatar">
            ${avatarHTML(m, "w-full")}
          </div>
        </div>

        <!-- CỘT PHẢI: CÂU ĐỐI JOURNEY -->
        <section class="mn-couplet mn-couplet--right reveal d4" style="--accent:${m.accent}">
          <header class="mn-couplet__meta">
            <span class="mn-couplet__no font-display">貳</span>
            <span class="mn-couplet__tag">Hành Trình</span>
          </header>
          <h3 class="mn-couplet__head font-display">${m.journey.headline}</h3>
          ${brushStrokeH({ width: 200, height: 12, opacity: 0.55 })}
          <p class="mn-couplet__body">${m.journey.body}</p>
          <span class="mn-couplet__seal" aria-hidden="true">印</span>
        </section>
      </div>
    </div>
  `;
}

/* =========================================================
   5 · CUỐN TẬP (Lê Trúc Giang) — open folio art book
   Cuốn tập nghệ thuật mở: trang trái = avatar dán với
   4 corner mount, trang phải = passion + journey với nét
   bút. Gáy giữa. Mép trang loang nhẹ. Triện một góc.
========================================================= */
function layoutFolio(m, i) {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">
      ${String(i + 1).padStart(2, "0")}
    </div>

    <div class="layout-folio w-full h-full max-w-[1400px] mx-auto px-10 md:px-14 lg:px-20 relative flex items-center">
      ${toolsRailHTML(m.skills)}

      <article class="fo-book reveal d2">
        <!-- Gáy giữa -->
        <span class="fo-spine" aria-hidden="true"></span>

        <!-- TRANG TRÁI: avatar mounted -->
        <div class="fo-page fo-page--left reveal d1">
          ${inkBloom("ink-bloom--fo", "left:8%;top:12%;width:220px;height:220px;")}
          <div class="fo-mount">
            <span class="fo-mount__corner fo-mount__corner--tl" aria-hidden="true"></span>
            <span class="fo-mount__corner fo-mount__corner--tr" aria-hidden="true"></span>
            <span class="fo-mount__corner fo-mount__corner--bl" aria-hidden="true"></span>
            <span class="fo-mount__corner fo-mount__corner--br" aria-hidden="true"></span>
            <div class="fo-mount__photo">
              ${avatarHTML(m, "w-full")}
            </div>
          </div>
          <div class="fo-caption">
            <span class="fo-caption__line" aria-hidden="true"></span>
            <span class="fo-caption__no font-display">No. ${String(i + 1).padStart(2, "0")}</span>
          </div>
        </div>

        <!-- TRANG PHẢI: 2 đoạn passion + journey -->
        <div class="fo-page fo-page--right">
          ${inkBloom("ink-bloom--fo", "right:6%;bottom:8%;width:200px;height:200px;")}

          <section class="fo-entry fo-entry--passion reveal d3" style="--accent:${m.accent}">
            <header class="fo-entry__head">
              <span class="fo-entry__no font-display">壹</span>
              <span class="fo-entry__tag">Niềm Đam Mê</span>
            </header>
            <h3 class="fo-entry__title font-display">${m.passion.headline}</h3>
            ${brushStrokeH({ width: 240, height: 12, opacity: 0.55 })}
            <p class="fo-entry__body">${m.passion.body}</p>
          </section>

          <section class="fo-entry fo-entry--journey reveal d4" style="--accent:${m.accent}">
            <header class="fo-entry__head">
              <span class="fo-entry__no font-display">貳</span>
              <span class="fo-entry__tag">Hành Trình</span>
            </header>
            <h3 class="fo-entry__title font-display">${m.journey.headline}</h3>
            ${brushStrokeH({ width: 240, height: 12, opacity: 0.55 })}
            <p class="fo-entry__body">${m.journey.body}</p>
          </section>

          <span class="fo-seal" aria-hidden="true">印</span>
        </div>
      </article>
    </div>
  `;
}

/* ---- Dispatch theo `layout` của member ---- */
const LAYOUTS = {
  manifesto: layoutManifesto,
  overprint: layoutOverprint,
  vertical:  layoutVertical,
  halo:      layoutHalo,
  folio:     layoutFolio,
};

function memberCardHTML(m, i) {
  const fn = LAYOUTS[m.layout] || layoutManifesto;
  return fn(m, i);
}

/* =========================================================
   INTRO SLIDE — trang mở đầu giới thiệu team (giữ nguyên)
========================================================= */
function introThumbHTML(scene, label, pos, rot) {
  return `
    <article class="intro-frame intro-frame--thumb intro-frame--${pos}" style="--rot:${rot}deg">
      <div class="intro-frame__media">
        ${coverSVG(scene, "", "#C8AA6E")}
      </div>
      <span class="prod-frame__corner tl"></span>
      <span class="prod-frame__corner tr"></span>
      <span class="prod-frame__corner bl"></span>
      <span class="prod-frame__corner br"></span>
      <div class="intro-frame__caption">${label}</div>
    </article>
  `;
}

function introCardHTML() {
  return `
    <div class="intro-card">
      <h1 class="intro-portfolio" aria-hidden="true">Portfolio</h1>

      <div class="intro-meta">
        <span class="intro-meta__seal">印</span>
        <span class="intro-meta__year font-display">2024</span>
        <span class="intro-meta__sep">·</span>
        <span class="intro-meta__brand">THIÊN DI STUDIO</span>
      </div>

      <div class="intro-frames">
        <article class="intro-frame intro-frame--video">
          <div class="intro-frame__media intro-frame__media--video">
            <div class="intro-video-bg"></div>
            <button type="button" class="intro-play" aria-label="Phát showreel">
              <svg viewBox="0 0 36 36" aria-hidden="true">
                <polygon points="13,9 28,18 13,27" fill="currentColor"/>
              </svg>
            </button>
            <div class="intro-frame__overlay">
              <div class="intro-frame__title font-display">Team Showreel</div>
              <div class="intro-frame__sub">Highlight 2024 · 02:18</div>
            </div>
          </div>
          <span class="prod-frame__corner tl"></span>
          <span class="prod-frame__corner tr"></span>
          <span class="prod-frame__corner bl"></span>
          <span class="prod-frame__corner br"></span>
          <div class="intro-frame__caption">SHOWREEL</div>
        </article>

        ${introThumbHTML("scene:mountain", "Sản Phẩm I", "p1", -4)}
        ${introThumbHTML("scene:bamboo",   "Team Off-site", "p2", 3)}
        ${introThumbHTML("scene:river",    "Sản Phẩm II", "p3", -2)}
        ${introThumbHTML("scene:bamboo",   "Sản Phẩm III", "p4", 4)}
        ${introThumbHTML("scene:mountain", "Sự Kiện 2023", "p5", 2)}
        ${introThumbHTML("scene:river",    "Sản Phẩm IV", "p6", -3)}
      </div>

      <canvas class="intro-particles" aria-hidden="true"></canvas>

      <p class="intro-tagline">
        Một <em class="tagline-em" style="--em-delay:0.3s">team sáng tạo</em> thuần Việt —
        nơi <em class="tagline-em" style="--em-delay:0.8s">nghệ thuật</em>
        gặp <em class="tagline-em" style="--em-delay:1.3s">công nghệ game</em>.
      </p>
    </div>
  `;
}

/* ---- Dựng track + nav dots ---- */
function renderMembers(stage, navDots, onDotClick) {
  const track = document.createElement("div");
  track.id = "cardTrack";

  // SLIDE 0 — INTRO
  const intro = document.createElement("article");
  intro.className = "member-card member-card--intro";
  intro.dataset.index = 0;
  intro.innerHTML = introCardHTML();
  track.appendChild(intro);

  const introDot = document.createElement("button");
  introDot.className = "nav-dot nav-dot--intro";
  introDot.dataset.name = "Mở Đầu";
  introDot.setAttribute("aria-label", "Trang mở đầu");
  introDot.addEventListener("click", () => onDotClick(0));
  navDots.appendChild(introDot);

  // SLIDE 1..N — thành viên (mỗi người 1 layout riêng)
  MEMBERS.forEach((m, i) => {
    const card = document.createElement("article");
    card.className = "member-card member-card--" + (m.layout || "letter");
    card.dataset.index = i + 1;
    card.innerHTML = memberCardHTML(m, i);
    track.appendChild(card);

    const dot = document.createElement("button");
    dot.className = "nav-dot";
    dot.dataset.name = m.name;
    dot.setAttribute("aria-label", "Xem " + m.name);
    dot.addEventListener("click", () => onDotClick(i + 1));
    navDots.appendChild(dot);
  });

  stage.appendChild(track);
}

/* ---- Dựng trống đồng lớn (nền toàn cục) ---- */
function renderDrum(container) {
  container.innerHTML = dongSonDrum();
}
