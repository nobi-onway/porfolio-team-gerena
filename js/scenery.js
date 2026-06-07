/* =========================================================
   SCENERY — CUỘN TRANH THỦY MẶC DỌC LIỀN MẠCH
   Mạch: Bốn mùa + Cửa biển (trên → dưới)
     Đoạn 0  Xuân   — hoa đào, núi xa thức giấc, suối nguồn
     Đoạn 1  Hạ     — đầm sen, mặt nước lăn tăn
     Đoạn 2  Thu    — tre trúc, lá rơi, sương
     Đoạn 3  Đông   — núi tuyết mờ, thông già, tĩnh lặng
     Đoạn 4  Cửa biển — thuyền, sóng, hải đảo, chân trời mở

   BỐ CỤC — DỒN SANG PHẢI:
     Trống đồng lớn nằm ở giữa cạnh TRÁI (phủ ~vùng x:0..SAFE_L).
     → Mọi CHỦ THỂ chính (núi, sen, đào, tre, thuyền…) đặt từ x ≥ SAFE_L,
       lệch về nửa phải bức tranh. Vùng trái chỉ để mây/sương mờ
       (nằm dưới trống, không tranh chấp thị giác).

   PHONG CÁCH (tham khảo "City of Moon"):
     · Núi/đá có MẢNG TÔ WASH (gradient mực loang) chứ không chỉ line-art
     · Mực PHA CHÀM (xanh xám lạnh) — xem .ink-stroke trong styles.css

   CHỐNG MÉO: viewBox mỗi đoạn ≈ 16:9 (VIEW_W×SEG_H), preserveAspectRatio="none".
   Xuất: renderScenes(sceneLayer)
========================================================= */

const VIEW_W = 1440;
const SEG_H = 820;          // ≈ 1440×820 ~ 16:9, mỗi đoạn khớp ~1 viewport
const SAFE_L = 840;         // mép trái vùng an toàn — chủ thể chính đặt từ đây sang phải
                            // (trống đồng 70vh che rất rộng trên màn dọc; chọn 840 ~ quá nửa khung
                            //  để KHÔNG họa tiết nào — kể cả mây/hạc/suối — đè lên trống)

/* =========================================================
   BỨC TRANH DÀI (1 ảnh dọc) — cuộn dọc qua tranh khi chuyển slide
   ----------------------------------------------------------
   · 1 ảnh duy nhất (img/background.jpg, 990×3262 — tranh thủy mặc dọc).
   · #sceneScroll cao N×100vh; ảnh phủ TRỌN chiều cao đó.
     Camera trượt translateY(-current×100vh) → thấy cuộn dọc qua tranh.
   · ĐỂ THAY: đổi BG_IMAGE.src. Ảnh nên là tranh DỌC (cao > rộng).
========================================================= */
const BG_IMAGE = {
  src: "img/background.jpg",
  w: 990, h: 3262,            // tỉ lệ ảnh (để tính bố cục / fit)
};

/* ---------- DEFS: gradient wash + FILTERS mực/giấy ----------
   washInk1/2/3 : khối mực gradient (đậm chân → nhạt đỉnh), nhiều chặng → có khối.
   washTop      : đỉnh sáng (highlight) đổ ngược, tạo cảm giác ánh sáng trên đỉnh.
   #inkBleed    : mép mực LOANG (turbulence + displace) — chống "phẳng số".
   #inkBleedSoft: loang nhẹ cho vật nhỏ.
   #farHaze     : blur nhẹ cho vật XA (tầng không khí).
   #dryBrush    : vệt khô (turbulence che bớt) cho nét bút lông.                  */
function sceneDefs() {
  return `<defs>
    <linearGradient id="washInk1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"    stop-color="rgba(44,56,68,0.04)"/>
      <stop offset="0.35" stop-color="rgba(40,52,64,0.16)"/>
      <stop offset="0.72" stop-color="rgba(32,42,52,0.30)"/>
      <stop offset="1"    stop-color="rgba(22,30,38,0.46)"/>
    </linearGradient>
    <linearGradient id="washInk2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"    stop-color="rgba(48,60,72,0.02)"/>
      <stop offset="0.45" stop-color="rgba(44,56,68,0.10)"/>
      <stop offset="0.8"  stop-color="rgba(36,46,58,0.22)"/>
      <stop offset="1"    stop-color="rgba(30,40,50,0.32)"/>
    </linearGradient>
    <linearGradient id="washFaint" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"    stop-color="rgba(70,82,94,0)"/>
      <stop offset="0.7"  stop-color="rgba(64,76,88,0.06)"/>
      <stop offset="1"    stop-color="rgba(58,70,82,0.14)"/>
    </linearGradient>
    <!-- đỉnh sáng: trắng-mờ đổ từ trên xuống, tan nhanh -->
    <linearGradient id="washTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"   stop-color="rgba(250,249,245,0.55)"/>
      <stop offset="0.4" stop-color="rgba(250,249,245,0.10)"/>
      <stop offset="1"   stop-color="rgba(250,249,245,0)"/>
    </linearGradient>
    <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0"   stop-color="rgba(255,255,255,0.85)"/>
      <stop offset="0.7" stop-color="rgba(220,228,235,0.25)"/>
      <stop offset="1"   stop-color="rgba(220,228,235,0)"/>
    </radialGradient>

    <filter id="inkBleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="inkBleedSoft" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="2" seed="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="farHaze" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.4"/>
    </filter>
    <filter id="dryBrush" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="turbulence" baseFrequency="0.9 0.05" numOctaves="2" seed="11" result="t"/>
      <feColorMatrix in="t" type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.05" result="mask"/>
      <feComposite in="SourceGraphic" in2="mask" operator="in"/>
    </filter>
  </defs>`;
}

