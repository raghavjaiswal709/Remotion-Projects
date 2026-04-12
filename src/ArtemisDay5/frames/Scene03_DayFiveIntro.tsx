/**
 * Scene03 — Day Five Introduction
 * "This is day five of resolving hidden secrets around the world."
 * CSV: 8.360s → 12.280s
 *
 * Animation phases:
 *   Phase 1 (0–30): Corner accents, label + headline spring entrance
 *   Phase 2 (20–90): Large globe with continents, latitude/meridian grid, 5 discovery rays
 *                     with glowing endpoint pins, Day 5 hero badge with ghost number
 *   Phase 3 (80–end): Globe slow rotation, continent shimmer, pin float, wave breathing
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

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

export const Scene03_DayFiveIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (0–30) ──────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2: Globe + rays + badge + cards (20–90) ────────────
  const globeEnt = useSpringEntrance(frame, 20);
  const continentEnt = useSpringEntrance(frame, 26);
  const ray1Draw = usePathDraw(frame, 30, 260, 22);
  const ray2Draw = usePathDraw(frame, 35, 240, 22);
  const ray3Draw = usePathDraw(frame, 40, 220, 22);
  const ray4Draw = usePathDraw(frame, 45, 200, 22);
  const ray5Draw = usePathDraw(frame, 50, 180, 22);
  const badgeEnt = useSpringEntrance(frame, 55);
  const card1 = useSpringEntrance(frame, 62);
  const card2 = useSpringEntrance(frame, 72);
  const bottomNote = useSpringEntrance(frame, 80);
  const globeBorderDraw = usePathDraw(frame, 22, 1320, 35);

  // ── Phase 3: Micro-animations (80–end) ────────────────────────
  const breathe = Math.sin(frame * 0.05) * 5;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.82, 1]);
  const pulse = 1 + Math.sin(frame * 0.06) * 0.018;
  const rotation = interpolate(frame, [0, 300], [0, 15], { extrapolateRight: 'clamp' });
  const pinFloat1 = Math.sin(frame * 0.07) * 3;
  const pinFloat2 = Math.sin(frame * 0.08 + 1) * 3;
  const pinFloat3 = Math.sin(frame * 0.06 + 2) * 3;
  const pinFloat4 = Math.sin(frame * 0.09 + 0.5) * 3;
  const pinFloat5 = Math.sin(frame * 0.07 + 1.5) * 3;
  const ringPulse = 1 + Math.sin(frame * 0.1) * 0.03;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  const GX = 540;
  const GY = 720;
  const GR = 200;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <CornerAccents opacity={0.35} color={COLORS.sky_blue} />

        {/* Zone A — section label */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="HIDDEN WORLD SECRETS" y={260} opacity={0.55} />
        </g>

        {/* Zone B — headlines */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={80} fontWeight={900} fill={COLORS.deep_black}>
            Day Five
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={468} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={600} fill={COLORS.sky_blue}>
            Secrets Hidden Around The World
          </text>
        </g>

        {/* ── ZONE C ── Large detailed globe illustration ────────── */}
        <g opacity={globeEnt.opacity}
          transform={`translate(${GX}, ${GY + globeEnt.translateY + breathe})`}>

          {/* Globe outer edge — path-draw border */}
          <circle cx={0} cy={0} r={GR}
            fill={COLORS.sky_blue} fillOpacity={0.06 * shimmer}
            stroke={COLORS.sky_blue} strokeWidth={3}
            strokeDasharray={1320} strokeDashoffset={globeBorderDraw}
            style={{ transform: `scale(${pulse})`, transformOrigin: '0px 0px' }} />

          {/* Ocean fill tint */}
          <circle cx={0} cy={0} r={GR - 3}
            fill={COLORS.sky_blue} fillOpacity={0.03} />

          {/* Latitude grid lines — 7 lines */}
          {[-130, -85, -42, 0, 42, 85, 130].map((lat, i) => {
            const ry = Math.max(12, Math.sqrt(GR * GR - lat * lat) * 0.28);
            const rx = Math.sqrt(Math.max(0, GR * GR - lat * lat));
            return (
              <ellipse key={`lat-${i}`} cx={0} cy={lat} rx={rx} ry={ry}
                fill="none" stroke={COLORS.sky_blue} strokeWidth={0.8}
                opacity={0.18 * shimmer} />
            );
          })}

          {/* Meridian lines — rotating */}
          <ellipse cx={0} cy={0} rx={55} ry={GR} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.22}
            transform={`rotate(${rotation})`} />
          <ellipse cx={0} cy={0} rx={110} ry={GR} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={0.8} opacity={0.15}
            transform={`rotate(${rotation + 45})`} />
          <ellipse cx={0} cy={0} rx={160} ry={GR} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={0.6} opacity={0.12}
            transform={`rotate(${rotation + 90})`} />

          {/* Simplified continent shapes (inline SVG paths) */}
          <g opacity={continentEnt.opacity * shimmer * 0.7}>
            {/* North America blob */}
            <path d="M -90,-100 C -60,-130 -20,-120 10,-90 C 30,-70 40,-40 20,-20 C 0,0 -40,10 -70,-10 C -100,-30 -110,-70 -90,-100 Z"
              fill={COLORS.green} fillOpacity={0.18}
              stroke={COLORS.green} strokeWidth={1.2} opacity={0.4} />
            {/* South America blob */}
            <path d="M -30,30 C -10,20 10,30 20,60 C 30,100 20,140 0,160 C -20,150 -40,120 -40,80 C -40,50 -35,35 -30,30 Z"
              fill={COLORS.green} fillOpacity={0.15}
              stroke={COLORS.green} strokeWidth={1} opacity={0.35} />
            {/* Europe-Africa blob */}
            <path d="M 60,-80 C 80,-90 100,-70 90,-45 C 85,-20 90,10 80,50 C 70,90 60,120 50,100 C 40,70 45,20 55,-20 C 60,-50 55,-70 60,-80 Z"
              fill={COLORS.green} fillOpacity={0.15}
              stroke={COLORS.green} strokeWidth={1} opacity={0.35} />
            {/* Asia blob — upper right */}
            <path d="M 90,-80 C 130,-90 160,-50 140,-20 C 120,10 100,20 80,-10 C 70,-30 75,-65 90,-80 Z"
              fill={COLORS.green} fillOpacity={0.12}
              stroke={COLORS.green} strokeWidth={0.8} opacity={0.3} />
          </g>

          {/* Axis tilt line */}
          <line x1={0} y1={-GR - 18} x2={0} y2={GR + 18}
            stroke={COLORS.cool_silver} strokeWidth={1.2} opacity={0.12}
            strokeDasharray="8 5" />

          {/* North pole dot */}
          <circle cx={0} cy={-GR - 8} r={4}
            fill={COLORS.cool_silver} fillOpacity={0.4} />
          {/* South pole dot */}
          <circle cx={0} cy={GR + 8} r={4}
            fill={COLORS.cool_silver} fillOpacity={0.4} />

          {/* Equator highlight */}
          <ellipse cx={0} cy={0} rx={GR} ry={GR * 0.22} fill="none"
            stroke={COLORS.amber} strokeWidth={1.5} opacity={0.2}
            strokeDasharray="12 6" />
        </g>

        {/* ── 5 Discovery rays radiating from globe ─────────────── */}
        {/* Ray 1 — top-left (amber) */}
        <path d={`M ${GX - 130},${GY - 130} L ${GX - 300},${GY - 280}`}
          fill="none" stroke={COLORS.amber} strokeWidth={2.5}
          strokeDasharray={260} strokeDashoffset={ray1Draw}
          strokeLinecap="round" opacity={0.55} />
        <g transform={`translate(${GX - 300}, ${GY - 280 + pinFloat1})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.amber} fillOpacity={0.25}
            stroke={COLORS.amber} strokeWidth={2} />
          <circle cx={0} cy={0} r={6} fill={COLORS.amber} fillOpacity={0.5} />
        </g>

        {/* Ray 2 — top-right (green) */}
        <path d={`M ${GX + 140},${GY - 120} L ${GX + 340},${GY - 260}`}
          fill="none" stroke={COLORS.green} strokeWidth={2.5}
          strokeDasharray={240} strokeDashoffset={ray2Draw}
          strokeLinecap="round" opacity={0.55} />
        <g transform={`translate(${GX + 340}, ${GY - 260 + pinFloat2})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.green} fillOpacity={0.25}
            stroke={COLORS.green} strokeWidth={2} />
          <circle cx={0} cy={0} r={6} fill={COLORS.green} fillOpacity={0.5} />
        </g>

        {/* Ray 3 — right (orange) */}
        <path d={`M ${GX + 180},${GY + 40} L ${GX + 380},${GY + 80}`}
          fill="none" stroke={COLORS.orange} strokeWidth={2.5}
          strokeDasharray={220} strokeDashoffset={ray3Draw}
          strokeLinecap="round" opacity={0.55} />
        <g transform={`translate(${GX + 380}, ${GY + 80 + pinFloat3})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.orange} fillOpacity={0.25}
            stroke={COLORS.orange} strokeWidth={2} />
          <circle cx={0} cy={0} r={6} fill={COLORS.orange} fillOpacity={0.5} />
        </g>

        {/* Ray 4 — bottom-left (purple) */}
        <path d={`M ${GX - 120},${GY + 160} L ${GX - 300},${GY + 300}`}
          fill="none" stroke={COLORS.purple} strokeWidth={2.5}
          strokeDasharray={200} strokeDashoffset={ray4Draw}
          strokeLinecap="round" opacity={0.55} />
        <g transform={`translate(${GX - 300}, ${GY + 300 + pinFloat4})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.purple} fillOpacity={0.25}
            stroke={COLORS.purple} strokeWidth={2} />
          <circle cx={0} cy={0} r={6} fill={COLORS.purple} fillOpacity={0.5} />
        </g>

        {/* Ray 5 — bottom center (sky_blue) */}
        <path d={`M ${GX},${GY + 200} L ${GX},${GY + 380}`}
          fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5}
          strokeDasharray={180} strokeDashoffset={ray5Draw}
          strokeLinecap="round" opacity={0.55} />
        <g transform={`translate(${GX}, ${GY + 380 + pinFloat5})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.sky_blue} fillOpacity={0.25}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <circle cx={0} cy={0} r={6} fill={COLORS.sky_blue} fillOpacity={0.5} />
        </g>

        {/* ── Day 5 hero badge ──────────────────────────────────── */}
        <g opacity={badgeEnt.opacity}
          transform={`translate(540, ${1200 + badgeEnt.translateY})`}>
          {/* Ghost "5" background */}
          <text x={0} y={30} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={200} fontWeight={900}
            fill={COLORS.sky_blue} opacity={0.06 * shimmer}>
            5
          </text>
          {/* Outer ring */}
          <circle cx={0} cy={0} r={80}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={3}
            transform={`scale(${ringPulse})`}
            style={{ transformOrigin: '0px 0px' }} />
          {/* Inner ring */}
          <circle cx={0} cy={0} r={60}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.3} />
          {/* "DAY" label */}
          <text x={0} y={-18} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600} fill={COLORS.cool_silver}
            letterSpacing="0.18em">
            DAY
          </text>
          {/* "5" number */}
          <text x={0} y={36} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={900} fill={COLORS.sky_blue}>
            5
          </text>
        </g>

        {/* ── Topic card 1 — with water drop icon ──────────────── */}
        <g opacity={card1.opacity} transform={`translate(60, ${1360 + card1.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Water drop icon */}
          <g transform="translate(40, 24)">
            <path d="M 24,0 C 24,0 0,28 0,42 C 0,55 10,60 24,60 C 38,60 48,55 48,42 C 48,28 24,0 24,0 Z"
              fill={COLORS.sky_blue} fillOpacity={0.25}
              stroke={COLORS.sky_blue} strokeWidth={2} />
            <ellipse cx={14} cy={38} rx={6} ry={8}
              fill={COLORS.sky_blue} fillOpacity={0.15} />
          </g>
          <text x={110} y={40}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={800} fill={COLORS.deep_black}>
            Orion Splashdown
          </text>
          <text x={110} y={72}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={500} fill={COLORS.cool_silver}>
            Why water landing, not dry land?
          </text>
        </g>

        {/* ── Topic card 2 — with parachute icon ───────────────── */}
        <g opacity={card2.opacity} transform={`translate(60, ${1490 + card2.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={14}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2} />
          {/* Mini parachute icon */}
          <g transform="translate(40, 14)">
            <path d="M 0,26 C -6,6 6,-10 24,-10 C 42,-10 54,6 48,26 Z"
              fill={COLORS.orange} fillOpacity={0.25}
              stroke={COLORS.orange} strokeWidth={1.5} />
            <line x1={6} y1={26} x2={20} y2={58} stroke={COLORS.orange} strokeWidth={1.2} opacity={0.5} />
            <line x1={24} y1={26} x2={24} y2={58} stroke={COLORS.orange} strokeWidth={1.2} opacity={0.5} />
            <line x1={42} y1={26} x2={28} y2={58} stroke={COLORS.orange} strokeWidth={1.2} opacity={0.5} />
            <rect x={16} y={58} width={16} height={12} rx={3}
              fill={COLORS.deep_black} fillOpacity={0.15}
              stroke={COLORS.deep_black} strokeWidth={1} opacity={0.3} />
          </g>
          <text x={110} y={40}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={800} fill={COLORS.deep_black}>
            Parachutes and Recovery
          </text>
          <text x={110} y={72}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={500} fill={COLORS.cool_silver}>
            Physics, 6 chutes, and rescue at sea
          </text>
        </g>

        {/* ── Bottom divider + series label ─────────────────────── */}
        <line x1={60} y1={1660} x2={1020} y2={1660}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08} />
        <g opacity={bottomNote.opacity * 0.6}>
          {/* Small rocket icon */}
          <g transform="translate(480, 1690)">
            <polygon points="8,0 0,20 16,20"
              fill={COLORS.sky_blue} fillOpacity={0.3}
              stroke={COLORS.sky_blue} strokeWidth={1} />
            <rect x={3} y={20} width={10} height={8} rx={2}
              fill={COLORS.orange} fillOpacity={0.3} />
          </g>
          <text x={510} y={1706} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            Artemis II Mini-Series
          </text>
        </g>

        {/* ── Bottom corner accents ─────────────────────────────── */}
        <path d="M 60,1850 L 60,1770 M 60,1850 L 140,1850"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5} strokeLinecap="round" opacity={0.25} />
        <path d="M 1020,1850 L 1020,1770 M 1020,1850 L 940,1850"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5} strokeLinecap="round" opacity={0.25} />

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
