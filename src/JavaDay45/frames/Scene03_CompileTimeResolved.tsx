/**
 * Scene 03 — Compile Time Resolved
 * "resolved at compile time."
 * CSV: 13.220s → 14.540s
 * Duration: 59 frames (short transition scene)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Hero text springs in with emphasis
 *   Phase 2 (frames 15–45): Compiler gear icon draws, stamp animation
 *   Phase 3 (frames 40–end): Pulse glow on word "compile"
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene03_CompileTimeResolved: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const heroWord1     = useSpringEntrance(frame, 3);
  const heroWord2     = useSpringEntrance(frame, 7);
  const heroWord3     = useSpringEntrance(frame, 11);

  // ── Phase 2: Gear + stamp ──────────────────────────────────────────────────
  const gearEntrance  = useSpringEntrance(frame, 14);
  const stampScale    = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_SNAP });
  const stampOpacity  = interpolate(frame, [18, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Path draws ─────────────────────────────────────────────────────────────
  const gearOutline   = usePathDraw(frame, 14, 500, 25);
  const checkDraw     = usePathDraw(frame, 22, 60, 15);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const gearRotation  = frame * 1.5;
  const breathe       = Math.sin(frame * 0.08) * 3;
  const pulse         = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer       = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.85, 1]);
  const glowRadius    = interpolate(Math.sin(frame * 0.09), [-1, 1], [80, 100]);

  // ── Border draw on card ────────────────────────────────────────────────────
  const cardPerimeter = 2 * (800 + 400);
  const borderDash    = interpolate(frame, [15, 40], [cardPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  // Gear teeth path (8-tooth gear)
  const gearPath = (() => {
    const cx = 540, cy = 900, outerR = 120, innerR = 85, teeth = 8;
    let d = '';
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((i + 0.3) / teeth) * Math.PI * 2 - Math.PI / 2;
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2 - Math.PI / 2;
      const a4 = ((i + 0.8) / teeth) * Math.PI * 2 - Math.PI / 2;
      const cmd = i === 0 ? 'M' : 'L';
      d += `${cmd}${cx + innerR * Math.cos(a1)},${cy + innerR * Math.sin(a1)} `;
      d += `L${cx + outerR * Math.cos(a2)},${cy + outerR * Math.sin(a2)} `;
      d += `L${cx + outerR * Math.cos(a3)},${cy + outerR * Math.sin(a3)} `;
      d += `L${cx + innerR * Math.cos(a4)},${cy + innerR * Math.sin(a4)} `;
    }
    d += 'Z';
    return d;
  })();

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TICKETING ENGINE · COMPILE TIME" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero words ──────────────────────────────────────── */}
        <g transform={`translate(0, ${heroWord1.translateY})`} opacity={heroWord1.opacity}>
          <text x={540} y={340} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Resolved
          </text>
        </g>
        <g transform={`translate(0, ${heroWord2.translateY})`} opacity={heroWord2.opacity}>
          <text x={540} y={450} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent}>
            at Compile
          </text>
        </g>
        <g transform={`translate(0, ${heroWord3.translateY})`} opacity={heroWord3.opacity}>
          <text x={540} y={550} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Time
          </text>
        </g>

        {/* ── ZONE C — Gear illustration ───────────────────────────────── */}
        {/* Glow behind gear */}
        <circle cx={540} cy={900} r={glowRadius}
          fill={COLORS.accent} fillOpacity={0.04 * shimmer} />

        <g opacity={gearEntrance.opacity}
          transform={`translate(0, ${gearEntrance.translateY}) rotate(${gearRotation}, 540, 900)`}>
          {/* Gear body */}
          <path d={gearPath}
            fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={500} strokeDashoffset={gearOutline} />
          {/* Inner circle */}
          <circle cx={540} cy={900} r={50}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Center dot */}
          <circle cx={540} cy={900} r={12}
            fill={COLORS.accent} fillOpacity={0.5} />
        </g>

        {/* ── Checkmark stamp ─────────────────────────────────────────── */}
        <g opacity={stampOpacity}
          transform={`translate(540, 900) scale(${stampScale})`}
          style={{ transformOrigin: '0px 0px' }}>
          <path d="M -20,5 L -5,20 L 25,-15"
            fill="none" stroke={COLORS.accent} strokeWidth={6}
            strokeDasharray={60} strokeDashoffset={checkDraw}
            strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── Info cards below gear ────────────────────────────────────── */}
        <g opacity={gearEntrance.opacity} transform={`translate(0, ${gearEntrance.translateY})`}>
          {/* Main card */}
          <rect x={140} y={1060} width={800} height={200} rx={20}
            fill={COLORS.bg_secondary}
            stroke="none" />
          <rect x={140} y={1060} width={800} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={cardPerimeter} strokeDashoffset={borderDash} />
          <text x={540} y={1140} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Compiler selects the method
          </text>
          <text x={540} y={1200} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            before the program runs
          </text>
        </g>

        {/* ── Two info tiles ───────────────────────────────────────────── */}
        <g opacity={gearEntrance.opacity} transform={`translate(0, ${gearEntrance.translateY})`}>
          <BentoCard x={60} y={1320} w={460} h={180} />
          <text x={100} y={1385} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            PARAMETER COUNT
          </text>
          <text x={100} y={1440} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Determines Match
          </text>

          <BentoCard x={560} y={1320} w={460} h={180} accent />
          <text x={600} y={1385} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            PARAMETER TYPES
          </text>
          <text x={600} y={1440} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Narrow Selection
          </text>
        </g>

        {/* ── Floating particles ───────────────────────────────────────── */}
        <circle cx={200} cy={700 + breathe} r={6} fill={COLORS.accent} fillOpacity={0.15 * shimmer} />
        <circle cx={880} cy={750 + breathe * 0.8} r={8} fill={COLORS.accent} fillOpacity={0.1 * shimmer} />
        <circle cx={300} cy={1100 + breathe * 1.2} r={5} fill={COLORS.accent} fillOpacity={0.12} />

        {/* ── Divider track ────────────────────────────────────────────── */}
        <line x1={60} y1={1560} x2={1020} y2={1560}
          stroke={COLORS.accent} strokeWidth={2} opacity={0.15 * shimmer} />

        {/* ── Pulsing accent ring ──────────────────────────────────────── */}
        <circle cx={540} cy={900} r={160}
          fill="none" stroke={COLORS.accent} strokeWidth={1.5}
          opacity={0.1 * pulse} />

        {/* ── Caption ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
