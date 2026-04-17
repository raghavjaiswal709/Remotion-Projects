/**
 * Scene 24 — Method Overloading IS Compile Time Polymorphism
 * "This is method overloading, and method overloading is compile time polymorphism."
 * CSV: 84.980s → 91.060s
 * Duration: ~182 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–80): Definition reveal with equals chain
 *   Phase 3 (70–end): Micro pulse / breathe
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene24_MethodOverloading: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 14);

  // Definition chain: three boxes connected by "="
  const box1 = useSpringEntrance(frame, 22);
  const eq1 = useSpringEntrance(frame, 34);
  const box2 = useSpringEntrance(frame, 40);
  const eq2 = useSpringEntrance(frame, 52);
  const box3 = useSpringEntrance(frame, 58);

  // Bottom summary card
  const summaryEnt = useSpringEntrance(frame, 68);

  // Connector lines
  const lineLen = 120;
  const line1Dash = usePathDraw(frame, 36, lineLen, 18);
  const line2Dash = usePathDraw(frame, 54, lineLen, 18);

  // Decorative locomotive
  const locoEnt = useSpringEntrance(frame, 75);

  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s24.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="KEY DEFINITION" y={160} opacity={0.8} />
        </g>

        {/* Hero headline */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>
            Method Overloading
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={540} y={380} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            = Compile-Time Polymorphism
          </text>
        </g>

        {/* Definition chain — 3 vertical boxes */}
        {/* Box 1: Same method name */}
        <g opacity={box1.opacity} transform={`translate(0, ${box1.translateY})`}>
          <BentoCard x={140} y={500} w={800} h={160} accent />
          <rect x={140} y={500} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={540} y={560} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Same method name
          </text>
          <text x={540} y={610} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500}
            fill={COLORS.accent}>
            bookTicket(...)
          </text>
        </g>

        {/* Equals connector 1 */}
        <g opacity={eq1.opacity}>
          <line x1={540} y1={660} x2={540} y2={720}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={lineLen} strokeDashoffset={line1Dash}
            strokeLinecap="round" />
          <text x={570} y={700} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>+</text>
        </g>

        {/* Box 2: Different parameter signatures */}
        <g opacity={box2.opacity} transform={`translate(0, ${box2.translateY})`}>
          <BentoCard x={140} y={720} w={800} h={160} accent={false} />
          <rect x={140} y={720} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={540} y={780} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Different parameter lists
          </text>
          <text x={540} y={830} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={500}
            fill={COLORS.text_muted}>
            (int, int) vs (int, int, String) vs ...
          </text>
        </g>

        {/* Equals connector 2 */}
        <g opacity={eq2.opacity}>
          <line x1={540} y1={880} x2={540} y2={940}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={lineLen} strokeDashoffset={line2Dash}
            strokeLinecap="round" />
          <text x={570} y={920} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>=</text>
        </g>

        {/* Box 3: Compile-time polymorphism */}
        <g opacity={box3.opacity} transform={`translate(0, ${box3.translateY})`}>
          <BentoCard x={140} y={940} w={800} h={180} accent />
          <text x={540} y={1010} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Compile-Time
          </text>
          <text x={540} y={1070} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Polymorphism
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1220} w={960} h={120} accent={false} />
          <text x={540} y={1292} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Compiler resolves which version to call
          </text>
        </g>

        {/* Decorative locomotive silhouette */}
        <g opacity={locoEnt.opacity * 0.08} transform={`translate(${200 + breathe}, 1440)`}>
          {/* Boiler */}
          <rect x={0} y={20} width={360} height={100} rx={12} fill={COLORS.accent} />
          {/* Cab */}
          <rect x={280} y={0} width={120} height={120} rx={8} fill={COLORS.accent} />
          {/* Smokestack */}
          <rect x={60} y={-20} width={40} height={40} rx={4} fill={COLORS.accent} />
          {/* Wheels */}
          <circle cx={80} cy={140} r={35} fill="none" stroke={COLORS.accent} strokeWidth={3} />
          <circle cx={200} cy={140} r={35} fill="none" stroke={COLORS.accent} strokeWidth={3} />
          <circle cx={340} cy={140} r={28} fill="none" stroke={COLORS.accent} strokeWidth={3} />
        </g>

        {/* Tracks */}
        <line x1={60} y1={1620} x2={1020} y2={1620}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />
        <line x1={60} y1={1636} x2={1020} y2={1636}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={80 + i * 60} y={1621} width={22} height={14} rx={2}
            fill={COLORS.text_muted} opacity={0.05} />
        ))}

        <g transform={`translate(540, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={8} fill={COLORS.accent} opacity={0.04 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s24.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
