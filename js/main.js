/* =========================================================
   MAIN — điều hướng, gesture, hiệu ứng, khởi động
   Phụ thuộc:
     - MEMBERS (data.js)
     - renderScenes (scenery.js)
     - renderMembers (render.js)
========================================================= */
(function () {
  "use strict";

  /* ---- Dựng cuộn tranh dọc (1 ảnh dài) ---- */
  const sceneLayer = document.getElementById("sceneLayer");
  renderScenes(sceneLayer);
  const sceneScroll = document.getElementById("sceneScroll");
  const sceneImg = sceneScroll.querySelector(".scene-long");

  // Tổng quãng cuộn ảnh = (chiều cao ảnh render - 1 viewport).
  // Chia đều cho (n-1) bước slide → slide cuối chạm đáy tranh.
  let bgTravel = 0;   // px ảnh phải dịch giữa slide 0 và slide cuối
  function measureScene() {
    const imgH = sceneImg.getBoundingClientRect().height;   // cao thật sau khi fit rộng
    const viewH = window.innerHeight;
    bgTravel = Math.max(0, imgH - viewH);
    if (typeof current !== "undefined") applyBgShift(current);   // đặt lại vị trí theo slide hiện tại
  }
  function applyBgShift(idx) {
    const segs = (typeof SLIDES_COUNT === "number" && SLIDES_COUNT) || 1;
    const t = segs > 1 ? idx / (segs - 1) : 0;
    sceneImg.style.setProperty("--bg-shift", (-bgTravel * t).toFixed(1) + "px");
  }
  // ảnh load xong (hoặc đã cache) → đo; và đo lại khi resize
  window.__onSceneImg = measureScene;
  if (sceneImg.complete) measureScene();
  window.addEventListener("resize", measureScene);

  /* ---- Dựng trống đồng lớn (nền, tâm giữa cạnh trái) ---- */
  const drumLayer = document.getElementById("drumLayer");
  renderDrum(drumLayer);
  const drum = drumLayer.querySelector(".dongson-drum");
  const DRUM_STEP = 60;        // mỗi transition xoay thêm 60°
  let drumRot = 0;

  /* ---- Dựng track card + nav dots ---- */
  const stage = document.getElementById("stage");
  const navDots = document.getElementById("navDots");
  renderMembers(stage, navDots, goTo);
  const cardTrack = document.getElementById("cardTrack");
  const cards = [...cardTrack.querySelectorAll(".member-card")];

  // Tổng số slide = intro + thành viên. Dùng SLIDES_COUNT thay cho MEMBERS.length
  // ở mọi chỗ liên quan đến điều hướng (slide index 0 = intro, 1..N = members).
  const SLIDES_COUNT = cards.length;

  document.getElementById("totalIdx").textContent =
    String(SLIDES_COUNT).padStart(2, "0");

  /* =========================================================
     ĐIỀU HƯỚNG + TRANSITION (MORPH: dịch track)
  ========================================================= */
  const dots = [...document.querySelectorAll(".nav-dot")];
  const progressBar = document.getElementById("progressBar");
  const curIdx = document.getElementById("curIdx");
  const memberName = document.getElementById("memberName");
  const memberRole = document.getElementById("memberRole");

  // Đổi tên + vai trò trên header:
  //  - tên cũ FADE OUT, rồi tên mới được GÕ RA từng ký tự (typing)
  //  - role FADE đồng bộ
  // Viết tên ra MỀM MẠI: mỗi ký tự là 1 span, hiện dần (mờ→rõ + nét bút)
  // với độ trễ tăng dần → chữ "chảy ra" như đang viết, không bật cứng.
  let switchTimer = null;     // timeout chờ fade-out
  const STROKE_GAP = 80;      // ms giữa các nét chữ (lớn hơn = viết chậm/êm hơn)
  function typeName(text) {
    memberName.classList.remove("is-switching");
    // dựng từng ký tự thành span (khoảng trắng dùng   để không sập)
    memberName.innerHTML = "";
    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "name-char";
      s.textContent = ch === " " ? " " : ch;
      s.style.animationDelay = (i * STROKE_GAP) + "ms";
      memberName.appendChild(s);
    });
  }
  function setHeaderMember(idx) {
    clearTimeout(switchTimer);
    memberName.classList.add("is-switching");        // fade out tên cũ
    memberRole.style.opacity = "0";
    switchTimer = setTimeout(() => {
      if (idx === 0) {
        // Slide intro: header hiện tên team thay vì 1 thành viên
        memberRole.textContent = "TEAM PORTFOLIO";
        typeName("Thiên Di Studio");
      } else {
        const m = MEMBERS[idx - 1];                  // members shift +1 do intro chiếm idx 0
        memberRole.textContent = m.roleVi.toUpperCase();
        typeName(m.name);
      }
      memberRole.style.opacity = "";
    }, 360);                                         // khớp transition fade-out 0.35s
  }

  let current = 0;
  let animating = false;

  const TURN = 1250;      // thời gian một lần chuyển (khớp transition #cardTrack & #sceneScroll)
  const REVEAL_AT = 620;  // khi track đã trượt ~1/2 thì nội dung card mới bắt đầu hiện ra (stagger)

  function updateIndicators() {
    applyBgShift(current);                 // cuộn ảnh nền dọc theo slide
    setHeaderMember(current);              // tên + vai trò lên header
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
    curIdx.textContent = String(current + 1).padStart(2, "0");
    progressBar.style.height = ((current + 1) / SLIDES_COUNT) * 100 + "%";
  }

  function goTo(idx) {
    if (animating || idx === current) return;
    idx = Math.max(0, Math.min(SLIDES_COUNT - 1, idx));
    if (idx === current) return;
    const prev = current;
    current = idx;
    animating = true;

    const dir = idx > prev ? 1 : -1;

    // Card cũ rời active ngay → nội dung của nó "thu lại" khi trượt đi
    cards[prev].classList.remove("active");

    // MORPH: trượt cả track card liền mạch (cũ ra, mới vào — không fade)
    cardTrack.style.transform = `translateY(-${current * 100}vh)`;
    // Trống đồng xoay đồng bộ
    drumRot += (dir * DRUM_STEP);
    drum.style.setProperty("--drum-rot", drumRot + "deg");
    updateIndicators();

    // Card mới nhận active khi track gần tới nơi → nội dung lần lượt "đáp xuống"
    setTimeout(() => { cards[current].classList.add("active"); }, REVEAL_AT);

    setTimeout(() => { animating = false; }, TURN);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* =========================================================
     MODAL CỘT MỐC — click triện trên dải ngang để xem chi tiết
  ========================================================= */
  const msModal = document.getElementById("msModal");
  const msYearEl = document.getElementById("msModalYear");
  const msTitleEl = document.getElementById("msModalTitle");
  const msDetailEl = document.getElementById("msModalDetail");
  let lastFocusedBeforeModal = null;
  function modalIsOpen() {
    return msModal.classList.contains("is-open");
  }
  function openMilestoneModal(memberIdx, milestoneIdx, triggerEl) {
    const m = MEMBERS[memberIdx];
    if (!m || !m.milestones || !m.milestones[milestoneIdx]) return;
    const ms = m.milestones[milestoneIdx];
    msYearEl.textContent = ms.year;
    msTitleEl.textContent = ms.event;
    msDetailEl.textContent = ms.detail || "";
    lastFocusedBeforeModal = triggerEl || document.activeElement;
    msModal.classList.add("is-open");
    msModal.setAttribute("aria-hidden", "false");
    // chuyển focus vào nút đóng để hỗ trợ bàn phím / screen reader
    requestAnimationFrame(() => {
      const closeBtn = msModal.querySelector(".ms-modal__close");
      if (closeBtn) closeBtn.focus();
    });
  }
  function closeMilestoneModal() {
    if (!modalIsOpen()) return;
    msModal.classList.remove("is-open");
    msModal.setAttribute("aria-hidden", "true");
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
      lastFocusedBeforeModal.focus();
    }
    lastFocusedBeforeModal = null;
  }
  // Delegated click — nút .js-ms-open có thể nằm trong bất kỳ card nào
  document.addEventListener("click", (e) => {
    const opener = e.target.closest(".js-ms-open");
    if (opener) {
      e.preventDefault();
      const mi = Number(opener.dataset.member);
      const ms = Number(opener.dataset.milestone);
      openMilestoneModal(mi, ms, opener);
      return;
    }
    if (e.target.closest("[data-ms-close]")) {
      e.preventDefault();
      closeMilestoneModal();
    }
    // ===== Pager SẢN PHẨM (layout v2) =====
    const stage = e.target.closest(".prod-stage");
    if (!stage) return;
    const goBtn = e.target.closest("[data-prod-go]");
    const prevBtn = e.target.closest("[data-prod-prev]");
    const nextBtn = e.target.closest("[data-prod-next]");
    if (!goBtn && !prevBtn && !nextBtn) return;
    e.preventDefault();
    const slides = [...stage.querySelectorAll(".prod-slide")];
    const dots = [...stage.querySelectorAll(".prod-pager__dot")];
    const total = slides.length;
    if (total === 0) return;
    let next = Number(stage.dataset.prodCurrent || 0);
    if (goBtn) next = Number(goBtn.dataset.prodGo);
    if (prevBtn) next = (next - 1 + total) % total;
    if (nextBtn) next = (next + 1) % total;
    setActiveProduct(stage, slides, dots, next);
  });
  function setActiveProduct(stage, slides, dots, idx) {
    stage.dataset.prodCurrent = String(idx);
    slides.forEach((s, i) => {
      const on = i === idx;
      s.setAttribute("aria-hidden", on ? "false" : "true");
      s.classList.toggle("is-active", on);
    });
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    // hiệu ứng "quét bút lông": flash class ngắn rồi remove
    stage.classList.remove("is-switching");
    void stage.offsetWidth;
    stage.classList.add("is-switching");
    setTimeout(() => stage.classList.remove("is-switching"), 420);
  }

  /* ---- Khởi tạo (track đã ở vị trí 0 = INTRO) ---- */
  function init() {
    dots[0].classList.add("active");
    memberRole.textContent = "TEAM PORTFOLIO";
    typeName("Thiên Di Studio");                          // header intro
    curIdx.textContent = "01";
    progressBar.style.height = (1 / SLIDES_COUNT) * 100 + "%";
    document.getElementById("curtain").classList.add("gone");
    // kích hoạt card đầu sau khi màn mở → chạy animation xuất hiện lần đầu
    requestAnimationFrame(() => cards[0].classList.add("active"));
  }

  /* =========================================================
     GESTURE: WHEEL / TOUCH / KEYBOARD
  ========================================================= */
  let wheelLock = false;
  window.addEventListener("wheel", (e) => {
    // Modal mở → cho phép cuộn nội dung modal, không chặn, không chuyển slide
    if (modalIsOpen()) return;
    e.preventDefault();
    if (wheelLock || animating) return;
    if (Math.abs(e.deltaY) < 12) return;
    wheelLock = true;
    e.deltaY > 0 ? next() : prev();
    setTimeout(() => (wheelLock = false), 1250);
  }, { passive: false });

  // Touch
  let touchStartY = null;
  window.addEventListener("touchstart", (e) => {
    if (modalIsOpen()) return;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (modalIsOpen()) return;          // modal mở → cho scroll bên trong
    e.preventDefault();
  }, { passive: false });
  window.addEventListener("touchend", (e) => {
    if (touchStartY === null) return;
    if (modalIsOpen()) { touchStartY = null; return; }
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50) dy > 0 ? next() : prev();
    touchStartY = null;
  }, { passive: true });

  // Keyboard
  window.addEventListener("keydown", (e) => {
    if (modalIsOpen()) {
      if (e.key === "Escape") { e.preventDefault(); closeMilestoneModal(); }
      return;                            // các phím điều hướng bị vô hiệu khi modal mở
    }
    if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
    if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
    if (e.key === "Home") goTo(0);
    if (e.key === "End") goTo(SLIDES_COUNT - 1);
  });

  /* =========================================================
     CÁNH HOA / LÁ RƠI (thay tro vàng)
  ========================================================= */
  const petalLayer = document.getElementById("petals");
  const PETAL_SHAPES = [
    // cánh hoa đào (ellipse khuyết)
    '<svg viewBox="0 0 20 20"><path d="M10 2 C 14 4, 16 9, 10 18 C 4 9, 6 4, 10 2 Z" fill="rgba(181,54,42,0.45)"/></svg>',
    // lá tre
    '<svg viewBox="0 0 24 12"><path d="M1 6 Q 12 -2, 23 6 Q 12 10, 1 6 Z" fill="rgba(28,26,23,0.30)"/></svg>',
    // cánh sen nhạt
    '<svg viewBox="0 0 20 20"><path d="M10 2 C 15 5, 16 12, 10 18 C 4 12, 5 5, 10 2 Z" fill="rgba(181,54,42,0.28)"/></svg>',
  ];
  const petals = [];   // {el, wx, wy} — el là .petal (lớp ngoài nhận gió)
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    // lớp trong giữ animation rơi; lớp ngoài nhận offset gió
    const inner = document.createElement("span");
    inner.className = "petal-fall";
    inner.innerHTML = PETAL_SHAPES[i % PETAL_SHAPES.length];
    p.appendChild(inner);
    p.style.left = Math.random() * 100 + "%";
    const dur = 9 + Math.random() * 9;
    inner.style.animationDuration = dur + "s";
    inner.style.animationDelay = -(Math.random() * dur) + "s";
    inner.style.setProperty("--drift", (Math.random() * 120 - 30) + "px");
    const size = 10 + Math.random() * 12;
    p.style.width = size + "px";
    inner.firstChild.setAttribute("width", size);
    petalLayer.appendChild(p);
    // el = lớp ngoài (áp gió); fall = lớp trong (vị trí RƠI thật để đo)
    petals.push({ el: p, fall: inner, wx: 0, wy: 0 });
  }

  /* =========================================================
     GIÓ THEO CON TRỎ: chuột di chuyển → đẩy cánh hoa ở gần
       - lưu vị trí + vận tốc chuột mỗi lần mousemove
       - mỗi frame: hoa trong bán kính bị thổi theo hướng chuột,
         lực ~ (tốc độ chuột) × (độ gần). Sau đó hồi về 0 (đàn hồi).
  ========================================================= */
  let mx = -9999, my = -9999;   // vị trí chuột
  let mvx = 0, mvy = 0;         // vận tốc chuột (px/move)
  let lastMx = 0, lastMy = 0;
  let windActive = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- TRAIL gió: 1 đường liền bám con trỏ, thuôn dần & tan ở đuôi ---- */
  const windTrail = document.getElementById("windTrail");
  const windGrad  = document.getElementById("windFade");
  const TRAIL = [];                 // [{x, y}] mới nhất ở CUỐI mảng
  const TRAIL_MAX = 20;             // số điểm giữ lại (đuôi dài ~ chừng này)
  const TRAIL_MIN_DIST = 6;         // px tối thiểu giữa 2 điểm (lọc nhiễu)
  const TRAIL_HEAD_W = 9;           // bề rộng tối đa ở ĐẦU (px) — nét mực dày hơn

  window.addEventListener("mousemove", (e) => {
    if (windActive) { mvx = e.clientX - lastMx; mvy = e.clientY - lastMy; }
    lastMx = e.clientX; lastMy = e.clientY;
    mx = e.clientX; my = e.clientY;
    windActive = true;
    if (reducedMotion) return;
    const last = TRAIL[TRAIL.length - 1];
    if (!last || Math.hypot(e.clientX - last.x, e.clientY - last.y) >= TRAIL_MIN_DIST) {
      TRAIL.push({ x: e.clientX, y: e.clientY });
      if (TRAIL.length > TRAIL_MAX) TRAIL.shift();
    }
  });
  window.addEventListener("mouseleave", () => { windActive = false; mx = my = -9999; });

  // Dựng path ribbon thuôn từ TRAIL: đi dọc 1 biên rồi vòng lại biên kia.
  // Bề rộng = 0 ở đuôi (cũ) → TRAIL_HEAD_W ở đầu (mới) → cảm giác nét bút lông.
  function buildTrailPath() {
    const n = TRAIL.length;
    if (n < 3) return "";
    const top = [], bot = [];
    for (let i = 0; i < n; i++) {
      const p = TRAIL[i];
      // hướng pháp tuyến tại điểm i (vuông góc tiếp tuyến)
      const a = TRAIL[Math.max(0, i - 1)];
      const b = TRAIL[Math.min(n - 1, i + 1)];
      let tx = b.x - a.x, ty = b.y - a.y;
      const tl = Math.hypot(tx, ty) || 1;
      const nx = -ty / tl, ny = tx / tl;           // pháp tuyến đơn vị
      const t = i / (n - 1);                        // 0 đuôi … 1 đầu
      // thuôn: nhọn ở đuôi, phình dần về đầu, hơi thon lại ngay mũi.
      // + nhấp nhô nhẹ dọc nét (phình–thóp) như mực loãng đậm-nhạt không đều.
      const ripple = 0.78 + 0.22 * Math.sin(i * 1.7 + p.x * 0.012);
      const w = TRAIL_HEAD_W * Math.pow(t, 0.7) * (1 - 0.18 * Math.pow(1 - t, 2)) * ripple;
      top.push([p.x + nx * w * 0.5, p.y + ny * w * 0.5]);
      bot.push([p.x - nx * w * 0.5, p.y - ny * w * 0.5]);
    }
    let d = `M ${top[0][0].toFixed(1)} ${top[0][1].toFixed(1)}`;
    for (let i = 1; i < n; i++) d += ` L ${top[i][0].toFixed(1)} ${top[i][1].toFixed(1)}`;
    for (let i = n - 1; i >= 0; i--) d += ` L ${bot[i][0].toFixed(1)} ${bot[i][1].toFixed(1)}`;
    return d + " Z";
  }

  function renderTrail() {
    // chuột ngừng di → đuôi mực co lại DẦN (chậm) cho cảm giác mực còn ướt
    if (!windActive || Math.hypot(mvx, mvy) < 0.3) {
      if (TRAIL.length > 0 && Math.random() < 0.55) TRAIL.shift();
    }
    const d = buildTrailPath();
    windTrail.setAttribute("d", d);
    if (d && TRAIL.length >= 2) {
      // gradient chạy dọc trục đuôi→đầu (mờ→rõ)
      const tail = TRAIL[0], head = TRAIL[TRAIL.length - 1];
      windGrad.setAttribute("x1", tail.x); windGrad.setAttribute("y1", tail.y);
      windGrad.setAttribute("x2", head.x); windGrad.setAttribute("y2", head.y);
    }
  }

  const WIND_RADIUS = 130;   // bán kính ảnh hưởng quanh ĐƯỜNG trail (px)
  const WIND_PUSH   = 30;    // hệ số lực cuốn theo nét mực
  const WIND_MAX    = 140;   // giới hạn lệch tối đa (px)
  const WIND_EASE    = 0.12; // tốc độ tiến tới mục tiêu
  const WIND_RETURN  = 0.92; // hệ số hồi về 0 khi hết gió

  // Khoảng cách + hình chiếu từ điểm P tới đoạn AB → trả {dist, t}
  function segInfo(px, py, ax, ay, bx, by) {
    const abx = bx - ax, aby = by - ay;
    const len2 = abx * abx + aby * aby || 1;
    let t = ((px - ax) * abx + (py - ay) * aby) / len2;
    t = Math.max(0, Math.min(1, t));
    const qx = ax + abx * t, qy = ay + aby * t;
    return { dist: Math.hypot(px - qx, py - qy), abx, aby };
  }

  function windLoop() {
    // vận tốc chuột phân rã dần (chỉ để biết trail còn "sống")
    mvx *= 0.85; mvy *= 0.85;
    const n = TRAIL.length;

    for (const pt of petals) {
      let tx = 0, ty = 0;
      if (n >= 2) {
        // đo lớp TRONG (.petal-fall) vì đó là nơi cánh hoa thật sự rơi tới
        const r = pt.fall.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // tìm đoạn trail GẦN NHẤT với cánh hoa
        let best = WIND_RADIUS, bdx = 0, bdy = 0, bi = 0;
        for (let i = 0; i < n - 1; i++) {
          const a = TRAIL[i], b = TRAIL[i + 1];
          const info = segInfo(cx, cy, a.x, a.y, b.x, b.y);
          if (info.dist < best) {
            best = info.dist; bdx = info.abx; bdy = info.aby; bi = i;
          }
        }
        if (best < WIND_RADIUS) {
          const falloff = 1 - best / WIND_RADIUS;        // 0..1, gần nét = mạnh
          const fresh = (bi + 1) / n;                    // đoạn mới (gần đầu) mạnh hơn
          const tl = Math.hypot(bdx, bdy) || 1;
          // CUỐN hoa theo HƯỚNG nét mực (tiếp tuyến của trail)
          const force = WIND_PUSH * falloff * falloff * (0.4 + 0.6 * fresh);
          tx = (bdx / tl) * force;
          ty = (bdy / tl) * force;
          tx = Math.max(-WIND_MAX, Math.min(WIND_MAX, tx));
          ty = Math.max(-WIND_MAX, Math.min(WIND_MAX, ty));
        }
      }
      // tiến tới mục tiêu, rồi đàn hồi về 0
      pt.wx += (tx - pt.wx) * WIND_EASE;
      pt.wy += (ty - pt.wy) * WIND_EASE;
      pt.wx *= WIND_RETURN;
      pt.wy *= WIND_RETURN;
      if (Math.abs(pt.wx) > 0.1 || Math.abs(pt.wy) > 0.1) {
        pt.el.style.setProperty("--wind-x", pt.wx.toFixed(1) + "px");
        pt.el.style.setProperty("--wind-y", pt.wy.toFixed(1) + "px");
      }
    }
    renderTrail();                 // vẽ lại trail mực mỗi frame
    requestAnimationFrame(windLoop);
  }
  // tôn trọng prefers-reduced-motion: không chạy gió
  if (!reducedMotion) {
    requestAnimationFrame(windLoop);
  }

  /* =========================================================
     BOOT
  ========================================================= */
  window.addEventListener("load", () => {
    setTimeout(init, 600);
  });
})();