/* ---------- VẬT TRANG TRÍ ---------- */

/* Mây thủy mặc kiểu "vân mây" (運雲) — vài đường cuộn ngang nhẹ, chịu méo tốt.
   Không dùng chuỗi cung nhỏ (dễ loạn khi SVG bị kéo) mà là các nét lượn dài. */
function cloud(x, y, s, cls) {
  return `<g transform="translate(${x} ${y}) scale(${s})" class="${cls || ''}">
    <path class="ink-stroke faint" d="M0 0 C 24 -10 54 -10 78 0 C 96 8 116 8 132 0"/>
    <path class="ink-stroke faint" style="stroke-opacity:.55" d="M10 10 C 32 2 60 2 84 10 C 100 15 116 14 126 9"/>
    <path class="ink-stroke faint" style="stroke-opacity:.4" d="M22 -8 C 40 -14 60 -13 76 -7"/>
  </g>`;
}

/* Hạc bay — cánh bọc trong .flap để vỗ chậm */
function crane(x, y, s, cls) {
  return `<g transform="translate(${x} ${y}) scale(${s})" class="${cls || ''}">
    <g class="flap">
      <path class="ink-stroke" d="M2 10 C 16 -8 28 -10 40 6"/>
      <path class="ink-stroke" d="M40 6 C 52 -10 66 -8 80 10"/>
    </g>
    <path class="ink-stroke" d="M40 6 C 44 12 50 16 60 17"/>
    <path class="ink-stroke" d="M60 17 c 8 0 14 -3 20 -9"/>
    <path class="ink-stroke faint" d="M80 8 l 9 -3"/>
    <path class="ink-stroke faint" d="M44 11 c -4 8 -8 12 -16 16"/>
  </g>`;
}

/* Đầm sen */
function lotus(x, y, s, cls) {
  return `<g transform="translate(${x} ${y}) scale(${s})" class="${cls || ''}">
    <ellipse class="ink-stroke" cx="-40" cy="20" rx="46" ry="17"/>
    <ellipse class="ink-wash w3" cx="-40" cy="20" rx="44" ry="15"/>
    <path class="ink-stroke faint" d="M-40 4 L -40 36
      M-78 20 C -60 14 -20 14 -2 20
      M-66 10 L -50 24 M-40 6 L -40 33 M-14 10 L -30 24"/>
    <ellipse class="ink-stroke faint" cx="6" cy="6" rx="30" ry="11"/>
    <path class="ink-stroke bold" d="M44 40 C 41 18 43 4 44 -10"/>
    <g transform="translate(44 -12)">
      <path class="ink-stroke faint" d="M0 6 C -24 2 -28 -16 -18 -28"/>
      <path class="ink-stroke faint" d="M0 6 C  24 2  28 -16  18 -28"/>
      <path class="ink-stroke" d="M0 8 C -14 0 -13 -22 0 -32 C 13 -22 14 0 0 8 Z"/>
      <path class="ink-stroke" d="M0 6 C -8 0 -7 -16 0 -24 C 7 -16 8 0 0 6 Z"/>
      <circle class="seal-fill" cx="0" cy="-12" r="3"/>
      <path class="ink-stroke faint" d="M-3 -10 q 3 4 6 0"/>
    </g>
    <g transform="translate(82 -2)">
      <path class="ink-stroke" d="M0 4 C -8 -2 -8 -18 0 -26 C 8 -18 8 -2 0 4 Z"/>
      <path class="ink-stroke bold" d="M0 4 L 0 30"/>
    </g>
  </g>`;
}

/* Thuyền nan + người chèo + mui che */
function boat(x, y, s, cls) {
  return `<g transform="translate(${x} ${y}) scale(${s})" class="${cls || ''}">
    <path class="ink-wash w3" d="M-58 0 C -40 18 40 18 58 0 C 30 7 -30 7 -58 0 Z"/>
    <path class="ink-stroke bold" d="M-58 0 C -40 18 40 18 58 0"/>
    <path class="ink-stroke" d="M-58 0 C -30 7 30 7 58 0"/>
    <path class="ink-stroke" d="M-26 -2 C -22 -22 22 -22 26 -2"/>
    <path class="ink-stroke faint" d="M-14 -14 L -14 -2 M0 -18 L 0 -2 M14 -14 L 14 -2"/>
    <path class="ink-stroke faint" d="M40 -4 l 6 -16 m 0 0 l 12 -8"/>
    <circle class="ink-stroke faint" cx="46" cy="-22" r="3.2"/>
  </g>`;
}

