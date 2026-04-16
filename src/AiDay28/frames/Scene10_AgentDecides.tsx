/**
 * Scene 10 — AgentDecides
 * "When the agent decides a tool is needed,"
 * CSV: 32.220s → 34.540s
 * Duration: 82 frames (2.73s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring reveal
 *   Phase 2 (frames 14–55):  Agent brain with thought process, decision arrow to tool
 *   Phase 3 (frames 45–end): Pulse rings on decision, thought particles, breathe
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

export const Scene10_AgentDecides: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 9);

  // ── Phase 2 ──────────────────────────────────────────────────────────────
  const brainEnter = useSpringEntrance(frame, 12);
  const thoughtEnter = useSpringEntrance(frame, 18);
  const decisionEnter = useSpringEntrance(frame, 24);
  const toolEnter = useSpringEntrance(frame, 32);

  // Decision arrow — from brain to tool
  const arrowLen = 260;
  const arrowDash = usePathDraw(frame, 28, arrowLen, 22);

  // Thought bubble path draw
  const thoughtLen = 320;
  const thoughtDash = usePathDraw(frame, 16, thoughtLen, 24);

  // Decision checkmark
  const checkLen = 50;
  const checkDash = usePathDraw(frame, 34, checkLen, 14);

  // Cards
  const card1 = useSpringEntrance(frame, 38);
  const card2 = useSpringEntrance(frame, 46);
  const card3 = useSpringEntrance(frame, 54);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const pulseScale = 1 + Math.sin(frame * 0.08) * 0.02;

  // Decision pulse rings
  const ring1Op = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.05, 0.15]);
  const ring1Scale = 1 + Math.sin(frame * 0.12) * 0.1;
  const ring2Op = interpolate(Math.sin(frame * 0.12 + 1.5), [-1, 1], [0.03, 0.1]);
  const ring2Scale = 1 + Math.sin(frame * 0.12 + 1.5) * 0.15;

  // Thought particles floating upward
  const thoughtParticles = [
    { x: 380, baseY: 680, speed: 0.7, phase: 0 },
    { x: 420, baseY: 700, speed: 0.9, phase: 1.2 },
    { x: 350, baseY: 720, speed: 0.5, phase: 2.5 },
    { x: 440, baseY: 660, speed: 0.8, phase: 3.8 },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · DECISION" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={280}
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Agent
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Decides
          </text>
        </g>

        {/* ── ZONE C — Brain/Agent decision → tool illustration ─────────── */}

        {/* Agent brain — large centered circle with brain folds */}
        <g opacity={brainEnter.opacity}
           transform={`translate(330, ${740 + brainEnter.translateY})`}>
          {/* Pulse rings behind brain */}
          <circle cx={0} cy={0} r={130 * ring1Scale} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} opacity={ring1Op} />
          <circle cx={0} cy={0} r={160 * ring2Scale} fill="none"
            stroke={COLORS.accent} strokeWidth={1} opacity={ring2Op} />

          {/* Brain outer shell */}
          <circle cx={0} cy={0} r={100}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Brain folds — left hemisphere */}
          <path d="M -60,-30 C -40,-50 -10,-40 0,-20 C 10,-40 40,-50 60,-30"
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.5 * shimmer}
            strokeDasharray={thoughtLen} strokeDashoffset={thoughtDash} />
          {/* Brain folds — mid */}
          <path d="M -50,10 C -20,-10 20,-10 50,10"
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.4 * shimmer} />
          {/* Brain folds — lower */}
          <path d="M -40,40 C -15,25 15,25 40,40"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3 * shimmer} />
          {/* Brain center glow */}
          <circle cx={0} cy={0} r={18}
            fill={COLORS.accent} opacity={0.15 * shimmer}
            transform={`scale(${pulseScale})`} style={{ transformOrigin: '0px 0px' }} />
          {/* Label */}
          <text x={0} y={140} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            AGENT
          </text>
        </g>

        {/* Thought bubbles rising from brain */}
        {thoughtParticles.map((tp, i) => {
          const yOff = ((frame * tp.speed + tp.phase * 40) % 100) - 50;
          const opac = interpolate(yOff, [-50, -20, 20, 50], [0, 0.3, 0.3, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          return (
            <circle key={i} cx={tp.x} cy={tp.baseY - yOff} r={4}
              fill={COLORS.accent} opacity={opac * brainEnter.opacity} />
          );
        })}

        {/* Decision annotation — "TOOL NEEDED?" */}
        <g opacity={thoughtEnter.opacity}
           transform={`translate(310, ${570 + thoughtEnter.translateY})`}>
          <rect x={-10} y={-28} width={260} height={46} rx={12}
            fill={COLORS.accent} opacity={0.1} />
          <text x={120} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.8}>
            TOOL NEEDED?
          </text>
        </g>

        {/* Decision arrow — from brain to tool card */}
        <path d="M 430,740 C 500,740 560,720 660,700"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Tool card (right side) */}
        <g opacity={toolEnter.opacity}
           transform={`translate(680, ${620 + toolEnter.translateY})`}>
          <rect x={0} y={0} width={320} height={240} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Tool icon — wrench */}
          <g transform="translate(160, 80)">
            <circle cx={0} cy={0} r={32} fill={COLORS.accent} opacity={0.12} />
            <path d="M -18,-18 L -6,-6 L 6,-18 L 18,-6 L 6,6 L 18,18 L 6,18 L -6,6 L -18,18 L -18,6 L -6,-6"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinejoin="round" />
          </g>
          {/* Tool label */}
          <text x={160} y={150} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            TOOL
          </text>
          {/* Tool name */}
          <text x={160} y={192} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            search()
          </text>
        </g>

        {/* Checkmark on decision */}
        <g opacity={decisionEnter.opacity}
           transform={`translate(420, ${640 + decisionEnter.translateY})`}>
          <circle cx={0} cy={0} r={22}
            fill={COLORS.accent} opacity={0.15} />
          <path d="M -10,0 L -3,8 L 10,-8"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={checkLen} strokeDashoffset={checkDash}
            strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── Explanation cards ──────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={150} accent />
          <rect x={60} y={1100} width={6} height={150} rx={3} fill={COLORS.accent} />
          <text x={100} y={1190}
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Agent evaluates context first
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1280} w={460} h={150} />
          <text x={100} y={1370}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Identifies need
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1280} w={460} h={150} />
          <text x={600} y={1370}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Selects the right tool
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {[
          { x: 80, y: 520 }, { x: 1000, y: 540 },
          { x: 100, y: 1560 }, { x: 960, y: 1600 },
          { x: 540, y: 1700 }, { x: 750, y: 1650 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 1.2) * 5}
            r={3} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
