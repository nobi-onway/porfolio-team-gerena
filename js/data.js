/* =========================================================
   DỮ LIỆU NỘI DUNG — THIÊN DI STUDIO
   Cấu trúc 3 slide:
     · HOOK          — "CHÚNG TÔI LÀ" + tagline + showreel (TEAM)
     · STAGE SELECT  — sản phẩm của team (PRODUCTS)
     · QUEST LOG     — quy trình & cách giải quyết vấn đề (PROCESS)

   ⚠ Các chỗ đánh dấu [CẬP NHẬT] là placeholder — thay bằng
     dữ liệu thật của team trước khi publish.
========================================================= */

const TEAM = {
  name: "THIEN DI",
  sub: "GAME STUDIO",
  // Câu hook lớn trên slide mở đầu
  hook: "WE ARE",
  // Tagline duy nhất của intro — các <em> sẽ có particle bay lên
  taglineHTML:
    'A Vietnamese <em class="tagline-em">creative team</em> where ' +
    '<em class="tagline-em">art</em> meets ' +
    '<em class="tagline-em">game technology</em>.',
  // [CẬP NHẬT] Ảnh hoạt động/hậu trường của team — hiện dạng cụm polaroid.
  //   Thả file vào thư mục img/ rồi khai báo { src, caption } ở đây.
  //   Khuyến nghị 3–4 ảnh, ngang (tỉ lệ ~4:3) cho đẹp.
  //   Để mảng RỖNG [] → tự hiển thị 3 tranh khắc đồng placeholder.
  photos: [
    // { src: "img/team-1.jpg", caption: "Idea brainstorm" },
    // { src: "img/team-2.jpg", caption: "Prototype build" },
    // { src: "img/team-3.jpg", caption: "Internal playtest" },
  ],
};

const GAME_ASSET_FILES = [
  "Under The Smile Demo.mp4",
  "Under The Smile Screenshot.jpg",
  "FEEL Demo.mp4",
  "FEEL Screenshot.jpg",
  "HoiQuan Demo.mp4",
  "HoiQuan Screenshot.jpg",
];

function gameAsset(gameName, kind) {
  const key = (gameName + " " + kind).toLowerCase().replace(/[^a-z0-9]+/g, "");
  const file = GAME_ASSET_FILES.find((name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "").includes(key)
  );
  return file ? "assets/" + file : "";
}

/* ---- Sản phẩm — mỗi item là 1 "STAGE" trong slide Sản Phẩm ----
   cover: "mountain" | "boat" | "birds" (tranh khắc đồng vẽ bằng SVG)
   [CẬP NHẬT] title / desc / tags / status / metric bằng dự án thật. */