/* Cành đào — thân gân guốc + hoa son 5 cánh */
function blossomBranch(x, y, s, cls) {
  const blooms = [
    [30, 4, 1], [58, -6, 0.8], [92, 2, 1], [128, -4, 0.9],
    [160, 6, 1], [186, -2, 0.8], [70, -24, 0.7], [140, -22, 0.75]
  ];
  const flower = (fx, fy, fs) => `<g transform="translate(${fx} ${fy}) scale(${fs})">
    ${[0,72,144,216,288].map(a=>{
      const rad = a*Math.PI/180;
      const px = Math.cos(rad)*7, py = Math.sin(rad)*7;
      return `<path class="ink-stroke faint" d="M0 0 Q ${(px*0.6-py*0.4).toFixed(1)} ${(py*0.6+px*0.4).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)} Q ${(px*0.6+py*0.4).toFixed(1)} ${(py*0.6-px*0.4).toFixed(1)} 0 0 Z"/>`;
    }).join("")}
    <circle class="seal-fill" cx="0" cy="0" r="2.6"/>
  </g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})" class="${cls || ''}">
    <path class="ink-stroke bold draw" style="--len:420" d="M-6 0 C 40 16 96 -10 150 6 C 178 14 196 4 210 -8"/>
    <path class="ink-stroke draw" style="--len:260" d="M40 8 C 52 -16 70 -22 82 -40 M120 -2 C 132 -24 150 -28 158 -48 M170 2 C 184 14 200 16 214 8"/>
    <path class="ink-stroke faint" d="M62 -2 l 6 -12 M104 0 l 8 -10 M148 -2 l 6 -12"/>
    ${blooms.map(([bx,by,bs])=>flower(bx,by,bs)).join("")}
  </g>`;
}

/* Khóm tre */
function bambooLeaf(x, y, r) {
  return `<path class="ink-stroke faint" transform="translate(${x} ${y}) rotate(${r})"
    d="M0 0 Q 22 -7 44 0 Q 22 5 0 0 Z"/>`;
}
function bamboo(x, y, h, s, cls) {
  const joints = [0.18, 0.36, 0.54, 0.72, 0.88];
  const segs = joints.map(j => `<path class="ink-stroke" d="M-2 ${(h*j).toFixed(0)} h 10"/>`).join("");
  const branches = joints.slice(1).map((j, i) => {
    const side = i % 2 ? 1 : -1;
    const bx = side * 4, by = h * j;
    const ex = side * (40 + i * 8), ey = by - 28 - i * 6;
    const leafCluster = [0, 18, -16, 30, -30].map((a, k) =>
      bambooLeaf((ex + side * k * 6).toFixed(0), (ey - k * 4).toFixed(0), side > 0 ? -a : 180 + a)
    ).join("");
    return `<path class="ink-stroke" d="M${bx} ${by.toFixed(0)} C ${(ex*0.5).toFixed(0)} ${(by-10).toFixed(0)} ${(ex*0.85).toFixed(0)} ${(ey+6).toFixed(0)} ${ex} ${ey.toFixed(0)}"/>${leafCluster}`;
  }).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})" class="${cls || ''}">
    <path class="ink-stroke bold draw" style="--len:${h+30}" d="M0 ${h} C -2 ${(h*0.6).toFixed(0)} 4 ${(h*0.3).toFixed(0)} 2 0"/>
    <path class="ink-stroke draw" style="--len:${h+30}" d="M16 ${h} C 14 ${(h*0.6).toFixed(0)} 20 ${(h*0.3).toFixed(0)} 17 ${(h*0.15).toFixed(0)}"/>
    ${segs}
    ${branches}
  </g>`;
}

/* Núi thủy mặc — KHỐI mực loang (wash gradient + mép bleed) + đỉnh sáng + nếp gân.
   level: 1 = gần/đậm-rõ, 2 = giữa, 3 = xa/mờ (haze + xám-lạnh).
   Tầng không khí: lv3 thêm blur (.far-haze), bớt nét; lv1 nét rõ + gân đậm. */
function mountain(x, y, s, level, cls) {
  const lv = level || 1;
  const wash = lv === 1 ? "w1" : lv === 2 ? "w2" : "w3";
  const strokeCls = lv >= 3 ? "ink-stroke faint" : "ink-stroke";
  const ridge = `M0 130 C 50 118 92 70 135 6 C 168 56 184 70 205 70 C 226 70 240 58 250 46 C 274 70 296 104 320 130`;
  const body = `${ridge} L 320 130 L 0 130 Z`;
  // đỉnh sáng: dải hẹp ôm theo sống đỉnh chính
  const cap = `M70 92 C 100 50 120 22 135 6 C 152 24 168 46 188 78 C 160 70 110 74 70 92 Z`;
  // gân/nếp núi (đậm nhạt khác nhau) — chỉ rõ ở núi gần
  const veins = lv <= 2 ? `
    <path class="ink-stroke faint" d="M135 16 C 128 48 132 84 140 124"/>
    <path class="ink-stroke faint" style="stroke-opacity:.45" d="M118 54 C 112 78 116 100 122 126"/>
    <path class="ink-stroke faint" style="stroke-opacity:.4"  d="M170 64 C 176 86 176 104 172 126"/>
    <path class="ink-stroke faint" style="stroke-opacity:.3"  d="M150 28 C 156 50 158 70 156 96"/>` : `
    <path class="ink-stroke faint" style="stroke-opacity:.35" d="M135 22 C 130 52 134 86 140 120"/>`;
  const inner = `
    <path class="ink-wash ${wash} bleed" d="${body}"/>
    <path class="ink-wash ${wash}" style="opacity:.5" d="${body}"/>
    <path class="ink-top" d="${cap}"/>
    <path class="${strokeCls} dry" d="${ridge}"/>
    ${veins}
    <path class="ink-stroke faint" style="stroke-opacity:.26" d="M52 106 C 104 98 150 102 200 106"/>`;
  // núi xa: blur tầng không khí + chìm xuống (opacity)
  const hazeOpen = lv >= 3 ? `<g class="far-haze" style="opacity:.85">` : `<g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})" class="${cls || ''}">
    ${hazeOpen}${inner}</g>
  </g>`;
}

/* Thông già (Đông) */
function pine(x, y, s, cls) {
  return `<g transform="translate(${x} ${y}) scale(${s})" class="${cls || ''}">
    <path class="ink-stroke bold" d="M0 60 C 2 36 -4 20 6 0"/>
    <path class="ink-stroke" d="M4 40 c -16 -2 -26 -8 -34 -18 M6 24 c 16 -2 26 -8 34 -18 M5 12 c -14 -2 -22 -6 -30 -14"/>
    ${[[-30,22],[40,6],[-26,-2],[30,-14],[6,-22]].map(([lx,ly])=>
      `<path class="ink-stroke faint" d="M${lx} ${ly} l -6 -5 m 6 5 l -7 1 m 7 -1 l -4 6 m 4 -6 l 5 -5 m -5 5 l 6 2"/>`
    ).join("")}
  </g>`;
}

/* Lá rơi tĩnh */
function leaf(x, y, r, s) {
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <path class="ink-stroke faint" d="M0 0 Q 18 -7 34 0 Q 18 5 0 0 Z"/>
    <path class="ink-stroke faint" style="stroke-opacity:.3" d="M2 0 H 32"/>
  </g>`;
}

