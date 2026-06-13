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
  name: "THIÊN DI",
  sub: "GAME STUDIO",
  // Câu hook lớn trên slide mở đầu
  hook: "CHÚNG TÔI LÀ",
  // Tagline duy nhất của intro — các <em> sẽ có particle bay lên
  taglineHTML:
    'Một <em class="tagline-em">team sáng tạo</em> thuần Việt — ' +
    'nơi <em class="tagline-em">nghệ thuật</em> ' +
    'gặp <em class="tagline-em">công nghệ game</em>.',
  // [CẬP NHẬT] Ảnh hoạt động/hậu trường của team — hiện dạng cụm polaroid.
  //   Thả file vào thư mục img/ rồi khai báo { src, caption } ở đây.
  //   Khuyến nghị 3–4 ảnh, ngang (tỉ lệ ~4:3) cho đẹp.
  //   Để mảng RỖNG [] → tự hiển thị 3 tranh khắc đồng placeholder.
  photos: [
    // { src: "img/team-1.jpg", caption: "Brainstorm ý tưởng" },
    // { src: "img/team-2.jpg", caption: "Dựng prototype" },
    // { src: "img/team-3.jpg", caption: "Playtest nội bộ" },
  ],
};

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

/* ---- "Chúng tôi đã chuẩn bị những gì" — KHO ĐỒ mang vào Game Jam ----
   Hiển thị như túi đồ RPG: lưới ô slot (trái) + bảng mô tả món (phải).
   icon: "engine" | "art" | "team" | "core" | "flow" | "spirit"
   [CẬP NHẬT] name / status / desc bằng thực tế của team. */
const ARSENAL = [
  {
    icon: "engine", name: "Engine & Công Nghệ", en: "ENGINE", status: "ĐÃ SẴN SÀNG",
    desc: "Unity + C#, project template & pipeline build dựng sẵn — vào jam là code ngay, " +
      "không tốn thời gian set-up. [CẬP NHẬT]",
  },
  {
    icon: "art", name: "Pipeline Mỹ Thuật", en: "ART PIPELINE", status: "ĐÃ SẴN SÀNG",
    desc: "Style guide thống nhất + quy trình asset 2D. Art ra nhanh, đồng bộ, " +
      "không tắc giữa jam. [CẬP NHẬT]",
  },
  {
    icon: "team", name: "Đội Ngũ Đủ Vai", en: "FULL SQUAD", status: "ĐÃ SẴN SÀNG",
    desc: "Design · Art · Code phối hợp ăn ý. Mỗi người một mảng, " +
      "không chồng chéo, không khoảng trống. [CẬP NHẬT]",
  },
  {
    icon: "core", name: "Cơ Chế Lõi", en: "CORE SYSTEM", status: "ĐÃ SẴN SÀNG",
    desc: "Bộ system tái sử dụng: input, state machine, spawn, UI cơ bản... " +
      "cắm vào là chạy, dồn sức cho cơ chế mới. [CẬP NHẬT]",
  },
  {
    icon: "flow", name: "Quy Trình Làm Việc", en: "WORKFLOW", status: "ĐÃ SẴN SÀNG",
    desc: "Chia task, build mỗi ngày, retro nhanh. Giữ nhịp ổn định " +
      "suốt thời gian jam. [CẬP NHẬT]",
  },
  {
    icon: "spirit", name: "Tinh Thần", en: "SPIRIT", status: "MÁU LỬA",
    desc: "Làm hết mình, không bỏ cuộc giữa chừng. Vui là chính, " +
      "nhưng đã làm là làm tới cùng. [CẬP NHẬT]",
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

