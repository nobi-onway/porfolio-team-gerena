/* =========================================================
   RENDER — 3 SLIDE: HOOK · STAGE SELECT · QUEST LOG
   Phụ thuộc: TEAM, PRODUCTS, PROCESS_STEPS, PROCESS_LOOP (data.js)
   Xuất ra:  SLIDE_META
             renderSlides(stage, navDots, onDotClick)
             renderDrum(container)
   Phong cách: ARCADE × ĐÔNG SƠN — flat, không glow.
   Animation xuất hiện: hệ class .fx + .fx-rise/.fx-wipe/.fx-pop/
   .fx-draw/.fx-track (delay qua --d), kích hoạt khi card .active.
========================================================= */

/* ---- Meta từng slide (header đọc để gõ tiêu đề) ---- */
const SLIDE_META = [
  { title: "Thiên Di Studio", sub: "TEAM PORTFOLIO" },
  { title: "Sản Phẩm",        sub: "STAGE SELECT" },
  { title: "Quy Trình",       sub: "QUEST LOG" },
];

/* =========================================================
   HỌA TIẾT ĐÔNG SƠN — vẽ flat bằng SVG (vàng đồng trên nền đen)
========================================================= */

/* Chim Lạc cách điệu (chỉ dùng trong tranh bìa SVG) */
const LAC_BIRD = `
  <path d="M -14 3 Q -8 0 -3 0 Q 1 -6 8 -8 L 5 -2
           Q 12 -4 18 -8 Q 16 -1 8 2 Q 1 4 -4 3 Q -9 7 -14 3 Z"/>
`;

/* Ngôi sao N cánh (tâm trống đồng) — trả về polygon points */
function starPoints(cx, cy, rOut, rIn, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1));
  }
  return pts.join(" ");
}

/* Dải hoa văn Đông Sơn ngang — răng cưa + vòng tròn chấm, dùng làm divider */
function dsBand(cls, style) {
  const W = 600, H = 26, cy = H / 2;
  let tri = "", dots = "";
  for (let x = 10; x < W - 10; x += 30) {
    tri += `<polygon points="${x},${cy - 9} ${x + 14},${cy - 9} ${x + 7},${cy - 2}"/>`;
    tri += `<polygon points="${x + 15},${cy + 9} ${x + 29},${cy + 9} ${x + 22},${cy + 2}"/>`;
  }
  for (let x = 25; x < W - 10; x += 60) {
    dots += `<circle cx="${x}" cy="${cy}" r="3.5" fill="none" stroke-width="1.2"/>
             <circle cx="${x}" cy="${cy}" r="0.9"/>`;
  }
  return `
    <svg class="dsband ${cls || ""}" ${style ? `style="${style}"` : ""}
         viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1="4" y1="${cy - 12}" x2="${W - 4}" y2="${cy - 12}" stroke-width="1"/>
      <line x1="4" y1="${cy + 12}" x2="${W - 4}" y2="${cy + 12}" stroke-width="1"/>
      <g class="dsband__tri">${tri}</g>
      <g class="dsband__dot">${dots}</g>
    </svg>
  `;
}

