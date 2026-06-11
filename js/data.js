/* =========================================================
   DỮ LIỆU NỘI DUNG — PASSION & JOURNEY (placeholder Lorem)

   Mỗi thành viên chỉ còn 2 mảng nội dung, trình bày như
   tuyên ngôn typography (không nhật ký, không tâm thư):

     · passion = { headline, body }  // niềm đam mê
     · journey = { headline, body }  // hành trình & lý do đồng hành cùng team

   `layout` quyết định 1 trong 5 biến thể manifesto poster:
     manifesto / overprint / vertical / stamp / banner

   `skills` CHỈ Artist (Game Artist) mới có.
========================================================= */
const MEMBERS = [
  {
    name: "Phạm Hùng Thiên",
    role: "Game Designer",
    roleVi: "Thiết Kế Game",
    accent: "#0f7a52",
    layout: "manifesto",
    passion: {
      headline: "Lorem Ipsum Dolor",
      body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    journey: {
      headline: "Sit Amet Consectetur",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    },
  },

  {
    name: "Đoàn Gia Bảo",
    role: "Game Developer",
    roleVi: "Lập Trình Game",
    accent: "#c0392b",
    layout: "overprint",
    passion: {
      headline: "Adipiscing Elit",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    },
    journey: {
      headline: "Eiusmod Tempor",
      body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
    },
  },

  {
    name: "Vũ Đình Khoa",
    role: "Game Developer",
    roleVi: "Lập Trình Game",
    accent: "#9c6f15",
    layout: "vertical",
    passion: {
      headline: "Incididunt Ut Labore",
      body: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.",
    },
    journey: {
      headline: "Et Dolore Magna",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
  },

  {
    name: "Nguyễn Trần Thanh Hằng",
    role: "Game Artist",
    roleVi: "Họa Sĩ Game",
    accent: "#d4684a",
    layout: "halo",
    skills: [
      { name: "Photoshop",     icon: "ps",      color: "31A8FF" },
      { name: "Figma",         slug: "figma",   color: "F24E1E" },
      { name: "Illustrator",   icon: "ai",      color: "FF9A00" },
      { name: "Spine",         icon: "spine",   color: "FF4000" },
      { name: "After Effects", icon: "ae",      color: "9999FF" },
      { name: "Blender",       slug: "blender", color: "F5792A" },
      { name: "Premiere",      icon: "pr",      color: "9999FF" },
    ],
    passion: {
      headline: "Aliqua Veniam",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    },
    journey: {
      headline: "Nostrud Exercitation",
      body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    },
  },

  {
    name: "Lê Trúc Giang",
    role: "Game Artist",
    roleVi: "Họa Sĩ Game",
    accent: "#b8902a",
    layout: "folio",
    skills: [
      { name: "Photoshop",     icon: "ps",      color: "31A8FF" },
      { name: "Figma",         slug: "figma",   color: "F24E1E" },
      { name: "Illustrator",   icon: "ai",      color: "FF9A00" },
      { name: "Spine",         icon: "spine",   color: "FF4000" },
      { name: "After Effects", icon: "ae",      color: "9999FF" },
      { name: "Blender",       slug: "blender", color: "F5792A" },
      { name: "Premiere",      icon: "pr",      color: "9999FF" },
    ],
    passion: {
      headline: "Ullamco Laboris",
      body: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.",
    },
    journey: {
      headline: "Aliquip Commodo",
      body: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut.",
    },
  },
];

/* ---------------------------------------------------------
   POSE NÉT ĐỨT — mỗi role một dáng đứng riêng (placeholder)
   viewBox 0..100 (ngang) x 0..140 (dọc)
--------------------------------------------------------- */
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
