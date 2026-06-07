/* =========================================================
   RENDER — các hàm dựng HTML cho thẻ thành viên
   Phụ thuộc: MEMBERS, POSES (data.js)
   Xuất ra: hàm renderMembers(stage, navDots, onDotClick)
========================================================= */

/* =========================================================
   CÔNG CỤ — icon SVG đơn sắc mực, hover hiện màu thương hiệu
   Ưu tiên icon tự vẽ (s.icon); nếu không có thì lấy Simple Icons (s.slug).
   s = { name, icon?, slug?, color? }
========================================================= */
const INK_HEX = "1c1a17";

/* Nội dung chữ viết tắt kiểu Adobe (KHÔNG khung — khung do .skill-chip CSS lo) */
function adobeBadge(letters) {
  return `<svg viewBox="0 0 48 48" class="ic-svg" xmlns="http://www.w3.org/2000/svg">
    <text x="24" y="32" text-anchor="middle"
          font-family="'Cinzel', Georgia, serif" font-weight="700"
          font-size="22" fill="currentColor">${letters}</text>
  </svg>`;
}

/* Bộ icon tự vẽ (currentColor, KHÔNG khung) — cho tool Simple Icons không có */
const CUSTOM_ICONS = {
  ps: adobeBadge("Ps"),
  ai: adobeBadge("Ai"),
  ae: adobeBadge("Ae"),
  pr: adobeBadge("Pr"),
  // Spine — chuỗi đốt "xương sống" cong, to dần lên trên
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

  // 1) Icon tự vẽ (đơn sắc, đổi màu bằng currentColor) — luôn có khung CSS
  if (s.icon && CUSTOM_ICONS[s.icon]) {
    return `<span class="skill-chip skill-chip--framed skill-chip--svg" title="${title}" aria-label="${title}"
                  style="--brand:${brand}">${CUSTOM_ICONS[s.icon]}</span>`;
  }

  // 2) Logo Simple Icons (mực mặc định, hover màu gốc) — cũng đóng khung CSS
  if (s.slug) {
    const inkSrc = `https://cdn.simpleicons.org/${s.slug}/${INK_HEX}`;
    const colorSrc = `https://cdn.simpleicons.org/${s.slug}/${s.color || INK_HEX}`;
    const fallback = `this.closest('.skill-chip').outerHTML='<span class=\\'skill-chip skill-chip--framed skill-chip--text\\' title=\\'${title}\\'>${title}</span>'`;
    return `<span class="skill-chip skill-chip--framed" title="${title}" aria-label="${title}" style="--brand:${brand}">
      <img class="ic ic-ink"   src="${inkSrc}"   alt="${title}" loading="lazy" draggable="false" onerror="${fallback}"/>
      <img class="ic ic-color" src="${colorSrc}" alt="" aria-hidden="true" loading="lazy" draggable="false"/>
    </span>`;
  }

  // 3) Fallback chữ (cũng đóng khung)
  return `<span class="skill-chip skill-chip--framed skill-chip--text" title="${title}">${title}</span>`;
}

/* ---- Chọn pose theo role ---- */
function poseFor(role) {
  if (role === "Game Designer") return POSES.designer;
  if (role === "Game Artist") return POSES.artist;
  return POSES.developer;
}

/* ---- TRỐNG ĐỒNG nét mực (lớp nền lớn, neo giữa cạnh trái) ----
   viewBox 0 0 200 200, tâm (100,100). Vẽ bằng nét mực để hòa theme thủy mặc.
   Dùng toàn cục (1 lần) làm nền; avatar đặt chồng lên tâm. */
/* Chim LẠC — dùng ẢNH THẬT (img/lac-bird.jpg) cho giống reference 100%.
   Ảnh 650×284 (~2.29:1), nền trắng → dùng filter #lacKey biến trắng→trong suốt
   (chỉ giữ nét mực đen). Bay sang +x (mỏ phải). Khung ~36×16, tâm ở gốc (0,0). */