/* =========================================================
   TRỐNG ĐỒNG LỚN — mặt trống Đông Sơn flat (nền, tâm cạnh trái)
   Vành chim Lạc dùng ẢNH img/bird.jpg, lọc qua filter #birdGold
   (nền trắng → trong suốt, thân chim → vàng đồng).
========================================================= */
function dongSonDrum() {
  const C = 100;
  const pt = (r, a) =>
    (C + r * Math.cos(a)).toFixed(1) + "," + (C + r * Math.sin(a)).toFixed(1);

  /* Vành răng cưa (r 34→42, 24 răng so le) */
  let saw = "";
  const NT = 24;
  for (let i = 0; i < NT; i++) {
    const a1 = (2 * Math.PI * i) / NT;
    const a2 = (2 * Math.PI * (i + 1)) / NT;
    const am = (a1 + a2) / 2;
    saw += i % 2 === 0
      ? `<polygon points="${pt(34, a1)} ${pt(34, a2)} ${pt(42, am)}"/>`
      : `<polygon points="${pt(42, a1)} ${pt(42, a2)} ${pt(34, am)}"/>`;
  }

  /* Vành vòng-tròn-chấm (r 54, 16 vòng nhỏ) */
  let rings = "";
  for (let i = 0; i < 16; i++) {
    const a = (2 * Math.PI * i) / 16;
    const x = C + 54 * Math.cos(a), y = C + 54 * Math.sin(a);
    rings += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="none"/>
              <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0.8"/>`;
  }

  /* Vành chim Lạc — 6 ảnh bird.jpg xếp vòng (r ≈ 76).
     scale(1,-1) lật dọc lại cho đúng chiều (lưng chim hướng ra ngoài vành). */
  let birds = "";
  for (let i = 0; i < 6; i++) {
    birds += `
      <g transform="rotate(${i * 60} ${C} ${C}) translate(${C} 22.5) scale(1 -1)">
        <image href="img/bird.jpg" x="-21" y="-11.5" width="42" height="23"
               filter="url(#birdDrum)" opacity="0.85" preserveAspectRatio="xMidYMid meet"/>
      </g>`;
  }

  return `
    <svg class="dongson-drum" viewBox="0 0 200 200" aria-hidden="true">
      <g class="ds-gold">
        <polygon points="${starPoints(C, C, 26, 10, 12)}" class="ds-star"/>
        <g class="ds-saw">${saw}</g>
        <circle cx="${C}" cy="${C}" r="47" class="ds-ring"/>
        <g class="ds-dotring">${rings}</g>
        <circle cx="${C}" cy="${C}" r="64" class="ds-ring"/>
        <g class="ds-birds">${birds}</g>
        <circle cx="${C}" cy="${C}" r="89" class="ds-ring ds-ring--bold"/>
        <circle cx="${C}" cy="${C}" r="95" class="ds-ring"/>
      </g>
    </svg>
  `;
}

/* =========================================================
   TRANH KHẮC ĐỒNG — dùng cho bìa sản phẩm & showreel placeholder
========================================================= */

/* mặt-trời-trống-đồng: sao nhỏ + tia (cls để gắn animation) */
function drumSun(cx, cy, r, cls) {
  let rays = "";
  for (let i = 0; i < 12; i++) {
    const a = (2 * Math.PI * i) / 12;
    rays += `<line x1="${(cx + (r + 4) * Math.cos(a)).toFixed(1)}" y1="${(cy + (r + 4) * Math.sin(a)).toFixed(1)}"
                   x2="${(cx + (r + 13) * Math.cos(a)).toFixed(1)}" y2="${(cy + (r + 13) * Math.sin(a)).toFixed(1)}"/>`;
  }
  return `
    <g class="${cls || ""}" style="--ox:${cx}px;--oy:${cy}px">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"/>
      <polygon points="${starPoints(cx, cy, r * 0.62, r * 0.26, 8)}" class="cv-fill"/>
      ${rays}
    </g>
  `;
}

function svgBird(x, y, s, cls) {
  return `<g transform="translate(${x} ${y}) scale(${s})" class="cv-fill ${cls || ""}">${LAC_BIRD}</g>`;
}

