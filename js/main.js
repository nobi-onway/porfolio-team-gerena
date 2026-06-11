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
  document.body.classList.add("is-intro");

  const TURN = 1250;      // thời gian một lần chuyển (khớp transition #cardTrack & #sceneScroll)
  const REVEAL_AT = 620;  // khi track đã trượt ~1/2 thì nội dung card mới bắt đầu hiện ra (stagger)

  function updateIndicators() {
    applyBgShift(current);
    setHeaderMember(current);
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

  /* ---- Particles vàng bay lên từ chữ highlight ở intro ---- */
  (function initIntroParticles() {
    const introCard = cards[0];
    const canvas = introCard.querySelector(".intro-particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const GOLD = [236, 197, 151];
    let particles = [];
    let raf = null;
    let running = false;

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
        size: Math.random() * 2.5 + 0.8,
      });
    }

    let frame = 0;
    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frame % 4 === 0) {
        const rects = getRects();
        spawn(rects);
        if (Math.random() < 0.4) spawn(rects); // burst thêm
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy -= 0.02; // gia tốc nhẹ lên trên
        p.life -= 0.018;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const alpha = p.life * 0.85;
        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${GOLD},${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD},${alpha})`;
        ctx.fill();
        ctx.restore();
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Quan sát body.is-intro để start/stop
    const observer = new MutationObserver(() => {
      document.body.classList.contains("is-intro") ? start() : stop();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", () => { if (running) resize(); });
  })();

  /* ---- Khởi tạo (track đã ở vị trí 0 = INTRO) ---- */
  function init() {
    dots[0].classList.add("active");
    memberRole.textContent = "TEAM PORTFOLIO";
    typeName("Thiên Di Studio");
    curIdx.textContent = "01";
    progressBar.style.height = (1 / SLIDES_COUNT) * 100 + "%";
    document.getElementById("curtain").classList.add("gone");
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
    // Mèo chibi (vàng)
    `<svg viewBox="0 0 28 28" width="28" fill="none"><path d="M6 18 Q6 10 14 9 Q22 10 22 18 Q22 23 14 25 Q6 23 6 18Z" stroke="#C8AA6E" stroke-width="1.4"/><path d="M8 12 L6 5 L12 10" stroke="#C8AA6E" stroke-width="1.2"/><path d="M20 12 L22 5 L16 10" stroke="#C8AA6E" stroke-width="1.2"/><circle cx="11" cy="16" r="1.5" fill="#C8AA6E"/><circle cx="17" cy="16" r="1.5" fill="#C8AA6E"/><path d="M12 20 L14 21.5 L16 20" stroke="#C8AA6E" stroke-width="1"/><line x1="6" y1="18" x2="11" y2="17.5" stroke="#C8AA6E" stroke-width="0.8" opacity="0.7"/><line x1="17" y1="17.5" x2="22" y2="18" stroke="#C8AA6E" stroke-width="0.8" opacity="0.7"/></svg>`,
    // Thỏ chibi (teal)
    `<svg viewBox="0 0 28 28" width="28" fill="none"><path d="M8 13 Q6 4 8 2 Q10 1 11 13" stroke="#0BC4C2" stroke-width="1.3"/><path d="M20 13 Q22 4 20 2 Q18 1 17 13" stroke="#0BC4C2" stroke-width="1.3"/><circle cx="14" cy="19" r="7" stroke="#0BC4C2" stroke-width="1.4"/><circle cx="11" cy="17.5" r="1.3" fill="#0BC4C2"/><circle cx="17" cy="17.5" r="1.3" fill="#0BC4C2"/><circle cx="14" cy="21" r="1.1" fill="#BE1E37"/><circle cx="22" cy="22" r="2.2" stroke="#0BC4C2" stroke-width="1"/></svg>`,
    // Rồng chibi (đỏ)
    `<svg viewBox="0 0 28 28" width="28" fill="none"><path d="M5 16 Q4 8 14 7 Q24 8 24 15 Q24 20 18 22 L14 27 L10 22 Q5 20 5 16Z" stroke="#BE1E37" stroke-width="1.4"/><path d="M7 12 Q2 8 4 5 Q7 10 9 11" stroke="#BE1E37" stroke-width="1.2"/><path d="M21 12 Q26 8 24 5 Q21 10 19 11" stroke="#BE1E37" stroke-width="1.2"/><circle cx="18" cy="12" r="1.6" fill="#C8AA6E"/><path d="M5 18 Q2 16 1 18 Q3 20.5 5 18Z" stroke="#C8AA6E" stroke-width="1"/><circle cx="11" cy="4" r="1" fill="#BE1E37"/><circle cx="17" cy="4" r="1" fill="#BE1E37"/></svg>`,
    // Nấm chibi (đỏ + vàng)
    `<svg viewBox="0 0 28 28" width="28" fill="none"><path d="M3 15 Q2 4 14 3 Q26 4 25 15 Z" stroke="#BE1E37" stroke-width="1.4"/><rect x="8" y="15" width="12" height="10" rx="3" stroke="#C8AA6E" stroke-width="1.3"/><circle cx="10" cy="10" r="1.6" fill="#C8AA6E" opacity="0.9"/><circle cx="17" cy="8" r="1.8" fill="#C8AA6E" opacity="0.9"/><circle cx="13" cy="13" r="1.2" fill="#C8AA6E" opacity="0.8"/><path d="M10 20 Q14 22 18 20" stroke="#C8AA6E" stroke-width="0.9"/></svg>`,
    // Pháp sư chibi (vàng + teal)
    `<svg viewBox="0 0 28 28" width="28" fill="none"><path d="M9 14 L14 2 L19 14 Z" stroke="#C8AA6E" stroke-width="1.3"/><path d="M5 14 Q14 17 23 14" stroke="#C8AA6E" stroke-width="1.3"/><circle cx="14" cy="19" r="4.5" stroke="#C8AA6E" stroke-width="1.2"/><circle cx="12" cy="18" r="1" fill="#C8AA6E"/><circle cx="16" cy="18" r="1" fill="#C8AA6E"/><path d="M8 24 L6 28" stroke="#0BC4C2" stroke-width="1.3"/><path d="M20 24 L22 28" stroke="#0BC4C2" stroke-width="1.3"/><path d="M8 24 Q14 27 20 24" stroke="#0BC4C2" stroke-width="1.3"/><line x1="22" y1="16" x2="26" y2="26" stroke="#BE1E37" stroke-width="1.4" stroke-linecap="round"/><circle cx="22" cy="14" r="2.2" stroke="#BE1E37" stroke-width="1.1"/></svg>`,
    // Chiến binh chibi (vàng + đỏ)
    `<svg viewBox="0 0 28 28" width="28" fill="none"><path d="M9 11 Q9 4 14 3 Q19 4 19 11 Q19 14 14 15 Q9 14 9 11Z" stroke="#C8AA6E" stroke-width="1.3"/><path d="M6 15 L5 24 L23 24 L22 15 Z" stroke="#C8AA6E" stroke-width="1.2"/><path d="M5 17 Q2 15 2 19 Q2 23 6 23" stroke="#BE1E37" stroke-width="1.2"/><line x1="22" y1="13" x2="27" y2="22" stroke="#C8AA6E" stroke-width="1.6" stroke-linecap="round"/><line x1="20.5" y1="14.5" x2="24.5" y2="12" stroke="#C8AA6E" stroke-width="1.2"/><line x1="7" y1="24" x2="6" y2="28" stroke="#C8AA6E" stroke-width="1.2"/><line x1="21" y1="24" x2="22" y2="28" stroke="#C8AA6E" stroke-width="1.2"/></svg>`,
    // Ngôi sao (vàng)
    `<svg viewBox="0 0 28 28" width="28" fill="none"><path d="M14 2 L17 10 L26 10 L19 15.5 L22 24 L14 18.5 L6 24 L9 15.5 L2 10 L11 10 Z" stroke="#C8AA6E" stroke-width="1.4"/></svg>`,
    // Chim Lạc chibi (teal)
    `<svg viewBox="0 0 28 28" width="28" fill="none"><ellipse cx="14" cy="18" rx="7" ry="5" stroke="#0BC4C2" stroke-width="1.4"/><circle cx="14" cy="10" r="4" stroke="#0BC4C2" stroke-width="1.3"/><path d="M7 15 Q1 12 3 9 Q5 13 8 14" stroke="#0BC4C2" stroke-width="1.2"/><path d="M21 15 Q27 12 25 9 Q23 13 20 14" stroke="#0BC4C2" stroke-width="1.2"/><circle cx="15.5" cy="9" r="1.2" fill="#0BC4C2"/><path d="M16.5 10 L20 11" stroke="#C8AA6E" stroke-width="1.1" stroke-linecap="round"/><line x1="10" y1="23" x2="8" y2="27" stroke="#0BC4C2" stroke-width="1.2"/><line x1="18" y1="23" x2="20" y2="27" stroke="#0BC4C2" stroke-width="1.2"/></svg>`,
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
    const size = 20 + Math.random() * 16;
    p.style.width = size + "px";
    inner.firstChild.setAttribute("width", size);
    inner.firstChild.setAttribute("height", size);
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