function lacBird() {
  const w = 36, h = 36 * 284 / 650;   // giữ tỉ lệ ảnh
  // image-rendering=optimizeQuality + style chống bilinear soft khi browser scale ảnh
  return `<image href="img/lac-bird.jpg" x="${(-w/2).toFixed(1)}" y="${(-h/2).toFixed(1)}"
    width="${w.toFixed(1)}" height="${h.toFixed(1)}" preserveAspectRatio="xMidYMid meet"
    filter="url(#lacKey)" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"/>`;
}

function dongSonDrum() {
  const C = 100;
  // Tia mặt trời (14 tia) ở tâm
  let rays = "";
  const RAYS = 14, rIn = 13, rOut = 26;
  for (let i = 0; i < RAYS; i++) {
    const a = (i / RAYS) * Math.PI * 2 - Math.PI / 2;
    const w = 0.10; // nửa góc tia
    const x1 = C + Math.cos(a - w) * rIn,  y1 = C + Math.sin(a - w) * rIn;
    const x2 = C + Math.cos(a + w) * rIn,  y2 = C + Math.sin(a + w) * rIn;
    const xt = C + Math.cos(a) * rOut,     yt = C + Math.sin(a) * rOut;
    rays += `<path class="ds-fill" d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${xt.toFixed(1)} ${yt.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} Z"/>`;
  }
  // Vành chấm tròn (hoa văn) trên bán kính rDots
  let dots = "";
  const NDOTS = 36, rDots = 78;
  for (let i = 0; i < NDOTS; i++) {
    const a = (i / NDOTS) * Math.PI * 2;
    const x = C + Math.cos(a) * rDots, y = C + Math.sin(a) * rDots;
    dots += `<circle class="ds-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5"/>`;
  }
  // Vành răng cưa (tam giác) bán kính rSaw
  let saw = "";
  const NSAW = 28, rSawIn = 88, rSawOut = 94;
  for (let i = 0; i < NSAW; i++) {
    const a = (i / NSAW) * Math.PI * 2;
    const a2 = ((i + 0.5) / NSAW) * Math.PI * 2;
    const x1 = C + Math.cos(a) * rSawIn,  y1 = C + Math.sin(a) * rSawIn;
    const xt = C + Math.cos(a2) * rSawOut, yt = C + Math.sin(a2) * rSawOut;
    const x2 = C + Math.cos((i + 1) / NSAW * Math.PI * 2) * rSawIn;
    const y2 = C + Math.sin((i + 1) / NSAW * Math.PI * 2) * rSawIn;
    saw += `<path class="ds-line faint" d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${xt.toFixed(1)} ${yt.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
  }
  // Chim LẠC Đông Sơn (văn hóa Việt) — vành chim bay ngược chiều kim đồng hồ.
  // Dáng đặc trưng: mỏ dài nhọn, đầu có mào, cổ vươn, cánh xòe, đuôi dài.
  // Vẽ silhouette (tô đặc) như hoa văn trống đồng thật.
  let birds = "";
  const NB = 6, rBird = 54;
  for (let i = 0; i < NB; i++) {
    const a = (i / NB) * Math.PI * 2 + 0.5;
    const x = C + Math.cos(a) * rBird, y = C + Math.sin(a) * rBird;
    // chim bay theo tiếp tuyến; scale(S, -S) = LẬT theo trục Y cho đúng chiều bay; to hơn
    const rot = (a * 180 / Math.PI) + 90;
    birds += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(0.8 -0.8)">${lacBird()}</g>`;
  }
  return `
    <svg class="dongson-drum" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <!-- Biến ảnh chim (nền trắng) → CHỈ GIỮ nét mực, tô màu trống.
             B1: alpha = 1 - độ-sáng (đen→đục, trắng→trong).
             B2: hard-threshold để mép chim SẮC NÉT (không bị fringe do JPG anti-alias).
             B3: tô đè màu mực đồng (#1c1a17) qua phần đục đó. -->
        <filter id="lacKey" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 -1 -1 0 1" result="aRaw"/>
          <feComponentTransfer in="aRaw" result="aSharp">
            <feFuncA type="table" tableValues="0 0 0 0.85 1 1 1 1"/>
          </feComponentTransfer>
          <feFlood flood-color="#1c1a17" result="ink"/>
          <feComposite in="ink" in2="aSharp" operator="in"/>
        </filter>
      </defs>
      <circle class="ds-line" cx="100" cy="100" r="97"/>
      <circle class="ds-line faint" cx="100" cy="100" r="84"/>
      <g class="ds-saw">${saw}</g>
      <g class="ds-dots">${dots}</g>
      <circle class="ds-line faint" cx="100" cy="100" r="70"/>
      <g class="ds-birds">${birds}</g>
      <circle class="ds-line" cx="100" cy="100" r="30"/>
      <g class="ds-rays">${rays}</g>
      <circle class="ds-fill" cx="100" cy="100" r="6"/>
    </svg>
  `;
}