/* Đá/ghềnh — KHỐI mực loang (bleed) + đỉnh sáng + nếp nứt dày-mỏng */
function rock(x, y, s, cls) {
  const body = "M-40 18 C -54 -6 -24 -24 -2 -18 C 14 -28 46 -14 44 14 C 24 26 -16 26 -40 18 Z";
  const cap  = "M-24 -10 C -14 -20 6 -22 22 -14 C 6 -10 -10 -8 -24 -10 Z";
  return `<g transform="translate(${x} ${y}) scale(${s})" class="${cls || ''}">
    <path class="ink-wash w1 bleed-soft" d="${body}"/>
    <path class="ink-wash w2" style="opacity:.6" d="${body}"/>
    <path class="ink-top" d="${cap}"/>
    <path class="ink-stroke dry" d="${body}"/>
    <path class="ink-stroke faint" d="M-16 -12 C -12 2 -8 12 -4 20 M16 -14 C 14 0 16 10 20 18"/>
    <path class="ink-stroke faint" style="stroke-opacity:.35" d="M-30 10 C -18 6 -4 6 8 10"/>
  </g>`;
}

/* Trăng khuyết + quầng sáng (đỉnh cuộn, gợi "City of Moon") */
function moon(x, y, r) {
  return `<g transform="translate(${x} ${y})">
    <circle cx="0" cy="0" r="${r*2.6}" fill="url(#moonGlow)"/>
    <path class="ink-stroke" d="M ${(-r*0.3).toFixed(1)} ${(-r).toFixed(1)}
      A ${r} ${r} 0 1 0 ${(-r*0.3).toFixed(1)} ${r.toFixed(1)}
      A ${(r*0.78).toFixed(1)} ${(r*0.78).toFixed(1)} 0 1 1 ${(-r*0.3).toFixed(1)} ${(-r).toFixed(1)} Z"
      style="fill:rgba(250,250,248,0.9)"/>
  </g>`;
}

/* ---------- ĐƯỜNG NỐI XUYÊN SUỐT (per-segment) ----------
   Mỗi đoạn cao SEG_H. Để liền mạch khi xếp chồng các SVG-đoạn,
   các đường này VÀO ở y=0 và RA ở y=SEG_H tại CÙNG toạ độ x cố định
   (RIVER_X / RIDGE_X) → đoạn dưới nối khít đoạn trên.
   Tham số `o` = offset y của đoạn (i*SEG_H) để rải hạc theo chỉ số.       */

const RIVER_X = 1040;   // x của suối tại mép trên & dưới mỗi đoạn (điểm nối)
const RIDGE_BASE = 1240;

