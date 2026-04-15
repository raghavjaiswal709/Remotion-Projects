/**
 * Scene 13 — One Time Setup
 * "This is where you put one time class level setup that every future object will depend on."
 * CSV: 70.040s → 76.790s | Duration: 203 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–90): Setup hub → multiple object arrows
 *   Phase 3 (80–end): Float, pulse on hub
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene13_OneTimeSetup: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);
  const subE = useSpringEntrance(frame, 14);

  // Hub card
  const hubE = useSpringEntrance(frame, 24);

  // Setup items inside hub
  const items = ['Load Stations', 'Map Network', 'Init Fares'];
  const itemEs = items.map((_, i) => useSpringEntrance(frame, 36 + i * 10));

  // Arrows from hub to objects
  const arrowLen = 120;
  const arrowDash1 = usePathDraw(frame, 60, arrowLen, 20);
  const arrowDash2 = usePathDraw(frame, 68, arrowLen, 20);
  const arrowDash3 = usePathDraw(frame, 76, arrowLen, 20);

  // Object cards
  const obj1 = useSpringEntrance(frame, 68);
  const obj2 = useSpringEntrance(frame, 78);
  const obj3 = useSpringEntrance(frame, 88);

  // Bottom
  const bottomE = useSpringEntrance(frame, 96);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />
        <CornerAccents opacity={labelE.opacity * 0.3} />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="PURPOSE · ONE TIME SETUP" y={140} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            One-Time Setup
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            Every future object depends on this
          </text>
        </g>

        {/* Central hub — Static Block */}
        <g opacity={hubE.opacity} transform={`translate(0, ${hubE.translateY})`}>
          <BentoCard x={200} y={440} w={680} h={320} accent />
          <text x={540} y={500} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>STATIC BLOCK</text>
          <rect x={200} y={440} width={6} height={320} rx={3} fill={COLORS.accent} />
        </g>

        {/* Setup items inside hub */}
        {items.map((item, i) => (
          <g key={i} opacity={itemEs[i].opacity} transform={`translate(0, ${itemEs[i].translateY})`}>
            <circle cx={280} cy={562 + i * 64} r={16} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={280} y={570 + i * 64} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={800}
              fill={COLORS.accent}>{i + 1}</text>
            <text x={310} y={570 + i * 64} fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.white}>{item}</text>
          </g>
        ))}

        {/* Arrows from hub to objects */}
        {[
          { x1: 300, y1: 760, x2: 200, y2: 860, dash: arrowDash1, op: obj1.opacity },
          { x1: 540, y1: 760, x2: 540, y2: 860, dash: arrowDash2, op: obj2.opacity },
          { x1: 780, y1: 760, x2: 880, y2: 860, dash: arrowDash3, op: obj3.opacity },
        ].map((arr, i) => (
          <line key={i} x1={arr.x1} y1={arr.y1} x2={arr.x2} y2={arr.y2}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={arr.dash}
            markerEnd="url(#arrow)" opacity={arr.op * 0.7} />
        ))}

        {/* Object cards */}
        {[
          { label: 'Train 1', x: 60, e: obj1 },
          { label: 'Train 2', x: 400, e: obj2 },
          { label: 'Train 3', x: 720, e: obj3 },
        ].map((obj, i) => (
          <g key={i} opacity={obj.e.opacity} transform={`translate(0, ${obj.e.translateY})`}>
            <BentoCard x={obj.x} y={870} w={300} h={160} />
            {/* Mini train icon */}
            <rect x={obj.x + 30} y={920} width={80} height={40} rx={8} fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={obj.x + 50} cy={968} r={10} fill="none" stroke={COLORS.text_muted} strokeWidth={1.5} />
            <circle cx={obj.x + 90} cy={968} r={10} fill="none" stroke={COLORS.text_muted} strokeWidth={1.5} />
            <text x={obj.x + 130} y={950} fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.white}>{obj.label}</text>
            <text x={obj.x + 30} y={1000} fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.text_muted}>Uses shared data</text>
          </g>
        ))}

        {/* Bottom */}
        <g opacity={bottomE.opacity} transform={`translate(0, ${bottomE.translateY})`}>
          <BentoCard x={60} y={1090} w={960} h={140} />
          <text x={100} y={1148} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Class-level setup —
          </text>
          <text x={530} y={1148} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            every object benefits
          </text>
          <text x={100} y={1196} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Stations, routes, fares available to all instances
          </text>
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1380 + breathe})`}>
          <circle r={32} fill={COLORS.accent} fillOpacity={0.05} />
          <circle r={32} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.3} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