function coverArt(kind, idx) {
  const W = 480, H = 300;

  let scan = "";
  for (let y = 14; y < H; y += 16) scan += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;

  let scene = "";
  if (kind === "mountain") {
    scene = `
      ${drumSun(96, 84, 30)}
      <path d="M0 252 L86 146 L148 216 L232 108 L318 228 L398 158 L480 244" fill="none" stroke-width="2.5"/>
      <path d="M0 282 L120 224 L242 268 L368 218 L480 272" fill="none" opacity="0.45"/>
      ${svgBird(330, 70, 1.1)}
      ${svgBird(386, 96, 0.8)}
    `;
  } else if (kind === "boat") {
    let rowers = "";
    for (let i = 0; i < 4; i++) {
      const x = 160 + i * 50;
      rowers += `
        <circle cx="${x}" cy="158" r="7" fill="none" stroke-width="2"/>
        <path d="M${x} 165 L${x} 184 M${x} 172 L${x + 16} 188 M${x} 184 L${x - 8} 198" fill="none" stroke-width="2"/>`;
    }
    let waves = "";
    for (let x = 16; x < W - 20; x += 44) {
      waves += `<path d="M${x} 248 q 11 -16 22 0 q 11 16 22 0" fill="none" opacity="0.5"/>`;
    }
    scene = `
      <path d="M96 200 Q 240 236 388 200" fill="none" stroke-width="3"/>
      <path d="M96 200 Q 84 184 92 168 q 10 6 6 20" fill="none" stroke-width="2.5"/>
      <path d="M388 200 Q 402 182 394 164 q -11 7 -5 22" fill="none" stroke-width="2.5"/>
      <path d="M128 206 L360 206" opacity="0.4"/>
      ${rowers}
      <g class="cv-waves">${waves}</g>
      ${svgBird(80, 80, 0.9)}
      ${drumSun(404, 70, 20)}
    `;
  } else {
    scene = `
      ${drumSun(240, 196, 34)}
      ${svgBird(110, 90, 1.5)}
      ${svgBird(220, 64, 1.1)}
      ${svgBird(330, 96, 1.4)}
      ${svgBird(70, 160, 0.9)}
      ${svgBird(396, 160, 0.9)}
      <path d="M60 252 L420 252" stroke-dasharray="3 9" opacity="0.4"/>
    `;
  }

  return `
    <svg class="prod-cover-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="${W}" height="${H}" fill="#000000"/>
      <g class="cv-scan">${scan}</g>
      <text x="${W - 14}" y="${H - 16}" text-anchor="end" class="cv-ghost"
            font-family="Oswald, sans-serif" font-weight="700" font-size="96">0${idx + 1}</text>
      <g class="cv-ink">${scene}</g>
    </svg>
  `;
}

/* Tranh khắc đồng ĐỘNG cho khung showreel (khi chưa có video):
   thuyền Đông Sơn lướt sóng + mặt trời xoay + chim bay */
function showreelArt() {
  const W = 480, H = 270;
  let scan = "";
  for (let y = 12; y < H; y += 14) scan += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  let rowers = "";
  for (let i = 0; i < 4; i++) {
    const x = 168 + i * 46;
    rowers += `
      <circle cx="${x}" cy="142" r="6.5" fill="none" stroke-width="2"/>
      <path d="M${x} 148 L${x} 166 M${x} 154 L${x + 15} 170 M${x} 166 L${x - 7} 179" fill="none" stroke-width="2"/>`;
  }
  let waves = "";
  for (let x = -64; x < W + 20; x += 44) {
    waves += `<path d="M${x} 224 q 11 -15 22 0 q 11 15 22 0" fill="none" opacity="0.5"/>`;
  }
  return `
    <svg class="sr-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="${W}" height="${H}" fill="#000000"/>
      <g class="cv-scan">${scan}</g>
      <g class="cv-ink">
        ${drumSun(398, 62, 24, "sr-sun")}
        <g class="sr-boat">
          <path d="M104 182 Q 240 214 376 182" fill="none" stroke-width="3"/>
          <path d="M104 182 Q 92 167 100 152 q 10 6 5 19" fill="none" stroke-width="2.5"/>
          <path d="M376 182 Q 390 165 382 148 q -11 7 -5 21" fill="none" stroke-width="2.5"/>
          <path d="M134 188 L348 188" opacity="0.4"/>
          ${rowers}
        </g>
        <g class="sr-waves">${waves}</g>
        ${svgBird(86, 64, 1.0, "sr-bird")}
        ${svgBird(150, 44, 0.7, "sr-bird sr-bird--2")}
      </g>
    </svg>
  `;
}

