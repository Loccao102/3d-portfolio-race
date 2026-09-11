export type DistrictExperienceId = 'about' | 'tech' | 'projects' | 'experiments' | 'contact';

export type DistrictExperience = {
  id: DistrictExperienceId;
  title: string;
  eyebrow: string;
  summary: string;
  arrivalPrompt: string;
  exitPrompt: string;
  accent: string;
  stopPosition: [number, number, number];
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
  holdSeconds: number;
  recruiterHeadline: string;
  recruiterPoints: string[];
};

export const TOUR_TRANSITION_SECONDS = 5;

export const DISTRICT_EXPERIENCES: DistrictExperience[] = [
  {
    id: 'about',
    title: 'About / Câu chuyện',
    eyebrow: '01 · PEOPLE / STORY',
    summary: 'Bắt đầu bằng con người trước công nghệ: mình là ai, mình thích xây hệ thống gì và cách mình nhìn một bài toán sản phẩm.',
    arrivalPrompt: 'Đi chậm qua cổng About để mở câu chuyện và timeline.',
    exitPrompt: 'Rời courtyard theo hướng Bắc để đến Tech Stack.',
    accent: '#f59e0b',
    stopPosition: [0, 0, 42],
    cameraPosition: [15, 10, 54],
    lookAt: [0, 3.5, 48],
    holdSeconds: 10,
    recruiterHeadline: 'Software Engineer thiên về backend, realtime và hệ thống có tải lớn.',
    recruiterPoints: [
      'Tập trung vào .NET / backend / full-stack.',
      'Ưu tiên kiến trúc, độ tin cậy và trải nghiệm vận hành.',
      'Biến portfolio thành một sản phẩm có thể khám phá thay vì một CV tĩnh.',
    ],
  },
  {
    id: 'tech',
    title: 'Tech Stack / Xưởng công nghệ',
    eyebrow: '02 · SYSTEMS / STACK',
    summary: 'Khu Tech gom những công nghệ thực sự dùng trong hệ thống: API, realtime, dữ liệu, container và runtime tooling.',
    arrivalPrompt: 'Đi vào data pagoda để xem các lớp công nghệ theo vai trò.',
    exitPrompt: 'Từ Tech, rẽ sang Project Garage để xem stack được dùng trong sản phẩm thật.',
    accent: '#22d3ee',
    stopPosition: [0, 0, -42],
    cameraPosition: [-16, 11, -54],
    lookAt: [0, 5, -50],
    holdSeconds: 12,
    recruiterHeadline: 'ASP.NET Core, React/TypeScript, SQL, realtime, Docker/K8s và service integration.',
    recruiterPoints: [
      'Backend-first nhưng làm được full-stack khi cần.',
      'Có kinh nghiệm Identity, API Gateway, WebSocket, job scheduling và dữ liệu.',
      'Quan tâm performance, observability và deployability thay vì chỉ code feature.',
    ],
  },
  {
    id: 'projects',
    title: 'Projects / Garage',
    eyebrow: '03 · PRODUCTS / IMPACT',
    summary: 'Mỗi project bay đại diện cho một hệ thống đã làm, vấn đề thật và quyết định kỹ thuật thật.',
    arrivalPrompt: 'Giảm tốc trước garage để mở project bay và xem case study.',
    exitPrompt: 'Rời garage về phía Tây để qua Experiment Lab.',
    accent: '#fb7185',
    stopPosition: [43, 0, 0],
    cameraPosition: [58, 10, 18],
    lookAt: [50, 3.5, 0],
    holdSeconds: 18,
    recruiterHeadline: 'Project nổi bật: hệ thống thi trực tuyến, realtime giám sát và xử lý dữ liệu quy mô lớn.',
    recruiterPoints: [
      'Thiết kế submit/autosave/realtime cho lượng người dùng lớn.',
      'Xử lý batch dữ liệu, job nền, mã hóa và nhiều service boundary.',
      'Case study tập trung vấn đề → quyết định → trade-off → kết quả.',
    ],
  },
  {
    id: 'experiments',
    title: 'Experiments / Phòng thử',
    eyebrow: '04 · AI / PROTOTYPES',
    summary: 'Khu Lab dành cho thử nghiệm có giá trị học tập: agent, automation, 3D web và security tooling.',
    arrivalPrompt: 'Đi vào lab ở tốc độ thấp để bật kinetic presentation.',
    exitPrompt: 'Quay lại trục chính và chạy về Contact Station.',
    accent: '#a855f7',
    stopPosition: [-43, 0, 0],
    cameraPosition: [-58, 11, -16],
    lookAt: [-50, 4, 0],
    holdSeconds: 12,
    recruiterHeadline: 'Thử nghiệm có chủ đích: AI agents, developer tooling, 3D interaction và security-oriented products.',
    recruiterPoints: [
      'Prototype để kiểm chứng ý tưởng, không chỉ để demo công nghệ.',
      'Ưu tiên repo/tool có thể dùng lại hoặc phát triển thành sản phẩm.',
      'Giữ ranh giới rõ giữa AI presentation và business authority.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact / Kết nối',
    eyebrow: '05 · NEXT STEP',
    summary: 'Kết thúc bằng CTA rõ ràng: Quick View, GitHub, CV hoặc liên hệ để trao đổi công việc.',
    arrivalPrompt: 'Dừng dưới signal lotus để mở thông tin liên hệ.',
    exitPrompt: 'Tour hoàn tất — quay lại Free Drive để khám phá tự do.',
    accent: '#38bdf8',
    stopPosition: [0, 0, -78],
    cameraPosition: [17, 12, -94],
    lookAt: [0, 5, -88],
    holdSeconds: 13,
    recruiterHeadline: 'Nếu cần một backend/full-stack developer có tư duy hệ thống, đây là điểm để kết nối.',
    recruiterPoints: [
      'Quick View luôn sẵn, không bắt recruiter phải hoàn thành game.',
      'GitHub / CV / contact được xem như CTA sản phẩm, không phải phần thưởng cuối game.',
      'Tour hoàn tất trong khoảng 90 giây rồi trả quyền điều khiển lại cho người xem.',
    ],
  },
];

export const TOUR_TOTAL_SECONDS = DISTRICT_EXPERIENCES.reduce(
  (total, district) => total + TOUR_TRANSITION_SECONDS + district.holdSeconds,
  0,
);

export const getDistrictExperience = (id: DistrictExperienceId) =>
  DISTRICT_EXPERIENCES.find((district) => district.id === id) ?? DISTRICT_EXPERIENCES[0];

export const getNextDistrictId = (id: DistrictExperienceId): DistrictExperienceId => {
  const index = DISTRICT_EXPERIENCES.findIndex((district) => district.id === id);
  return DISTRICT_EXPERIENCES[Math.min(index + 1, DISTRICT_EXPERIENCES.length - 1)].id;
};
