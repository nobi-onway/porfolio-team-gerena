/* =========================================================
   DỮ LIỆU NỘI DUNG — sửa thông tin thành viên TẠI ĐÂY
   (placeholder — thay nội dung thật sau)

   Mỗi thành viên có:
   - Thông tin chung: name, alias, role, roleVi, tagline, accent, skills
   - quote   : triết lý / phương châm làm nghề
   - projects: dự án tiêu biểu [{ name, role, year }]
   - meta    : 3 chỉ số tóm tắt nhanh [{ label, value }]
   - lore    : khối theo VAI TRÒ
       · Dev/Designer -> { kind:"craft", ... } (chuyên môn — lý trí)
       · Artist        -> { kind:"soul",  ... } (chất riêng — cảm xúc)

   GHI CHÚ: role hợp lệ để chọn pose = "Game Developer" | "Game Designer" | "Game Artist"
========================================================= */
const MEMBERS = [
  {
    name: "Lê Minh Quân",
    alias: "The Architect",
    role: "Game Developer",
    roleVi: "Lập Trình Game",
    tagline: "Kiến tạo cỗ máy vận hành thế giới ảo từ những dòng code mạch lạc.",
    accent: "#c0392b",
    skills: [
      { name: "Unity", slug: "unity", color: "000000" },
      { name: "C#", slug: "csharp", color: "512BD4" },
      { name: "Rider", slug: "rider", color: "000000" },
      { name: "Git", slug: "git", color: "F05032" },
    ],
    quote: "Code tốt là code mà người sau đọc không cần hỏi tôi một câu.",
    meta: [
      { label: "Kinh nghiệm", value: "7 năm" },
      { label: "Chuyên sâu", value: "Gameplay" },
      { label: "Cấp bậc", value: "Lead Dev" },
    ],
    lore: {
      kind: "craft",
      title: "Chuyên Môn",
      intro: "Người dựng nền móng kỹ thuật — biến thiết kế thành hệ thống chạy được, ổn định, mở rộng.",
      focus: [
        { k: "Kiến trúc", v: "ECS · State Machine · Networking" },
        { k: "Sở trường", v: "Tối ưu hiệu năng, gameplay nhiều người chơi" },
        { k: "Triết lý code", v: "Đơn giản hoá thay vì thông minh hoá" },
      ],
    },
    projects: [
      { name: "Huyền Sử Đại Việt", role: "Lead Developer", year: "2024" },
      { name: "Cờ Tướng Online", role: "Backend & Netcode", year: "2022" },
      { name: "Phá Trận", role: "Gameplay Programmer", year: "2020" },
    ],
  },
  {
    name: "Trần Hải Đăng",
    alias: "The Engineer",
    role: "Game Developer",
    roleVi: "Lập Trình Game",
    tagline: "Biến cơ chế phức tạp thành trải nghiệm mượt mà trong từng khung hình.",
    accent: "#9c6f15",
    skills: [
      { name: "Unreal Engine", slug: "unrealengine", color: "0E1128" },
      { name: "C++", slug: "cplusplus", color: "00599C" },
      { name: "Visual Studio", slug: "visualstudio", color: "5C2D91" },
      { name: "Git", slug: "git", color: "F05032" },
    ],
    quote: "Mỗi mili-giây trễ là một người chơi rời đi. Tôi săn từng mili-giây ấy.",
    meta: [
      { label: "Kinh nghiệm", value: "5 năm" },
      { label: "Chuyên sâu", value: "Engine/Tools" },
      { label: "Cấp bậc", value: "Senior Dev" },
    ],
    lore: {
      kind: "craft",
      title: "Chuyên Môn",
      intro: "Kỹ sư engine — làm công cụ cho cả team và mài giũa hiệu năng đến giới hạn phần cứng.",
      focus: [
        { k: "Kiến trúc", v: "Render pipeline · Tooling · Build system" },
        { k: "Sở trường", v: "Shader, profiling, tối ưu bộ nhớ" },
        { k: "Triết lý code", v: "Đo trước, đoán sau" },
      ],
    },
    projects: [
      { name: "Long Thần Tướng RPG", role: "Engine Programmer", year: "2025" },
      { name: "Bộ công cụ Pipeline nội bộ", role: "Tools Lead", year: "2023" },
      { name: "Đua Thuyền Rồng", role: "Graphics Programmer", year: "2021" },
    ],
  },
  {
    name: "Phạm Thu Hương",
    alias: "The Dreamweaver",
    role: "Game Designer",
    roleVi: "Thiết Kế Game",
    tagline: "Dệt nên luật chơi và cảm xúc, nơi mỗi quyết định đều có ý nghĩa.",
    accent: "#0f7a52",
    skills: [
      { name: "Figma", slug: "figma", color: "F24E1E" },
      { name: "Miro", slug: "miro", color: "FFF000" },
      { name: "Notion", slug: "notion", color: "000000" },
      { name: "Unity", slug: "unity", color: "000000" },
    ],
    quote: "Người chơi sẽ quên cơ chế, nhưng nhớ mãi cảm giác bạn tạo ra cho họ.",
    meta: [
      { label: "Kinh nghiệm", value: "6 năm" },
      { label: "Chuyên sâu", value: "Systems" },
      { label: "Cấp bậc", value: "Lead Designer" },
    ],
    lore: {
      kind: "craft",
      title: "Chuyên Môn",
      intro: "Người dệt luật chơi — cân bằng giữa thử thách và phần thưởng để giữ người chơi ở lại.",
      focus: [
        { k: "Thiết kế", v: "Game loop · Progression · Economy" },
        { k: "Sở trường", v: "Cân bằng hệ thống, kể chuyện qua màn chơi" },
        { k: "Triết lý", v: "Vui trước, đẹp sau, đủ thì dừng" },
      ],
    },
    projects: [
      { name: "Huyền Sử Đại Việt", role: "Lead Game Designer", year: "2024" },
      { name: "Truyền Thuyết Âu Lạc", role: "Systems Designer", year: "2022" },
      { name: "Ô Ăn Quan Mobile", role: "Game Designer", year: "2021" },
    ],
  },
  {
    name: "Vũ Anh Khoa",
    alias: "The Illustrator",
    role: "Game Artist",
    roleVi: "Họa Sĩ Game",
    tagline: "Thổi hồn Á Đông vào từng nét vẽ, dựng nên thế giới sống động.",
    accent: "#d4684a",
    skills: [
      { name: "Photoshop", icon: "ps", color: "31A8FF" },
      { name: "Figma", slug: "figma", color: "F24E1E" },
      { name: "Illustrator", icon: "ai", color: "FF9A00" },
      { name: "Spine", icon: "spine", color: "FF4000" },
      { name: "After Effects", icon: "ae", color: "9999FF" },
      { name: "Blender", slug: "blender", color: "F5792A" },
      { name: "Premiere", icon: "pr", color: "9999FF" },
    ],
    quote: "Tôi không vẽ nhân vật. Tôi vẽ câu chuyện mà nhân vật đó mang theo.",
    meta: [
      { label: "Kinh nghiệm", value: "6 năm" },
      { label: "Phong cách", value: "Tranh dân gian" },
      { label: "Cấp bậc", value: "Lead Artist" },
    ],
    lore: {
      kind: "soul",
      title: "Chất Riêng",
      intro: "Người kể chuyện bằng hình — pha nét tranh Hàng Trống vào tạo hình hiện đại.",
      signature: "Đường nét mềm mại Á Đông, bảng màu son – chàm – kim nhũ.",
      inspiration: ["Tranh Đông Hồ", "Điêu khắc đình làng", "Truyện cổ tích Việt"],
      mood: ["Hoài niệm", "Sử thi", "Trữ tình"],
    },
    projects: [
      { name: "Huyền Sử Đại Việt", role: "Key Visual & Concept", year: "2024" },
      { name: "Artbook 'Cõi Việt'", role: "Lead Illustrator", year: "2023" },
      { name: "Thần Thoại Việt", role: "Character Artist", year: "2021" },
    ],
  },
  {
    name: "Đỗ Ngọc Lan",
    alias: "The Sculptor",
    role: "Game Artist",
    roleVi: "Họa Sĩ Game",
    tagline: "Khắc họa chiều sâu 3D, biến ý tưởng thành hình hài chạm được.",
    accent: "#b8902a",
    skills: [
      { name: "Photoshop", icon: "ps", color: "31A8FF" },
      { name: "Figma", slug: "figma", color: "F24E1E" },
      { name: "Illustrator", icon: "ai", color: "FF9A00" },
      { name: "Spine", icon: "spine", color: "FF4000" },
      { name: "After Effects", icon: "ae", color: "9999FF" },
      { name: "Blender", slug: "blender", color: "F5792A" },
      { name: "Premiere", icon: "pr", color: "9999FF" },
    ],
    quote: "Một mô hình đẹp là khi ánh sáng chạm vào, nó tự kể câu chuyện của mình.",
    meta: [
      { label: "Kinh nghiệm", value: "5 năm" },
      { label: "Phong cách", value: "Stylized 3D" },
      { label: "Cấp bậc", value: "Senior Artist" },
    ],
    lore: {
      kind: "soul",
      title: "Chất Riêng",
      intro: "Nhà điêu khắc số — nắn từng khối hình để chất liệu Việt sống dậy trong không gian 3D.",
      signature: "Khối hình cách điệu, bề mặt sơn mài, chi tiết chạm trổ thủ công.",
      inspiration: ["Tượng chùa cổ", "Gốm Bát Tràng", "Hoa văn trống đồng"],
      mood: ["Tĩnh tại", "Tinh xảo", "Linh thiêng"],
    },
    projects: [
      { name: "Huyền Sử Đại Việt", role: "Lead 3D Artist", year: "2024" },
      { name: "Bảo Vật Quốc Gia (AR)", role: "3D Modeler", year: "2023" },
      { name: "Kinh Thành Thăng Long", role: "Environment Artist", year: "2022" },
    ],
  },
];

