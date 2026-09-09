export type Language = 'vi' | 'en';

export const i18n = {
  vi: {
    // General
    loading: 'ĐANG TẢI...',
    start: 'BẮT ĐẦU',
    
    // UI HUD
    speed: 'TỐC ĐỘ',
    online: 'TRỰC TUYẾN',
    pressEnterToChat: 'Nhấn Enter để chat',
    typeMessage: 'Nhập tin nhắn... (Esc để hủy)',
    noMessages: 'Chưa có tin nhắn. Hãy gửi lời chào!',
    
    // Instructions
    controlsTitle: 'ĐIỀU KHIỂN',
    drive: 'W A S D / MŨI TÊN - Lái xe',
    boost: 'SHIFT - Tăng tốc',
    brake: 'SPACE - Phanh',
    emote: '1 2 3 4 - Biểu cảm',
    
    // Districts
    heroTitle: 'LỘC CAO',
    heroSubtitle: 'KỸ SƯ PHẦN MỀM',
    
    districts: {
      about: {
        title: 'KHÁM PHÁ',
        subtitle: 'Bản sắc & Hành trình'
      },
      tech: {
        title: 'HỌC HỎI',
        subtitle: 'Kỹ năng & Tri thức'
      },
      projects: {
        title: 'XÂY DỰNG',
        subtitle: 'Kiến tạo giá trị thật'
      },
      experiments: {
        title: 'SÁNG TẠO',
        subtitle: 'Ý tưởng & Đột phá'
      },
      contact: {
        title: 'KẾT NỐI',
        subtitle: 'Cộng đồng & Hợp tác'
      }
    }
  },
  en: {
    // General
    loading: 'LOADING...',
    start: 'START',
    
    // UI HUD
    speed: 'SPEED',
    online: 'ONLINE',
    pressEnterToChat: 'Press Enter to chat',
    typeMessage: 'Type message... (Esc to cancel)',
    noMessages: 'No messages yet. Say hello!',
    
    // Instructions
    controlsTitle: 'CONTROLS',
    drive: 'W A S D / ARROWS - Drive',
    boost: 'SHIFT - Boost',
    brake: 'SPACE - Brake',
    emote: '1 2 3 4 - Emote',
    
    // Districts
    heroTitle: 'LOC CAO',
    heroSubtitle: 'SOFTWARE ENGINEER',
    
    districts: {
      about: {
        title: 'EXPLORE',
        subtitle: 'Identity & Journey'
      },
      tech: {
        title: 'LEARN',
        subtitle: 'Skills & Knowledge'
      },
      projects: {
        title: 'BUILD',
        subtitle: 'Create Real Value'
      },
      experiments: {
        title: 'CREATE',
        subtitle: 'Ideas & Innovation'
      },
      contact: {
        title: 'CONNECT',
        subtitle: 'Community & Collab'
      }
    }
  }
};
