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
    id: 'online-exam-platform',
    bayNumber: 'BAY_01',
    title: 'High-Concurrency Online Examination System',
    subtitle: 'Real-time proctoring, instant grading & resilient exam runtime',
    tagline: 'Handling 450,000+ completed exam sessions with zero data loss.',
    category: 'Fullstack / Distributed Systems',
    year: '2024',
    tags: ['.NET 8', 'React', 'PostgreSQL', 'Redis', 'Docker', 'WebSockets'],
    problem:
      'Legacy online exam tools crashed under concurrent spikes (thousands of students submitting simultaneously at the exact last second) and suffered data loss during network dropouts.',
    solution:
      'Engineered an event-driven exam platform with distributed Redis caching, WebSocket heartbeat sync, and append-only local storage fallback.',
    decisions: [
      'Implemented optimistic UI with local IndexedDB autosave to guarantee student answers are preserved through client network disconnects.',
      'Adopted Redis Pub/Sub and memory-queued background workers for batch database writes, reducing DB lock contention by 85%.',
      'Designed a cheating-detection telemetry pipeline analyzing tab switching, mouse blur, and abnormal timing patterns.',
    ],
    results: [
      '450K+ exam submissions handled with 99.98% uptime.',
      'Sub-50ms latency for real-time exam status updates across 10,000 concurrent sockets.',
      'Eliminated exam data loss reports to 0 incidents.',
    ],
    github: 'https://github.com',
    demo: 'https://demo.example.com',
    color: '#00ff88',
  },
  {
    id: 'interactive-3d-portfolio',
    bayNumber: 'BAY_02',
    title: 'Cyberpunk Diorama Interactive 3D Portfolio',
    subtitle: 'Arcade vehicle physics & WebGL narrative playground',
    tagline: 'Transforming resume navigation into an unforgettable interactive game-feel experience.',
    category: 'Creative Tech / WebGL',
    year: '2025',
    tags: ['Three.js', 'React Three Fiber', 'Rapier Physics', 'Next.js 15', 'Tailwind'],
    problem:
      'Most developer portfolios are static, template-driven, and quickly forgotten within seconds of opening. Traditional 3D portfolios often suffer from poor mobile performance and difficult navigation.',
    solution:
      'Constructed a low-poly cyberpunk diorama where visitors drive an arcade vehicle through thematic districts, with an instant Quick View index for recruiters.',
    decisions: [
      'Engineered a custom Arcade RigidBody controller in Rapier with lateral friction damping and anti-flip rotation locks.',
      'Implemented a zero-allocation render loop in useFrame with static scratch vectors to prevent garbage collection frame drops.',
      'Architected a decoupled Zustand store to eliminate React re-renders during 60 FPS physics updates.',
    ],
    results: [
      'Solid 60 FPS on desktop and 50+ FPS on mid-range mobile devices.',
      'Zero external 3D asset downloads (100% procedural low-poly primitives).',
      'Average visitor session time increased by 4.2x compared to standard portfolio.',
    ],
    github: 'https://github.com/Loccao102/3d-portfolio-race',
    demo: 'https://demo.example.com',
    color: '#00f3ff',
  },
  {
    id: 'realtime-canvas-collaboration',
    bayNumber: 'BAY_03',
    title: 'Realtime Infinite Canvas Collaboration Engine',
    subtitle: 'Vector drawing, node networking & conflict-free multi-user sync',
    tagline: 'High-performance interactive whiteboard supporting 50+ simultaneous peers per board.',
    category: 'Frontend Engine / Realtime',
    year: '2024',
    tags: ['TypeScript', 'HTML5 Canvas', 'WebSockets', 'CRDTs', 'Node.js'],
    problem:
      'DOM-based whiteboard applications become sluggish with thousands of rendered nodes, and distributed concurrent edits frequently cause state desynchronization.',
    solution:
      'Built a hybrid WebGL/2D Canvas rendering pipeline with quadtree spatial indexing and CRDT (Conflict-Free Replicated Data Type) synchronization.',
    decisions: [
      'Employed viewport culling and level-of-detail (LOD) caching to maintain 60 FPS rendering with 20,000+ objects on canvas.',
      'Utilized state-based CRDTs over WebSockets for conflict-free state merging across high-latency clients.',
      'Designed an undo/redo delta stack with negligible memory footprint.',
    ],
    results: [
      'Smooth 60 FPS pan and zoom on massive diagrams with 25K+ vector shapes.',
      'Sub-30ms peer cursor interpolation with zero rubber-banding.',
      'Adopted by internal teams for architectural diagramming and sprint brainstorms.',
    ],
    github: 'https://github.com',
    demo: 'https://demo.example.com',
    color: '#ffaa00',
  },
];

