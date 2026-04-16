/**
 * Scene 22 — ModelOwnsOne
 * "The model owns one."
 * CSV: 71.500s → 73.120s
 * Duration: 49 frames (1.63s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–16):  Label slam + "MODEL" hero text spring
 *   Phase 2 (frames 8–35):  Large robot head with brain glow inside circle,
 *                            dotted ownership border, "OWNS DECISION" label
 *   Phase 3 (frames 30–end): Pulse ring on circle, shimmer, floating accents
 *
 * Visual: Single hero circle with robot/brain inside, "MODEL → DECISION" flow
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene22_ModelOwnsOne: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const heroSlam = spring({ frame, fps, config: SPRING_SNAP });
  const heroTy = interpolate(heroSlam, [0, 1], [44, 0]);
  const heroOp = interpolate(heroSlam, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // ── Phase 2 — Circle with robot head ─────────────────────────────────────
  const circleEnter = useSpringEntrance(frame, 6);
  const circleScale = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_SNAP });
  const CR = 160;
  const CX = 540;
  const CY = 780;
  const circPerim = 2 * Math.PI * CR;
  const circleBorderDash = usePathDraw(frame, 8, circPerim, 20);

  // Robot head inside circle
  const robotEnter = useSpringEntrance(frame, 10);

  // Brain glow
  const brainGlow = useSpringEntrance(frame, 14);
  const brainPathLen = 220;
  const brainDash = usePathDraw(frame, 16, brainPathLen, 18);

  // Ownership label
  const ownLabel = useSpringEntrance(frame, 18);

  // Arrow from circle to label
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 16, arrowLen, 14);

  // Bottom cards
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 24);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.08) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  // Pulse rings
  const ringR = CR + ((frame * 1.2) % 50);
  const ringOp = interpolate((frame * 1.2) % 50, [0, 50], [0.12, 0], {
    extrapolateRight: 'clamp',
  });

  // Floating accent dots
  const floatDots = [
    { x: 160, y: 550 }, { x: 920, y: 580 }, { x: 280, y: 1050 },
    { x: 800, y: 1020 }, { x: 440, y: 1080 }, { x: 640, y: 540 },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · OWNERSHIP" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero headline ─────────────────────────────────── */}
        <g opacity={heroOp} transform={`translate(0, ${heroTy})`}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.white}>
            The Model
          </text>
        </g>
        <g opacity={heroOp * 0.9} transform={`translate(0, ${heroTy + 4})`}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Owns One
          </text>
        </g>

        {/* ── ZONE C — Central circle ────────────────────────────────── */}

        {/* Pulse rings (Phase 3) */}
        {frame > 28 && (
          <>
            <circle cx={CX} cy={CY} r={ringR}
              fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={ringOp} />
            <circle cx={CX} cy={CY} r={ringR + 20}
              fill="none" stroke={COLORS.accent} strokeWidth={0.5} opacity={ringOp * 0.6} />
          </>
        )}

        {/* Main circle */}
        <g opacity={circleEnter.opacity}
           transform={`translate(${CX}, ${CY}) scale(${interpolate(circleScale, [0, 1], [0.5, 1])})`}
           style={{ transformOrigin: '0px 0px' }}>
          {/* BG fill */}
          <circle cx={0} cy={0} r={CR} fill={COLORS.bg_secondary} />
          {/* Accent glow behind */}
          <circle cx={0} cy={0} r={CR - 10}
            fill={COLORS.accent} opacity={0.04 * shimmer} />
          {/* Border draw */}
          <circle cx={0} cy={0} r={CR} fill="none"
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={circPerim} strokeDashoffset={circleBorderDash} />

          {/* Robot head */}
          <g opacity={robotEnter.opacity} transform={`translate(0, ${robotEnter.translateY * 0.5})`}>
            {/* Head */}
            <rect x={-48} y={-60} width={96} height={76} rx={16}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Eyes */}
            <circle cx={-20} cy={-30} r={8} fill={COLORS.accent} opacity={0.7 * shimmer} />
            <circle cx={20} cy={-30} r={8} fill={COLORS.accent} opacity={0.7 * shimmer} />
            {/* Mouth smile */}
            <path d="M -16,-8 Q 0,6 16,-8" fill="none"
              stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
            {/* Antenna */}
            <line x1={0} y1={-60} x2={0} y2={-80}
              stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={-84} r={4} fill={COLORS.accent}
              opacity={0.6 + 0.4 * Math.sin(frame * 0.15)} />
          </g>

          {/* Brain glow (behind robot) */}
          <g opacity={brainGlow.opacity * 0.5}>
            <ellipse cx={-8} cy={-34} rx={28} ry={20} fill="none"
              stroke={COLORS.accent} strokeWidth={1}
              strokeDasharray={brainPathLen} strokeDashoffset={brainDash} opacity={0.4} />
            <ellipse cx={8} cy={-34} rx={28} ry={20} fill="none"
              stroke={COLORS.accent} strokeWidth={1}
              strokeDasharray={brainPathLen} strokeDashoffset={brainDash} opacity={0.4} />
          </g>

          {/* Inner label */}
          <text x={0} y={80} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            MODEL
          </text>
        </g>

        {/* ── Arrow down to ownership label ──────────────────────────── */}
        <line x1={CX} y1={CY + CR + 20} x2={CX} y2={CY + CR + 20 + arrowLen}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* Ownership badge */}
        <g opacity={ownLabel.opacity} transform={`translate(0, ${ownLabel.translateY})`}>
          <rect x={CX - 160} y={CY + CR + 160} width={320} height={56} rx={28}
            fill={COLORS.accent} opacity={0.15} />
          <rect x={CX - 160} y={CY + CR + 160} width={320} height={56} rx={28}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={CX} y={CY + CR + 196} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            OWNS DECISION
          </text>
        </g>

        {/* ── Bottom cards ───────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1200} w={460} h={160} accent />
          <rect x={60} y={1200} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1268}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Which tool to call
          </text>
          <text x={100} y={1314}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            search(), calculate(), respond()
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1200} w={460} h={160} />
          <rect x={560} y={1200} width={6} height={160} rx={3} fill={COLORS.accent} opacity={0.5} />
          <text x={600} y={1268}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            What arguments
          </text>
          <text x={600} y={1314}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            name, values, format
          </text>
        </g>

        {/* Wide card */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY + 4})`}>
          <BentoCard x={60} y={1400} w={960} h={110} accent />
          <text x={540} y={1468} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The model <tspan fill={COLORS.accent} fontStyle="italic">decides</tspan>
            {' '} — it does not execute
          </text>
        </g>

        {/* ── Floating dots (Phase 3) ────────────────────────────────── */}
        {floatDots.map((d, i) => (
          <circle key={i}
            cx={d.x} cy={d.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={2.5} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {/* ── Accent particles near circle ───────────────────────────── */}
        {frame > 20 && [
          { angle: frame * 0.02, dist: CR + 40 },
          { angle: frame * 0.02 + 2.1, dist: CR + 50 },
          { angle: frame * 0.02 + 4.2, dist: CR + 35 },
        ].map((pt, i) => (
          <circle key={i}
            cx={CX + Math.cos(pt.angle) * pt.dist}
            cy={CY + Math.sin(pt.angle) * pt.dist}
            r={2} fill={COLORS.accent} opacity={0.15} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s22.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
