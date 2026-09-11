import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useGameStore } from '@/stores/useGameStore';

type Vec3 = [number, number, number];

type DistrictGateway = {
  id: string;
  title: string;
  subtitle: string;
  position: Vec3;
  rotation?: Vec3;
  accent: string;
};

const DISTRICT_GATEWAYS: DistrictGateway[] = [
  {
    id: 'about',
    title: 'ABOUT / CHUYỆN CỦA LỘC',
    subtitle: 'people • story • purpose',
    position: [0, 5.8, 27.5],
    accent: '#f59e0b',
  },
  {
    id: 'tech',
    title: 'TECH STACK / XƯỞNG CÔNG NGHỆ',
    subtitle: 'backend • realtime • cloud',
    position: [0, 6.2, -27.5],
    rotation: [0, Math.PI, 0],
    accent: '#22d3ee',
  },
  {
    id: 'projects',
    title: 'PROJECTS / GARAGE',
    subtitle: 'products • systems • impact',
    position: [31.5, 6.0, 0],
    rotation: [0, -Math.PI / 2, 0],
    accent: '#f472b6',
  },
  {
    id: 'experiments',
    title: 'EXPERIMENTS / PHÒNG THỬ',
    subtitle: 'ideas • ai • prototypes',
    position: [-31.5, 6.0, 0],
    rotation: [0, Math.PI / 2, 0],
    accent: '#a78bfa',
  },
  {
    id: 'contact',
    title: 'CONTACT / KẾT NỐI',
    subtitle: 'build something useful',
    position: [0, 7.0, -63],
    rotation: [0, Math.PI, 0],
    accent: '#38bdf8',
  },
];

const LAMP_POSITIONS: Array<{ position: Vec3; rotation?: Vec3 }> = [
  { position: [-7.4, 0, 18] },
  { position: [7.4, 0, 18] },
  { position: [-7.4, 0, -18] },
  { position: [7.4, 0, -18] },
  { position: [-28, 0, 7.3], rotation: [0, Math.PI / 2, 0] },
  { position: [28, 0, 7.3], rotation: [0, Math.PI / 2, 0] },
  { position: [-28, 0, -7.3], rotation: [0, Math.PI / 2, 0] },
  { position: [28, 0, -7.3], rotation: [0, Math.PI / 2, 0] },
  { position: [-7.4, 0, 55] },
  { position: [7.4, 0, 55] },
  { position: [-7.4, 0, -55] },
  { position: [7.4, 0, -55] },
];

const LANTERN_STRINGS: Array<{ start: Vec3; end: Vec3 }> = [
  { start: [-17, 6.5, 31], end: [17, 6.5, 31] },
  { start: [-17, 7.3, 47], end: [17, 7.3, 47] },
  { start: [-57, 6.8, -20], end: [-57, 6.8, 20] },
];

const SKYLINE_LAYOUT: Array<{
  position: Vec3;
  size: Vec3;
  accent: string;
}> = [
  { position: [-70, 14, -66], size: [10, 28, 11], accent: '#22d3ee' },
  { position: [-58, 19, -74], size: [9, 38, 9], accent: '#f59e0b' },
  { position: [-43, 12, -72], size: [12, 24, 10], accent: '#38bdf8' },
  { position: [-27, 22, -78], size: [10, 44, 10], accent: '#a78bfa' },
  { position: [-12, 16, -82], size: [11, 32, 11], accent: '#f472b6' },
  { position: [14, 21, -82], size: [12, 42, 12], accent: '#22d3ee' },
  { position: [31, 13, -78], size: [10, 26, 10], accent: '#f59e0b' },
  { position: [48, 18, -74], size: [11, 36, 11], accent: '#f472b6' },
  { position: [64, 12, -68], size: [12, 24, 12], accent: '#38bdf8' },
  { position: [-70, 11, 60], size: [11, 22, 10], accent: '#f59e0b' },
  { position: [-55, 16, 67], size: [10, 32, 10], accent: '#22d3ee' },
  { position: [55, 15, 66], size: [10, 30, 10], accent: '#a78bfa' },
  { position: [70, 11, 58], size: [11, 22, 10], accent: '#f472b6' },
];

