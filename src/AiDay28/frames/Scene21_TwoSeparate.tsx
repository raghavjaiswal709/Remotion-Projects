/**
 * Scene 21 — TwoSeparate
 * "Decision and execution are two separate things."
 * CSV: 67.860s → 71.500s
 * Duration: 109 frames (3.63s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + headline spring
 *   Phase 2 (frames 12–70): Two large circles separated by a vertical gap —
 *                            left = "DECISION" (brain icon), right = "EXECUTION" (gear icon).
 *                            Divider line + "≠" symbol path-draw.
 *   Phase 3 (frames 60–end): Pulse rings, floating particles, shimmer
 *
 * Visual: Two distinct spheres with a clear divide (not-equal, separate)
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

export const Scene21_TwoSeparate: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const heroWords = ['Two', 'Separate', 'Things'];

  // ── Phase 2 — Two circles ────────────────────────────────────────────────

  // Left circle: DECISION
  const decCircle = useSpringEntrance(frame, 12);
  const decCircleScale = spring({ frame: Math.max(0, frame - 12), fps, config: SPRING_SNAP });
  const decCirclePerim = 2 * Math.PI * 120;
  const decBorderDash = usePathDraw(frame, 14, decCirclePerim, 24);

  // Right circle: EXECUTION
  const exeCircle = useSpringEntrance(frame, 16);
  const exeCircleScale = spring({ frame: Math.max(0, frame - 16), fps, config: SPRING_SNAP });
  const exeCirclePerim = 2 * Math.PI * 120;
  const exeBorderDash = usePathDraw(frame, 18, exeCirclePerim, 24);

  // Centre divider and != symbol
  const dividerLen = 240;
  const dividerDash = usePathDraw(frame, 22, dividerLen, 20);

  const neqEnter = spring({ frame: Math.max(0, frame - 28), fps, config: SPRING_SNAP });
  const neqOp = interpolate(neqEnter, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Brain icon paths inside left circle
  const brainDraw = usePathDraw(frame, 20, 300, 25);

  // Gear icon in right circle
  const gearDraw = usePathDraw(frame, 24, 400, 25);

  // Labels under circles
  const decLabel = useSpringEntrance(frame, 30);
  const exeLabel = useSpringEntrance(frame, 34);

  // Bottom explanation cards
  const card1 = useSpringEntrance(frame, 40);
  const card2 = useSpringEntrance(frame, 46);
  const wideCard = useSpringEntrance(frame, 52);

  // Connection lines from circles down to cards
  const connL = usePathDraw(frame, 36, 200, 20);
  const connR = usePathDraw(frame, 38, 200, 20);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Pulse rings around circles
  const ringRadius = 120 + ((frame * 0.8) % 40);
  const ringOp = interpolate((frame * 0.8) % 40, [0, 40], [0.15, 0], {
    extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  // Circle positions
  const CX_DEC = 290;
  const CX_EXE = 790;
  const CY = 720;
  const CR = 120;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · SEPARATION" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero headline per-word spring ─────────────────────── */}
        {heroWords.map((word, i) => {
          const f = Math.max(0, frame - 4 - i * 6);
          const sp = spring({ frame: f, fps, config: SPRING_SNAP });
          const ty = interpolate(sp, [0, 1], [28, 0]);
          const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
          const isAccent = word === 'Separate';
          return (
            <text key={i}
              x={60 + i * 340} y={320}
              opacity={op}
              transform={`translate(0, ${ty})`}
              fontFamily={FONT} fontSize={88} fontWeight={800}
              fill={isAccent ? COLORS.accent : COLORS.white}
              fontStyle={isAccent ? 'italic' : undefined}>
              {word}
            </text>
          );
        })}

        {/* ── ZONE C — Two circles diagram ────────────────────────────── */}

        {/* Pulse rings (Phase 3) */}
        {frame > 50 && (
          <>
            <circle cx={CX_DEC} cy={CY} r={ringRadius} fill="none"
              stroke={COLORS.accent} strokeWidth={1} opacity={ringOp} />
            <circle cx={CX_EXE} cy={CY} r={ringRadius} fill="none"
              stroke={COLORS.accent} strokeWidth={1} opacity={ringOp * 0.8} />
          </>
        )}

        {/* ── LEFT CIRCLE: DECISION ─────────────────────────────────── */}
        <g opacity={decCircle.opacity}
           transform={`translate(${CX_DEC}, ${CY}) scale(${interpolate(decCircleScale, [0, 1], [0.6, 1])})`}
           style={{ transformOrigin: '0px 0px' }}>
          {/* BG fill */}
          <circle cx={0} cy={0} r={CR} fill={COLORS.bg_secondary} />
          {/* Border draw */}
          <circle cx={0} cy={0} r={CR} fill="none"
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={decCirclePerim} strokeDashoffset={decBorderDash} />
          {/* Brain icon (simplified) */}
          <g opacity={0.9}>
            {/* Brain outline (ellipse halves + folds) */}
            <ellipse cx={-10} cy={-8} rx={32} ry={38} fill="none"
              stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={300} strokeDashoffset={brainDraw} />
            <ellipse cx={10} cy={-8} rx={32} ry={38} fill="none"
              stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={300} strokeDashoffset={brainDraw} />
            {/* Internal folds */}
            <path d="M -14,-30 C -20,-10 -6,10 -14,30"
              fill="none" stroke={COLORS.accent} strokeWidth={1.5}
              strokeDasharray={80} strokeDashoffset={brainDraw * 0.3} />
            <path d="M 14,-30 C 20,-10 6,10 14,30"
              fill="none" stroke={COLORS.accent} strokeWidth={1.5}
              strokeDasharray={80} strokeDashoffset={brainDraw * 0.3} />
            <line x1={0} y1={-38} x2={0} y2={30}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.3}
              strokeDasharray={70} strokeDashoffset={brainDraw * 0.3} />
          </g>
        </g>

        {/* ── RIGHT CIRCLE: EXECUTION ───────────────────────────────── */}
        <g opacity={exeCircle.opacity}
           transform={`translate(${CX_EXE}, ${CY}) scale(${interpolate(exeCircleScale, [0, 1], [0.6, 1])})`}
           style={{ transformOrigin: '0px 0px' }}>
          {/* BG fill */}
          <circle cx={0} cy={0} r={CR} fill={COLORS.bg_secondary} />
          {/* Border draw */}
          <circle cx={0} cy={0} r={CR} fill="none"
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={exeCirclePerim} strokeDashoffset={exeBorderDash} />
          {/* Gear icon */}
          <g opacity={0.9}>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              const inner = 22;
              const outer = 38;
              const pathLen = outer - inner;
              return (
                <line key={i}
                  x1={Math.cos(a) * inner} y1={Math.sin(a) * inner}
                  x2={Math.cos(a) * outer} y2={Math.sin(a) * outer}
                  stroke={COLORS.white} strokeWidth={5} strokeLinecap="round"
                  strokeDasharray={pathLen}
                  strokeDashoffset={gearDraw > 0 ? pathLen : 0} />
              );
            })}
            <circle cx={0} cy={0} r={22} fill="none"
              stroke={COLORS.white} strokeWidth={2}
              strokeDasharray={exeCirclePerim * 0.3}
              strokeDashoffset={gearDraw * 0.3} />
            <circle cx={0} cy={0} r={8} fill={COLORS.white} opacity={0.3} />
          </g>
        </g>

        {/* ── CENTRE DIVIDER ─────────────────────────────────────────── */}
        <line x1={540} y1={CY - 120} x2={540} y2={CY + 120}
          stroke="rgba(255,255,255,0.15)" strokeWidth={2}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDash}
          strokeLinecap="round" />

        {/* ≠ symbol */}
        <g opacity={neqOp} transform={`translate(540, ${CY}) scale(${interpolate(neqEnter, [0, 1], [0.5, 1])})`}
           style={{ transformOrigin: '0px 0px' }}>
          <circle cx={0} cy={0} r={32} fill={COLORS.bg_primary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={0} y={12} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            ≠
          </text>
        </g>

        {/* ── Labels below circles ───────────────────────────────────── */}
        <g opacity={decLabel.opacity} transform={`translate(0, ${decLabel.translateY})`}>
          <text x={CX_DEC} y={CY + 170} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            DECISION
          </text>
          <text x={CX_DEC} y={CY + 210} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Model chooses
          </text>
        </g>
        <g opacity={exeLabel.opacity} transform={`translate(0, ${exeLabel.translateY})`}>
          <text x={CX_EXE} y={CY + 170} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}
            fontStyle="italic">
            EXECUTION
          </text>
          <text x={CX_EXE} y={CY + 210} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            System performs
          </text>
        </g>

        {/* ── Connector lines to bottom cards ────────────────────────── */}
        <line x1={CX_DEC} y1={CY + 230} x2={CX_DEC} y2={1100}
          stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3}
          strokeDasharray={200} strokeDashoffset={connL} />
        <line x1={CX_EXE} y1={CY + 230} x2={CX_EXE} y2={1100}
          stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3}
          strokeDasharray={200} strokeDashoffset={connR} />

        {/* ── Bottom cards ───────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1120} w={460} h={160} accent />
          <rect x={60} y={1120} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1180}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Model = thinking
          </text>
          <text x={100} y={1225}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Decide which tool, what args
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1120} w={460} h={160} />
          <rect x={560} y={1120} width={6} height={160} rx={3} fill={COLORS.white} />
          <text x={600} y={1180}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            System = doing
          </text>
          <text x={600} y={1225}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Run function, return result
          </text>
        </g>

        {/* Wide summary card */}
        <g opacity={wideCard.opacity} transform={`translate(0, ${wideCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={120} accent />
          <text x={540} y={1394} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Two <tspan fill={COLORS.accent} fontStyle="italic">separate</tspan>
            {' '}responsibilities — never mixed
          </text>
        </g>

        {/* ── Floating particles (Phase 3) ──────────────────────────── */}
        {[
          { x: 150, y: 1530 }, { x: 930, y: 1550 },
          { x: 400, y: 1590 }, { x: 680, y: 1610 },
          { x: 540, y: 1660 }, { x: 220, y: 1700 },
          { x: 860, y: 1690 },
        ].map((p, i) => (
          <circle key={i}
            cx={p.x} cy={p.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={2} fill={COLORS.accent}
            opacity={0.07 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s21.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