const PRODUCTS = [
  {
    id: "self-under-the-smile",
    title: "Self: Under The Smile",
    type: "Puzzle Platformer · PC/Web",
    year: "2026",
    status: "COMPLETED DEMO",
    cover: "mountain",
    screenshot: gameAsset("Under The Smile", "Screenshot"),
    desc:
      "A mask-themed narrative puzzle platformer built for Global Game Jam Vietnam 2026.",
    tags: ["Unity", "C#", "Narrative", "Platformer"],
    metric: "Completed demo with playable memory chapters and a polished emotional hook.",
    modal: {
      rank: "STAGE: COMPLETED DEMO",
      repository: {
        label: "SOURCE CODE ACCESS",
        url: "https://github.com/vudkhoa/GlobalGameJam2026",
      },
      video: {
        kind: "video",
        src: gameAsset("Under The Smile", "Demo"),
        label: "MASK MEMORY DEMO",
        caption: "Gameplay showcase matched from assets/Under The Smile Demo.mp4.",
      },
      lore: {
        title: "QUEST DESCRIPTION",
        origin: "Born during the 48-hour challenge of Global Game Jam Vietnam 2026 under the official theme: MASK.",
        points: [
          "A weary clown earns a living from people's smiles while hiding deep cracks behind a joyful mask.",
          "Each day, he performs happiness to gain validation while concealing the fractures in his soul.",
          "Memory chapters confront two questions: Who am I? Why am I here?",
          "The journey chases recognition, love, and the courage to become authentically oneself.",
        ],
      },
      party: [
        { role: "[ARTIST]", name: "Hằng, Giang, Khuyên", contribution: "Built the clown memory visuals, mood boards, character reads, and emotional mask language." },
        { role: "[DEV]", name: "Khoa, Tấn, Bảo", contribution: "Implemented platforming, level flow, interaction triggers, build stability, and final demo packaging." },
        { role: "[DESIGNER]", name: "Thiên", contribution: "Shaped narrative beats, memory chapter pacing, puzzle readability, and supporting gameplay scripts." },
      ],
      rosterNote: "CURRENT ACTIVE SQUAD OVERLAP: Hằng, Giang, Khoa, Bảo, and Thiên are the core members representing the active Garena Game Jam lineup.",
    },
  },
  {
    id: "feel",
    title: "FEEL",
    type: "Arcade / Casual",
    year: "2025",
    status: "COMPLETED",
    cover: "boat",
    screenshot: gameAsset("FEEL", "Screenshot"),
    desc:
      "A completed arcade-casual jam game created for the official Gameloft Game Jam 2025.",
    tags: ["Arcade", "Casual", "Game Jam"],
    metric: "Completed competition build with concise arcade loops and fast onboarding.",
    modal: {
      rank: "STAGE: COMPLETED",
      repository: {
        label: "SOURCE CODE ACCESS",
        url: "https://github.com/vudkhoa/EmotionPuzzle.git",
      },
      video: {
        kind: "video",
        src: gameAsset("FEEL", "Demo"),
        label: "FEEL DEMO SIGNAL",
        caption: "Gameplay showcase matched from assets/FEEL Demo.mp4.",
      },
      lore: {
        title: "QUEST DESCRIPTION",
        origin: "Created for the official Gameloft Game Jam 2025 competition.",
        points: [
          "LOG_UNLOCKED: Diagnostic narrative array pending encryption.",
          "Arcade-first pacing keeps input, feedback, and replay cadence readable for judges.",
          "The project proves the team can finish a compact competition build under pressure.",
        ],
      },
      party: [
        { role: "[ARTIST]", name: "Hằng", contribution: "Produced the core visual pass, quick-read art language, and presentation-ready screenshots." },
        { role: "[DEV]", name: "Khoa, Thịnh", contribution: "Built gameplay implementation, arcade loop stability, interaction timing, and final competition packaging." },
      ],
      rosterNote: "CURRENT ACTIVE SQUAD OVERLAP: Hằng, Giang, Khoa, Bảo, and Thiên are the core members representing the active Garena Game Jam lineup.",
    },
  },
  {
    id: "hoi-quan",
    title: "Hồi Quan",
    type: "Strategy / Puzzle",
    year: "2025",
    status: "QUALIFIER DEMO",
    cover: "birds",
    screenshot: gameAsset("HoiQuan", "Screenshot"),
    desc:
      "A strategy-puzzle qualifier demo built specifically for the Gameloft Game Jam 2025 qualifying round.",
    tags: ["Strategy", "Puzzle", "Qualifier"],
    metric: "Qualifier-ready demo focused on tactical clarity, readable turns, and fast judge comprehension.",
    modal: {
      rank: "STAGE: QUALIFIER DEMO",
      repository: {
        label: "SOURCE CODE ACCESS",
        url: "https://github.com/vudkhoa/HoiQuan.git",
      },
      video: {
        kind: "video",
        src: gameAsset("HoiQuan", "Demo"),
        label: "HOI QUAN DEMO SIGNAL",
        caption: "Gameplay showcase matched from assets/HoiQuan Demo.mp4.",
      },
      lore: {
        title: "QUEST DESCRIPTION",
        origin: "Developed specifically for the Qualifying Round of the Gameloft Game Jam 2025.",
        points: [
          "LOG_UNLOCKED: Diagnostic narrative array pending encryption.",
          "Strategy-puzzle structure emphasizes tactical reads, decision pressure, and judge-friendly pacing.",
          "The qualifier demo shows the team can communicate systems quickly with limited runtime.",
        ],
      },
      party: [
        { role: "[ARTIST]", name: "Hằng", contribution: "Created the visual direction, tactical board readability, and qualifier presentation assets." },
        { role: "[DEV]", name: "Khoa, Thịnh", contribution: "Implemented core strategy interactions, puzzle flow, technical stability, and demo packaging." },
      ],
      rosterNote: "CURRENT ACTIVE SQUAD OVERLAP: Hằng, Giang, Khoa, Bảo, and Thiên are the core members representing the active Garena Game Jam lineup.",
    },
  },
];