/* ---- Avatar: khung nét đứt + pose (trống đồng giờ là nền toàn cục) ---- */
function avatarHTML(m) {
  return `
    <div class="avatar-frame w-full max-w-[300px] aspect-[3/4]">
      <span class="frame-label">ẢNH SẮP RA MẮT</span>
      <svg class="pose-svg" viewBox="0 0 100 140" preserveAspectRatio="xMidYMax meet"
           style="filter: drop-shadow(0 0 6px ${m.accent}55)">
        <g>${poseFor(m.role)}</g>
      </svg>
    </div>
  `;
}

/* ---- Tiêu đề nhỏ kiểu cổ: ◆ NHÃN ---- */
function sectionLabel(text) {
  return `<div class="sect-label">${text}</div>`;
}

/* ---- Khối theo role: Dev/Designer (craft) hoặc Artist (soul) ---- */
function loreHTML(lore, accent) {
  if (lore.kind === "soul") {
    return `
      ${sectionLabel(lore.title)}
      <p class="text-ink/75 text-sm leading-relaxed mb-3">${lore.intro}</p>
      <div class="mb-3">
        <span class="text-[11px] tracking-widest text-ink/50">DẤU ẤN · </span>
        <span class="text-ink/90 text-sm italic" style="color:${accent}">${lore.signature}</span>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <div class="text-[10px] tracking-widest text-ink/45 mb-1.5">NGUỒN CẢM HỨNG</div>
          <div class="text-ink/80">${lore.inspiration.join(" · ")}</div>
        </div>
        <div>
          <div class="text-[10px] tracking-widest text-ink/45 mb-1.5">SẮC THÁI</div>
          <div class="flex flex-wrap gap-1.5">
            ${lore.mood.map(t => `<span class="mood-chip">${t}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  }
  // craft
  return `
    ${sectionLabel(lore.title)}
    <p class="text-ink/75 text-sm leading-relaxed mb-3">${lore.intro}</p>
    <div class="space-y-2">
      ${lore.focus.map(f => `
        <div class="flex gap-3 text-sm">
          <span class="text-ink/55 min-w-[92px] tracking-wide">${f.k}</span>
          <span class="text-seal/50">›</span>
          <span class="text-ink/85">${f.v}</span>
        </div>
      `).join("")}
    </div>
  `;
}

