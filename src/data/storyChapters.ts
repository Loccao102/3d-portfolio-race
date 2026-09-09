export interface StoryChapter {
  chapterNumber: number;
  id: 'about' | 'tech' | 'projects' | 'experiments' | 'contact';
  title: { vi: string; en: string };
  subtitle: { vi: string; en: string };
  quote: { vi: string; en: string };
  narrative: { vi: string; en: string };
  waypoint: [number, number, number]; // [x, y, z]
  heading: number; // in radians
  color: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    chapterNumber: 1,
    id: 'about',
    title: {
      vi: 'CHƯƠNG 01 // KHỞI NGUYÊN',
      en: 'CHAPTER 01 // THE GENESIS',
    },
    subtitle: {
      vi: 'Trạm Thông Tin // Khởi đầu Đam mê & Bản sắc Kỹ sư',
      en: 'About District // Origins, Passion & Identity',
    },
    quote: {
      vi: '“Mọi hành trình vĩ đại đều bắt đầu từ một dấu nhắc lệnh nhấp nháy.”',
      en: '“Every great odyssey begins with a single blinking cursor.”',
    },
    narrative: {
      vi: 'Nơi đam mê kiến tạo bắt đầu: Không chỉ là viết code cho máy tính chạy, mà là thổi hồn vào từng pixel để tạo nên trải nghiệm kết nối với con người.',
      en: 'Where the journey ignited: Crafting code not just for machines, but to evoke emotion and deliver profound digital experiences.',
    },
    waypoint: [0, 1.2, 34],
    heading: 0,
    color: '#00f3ff',
  },
  {
    chapterNumber: 2,
    id: 'tech',
    title: {
      vi: 'CHƯƠNG 02 // LÒ LUYỆN',
      en: 'CHAPTER 02 // THE FORGE',
    },
    subtitle: {
      vi: 'Viện Công Nghệ // Làm chủ Công nghệ Lõi & Kiến trúc 3D',
      en: 'Tech Lab // Core Mastery & 3D Architecture',
    },
    quote: {
      vi: '“Nền tảng kỹ thuật vững chắc để biến điều bất khả thành trải nghiệm 60 FPS.”',
      en: '“Deep technical fundamentals turn the impossible into silk-smooth 60 FPS.”',
    },
    narrative: {
      vi: 'Những đêm dài tôi luyện WebGL, GLSL Shaders, toán ma trận 3D và kiến trúc phân tán. Xây dựng tư duy kỹ sư hệ thống chuẩn mực và bền bỉ.',
      en: 'Forging deep mastery in WebGL, Three.js, shaders, low-level algorithms, and distributed resilient backend architectures.',
    },
    waypoint: [0, 1.2, -34],
    heading: Math.PI,
    color: '#f59e0b',
  },
  {
    chapterNumber: 3,
    id: 'projects',
    title: {
      vi: 'CHƯƠNG 03 // THỰC CHIẾN',
      en: 'CHAPTER 03 // PROVING GROUNDS',
    },
    subtitle: {
      vi: 'Garage Dự Án // Giải quyết Bài toán Thực 450K+ Người dùng',
      en: 'Project Garage // Real Impact at 450K+ Scale',
    },
    quote: {
      vi: '“Kỹ thuật đỉnh cao là kỹ thuật mang lại giá trị thực cho con người.”',
      en: '“Excellence in engineering is measured by real human impact.”',
    },
    narrative: {
      vi: 'Đưa kỹ thuật vào thử lửa: Xây dựng hệ thống thi trực tuyến phục vụ 450.000+ lượt thi toàn quốc, Studio cấu hình 3D ô tô và Canvas cộng tác thời gian thực.',
      en: 'Battle-tested production systems: High-concurrency online exams serving 450,000+ sessions, 3D automotive studios, and real-time collaboration engines.',
    },
    waypoint: [43, 1.2, 0],
    heading: -Math.PI / 2,
    color: '#10b981',
  },
  {
    chapterNumber: 4,
    id: 'experiments',
    title: {
      vi: 'CHƯƠNG 04 // ĐỘT PHÁ',
      en: 'CHAPTER 04 // THE HORIZON',
    },
    subtitle: {
      vi: 'Phòng Thí Nghiệm // Vươn tới Ranh giới Sáng tạo Mới',
      en: 'Experiment Lab // Pushing Creative Frontiers',
    },
    quote: {
      vi: '“Đứng yên là thụt lùi — Luôn tiến về phía chân trời của sự sáng tạo.”',
      en: '“Standing still is falling behind — Always pursue the frontier of innovation.”',
    },
    narrative: {
      vi: 'R&D không ngừng nghỉ: Shader GLSL thời gian thực, mô phỏng vật lý WebAssembly Rapier, âm thanh Web Audio procedural và mỹ thuật tương tác vị lai.',
      en: 'Continuous R&D: Real-time GLSL visual effects, WebAssembly physics simulation, spatial procedural Web Audio, and future-forward UI.',
    },
    waypoint: [-38, 1.2, 0],
    heading: Math.PI / 2,
    color: '#ec4899',
  },
  {
    chapterNumber: 5,
    id: 'contact',
    title: {
      vi: 'CHƯƠNG 05 // ĐỒNG HÀNH',
      en: 'CHAPTER 05 // THE DESTINATION',
    },
    subtitle: {
      vi: 'Trạm Kết Nối // Hợp tác Kiến tạo Tương lai',
      en: 'Contact Station // Let’s Build the Future Together',
    },
    quote: {
      vi: '“Những điều kỳ diệu nhất luôn được tạo nên khi chúng ta cùng đồng hành.”',
      en: '“The most inspiring digital frontiers are conquered when great minds unite.”',
    },
    narrative: {
      vi: 'Cửa sổ liên lạc luôn rộng mở cho các dự án tham vọng, các vị trí kỹ sư chủ chốt hoặc sự hợp tác mang tính đột phá trên toàn cầu.',
      en: 'Ready for high-impact engineering leadership, ambitious WebGL challenges, and transformative digital collaborations.',
    },
    waypoint: [0, 1.2, -71],
    heading: Math.PI,
    color: '#38bdf8',
  },
];
