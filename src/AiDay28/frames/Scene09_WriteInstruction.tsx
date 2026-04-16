/**
 * Scene 09 — WriteInstruction
 * "What the model does is write an instruction."
 * CSV: 28.700s → 31.300s
 * Duration: 106 frames (3.53s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring
 *   Phase 2 (frames 15–65):  Robot writing on paper, instruction text, pen path draw
 *   Phase 3 (frames 55–end): Paper shimmer, floating letters, pulse
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene09_WriteInstruction: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 9);

  // ── Phase 2 ──────────────────────────────────────────────────────────────
  const robotEnter = useSpringEntrance(frame, 12);
  const paperEnter = useSpringEntrance(frame, 18);
  const penProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Pen stroke path draw — the pen writing on paper
  const penPathLen = 400;
  const penDash = usePathDraw(frame, 22, penPathLen, 28);

  // Instruction text typewriter
  const instructionText = '{"tool": "search", "query": "weather"}';
  const charsVisible = Math.floor(interpolate(frame, [26, 55], [0, instructionText.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));
  const displayText = instructionText.slice(0, charsVisible);

  // Explanation cards
  const card1 = useSpringEntrance(frame, 40);
  const card2 = useSpringEntrance(frame, 50);
  const card3 = useSpringEntrance(frame, 60);

  // Arrow from robot to paper
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 16, arrowLen, 18);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const paperGlow = 0.08 + Math.sin(frame * 0.07) * 0.04;
  const cursorBlink = Math.sin(frame * 0.25) > 0 ? 1 : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · MECHANISM" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={280}
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Writes An
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Instruction
          </text>
        </g>

        {/* ── ZONE C — Robot writing on paper illustration ──────────────── */}

        {/* Robot (left) */}
        <g opacity={robotEnter.opacity}
           transform={`translate(200, ${680 + robotEnter.translateY + breathe})`}>
          {/* Head */}
          <rect x={-60} y={-80} width={120} height={100} rx={12}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eyes — focused / concentrated */}
          <rect x={-35} y={-50} width={22} height={4} rx={2} fill={COLORS.accent} opacity={shimmer} />
          <rect x={13} y={-50} width={22} height={4} rx={2} fill={COLORS.accent} opacity={shimmer} />
          {/* Antenna */}
          <line x1={0} y1={-80} x2={0} y2={-105} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={0} cy={-111} r={6} fill={COLORS.accent} opacity={0.5 * shimmer} />
          {/* Body */}
          <rect x={-75} y={40} width={150} height={130} rx={10}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Writing arm extending right */}
          <rect x={75} y={55} width={80} height={22} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Pen at end of arm */}
          <polygon
            points="155,55 175,66 155,77"
            fill={COLORS.accent} opacity={0.9} />
          {/* Circuitry lines on body */}
          <line x1={-40} y1={80} x2={40} y2={80}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
          <line x1={-40} y1={110} x2={40} y2={110}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
          <line x1={-40} y1={140} x2={40} y2={140}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
          {/* Label */}
          <text x={0} y={220} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            MODEL
          </text>
        </g>

        {/* Arrow from robot to paper */}
        <line x1={320} y1={710} x2={440} y2={710}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Paper / Document (right) */}
        <g opacity={paperEnter.opacity}
           transform={`translate(500, ${580 + paperEnter.translateY})`}>
          {/* Paper glow behind */}
          <rect x={-10} y={-10} width={520} height={340} rx={18}
            fill={COLORS.accent} opacity={paperGlow} />
          {/* Paper body */}
          <rect x={0} y={0} width={500} height={320} rx={14}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Header bar */}
          <rect x={0} y={0} width={500} height={50} rx={14}
            fill={COLORS.accent} opacity={0.1} />
          <text x={24} y={36}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>
            INSTRUCTION
          </text>
          {/* Pen stroke — writing animation */}
          <path d="M 20,70 C 60,68 200,75 300,72 C 340,71 420,76 480,73"
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.3}
            strokeDasharray={penPathLen} strokeDashoffset={penDash}
            strokeLinecap="round" />
          {/* Typed instruction text */}
          <text x={24} y={120}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500}
            fill={COLORS.accent}>
            {displayText}
          </text>
          {/* Cursor */}
          <rect x={24 + charsVisible * 13.5} y={98} width={2} height={28}
            fill={COLORS.accent} opacity={cursorBlink} />
          {/* Sub-lines placeholder */}
          <rect x={24} y={145} width={320} height={8} rx={4}
            fill="rgba(255,255,255,0.08)" />
          <rect x={24} y={168} width={400} height={8} rx={4}
            fill="rgba(255,255,255,0.08)" />
          <rect x={24} y={191} width={260} height={8} rx={4}
            fill="rgba(255,255,255,0.08)" />
          {/* Bottom label */}
          <rect x={24} y={240} width={140} height={40} rx={8}
            fill={COLORS.accent} opacity={0.12} />
          <text x={94} y={267} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            JSON
          </text>
        </g>

        {/* ── Explanation cards ──────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={140} accent />
          <rect x={60} y={1120} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1200}
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Model produces structured text output
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1290} w={460} h={140} />
          <text x={100} y={1375}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Not free-form prose
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1290} w={460} h={140} />
          <text x={600} y={1375}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Formatted specification
          </text>
        </g>

        {/* ── Floating accent circles ────────────────────────────────────── */}
        {[
          { x: 90, y: 520 }, { x: 990, y: 550 },
          { x: 120, y: 1560 }, { x: 950, y: 1600 },
          { x: 540, y: 1680 }, { x: 300, y: 1640 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 1.1) * 5}
            r={3 + Math.sin(frame * 0.06 + i) * 1}
            fill={COLORS.accent} opacity={0.12 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
