export interface ProjectCaseStudy {
  id: string;
  bayNumber: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: string;
  year: string;
  tags: string[];
  problem: string;
  solution: string;
  decisions: string[];
  results: string[];
  github?: string;
  demo?: string;
  color: string;
}

export const projectsData: ProjectCaseStudy[] = [
  {
    id: 'exam-system',
    bayNumber: 'BAY_01',
    title: 'Hệ thống Tổ chức & Quản lý Thi Quốc gia (Bộ GD&ĐT)',
    subtitle: 'Team Lead • Real-time SignalR • An toàn thông tin Cấp độ 3 • Tối ưu 200.000 thí sinh',
    tagline: 'Chiến dịch 30 giây: Cắt giảm 97% thời gian xử lý dữ liệu 200.000 thí sinh từ 15 phút xuống 30 giây.',
    category: 'High-Concurrency & Distributed Systems',
    year: '2025',
    tags: ['ASP.NET Core', 'C#', 'SignalR', 'Redis', 'RabbitMQ', 'MySQL', 'Docker', 'OWASP Top 10'],
    problem:
      'Mùa thi cao điểm của Bộ Giáo dục & Đào tạo quy tụ 20.000+ thí sinh làm bài đồng thời tại gần 10 địa phương và ~20 điểm thi. Hệ thống cũ bị nghẽn tới 15 phút khi xử lý 200.000 hồ sơ thí sinh; đường truyền mạng tỉnh lẻ chập chờn đối mặt rủi ro mất bài thi; pipeline chấm thi trắc nghiệm kéo dài hơn 2 giờ đồng hồ.',
    solution:
      'Đảm nhiệm vai trò Team Lead (dẫn dắt 4 Devs + 2 Testers): Thiết kế kiến trúc Real-time hai chiều SignalR/WebSocket kết hợp cơ chế Autosave phân tán chống mất dữ liệu khi rớt mạng; tái cấu trúc triệt để Database Schema & Index Tuning với .NET Task Parallel; đưa hệ thống đạt chuẩn An toàn thông tin Quốc gia Cấp độ 3.',
    decisions: [
      'Team Leadership: Trực tiếp phân chia task, định hướng giải pháp kỹ thuật, xử lý các sự cố application/database và review code toàn diện cho đội ngũ.',
      'Kiến trúc Autosave ngầm qua SignalR: Thí sinh đánh dấu câu trả lời nào, hệ thống chốt trạng thái tức thì; tự động reconnect và bù trừ đồng bộ ngay khi mạng phục hồi.',
      'Cú nhảy vọt 97% hiệu năng: Tái cấu trúc Database Schema, Index Tuning chuyên sâu và kích hoạt Parallel Batch Processing với .NET Task Parallel cho các tác vụ truy vấn và mã hóa/giải mã.',
      'Tối ưu pipeline chấm thi OMR/OCR: Kết hợp xử lý song song tự động gán phòng thi và lô chấm, rút ngắn thời gian chấm bài từ 2 giờ xuống 15 phút (giảm 87%).',
      'Chuẩn an ninh Quốc gia Cấp độ 3: Áp dụng nghiêm ngặt các nguyên tắc OWASP Top 10 và mã hóa đề thi bằng chuẩn AES/ECC bảo vệ dữ liệu tối mật.',
    ],
    results: [
      'Giảm 97% thời gian xử lý dữ liệu 200.000 thí sinh: từ 15 phút rơi thẳng xuống 30 giây.',
      'Vận hành xuất sắc qua 2 đợt thi tại 10 địa phương, ~20 điểm thi với 20.000+ thí sinh kết nối real-time ổn định, 0 sự cố mất dữ liệu.',
      'Đóng gói Docker và thiết lập CI/CD pipeline tự động hóa quy trình build và triển khai lên Private Server (On-premise) của đơn vị chủ quản.',
    ],
    github: 'https://github.com/Loccao102',
    demo: 'https://github.com/Loccao102',
    color: '#00ff88',
  },
  {
    id: 'fintech-payment',
    bayNumber: 'BAY_02',
    title: 'Hệ sinh thái Core Product & Payment Platform (myG)',
    subtitle: 'FinTech Payment • Factory & Strategy Pattern • Idempotent API • Webhook Retry 95%',
    tagline: 'Vận hành dòng tiền 10 tỷ VNĐ trong 2 tháng, phục vụ 50.000–100.000 giao dịch/tháng với độ tin cậy tự phục hồi.',
    category: 'FinTech & Payment Gateway',
    year: '2026',
    tags: ['ASP.NET Core', 'C#', 'SQL Server', 'REST API', 'VTC Pay', 'MoMo', 'SePay', 'Redis'],
    problem:
      'Lưu lượng giao dịch thanh toán tăng vọt lên 50.000–100.000 giao dịch/tháng qua các cổng VTC Pay, MoMo, SePay. Hệ thống đối mặt với tình trạng timeout mạng từ đối tác thứ ba, nguy cơ duplicate transaction (trừ tiền trùng lặp) và nghẽn luồng xử lý chính khi phân phối mã thẻ/OTP hàng loạt.',
    solution:
      'Chuẩn hóa kiến trúc thanh toán bằng Factory & Strategy Pattern; xây dựng cơ chế Idempotent API và Webhook Retry tự động; chuyển đổi quy trình phân phối mã sang Batch Processing kết hợp SMS và Zalo OA; xây dựng module CMS Retry quản lý hơn 500.000 transaction logs.',
    decisions: [
      'Chuẩn hóa Factory & Strategy Pattern: Rút ngắn thời gian tích hợp một cổng thanh toán mới từ nhiều ngày xuống vài giờ cấu hình mà không làm biến động payment flow hiện hữu.',
      'Idempotent API & Webhook Retry: Tự động phục hồi khi đối tác timeout, đạt 95% retry success rate và kiểm soát chặt chẽ duplicate transaction ở mức 2%.',
      'Batch Processing phân phối mã: Thay thế cơ chế gửi email đơn lẻ sang xử lý lô kết hợp SMS/Zalo OA, xử lý 1.000 lượt gửi trong 10-15 phút không làm nghẽn luồng chính.',
      'CMS Transaction Retry Module: Quản trị 500.000 transaction logs và 1.000+ giao dịch phát sinh/ngày, hỗ trợ đội ngũ vận hành theo dõi và kích hoạt retry lỗi tức thì.',
      'Xây dựng 10+ REST APIs trên Graph: Cung cấp dữ liệu tài khoản, giao dịch nạp tiền, revenue sharing và thông tin người dùng cho đối tác thứ ba.',
    ],
    results: [
      'Hệ thống ghi nhận an toàn khoảng 10 tỷ đồng giá trị giao dịch trong 2 tháng đầu triển khai production.',
      'Xử lý mượt mà 50.000–100.000 giao dịch/tháng, tỷ lệ lỗi do timeout đối tác giảm thiểu tối đa nhờ cơ chế tự phục hồi.',
    ],
    github: 'https://github.com/Loccao102',
    demo: 'https://github.com/Loccao102',
    color: '#00f3ff',
  },
  {
    id: 'e-government',
    bayNumber: 'BAY_03',
    title: 'Hệ thống Dịch vụ công Trực tuyến Mức độ 4 (NIQ Việt Nam)',
    subtitle: 'Chính phủ số • Liên thông Sở Ban Ngành • Tích hợp VNeID & Cổng Dịch vụ công Quốc gia',
    tagline: 'Chuyển đổi số toàn diện các thủ tục hành chính phức tạp thành quy trình số minh bạch, thân thiện cho công dân.',
    category: 'E-Government & Distributed Integration',
    year: '2026',
    tags: ['.NET Core', 'SQL Server', 'Angular', 'RESTful API', 'VNeID Integration'],
    problem:
      'Hồ sơ hành chính liên thông giữa các Sở, Ban, Ngành (Hà Nội, Thái Nguyên, Bộ Văn Hóa) cực kỳ rườm rà, nhiều tầng nấc phê duyệt. Dự án đòi hỏi tiến độ gắt gao (Fast-paced environment) và bắt buộc phải tích hợp chuẩn xác với các hệ thống cơ sở dữ liệu quốc gia.',
    solution:
      'Trực tiếp phát triển các phân hệ cốt lõi xử lý luồng hồ sơ hành chính liên thông đa cấp; đồng bộ dữ liệu và tích hợp sâu với Cổng Dịch vụ công Quốc gia, Hệ thống định danh điện tử Quốc gia (VNeID) và các cổng thanh toán hành chính công.',
    decisions: [
      'Core Team nòng cốt: Phối hợp chặt chẽ trong Core Team (5–7 kỹ sư) và làm việc đa bên trong dự án tổng quy mô lên tới 30 nhân sự.',
      'Luồng hồ sơ liên thông bất biến: Thiết kế máy trạng thái (State Machine) quản lý trạng thái hồ sơ qua từng cấp xét duyệt, đảm bảo tính minh bạch và có thể truy vết.',
      'Tích hợp sâu hạ tầng Quốc gia: Kết nối API an toàn với Cổng Dịch vụ công Quốc gia và VNeID, xóa bỏ việc nhập liệu thủ công cho công dân.',
    ],
    results: [
      'Chuyển đổi số thành công các thủ tục hành chính phức tạp sang giao diện thân thiện, rút ngắn thời gian xử lý hồ sơ cho người dân và cán bộ nhà nước.',
      'Đảm bảo tính sẵn sàng, an toàn dữ liệu và tuân thủ các quy chuẩn kỹ thuật chính phủ số.',
    ],
    github: 'https://github.com/Loccao102',
    demo: 'https://github.com/Loccao102',
    color: '#ffaa00',
  },
  {
    id: 'weather-warning',
    bayNumber: 'BAY_04',
    title: 'Hệ thống Dự báo Áp thấp Nhiệt đới & Bão (Cục KTTV)',
    subtitle: 'Big Data chuỗi thời gian • 5 Triệu+ bản ghi cảm biến • Cảnh báo 12 ngưỡng • Bản đồ GIS',
    tagline: 'Giám sát khí tượng tự động 24/7 và cảnh báo bão sớm trên nền dữ liệu 5 triệu bản ghi chuỗi thời gian.',
    category: 'Data-Intensive & GIS Analytics',
    year: '2025',
    tags: ['ASP.NET Core', 'C#', 'SQL Server', 'GIS Mapping', 'Redis', 'Background Service'],
    problem:
      'Dữ liệu khí tượng thời tiết từ Trạm Khí tượng Thủy văn Quốc gia gửi về liên tục với 12 yếu tố/ngưỡng phức tạp. Cần phát hiện dấu hiệu bất thường của áp thấp nhiệt đới và bão để cảnh báo sớm cho cộng đồng trên nền dữ liệu lịch sử hàng triệu bản ghi.',
    solution:
      'Xây dựng ASP.NET Core Background Service tự động thu thập và xử lý dữ liệu mỗi 10 phút; quản trị tập dữ liệu chuỗi thời gian 5 triệu bản ghi và xây dựng API trực quan hóa đường đi của bão trên bản đồ GIS.',
    decisions: [
      'Background Service tự hành: Tự động kết nối REST API của Trạm Khí tượng Thủy văn Quốc gia với chu kỳ 10 phút/lần, xử lý và cập nhật dữ liệu liên tục.',
      'Cơ chế theo dõi 12 ngưỡng khí tượng: Tự động kiểm tra dữ liệu, phát hiện các yếu tố bất thường (gió, áp suất, lượng mưa) và ghi nhận trạng thái cảnh báo theo thời gian thực.',
      'API trực quan hóa GIS: Cung cấp dữ liệu khí tượng và lịch sử di chuyển phục vụ chức năng hiển thị và theo dõi bão trực tiếp trên bản đồ số GIS.',
      'Quản trị Time-series 5M+ bản ghi: Thiết kế cơ sở dữ liệu chuỗi thời gian cho phép tổng hợp, thống kê và khai thác lịch sử 6 tháng với độ trễ cực thấp.',
    ],
    results: [
      'Hệ thống thu thập và xử lý an toàn hơn 5 triệu bản ghi dữ liệu cảm biến khí tượng trong 6 tháng.',
      'Cung cấp công cụ phân tích và trực quan hóa tin cậy, hỗ trợ đắc lực các chuyên gia đưa ra dự báo thiên tai kịp thời.',
    ],
    github: 'https://github.com/Loccao102',
    demo: 'https://github.com/Loccao102',
    color: '#ec4899',
  },
  {
    id: 'realtime-game',
    bayNumber: 'BAY_05',
    title: 'Engine Game Bài Real-Time Wewin / MonkeyCard (myG)',
    subtitle: 'Socket.io • Java Spring • Redis State Sync • Đồng bộ trận đấu mili-giây',
    tagline: 'Giao tiếp Socket real-time chịu tải cao, đồng bộ trạng thái trận đấu tức thì giữa Client và Backend.',
    category: 'Real-time Gaming & Socket Communication',
    year: '2026',
    tags: ['Socket.io', 'Java Spring', 'Redis', 'MySQL', 'Cocos2d'],
    problem:
      'Hệ thống game trực tuyến nhiều người chơi đòi hỏi dữ liệu truyền tải real-time qua từng mili-giây. Bất kỳ độ trễ hoặc lỗi đồng bộ trạng thái nào cũng có thể dẫn đến việc lệch ván bài, gây ức chế cho người chơi.',
    solution:
      'Phụ trách phát triển và duy trì Socket communication; xây dựng game logic và luồng sự kiện trận đấu phía Backend; phối hợp với Game Client để thống nhất event flow và cơ chế đồng bộ trạng thái.',
    decisions: [
      'Socket Communication: Thiết lập đường truyền Socket.io ổn định, xử lý kết nối, ngắt kết nối và phục hồi phiên chơi tức thì.',
      'Game Logic Server-Side: Toàn bộ luật chơi, tính điểm và trạng thái trận đấu được kiểm soát chặt chẽ phía Backend để loại trừ gian lận.',
      'Cơ chế đồng bộ trạng thái: Sử dụng Redis làm bộ đệm trao đổi dữ liệu tốc độ cao, đảm bảo tất cả người chơi trong phòng nhận sự kiện đồng thời.',
    ],
    results: [
      'Vận hành ổn định các ván bài thời gian thực với độ trễ tối thiểu, triệt tiêu 100% tình trạng desync giữa client và server.',
    ],
    github: 'https://github.com/Loccao102',
    demo: 'https://github.com/Loccao102',
    color: '#a855f7',
  },
];

