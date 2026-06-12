/* =========================================================
   RENDER — 3 SLIDE: TITLE SCREEN · STAGE SELECT · QUEST LOG
   Phụ thuộc: TEAM, MEMBERS, PRODUCTS, PROCESS_STEPS,
              PROCESS_LOOP, POSES (data.js)
   Xuất ra:  SLIDE_META
             renderSlides(stage, navDots, onDotClick)
             renderDrum(container)
   Phong cách: ARCADE × ĐÔNG SƠN — flat, không glow.
========================================================= */

/* ---- Meta từng slide (header đọc để gõ tiêu đề) ---- */
const SLIDE_META = [
  { title: "Thiên Di Studio", sub: "TEAM PORTFOLIO" },
  { title: "Sản Phẩm",        sub: "STAGE SELECT" },
  { title: "Quy Trình",       sub: "QUEST LOG" },
];

/* ---- Chọn pose theo role ---- */
function poseFor(role) {
  if (role === "Game Designer") return POSES.designer;
  if (role === "Game Artist") return POSES.artist;
  return POSES.developer;
}

/* =========================================================
   HỌA TIẾT ĐÔNG SƠN — vẽ flat bằng SVG (vàng đồng trên nền đen)
========================================================= */

/* Chim Lạc cách điệu — silhouette flat, vẽ quanh gốc (0,0), bay sang phải */
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
function dsBand(cls) {
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
    <svg class="dsband ${cls || ""}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1="4" y1="${cy - 12}" x2="${W - 4}" y2="${cy - 12}" stroke-width="1"/>
      <line x1="4" y1="${cy + 12}" x2="${W - 4}" y2="${cy + 12}" stroke-width="1"/>
      <g class="dsband__tri">${tri}</g>
      <g class="dsband__dot">${dots}</g>
    </svg>
  `;
}

/* =========================================================
   TRỐNG ĐỒNG LỚN — mặt trống Đông Sơn flat (nền, tâm cạnh trái)
   Các vành từ trong ra: sao 12 cánh → răng cưa → vòng tròn chấm
   → đàn chim Lạc → vành ngoài. JS xoay --drum-rot mỗi transition.
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

  /* Vành chim Lạc (r 76, 6 con bay ngược kim đồng hồ) */
  let birds = "";
  for (let i = 0; i < 6; i++) {
    const deg = i * 60;
    birds += `<g transform="rotate(${deg} ${C} ${C}) translate(${C} ${C - 76})">${LAC_BIRD}</g>`;
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
   TRANH BÌA SẢN PHẨM — khắc đồng flat trên nền đen
   3 cảnh: mountain (núi + mặt trống) · boat (thuyền Đông Sơn)
   · birds (đàn chim Lạc)
========================================================= */
function coverArt(kind, idx) {
  const W = 480, H = 300;

  /* scanline mờ — chất CRT */
  let scan = "";
  for (let y = 14; y < H; y += 16) scan += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;

  /* mặt-trời-trống-đồng: sao nhỏ + tia */
  function drumSun(cx, cy, r) {
    let rays = "";
    for (let i = 0; i < 12; i++) {
      const a = (2 * Math.PI * i) / 12;
      rays += `<line x1="${(cx + (r + 4) * Math.cos(a)).toFixed(1)}" y1="${(cy + (r + 4) * Math.sin(a)).toFixed(1)}"
                     x2="${(cx + (r + 13) * Math.cos(a)).toFixed(1)}" y2="${(cy + (r + 13) * Math.sin(a)).toFixed(1)}"/>`;
    }
    return `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"/>
      <polygon points="${starPoints(cx, cy, r * 0.62, r * 0.26, 8)}" class="cv-fill"/>
      ${rays}
    `;
  }

  function bird(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})" class="cv-fill">${LAC_BIRD}</g>`;
  }

  let scene = "";
  if (kind === "mountain") {
    scene = `
      ${drumSun(96, 84, 30)}
      <path d="M0 252 L86 146 L148 216 L232 108 L318 228 L398 158 L480 244" fill="none" stroke-width="2.5"/>
      <path d="M0 282 L120 224 L242 268 L368 218 L480 272" fill="none" opacity="0.45"/>
      ${bird(330, 70, 1.1)}
      ${bird(386, 96, 0.8)}
    `;
  } else if (kind === "boat") {
    /* thuyền Đông Sơn: thân cong, mũi-lái cuộn xoắn, 4 người chèo */
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
      ${waves}
      ${bird(80, 80, 0.9)}
      ${drumSun(404, 70, 20)}
    `;
  } else {
    /* birds — đàn chim Lạc bay theo nhịp */
    scene = `
      ${drumSun(240, 196, 34)}
      ${bird(110, 90, 1.5)}
      ${bird(220, 64, 1.1)}
      ${bird(330, 96, 1.4)}
      ${bird(70, 160, 0.9)}
      ${bird(396, 160, 0.9)}
      <path d="M60 252 L420 252" stroke-dasharray="3 9" opacity="0.4"/>
    `;
  }

  return `
    <svg class="prod-cover-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="${W}" height="${H}" fill="#000000"/>
      <g class="cv-scan">${scan}</g>
      <text x="${W - 14}" y="${H - 16}" text-anchor="end" class="cv-ghost font-arcade"
            font-family="VT323, monospace" font-size="110">0${idx + 1}</text>
      <g class="cv-ink">${scene}</g>
    </svg>
  `;
}

/* =========================================================
   SLIDE 0 — TITLE SCREEN (giới thiệu team + đội hình)
========================================================= */
function titleCardHTML() {
  return `
    <div class="ttl">
      <header class="ttl-logo reveal d1">
        <svg class="ttl-star" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="29" fill="none" stroke="#C8AA6E" stroke-width="2"/>
          <circle cx="32" cy="32" r="23" fill="none" stroke="#C8AA6E" stroke-width="1" opacity="0.5"/>
          <polygon points="${starPoints(32, 32, 17, 7, 12)}" fill="#C8AA6E"/>
        </svg>
        <h1 class="ttl-name font-display">${TEAM.name}<span class="ttl-name__sub">${TEAM.sub}</span></h1>
      </header>

      <p class="ttl-tagline reveal d2">${TEAM.taglineHTML}</p>
      <p class="ttl-intro reveal d3">${TEAM.intro}</p>

      ${dsBand("ttl-band reveal d3")}

      <div class="ttl-roster reveal d4" role="list" aria-label="Đội hình">
        ${MEMBERS.map((m, i) => `
          <div class="ttl-player" role="listitem" style="--accent:${m.accent}">
            <span class="ttl-player__tag font-arcade">${i + 1}P</span>
            <span class="ttl-player__pose" aria-hidden="true">
              <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMax meet">${poseFor(m.role)}</svg>
            </span>
            <span class="ttl-player__name">${m.name}</span>
            <span class="ttl-player__role font-arcade">${m.roleVi}</span>
          </div>
        `).join("")}
      </div>

      <div class="ttl-start font-arcade reveal d5">
        <span class="ttl-blink" aria-hidden="true">▶</span>
        CUỘN ĐỂ BẮT ĐẦU
        <span class="ttl-blink" aria-hidden="true">◀</span>
      </div>
      <div class="ttl-credit font-arcade reveal d6">CREDIT 01 · © ${TEAM.year} ${TEAM.name} ${TEAM.sub}</div>

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
      <header class="ps-head reveal d1">
        <div class="arc-label font-arcade">— STAGE SELECT —</div>
        <h2 class="ps-title font-display">SẢN PHẨM CỦA TEAM</h2>
      </header>

      <div class="prod-stage reveal d2" data-prod-current="0">
        <div class="prod-slides">
          ${PRODUCTS.map((p, i) => `
            <article class="prod-slide ${i === 0 ? "is-active" : ""}" aria-hidden="${i === 0 ? "false" : "true"}">
              <div class="prod-frame">
                ${coverArt(p.cover, i)}
                <span class="prod-frame__corner tl"></span>
                <span class="prod-frame__corner tr"></span>
                <span class="prod-frame__corner bl"></span>
                <span class="prod-frame__corner br"></span>
                <span class="prod-status font-arcade">${p.status}</span>
              </div>
              <div class="prod-info">
                <div class="prod-info__head">
                  <div class="prod-info__stage font-arcade">STAGE ${i + 1}</div>
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
                <span class="prod-pager__num font-arcade">${i + 1}</span>
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

function processCardHTML() {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">03</div>

    <div class="qm-wrap w-full max-w-[1180px] mx-auto px-8 md:px-12">
      <header class="qm-head reveal d1">
        <div class="arc-label font-arcade">— QUEST LOG —</div>
        <h2 class="qm-title font-display">CÁCH CHÚNG TÔI LÀM GAME</h2>
      </header>

      <ol class="qm-path">
        ${PROCESS_STEPS.map((s, i) => `
          <li class="qm-node reveal d${Math.min(i + 1, 6)}">
            <span class="qm-node__num font-arcade">${s.num}</span>
            <div class="qm-node__body">
              <div class="qm-node__en font-arcade">${s.en}</div>
              <h3 class="qm-node__title font-display">${s.title}</h3>
              <p class="qm-node__desc">${s.desc}</p>
            </div>
            <span class="qm-node__link" aria-hidden="true">▸</span>
          </li>
        `).join("")}
      </ol>

      ${dsBand("qm-band reveal d5")}

      <div class="qm-loop reveal d6">
        <div class="qm-loop__label font-arcade">CÁCH GIẢI QUYẾT VẤN ĐỀ</div>
        <div class="qm-loop__grid">
          ${PROCESS_LOOP.map(l => `
            <div class="qm-rule">
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