// Suối: khúc trong 1 đoạn, vào/ra tại RIVER_X → nối liền giữa các đoạn
function riverSeg(o, idx) {
  const sway = (idx % 2 === 0) ? -1 : 1;     // lượn trái/phải xen kẽ cho tự nhiên
  const midX = RIVER_X + sway * 70;
  return `
    <path class="ink-stroke draw" style="--len:1400"
      d="M${RIVER_X} ${o} C ${midX} ${o+230} ${RIVER_X - sway*60} ${o+430} ${midX} ${o+600} C ${RIVER_X+sway*30} ${o+720} ${RIVER_X} ${o+760} ${RIVER_X} ${o+SEG_H}"/>
    <path class="ink-stroke faint" style="stroke-opacity:.3"
      d="M${RIVER_X+70} ${o} C ${midX+70} ${o+230} ${RIVER_X+10} ${o+430} ${midX+60} ${o+600}"/>
    ${[200,460,700].map(dy=>
      `<path class="ink-stroke faint" style="stroke-opacity:.28" d="M${RIVER_X-30} ${o+dy} q 30 -8 60 0 t 60 0"/>`
    ).join("")}
  `;
}

// Dải núi chân trời sát mép phải — khúc trong 1 đoạn, nối liền ở y biên
function ridgeSeg(o) {
  let d = `M1440 ${o}`;
  const steps = 5;
  for (let i = 1; i <= steps; i++) {
    const y = o + (SEG_H / steps) * i;
    const x = RIDGE_BASE + Math.sin(i * 1.4) * 90;
    const cx = 1360 + Math.cos(i * 0.9) * 50;
    d += ` S ${cx.toFixed(0)} ${(y - SEG_H/steps*0.6).toFixed(0)}, ${x.toFixed(0)} ${y.toFixed(0)}`;
  }
  d += ` L 1440 ${o+SEG_H} Z`;
  return `<path class="ink-wash w3" d="${d}"/>`;
}

// Đàn hạc — 2 con mỗi đoạn, vị trí khác nhau theo idx
function craneSeg(o, idx) {
  const a = [
    [[1140, 130, 1.3], [1240, 200, 1.0]],
    [[1180, 110, 1.2], [1060, 180, 1.4]],
    [[1100, 150, 1.5], [1230, 230, 1.0]],
    [[1200, 120, 1.1], [1090, 210, 1.3]],
    [[1150, 140, 1.4], [1250, 210, 1.0]],
  ][idx % 5];
  return a.map(([x,y,s],i)=> crane(x, o+y, s, i? 'float-slow':'float-mid')).join("");
}

// Mây — 2 đám mỗi đoạn (toạ độ tương đối đoạn). x từ x=0 (không vươn trái).
function cloudX(s, push) { return SAFE_L + 30 + (push || 0); }
function cloudsSeg(o, idx) {
  const alt = idx % 2 === 0;
  return [
    cloud(cloudX(2.4, alt ? 0 : 180), o + 150, 2.4, 'float-x'),
    cloud(cloudX(2.0, alt ? 220 : 40), o + 380, 2.0, 'float-x'),
  ].join("");
}

/* ====== HỌA TIẾT CHUYÊN CHO CẢNH XUÂN (index 0) ====== */

/* NÉT BÚT LÔNG tô-fill: dải đậm ở gốc (w0) thon dần về ngọn (w1).
   Đi qua 4 điểm (gốc → 2 điểm điều khiển → ngọn); trả về path kín hình nêm. */
function brushStroke(p0, c1, c2, p1, w0, w1, cls) {
  // vector pháp tuyến xấp xỉ tại 2 đầu để "phình" bề rộng
  const nx0 = -(c1[1]-p0[1]), ny0 = (c1[0]-p0[0]);
  const nx1 = -(p1[1]-c2[1]), ny1 = (p1[0]-c2[0]);
  const L0 = Math.hypot(nx0,ny0)||1, L1 = Math.hypot(nx1,ny1)||1;
  const a0x=p0[0]+nx0/L0*w0, a0y=p0[1]+ny0/L0*w0;
  const b0x=p0[0]-nx0/L0*w0, b0y=p0[1]-ny0/L0*w0;
  const a1x=p1[0]+nx1/L1*w1, a1y=p1[1]+ny1/L1*w1;
  const b1x=p1[0]-nx1/L1*w1, b1y=p1[1]-ny1/L1*w1;
  const d = `M${a0x.toFixed(1)} ${a0y.toFixed(1)}
    C ${(c1[0]+nx0/L0*w0*0.6).toFixed(1)} ${(c1[1]+ny0/L0*w0*0.6).toFixed(1)}
      ${(c2[0]+nx1/L1*w1*0.6).toFixed(1)} ${(c2[1]+ny1/L1*w1*0.6).toFixed(1)}
      ${a1x.toFixed(1)} ${a1y.toFixed(1)}
    L ${b1x.toFixed(1)} ${b1y.toFixed(1)}
    C ${(c2[0]-nx1/L1*w1*0.6).toFixed(1)} ${(c2[1]-ny1/L1*w1*0.6).toFixed(1)}
      ${(c1[0]-nx0/L0*w0*0.6).toFixed(1)} ${(c1[1]-ny0/L0*w0*0.6).toFixed(1)}
      ${b0x.toFixed(1)} ${b0y.toFixed(1)} Z`;
  return `<path class="brush-fill ${cls||''}" d="${d}"/>`;
}

