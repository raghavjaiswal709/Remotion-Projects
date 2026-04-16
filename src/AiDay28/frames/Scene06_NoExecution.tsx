/**
 * Scene 06 — NoExecution
 * "The model does not execute functions."
 * CSV: 19.560s → 21.400s
 * Duration: 79 frames (2.63s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Headline + label spring in
 *   Phase 2 (frames 15–50):  Large robot with big X over execute, function code block faded
 *   Phase 3 (frames 40–end): X pulse, robot breathe, particles
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

export const Scene06_NoExecution: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Reveal ─────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 5);
  const subline = useSpringEntrance(frame, 10);

  // ── Phase 2: Illustration ───────────────────────────────────────────────────
  const robotEnter = useSpringEntrance(frame, 14);
  const xMarkEnter = (() => {
    const f = Math.max(0, frame - 22);
    const p = spring({ frame: f, fps, config: SPRING_SNAP });
    return { progress: p, opacity: interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' }) };
  })();
  const codeBlock = useSpringEntrance(frame, 18);
  const card1 = useSpringEntrance(frame, 30);
  const card2 = useSpringEntrance(frame, 40);

  // X mark draw
  const xLen1 = 200;
  const xDash1 = usePathDraw(frame, 22, xLen1, 12);
  const xLen2 = 200;
  const xDash2 = usePathDraw(frame, 26, xLen2, 12);

  // Barrier line
  const barrierLen = 800;
  const barrierDash = usePathDraw(frame, 32, barrierLen, 20);

  // ── Phase 3: Micro-animations ───────────────────────────────────────────────
  const xPulse = 1 + Math.sin(frame * 0.12) * 0.03;
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · BOUNDARY" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Does NOT
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}>
            Execute
          </text>
        </g>

        {/* ── ZONE C — Robot blocked from function ─────────────────────── */}

        {/* Robot (left side) */}
        <g opacity={robotEnter.opacity}
           transform={`translate(250, ${740 + robotEnter.translateY + breathe})`}>
          {/* Head */}
          <rect x={-70} y={-90} width={140} height={120} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eyes */}
          <circle cx={-25} cy={-40} r={12} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={-25} cy={-40} r={4} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={25} cy={-40} r={12} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={25} cy={-40} r={4} fill={COLORS.accent} opacity={shimmer} />
          {/* Sad mouth */}
          <path d="M -15,5 Q 0,-5 15,5" fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          {/* Body */}
          <rect x={-90} y={50} width={180} height={160} rx={14}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Chest circle */}
          <circle cx={0} cy={115} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={0} cy={115} r={6} fill={COLORS.vibrant_red} opacity={0.6 * shimmer} />
          {/* Arms down, not reaching */}
          <rect x={-115} y={70} width={25} height={100} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          <rect x={90} y={70} width={25} height={100} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Label */}
          <text x={0} y={260} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            MODEL
          </text>
        </g>

        {/* Barrier line */}
        <line x1={500} y1={560} x2={500} y2={1040}
          stroke={COLORS.vibrant_red} strokeWidth={4} opacity={0.4}
          strokeDasharray={barrierLen} strokeDashoffset={barrierDash}
          strokeLinecap="round"
        />

        {/* Function code block (right side, faded / blocked) */}
        <g opacity={codeBlock.opacity * 0.4}
           transform={`translate(760, ${740 + codeBlock.translateY})`}>
          <rect x={-180} y={-100} width={360} height={300} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          {/* Function keyword lines */}
          <text x={-140} y={-50}
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.6}>
            function()
          </text>
          <text x={-140} y={-10}
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.6}>
            {'  execute()'}
          </text>
          <text x={-140} y={30}
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.6}>
            {'  return result'}
          </text>
          <text x={-140} y={70}
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.6}>
            {'}'}
          </text>
          {/* Label */}
          <text x={0} y={260} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            FUNCTION
          </text>
        </g>

        {/* Big X mark over center */}
        <g transform={`scale(${xPulse})`} style={{ transformOrigin: '540px 780px' }}>
          <line x1={430} y1={660} x2={650} y2={900}
            stroke={COLORS.vibrant_red} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={xLen1} strokeDashoffset={xDash1}
            opacity={xMarkEnter.opacity}
          />
          <line x1={650} y1={660} x2={430} y2={900}
            stroke={COLORS.vibrant_red} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={xLen2} strokeDashoffset={xDash2}
            opacity={xMarkEnter.opacity}
          />
        </g>

        {/* ── Explanation cards ─────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={170} accent />
          <rect x={60} y={1100} width={6} height={170} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={1185}
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            No direct function execution
          </text>
          <text x={100} y={1235}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            The model cannot call APIs or run code
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1310} w={960} h={170} />
          <rect x={60} y={1310} width={6} height={170} rx={3}
            fill={COLORS.accent} opacity={0.5} />
          <text x={100} y={1395}
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            Text output only
          </text>
          <text x={100} y={1445}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            It can express intent — not act on it
          </text>
        </g>

        {/* Floating particles */}
        {[
          { x: 90, y: 530, r: 3 }, { x: 990, y: 520, r: 4 },
          { x: 100, y: 1600, r: 3 }, { x: 960, y: 1630, r: 4 },
          { x: 540, y: 1680, r: 3 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 1.2) * 6}
            r={pt.r} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