/* =========================================================
   ĐỘI NGŨ NGƯỜI QUE — hiện khi hover .ttl-video (CSS):
   1 chỉ đạo đứng nóc khung · 2 artist ngồi vẽ bên TRÁI
   · 2 dev ngồi code bên PHẢI.
========================================================= */
/* =========================================================
   SLIME SPRITE — pixel art. Lưới ký tự → <rect> 1×1 (đơn vị local),
   group ngoài dùng transform translate+scale để đặt vào từng SVG.
   Bảng màu tím: O viền · L sáng · M giữa · D tối · E mắt · W loé · K má · T miệng.
========================================================= */
const SLIME_PAL = {
  O: "#382a5e", L: "#c9b8f0", M: "#9b7ed8", D: "#6a4fa3",
  E: "#241a33", W: "#ffffff", K: "#f0a8c8", T: "#241a33",
};
const SLIME_GRID = [
  ".......OO.......",
  "......OLLO......",
  ".....OLLLLO.....",
  "....OLLLLLLO....",
  "...OLLLLLLLLO...",
  "..OLLLLLLMMMMO..",
  "..OLLLLMMMMMMO..",
  ".OLLMMMMMMMMMMO.",
  ".OMMWEMMMMWEMMO.",
  ".OMMEEMMMMEEMMO.",
  ".OMKMMMTTMMMKMO.",
  ".OMMMMMMMMMMMMO.",
  ".ODDDDDDDDDDDDO.",
  "..ODDDDDDDDDDO..",
  "...ODDDDDDDDO...",
  "....OOOOOOOO....",
];
/* Trả { body, eyes } — mắt tách group riêng để chớp mắt độc lập. */
function slimeSprite() {
  let body = "", eyes = "";
  SLIME_GRID.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = SLIME_PAL[ch];
      if (!fill) return;
      const rect = `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${fill}"/>`;
      if (ch === "E" || ch === "W") eyes += rect;
      else body += rect;
    });
  });
  return { body, eyes };
}

