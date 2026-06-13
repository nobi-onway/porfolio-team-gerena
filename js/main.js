/* =========================================================
   MAIN — điều hướng, gesture, hiệu ứng, khởi động
   Phụ thuộc:
     - SLIDE_META, renderSlides, renderDrum (render.js)
     - renderScenes (scenery.js)
========================================================= */
(function () {
  "use strict";

  /* ---- Dựng nền cuộn dọc ---- */
  const sceneLayer = document.getElementById("sceneLayer");
  renderScenes(sceneLayer);
  const sceneScroll = document.getElementById("sceneScroll");
  const sceneImg = sceneScroll.querySelector(".scene-long");

  // Slide hiện tại — khai báo TRƯỚC measureScene() vì được gọi ngay bên dưới
  let current = 0;
  let animating = false;

  // Tổng quãng cuộn nền = (chiều cao nền render - 1 viewport),
  // chia đều cho (n-1) bước slide → slide cuối chạm đáy.
  let bgTravel = 0;
  function measureScene() {
    const imgH = sceneImg.getBoundingClientRect().height;
    const viewH = window.innerHeight;
    bgTravel = Math.max(0, imgH - viewH);
    applyBgShift(current);
  }
  function applyBgShift(idx) {
    const segs = SLIDE_META.length || 1;
    const t = segs > 1 ? idx / (segs - 1) : 0;
    sceneImg.style.setProperty("--bg-shift", (-bgTravel * t).toFixed(1) + "px");
  }
  // ảnh nền load xong (hoặc đã cache) → đo; và đo lại khi resize
  window.__onSceneImg = measureScene;
  if (sceneImg.complete) measureScene();
  window.addEventListener("resize", measureScene);

  /* ---- Dựng trống đồng lớn (nền, tâm giữa cạnh trái) ---- */
  const drumLayer = document.getElementById("drumLayer");
  renderDrum(drumLayer);
  const drum = drumLayer.querySelector(".dongson-drum");
  const DRUM_STEP = 60;        // mỗi transition xoay thêm 60°
  let drumRot = 0;

  /* ---- Dựng track slide + nav dots ---- */
  const stage = document.getElementById("stage");
  const navDots = document.getElementById("navDots");
  renderSlides(stage, navDots, goTo);
  const cardTrack = document.getElementById("cardTrack");
  const cards = [...cardTrack.querySelectorAll(".member-card")];
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

  // Tiêu đề slide trên header: chữ cũ fade out → chữ mới gõ ra từng ký tự
  let switchTimer = null;
  const STROKE_GAP = 80;      // ms giữa các ký tự
  function typeName(text) {
    memberName.classList.remove("is-switching");
    memberName.innerHTML = "";
    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "name-char";
      s.textContent = ch === " " ? " " : ch;
      s.style.animationDelay = (i * STROKE_GAP) + "ms";
      memberName.appendChild(s);
    });
  }
  function setHeaderSlide(idx) {
    clearTimeout(switchTimer);
    memberName.classList.add("is-switching");
    memberRole.style.opacity = "0";
    switchTimer = setTimeout(() => {
      const meta = SLIDE_META[idx] || SLIDE_META[0];
      memberRole.textContent = meta.sub;
      // Slide 0: logo lớn đã có tên team → header không lặp lại
      typeName(idx === 0 ? "" : meta.title);
      memberRole.style.opacity = "";
    }, 360);                  // khớp transition fade-out 0.35s
  }

  document.body.classList.add("is-intro");

  const TURN = 1250;      // thời gian một lần chuyển (khớp transition CSS)
  const REVEAL_AT = 620;  // track trượt ~1/2 thì nội dung slide mới hiện ra

  /* ---- FOCUS ĐỘNG: decor bừng lên khi chuyển slide, dịu dần NGAY khi
     track dừng chuyển động (không đợi đọc xong). Bừng = transition nhanh,
     dịu = transition chậm (xem CSS .is-reading). */
  const CALM_AT = TURN;          // đúng lúc track dừng
  let readTimer = null;
  function wakeDecor(delay) {
    document.body.classList.remove("is-reading");
    clearTimeout(readTimer);
    readTimer = setTimeout(
      () => document.body.classList.add("is-reading"),
      delay != null ? delay : CALM_AT
    );
  }

  function updateIndicators() {
    applyBgShift(current);
    setHeaderSlide(current);
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
    curIdx.textContent = String(current + 1).padStart(2, "0");
    progressBar.style.height = ((current + 1) / SLIDES_COUNT) * 100 + "%";
    document.body.classList.toggle("is-intro", current === 0);
  }

  function goTo(idx) {
    if (animating || idx === current) return;
    idx = Math.max(0, Math.min(SLIDES_COUNT - 1, idx));
    if (idx === current) return;
    const prev = current;
    current = idx;
    animating = true;

    const dir = idx > prev ? 1 : -1;

    cards[prev].classList.remove("active");
    cardTrack.style.transform = `translateY(-${current * 100}vh)`;
    drumRot += (dir * DRUM_STEP);
    drum.style.setProperty("--drum-rot", drumRot + "deg");
    wakeDecor();
    updateIndicators();

    setTimeout(() => { cards[current].classList.add("active"); }, REVEAL_AT);
    setTimeout(() => { animating = false; }, TURN);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* =========================================================
     PAGER SẢN PHẨM (slide Stage Select)
  ========================================================= */
  document.addEventListener("click", (e) => {
    const stageEl = e.target.closest(".prod-stage");
    if (!stageEl) return;
    const goBtn = e.target.closest("[data-prod-go]");
    const prevBtn = e.target.closest("[data-prod-prev]");
    const nextBtn = e.target.closest("[data-prod-next]");
    if (!goBtn && !prevBtn && !nextBtn) return;
    e.preventDefault();
    const slides = [...stageEl.querySelectorAll(".prod-slide")];
    const pagerDots = [...stageEl.querySelectorAll(".prod-pager__dot")];
    const total = slides.length;
    if (total === 0) return;
    let target = Number(stageEl.dataset.prodCurrent || 0);
    if (goBtn) target = Number(goBtn.dataset.prodGo);
    if (prevBtn) target = (target - 1 + total) % total;
    if (nextBtn) target = (target + 1) % total;
    setActiveProduct(stageEl, slides, pagerDots, target);
  });
  function setActiveProduct(stageEl, slides, pagerDots, idx) {
    stageEl.dataset.prodCurrent = String(idx);
    slides.forEach((s, i) => {
      const on = i === idx;
      s.setAttribute("aria-hidden", on ? "false" : "true");
      s.classList.toggle("is-active", on);
    });
    pagerDots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    // hiệu ứng quét ngang khi đổi stage
    stageEl.classList.remove("is-switching");
    void stageEl.offsetWidth;
    stageEl.classList.add("is-switching");
    setTimeout(() => stageEl.classList.remove("is-switching"), 420);
  }

  /* ---- Pixel vàng bay lên từ chữ highlight ở title screen ---- */
  (function initIntroParticles() {
    const introCard = cards[0];
    const canvas = introCard.querySelector(".intro-particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const GOLD = [200, 170, 110];
    let particles = [];
    let raf = null;
    let running = false;
    let startTimer = null;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function getRects() {
      const cardRect = canvas.getBoundingClientRect();
      return [...introCard.querySelectorAll(".tagline-em")].map(el => {
        const r = el.getBoundingClientRect();
        return { x: r.left - cardRect.left, y: r.top - cardRect.top, w: r.width, h: r.height };
      });
    }

    function spawn(rects) {
      if (!rects.length) return;
      const rect = rects[Math.floor(Math.random() * rects.length)];
      particles.push({
        x: rect.x + Math.random() * rect.w,
        y: rect.y + rect.h * 0.4 + Math.random() * rect.h * 0.4,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 1.8 + 0.4),
        life: 1,
        size: Math.random() * 3 + 2,
      });
    }

    let frame = 0;
    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frame % 4 === 0) {
        const rects = getRects();
        spawn(rects);
        if (Math.random() < 0.4) spawn(rects);
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy -= 0.02;
        p.life -= 0.018;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        // pixel vuông flat (arcade) — không glow
        const s = Math.max(1, p.size * p.life);
        ctx.fillStyle = `rgba(${GOLD},${(p.life * 0.85).toFixed(3)})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.round(s), Math.round(s));
      }
      frame++;
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      resize();
      particles = [];
      running = true;
      loop();
    }
    function stop() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (startTimer) { clearTimeout(startTimer); startTimer = null; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Delay khớp thời điểm tagline hiện ra (fx-rise --d:0.95s + 0.9s)
    const TAGLINE_DELAY = 1700;
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("is-intro")) {
        startTimer = setTimeout(start, TAGLINE_DELAY);
      } else {
        stop();
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    startTimer = setTimeout(start, TAGLINE_DELAY + 800);   // lần đầu vào trang

    window.addEventListener("resize", () => { if (running) resize(); });
  })();

  /* ---- Quest log: highlight node + blob xuất hiện/biến mất theo node ----
     Chỉ chạy khi slide quy trình đang .active; dừng & dọn khi rời slide.
     Mỗi node có blob riêng (góc top-right); .is-cur bật → node sáng + blob
     bung ra (CSS), tick sau .is-cur chuyển node → blob node cũ biến mất. */
  (function initQuestPlayhead() {
    const card = cards.find((c) => c.classList.contains("member-card--process"));
    if (!card) return;
    const nodes = [...card.querySelectorAll(".qm-node")];
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ENTER_DELAY = 1500;   // chờ animation xuất hiện (fx-pop) chạy xong
    const STEP_MS = 2800;       // mỗi node sáng bao lâu trước khi chuyển node kế
    let startTimer = null, tickTimer = null, idx = 0;

    function light(i) {
      nodes.forEach((n, k) => n.classList.toggle("is-cur", k === i));
    }

    function start() {
      stop();
      idx = 0;
      startTimer = setTimeout(() => {
        light(idx);
        tickTimer = setInterval(() => {
          idx = (idx + 1) % nodes.length;
          light(idx);
        }, STEP_MS);
      }, ENTER_DELAY);
    }

    function stop() {
      clearTimeout(startTimer);
      clearInterval(tickTimer);
      startTimer = tickTimer = null;
      nodes.forEach((n) => n.classList.remove("is-cur"));
    }

    const obs = new MutationObserver(() => {
      card.classList.contains("active") ? start() : stop();
    });
    obs.observe(card, { attributes: true, attributeFilter: ["class"] });
    if (card.classList.contains("active")) start();
  })();

  /* ---- Khởi tạo (track ở vị trí 0 = TITLE SCREEN) ---- */
  function init() {
    dots[0].classList.add("active");
    memberRole.textContent = SLIDE_META[0].sub;
    typeName("");
    curIdx.textContent = "01";
    progressBar.style.height = (1 / SLIDES_COUNT) * 100 + "%";
    document.getElementById("curtain").classList.add("gone");
    requestAnimationFrame(() => cards[0].classList.add("active"));
    wakeDecor(1600);   // lần đầu vào trang: dịu sau khi hook hiện xong
  }

  /* =========================================================
     GESTURE: WHEEL / TOUCH / KEYBOARD
  ========================================================= */
  let wheelLock = false;
  window.addEventListener("wheel", (e) => {
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
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    e.preventDefault();
  }, { passive: false });
  window.addEventListener("touchend", (e) => {
    if (touchStartY === null) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50) dy > 0 ? next() : prev();
    touchStartY = null;
  }, { passive: true });

  // Keyboard
  window.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
    if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
    if (e.key === "Home") goTo(0);
    if (e.key === "End") goTo(SLIDES_COUNT - 1);
  });

  /* =========================================================
     ICON GAME RƠI (petals) — controller / D-pad / sao / chim Lạc
  ========================================================= */
  const petalLayer = document.getElementById("petals");
  const PETAL_SHAPES = [
    // Nút tròn controller ○ (đỏ son)
    `<svg viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="9" fill="none" stroke="#BE1E37" stroke-width="3"/><circle cx="12" cy="12" r="4" fill="#BE1E37"/></svg>`,
    // Dấu × bold (vàng đồng)
    `<svg viewBox="0 0 24 24" width="24"><line x1="4" y1="4" x2="20" y2="20" stroke="#C8AA6E" stroke-width="4" stroke-linecap="square"/><line x1="20" y1="4" x2="4" y2="20" stroke="#C8AA6E" stroke-width="4" stroke-linecap="square"/></svg>`,
    // Diamond ◆ (vàng đồng)
    `<svg viewBox="0 0 24 24" width="24"><polygon points="12,2 22,12 12,22 2,12" fill="#C8AA6E"/></svg>`,
    // Mũi tên ▶ (đỏ son)
    `<svg viewBox="0 0 24 24" width="24"><polygon points="4,3 20,12 4,21" fill="#BE1E37"/></svg>`,
    // Pixel coin (vàng đồng, lỗ vuông)
    `<svg viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="10" fill="#C8AA6E"/><rect x="9" y="9" width="6" height="6" fill="#000"/></svg>`,
    // Ngôi sao ★ (vàng đồng)
    `<svg viewBox="0 0 24 24" width="24"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#C8AA6E"/></svg>`,
    // Pixel heart (đỏ son)
    `<svg viewBox="0 0 24 24" width="24"><path d="M4 6 h5 v3 h6 V6 h5 v6 h-3 v3 h-3 v3 h-4 v-3 H7 v-3 H4 Z" fill="#BE1E37"/></svg>`,
    // D-pad cross (đỏ son)
    `<svg viewBox="0 0 24 24" width="24"><rect x="8" y="2" width="8" height="20" rx="1" fill="#BE1E37"/><rect x="2" y="8" width="20" height="8" rx="1" fill="#BE1E37"/></svg>`,
    // Chim Lạc (vàng đồng) — chất liệu Việt
    `<svg viewBox="-16 -12 36 20" width="24"><path d="M -14 3 Q -8 0 -3 0 Q 1 -6 8 -8 L 5 -2 Q 12 -4 18 -8 Q 16 -1 8 2 Q 1 4 -4 3 Q -9 7 -14 3 Z" fill="#C8AA6E"/></svg>`,
  ];
  const petals = [];   // {el, fall, wx, wy} — el là lớp ngoài nhận gió
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    const inner = document.createElement("span");
    inner.className = "petal-fall";
    inner.innerHTML = PETAL_SHAPES[i % PETAL_SHAPES.length];
    p.appendChild(inner);
    p.style.left = Math.random() * 100 + "%";
    const dur = 9 + Math.random() * 9;
    inner.style.animationDuration = dur + "s";
    inner.style.animationDelay = -(Math.random() * dur) + "s";
    inner.style.setProperty("--drift", (Math.random() * 120 - 30) + "px");
    const size = 20 + Math.random() * 16;
    p.style.width = size + "px";
    inner.firstChild.setAttribute("width", size);
    inner.firstChild.setAttribute("height", size);
    petalLayer.appendChild(p);
    petals.push({ el: p, fall: inner, wx: 0, wy: 0 });
  }

  /* =========================================================
     GIÓ THEO CON TRỎ: vệt mực + đẩy icon rơi ở gần
  ========================================================= */
  let mx = -9999, my = -9999;
  let mvx = 0, mvy = 0;
  let lastMx = 0, lastMy = 0;
  let windActive = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const windTrail = document.getElementById("windTrail");
  const windGrad = document.getElementById("windFade");
  const TRAIL = [];
  const TRAIL_MAX = 20;
  const TRAIL_MIN_DIST = 6;
  const TRAIL_HEAD_W = 9;

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

  // Dựng path ribbon thuôn từ TRAIL: rộng 0 ở đuôi → TRAIL_HEAD_W ở đầu
  function buildTrailPath() {
    const n = TRAIL.length;
    if (n < 3) return "";
    const top = [], bot = [];
    for (let i = 0; i < n; i++) {
      const p = TRAIL[i];
      const a = TRAIL[Math.max(0, i - 1)];
      const b = TRAIL[Math.min(n - 1, i + 1)];
      let tx = b.x - a.x, ty = b.y - a.y;
      const tl = Math.hypot(tx, ty) || 1;
      const nx = -ty / tl, ny = tx / tl;
      const t = i / (n - 1);
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
    if (!windActive || Math.hypot(mvx, mvy) < 0.3) {
      if (TRAIL.length > 0 && Math.random() < 0.55) TRAIL.shift();
    }
    const d = buildTrailPath();
    windTrail.setAttribute("d", d);
    if (d && TRAIL.length >= 2) {
      const tail = TRAIL[0], head = TRAIL[TRAIL.length - 1];
      windGrad.setAttribute("x1", tail.x); windGrad.setAttribute("y1", tail.y);
      windGrad.setAttribute("x2", head.x); windGrad.setAttribute("y2", head.y);
    }
  }

  const WIND_RADIUS = 130;
  const WIND_PUSH = 30;
  const WIND_MAX = 140;
  const WIND_EASE = 0.12;
  const WIND_RETURN = 0.92;

  function segInfo(px, py, ax, ay, bx, by) {
    const abx = bx - ax, aby = by - ay;
    const len2 = abx * abx + aby * aby || 1;
    let t = ((px - ax) * abx + (py - ay) * aby) / len2;
    t = Math.max(0, Math.min(1, t));
    const qx = ax + abx * t, qy = ay + aby * t;
    return { dist: Math.hypot(px - qx, py - qy), abx, aby };
  }

  function windLoop() {
    mvx *= 0.85; mvy *= 0.85;
    const n = TRAIL.length;

    for (const pt of petals) {
      let tx = 0, ty = 0;
      if (n >= 2) {
        const r = pt.fall.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let best = WIND_RADIUS, bdx = 0, bdy = 0, bi = 0;
        for (let i = 0; i < n - 1; i++) {
          const a = TRAIL[i], b = TRAIL[i + 1];
          const info = segInfo(cx, cy, a.x, a.y, b.x, b.y);
          if (info.dist < best) {
            best = info.dist; bdx = info.abx; bdy = info.aby; bi = i;
          }
        }
        if (best < WIND_RADIUS) {
          const falloff = 1 - best / WIND_RADIUS;
          const fresh = (bi + 1) / n;
          const tl = Math.hypot(bdx, bdy) || 1;
          const force = WIND_PUSH * falloff * falloff * (0.4 + 0.6 * fresh);
          tx = (bdx / tl) * force;
          ty = (bdy / tl) * force;
          tx = Math.max(-WIND_MAX, Math.min(WIND_MAX, tx));
          ty = Math.max(-WIND_MAX, Math.min(WIND_MAX, ty));
        }
      }
      pt.wx += (tx - pt.wx) * WIND_EASE;
      pt.wy += (ty - pt.wy) * WIND_EASE;
      pt.wx *= WIND_RETURN;
      pt.wy *= WIND_RETURN;
      if (Math.abs(pt.wx) > 0.1 || Math.abs(pt.wy) > 0.1) {
        pt.el.style.setProperty("--wind-x", pt.wx.toFixed(1) + "px");
        pt.el.style.setProperty("--wind-y", pt.wy.toFixed(1) + "px");
      }
    }
    renderTrail();
    requestAnimationFrame(windLoop);
  }
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
