import React from 'react';
import { useGameStore, MILESTONE_WAYPOINTS, MilestoneId } from '../../stores/useGameStore';
import { Compass, Minimize2, Maximize2 } from 'lucide-react';

export const MiniMap: React.FC = () => {
  const vehiclePos = useGameStore((state) => state.vehiclePos);
  const targetWaypoint = useGameStore((state) => state.targetWaypoint);
  const setTargetWaypoint = useGameStore((state) => state.setTargetWaypoint);
  const isMiniMapExpanded = useGameStore((state) => state.isMiniMapExpanded);
  const toggleMiniMap = useGameStore((state) => state.toggleMiniMap);
  const setQuickViewTab = useGameStore((state) => state.setQuickViewTab);
  const setQuickViewOpen = useGameStore((state) => state.setQuickViewOpen);
  const theme = useGameStore((state) => state.theme);
  const isZenMode = useGameStore((state) => state.isZenMode);

  if (isZenMode) return null;

  const isLight = theme === 'light';
  const isNight = theme === 'night';

  // Scaled SVG dimensions
  const MAP_WIDTH = 190;
  const MAP_HEIGHT = 220;

  // Theme-adaptive Radar Palette
  const radarBg = isLight ? '#f8fafc' : isNight ? '#050811' : '#0a0f1d';
  const radarPadBg = isLight ? '#f1f5f9' : isNight ? '#030712' : '#0c1220';
  const gridStroke = isLight ? '#e2e8f0' : isNight ? '#0f2038' : '#162034';
  const circuitStroke = isLight ? '#cbd5e1' : isNight ? '#132238' : '#1e293b';
  const circuitDash = isLight ? '#d97706' : '#f59e0b';
  const startLineStroke = isLight ? '#0284c7' : isNight ? '#00f3ff' : '#38bdf8';
  const roadStroke = isLight ? '#e2e8f0' : isNight ? '#0c192e' : '#1e2c44';
  const roadDash = isLight ? '#94a3b8' : isNight ? '#00f3ff' : '#38bdf8';
  const roundaboutFill = isLight ? '#f1f5f9' : isNight ? '#0c192e' : '#162034';
  const roundaboutStroke = isLight ? '#0284c7' : isNight ? '#00f3ff' : '#00f3ff';
  const playerCarFill = isLight ? '#0284c7' : isNight ? '#00f3ff' : '#38bdf8';

  // Coordinate projection from 3D world (X: -90 to +90, Z: -125 to +105) to SVG pixels
  const projectX = (worldX: number) => {
    return ((worldX + 90) / 180) * MAP_WIDTH;
  };

  const projectY = (worldZ: number) => {
    return ((worldZ + 125) / 230) * MAP_HEIGHT;
  };

  const carX = projectX(vehiclePos.x);
  const carY = projectY(vehiclePos.z);
  const carRotationDeg = -((vehiclePos.heading * 180) / Math.PI);

  const handleWaypointClick = (id: MilestoneId) => {
    setTargetWaypoint(id);
    if (['about', 'tech', 'projects', 'experiments', 'contact'].includes(id)) {
      setQuickViewTab(id as any);
      setQuickViewOpen(true);
    }
  };

  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-30 font-mono select-none">
      {/* MiniMap Window */}
      <div className={`backdrop-blur-xl border overflow-hidden transition-all duration-300 ${
        isLight
          ? 'bg-white/95 border-slate-300 shadow-xl'
          : isNight
          ? 'bg-slate-950/92 border-cyan-500/40 shadow-[0_0_25px_rgba(0,243,255,0.25)]'
          : 'bg-slate-900/95 border-slate-700 shadow-xl'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-3 py-1.5 border-b text-[11px] ${
          isLight
            ? 'bg-slate-100/90 border-slate-200 text-slate-800'
            : isNight
            ? 'bg-black/90 border-cyan-900/60 text-cyan-300 drop-shadow-[0_0_6px_rgba(0,243,255,0.7)]'
            : 'bg-slate-900/80 border-slate-800 text-cyan-400'
        }`}>
          <span className="flex items-center gap-1.5 font-bold tracking-wider">
            <Compass className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
            <span>GPS RADAR</span>
          </span>
          <button
            onClick={toggleMiniMap}
            className={`p-1 transition-colors ${
              isLight
                ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isMiniMapExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>

        {/* Expanded SVG Map */}
        {isMiniMapExpanded && (
          <div className="relative p-2" style={{ backgroundColor: radarPadBg }}>
            <svg
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
              className="overflow-visible block"
              style={{ background: radarBg }}
            >
              {/* Grid Pattern */}
              <defs>
                <pattern id="radar-grid" width="18" height="18" patternUnits="userSpaceOnUse">
                  <path d="M 18 0 L 0 0 0 18" fill="none" stroke={gridStroke} strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#radar-grid)" />

              {/* Outer Speed Circuit Racetrack Loop */}
              <rect
                x={projectX(-80)}
                y={projectY(-95)}
                width={projectX(80) - projectX(-80)}
                height={projectY(85) - projectY(-95)}
                rx="14"
                fill="none"
                stroke={circuitStroke}
                strokeWidth="10"
              />
              <rect
                x={projectX(-80)}
                y={projectY(-95)}
                width={projectX(80) - projectX(-80)}
                height={projectY(85) - projectY(-95)}
                rx="14"
                fill="none"
                stroke={circuitDash}
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />

              {/* Start / Finish Line Indicator */}
              <line
                x1={projectX(-10)}
                y1={projectY(-95)}
                x2={projectX(10)}
                y2={projectY(-95)}
                stroke={startLineStroke}
                strokeWidth="3"
              />

              {/* North-South Highway */}
              <line
                x1={projectX(0)}
                y1={projectY(-110)}
                x2={projectX(0)}
                y2={projectY(65)}
                stroke={roadStroke}
                strokeWidth="10"
              />
              <line
                x1={projectX(0)}
                y1={projectY(-110)}
                x2={projectX(0)}
                y2={projectY(65)}
                stroke={roadDash}
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* East-West Avenue */}
              <line
                x1={projectX(-70)}
                y1={projectY(0)}
                x2={projectX(70)}
                y2={projectY(0)}
                stroke={roadStroke}
                strokeWidth="10"
              />
              <line
                x1={projectX(-70)}
                y1={projectY(0)}
                x2={projectX(70)}
                y2={projectY(0)}
                stroke={roadDash}
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Central Roundabout */}
              <circle
                cx={projectX(0)}
                cy={projectY(0)}
                r="10"
                fill={roundaboutFill}
                stroke={roundaboutStroke}
                strokeWidth="1.2"
              />

              {/* Landmark Waypoints */}
              {MILESTONE_WAYPOINTS.map((wp) => {
                const px = projectX(wp.x);
                const py = projectY(wp.z);
                const isTarget = targetWaypoint === wp.id;
                return (
                  <g
                    key={wp.id}
                    className="cursor-pointer group"
                    onClick={() => handleWaypointClick(wp.id)}
                  >
                    {isTarget && (
                      <circle
                        cx={px}
                        cy={py}
                        r="9"
                        fill="none"
                        stroke={wp.color}
                        strokeWidth="1.2"
                        className="animate-ping origin-center opacity-70"
                      />
                    )}
                    <circle
                      cx={px}
                      cy={py}
                      r="5"
                      fill={wp.color}
                      stroke={isLight ? '#ffffff' : '#0f172a'}
                      strokeWidth="1.5"
                      className="transition-transform group-hover:scale-125"
                    />
                    <text
                      x={px}
                      y={py - 7}
                      fill={isLight ? '#0f172a' : wp.color}
                      fontSize="7"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {wp.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Target Navigation Dotted Guide Line */}
              {targetWaypoint && (() => {
                const targetWP = MILESTONE_WAYPOINTS.find((w) => w.id === targetWaypoint);
                if (!targetWP) return null;
                const tx = projectX(targetWP.x);
                const ty = projectY(targetWP.z);
                return (
                  <line
                    x1={carX}
                    y1={carY}
                    x2={tx}
                    y2={ty}
                    stroke={targetWP.color}
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    opacity={0.65}
                  />
                );
              })()}

              {/* Player Vehicle Marker with Smooth Transition */}
              <g
                transform={`translate(${carX}, ${carY}) rotate(${carRotationDeg})`}
                style={{ transition: 'transform 80ms linear' }}
              >
                <polygon
                  points="0,-8 5.5,7 0,3.5 -5.5,7"
                  fill={playerCarFill}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  filter={isNight ? "drop-shadow(0 0 6px #00f3ff)" : undefined}
                />
              </g>
            </svg>

            {/* Quick Waypoint Selector Bar */}
            <div className={`pt-2 border-t flex flex-wrap gap-1 text-[9px] ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              {MILESTONE_WAYPOINTS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => handleWaypointClick(wp.id)}
                  className={`px-1.5 py-0.5 border transition-colors uppercase ${
                    targetWaypoint === wp.id
                      ? isLight
                        ? 'bg-cyan-600 text-white border-cyan-600 font-bold shadow-sm'
                        : isNight
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_8px_rgba(0,243,255,0.4)]'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold'
                      : isLight
                      ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {wp.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
