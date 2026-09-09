export type Language = 'vi' | 'en';

export const i18n = {
  vi: {
    // General
    loading: 'ĐANG TẢI...',
    start: 'BẮT ĐẦU',
    online: 'TRỰC TUYẾN',
    emote: '1 2 3 4 - Biểu cảm',

    // Header & Identity
    heroTitle: 'CAO TIẾN LỘC',
    heroSubtitle: '.NET FULLSTACK DEVELOPER // BACKEND & HỆ THỐNG CAO TẢI',

    // Top Navigation Tabs
    navAbout: 'GIỚI THIỆU',
    navTech: 'KỸ NĂNG',
    navProjects: 'DỰ ÁN',
    navContact: 'LIÊN HỆ',
    quickViewBtn: 'XEM NHANH (CV)',

    // Theme Switcher
    themeDay: 'NGÀY',
    themeDark: 'TỐI',
    themeNeon: 'NEON',

    // UI Modes & Audio Controls
    zenModeTitle: 'Chế độ tập trung lái xe (Phím H)',
    zenModeCollapse: 'THU GỌN (H)',
    zenModeExpand: 'HIỆN GIAO DIỆN (H)',
    lofiTitle: 'Đài Lo-fi Chillwave',
    lofiOn: 'LO-FI: BẬT',
    lofiOff: 'LO-FI: TẮT',
    soundTitle: 'Hiệu ứng âm thanh',
    soundOn: 'SFX: BẬT',
    soundOff: 'SFX: TẮT',
    qualityHD: 'HD',
    qualityLite: 'LITE',

    // Controls Guide Box
    controlsTitle: 'HƯỚNG DẪN LÁI XE',
    drive: 'W A S D / MŨI TÊN - Lái & Lùi xe',
    boost: 'SHIFT - Bứt tốc Nitro',
    brake: 'SPACE - Phanh dừng xe',
    reset: 'R - Đặt lại vị trí xe',
    inspect: 'E - Xem chi tiết trạm',
    toggleZen: 'H - Ẩn / Hiện giao diện',

    // Telemetry & Circuit
    speed: 'VẬN TỐC',
    kmh: 'km/h',
    callsign: 'TÊN HIỆU',
    speedCircuit: 'TRƯỜNG ĐUA F1',
    lap: 'VÒNG',
    lapTime: 'THỜI GIAN',
    bestRecord: 'KỶ LỤC',
    sectors: 'CÁC CHẶNG',
    landmarksVisited: 'ĐIỂM ĐÃ KHÁM PHÁ',

    // Interactive District Banner
    districtReached: 'ĐÃ TIẾN VÀO TRẠM',
    inspectHintDesktop: 'BẤM [E] HOẶC CLICK ĐỂ XEM CHI TIẾT',
    inspectHintMobile: 'CHẠM ĐỂ XEM CHI TIẾT DỰ ÁN 📄',
    closeHint: '[E] / [ESC] HOẶC BẤM ĐÓNG ĐỂ TIẾP TỤC',
    continueDriving: 'TIẾP TỤC LÁI XE',

    // Portfolio Sections
    whoIsLoc: 'CAO TIẾN LỘC LÀ AI?',
    careerTimeline: 'LỊCH SỬ KINH NGHIỆM & SỰ NGHIỆP',
    primaryFocus: 'ĐỊNH HƯỚNG KỸ THUẬT TRỌNG TÂM',
    locationLabel: 'ĐỊA ĐIỂM: VIỆT NAM',
    availableLabel: 'SẴN SÀNG NHẬN DỰ ÁN MỚI',

    // Case Studies & Projects
    problemLabel: 'BỐI CẢNH & VẤN ĐỀ:',
    solutionLabel: 'GIẢI PHÁP KIẾN TRÚC:',
    decisionsLabel: 'QUYẾT ĐỊNH KỸ THUẬT CỐT LÕI:',
    resultsLabel: 'KẾT QUẢ ĐẠT ĐƯỢC:',

    // Chat
    noMessages: 'Chưa có tin nhắn nào...',
    typeMessage: 'Nhập tin nhắn (Enter để gửi)...',
    pressEnterToChat: 'Bấm Enter để trò chuyện',

    // Districts Names
    districts: {
      about: {
        title: 'TRẠM THÔNG TIN',
        subtitle: 'Bản sắc & Triết lý Nền móng',
      },
      tech: {
        title: 'VIỆN CÔNG NGHỆ',
        subtitle: 'Làm chủ .NET & Dữ liệu Lớn',
      },
      projects: {
        title: 'GARAGE THỰC CHIẾN',
        subtitle: 'Hệ thống Triệu Bản ghi & 10 Tỷ VNĐ',
      },
      experiments: {
        title: 'PHÒNG THÍ NGHIỆM',
        subtitle: 'Real-time Sockets & Đòn bẩy AI',
      },
      contact: {
        title: 'TRẠM KẾT NỐI',
        subtitle: 'Cơ hội Hợp tác & Tuyển dụng',
      },
    },
  },

  en: {
    // General
    loading: 'LOADING...',
    start: 'START',
    online: 'ONLINE',
    emote: '1 2 3 4 - Emotes',

    // Header & Identity
    heroTitle: 'CAO TIEN LOC',
    heroSubtitle: '.NET FULLSTACK DEVELOPER // BACKEND & HIGH CONCURRENCY',

    // Top Navigation Tabs
    navAbout: 'ABOUT',
    navTech: 'TECH',
    navProjects: 'PROJECTS',
    navContact: 'CONTACT',
    quickViewBtn: 'QUICK VIEW (CV)',

    // Theme Switcher
    themeDay: 'DAY',
    themeDark: 'DARK',
    themeNeon: 'NEON',

    // UI Modes & Audio Controls
    zenModeTitle: 'Focused Driving Zen Mode (Key H)',
    zenModeCollapse: 'FOCUS (H)',
    zenModeExpand: 'SHOW HUD (H)',
    lofiTitle: 'Chillwave Lo-fi Radio',
    lofiOn: 'LO-FI: ON',
    lofiOff: 'LO-FI: OFF',
    soundTitle: 'Sound Effects SFX',
    soundOn: 'SFX: ON',
    soundOff: 'SFX: OFF',
    qualityHD: 'HD',
    qualityLite: 'LITE',

    // Controls Guide Box
    controlsTitle: 'DRIVING CONTROLS',
    drive: 'W A S D / ARROWS - Drive & Reverse',
    boost: 'SHIFT - Nitro Turbo Boost',
    brake: 'SPACE - Handbrake Stop',
    reset: 'R - Reset Vehicle Pose',
    inspect: 'E - Inspect District',
    toggleZen: 'H - Toggle HUD / Focus',

    // Telemetry & Circuit
    speed: 'VELOCITY',
    kmh: 'km/h',
    callsign: 'CALLSIGN',
    speedCircuit: 'SPEED CIRCUIT',
    lap: 'LAP',
    lapTime: 'TIME',
    bestRecord: 'RECORD',
    sectors: 'SECTORS',
    landmarksVisited: 'LANDMARKS VISITED',

    // Interactive District Banner
    districtReached: 'DISTRICT REACHED',
    inspectHintDesktop: 'PRESS [E] OR CLICK TO INSPECT',
    inspectHintMobile: 'TAP TO VIEW DISTRICT INTEL 📄',
    closeHint: '[E] / [ESC] OR CLOSE TO RESUME',
    continueDriving: 'CONTINUE EXPLORING',

    // Portfolio Sections
    whoIsLoc: 'WHO IS CAO TIEN LOC?',
    careerTimeline: 'CAREER TIMELINE & TRACK RECORD',
    primaryFocus: 'PRIMARY TECHNICAL FOCUS',
    locationLabel: 'LOCATION: VIETNAM',
    availableLabel: 'AVAILABLE FOR HIRE',

    // Case Studies & Projects
    problemLabel: 'PROBLEM & CONTEXT:',
    solutionLabel: 'ENGINEERING SOLUTION:',
    decisionsLabel: 'CORE ARCHITECTURAL DECISIONS:',
    resultsLabel: 'KEY METRICS & RESULTS:',

    // Chat
    noMessages: 'No messages yet...',
    typeMessage: 'Type message (Enter to send)...',
    pressEnterToChat: 'Press Enter to chat',

    // Districts Names
    districts: {
      about: {
        title: 'ABOUT DISTRICT',
        subtitle: 'Engineering Philosophy & Core',
      },
      tech: {
        title: 'TECH LAB',
        subtitle: 'Mastery in .NET & Big Data',
      },
      projects: {
        title: 'PROVING GROUNDS',
        subtitle: 'High-Concurrency & 10B VNĐ FinTech',
      },
      experiments: {
        title: 'EXPERIMENT LAB',
        subtitle: 'Real-time Sockets & AI Augmentation',
      },
      contact: {
        title: 'CONTACT STATION',
        subtitle: 'Opportunities & Technical Leadership',
      },
    },
  },
};
