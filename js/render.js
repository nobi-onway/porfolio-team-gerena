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
  return `<image href="img/lac-bird.jpg" x="${(-w/2).toFixed(1)}" y="${(-h/2).toFixed(1)}"
    width="${w.toFixed(1)}" height="${h.toFixed(1)}" preserveAspectRatio="xMidYMid meet"
    filter="url(#lacKey)"/>`;
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
             B2: tô đè màu mực đồng (#1c1a17) qua phần đục đó. -->
        <filter id="lacKey" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 -1 -1 0 1" result="a"/>
          <feFlood flood-color="#1c1a17" result="ink"/>
          <feComposite in="ink" in2="a" operator="in"/>
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
      <div class="flex flex-col justify-center gap-5 md:gap-6 md:pr-4 md:max-h-[82vh] overflow-hidden">

        <!-- Khối theo role (craft / soul) -->
        <div class="reveal d3 info-block">
          ${loreHTML(m.lore, m.accent)}
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

/* ---- Dựng track chứa toàn bộ card (xếp dọc, morph trượt liền) + nav dots ---- */
function renderMembers(stage, navDots, onDotClick) {
  const track = document.createElement("div");
  track.id = "cardTrack";

  MEMBERS.forEach((m, i) => {
    const card = document.createElement("article");
    card.className = "member-card";
    card.dataset.index = i;
    card.innerHTML = memberCardHTML(m, i);
    track.appendChild(card);

    const dot = document.createElement("button");
    dot.className = "nav-dot";
    dot.dataset.name = m.name;
    dot.setAttribute("aria-label", "Xem " + m.name);
    dot.addEventListener("click", () => onDotClick(i));
    navDots.appendChild(dot);
  });

  stage.appendChild(track);
}

/* ---- Dựng trống đồng lớn (nền toàn cục, neo giữa cạnh trái) ---- */
function renderDrum(container) {
  container.innerHTML = dongSonDrum();
}