/* ---- Cột Mốc Sự Nghiệp — dải ngang, hover tooltip + click mở modal ---- */
function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
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
    ${sectionLabel("Cột Mốc")}
    <div class="ms-strip">
      <div class="ms-rail" aria-hidden="true"></div>
      <ol class="ms-list">${items}</ol>
    </div>
  `;
}

/* ---- Dự án / Thành tựu ---- */
function projectsHTML(projects) {
  return `
    ${sectionLabel("Dự Án Tiêu Biểu")}
    <ul class="space-y-2.5">
      ${projects.map(p => `
        <li class="flex items-baseline gap-3 group">
          <span class="text-seal text-xs font-display">◆</span>
          <div class="flex-1 min-w-0">
            <span class="text-ink/90 text-sm font-medium">${p.name}</span>
            <span class="text-ink/40 text-xs"> — ${p.role}</span>
          </div>
          <span class="font-display text-ink/55 text-xs tabular-nums">${p.year}</span>
        </li>
      `).join("")}
    </ul>
  `;
}

/* =========================================================
   LAYOUT v2 — "BỨC HỌA TAM ĐOẠN" (thử nghiệm cho member 0)
   3 phần dọc: Chuyên Môn / Cột Mốc / Sản Phẩm (HERO).
   Sản phẩm là trọng tâm — cover dạng tranh treo, chuyển trang
   bằng số Hán 一二三.
========================================================= */

/* Số đếm chữ Hán (đến 10) — dùng cho pager sản phẩm */
const HAN_NUMS = ["一","二","三","四","五","六","七","八","九","十"];

/* Sinh "cover" SVG inline — bức tranh thủy mặc mini theo scene key.
   Không cần file ảnh thật; cover hoà hợp với tone giấy & mực. */
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
          <stop offset="0%"  stop-color="#f7f1e3"/>
          <stop offset="100%" stop-color="#ebe1cb"/>
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
            fill="${accent || "#b5362a"}" opacity="0.92"/>
      <text x="${W-30}" y="${H-25}" text-anchor="middle"
            font-family="'Cinzel', serif" font-weight="700"
            font-size="14" fill="#f4efe4">印</text>
    </svg>
  `;
}

