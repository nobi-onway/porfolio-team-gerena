/* =========================================================
   DỮ LIỆU NỘI DUNG — clean placeholder (Lorem Ipsum)

   MEMBERS là nguồn dữ liệu cho từng slide thành viên.
   render.js (memberCardHTMLv2) đọc các trường dưới đây để dựng:
     · Header                : name, roleVi
     · Avatar (pose + glow)  : role, accent
     · Đoạn 1 (Chuyên/Chất)  : lore { kind, title, intro, focus[] / signature, inspiration[], mood[] }
     · Đoạn 2 (Cột Mốc)      : milestones [{ year, event, detail }]
     · Đoạn 3 (Kinh nghiệm)  : projects   [{ name, role, year, cover, tags[], contribution, metric }]
     · Cột Công Cụ (Artist)  : skills     (chỉ render khi lore.kind === "soul")

   GHI CHÚ:
   - role hợp lệ để chọn pose = "Game Developer" | "Game Designer" | "Game Artist"
   - lore.kind = "craft" cho Dev/Designer, "soul" cho Artist
   - projects: name + contribution là nội dung; role/year/cover/tags/metric là thuộc tính cấu trúc
========================================================= */
const MEMBERS = [
  {
    name: "Phạm Hùng Thiên",
    role: "Game Designer",
    roleVi: "Thiết Kế Game",
    accent: "#0f7a52",
    skills: [
      { name: "Figma", slug: "figma", color: "F24E1E" },
      { name: "Miro", slug: "miro", color: "FFF000" },
      { name: "Notion", slug: "notion", color: "000000" },
      { name: "Unity", slug: "unity", color: "000000" },
    ],
    lore: {
      kind: "craft",
      title: "Chuyên Môn",
      intro: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis.",
      focus: [
        { k: "Thiết kế", v: "Amet consectetur · Adipiscing elit · Sed do" },
        { k: "Sở trường", v: "Eiusmod tempor incididunt ut labore et dolore" },
        { k: "Triết lý", v: "Magna aliqua veniam quis nostrud" },
      ],
    },
    projects: [
      {
        name: "Aliquip Commodo",
        role: "Lead Game Designer",
        year: "2024",
        cover: "scene:mountain",
        tags: ["RPG", "Narrative", "PC/Mobile"],
        contribution: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur.",
        metric: "Đang phát triển · Mở beta Q4/2024",
      },
      {
        name: "Duis Aute",
        role: "Systems Designer",
        year: "2022",
        cover: "scene:river",
        tags: ["Strategy", "PvP", "Mobile"],
        contribution: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        metric: "300K MAU · giữ retention D30 ở 28%",
      },
      {
        name: "Voluptate Velit",
        role: "Game Designer",
        year: "2021",
        cover: "scene:bamboo",
        tags: ["Casual", "Online", "Mobile"],
        contribution: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore.",
        metric: "1M+ lượt tải · vinh danh Bộ VHTT&DL",
      },
    ],
    milestones: [
      {
        year: "2018",
        event: "Lorem ipsum dolor sit",
        detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        year: "2021",
        event: "Consectetur adipiscing",
        detail: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.",
      },
      {
        year: "2022",
        event: "Sed do eiusmod tempor",
        detail: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.",
      },
      {
        year: "2023",
        event: "Incididunt ut labore",
        detail: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum lorem.",
      },
      {
        year: "2024",
        event: "Magna aliqua veniam",
        detail: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna.",
      },
    ],
  },
  {
    name: "Đoàn Gia Bảo",
    role: "Game Developer",
    roleVi: "Lập Trình Game",
    accent: "#c0392b",
    skills: [
      { name: "Unity", slug: "unity", color: "000000" },
      { name: "C#", slug: "csharp", color: "512BD4" },
      { name: "Rider", slug: "rider", color: "000000" },
      { name: "Git", slug: "git", color: "F05032" },
    ],
    lore: {
      kind: "craft",
      title: "Chuyên Môn",
      intro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      focus: [
        { k: "Kiến trúc", v: "Lorem ipsum · Dolor sit · Amet consectetur" },
        { k: "Sở trường", v: "Adipiscing elit sed do eiusmod tempor incididunt" },
        { k: "Triết lý code", v: "Lorem ipsum dolor sit amet" },
      ],
    },
    projects: [
      {
        name: "Lorem Ipsum Alpha",
        role: "Lead Developer",
        year: "2024",
        cover: "scene:mountain",
        tags: ["RPG", "Multiplayer", "PC/Mobile"],
        contribution: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        metric: "Đang phát triển · Mở beta Q4/2024",
      },
      {
        name: "Dolor Sit Amet",
        role: "Backend & Netcode",
        year: "2022",
        cover: "scene:river",
        tags: ["Strategy", "Realtime", "Mobile"],
        contribution: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud.",
        metric: "50K CCU · giảm 40% độ trễ cảm nhận",
      },
      {
        name: "Consectetur Elit",
        role: "Gameplay Programmer",
        year: "2020",
        cover: "scene:bamboo",
        tags: ["Tactics", "Single Player", "PC"],
        contribution: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        metric: "200K lượt tải · Top 10 game Việt 2020",
      },
    ],
    milestones: [
      {
        year: "2017",
        event: "Lorem ipsum dolor sit",
        detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.",
      },
      {
        year: "2020",
        event: "Consectetur adipiscing elit",
        detail: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        year: "2022",
        event: "Sed do eiusmod tempor",
        detail: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
      },
      {
        year: "2023",
        event: "Ut labore et dolore",
        detail: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa.",
      },
      {
        year: "2024",
        event: "Magna aliqua veniam",
        detail: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet consectetur.",
      },
    ],
  },
  {
    name: "Vũ Đình Khoa",
    role: "Game Developer",
    roleVi: "Lập Trình Game",
    accent: "#9c6f15",
    skills: [
      { name: "Unreal Engine", slug: "unrealengine", color: "0E1128" },
      { name: "C++", slug: "cplusplus", color: "00599C" },
      { name: "Visual Studio", slug: "visualstudio", color: "5C2D91" },
      { name: "Git", slug: "git", color: "F05032" },
    ],
    lore: {
      kind: "craft",
      title: "Chuyên Môn",
      intro: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation.",
      focus: [
        { k: "Kiến trúc", v: "Dolor sit · Amet consectetur · Adipiscing elit" },
        { k: "Sở trường", v: "Sed do eiusmod tempor incididunt ut labore" },
        { k: "Triết lý code", v: "Consectetur adipiscing sed do eiusmod" },
      ],
    },
    projects: [
      {
        name: "Veniam Nostrud",
        role: "Engine Programmer",
        year: "2025",
        cover: "scene:river",
        tags: ["RPG", "Open World", "PC/Console"],
        contribution: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        metric: "Đang phát triển · Reveal trailer Q2/2025",
      },
      {
        name: "Exercitation Ullamco",
        role: "Tools Lead",
        year: "2023",
        cover: "scene:bamboo",
        tags: ["Internal", "Tooling", "Multi-platform"],
        contribution: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        metric: "Giảm 60% thời gian export · sử dụng nội bộ toàn studio",
      },
      {
        name: "Laboris Nisi",
        role: "Graphics Programmer",
        year: "2021",
        cover: "scene:mountain",
        tags: ["Racing", "Mobile", "Stylized"],
        contribution: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.",
        metric: "Chạy 60fps trên Snapdragon 660 · Top 5 Indie Casual VN",
      },
    ],
    milestones: [
      {
        year: "2019",
        event: "Adipiscing elit consectetur",
        detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua veniam quis nostrud.",
      },
      {
        year: "2021",
        event: "Sed do eiusmod tempor",
        detail: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
      },
      {
        year: "2023",
        event: "Incididunt ut labore",
        detail: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.",
      },
      {
        year: "2024",
        event: "Dolore magna aliqua",
        detail: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum lorem ipsum.",
      },
      {
        year: "2025",
        event: "Veniam quis nostrud",
        detail: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
  },
  {
    name: "Nguyễn Trần Thanh Hằng",
    role: "Game Artist",
    roleVi: "Họa Sĩ Game",
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
    lore: {
      kind: "soul",
      title: "Chất Riêng",
      intro: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      signature: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
      inspiration: ["Lorem ipsum", "Dolor sit amet", "Consectetur elit"],
      mood: ["Adipiscing", "Tempor", "Veniam"],
    },
    projects: [
      {
        name: "Cillum Dolore",
        role: "Key Visual & Concept",
        year: "2024",
        cover: "scene:bamboo",
        tags: ["Concept Art", "Key Visual", "Art Bible"],
        contribution: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore.",
        metric: "Đang phát triển · Reveal artwork đạt 50K share",
      },
      {
        name: "Excepteur Sint",
        role: "Lead Illustrator",
        year: "2023",
        cover: "scene:river",
        tags: ["Artbook", "In Ấn", "Cá Nhân"],
        contribution: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        metric: "1000 bản giới hạn · Tái bản 2 lần · NXB Kim Đồng",
      },
      {
        name: "Occaecat Cupidatat",
        role: "Character Artist",
        year: "2021",
        cover: "scene:mountain",
        tags: ["Adventure", "2D", "Mobile"],
        contribution: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur.",
        metric: "Best Art Direction · GameAwards VN 2021",
      },
    ],
    milestones: [
      {
        year: "2018",
        event: "Lorem ipsum dolor",
        detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna.",
      },
      {
        year: "2020",
        event: "Sit amet consectetur",
        detail: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation.",
      },
      {
        year: "2021",
        event: "Adipiscing elit sed",
        detail: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis.",
      },
      {
        year: "2023",
        event: "Do eiusmod tempor",
        detail: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.",
      },
      {
        year: "2024",
        event: "Incididunt ut labore",
        detail: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
    ],
  },
  {
    name: "Lê Trúc Giang",
    role: "Game Artist",
    roleVi: "Họa Sĩ Game",
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
    lore: {
      kind: "soul",
      title: "Chất Riêng",
      intro: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      signature: "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
      inspiration: ["Sed do eiusmod", "Tempor incididunt", "Ut labore dolore"],
      mood: ["Magna", "Aliqua", "Veniam"],
    },
    projects: [
      {
        name: "Proident Mollit",
        role: "Lead 3D Artist",
        year: "2024",
        cover: "scene:mountain",
        tags: ["RPG", "Stylized 3D", "PC/Mobile"],
        contribution: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.",
        metric: "Đang phát triển · 80+ asset nhân vật & môi trường",
      },
      {
        name: "Anim Laborum",
        role: "3D Modeler",
        year: "2023",
        cover: "scene:bamboo",
        tags: ["AR", "Văn hoá", "Mobile"],
        contribution: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis.",
        metric: "Hợp tác Bảo tàng Lịch sử · 200K lượt trải nghiệm",
      },
      {
        name: "Officia Deserunt",
        role: "Environment Artist",
        year: "2022",
        cover: "scene:river",
        tags: ["Lịch sử", "Khám phá", "PC"],
        contribution: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
        metric: "Giải Khuyến khích Nhân tài Đất Việt 2022",
      },
    ],
    milestones: [
      {
        year: "2019",
        event: "Lorem ipsum dolor",
        detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore.",
      },
      {
        year: "2021",
        event: "Sit amet consectetur",
        detail: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud.",
      },
      {
        year: "2022",
        event: "Adipiscing elit sed",
        detail: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        year: "2023",
        event: "Do eiusmod tempor",
        detail: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      },
      {
        year: "2024",
        event: "Incididunt ut labore",
        detail: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.",
      },
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
