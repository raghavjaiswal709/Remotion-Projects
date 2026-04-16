/**
 * Scene 03 — SpecExecution
 * "The model writes a structured specification and something else executes it."
 * CSV: 8.020s → 12.980s
 * Duration: 148 frames (4.93s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Label + headline spring in
 *   Phase 2 (20–90): Two-column comparison — spec vs execution
 *   Phase 3 (80–end): Path draw connectors + micro-anims
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

export const Scene03_SpecExecution: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  // ── Phase 2: Two-column layout ─────────────────────────────────────────────
  const leftCard = useSpringEntrance(frame, 20);
  const rightCard = useSpringEntrance(frame, 32);
  const arrowEnt = useSpringEntrance(frame, 44);
  const bottomCard = useSpringEntrance(frame, 56);

  // Border draws
  const leftPerim = 2 * (440 + 560);
  const leftDash = usePathDraw(frame, 20, leftPerim, 30);
  const rightPerim = 2 * (440 + 560);
  const rightDash = usePathDraw(frame, 32, rightPerim, 30);

  // Center arrow
  const centerArrowLen = 100;
  const centerArrowDash = usePathDraw(frame, 38, centerArrowLen, 20);

  // Spec lines inside left card (staggered)
  const specLines = [
    { text: '{ "tool": "search"', delay: 26 },
    { text: '  "query": "weather"', delay: 30 },
    { text: '  "params": {...}', delay: 34 },
    { text: '}', delay: 38 },
  ];

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Floating particles
  const particles = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 + frame * 0.012;
    const r = 350 + Math.sin(frame * 0.03 + i) * 40;
    return {
      x: 540 + Math.cos(a) * r,
      y: 900 + Math.sin(a) * r * 0.4,
      op: 0.12 + Math.sin(frame * 0.05 + i) * 0.08,
      size: 2 + (i % 3),
    };
  });

  // Bottom card border draw
  const bottomPerim = 2 * (960 + 200);
  const bottomDash = usePathDraw(frame, 56, bottomPerim, 30);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · TOOL USE" y={160} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Two Halves
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Specification + Execution
          </text>
        </g>

        {/* ── ZONE C — Left card: SPEC ──────────────────────────────────── */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={470} w={440} h={560} accent />
          <rect x={60} y={470} width={440} height={560} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={leftPerim} strokeDashoffset={leftDash} />
          <text x={280} y={540} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            SPECIFICATION
          </text>
          {/* Divider */}
          <line x1={100} y1={565} x2={460} y2={565}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Robot head icon — model writes */}
          <g transform={`translate(280, 640)`}>
            <rect x={-40} y={-35} width={80} height={60} rx={12}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={-14} cy={-10} r={7} fill={COLORS.accent} />
            <circle cx={14} cy={-10} r={7} fill={COLORS.accent} />
            <rect x={-20} y={8} width={40} height={4} rx={2} fill={COLORS.accent} opacity={0.5} />
          </g>

          <text x={280} y={700} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Model writes
          </text>

          {/* JSON spec lines */}
          {specLines.map((line, i) => {
            const lineOp = interpolate(frame, [line.delay, line.delay + 10], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={i} x={120} y={760 + i * 48} fontFamily="'Fira Code', monospace"
                fontSize={28} fontWeight={500} fill={COLORS.accent} opacity={lineOp}>
                {line.text}
              </text>
            );
          })}
        </g>

        {/* ── Center arrow ──────────────────────────────────────────────── */}
        <g opacity={arrowEnt.opacity}>
          <line x1={500} y1={750} x2={540} y2={750}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={centerArrowLen} strokeDashoffset={centerArrowDash}
            markerEnd="url(#arrow)" />
          {/* Pulsing dot at arrow tip */}
          <circle cx={540} cy={750} r={6} fill={COLORS.accent}
            opacity={arrowEnt.opacity * shimmer}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 750px' }} />
        </g>

        {/* ── ZONE C — Right card: EXECUTE ──────────────────────────────── */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={560} y={470} w={460} h={560} />
          <rect x={560} y={470} width={460} height={560} rx={20}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={rightPerim} strokeDashoffset={rightDash} />
          <text x={790} y={540} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
            EXECUTION
          </text>
          <line x1={600} y1={565} x2={980} y2={565}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Question mark icon */}
          <g transform={`translate(790, 720)`}>
            <circle cx={0} cy={0} r={60} fill={COLORS.bg_primary}
              stroke={COLORS.vibrant_red} strokeWidth={2} />
            <text x={0} y={20} textAnchor="middle"
              fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.vibrant_red}>
              ?
            </text>
          </g>

          <text x={790} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Something else
          </text>
          <text x={790} y={870} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted} fontStyle="italic">
            executes it
          </text>

          {/* Dashed placeholder box */}
          <rect x={650} y={900} width={280} height={80} rx={12}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray="8,6" opacity={rightCard.opacity * 0.5} />
          <text x={790} y={950} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red} opacity={0.6}>
            ???
          </text>
        </g>

        {/* ── Bottom summary card ────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={200} accent />
          <rect x={60} y={1080} width={960} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={bottomPerim} strokeDashoffset={bottomDash} />
          <rect x={60} y={1080} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={120} y={1160} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The model writes the spec
          </text>
          <text x={120} y={1220} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Something else runs the tool
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={COLORS.accent} opacity={p.op} />
        ))}

        {/* ── Connector dots at bottom ───────────────────────────────────── */}
        <g opacity={bottomCard.opacity * 0.4}>
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx={220 + i * 160} cy={1380 + breathe * (i % 2 === 0 ? 1 : -1)}
              r={4} fill={COLORS.accent} />
          ))}
        </g>

        {/* ── Gear illustration bottom-right ─────────────────────────────── */}
        <g transform={`translate(860, ${1560 + breathe})`} opacity={0.35 * shimmer}>
          <circle cx={0} cy={0} r={44} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} opacity={0.15} />
        </g>

        {/* ── CAPTION ───────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
