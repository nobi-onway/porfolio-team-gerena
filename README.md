# ĐẠI VIỆT STUDIO — Team Portfolio

Portfolio giới thiệu các thành viên trong team làm game, phong cách **Thủy Mặc Minimal** (giấy dó sáng – mực đen – nhấn đỏ son), đậm chất văn hóa Việt.

- **Layout:** 1 section full viewport, **khóa scroll x/y** — mọi tương tác trong khung.
- **Gesture:** cuộn chuột / vuốt / phím mũi tên để chuyển sang thành viên kế tiếp.
- **Background liền mạch:** 5 thành viên là 5 đoạn của **một cuộn tranh thủy mặc dọc** theo mạch **Bốn mùa + Cửa biển** (Xuân đào → Hạ sen → Thu tre → Đông núi mờ → Cửa biển). Chuyển thành viên = **camera trượt dọc** qua cuộn tranh; chính chuyển động của tranh tạo transition (không còn hiệu ứng mực loang).
- **Đường nối xuyên suốt:** dòng nước chảy từ đỉnh xuống biển, dải núi/chân trời chạy dọc, mây vắt ngang, đàn hạc bay suốt — khâu 5 đoạn thành bức tranh liên tục.
- **Công cụ = logo icon (mực, hover màu):** mục "Công Cụ" hiển thị logo tech stack đơn sắc mực, hover hiện màu thương hiệu. Ba nguồn theo thứ tự ưu tiên trong `skillTagHTML` ([render.js](js/render.js)): (1) **icon tự vẽ** `CUSTOM_ICONS` cho các logo Simple Icons không có — **Ps/Ai/Ae/Pr** (khung bo góc + chữ viết tắt) & **Spine** (key `s.icon`); (2) **Simple Icons CDN** cho phần còn lại (Figma, Blender, Unity, Git... — `s.slug`); (3) **chip chữ** fallback. Khai báo `skills: [{ name, icon?, slug?, color }]` trong [data.js](js/data.js).
- **Khối thông tin = mảnh giấy dó mép cọ:** các khối (Chuyên Môn / Dự án / Vũ khí) không còn viền hộp vuông, mà là mảnh giấy có **mép bụt phá** (SVG filter `#paperEdge` = feTurbulence + feDisplacementMap). Tiêu đề mục có **hairline mực mảnh dần** bên dưới (như nét bút lông nhấc lên).
- **Vật trang trí:** sen, thuyền nan, hạc, mây, tre, núi, cành đào, lá rơi — SVG line-art nét mực, có draw-on & float.
- **Hạt rơi:** cánh hoa đào / lá tre rơi nhẹ.
- **Transition Morph (băng phim):** tất cả card xếp dọc trong `#cardTrack` (mỗi card cao `100vh`); chuyển thành viên = **dịch cả track** `translateY(-current×100vh)` liền mạch — toàn bộ avatar + tên + thông tin **trượt liên tục, KHÔNG fade** (giống Morph PowerPoint). Track trượt **đồng bộ** với cuộn tranh nền (`#sceneScroll`, cùng 1.25s easing) như một dải phim. Trống đồng nền **xoay thêm `DRUM_STEP = 60°`** mỗi lần chuyển. Logic trong `goTo()` ([main.js](js/main.js)).
- **Tên + role + alias** xếp thẳng dưới avatar ở cột trái (dịch sát tâm trống bằng `-ml`). Trống đồng xoay làm transition nền; chữ không gắn vào trống.

## Cấu trúc dự án

```
portfolio-garena-team/
├── index.html              # Markup khung + nạp assets
├── css/
│   └── styles.css          # Toàn bộ custom CSS (theme Thủy Mặc)
├── js/
│   ├── tailwind.config.js  # Cấu hình màu & font cho Tailwind (CDN)
│   ├── data.js             # ⭐ NỘI DUNG thành viên — sửa tại đây
│   ├── scenery.js          # Cuộn tranh dọc liền mạch (Bốn mùa) + vật trang trí (SVG)
│   ├── render.js           # Hàm dựng HTML cho thẻ thành viên
│   └── main.js             # Điều hướng, gesture, hiệu ứng, boot
└── README.md
```

> Đoạn cảnh gắn theo **thứ tự** thành viên trong `MEMBERS` (`segBuilders` trong `scenery.js`: Xuân→Hạ→Thu→Đông→Biển). Thêm/bớt thành viên thì cuộn tranh tự dài/ngắn theo (`SEG_H` = chiều cao 1 đoạn). Camera trượt `-current × 100vh`.

## Cách chạy

Mở trực tiếp `index.html` bằng trình duyệt (chạy được với `file://`, không cần server).
> Tailwind và fonts nạp qua CDN nên cần kết nối mạng.

## Cập nhật nội dung

Mở [`js/data.js`](js/data.js) và sửa mảng `MEMBERS`. Mỗi thành viên gồm:

| Trường | Ý nghĩa |
|---|---|
| `name`, `alias`, `role`, `roleVi` | Tên, biệt danh, vai trò (Anh/Việt) |
| `tagline`, `quote` | Câu giới thiệu & câu triết lý |
| `accent` | Màu nhấn riêng (mã hex) |
| `skills` | Mảng kỹ năng / công cụ |
| `meta` | 3 chỉ số nhanh `[{ label, value }]` |
| `projects` | Dự án tiêu biểu `[{ name, role, year }]` |
| `lore` | Khối theo vai trò (xem dưới) |

### Khối `lore` khác nhau theo vai trò
- **Dev / Designer** → `kind: "craft"` (chuyên môn — lý trí): `intro`, `focus[{ k, v }]`
- **Artist** → `kind: "soul"` (chất riêng — cảm xúc): `intro`, `signature`, `inspiration[]`, `mood[]`

`role` hợp lệ để chọn pose: `"Game Developer"` · `"Game Designer"` · `"Game Artist"`.

## Gắn ảnh thật (sau)

Avatar hiện là **khung nét đứt + pose vẽ nét đứt** (placeholder). Khi có ảnh, sửa `avatarHTML()` trong [`js/render.js`](js/render.js): thay khối `<svg class="pose-svg">` bằng `<img>` và thêm trường `photo` cho mỗi thành viên trong `data.js`.