/* Một bông hoa đào 5 cánh — cánh TÔ son nhạt + viền + nhụy */
function peachBloom(cx, cy, r, full) {
  const petals = [90, 162, 234, 306, 18].map(a => {
    const rad = a * Math.PI / 180;
    const tx = Math.cos(rad) * r, ty = -Math.sin(rad) * r;
    const lrad1 = (a - 32) * Math.PI / 180, lrad2 = (a + 32) * Math.PI / 180;
    const c1x = Math.cos(lrad1) * r * 0.95, c1y = -Math.sin(lrad1) * r * 0.95;
    const c2x = Math.cos(lrad2) * r * 0.95, c2y = -Math.sin(lrad2) * r * 0.95;
    const d = `M0 0 Q ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)} Q ${c2x.toFixed(1)} ${c2y.toFixed(1)} 0 0 Z`;
    // cánh tô son rất nhạt + viền mảnh → có "thịt" hoa
    return `<path d="${d}" style="fill:rgba(181,54,42,0.16);stroke:rgba(150,40,32,0.5);stroke-width:1.2;vector-effect:non-scaling-stroke"/>`;
  }).join("");
  const stamens = full ? [70,90,110,130,160].map(a=>{
    const rad=a*Math.PI/180, sx=Math.cos(rad)*r*0.5, sy=-Math.sin(rad)*r*0.5;
    return `<line class="ink-stroke faint" x1="0" y1="0" x2="${sx.toFixed(1)}" y2="${sy.toFixed(1)}"/><circle class="seal-fill" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="1.1"/>`;
  }).join("") : "";
  return `<g transform="translate(${cx} ${cy})">${petals}${stamens}<circle class="seal-fill" cx="0" cy="0" r="${(r*0.24).toFixed(1)}"/></g>`;
}

/* Cây đào CHỦ THỂ — thân/nhánh NÉT BÚT LÔNG (đậm gốc→thon ngọn),
   mảng tán hoa son loang phía sau, hoa son rõ, vài cánh rơi. */
function peachTree(x, y, h, cls) {
  // mỗi nhánh: [p0, c1, c2, p1, w0(gốc), w1(ngọn)] — toạ độ tương đối gốc
  const trunk = [[0,0],[10,-110],[12,-200],[40,-260], 11, 3.2];
  const limbs = [
    [[14,-150],[50,-160],[86,-160],[120,-168], 5, 2.0],   // nhánh phải giữa
    [[22,-205],[56,-224],[96,-222],[130,-244], 4.4, 1.8], // nhánh phải trên
    [[10,-110],[-24,-120],[-52,-116],[-82,-134], 5, 2.0], // nhánh trái
    [[30,-245],[40,-270],[54,-284],[50,-312], 3.6, 1.4],  // ngọn
  ];
  const blooms = [
    [40,-260,10,1],[26,-242,9,1],[50,-312,9,1],
    [120,-168,10,1],[96,-160,8,1],[130,-244,10,1],[110,-232,8,0],
    [-82,-134,9,1],[-54,-126,8,0],[-30,-118,8,1],
    [60,-198,8,0],[18,-180,8,1],[80,-150,7,0]
  ];
  // các cụm tán (mảng son loang mờ sau hoa) — tạo "khối hoa"
  const canopies = [[42,-262,40],[120,-200,46],[-50,-132,34],[40,-300,30]];
  const petalsFall = [[70,-90],[100,-60],[-40,-70],[140,-200]];
  return `<g transform="translate(${x} ${y})" class="${cls || ''}">
    <!-- mảng tán hoa loang (sau cùng) -->
    ${canopies.map(([cx,cy,r])=>
      `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${(r*0.8).toFixed(0)}"
         class="bleed-soft" style="fill:rgba(181,54,42,0.07)"/>`).join("")}
    <!-- gốc loang + rễ -->
    <path class="ink-wash w1 bleed-soft" d="M-30 8 C -16 -6 18 -6 32 6 C 18 14 -16 14 -30 8 Z"/>
    <!-- THÂN + NHÁNH nét bút lông -->
    ${brushStroke(trunk[0],trunk[1],trunk[2],trunk[3],trunk[4],trunk[5],'dry')}
    ${limbs.map(l=>brushStroke(l[0],l[1],l[2],l[3],l[4],l[5],'soft')).join("")}
    <!-- viền nhẹ chồng lên thân cho sắc nét -->
    <path class="ink-stroke" style="stroke-opacity:.5" d="M2 -4 C 12 -110 14 -200 40 -260"/>
    <!-- chồi nhỏ -->
    <path class="ink-stroke faint" d="M70 -200 l 10 -8 M-50 -126 l -8 -8 M100 -232 l 8 -10"/>
    <!-- hoa son -->
    ${blooms.map(([bx,by,br,f])=>peachBloom(bx,by,br,f)).join("")}
    <!-- vài cánh rơi quanh tán -->
    ${petalsFall.map(([px,py])=>`<path class="seal-fill" style="opacity:.5" d="M${px} ${py} q 5 -3 9 0 q -5 4 -9 0 Z"/>`).join("")}
  </g>`;
}