function StreetLamp({ position, rotation = [0, 0, 0] }: { position: Vec3; rotation?: Vec3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 4.2, 8]} />
        <meshStandardMaterial color="#182033" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.65, 4.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.3, 8]} />
        <meshStandardMaterial color="#26334c" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.25, 3.95, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={2.4} />
      </mesh>
      <pointLight position={[1.25, 3.9, 0]} color="#fbbf24" intensity={2.3} distance={11} decay={2} />
    </group>
  );
}

function LanternString({ start, end }: { start: Vec3; end: Vec3 }) {
  const lanterns = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const t = index / 6;
      return [
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t - Math.sin(t * Math.PI) * 0.7,
        start[2] + (end[2] - start[2]) * t,
      ] as Vec3;
    });
  }, [start, end]);

  const mid: Vec3 = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 - 0.35,
    (start[2] + end[2]) / 2,
  ];
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);

  return (
    <group>
      <mesh position={mid} rotation={[0, -angle, 0]}>
        <boxGeometry args={[length, 0.025, 0.025]} />
        <meshBasicMaterial color="#1f2937" />
      </mesh>
      {lanterns.map((position, index) => (
        <group key={`${position.join('-')}-${index}`} position={position}>
          <mesh position={[0, -0.28, 0]}>
            <sphereGeometry args={[0.22, 12, 10]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.7} roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.52, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.18, 6]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SkylineTower({ position, size, accent }: { position: Vec3; size: Vec3; accent: string }) {
  const stripeCount = Math.max(3, Math.floor(size[1] / 7));
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#0c1424" roughness={0.48} metalness={0.55} />
      </mesh>
      {Array.from({ length: stripeCount }, (_, index) => {
        const y = -size[1] / 2 + 3 + index * ((size[1] - 6) / Math.max(1, stripeCount - 1));
        return (
          <mesh key={index} position={[0, y, size[2] / 2 + 0.012]}>
            <planeGeometry args={[size[0] * 0.68, 0.16]} />
            <meshBasicMaterial color={accent} transparent opacity={0.55} />
          </mesh>
        );
      })}
      <mesh position={[0, size[1] / 2 + 0.3, 0]}>
        <boxGeometry args={[size[0] * 0.72, 0.16, size[2] * 0.72]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

function DistrictGateway({ gateway }: { gateway: DistrictGateway }) {
  return (
    <group position={gateway.position} rotation={gateway.rotation ?? [0, 0, 0]}>
      <mesh position={[-5.8, -2.4, 0]} castShadow>
        <boxGeometry args={[0.34, 5.1, 0.34]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[5.8, -2.4, 0]} castShadow>
        <boxGeometry args={[0.34, 5.1, 0.34]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[12, 1.65, 0.36]} />
        <meshStandardMaterial color="#080d17" metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.2]}>
        <planeGeometry args={[11.5, 1.2]} />
        <meshBasicMaterial color={gateway.accent} transparent opacity={0.16} />
      </mesh>
      <mesh position={[0, -0.68, 0.23]}>
        <boxGeometry args={[10.8, 0.055, 0.03]} />
        <meshBasicMaterial color={gateway.accent} />
      </mesh>
      <pointLight position={[0, 0.2, 1.4]} color={gateway.accent} intensity={2.4} distance={11} />
      <Html center distanceFactor={20} position={[0, 0.06, 0.26]} className="pointer-events-none select-none">
        <div
          className="min-w-[240px] rounded-md border px-3 py-1.5 text-center font-mono uppercase tracking-[0.16em] shadow-2xl backdrop-blur-md"
          style={{
            borderColor: `${gateway.accent}66`,
            background: 'rgba(5, 10, 18, 0.82)',
            boxShadow: `0 0 28px ${gateway.accent}33`,
          }}
        >
          <div className="text-[11px] font-black text-white">{gateway.title}</div>
          <div className="mt-0.5 text-[8px] text-slate-400">{gateway.subtitle}</div>
        </div>
      </Html>
    </group>
  );
}

function VietnamCorner() {
  return (
    <group position={[-60, 0, 42]}>
      <mesh receiveShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[18, 0.35, 13]} />
        <meshStandardMaterial color="#22201d" roughness={0.9} metalness={0.05} />
      </mesh>

      <group position={[-4.8, 0.35, 0]}>
        <mesh castShadow position={[0, 2.2, 0]}>
          <boxGeometry args={[7.6, 4.4, 5.2]} />
          <meshStandardMaterial color="#3a2d25" roughness={0.86} />
        </mesh>
        <mesh castShadow position={[0, 4.7, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[5.4, 0.35, 5.8]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.78} />
        </mesh>
        <mesh position={[0, 2.8, 2.63]}>
          <planeGeometry args={[5.2, 1.1]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.18} />
        </mesh>
        <Html center distanceFactor={18} position={[0, 2.85, 2.72]} className="pointer-events-none select-none">
          <div className="rounded border border-amber-400/40 bg-black/75 px-3 py-1.5 text-center font-mono shadow-[0_0_24px_rgba(245,158,11,0.2)]">
            <div className="text-[11px] font-black tracking-[0.22em] text-amber-200">CÀ PHÊ & CODE</div>
            <div className="text-[8px] tracking-widest text-slate-400">ý tưởng bắt đầu từ một chiếc bàn nhỏ</div>
          </div>
        </Html>
      </group>

      <group position={[5.7, 0.35, -1.2]}>
        <mesh castShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[5.8, 5, 4.4]} />
          <meshStandardMaterial color="#1f2937" roughness={0.72} metalness={0.12} />
        </mesh>
        <mesh position={[0, 3.0, 2.23]}>
          <planeGeometry args={[4.4, 1.65]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
        <Html center distanceFactor={20} position={[0, 3.0, 2.3]} className="pointer-events-none select-none">
          <div className="text-center font-sans text-white drop-shadow-xl">
            <div className="text-2xl leading-none text-yellow-300">★</div>
            <div className="mt-1 text-[8px] font-black uppercase tracking-[0.22em]">Việt Nam</div>
          </div>
        </Html>
      </group>
    </group>
  );
}

function DistantBridge() {
  const arches = [-22, -11, 0, 11, 22];
  return (
    <group position={[0, 2.5, -136]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[62, 1.2, 3.4]} />
        <meshStandardMaterial color="#152033" metalness={0.7} roughness={0.28} />
      </mesh>
      {arches.map((x) => (
        <group key={x} position={[x, 4.2, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[5.2, 0.18, 8, 32, Math.PI]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.75} metalness={0.6} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 6, 4]} color="#f59e0b" intensity={5} distance={55} />
    </group>
  );
}

export function VietnamCityLayer() {
  const theme = useGameStore((state) => state.theme);
  const quality = useGameStore((state) => state.quality);
  const isLight = theme === 'light';

  return (
    <group>
      <group visible={quality !== 'low'}>
        {SKYLINE_LAYOUT.map((tower, index) => (
          <SkylineTower key={index} {...tower} />
        ))}
      </group>

      <DistantBridge />
      <VietnamCorner />

      {DISTRICT_GATEWAYS.map((gateway) => (
        <DistrictGateway key={gateway.id} gateway={gateway} />
      ))}

      {LAMP_POSITIONS.map((lamp, index) => (
        <StreetLamp key={index} {...lamp} />
      ))}

      {!isLight && LANTERN_STRINGS.map((string, index) => <LanternString key={index} {...string} />)}

      <group position={[59, 0, 37]}>
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[9, 6.4, 0.45]} />
          <meshStandardMaterial color="#0b1220" metalness={0.72} roughness={0.24} />
        </mesh>
        <mesh position={[0, 3.2, 0.24]}>
          <planeGeometry args={[8.5, 5.9]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} />
        </mesh>
        <Html center distanceFactor={22} position={[0, 3.3, 0.3]} className="pointer-events-none select-none">
          <div className="w-[230px] text-center font-mono uppercase">
            <div className="text-[8px] tracking-[0.36em] text-cyan-300">build from vietnam</div>
            <div className="mt-2 text-xl font-black tracking-tight text-white">GOOD IDEAS</div>
            <div className="text-xl font-black tracking-tight text-white">GO FURTHER.</div>
            <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          </div>
        </Html>
      </group>
    </group>
  );
}
