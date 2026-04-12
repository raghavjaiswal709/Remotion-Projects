/**
 * Scene05 — Pacific Ocean Splashdown
 * "Orion splashes down in the Pacific Ocean because water is the safest impact surface
 *  available for a capsule returning at 40,000 kilometers per hour."
 * CSV: 23.300s → 33.440s
 * Duration: 322 frames (10.73s)
 *
 * Animation phases:
 *   Phase 1 (0–30):  Label + headline spring up
 *   Phase 2 (20–120): MASSIVE capsule descending w/ parachutes, detailed ocean, 40k counter, 3 comparison cards
 *   Phase 3 (100–end): Ocean waves layered, capsule sway, speed pulse, water spray particles
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 14], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [36, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

function useCounter(frame: number, start: number, end: number, dur = 50) {
  const raw = interpolate(frame, [start, start + dur], [0, end], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene05_PacificSplashdown: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const capsuleEnt = useSpringEntrance(frame, 22);
  const chuteEnt = useSpringEntrance(frame, 18);
  const oceanEnt = useSpringEntrance(frame, 35);
  const statEnt = useSpringEntrance(frame, 48);
  const speedCounter = useCounter(frame, 50, 40000, 55);
  const card1Ent = useSpringEntrance(frame, 65);
  const card2Ent = useSpringEntrance(frame, 77);
  const card3Ent = useSpringEntrance(frame, 87);

  // Path draws for chute lines and ocean
  const chuteLine1 = usePathDraw(frame, 20, 180, 25);
  const chuteLine2 = usePathDraw(frame, 22, 180, 25);
  const chuteLine3 = usePathDraw(frame, 24, 180, 25);
  const surfaceDraw = usePathDraw(frame, 38, 960, 35);
  const arrowDraw = usePathDraw(frame, 30, 260, 20);

  // Capsule descent — drops into scene over time
  const capsuleDrop = interpolate(frame, [22, 80], [0, 120], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const wave1 = Math.sin(frame * 0.06) * 10;
  const wave2 = Math.sin(frame * 0.05 + 1.3) * 7;
  const wave3 = Math.sin(frame * 0.04 + 2.5) * 5;
  const sway = Math.sin(frame * 0.04) * 4;
  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.035), [-1, 1], [0.82, 1]);
  const chuteFlap = Math.sin(frame * 0.07) * 3;

  // Spray particles around impact zone
  const spray = Array.from({ length: 10 }, (_, i) => ({
    x: 540 + Math.sin(frame * 0.05 + i * 1.2) * (80 + i * 15),
    y: 1010 + Math.cos(frame * 0.06 + i * 0.8) * 12 - i * 3,
    r: 2 + Math.sin(frame * 0.04 + i) * 1.5,
    op: interpolate(Math.sin(frame * 0.04 + i * 0.5), [-1, 1], [0.08, 0.25]),
  }));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── Zone A — Section label ──────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SPLASHDOWN · WHY WATER" y={260} opacity={0.55} />
        </g>

        {/* ── Zone B — Headlines ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={370} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900} fill={COLORS.deep_black}>
            Pacific Ocean
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={440} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={38} fontWeight={600} fill={COLORS.sky_blue}>
            The Safest Impact Surface
          </text>
        </g>

        {/* ── Zone C — HERO ILLUSTRATION: Capsule + Parachutes + Ocean ──── */}

        {/* === Three main parachutes (large, detailed) === */}
        <g opacity={chuteEnt.opacity}
          transform={`translate(${540 + sway}, ${530 + chuteEnt.translateY})`}>
          {/* Chute 1 — left */}
          <g transform={`translate(${-120 + chuteFlap}, 0)`}>
            <path d="M 0,-30 C -70,-20 -90,30 -60,70 L -30,80 L 0,60 L 30,80 L 60,70 C 90,30 70,-20 0,-30 Z"
              fill={COLORS.orange} fillOpacity={0.22}
              stroke={COLORS.orange} strokeWidth={2.5} />
            <path d="M 0,-30 L 0,60" fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.4} />
            <path d="M -30,-25 L -20,70" fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
            <path d="M 30,-25 L 20,70" fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
            <line x1={-30} y1={80} x2={90} y2={240}
              stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.35}
              strokeDasharray={180} strokeDashoffset={chuteLine1} />
            <line x1={30} y1={80} x2={100} y2={240}
              stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.35}
              strokeDasharray={180} strokeDashoffset={chuteLine1} />
          </g>

          {/* Chute 2 — center (largest) */}
          <g transform={`translate(0, ${-20 - chuteFlap})`}>
            <path d="M 0,-40 C -80,-25 -100,35 -70,80 L -35,90 L 0,70 L 35,90 L 70,80 C 100,35 80,-25 0,-40 Z"
              fill={COLORS.orange} fillOpacity={0.28}
              stroke={COLORS.orange} strokeWidth={2.5} />
            <path d="M 0,-40 L 0,70" fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.5} />
            <path d="M -40,-30 L -25,80" fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.35} />
            <path d="M 40,-30 L 25,80" fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.35} />
            <line x1={-20} y1={90} x2={-10} y2={250}
              stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.35}
              strokeDasharray={180} strokeDashoffset={chuteLine2} />
            <line x1={20} y1={90} x2={10} y2={250}
              stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.35}
              strokeDasharray={180} strokeDashoffset={chuteLine2} />
          </g>

          {/* Chute 3 — right */}
          <g transform={`translate(${120 - chuteFlap}, 0)`}>
            <path d="M 0,-30 C -70,-20 -90,30 -60,70 L -30,80 L 0,60 L 30,80 L 60,70 C 90,30 70,-20 0,-30 Z"
              fill={COLORS.orange} fillOpacity={0.22}
              stroke={COLORS.orange} strokeWidth={2.5} />
            <path d="M 0,-30 L 0,60" fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.4} />
            <path d="M -30,-25 L -20,70" fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
            <path d="M 30,-25 L 20,70" fill="none" stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
            <line x1={-30} y1={80} x2={-90} y2={240}
              stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.35}
              strokeDasharray={180} strokeDashoffset={chuteLine3} />
            <line x1={30} y1={80} x2={-100} y2={240}
              stroke={COLORS.deep_black} strokeWidth={1.2} opacity={0.35}
              strokeDasharray={180} strokeDashoffset={chuteLine3} />
          </g>
        </g>

        {/* === LARGE Orion capsule (hero: 200px wide, detailed) === */}
        <g opacity={capsuleEnt.opacity}
          transform={`translate(${540 + sway}, ${750 + capsuleDrop + breathe})`}>
          {/* Main conical body */}
          <path d="M -100,50 L -80,-30 L -50,-80 L 0,-100 L 50,-80 L 80,-30 L 100,50 Z"
            fill={COLORS.cool_silver} fillOpacity={0.25}
            stroke={COLORS.deep_black} strokeWidth={2.5} />
          {/* Panel lines — structural detail */}
          <line x1={-60} y1={-65} x2={-75} y2={30} stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.2} />
          <line x1={0} y1={-100} x2={0} y2={50} stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.15} />
          <line x1={60} y1={-65} x2={75} y2={30} stroke={COLORS.deep_black} strokeWidth={0.8} opacity={0.2} />
          {/* Rivet row */}
          {[-70, -45, -20, 0, 20, 45, 70].map((rx, i) => (
            <circle key={`r${i}`} cx={rx} cy={-10} r={2} fill={COLORS.deep_black} opacity={0.15} />
          ))}
          {/* Heat shield — wide curved base */}
          <path d="M -105,50 Q -110,70 -100,80 L 100,80 Q 110,70 105,50"
            fill={COLORS.brown} fillOpacity={0.35}
            stroke={COLORS.brown} strokeWidth={2} />
          {/* Heat shield texture */}
          {[-80, -40, 0, 40, 80].map((hx, i) => (
            <line key={`h${i}`} x1={hx} y1={55} x2={hx} y2={75}
              stroke={COLORS.brown} strokeWidth={0.8} opacity={0.25} />
          ))}
          {/* Two rectangular portholes */}
          <rect x={-40} y={-65} width={28} height={20} rx={5}
            fill={COLORS.sky_blue} fillOpacity={0.25}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={12} y={-65} width={28} height={20} rx={5}
            fill={COLORS.sky_blue} fillOpacity={0.25}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          {/* Window reflections */}
          <line x1={-35} y1={-62} x2={-28} y2={-50} stroke={COLORS.sky_blue} strokeWidth={0.6} opacity={0.4} />
          <line x1={17} y1={-62} x2={24} y2={-50} stroke={COLORS.sky_blue} strokeWidth={0.6} opacity={0.4} />
          {/* Docking ring */}
          <ellipse cx={0} cy={-100} rx={20} ry={6}
            fill="none" stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.3} />
          {/* RCS thruster pods */}
          <rect x={-110} y={-20} width={14} height={24} rx={3}
            fill={COLORS.cool_silver} fillOpacity={0.2} stroke={COLORS.cool_silver} strokeWidth={1} />
          <rect x={96} y={-20} width={14} height={24} rx={3}
            fill={COLORS.cool_silver} fillOpacity={0.2} stroke={COLORS.cool_silver} strokeWidth={1} />
          {/* ORION label */}
          <text x={0} y={25} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={800} fill={COLORS.deep_black}
            opacity={0.3} letterSpacing="0.15em">
            ORION
          </text>
          {/* NASA flag stripe */}
          <rect x={-30} y={35} width={60} height={4} rx={2}
            fill={COLORS.sky_blue} fillOpacity={0.3} />
        </g>

        {/* Descent arrow */}
        <path d="M 540,470 L 540,700"
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2.5}
          strokeDasharray={260} strokeDashoffset={arrowDraw}
          opacity={0.25} strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* === Ocean surface — detailed layered waves === */}
        <g opacity={oceanEnt.opacity}>
          {/* Primary wave */}
          <path d={`M 0,${1020 + wave1} Q 135,${995 + wave1} 270,${1020 + wave1} T 540,${1020 + wave1} T 810,${1020 + wave1} T 1080,${1020 + wave1}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={3.5}
            strokeDasharray={960} strokeDashoffset={surfaceDraw}
            opacity={0.5} />
          {/* Secondary wave */}
          <path d={`M 0,${1045 + wave2} Q 180,${1025 + wave2} 360,${1045 + wave2} T 720,${1045 + wave2} T 1080,${1045 + wave2}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5} opacity={0.3} />
          {/* Tertiary wave */}
          <path d={`M 0,${1065 + wave3} Q 240,${1050 + wave3} 480,${1065 + wave3} T 960,${1065 + wave3}`}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.18} />
          {/* Depth layers */}
          <rect x={0} y={1070} width={1080} height={40} fill={COLORS.sky_blue} fillOpacity={0.06} />
          <rect x={0} y={1110} width={1080} height={50} fill={COLORS.sky_blue} fillOpacity={0.04} />
          <rect x={0} y={1160} width={1080} height={60} fill={COLORS.sky_blue} fillOpacity={0.03} />
          {/* Spray particles */}
          {spray.map((s, i) => (
            <circle key={`sp${i}`} cx={s.x} cy={s.y} r={s.r} fill={COLORS.sky_blue} opacity={s.op} />
          ))}
        </g>

        {/* === 40,000 KM/H — Giant speed counter === */}
        <g opacity={statEnt.opacity}
          transform={`translate(540, ${1310 + statEnt.translateY})`}>
          {/* Ghost background number */}
          <text x={0} y={0} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={180} fontWeight={900}
            fill={COLORS.orange} opacity={0.06 * shimmer}>
            40,000
          </text>
          {/* Main speed number with pulse */}
          <text x={0} y={0} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={140} fontWeight={900}
            fill={COLORS.orange}
            style={{ transform: `scale(${pulse})`, transformOrigin: '0px 0px' }}>
            {speedCounter.toLocaleString()}
          </text>
          {/* Unit label */}
          <text x={0} y={55} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={600} fill={COLORS.cool_silver}>
            KILOMETERS PER HOUR
          </text>
          {/* Underline accent */}
          <rect x={-160} y={70} width={320} height={3} rx={1.5}
            fill={COLORS.orange} fillOpacity={0.3} />
        </g>

        {/* === Three info cards — well-spaced row === */}
        <g opacity={card1Ent.opacity}
          transform={`translate(60, ${1440 + card1Ent.translateY})`}>
          <rect x={0} y={0} width={300} height={120} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.07}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.sky_blue} />
          {/* Water drop icon */}
          <path d="M 40,30 Q 40,20 48,35 Q 56,50 48,55 Q 40,60 32,55 Q 24,50 32,35 Z"
            fill={COLORS.sky_blue} fillOpacity={0.2} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <text x={70} y={50} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>Water</text>
          <text x={70} y={85} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>Absorbs impact force</text>
        </g>

        <g opacity={card2Ent.opacity}
          transform={`translate(390, ${1440 + card2Ent.translateY})`}>
          <rect x={0} y={0} width={300} height={120} rx={14}
            fill={COLORS.green} fillOpacity={0.07}
            stroke={COLORS.green} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.green} />
          {/* Shield icon */}
          <path d="M 40,25 L 28,32 L 28,48 Q 28,58 40,65 Q 52,58 52,48 L 52,32 Z"
            fill={COLORS.green} fillOpacity={0.2} stroke={COLORS.green} strokeWidth={1.5} />
          <text x={70} y={50} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>Pacific</text>
          <text x={70} y={85} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>Fleet prepositioned</text>
        </g>

        <g opacity={card3Ent.opacity}
          transform={`translate(720, ${1440 + card3Ent.translateY})`}>
          <rect x={0} y={0} width={300} height={120} rx={14}
            fill={COLORS.orange} fillOpacity={0.07}
            stroke={COLORS.orange} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.orange} />
          {/* Lightning bolt icon */}
          <path d="M 40,25 L 34,42 L 42,42 L 36,60 L 48,38 L 40,38 L 46,25 Z"
            fill={COLORS.orange} fillOpacity={0.3} stroke={COLORS.orange} strokeWidth={1} />
          <text x={70} y={50} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>Physics</text>
          <text x={70} y={85} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>Not tradition drives it</text>
        </g>

        {/* Bottom divider */}
        <line x1={60} y1={1610} x2={1020} y2={1610}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.06} />

        {/* Bottom note */}
        <text x={540} y={1660} textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={30} fontWeight={500} fill={COLORS.cool_silver}
          opacity={card3Ent.opacity * 0.6}>
          Physics dictates the landing zone — not tradition
        </text>

        {/* Decorative corner accents */}
        <path d="M 60,1710 L 60,1770 M 60,1710 L 120,1710"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={2} opacity={0.15} strokeLinecap="round" />
        <path d="M 1020,1710 L 1020,1770 M 1020,1710 L 960,1710"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={2} opacity={0.15} strokeLinecap="round" />

        {/* ── Caption ── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
