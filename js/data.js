/* =========================================================
   DỮ LIỆU NỘI DUNG — THIÊN DI STUDIO
   Cấu trúc 3 slide:
     · TITLE SCREEN  — giới thiệu team + đội hình (TEAM, MEMBERS)
     · STAGE SELECT  — sản phẩm của team (PRODUCTS)
     · QUEST LOG     — quy trình & cách giải quyết vấn đề (PROCESS)

   ⚠ Các chỗ đánh dấu [CẬP NHẬT] là placeholder — thay bằng
     dữ liệu thật của team trước khi publish.
========================================================= */

const TEAM = {
  name: "THIÊN DI",
  sub: "GAME STUDIO",
  year: "2026",
  // Tagline trên title screen — các <em> sẽ có particle bay lên
  taglineHTML:
    'Một <em class="tagline-em" style="--em-delay:0.3s">team sáng tạo</em> thuần Việt — ' +
    'nơi <em class="tagline-em" style="--em-delay:0.8s">nghệ thuật</em> ' +
    'gặp <em class="tagline-em" style="--em-delay:1.3s">công nghệ game</em>.',
  // Đoạn giới thiệu ngắn về team [CẬP NHẬT]
  intro:
    "Thiên Di là một nhóm 5 người làm game tại Việt Nam: thiết kế, lập trình và mỹ thuật " +
    "cùng ngồi chung một bàn. Chúng tôi tin rằng game hay bắt đầu từ một vòng lặp vui — " +
    "và mọi thứ còn lại được xây quanh nó.",
};

/* ---- Đội hình — hiển thị dạng PLAYER SELECT trên title screen ---- */
const MEMBERS = [
  { name: "Phạm Hùng Thiên",        role: "Game Designer",  roleVi: "Thiết Kế Game",  accent: "#C8AA6E" },
  { name: "Đoàn Gia Bảo",           role: "Game Developer", roleVi: "Lập Trình Game", accent: "#BE1E37" },
  { name: "Vũ Đình Khoa",           role: "Game Developer", roleVi: "Lập Trình Game", accent: "#C8AA6E" },
  { name: "Nguyễn Trần Thanh Hằng", role: "Game Artist",    roleVi: "Họa Sĩ Game",    accent: "#BE1E37" },
  { name: "Lê Trúc Giang",          role: "Game Artist",    roleVi: "Họa Sĩ Game",    accent: "#C8AA6E" },
];

/* ---- Sản phẩm — mỗi item là 1 "STAGE" trong slide Sản Phẩm ----
   cover: "mountain" | "boat" | "birds" (tranh khắc đồng vẽ bằng SVG)
   [CẬP NHẬT] title / desc / tags / status / metric bằng dự án thật. */
const PRODUCTS = [
  {
    title: "Dự Án I",
    type: "Casual · Mobile",
    year: "2025",
    status: "ĐANG PHÁT TRIỂN",
    cover: "mountain",
    desc:
      "Game casual lấy cảm hứng từ văn hóa dân gian Việt Nam. " +
      "Vòng lặp nhặt – ghép – mở khóa, chơi một tay, mỗi phiên 2–3 phút. [CẬP NHẬT]",
    tags: ["Unity", "C#", "2D"],
    metric: "Prototype hoàn thành sau 2 tuần — đang playtest nội bộ.",
  },
  {
    title: "Dự Án II",
    type: "Puzzle · PC",
    year: "2025",
    status: "PROTOTYPE",
    cover: "boat",
    desc:
      "Puzzle kể chuyện theo từng màn, mỗi màn là một bức tranh khắc gỗ sống dậy. " +
      "Cơ chế xoay – ghép mảnh tranh để mở đường đi. [CẬP NHẬT]",
    tags: ["Godot", "Pixel Art"],
    metric: "Top 10 game jam nội bộ — bản mở rộng đang thiết kế.",
  },
  {
    title: "Dự Án III",
    type: "Arcade · Web",
    year: "2026",
    status: "Ý TƯỞNG",
    cover: "birds",
    desc:
      "Arcade phản xạ nhịp nhanh trên trình duyệt, điều khiển đàn chim Lạc " +
      "băng qua chướng ngại theo nhịp trống. [CẬP NHẬT]",
    tags: ["Web", "Canvas", "Chiptune"],
    metric: "Đang dựng bản chơi thử đầu tiên.",
  },
];

