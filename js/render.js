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
function crewFigs() {
  /* 1 · CHỈ ĐẠO — đứng trên nóc khung, cầm cờ, tay chỉ xuống */
  const lead = `
    <svg class="ttl-crew__fig ttl-crew__fig--lead" viewBox="0 0 64 84" aria-hidden="true">
      <g class="crew-line">
        <circle cx="38" cy="13" r="7"/>
        <path d="M38 20 L38 48"/>
        <path d="M38 48 L28 68 L26 80"/>
        <path d="M38 48 L48 66 L50 80"/>
        <path d="M38 27 L52 20 L52 6"/>
        <polygon class="crew-fill-seal" points="52,6 64,10 52,15"/>
        <g class="crew-anim crew--point">
          <path d="M38 27 L18 38"/>
        </g>
      </g>
    </svg>`;

  /* 2-3 · ARTIST ngồi vẽ trước giá vẽ (mặt hướng PHẢI → đặt bên trái khung) */
  const draw = (mod) => `
    <svg class="ttl-crew__fig ttl-crew__fig--${mod}" viewBox="0 0 64 72" aria-hidden="true">
      <g class="crew-line">
        <circle cx="20" cy="12" r="7"/>
        <path d="M20 19 L20 42"/>
        <path d="M20 42 L34 46 L34 62"/>
        <path d="M20 42 L30 48 L30 64"/>
        <!-- giá vẽ + khung tranh -->
        <path d="M46 22 L42 64 M50 38 L56 64"/>
        <rect x="40" y="20" width="18" height="20" rx="1"/>
        <g class="crew-anim crew--draw">
          <path d="M20 26 L40 30"/>
          <rect class="crew-fill-seal" x="38" y="27" width="6" height="6" rx="1"/>
        </g>
      </g>
    </svg>`;

  /* 4-5 · DEV ngồi gõ laptop (mặt hướng TRÁI → đặt bên phải khung) */
  const code = (mod) => `
    <svg class="ttl-crew__fig ttl-crew__fig--${mod}" viewBox="0 0 64 72" aria-hidden="true">
      <g class="crew-line">
        <circle cx="44" cy="12" r="7"/>
        <path d="M44 19 L44 42"/>
        <path d="M44 42 L30 46 L30 62"/>
        <path d="M44 42 L34 48 L34 64"/>
        <!-- laptop: bàn phím + màn hình mở -->
        <rect class="crew-fill-gold" x="12" y="38" width="18" height="3" rx="1"/>
        <path d="M12 38 L8 24 L24 24"/>
        <g class="crew-anim crew--type">
          <path d="M44 26 L28 36"/>
          <path d="M44 29 L24 38"/>
        </g>
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

/* Người que đứng góc bottom-left trong khung quest. JS đổi pose theo step
   đang active (.hero--idea/doc/code/art/play/win) — mỗi pose lộ 1 bộ tay +
   đạo cụ riêng; khi chuyển step bật .is-running cho nhân vật chạy tại chỗ. */
function questHeroHTML() {
  return `
    <div class="qm-hero" aria-hidden="true">
      <svg class="qm-hero__svg" viewBox="0 -22 90 106">
        <g class="crew-line">
          <!-- chân (vung mạnh khi .is-running) -->
          <g class="hero-legs">
            <path class="hero-leg hero-leg--l" d="M36 50 L29 78"/>
            <path class="hero-leg hero-leg--r" d="M36 50 L43 78"/>
          </g>
          <!-- thân + đầu -->
          <path d="M36 22 L36 50"/>
          <circle cx="36" cy="14" r="7.5"/>

          <!-- CHẠY giữa các step: hai tay vung -->
          <g class="hero-act hero-act--run">
            <path class="hero-arm-run hero-arm-run--a" d="M36 28 L46 31 L44 23"/>
            <path class="hero-arm-run hero-arm-run--b" d="M36 28 L27 32 L29 24"/>
          </g>

          <!-- 01 · Ý TƯỞNG → brainstorm: tay lên đầu + bóng đèn loé -->
          <g class="hero-act hero-act--idea">
            <path d="M36 30 L29 42"/>
            <path d="M36 28 L46 26 L41 15"/>
            <g class="hero-bulb">
              <circle class="crew-fill-gold" cx="41" cy="-4" r="4.5"/>
              <path d="M39 1 L43 1"/>
              <path class="hero-ray" d="M41 -11 L41 -14 M33 -4 L30 -4 M49 -4 L52 -4"/>
            </g>
          </g>

          <!-- 02 · THIẾT KẾ → viết tài liệu: cầm bảng kẹp, tay viết -->
          <g class="hero-act hero-act--doc">
            <path d="M36 30 L29 42"/>
            <rect x="50" y="32" width="16" height="22" rx="1"/>
            <path d="M53 38 L63 38 M53 43 L63 43 M53 48 L59 48" stroke-width="2" opacity="0.8"/>
            <g class="hero-write">
              <path d="M36 28 L52 40"/>
              <rect class="crew-fill-seal" x="50" y="37" width="4.5" height="4.5" rx="0.6"/>
            </g>
          </g>

          <!-- 03 · PROTOTYPE → code: gõ laptop -->
          <g class="hero-act hero-act--code">
            <rect x="46" y="44" width="22" height="3" rx="1"/>
            <path d="M46 44 L49 26 L65 26 L68 44"/>
            <path d="M50 30 L62 30 M50 34 L60 34" stroke-width="2" opacity="0.55"/>
            <g class="hero-type">
              <path class="hero-type--a" d="M36 29 L48 45"/>
              <path class="hero-type--b" d="M36 31 L46 46"/>
            </g>
          </g>

          <!-- 04 · MỸ THUẬT → vẽ: giá vẽ + cọ -->
          <g class="hero-act hero-act--art">
            <path d="M56 24 L52 80 M66 38 L72 80 M54 72 L70 72"/>
            <rect x="50" y="20" width="20" height="26" rx="1"/>
            <path d="M36 30 L30 42"/>
            <g class="hero-brush">
              <path d="M36 28 L54 34"/>
              <rect class="crew-fill-seal" x="52" y="31" width="5" height="5" rx="0.6"/>
            </g>
          </g>

          <!-- 05 · PLAYTEST → chơi game: cầm tay cầm + màn hình nhấp nháy -->
          <g class="hero-act hero-act--play">
            <rect class="hero-screen" x="46" y="14" width="20" height="14" rx="1"/>
            <polygon class="crew-fill-gold hero-screen-blip" points="53,18 53,24 59,21"/>
            <path d="M36 30 L46 42"/>
            <path d="M36 31 L66 42"/>
            <g class="hero-pad">
              <rect x="44" y="38" width="24" height="10" rx="5"/>
              <circle class="crew-fill-seal" cx="50" cy="43" r="1.6"/>
              <circle class="crew-fill-gold" cx="62" cy="43" r="1.6"/>
            </g>
          </g>

          <!-- 06 · HOÀN THIỆN → success: giơ hai tay + sao loé -->
          <g class="hero-act hero-act--win">
            <path d="M36 28 L26 13"/>
            <path d="M36 28 L46 13"/>
            <polygon class="crew-fill-gold hero-star"
              points="36,-14 38.5,-7 46,-7 40,-2.5 42.3,4.5 36,0.2 29.7,4.5 32,-2.5 26,-7 33.5,-7"/>
          </g>
        </g>
      </svg>
    </div>`;
}

function processCardHTML() {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">03</div>

    ${questHeroHTML()}

    <div class="qm-wrap w-full max-w-[1180px] mx-auto px-8 md:px-12">
      <header class="qm-head">
        <div class="arc-label font-display fx fx-track" style="--d:0.1s">— QUEST LOG —</div>
        <h2 class="qm-title font-display fx fx-rise" style="--d:0.28s">CÁCH CHÚNG TÔI LÀM GAME</h2>
      </header>

      <ol class="qm-path">
        ${PROCESS_STEPS.map((s, i) => `
          <li class="qm-node fx fx-pop" style="--d:${(0.45 + i * 0.13).toFixed(2)}s">
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