function crewFigs() {
  const s = slimeSprite();
  /* 1 · CHỈ ĐẠO — slime đứng nóc khung, cạnh lá cờ */
  const lead = `
    <svg class="ttl-crew__fig ttl-crew__fig--lead" viewBox="0 0 64 66" aria-hidden="true">
      <defs><linearGradient id="slimeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6b4ee"/><stop offset="0.5" stop-color="#9b7ed8"/><stop offset="1" stop-color="#5d4a9e"/></linearGradient></defs>
      <path class="hero-line" d="M50 48 L52 12"/>
      <polygon class="crew-fill-seal" points="52,12 64,16 52,22"/>
      <g class="blob-crew">
        <path class="blob-skin" d="M30 22 C20 22 12 30 11 41 C10 49 12 56 17 59 C21 61 25 61 30 59 C35 61 39 61 43 59 C48 56 50 49 49 41 C48 30 40 22 30 22 Z"/>
        <ellipse class="blob-skin blob-nub" cx="30" cy="20" rx="3" ry="2.6"/>
        <ellipse class="blob-gloss" cx="21" cy="40" rx="5" ry="7" transform="rotate(-18 21 40)"/>
        <g class="blob-eyes-c">
          <ellipse class="blob-eye" cx="25" cy="40" rx="3.4" ry="4.4"/>
          <ellipse class="blob-eye" cx="35" cy="40" rx="3.4" ry="4.4"/>
        </g>
        <path class="blob-face" d="M26 48 Q30 51 34 48"/>
      </g>
    </svg>`;

  /* 2-3 · ARTIST — blob bên trái khung, vẽ lên giá (cọ vẫy) */
  const draw = (mod) => `
    <svg class="ttl-crew__fig ttl-crew__fig--${mod}" viewBox="0 0 64 72" aria-hidden="true">
      <defs><linearGradient id="slimeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6b4ee"/><stop offset="0.5" stop-color="#9b7ed8"/><stop offset="1" stop-color="#5d4a9e"/></linearGradient></defs>
      <g class="hero-line">
        <path d="M46 22 L42 66 M54 34 L60 66 M44 60 L58 60"/>
        <rect x="40" y="16" width="18" height="22" rx="1"/>
      </g>
      <g class="blob-crew">
        <path class="blob-skin" d="M20 13 C12 13 6 21 5 31 C4 38 6 44 11 47 C14 49 17 49 20 47 C23 49 26 49 29 47 C34 44 36 38 35 31 C34 21 28 13 20 13 Z"/>
        <ellipse class="blob-skin blob-nub" cx="20" cy="11" rx="2.8" ry="2.4"/>
        <ellipse class="blob-gloss" cx="12" cy="29" rx="4.5" ry="6" transform="rotate(-18 12 29)"/>
        <g class="blob-eyes-c">
          <ellipse class="blob-eye" cx="16" cy="29" rx="3" ry="4"/>
          <ellipse class="blob-eye" cx="25" cy="29" rx="3" ry="4"/>
        </g>
        <path class="blob-face" d="M17 37 Q21 40 25 37"/>
      </g>
    </svg>`;

  /* 4-5 · DEV — blob bên phải khung, gõ laptop */
  const code = (mod) => `
    <svg class="ttl-crew__fig ttl-crew__fig--${mod}" viewBox="0 0 64 72" aria-hidden="true">
      <defs><linearGradient id="slimeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6b4ee"/><stop offset="0.5" stop-color="#9b7ed8"/><stop offset="1" stop-color="#5d4a9e"/></linearGradient></defs>
      <g class="hero-line">
        <rect class="crew-fill-gold" x="10" y="40" width="20" height="3" rx="1"/>
        <path d="M10 40 L6 24 L26 24"/>
      </g>
      <g class="blob-crew">
        <path class="blob-skin" d="M44 13 C36 13 30 21 29 31 C28 38 30 44 35 47 C38 49 41 49 44 47 C47 49 50 49 53 47 C58 44 60 38 59 31 C58 21 52 13 44 13 Z"/>
        <ellipse class="blob-skin blob-nub" cx="44" cy="11" rx="2.8" ry="2.4"/>
        <ellipse class="blob-gloss" cx="36" cy="29" rx="4.5" ry="6" transform="rotate(-18 36 29)"/>
        <g class="blob-eyes-c">
          <ellipse class="blob-eye" cx="40" cy="29" rx="3" ry="4"/>
          <ellipse class="blob-eye" cx="49" cy="29" rx="3" ry="4"/>
        </g>
        <path class="blob-face" d="M40 37 Q44 40 48 37"/>
      </g>
    </svg>`;

  return `<div class="ttl-crew" aria-hidden="true">
    ${lead}${draw("draw1")}${draw("draw2")}${code("code1")}${code("code2")}
  </div>`;
}

/* =========================================================
   SLIDE 0 — HOOK: "CHÚNG TÔI LÀ" + tagline + showreel
========================================================= */
function titleCardHTML() {
  const chars = [...TEAM.hook].map((ch, i) =>
    `<span class="ttl-hook__ch" style="--i:${i}">${ch === " " ? "&nbsp;" : ch}</span>`
  ).join("");

  /* [CẬP NHẬT] khi TEAM.showreelSrc có file → render <video>, ngược lại dùng tranh động */
  const media = TEAM.showreelSrc
    ? `<video class="ttl-video__player" src="${TEAM.showreelSrc}" autoplay muted loop playsinline></video>`
    : showreelArt();

  return `
    <div class="ttl">
      <!-- chim Lạc bay trang trí (ảnh thật, lọc vàng đồng) -->
      <img class="ttl-bird ttl-bird--1" src="img/bird.jpg" alt="" aria-hidden="true" draggable="false"/>
      <img class="ttl-bird ttl-bird--2" src="img/bird.jpg" alt="" aria-hidden="true" draggable="false"/>

      <h1 class="ttl-hook font-display" aria-label="${TEAM.hook}">${chars}</h1>

      <p class="ttl-tagline fx fx-rise" style="--d:0.95s">${TEAM.taglineHTML}</p>

      ${dsBand("ttl-band fx fx-draw", "--d:1.2s")}

      <div class="ttl-video fx fx-wipe" style="--d:1.35s">
        <div class="ttl-video__media">
          ${media}
          <button type="button" class="ttl-play" aria-label="Phát showreel">
            <svg viewBox="0 0 36 36" aria-hidden="true">
              <polygon points="13,9 28,18 13,27" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <span class="prod-frame__corner tl"></span>
        <span class="prod-frame__corner tr"></span>
        <span class="prod-frame__corner bl"></span>
        <span class="prod-frame__corner br"></span>
        <span class="prod-status ttl-video__badge font-display">SHOWREEL</span>
        ${crewFigs()}
      </div>

      <canvas class="intro-particles" aria-hidden="true"></canvas>
    </div>
  `;
}

