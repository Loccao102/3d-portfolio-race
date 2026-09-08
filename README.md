# CAO TIEN LOC — 3D CYBERPUNK DIORAMA PORTFOLIO
> **Interactive 3D Developer World & Grand Speed Circuit Playground**  
> Built with **Next.js 15**, **React 19**, **Three.js**, **React Three Fiber**, **Rapier Physics**, and **Zustand**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLoccao102%2F3d-portfolio-race)

---

## 🌌 1. PRODUCT VISION & EXPERIENCE PRINCIPLES

Thay vì duyệt một portfolio truyền thống dạng cuộn trang (About $\to$ Skills $\to$ Projects $\to$ Contact), người xem điều khiển một chiếc xe đồ chơi arcade phong cách **Low-poly Cyberpunk Diorama** để trực tiếp lái xe khám phá hành trình sự nghiệp và các dự án kỹ thuật của developer.

### Triết lý trải nghiệm (Experience Principles):
1. **Fun & Memorable:** Gây ấn tượng mạnh mẽ trong 5–10 giây đầu tiên với mô hình diorama sống động.
2. **Smooth 60 FPS:** Kiến trúc tách biệt render loop với React DOM state để đảm bảo chuyển động mượt mà, zero-garbage useFrame loop.
3. **Unique Visitor Identity & Car Customization:** Mỗi thiết bị / IP truy cập sẽ tự động nhận một **phiên hiệu phi công riêng** (Callsign), **màu xe ngẫu nhiên độc bản** và **biển tên 3D phát sáng** lơ lửng trên nóc xe.
4. **Grand Speed Circuit & Rival Racing:** Tích hợp đường đua Grand Racing Circuit bao quanh thành phố, có cổng Start/Finish tính giờ vòng chạy (Lap Timer), các cổng Checkpoint và các xe đối thủ AI tự động đua cùng bạn!
5. **GPS Radar & Wayfinding:** Tích hợp bản đồ thu nhỏ MiniMap GPS Radar và mũi tên la bàn 3D chỉ đường trực tiếp tới từng milestone.
6. **Recruiter-Friendly (Quick View):** Luôn cung cấp chế độ **Quick View / Index** giúp nhà tuyển dụng có thể đọc toàn bộ thông tin CV & Projects trong 1 click mà không bắt buộc phải lái xe.
7. **Mobile First-Class Citizen:** Hỗ trợ đầy đủ màn hình cảm ứng với Virtual Joystick có dead-zone và touch clamping.

---

## 🗺️ 2. THIẾT KẾ BẢN ĐỒ THẾ GIỚI MỞ RỘNG (186m x 246m)

Thế giới được mở rộng quy mô gấp đôi thành một **mô hình đại đô thị cyberpunk thu nhỏ đặt trên bàn diorama** $(186\text{m} \times 246\text{m})$, bao bọc bởi đường đua tốc độ cao Grand Circuit:

```text
                                  [+Z: SOUTH]
                                       
                                 ABOUT DISTRICT
                            (x: 0, z: 52, rot: 0°)
                          "WHO IS LOC? WORKSTATION"
                                      │
                                      │ [South Avenue]
                                      │
   [CHECKPOINT 3] ─────── CENTRAL HUB ─────── [CHECKPOINT 1]
  EXPERIMENT LAB            (x: 0, z: 0)        PROJECT GARAGE
 (x: -62, z: 0, rot: 90°)   SPAWN POINT       (x: 62, z: 0, rot: -90°)
                                      │
                                      │ [North Highway]
                                      │
                                TECH DISTRICT
                           (x: 0, z: -52, rot: 180°)
                            "DATA CENTER REACTOR"
                                      │
                                      │ [Satellite Causeway]
                                      │
                               CONTACT STATION
                           (x: 0, z: -105, rot: 180°)
                            "COMMUNICATION ARRAY"
                                      │
                                      ▼
                        [START / FINISH LINE ARCH]
                           (x: 0, z: -95, rot: 0°)

                                  [-Z: NORTH]
```

---

## 🏁 3. CÁC TÍNH NĂNG MỚI ĐƯỢC BỔ SUNG

1. **Vật lý đi lùi chân thực (Realistic Reverse Kinematics):**
   * Cơ chế lái bánh trước khi lùi: Bẻ lái sang trái (`A`) sẽ đánh đuôi xe sang trái và mũi xe đảo sang phải theo đúng nguyên lý hình học ô tô thực tế.
   * Giới hạn tốc độ lùi hợp lý ($8.5\text{ m/s}$) với gia tốc mượt mà.
   * **Đèn lùi LED trắng:** Cặp đèn LED trắng tinh ở cản sau tự động bừng sáng mỗi khi bạn về số lùi hoặc lùi xe.
   * **Góc lái bánh trước:** Hai bánh trước vật lý xoay chuyển góc lái theo thời gian thực khi đánh lái.

2. **Cá nhân hóa theo từng IP / Người truy cập (Unique Visitor Profile):**
   * Mỗi người vào website sẽ được cấp một **Callsign riêng** (vd: `CYBER-PILOT #42`, `PHANTOM-RUNNER #88`, `VIPER-STRIKER #77`).
   * **Màu xe độc bản ngẫu nhiên:** Màu thân xe kim loại, dải LED viền, vành bánh xe và đèn hắt gầm đổi theo bảng màu Cyberpunk.
   * **Biển tên 3D Holographic Nametag:** Lơ lửng trên nóc xe hiển thị phiên hiệu của người lái.

3. **Hệ thống Đua xe Grand Circuit & Xe đối thủ (Rival AI Racers):**
   * **Đường đua khép kín:** Vòng đua tốc độ cao chạy viền quanh toàn bộ 4 phía thành phố.
   * **3 Xe đối thủ AI:** `GHOST-DRIFT #77`, `APEX-SHADOW #88`, `NEXUS-RACER #23` tự động tuần tra và ôm cua trên đường đua, cho phép bạn rượt đuổi, bám đuôi (drafting) và vượt mặt!
   * **Cổng xuất phát & Đích (Start/Finish Arch):** Giàn khung gantry với cờ caro hologram phát sáng và cảm biến bấm giờ.
   * **Bảng đồng hồ Race HUD:** Đo thời gian vòng chạy (Lap Time), ghi nhận kỷ lục vòng đua tốt nhất (Best Lap) và thông báo qua các chặng Checkpoint 1, 2, 3!

---

## 🚀 4. HƯỚNG DẪN KHỞI CHẠY DỰ ÁN

```bash
# 1. Chạy môi trường phát triển
npm run dev

# 2. Kiểm tra biên dịch sản phẩm (Production Build)
npm run build
```

Mở trình duyệt truy cập: **`http://localhost:3000`**

---

## 📈 5. CHIẾN LƯỢC PHÁT TRIỂN & TĂNG TRƯỞNG TRAFFIC (VIRAL ROADMAP)

Xem chi tiết kế hoạch tăng trưởng, cơ chế viral loop, realtime multiplayer và kế hoạch ra mắt đa kênh tại:
👉 **[develop.md](file:///c:/Users/Admin/3D%20portfolio/develop.md)**