/* ---- Quy trình — pipeline 6 bước, hiển thị như bản đồ màn chơi ---- */
const PROCESS_STEPS = [
  {
    num: "01", title: "Ideation", en: "BRAINSTORM",
    desc: "Every idea must answer one question: where is the fun loop? The whole team pitches, votes, and chooses one.",
  },
  {
    num: "02", title: "Design", en: "DESIGN DOC",
    desc: "The designer writes a one-page doc covering the core mechanic, scope, and playtest target. No more than one page.",
  },
  {
    num: "03", title: "Prototype", en: "GREYBOX",
    desc: "Developers build a playable greybox in 1-2 weeks. If it is fun, it moves forward. If not, it gets cut.",
  },
  {
    num: "04", title: "Art Pass", en: "ART PASS",
    desc: "Artists lock the style with one sample screen, then layer the final art over the prototype.",
  },
  {
    num: "05", title: "Playtest", en: "ITERATE",
    desc: "People outside the team play every week. We record where players get stuck, fix it, then repeat.",
  },
  {
    num: "06", title: "Polish", en: "SHIP IT",
    desc: "Feature lock, then focus on bugs and polish: sound, juice, intro, ending, and release readiness.",
  },
];

/* ---- "Chúng tôi đã chuẩn bị những gì" — KHO ĐỒ mang vào Game Jam ----
   Hiển thị như túi đồ RPG: lưới ô slot (trái) + bảng mô tả món (phải).
   icon: "engine" | "art" | "team" | "core" | "flow" | "spirit"
   [CẬP NHẬT] name / status / desc bằng thực tế của team. */
const ARSENAL = [
  {
    icon: "engine", name: "[Core Weapon] Permitted Boilerplate Core", en: "UTILITY ENGINE CONTROLLER", status: "LOCKED",
    desc: "Section 4.5-compliant utility core for Input, Saving, and Audio Config. Skips repetitive setup and unlocks gameplay coding from minute one.",
  },
  {
    icon: "art", name: "[Forge] Group A Visual Pipeline", en: "HUMAN-AUTHORED VISUAL PASS", status: "READY",
    desc: "Targets Score Level 4-5 and Best Art. Core Group A assets stay human-authored, backed by fast palettes, grids, and styling kits.",
  },
  {
    icon: "team", name: "[Roster] 5-Player Elite Party", en: "BALANCED SQUAD SYNERGY", status: "LOCKED",
    desc: "Hằng and Giang drive visuals; Bảo, Khoa, and Thiên cover dev, PM, and design. Git-ready lanes enable parallel execution.",
  },
  {
    icon: "core", name: "[Accessory] Juice & Polish Vault", en: "GAMEPLAY MECHANICS MODIFIER", status: "LOADED",
    desc: "Shaders, particles, and tween modules tuned for the 35% Gameplay score weight. Build one ships with screen shake and punchy feel.",
  },
  {
    icon: "flow", name: "[Strategy] 48H Sprint Milestones", en: "AGILE METAGAME", status: "READY",
    desc: "Aggressive scope gates lock greybox by Hour 6, then trigger internal playtests every 4 hours to crush bugs and polish UX loops early.",
  },
  {
    icon: "spirit", name: "[Elixir] Crisis Pivot Protocol", en: "CRITICAL RISK MITIGATION", status: "READY",
    desc: "Hard-gate crisis control: downscale features or pivot gameplay if the loop fails by Hour 24. Final objective: ship before cutoff.",
  },
];

/* ---- Cách team giải quyết vấn đề — 3 nguyên tắc ---- */
const PROCESS_LOOP = [
  {
    icon: "play",
    title: "Playable first, pretty later",
    desc: "Every feature debate is solved with a playable build, not a speech.",
  },
  {
    icon: "loop",
    title: "Short loops",
    desc: "Build every week. Big problems become five-day goals, so a wrong turn only costs one week.",
  },
  {
    icon: "flag",
    title: "Retro after each build",
    desc: "30 minutes: what worked, what broke, and what changes next. The workflow gets patched like the game.",
  },
];