/* Vầng xuân mờ (mặt trời sương) — quầng loang nhiều lớp cho có "không khí" */
function sunDisc(x, y, r) {
  return `<g transform="translate(${x} ${y})">
    <circle cx="0" cy="0" r="${(r*3.0).toFixed(0)}" fill="url(#moonGlow)" opacity=".7"/>
    <circle cx="0" cy="0" r="${(r*2.0).toFixed(0)}" fill="url(#moonGlow)"/>
    <circle class="ink-stroke faint" cx="0" cy="0" r="${r}"/>
  </g>`;
}

/* Dải sương trắng vắt ngang — tách lớp gần/xa, trôi nhẹ.
   Vẽ bằng vạt mờ (mảng trắng mềm) + vài nét lượn. */
function mistBand(x, y, w, op) {
  const o = op == null ? 0.7 : op;
  return `<g class="mist" transform="translate(${x} ${y})" style="opacity:${o}">
    <path d="M0 0 Q ${w*0.25} -14 ${w*0.5} -2 Q ${w*0.78} 8 ${w} -4
             L ${w} 22 Q ${w*0.7} 34 ${w*0.45} 24 Q ${w*0.2} 16 0 26 Z"
          fill="rgba(248,247,243,0.82)"/>
    <path class="ink-stroke faint" style="stroke-opacity:.18" d="M${w*0.1} 6 Q ${w*0.4} -4 ${w*0.7} 6 Q ${w*0.88} 11 ${w} 6"/>
  </g>`;
}

/* Cánh đào RƠI — xoay & bay xuống (animation riêng từng cánh).
   Mỗi cánh là hình giọt, đặt rải trong vùng tán, lệch pha. */
function fallingPetalsSpring(o) {
  const seeds = [
    [980, 250, 0], [1060, 200, 1.4], [1130, 320, 2.6],
    [920, 360, 0.8], [1200, 280, 3.4], [1040, 440, 1.9], [1170, 420, 4.2],
  ];
  return seeds.map(([x, y, d]) => {
    const dur = (8 + (x % 5)).toFixed(1);
    const dx = (-20 - (x % 40)).toFixed(0);
    const dy = (110 + (y % 60)).toFixed(0);
    const rot = (260 + (x % 160)).toFixed(0);
    return `<g class="petal-fall" style="--pf-dur:${dur}s;--pf-delay:-${d}s;--pf-dx:${dx}px;--pf-dy:${dy}px;--pf-rot:${rot}deg">
      <path class="seal-fill" style="opacity:.55" transform="translate(${x} ${o+y})"
        d="M0 0 C 4 -2 6 -7 3 -11 C 1 -7 -2 -3 0 0 Z"/>
    </g>`;
  }).join("");
}

/* ---------- 5 ĐOẠN THEO MÙA (chủ thể dồn từ x ≥ SAFE_L) ---------- */

function segSpring(o) {   // Xuân — CÂY ĐÀO chủ thể, có CHIỀU SÂU & SỐNG ĐỘNG
  // Lớp lang xa→gần:  núi rất mờ → núi mờ → núi đậm → sương → cây đào → ghềnh/suối.
  // Sống động: sương trôi, suối gợn, hạc vỗ cánh, cánh đào rơi xoay.
  // Mọi vật ≥ SAFE_L(840), núi giữ trong khung (x+320×scale ≤ 1440).
  return `
    <!-- vầng xuân loang (sau núi) -->
    ${sunDisc(1300, o + 165, 34)}

    <!-- 3 lớp núi: rất xa-mờ → xa-mờ → gần-đậm (chiều sâu) -->
    ${mountain(900, o + 210, 1.65, 3, 'float-slow')}
    ${mountain(840, o + 285, 1.85, 3, 'mist')}
    ${mountain(1090, o + 250, 1.05, 3, 'float-slow')}
    ${mountain(880, o + 330, 1.5, 2, 'float-slow')}
    ${mountain(1080, o + 360, 1.0, 1)}

    <!-- dải sương trắng vắt ngang (tách lớp gần/xa), trôi nhẹ -->
    ${mistBand(SAFE_L + 10, o + 360, 560, 0.75)}
    ${mistBand(SAFE_L + 120, o + 470, 460, 0.55)}

    <!-- CÂY ĐÀO chủ thể, gốc trên ghềnh -->
    ${peachTree(1000, o + 700, 320, 'float-slow')}

    <!-- cánh đào rơi (xoay bay) -->
    ${fallingPetalsSpring(o)}

    <!-- ghềnh đá & mép nước dưới (gợn lăn tăn) -->
    ${rock(940, o + 728, 1.5)}
    ${rock(1190, o + 740, 1.1)}
    <g class="ripple-go">
      ${[706, 742].map((yy,i)=>
        `<path class="ink-stroke faint" style="stroke-opacity:${(0.4-i*0.12).toFixed(2)}" d="M${SAFE_L+20} ${o+yy} q 70 -12 140 0 t 140 0 t 140 0 t 120 0"/>`
      ).join("")}
    </g>

    <!-- đôi hạc xuân, vỗ cánh -->
    ${crane(1140, o + 150, 1.3, 'float-mid')}
    ${crane(1235, o + 220, 1.0, 'float-slow')}
  `;
}

