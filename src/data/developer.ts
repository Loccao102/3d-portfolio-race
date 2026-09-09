export interface DeveloperProfile {
  name: string;
  role: string;
  location: string;
  phone: string;
  status: string;
  education: {
    school: string;
    major: string;
    period: string;
    degree: string;
  };
  languages: { name: string; level: string }[];
  bio: string[];
  focus: string[];
  skills: {
    category: string;
    items: { name: string; level: string; icon?: string }[];
  }[];
  contacts: {
    github: string;
    linkedin: string;
    email: string;
    phone: string;
    location: string;
  };
  stats: { label: string; value: string; desc?: string }[];
  experience: {
    period: string;
    role: string;
    company: string;
    statusNote?: string;
    highlights: string[];
  }[];
}

export const developerData: DeveloperProfile = {
  name: 'Cao Tiến Lộc',
  role: '.NET FULLSTACK DEVELOPER // BACKEND & HIGH-PERFORMANCE SYSTEMS',
  location: 'Hà Đông, Hà Nội, Việt Nam',
  phone: '0936706987',
  status: 'Sẵn sàng cho các thử thách kỹ thuật cao điểm & hệ thống quy mô lớn',
  education: {
    school: 'Đại học Xây dựng Hà Nội',
    major: 'Khoa Công nghệ Thông tin',
    period: '2021 — 2025',
    degree: 'Đã tốt nghiệp',
  },
  languages: [
    { name: 'Tiếng Anh', level: 'B2 (Đọc hiểu tài liệu chuyên sâu & Giao tiếp)' },
    { name: 'Tiếng Nhật', level: 'N5' },
  ],
  bio: [
    'Backend/.NET Developer với hơn 2 năm kinh nghiệm thực chiến phát triển và vận hành các hệ thống Web chịu tải cao sử dụng C# và ASP.NET Core.',
    'Chuyên sâu về System Performance, Real-time Communication, FinTech Payment Gateway và Data-intensive Systems quy mô hàng triệu bản ghi và hàng ngàn kết nối đồng thời.',
    'Xuất thân từ Khoa CNTT - Đại học Xây dựng Hà Nội, tôi mang tư duy kiến trúc nền móng vững chắc: Một hệ thống phần mềm chỉ thực sự đứng vững khi database, concurrency và kiến trúc cốt lõi được tối ưu đến từng mili-giây.',
    'Từng đảm nhiệm vai trò Team Lead dẫn dắt 5–6 kỹ sư, trực tiếp định hướng giải pháp kỹ thuật, phân bổ công việc, review code và áp dụng các công cụ AI hiện đại (Cursor, Claude, Copilot) để nhân ba năng suất phát triển.',
  ],
  focus: [
    'Kiến trúc Backend .NET Core, Microservices & Clean Architecture',
    'Tối ưu hóa Cơ sở Dữ liệu chuyên sâu: Index Tuning, Schema Redesign, Parallel Processing',
    'Hệ thống Thanh toán FinTech, Idempotent API & Webhook Retry tự phục hồi',
    'Giao tiếp Thời gian thực Real-time (SignalR / WebSocket) quy mô 20.000+ kết nối',
    'Ứng dụng AI Tools (Cursor, Claude, Copilot) vào quy trình kỹ sư thực chiến',
  ],
  skills: [
    {
      category: 'Backend & .NET Architecture',
      items: [
        { name: 'ASP.NET Core Web API / C#', level: 'Chuyên sâu' },
        { name: 'Entity Framework Core / LINQ', level: 'Chuyên sâu' },
        { name: 'SignalR / WebSockets Real-time', level: 'Chuyên sâu' },
        { name: 'RabbitMQ / Message Queues', level: 'Thành thạo' },
        { name: 'Redis Distributed Caching', level: 'Chuyên sâu' },
        { name: 'Microservices / SOA / RESTful API', level: 'Thành thạo' },
        { name: 'SOLID / Design Patterns (Factory, Strategy)', level: 'Chuyên sâu' },
        { name: 'Unit Testing (xUnit)', level: 'Thành thạo' },
      ],
    },
    {
      category: 'Database & Data-Intensive',
      items: [
        { name: 'SQL Server (T-SQL, Query Plan)', level: 'Chuyên sâu' },
        { name: 'Database Schema Redesign & Tuning', level: 'Chuyên sâu' },
        { name: 'Index Tuning & Query Optimization', level: 'Chuyên sâu' },
        { name: 'Parallel Batch Processing (.NET Parallel)', level: 'Chuyên sâu' },
        { name: 'MySQL / PostgreSQL / MongoDB', level: 'Thành thạo' },
        { name: 'Time-Series Sensor Big Data', level: 'Thành thạo' },
      ],
    },
    {
      category: 'Frontend & Modern Web',
      items: [
        { name: 'TypeScript / JavaScript', level: 'Chuyên sâu' },
        { name: 'React (Hooks) / Next.js', level: 'Thành thạo' },
        { name: 'Angular / jQuery', level: 'Thành thạo' },
        { name: 'TailwindCSS / MUI / AntD', level: 'Thành thạo' },
        { name: 'Zustand / Redux Toolkit', level: 'Thành thạo' },
        { name: 'HTML5 / CSS3 Responsive', level: 'Chuyên sâu' },
      ],
    },
    {
      category: 'DevOps, Tools & AI Augmentation',
      items: [
        { name: 'Docker / On-Premise Deployment', level: 'Thành thạo' },
        { name: 'CI/CD Pipelines / Git Flow', level: 'Thành thạo' },
        { name: 'Kubernetes (K8s basic)', level: 'Cơ bản' },
        { name: 'JMeter Load Testing', level: 'Thành thạo' },
        { name: 'Cursor / GitHub Copilot / Claude', level: 'Chuyên sâu' },
        { name: 'An toàn thông tin Cấp độ 3 (OWASP, AES/ECC)', level: 'Thành thạo' },
      ],
    },
  ],
  contacts: {
    github: 'https://github.com/Loccao102',
    linkedin: 'https://linkedin.com/in/cao-loc-46742b247',
    email: 'loccao102@gmail.com',
    phone: '0936706987',
    location: 'Hà Đông, Hà Nội, Việt Nam',
  },
  stats: [
    { label: 'TỐI ƯU HIỆU NĂNG', value: 'Giảm 97%', desc: '200K thí sinh từ 15 phút xuống 30 giây' },
    { label: 'GIÁ TRỊ GIAO DỊCH', value: '10 Tỷ VNĐ', desc: 'Vận hành an toàn qua cổng Payment trong 2 tháng' },
    { label: 'QUAN TRẮC KHÍ TƯỢNG', value: '5 Triệu+', desc: 'Bản ghi chuỗi thời gian phân tích cảnh báo bão' },
    { label: 'AN NINH THÔNG TIN', value: 'Cấp độ 3', desc: 'Tiêu chuẩn Quốc gia OWASP Top 10, AES/ECC' },
  ],
  experience: [
    {
      period: '06/2026 — HIỆN TẠI',
      role: 'Backend Developer',
      company: 'Công ty TNHH myG',
      highlights: [
        'Mở rộng hệ sinh thái Payment phục vụ 50.000–100.000 giao dịch/tháng, tích hợp VTC Pay, MoMo, SePay với giá trị giao dịch ~10 tỷ đồng trong 2 tháng.',
        'Chuẩn hóa kiến trúc thanh toán bằng Factory & Strategy Pattern, rút ngắn thời gian tích hợp cổng mới xuống vài giờ mà không đụng chạm core flow.',
        'Tăng khả năng tự phục hồi bằng Idempotent API & Webhook Retry Mechanism, đạt 95% retry success và kiểm soát duplicate transaction ở mức 2%.',
        'Cải tiến phân phối code sang Batch Processing kết hợp SMS & Zalo OA, xử lý 1.000 lượt gửi/10 phút không nghẽn luồng chính.',
        'Phát triển Socket communication real-time cho game bài Wewin/MonkeyCard (Cocos2d, Java Spring, Socket.io, MySQL, Redis).',
      ],
    },
    {
      period: '01/2026 — 06/2026',
      role: 'Fullstack Developer',
      company: 'Công ty Cổ phần NIQ Việt Nam',
      statusNote: 'Công ty ngừng hoạt động',
      highlights: [
        'Phát triển phân hệ cốt lõi xử lý luồng hồ sơ hành chính liên thông phức tạp giữa các Sở, Ban, Ngành (Hà Nội, Thái Nguyên, Bộ Văn Hóa).',
        'Đồng bộ dữ liệu và tích hợp sâu với Cổng Dịch vụ công Quốc gia, Định danh điện tử Quốc gia (VNeID) và cổng thanh toán công.',
        'Phối hợp trong Core Team (5–7 kỹ sư) thuộc dự án 30 nhân sự để chuyển đổi số toàn diện các thủ tục giấy tờ sang giao diện số thân thiện.',
      ],
    },
    {
      period: '02/2024 — 12/2025',
      role: 'Fullstack Developer / Team Lead',
      company: 'Công ty Cổ phần Công nghệ G-Connect',
      statusNote: 'Hiện vẫn hỗ trợ kỹ thuật vào các đợt cao điểm',
      highlights: [
        'Đảm nhiệm Team Lead hệ thống Thi trên máy (Bộ GD&ĐT), dẫn dắt 4 Developers + 2 Testers; triển khai qua 2 đợt thi tại 10 địa phương, ~20 điểm thi cho 20.000+ thí sinh.',
        'Thiết kế giao tiếp real-time SignalR/WebSocket kết hợp Autosave chống mất bài khi rớt mạng; đưa hệ thống đạt chuẩn An toàn thông tin Cấp độ 3 (OWASP, AES/ECC).',
        'Giảm 97% thời gian xử lý dữ liệu 200.000 thí sinh (từ 15 phút xuống 30 giây) nhờ tái cấu trúc Database Schema, Index Tuning và .NET Task Parallel.',
        'Giảm 87% thời gian pipeline chấm thi tự động OMR/OCR (từ 2 giờ xuống 15 phút); đóng gói Docker và thiết lập CI/CD trên Private Server.',
        'Phát triển Background Service và phân tích dữ liệu chuỗi thời gian 5 triệu bản ghi cho Hệ thống Dự báo Áp thấp nhiệt đới & Bão (Cục Khí tượng Thủy văn).',
      ],
    },
  ],
};

