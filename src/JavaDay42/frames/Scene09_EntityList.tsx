/**
 * Scene 09 — Entity List
 * "Train, station, ticket, passenger."
 * CSV: 32.340s → 36.000s
 * Duration: 121 frames (4.03s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline
 *   Phase 2 (frames 14–70):  4 entity cards in 2x2 grid with stagger, each with icon SVG
 *   Phase 3 (frames 60–end): Float, shimmer, connector pulse
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene09_EntityList: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);

  // ── Phase 2 — entity cards ─────────────────────────────────────────────────
  const cardEnts = [
    useSpringEntrance(frame, 14),
    useSpringEntrance(frame, 22),
    useSpringEntrance(frame, 30),
    useSpringEntrance(frame, 38),
  ];

  // ── Bottom card ────────────────────────────────────────────────────────────
  const bottomEnt = useSpringEntrance(frame, 46);

  // ── Connector lines ────────────────────────────────────────────────────────
  const connLen = 180;
  const connDashes = [
    usePathDraw(frame, 24, connLen, 20),
    usePathDraw(frame, 32, connLen, 20),
    usePathDraw(frame, 40, connLen, 20),
  ];

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  const entities = [
    { name: 'Train', x: 60, y: 520, icon: 'loco' },
    { name: 'Station', x: 560, y: 520, icon: 'station' },
    { name: 'Ticket', x: 60, y: 840, icon: 'ticket' },
    { name: 'Passenger', x: 560, y: 840, icon: 'person' },
  ];

  const drawIcon = (type: string, cx: number, cy: number) => {
    switch (type) {
      case 'loco':
        return (
          <g transform={`translate(${cx}, ${cy})`}>
            <rect x={-50} y={-20} width={100} height={40} rx={8} fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <rect x={30} y={-35} width={20} height={15} rx={3} fill={COLORS.accent} fillOpacity={0.3} />
            <circle cx={-30} cy={24} r={10} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={0} cy={24} r={10} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={30} cy={24} r={10} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          </g>
        );
      case 'station':
        return (
          <g transform={`translate(${cx}, ${cy})`}>
            <rect x={-40} y={-10} width={80} height={30} rx={4} fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <polygon points="0,-30 -50,-10 50,-10" fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1} />
            <rect x={-6} y={0} width={12} height={20} rx={2} fill={COLORS.accent} fillOpacity={0.3} />
          </g>
        );
      case 'ticket':
        return (
          <g transform={`translate(${cx}, ${cy})`}>
            <rect x={-45} y={-20} width={90} height={40} rx={8} fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={1.5} strokeDasharray="6 3" />
            <line x1={-15} y1={-18} x2={-15} y2={18} stroke={COLORS.accent} strokeWidth={1} strokeDasharray="3 3" />
            <text x={15} y={6} textAnchor="middle" fontFamily={FONT} fontSize={16} fontWeight={800}
              fill={COLORS.accent}>A1</text>
          </g>
        );
      case 'person':
        return (
          <g transform={`translate(${cx}, ${cy})`}>
            <circle cx={0} cy={-18} r={12} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
            <path d="M -20,20 Q 0,-5 20,20" fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
            <line x1={0} y1={-6} x2={0} y2={10} stroke={COLORS.accent} strokeWidth={1.5} />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 2 · RAILWAY ENTITIES" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Four Core
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            Classes
          </text>
        </g>

        {/* ── Entity cards — 2×2 grid ─────────────────────────────────────── */}
        {entities.map((e, i) => (
          <g key={e.name} opacity={cardEnts[i].opacity}
            transform={`translate(0, ${cardEnts[i].translateY})`}>
            <BentoCard x={e.x} y={e.y} w={460} h={280} accent={i === 0} />

            {/* Icon */}
            {drawIcon(e.icon, e.x + 230, e.y + 100)}

            {/* Label */}
            <text x={e.x + 230} y={e.y + 200} textAnchor="middle"
              fontFamily={FONT} fontSize={44} fontWeight={800}
              fill={i === 0 ? COLORS.accent : COLORS.white}>
              {e.name}
            </text>

            {/* extends tag */}
            <text x={e.x + 230} y={e.y + 245} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.text_muted} fontStyle="italic">
              extends Object
            </text>
          </g>
        ))}

        {/* ── Connector lines between cards ───────────────────────────────── */}
        {/* Horizontal top */}
        <path d="M 520,660 L 560,660"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={connDashes[0]}
          strokeLinecap="round" opacity={0.4} />
        {/* Vertical left */}
        <path d="M 290,800 L 290,840"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={connDashes[1]}
          strokeLinecap="round" opacity={0.4} />
        {/* Vertical right */}
        <path d="M 790,800 L 790,840"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={connDashes[2]}
          strokeLinecap="round" opacity={0.4} />

        {/* ── Bottom summary card ─────────────────────────────────────────── */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={160} />
          <rect x={60} y={1180} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1250} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            All four inherit from
          </text>
          <text x={610} y={1250} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            java.lang.Object
          </text>
          <text x={100} y={1300} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            automatically — without a single line of code
          </text>
        </g>

        {/* ── Pulse rings ─────────────────────────────────────────────────── */}
        <g transform={`translate(540, ${1500 + breathe})`} opacity={0.08 * shimmer}>
          <circle cx={0} cy={0} r={50} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Floating dots ───────────────────────────────────────────────── */}
        <circle cx={50} cy={500 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.2} />
        <circle cx={1030} cy={700 - breathe * 0.5} r={2.5} fill={COLORS.accent} fillOpacity={0.15} />
        <circle cx={540} cy={470 + breathe * 0.3} r={4} fill={COLORS.accent} fillOpacity={0.1} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