/* ---------------------------------------------------------
   POSE NÉT ĐỨT — mỗi role một dáng đứng riêng (placeholder)
   viewBox 0..100 (ngang) x 0..140 (dọc)
--------------------------------------------------------- */
const POSES = {
  // Lập trình viên — đứng thẳng, tay khoanh / cầm "thiết bị"
  developer: `
    <circle cx="50" cy="22" r="11"/>
    <path d="M50 33 L50 82"/>
    <path d="M50 44 L30 60 L38 66"/>
    <path d="M50 44 L70 60 L62 66"/>
    <path d="M50 82 L38 122 L34 134"/>
    <path d="M50 82 L62 122 L66 134"/>
    <path d="M30 60 L70 60"/>
  `,
  // Game Designer — tay chống cằm "suy tư", hơi nghiêng
  designer: `
    <circle cx="46" cy="22" r="11"/>
    <path d="M48 33 L52 82"/>
    <path d="M50 46 L72 40 L78 30"/>
    <path d="M49 46 L30 64 L34 74"/>
    <path d="M52 82 L40 122 L36 134"/>
    <path d="M52 82 L64 120 L70 132"/>
    <path d="M40 30 Q50 24 60 30"/>
  `,
  // Artist — một tay giơ cao "cầm cọ", dáng phóng khoáng
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