function segSummer(o) {   // Hạ — đầm sen, mặt nước (nửa phải)
  return `
    ${ripples(o + 470, 4)}
    ${lotus(1060, o + 540, 1.9, 'float-mid')}
    ${lotus(1280, o + 600, 1.6, 'float-slow')}
    ${lotus(1020, o + 690, 1.4, 'float-slow')}
    ${rock(1300, o + 660, 1.0)}
    ${ripples(o + 720, 4)}
  `;
}

function segAutumn(o) {   // Thu — tre trúc, lá, sương (nửa phải)
  return `
    ${bamboo(920, o + 120, 560, 1.0, '')}
    ${bamboo(1000, o + 180, 480, 0.82, 'float-slow')}
    ${bamboo(1200, o + 110, 580, 1.05, '')}
    ${bamboo(1300, o + 180, 460, 0.8, 'float-slow')}
    ${rock(1120, o + 720, 1.2)}
    ${[ [960,180,18],[1120,300,-24],[1020,520,40],[1220,420,-12],[1140,640,28],[900,600,-34] ]
        .map(([x,y,r]) => leaf(x, o + y, r, 1.2)).join("")}
    <path class="ink-stroke faint" style="stroke-opacity:.22" d="M${SAFE_L} ${o+400} q 220 -20 440 0 t 440 0"/>
  `;
}

function segWinter(o) {   // Đông — núi tuyết, thông già, tĩnh (nửa phải)
  return `
    ${mountain(860, o + 360, 1.75, 3, 'float-slow')}
    ${mountain(1040, o + 320, 1.2, 2)}
    ${mountain(1220, o + 400, 0.7, 3, 'float-slow')}
    ${moon(1280, o + 150, 26)}
    ${pine(920, o + 560, 1.4, 'float-slow')}
    ${pine(1160, o + 600, 1.1)}
    ${rock(1080, o + 720, 1.1)}
    ${[560,640,720].map(yy=>
      `<path class="ink-stroke faint" style="stroke-opacity:.3" d="M${SAFE_L} ${o+yy} q 200 -22 400 0 t 400 0 t 200 0"/>`
    ).join("")}
  `;
}

function segSea(o, totalH) {  // Cửa biển — thuyền, sóng, đảo (nửa phải)
  return `
    <path class="ink-stroke faint" d="M${SAFE_L} ${o+300} L ${VIEW_W} ${o+300}"/>
    ${mountain(880, o + 230, 1.3, 3)}
    ${mountain(1200, o + 250, 0.75, 3)}
    ${boat(1040, o + 520, 1.7, 'float-mid')}
    ${boat(1260, o + 600, 1.2, 'float-slow')}
    ${boat(960, o + 650, 1.0, 'float-mid')}
    ${rock(1140, o + 700, 1.3)}
    ${[420,500,580,660,740].map((y,i)=>
      `<path class="ink-stroke faint" style="stroke-opacity:${(0.45-i*0.05).toFixed(2)}" d="M${SAFE_L+(i%2)*40} ${o+y} q 70 -16 140 0 t 140 0 t 140 0 t 140 0 t 140 0"/>`
    ).join("")}
  `;
}

/* Gợn nước ngang (Hạ) — nửa phải */
function ripples(y, n) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const yy = y + i * 26;
    out += `<path class="ink-stroke faint" style="stroke-opacity:${(0.4 - i*0.06).toFixed(2)}"
      d="M${SAFE_L + (i%2)*40} ${yy} q 60 -12 120 0 t 120 0 t 120 0 t 120 0 t 120 0"/>`;
  }
  return out;
}

/* ---------- DỰNG CUỘN TRANH (1 ẢNH DỌC DÀI) ----------
   Dùng 1 bức tranh thủy mặc dọc. #sceneScroll cao N×100vh; ảnh là 1 phần tử
   <img> phủ TRỌN chiều cao đó (cao = N×100vh, rộng auto theo tỉ lệ, neo PHẢI
   để tránh trống đồng bên trái). Camera trượt translateY(-current×100vh) →
   thấy cuộn dọc liên tục qua tranh (mỗi slide một đoạn).
   Màng giấy dó + fade mép trái để hòa vào nền. ĐỂ THAY: đổi BG_IMAGE.src.       */
function renderScenes(sceneLayer) {
  const n = MEMBERS.length;

  // #sceneScroll giờ chỉ là khung 1 viewport (KHÔNG còn cao N×100vh).
  // Ảnh cuộn dọc BÊN TRONG bằng biến --bg-shift do main.js đặt theo slide.
  const scroll = document.createElement("div");
  scroll.id = "sceneScroll";
  scroll.style.height = "100vh";
  scroll.dataset.segments = String(n);   // main.js đọc để chia bước cuộn

  scroll.innerHTML = `
    <div class="scene-longwrap">
      <img class="scene-long" src="${BG_IMAGE.src}" alt="" draggable="false"
           onload="window.__onSceneImg && window.__onSceneImg(this)"/>
    </div>
    <div class="scene-veil scene-veil--long"></div>
  `;
  sceneLayer.appendChild(scroll);
}
