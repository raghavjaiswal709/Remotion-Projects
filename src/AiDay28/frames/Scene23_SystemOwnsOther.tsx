/**
 * Scene 23 — SystemOwnsOther
 * "The system owns the other."
 * CSV: 73.120s → 74.960s
 * Duration: 55 frames (1.83s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–18):  Label slide + "SYSTEM" hero slam
 *   Phase 2 (frames 10–38): Large gear icon inside hexagon, code brackets,
 *                            "OWNS EXECUTION" badge, connector path-draws
 *   Phase 3 (frames 30–end): Spinning gear animation, pulse ring, shimmer
 *
 * Visual: Mirror of Scene22 — now showing the SYSTEM side with gear/code imagery
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

// Hexagon path centered at 0,0 with given radius
function hexPath(r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
  });
  return `M ${pts.join(' L ')} Z`;
}

export const Scene23_SystemOwnsOther: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const heroSlam = spring({ frame, fps, config: SPRING_SNAP });
  const heroTy = interpolate(heroSlam, [0, 1], [44, 0]);
  const heroOp = interpolate(heroSlam, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // ── Phase 2 ──────────────────────────────────────────────────────────────
  const hexEnter = useSpringEntrance(frame, 6);
  const hexScale = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_SNAP });

  const HR = 150;
  const HX = 540;
  const HY = 780;
  const hexPerim = 6 * HR;
  const hexBorderDash = usePathDraw(frame, 8, hexPerim, 18);

  // Gear inside hex
  const gearEnter = useSpringEntrance(frame, 10);
  const gearRotation = frame * 2; // steady rotation

  // Brackets
  const leftBracket = useSpringEntrance(frame, 14);
  const rightBracket = useSpringEntrance(frame, 16);

  // Label badge
  const badgeEnter = useSpringEntrance(frame, 18);

  // Arrow down
  const arrowLen = 110;
  const arrowDash = usePathDraw(frame, 16, arrowLen, 14);

  // Bottom cards
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 24);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.08) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  const ringR = HR + ((frame * 1.3) % 48);
  const ringOp = interpolate((frame * 1.3) % 48, [0, 48], [0.1, 0], {
    extrapolateRight: 'clamp',
  });

  // Floating dots
  const floatDots = [
    { x: 180, y: 560 }, { x: 900, y: 580 }, { x: 260, y: 1050 },
    { x: 830, y: 1000 }, { x: 450, y: 1100 }, { x: 680, y: 540 },
  ];

  // Gear teeth (8 teeth path)
  const gearPath = (() => {
    const inner = 40;
    const outer = 56;
    const teeth = 8;
    const pts: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const a0 = (Math.PI * 2 * i) / teeth;
      const a1 = a0 + (Math.PI / teeth) * 0.4;
      const a2 = a0 + (Math.PI / teeth) * 0.6;
      const a3 = a0 + (Math.PI * 2) / teeth;
      pts.push(
        `${inner * Math.cos(a0)},${inner * Math.sin(a0)}`,
        `${outer * Math.cos(a1)},${outer * Math.sin(a1)}`,
        `${outer * Math.cos(a2)},${outer * Math.sin(a2)}`,
        `${inner * Math.cos(a3)},${inner * Math.sin(a3)}`
      );
    }
    return `M ${pts[0]} L ${pts.slice(1).join(' L ')} Z`;
  })();

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

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
            The System
          </text>
        </g>
        <g opacity={heroOp * 0.9} transform={`translate(0, ${heroTy + 4})`}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Owns the Other
          </text>
        </g>

        {/* ── ZONE C — Central hexagon ───────────────────────────────── */}

        {/* Pulse rings */}
        {frame > 28 && (
          <>
            <circle cx={HX} cy={HY} r={ringR}
              fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={ringOp} />
            <circle cx={HX} cy={HY} r={ringR + 18}
              fill="none" stroke={COLORS.accent} strokeWidth={0.5} opacity={ringOp * 0.5} />
          </>
        )}

        {/* Hexagon */}
        <g opacity={hexEnter.opacity}
           transform={`translate(${HX}, ${HY}) scale(${interpolate(hexScale, [0, 1], [0.4, 1])})`}
           style={{ transformOrigin: '0px 0px' }}>
          {/* BG fill */}
          <path d={hexPath(HR)} fill={COLORS.bg_secondary} />
          {/* Accent glow */}
          <path d={hexPath(HR - 12)} fill={COLORS.accent} opacity={0.04 * shimmer} />
          {/* Border draw */}
          <path d={hexPath(HR)} fill="none"
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={hexPerim} strokeDashoffset={hexBorderDash}
            strokeLinejoin="round" />

          {/* Gear icon */}
          <g opacity={gearEnter.opacity}
             transform={`rotate(${gearRotation})`}
             style={{ transformOrigin: '0px 0px' }}>
            <path d={gearPath} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={0} r={6} fill={COLORS.accent} opacity={0.6} />
          </g>

          {/* Inner label */}
          <text x={0} y={90} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            SYSTEM
          </text>
        </g>

        {/* ── Code brackets flanking hex ──────────────────────────────── */}
        <g opacity={leftBracket.opacity} transform={`translate(0, ${leftBracket.translateY})`}>
          <text x={HX - HR - 60} y={HY + 12} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={120} fontWeight={800}
            fill={COLORS.accent} opacity={0.15}>
            {'{ '}
          </text>
        </g>
        <g opacity={rightBracket.opacity} transform={`translate(0, ${rightBracket.translateY})`}>
          <text x={HX + HR + 60} y={HY + 12} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={120} fontWeight={800}
            fill={COLORS.accent} opacity={0.15}>
            {' }'}
          </text>
        </g>

        {/* ── Arrow to badge ─────────────────────────────────────────── */}
        <line x1={HX} y1={HY + HR + 20} x2={HX} y2={HY + HR + 20 + arrowLen}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* Execution badge */}
        <g opacity={badgeEnter.opacity} transform={`translate(0, ${badgeEnter.translateY})`}>
          <rect x={HX - 170} y={HY + HR + 150} width={340} height={56} rx={28}
            fill={COLORS.accent} opacity={0.15} />
          <rect x={HX - 170} y={HY + HR + 150} width={340} height={56} rx={28}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={HX} y={HY + HR + 186} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            OWNS EXECUTION
          </text>
        </g>

        {/* ── Bottom cards ───────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1200} w={460} h={160} accent />
          <rect x={60} y={1200} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1268}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Run the function
          </text>
          <text x={100} y={1314}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Parse spec, call API, return data
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1200} w={460} h={160} />
          <rect x={560} y={1200} width={6} height={160} rx={3}
            fill={COLORS.accent} opacity={0.5} />
          <text x={600} y={1268}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Return the result
          </text>
          <text x={600} y={1314}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Observation back to model
          </text>
        </g>

        {/* Wide card */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY + 4})`}>
          <BentoCard x={60} y={1400} w={960} h={110} accent />
          <text x={540} y={1468} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The system <tspan fill={COLORS.accent} fontStyle="italic">executes</tspan>
            {' '} — it does not decide
          </text>
        </g>

        {/* ── Floating dots ──────────────────────────────────────────── */}
        {floatDots.map((d, i) => (
          <circle key={i}
            cx={d.x} cy={d.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={2.5} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {/* ── Orbiting particles ──────────────────────────────────────── */}
        {frame > 20 && [
          { angle: frame * 0.025, dist: HR + 36 },
          { angle: frame * 0.025 + 2.1, dist: HR + 48 },
          { angle: frame * 0.025 + 4.2, dist: HR + 30 },
        ].map((pt, i) => (
          <circle key={i}
            cx={HX + Math.cos(pt.angle) * pt.dist}
            cy={HY + Math.sin(pt.angle) * pt.dist}
            r={2} fill={COLORS.accent} opacity={0.15} />
        ))}

        {/* ── Terminal dots in top corner ─────────────────────────────── */}
        <g opacity={card1.opacity * 0.5}>
          <circle cx={920} cy={180} r={5} fill={COLORS.vibrant_red} opacity={0.6} />
          <circle cx={940} cy={180} r={5} fill={COLORS.accent} opacity={0.4} />
          <circle cx={960} cy={180} r={5} fill={COLORS.white} opacity={0.2} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s23.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
