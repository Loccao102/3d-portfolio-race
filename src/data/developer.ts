export interface DeveloperProfile {
  name: string;
  role: string;
  location: string;
  status: string;
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
    telegram?: string;
  };
  stats: { label: string; value: string }[];
  experience: {
    period: string;
    role: string;
    company: string;
    highlights: string[];
  }[];
}

export const developerData: DeveloperProfile = {
  name: 'Cao Tien Loc',
  role: 'Senior Creative Developer / WebGL & Fullstack Engineer',
  location: 'Vietnam',
  status: 'Open for high-impact creative engineering opportunities',
  bio: [
    'I build interactive digital experiences that bridge the gap between creative storytelling and robust software engineering.',
    'Specializing in WebGL, Three.js, React Three Fiber, high-concurrency backend architectures (.NET / Node.js), and performant web applications.',
    'I believe websites shouldn’t just inform—they should evoke a memorable emotion within the first 10 seconds of interaction.',
  ],
  focus: [
    'Interactive 3D WebGL & Creative Diorama Experiences',
    'High-Performance Realtime Client-Server Systems',
    'Game-Feel & Micro-Interactions in Modern Web UX',
    'Clean System Architecture & Maintainable Codebases',
  ],
  skills: [
    {
      category: 'Creative Tech & 3D',
      items: [
        { name: 'WebGL / Three.js', level: 'Advanced' },
        { name: 'React Three Fiber & Drei', level: 'Advanced' },
        { name: 'Rapier 3D Physics', level: 'Proficient' },
        { name: 'GLSL Shaders & Postprocessing', level: 'Intermediate' },
        { name: 'Blender Low-Poly Modeling', level: 'Intermediate' },
      ],
    },
    {
      category: 'Frontend Architecture',
      items: [
        { name: 'React 19 / Next.js (App Router)', level: 'Expert' },
        { name: 'TypeScript', level: 'Expert' },
        { name: 'Tailwind CSS / Motion', level: 'Advanced' },
        { name: 'Zustand / Redux Toolkit', level: 'Advanced' },
        { name: 'Performance Optimization & Web Vitals', level: 'Advanced' },
      ],
    },
    {
      category: 'Backend & Cloud Systems',
      items: [
        { name: '.NET Core / ASP.NET', level: 'Advanced' },
        { name: 'Node.js / Express / NestJS', level: 'Advanced' },
        { name: 'PostgreSQL / Redis / SQL Server', level: 'Advanced' },
        { name: 'Docker / CI/CD Pipelines', level: 'Proficient' },
        { name: 'WebSockets / Realtime Streaming', level: 'Advanced' },
      ],
    },
  ],
  contacts: {
    github: 'https://github.com/Loccao102',
    linkedin: 'https://linkedin.com',
    email: 'caotienloc.dev@gmail.com',
    telegram: 'https://t.me',
  },
  stats: [
    { label: 'ENGINEERING EXP', value: '4+ Years' },
    { label: 'CLIENTS & USERS', value: '450K+' },
    { label: 'SHIPPED SYSTEMS', value: '15+ Apps' },
    { label: 'WEBGL TARGET', value: '60 FPS' },
  ],
  experience: [
    {
      period: '2023 — PRESENT',
      role: 'Lead Creative Developer & WebGL Architect',
      company: 'Interactive Tech Studio',
      highlights: [
        'Architected high-performance WebGL 3D diorama and interactive product showcases in Three.js and React Three Fiber.',
        'Engineered procedural asset loaders, memory management pipelines, and adaptive low-end mobile shaders.',
        'Boosted average user engagement duration by 320% across digital campaign launches.',
      ],
    },
    {
      period: '2021 — 2023',
      role: 'Fullstack Systems Engineer (.NET & React)',
      company: 'Enterprise Learning Platform',
      highlights: [
        'Constructed high-concurrency online examination infrastructure serving 450,000+ test submissions with zero data loss.',
        'Optimized Redis distributed caching and WebSocket real-time proctoring clusters, slashing latency below 50ms.',
        'Mentored junior engineers and established CI/CD automated test suites for mission-critical services.',
      ],
    },
  ],
};