/* "Câu đối" — 2 cột dọc cho khối Chuyên Môn (craft) hoặc Chất Riêng (soul) */
function coupletHTML(lore, accent) {
  if (lore.kind === "soul") {
    const rows = [
      { k: "Dấu ấn", v: lore.signature || "" },
      { k: "Nguồn cảm hứng", v: (lore.inspiration || []).join(" · ") },
      { k: "Sắc thái", v: (lore.mood || []).join(" · ") },
    ];
    return `
      <div class="couplet">
        <div class="couplet__intro">${lore.intro}</div>
        <div class="couplet__rows">
          ${rows.map(r => `
            <div class="couplet__row">
              <span class="couplet__k">${r.k}</span>
              <span class="couplet__sep">·</span>
              <span class="couplet__v" style="--accent:${accent}">${r.v}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
  return `
    <div class="couplet">
      <div class="couplet__intro">${lore.intro}</div>
      <div class="couplet__rows">
        ${lore.focus.map(f => `
          <div class="couplet__row">
            <span class="couplet__k">${f.k}</span>
            <span class="couplet__sep">·</span>
            <span class="couplet__v">${f.v}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/* SẢN PHẨM — 1 sản phẩm HERO + Hán pager. Slide chuyển bằng JS. */
function productHeroHTML(p, idx, memberIdx, accent) {
  const tags = (p.tags || []).map(t => `<span class="prod-tag">${t}</span>`).join("");
  return `
    <article class="prod-slide" data-prod-idx="${idx}" aria-hidden="${idx === 0 ? "false" : "true"}">
      <div class="prod-frame">
        ${coverSVG(p.cover || "", p.name, accent)}
        <span class="prod-frame__corner tl"></span>
        <span class="prod-frame__corner tr"></span>
        <span class="prod-frame__corner bl"></span>
        <span class="prod-frame__corner br"></span>
      </div>
      <div class="prod-info">
        <header class="prod-info__head">
          <h4 class="prod-info__title font-display">${p.name}</h4>
          <div class="prod-info__meta">
            <span class="prod-info__role">${p.role}</span>
            <span class="prod-info__sep">·</span>
            <span class="prod-info__year font-display">${p.year}</span>
          </div>
        </header>
        ${p.contribution ? `<p class="prod-info__contrib">${p.contribution}</p>` : ""}
        ${tags ? `<div class="prod-info__tags">${tags}</div>` : ""}
        ${p.metric ? `<div class="prod-info__metric"><span class="prod-info__metric-seal">印</span>${p.metric}</div>` : ""}
      </div>
    </article>
  `;
}
function productPagerHTML(total) {
  let dots = "";
  for (let i = 0; i < total; i++) {
    dots += `<button type="button" class="prod-pager__dot ${i === 0 ? "is-active" : ""}"
                     data-prod-go="${i}" aria-label="Sản phẩm ${i + 1}">
               <span class="prod-pager__han font-display">${HAN_NUMS[i] || (i+1)}</span>
             </button>`;
  }
  return `
    <nav class="prod-pager" aria-label="Chuyển sản phẩm">
      <button type="button" class="prod-pager__arrow" data-prod-prev aria-label="Sản phẩm trước">‹</button>
      <div class="prod-pager__dots">${dots}</div>
      <button type="button" class="prod-pager__arrow" data-prod-next aria-label="Sản phẩm kế">›</button>
    </nav>
  `;
}

/* Khối KINH NGHIỆM CÁ NHÂN — HERO (xưa là "Sản Phẩm") */
function productsHeroHTML(projects, memberIdx, accent) {
  if (!projects || !projects.length) return "";
  const slides = projects.map((p, i) => productHeroHTML(p, i, memberIdx, accent)).join("");
  return `
    ${sectionLabel("Kinh Nghiệm Cá Nhân")}
    <div class="prod-stage" data-member="${memberIdx}" data-prod-current="0">
      <div class="prod-slides">${slides}</div>
      ${productPagerHTML(projects.length)}
    </div>
  `;
}

/* Card layout v2 — dành cho member được "chốt mock" */
function memberCardHTMLv2(m, i) {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">
      ${String(i + 1).padStart(2, "0")}
    </div>

    <div class="w-full h-full max-w-[1400px] mx-auto px-10 md:px-14 lg:px-20
                grid grid-cols-1 md:grid-cols-[36%_1fr] gap-6 md:gap-10 lg:gap-14 items-center">

      <!-- ===== NỬA TRÁI: avatar (dời sang phải so với v1) ===== -->
      <div class="flex flex-col items-center md:items-start justify-center md:ml-[3%] lg:ml-[5%]">
        <div class="reveal d1">
          ${avatarHTML(m)}
        </div>
      </div>

      <!-- ===== NỬA PHẢI: BỨC HỌA TAM ĐOẠN ===== -->
      <div class="card-v2-right flex flex-col justify-center md:max-h-[88vh] ${m.lore.kind === "soul" ? "has-tools-rail" : ""}">
        <span class="v2-seal" aria-hidden="true">印</span>
        ${m.lore.kind === "soul" ? `
          <!-- Cột công cụ overlay (chỉ Artist) — icon dọc, mép phải -->
          <aside class="v2-tools-rail" aria-label="Công cụ thường dùng">
            ${m.skills.map(skillTagHTML).join("")}
          </aside>
        ` : ""}

        <!-- ĐOẠN 1 · Chuyên Môn / Chất Riêng -->
        <section class="reveal d3 v2-sect v2-sect--lore">
          ${sectionLabel(m.lore.title)}
          ${coupletHTML(m.lore, m.accent)}
        </section>

        <!-- vệt mực loang phân cách -->
        <div class="v2-divider" aria-hidden="true"></div>

        <!-- ĐOẠN 2 · Cột Mốc -->
        <section class="reveal d3b v2-sect v2-sect--milestones">
          ${milestonesHTML(m.milestones, i)}
        </section>

        <!-- vệt mực loang phân cách -->
        <div class="v2-divider" aria-hidden="true"></div>

        <!-- ĐOẠN 3 · SẢN PHẨM (HERO) -->
        <section class="reveal d4 v2-sect v2-sect--products">
          ${productsHeroHTML(m.projects, i, m.accent)}
        </section>

      </div>
    </div>
  `;
}

/* ---- Markup 1 thẻ thành viên ---- */
function memberCardHTML(m, i) {
  return `
    <div class="ghost-index absolute select-none text-[40vh] md:text-[55vh] right-[3vw] top-1/2 -translate-y-1/2 -z-10">
      ${String(i + 1).padStart(2, "0")}
    </div>

    <div class="w-full h-full max-w-[1400px] mx-auto px-10 md:px-16 lg:px-24
                grid grid-cols-1 md:grid-cols-[42%_1fr] gap-8 md:gap-12 lg:gap-20 items-center">

      <!-- ===== NỬA TRÁI: chỉ Avatar (gần tâm trống) ===== -->
      <div class="flex flex-col items-center md:items-start justify-center md:-ml-[14%] lg:-ml-[18%]">
        <div class="reveal d1">
          ${avatarHTML(m)}
        </div>
      </div>

      <!-- ===== NỬA PHẢI: các khối thông tin ===== -->
      <div class="flex flex-col justify-center gap-5 md:gap-6 md:pr-4 md:max-h-[88vh]">

        <!-- Khối theo role (craft / soul) -->
        <div class="reveal d3 info-block">
          ${loreHTML(m.lore, m.accent)}
        </div>

        <!-- Cột Mốc — dải ngang, KHÔNG đóng khung -->
        <div class="reveal d3b ms-block">
          ${milestonesHTML(m.milestones, i)}
        </div>

        <!-- Grid 2 cột: Dự án | Kỹ năng -->
        <div class="grid sm:grid-cols-2 gap-5 md:gap-6">
          <div class="reveal d4 info-block">
            ${projectsHTML(m.projects)}
          </div>
          <div class="reveal d5 info-block">
            ${sectionLabel("Công Cụ")}
            <div class="flex flex-wrap gap-2.5 items-center">
              ${m.skills.map(skillTagHTML).join("")}
            </div>
            <blockquote class="quote-line mt-5">
              ${m.quote}
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   INTRO SLIDE — trang mở đầu giới thiệu team
   Bố cục: PORTFOLIO (giữa, sau drum) + khung video to (đè giữa)
   + các khung nhỏ moodboard xung quanh (sản phẩm + team).
========================================================= */
function introThumbHTML(scene, label, pos, rot) {
  return `
    <article class="intro-frame intro-frame--thumb intro-frame--${pos}" style="--rot:${rot}deg">
      <div class="intro-frame__media">
        ${coverSVG(scene, "", "#b5362a")}
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
        <!-- KHUNG VIDEO LỚN — đè lên Portfolio + drum -->
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

        <!-- KHUNG NHỎ — sản phẩm + team (moodboard scatter) -->
        ${introThumbHTML("scene:mountain", "Sản Phẩm I", "p1", -4)}
        ${introThumbHTML("scene:bamboo",   "Team Off-site", "p2", 3)}
        ${introThumbHTML("scene:river",    "Sản Phẩm II", "p3", -2)}
        ${introThumbHTML("scene:bamboo",   "Sản Phẩm III", "p4", 4)}
        ${introThumbHTML("scene:mountain", "Sự Kiện 2023", "p5", 2)}
        ${introThumbHTML("scene:river",    "Sản Phẩm IV", "p6", -3)}
      </div>

      <p class="intro-tagline">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor —
        team game studio dệt cảm hứng Việt vào từng dự án.
      </p>
    </div>
  `;
}

/* ---- Dựng track chứa toàn bộ card (xếp dọc, morph trượt liền) + nav dots ---- */
function renderMembers(stage, navDots, onDotClick) {
  const track = document.createElement("div");
  track.id = "cardTrack";

  // SLIDE 0 — INTRO (giới thiệu team, phải nằm trên cùng)
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

  // SLIDE 1..N — các thành viên (memberIdx = i; slidePos = i+1)
  MEMBERS.forEach((m, i) => {
    const card = document.createElement("article");
    card.className = "member-card";
    card.dataset.index = i + 1;
    // Layout v2 ("Bức Họa Tam Đoạn") áp dụng cho toàn bộ thành viên.
    // Artist (lore.kind === "soul") có thêm cột Công Cụ overlay.
    card.innerHTML = memberCardHTMLv2(m, i);
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

/* ---- Dựng trống đồng lớn (nền toàn cục, neo giữa cạnh trái) ---- */
function renderDrum(container) {
  container.innerHTML = dongSonDrum();
}