/* =========================================================
   SLIDE 1 — STAGE SELECT (sản phẩm, pager chuyển stage)
========================================================= */
function productsCardHTML() {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">02</div>

    <div class="ps-wrap w-full max-w-[1100px] mx-auto px-8 md:px-12">
      <header class="ps-head">
        <div class="arc-label font-display fx fx-track" style="--d:0.1s">— STAGE SELECT —</div>
        <h2 class="ps-title font-display fx fx-rise" style="--d:0.28s">SẢN PHẨM CỦA TEAM</h2>
      </header>

      <div class="prod-stage fx fx-wipe" style="--d:0.5s" data-prod-current="0">
        <div class="prod-slides">
          ${PRODUCTS.map((p, i) => `
            <article class="prod-slide ${i === 0 ? "is-active" : ""}" aria-hidden="${i === 0 ? "false" : "true"}">
              <div class="prod-frame">
                ${coverArt(p.cover, i)}
                <span class="prod-frame__corner tl"></span>
                <span class="prod-frame__corner tr"></span>
                <span class="prod-frame__corner bl"></span>
                <span class="prod-frame__corner br"></span>
                <span class="prod-status font-display">${p.status}</span>
              </div>
              <div class="prod-info">
                <div class="prod-info__head">
                  <div class="prod-info__stage font-display">STAGE ${i + 1}</div>
                  <h3 class="prod-info__title font-display">${p.title}</h3>
                  <div class="prod-info__meta">
                    <span class="prod-info__role">${p.type}</span>
                    <span class="prod-info__sep">◆</span>
                    <span class="prod-info__year">${p.year}</span>
                  </div>
                </div>
                <p class="prod-info__contrib">${p.desc}</p>
                <div class="prod-info__tags">
                  ${p.tags.map(t => `<span class="prod-tag">${t}</span>`).join("")}
                </div>
                <div class="prod-info__metric">
                  <span class="prod-info__metric-seal">★</span>
                  <span>${p.metric}</span>
                </div>
              </div>
            </article>
          `).join("")}
        </div>

        <div class="prod-pager">
          <button class="prod-pager__arrow" type="button" data-prod-prev aria-label="Sản phẩm trước">‹</button>
          <div class="prod-pager__dots">
            ${PRODUCTS.map((p, i) => `
              <button class="prod-pager__dot ${i === 0 ? "is-active" : ""}" type="button"
                      data-prod-go="${i}" aria-label="${p.title}">
                <span class="prod-pager__num font-display">${i + 1}</span>
              </button>
            `).join("")}
          </div>
          <button class="prod-pager__arrow" type="button" data-prod-next aria-label="Sản phẩm sau">›</button>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   SLIDE 2 — QUEST LOG (quy trình + cách giải quyết vấn đề)
========================================================= */
function loopIcon(kind) {
  if (kind === "play") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="7,4 21,12 7,20" fill="currentColor"/></svg>`;
  }
  if (kind === "loop") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4">
      <path d="M4 12 a8 8 0 1 1 3 6.2"/><polygon points="3,14 9,17 3.5,20.5" fill="currentColor" stroke="none"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4">
    <path d="M6 21 V3"/><path d="M6 4 H19 L15.5 8.5 19 13 H6" fill="currentColor" stroke="none"/>
  </svg>`;
}

/* Blob theo TỪNG node: mỗi node 1 nhân vật giọt mực cố định góc top-right,
   pose khớp step (idea/doc/code/art/play/win). Node active → blob xuất hiện
   (CSS .qm-node.is-cur .qm-node-blob), node tắt → biến mất. Đạo cụ "môi
   trường" (bóng đèn/giá vẽ/màn hình/sao) đặt ngoài .blob để không bị bóp méo. */
const QUEST_POSES = ["idea", "doc", "code", "art", "play", "win"];

function questBlobEnv(pose) {
  switch (pose) {
    case "idea": return `
      <g class="hero-bulb">
        <circle class="crew-fill-gold" cx="40" cy="-14" r="6"/>
        <path class="hero-line" d="M37 -7 L43 -7"/>
        <path class="hero-ray hero-line" d="M40 -24 L40 -28 M28 -16 L24 -18 M52 -16 L56 -18"/>
      </g>`;
    case "art": return `
      <g class="hero-line">
        <path d="M70 14 L66 80 M82 30 L88 80 M68 72 L86 72"/>
        <rect x="62" y="8" width="22" height="28" rx="1"/>
      </g>`;
    case "play": return `
      <rect class="hero-screen hero-line" x="58" y="2" width="22" height="16" rx="1"/>
      <polygon class="crew-fill-gold hero-screen-blip" points="66,7 66,13 73,10"/>`;
    case "win": return `
      <polygon class="crew-fill-gold hero-star"
        points="40,-32 43.5,-23 53,-23 45.5,-17 48.5,-8 40,-13 31.5,-8 34.5,-17 27,-23 36.5,-23"/>`;
    default: return "";
  }
}

function questBlobArms(pose) {
  switch (pose) {
    case "doc": return `
      <rect class="hero-line" x="45" y="56" width="17" height="22" rx="1" style="fill:rgba(0,0,0,0.35)"/>
      <path class="hero-line" d="M48 62 L59 62 M48 67 L59 67 M48 72 L55 72" stroke-width="1.7" opacity="0.85"/>`;
    case "code": return `
      <path class="hero-line" d="M22 80 L52 80 L57 66 L27 66 Z"/>
      <rect class="hero-line" x="28" y="48" width="27" height="18" rx="1"/>
      <path class="hero-line" d="M32 53 L51 53 M32 58 L47 58" stroke-width="1.7" opacity="0.55"/>`;
    case "play": return `
      <g class="hero-pad">
        <rect class="hero-line" x="28" y="64" width="34" height="12" rx="6" style="fill:rgba(0,0,0,0.4)"/>
        <circle class="crew-fill-seal" cx="37" cy="70" r="1.9"/>
        <circle class="crew-fill-gold" cx="53" cy="70" r="1.9"/>
      </g>`;
    default: return "";
  }
}

function nodeBlobHTML(pose) {
  return `
    <div class="qm-node-blob hero--${pose}" aria-hidden="true">
      <svg class="qm-blob__svg" viewBox="0 -34 92 118">
        <defs><linearGradient id="slimeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6b4ee"/><stop offset="0.5" stop-color="#9b7ed8"/><stop offset="1" stop-color="#5d4a9e"/></linearGradient></defs>
        ${questBlobEnv(pose)}
        <g class="blob">
          <path class="blob-skin" d="M40 29 C22 29 12 42 12 56 C12 67 17 78 27 81 C31 83 36 82 40 79 C44 82 49 83 53 81 C63 78 68 67 68 56 C68 42 58 29 40 29 Z"/>
          <ellipse class="blob-skin blob-nub" cx="40" cy="26" rx="4.2" ry="3.4"/>
          <ellipse class="blob-gloss" cx="29" cy="47" rx="8" ry="11" transform="rotate(-18 29 47)"/>
          <ellipse class="blob-gloss" cx="51" cy="70" rx="3.5" ry="5" transform="rotate(-20 51 70)"/>
          <g class="blob-eyes">
            <ellipse class="blob-eye" cx="33" cy="50" rx="4.2" ry="5.4"/>
            <ellipse class="blob-eye" cx="47" cy="50" rx="4.2" ry="5.4"/>
          </g>
          <ellipse class="blob-mouth" cx="40" cy="62" rx="2.4" ry="3.2"/>
          <path class="blob-tongue" d="M38 63.2 Q40 66 42 63.2 Z"/>
          <circle class="blob-blush" cx="25" cy="58" r="3"/>
          <circle class="blob-blush" cx="55" cy="58" r="3"/>
          ${questBlobArms(pose)}
        </g>
      </svg>
    </div>`;
}

function processCardHTML() {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">03</div>

    <div class="qm-wrap w-full max-w-[1180px] mx-auto px-8 md:px-12">
      <header class="qm-head">
        <div class="arc-label font-display fx fx-track" style="--d:0.1s">— QUEST LOG —</div>
        <h2 class="qm-title font-display fx fx-rise" style="--d:0.28s">CÁCH CHÚNG TÔI LÀM GAME</h2>
      </header>

      <ol class="qm-path">
        ${PROCESS_STEPS.map((s, i) => `
          <li class="qm-node fx fx-pop" style="--d:${(0.45 + i * 0.13).toFixed(2)}s">
            ${nodeBlobHTML(QUEST_POSES[i] || "idea")}
            <span class="qm-node__num font-display">${s.num}</span>
            <div class="qm-node__body">
              <div class="qm-node__en font-display">${s.en}</div>
              <h3 class="qm-node__title font-display">${s.title}</h3>
              <p class="qm-node__desc">${s.desc}</p>
            </div>
            <span class="qm-node__link" aria-hidden="true">▸</span>
          </li>
        `).join("")}
      </ol>

      ${dsBand("qm-band fx fx-draw", "--d:1.3s")}

      <div class="qm-loop">
        <div class="qm-loop__label font-display fx fx-track" style="--d:1.45s">GIẢI QUYẾT VẤN ĐỀ</div>
        <div class="qm-loop__grid">
          ${PROCESS_LOOP.map((l, i) => `
            <div class="qm-rule fx fx-rise" style="--d:${(1.55 + i * 0.14).toFixed(2)}s">
              <span class="qm-rule__icon">${loopIcon(l.icon)}</span>
              <h4 class="qm-rule__title">${l.title}</h4>
              <p class="qm-rule__desc">${l.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   DỰNG TRACK + NAV DOTS
========================================================= */
function renderSlides(stage, navDots, onDotClick) {
  const track = document.createElement("div");
  track.id = "cardTrack";

  const slides = [
    { cls: "member-card--title",    html: titleCardHTML(),    dot: "Mở Đầu" },
    { cls: "member-card--products", html: productsCardHTML(), dot: "Sản Phẩm" },
    { cls: "member-card--process",  html: processCardHTML(),  dot: "Quy Trình" },
  ];

  slides.forEach((s, i) => {
    const card = document.createElement("article");
    card.className = "member-card " + s.cls;
    card.dataset.index = i;
    card.innerHTML = s.html;
    track.appendChild(card);

    const dot = document.createElement("button");
    dot.className = "nav-dot";
    dot.dataset.name = s.dot;
    dot.setAttribute("aria-label", "Tới " + s.dot);
    dot.addEventListener("click", () => onDotClick(i));
    navDots.appendChild(dot);
  });

  stage.appendChild(track);
}

/* ---- Dựng trống đồng lớn (nền toàn cục) ---- */
function renderDrum(container) {
  container.innerHTML = dongSonDrum();
}