/* ---- Quy trình — pipeline 6 bước, hiển thị như bản đồ màn chơi ---- */
const PROCESS_STEPS = [
  {
    num: "01", title: "Ý Tưởng", en: "BRAINSTORM",
    desc: "Mỗi ý tưởng phải trả lời được: vòng lặp vui ở đâu? Cả team pitch, bỏ phiếu, chọn 1.",
  },
  {
    num: "02", title: "Thiết Kế", en: "DESIGN DOC",
    desc: "Designer viết doc 1 trang: cơ chế lõi, phạm vi, mục tiêu playtest. Không quá 1 trang.",
  },
  {
    num: "03", title: "Prototype", en: "GREYBOX",
    desc: "Developer dựng bản chơi được trong 1–2 tuần bằng khối xám. Vui thì đi tiếp, không vui thì bỏ.",
  },
  {
    num: "04", title: "Mỹ Thuật", en: "ART PASS",
    desc: "Artist khoá art style bằng 1 màn hình mẫu, rồi phủ art lên prototype theo từng lớp.",
  },
  {
    num: "05", title: "Playtest", en: "ITERATE",
    desc: "Cho người ngoài team chơi mỗi tuần. Ghi lại chỗ người chơi kẹt, sửa, lặp lại.",
  },
  {
    num: "06", title: "Hoàn Thiện", en: "SHIP IT",
    desc: "Khoá tính năng, chỉ sửa lỗi và polish: âm thanh, juice, màn hình đầu – cuối. Rồi phát hành.",
  },
];

/* ---- Cách team giải quyết vấn đề — 3 nguyên tắc ---- */
const PROCESS_LOOP = [
  {
    icon: "play",
    title: "Chơi được trước, đẹp sau",
    desc: "Mọi tranh luận về tính năng đều giải quyết bằng một bản chơi thử, không bằng lời nói.",
  },
  {
    icon: "loop",
    title: "Vòng lặp ngắn",
    desc: "Build mỗi tuần. Vấn đề lớn được cắt thành mục tiêu 5 ngày — sai thì chỉ mất 1 tuần.",
  },
  {
    icon: "flag",
    title: "Retro sau mỗi bản build",
    desc: "30 phút: cái gì ổn, cái gì hỏng, đổi gì ở vòng sau. Quy trình cũng được patch như game.",
  },
];

/* ---- Pose nét đứt — dáng đứng theo role (dùng cho PLAYER SELECT) ---- */
const POSES = {
  developer: `
    <circle cx="50" cy="22" r="11"/>
    <path d="M50 33 L50 82"/>
    <path d="M50 44 L30 60 L38 66"/>
    <path d="M50 44 L70 60 L62 66"/>
    <path d="M50 82 L38 122 L34 134"/>
    <path d="M50 82 L62 122 L66 134"/>
    <path d="M30 60 L70 60"/>
  `,
  designer: `
    <circle cx="46" cy="22" r="11"/>
    <path d="M48 33 L52 82"/>
    <path d="M50 46 L72 40 L78 30"/>
    <path d="M49 46 L30 64 L34 74"/>
    <path d="M52 82 L40 122 L36 134"/>
    <path d="M52 82 L64 120 L70 132"/>
    <path d="M40 30 Q50 24 60 30"/>
  `,
  artist: `
    <circle cx="52" cy="22" r="11"/>
    <path d="M52 33 L48 82"/>
    <path d="M50 45 L74 30 L80 18"/>
    <path d="M50 47 L28 58 L24 70"/>
    <path d="M48 82 L34 120 L28 132"/>
    <path d="M48 82 L60 122 L66 134"/>
    <polyline points="80,18 84,12 82,8"/>
  `,
};
