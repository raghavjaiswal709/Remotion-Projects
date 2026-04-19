/**
 * Scene 23 — NextDayTeaser
 * "without stopping to ask you, is the question we answer next."
 * CSV: 74.380s → 77.380s
 * Duration: ~175 frames (to TOTAL_FRAMES 2323)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline springs
 *   Phase 2 (frames 18–70):  Road metaphor — path diverging to two signs ("ASK" vs "ACT"), 
 *                              forward arrow, Day 31 preview card with "Autonomy" topic
 *   Phase 3 (frames 60+):    Pulse on forward arrow, floating particles, shimmer
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

export const Scene23_NextDayTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE   = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 5);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const forkCard   = useSpringEntrance(frame, 18);
  const leftSign   = useSpringEntrance(frame, 28);
  const rightSign  = useSpringEntrance(frame, 34);
  const arrowCard  = useSpringEntrance(frame, 42);
  const previewCard = useSpringEntrance(frame, 50);
  const day31Card  = useSpringEntrance(frame, 58);
  const bottomStrip = useSpringEntrance(frame, 65);

  // Forked road path draw
  const mainPath = 300;
  const mainDash = usePathDraw(frame, 20, mainPath, 28);
  const leftBranch = 220;
  const leftDash = usePathDraw(frame, 30, leftBranch, 24);
  const rightBranch = 220;
  const rightDash = usePathDraw(frame, 34, rightBranch, 24);

  // Forward arrow draw
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 44, arrowLen, 20);

  // Day 31 card border draw
  const dayPerim = 2 * (960 + 240);
  const dayBorderDash = usePathDraw(frame, 55, dayPerim, 26);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Arrow glow pulsing
  const arrowPulse = frame > 50 ? (0.6 + Math.sin(frame * 0.1) * 0.15) : 0.3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="WHAT IS A TASK? · NEXT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — "Answer next" headline ───────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Coming Up Next
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            The question we answer next
          </text>
        </g>

        {/* ── Forking road diagram ────────────────────────────────────────── */}
        <g opacity={forkCard.opacity} transform={`translate(0, ${forkCard.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={340} />

          {/* Main trunk path */}
          <path d="M 540,520 L 540,660"
            fill="none" stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={mainPath} strokeDashoffset={mainDash}
            strokeLinecap="round" />

          {/* Fork — left branch (ASK) */}
          <path d="M 540,660 Q 400,700 280,740"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={leftBranch} strokeDashoffset={leftDash}
            strokeLinecap="round" opacity={0.7} />

          {/* Fork — right branch (ACT) */}
          <path d="M 540,660 Q 680,700 800,740"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={rightBranch} strokeDashoffset={rightDash}
            strokeLinecap="round" />

          {/* Fork dot */}
          <circle cx={540} cy={660} r={8}
            fill={COLORS.bg_secondary} stroke={COLORS.white} strokeWidth={2} />

          {/* Left sign — "STOP & ASK" */}
          <g opacity={leftSign.opacity} transform={`translate(0, ${leftSign.translateY * 0.5})`}>
            <rect x={180} y={740} width={200} height={60} rx={12}
              fill={COLORS.vibrant_red} fillOpacity={0.12}
              stroke={COLORS.vibrant_red} strokeWidth={2} />
            <text x={280} y={778} textAnchor="middle"
              fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.vibrant_red}>
              STOP & ASK
            </text>
            {/* Raised hand icon */}
            <g transform="translate(240, 715)">
              <rect x={-4} y={0} width={8} height={18} rx={3}
                fill={COLORS.vibrant_red} opacity={0.6} />
              <circle cx={0} cy={-4} r={6} fill={COLORS.vibrant_red} opacity={0.6}  />
            </g>
          </g>

          {/* Right sign — "ACT" */}
          <g opacity={rightSign.opacity} transform={`translate(0, ${rightSign.translateY * 0.5})`}>
            <rect x={700} y={740} width={200} height={60} rx={12}
              fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={800} y={778} textAnchor="middle"
              fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
              ACT ALONE
            </text>
            {/* Lightning icon */}
            <g transform="translate(760, 720)">
              <path d="M2,-10 L-4,2 L1,2 L-2,10 L4,-2 L-1,-2 Z"
                fill={COLORS.accent} />
            </g>
          </g>

          {/* Label above fork */}
          <text x={540} y={548} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            THE AGENT REACHES A DECISION POINT
          </text>
        </g>

        {/* ── Forward arrow ───────────────────────────────────────────────── */}
        <g opacity={arrowCard.opacity}>
          <path d="M 540,830 L 540,950"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round"
            opacity={arrowPulse} />
          {/* Arrowhead */}
          <g opacity={arrowCard.opacity}>
            <polygon points="540,960 528,940 552,940"
              fill={COLORS.accent} opacity={arrowPulse} />
          </g>
          <text x={580} y={895} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent} opacity={arrowCard.opacity * 0.6}>
            DAY 31 →
          </text>
        </g>

        {/* ── Day 31 Preview card ─────────────────────────────────────────── */}
        <g opacity={previewCard.opacity} transform={`translate(0, ${previewCard.translateY})`}>
          {/* Animated border */}
          <rect x={60} y={980} width={960} height={240} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={dayPerim} strokeDashoffset={dayBorderDash} />
          <BentoCard x={60} y={980} w={960} h={240} accent />

          {/* Day badge */}
          <g opacity={day31Card.opacity} transform={`translate(0, ${day31Card.translateY * 0.4})`}>
            <rect x={100} y={1000} width={120} height={50} rx={12}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={160} y={1032} textAnchor="middle"
              fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
              DAY 31
            </text>
          </g>

          <text x={260} y={1035} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            What Is Autonomy?
          </text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            How much the agent handles on its own,
          </text>
          <text x={100} y={1140} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            without stopping to ask you.
          </text>

          {/* Small spectrum mini-preview */}
          <g opacity={day31Card.opacity}>
            <rect x={100} y={1170} width={400} height={8} rx={4}
              fill="rgba(255,255,255,0.08)" />
            <rect x={100} y={1170} width={200} height={8} rx={4}
              fill={COLORS.accent} opacity={0.5} />
            <circle cx={300} cy={1174} r={6}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          </g>
        </g>

        {/* ── Bottom strip — lessons from today ───────────────────────────── */}
        <g opacity={bottomStrip.opacity} transform={`translate(0, ${bottomStrip.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={200} />
          <rect x={60} y={1260} width={960} height={5} rx={2} fill={COLORS.accent} opacity={0.5} />

          <text x={100} y={1310} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            TODAY'S KEY INSIGHT
          </text>

          {/* Three checkmark items */}
          {[
            { text: 'A task needs start state, end state, criterion', y: 1350 },
            { text: 'Precise tasks produce precise agent behavior', y: 1385 },
            { text: 'Vague tasks produce vague results', y: 1420 },
          ].map((item, i) => {
            const itemO = interpolate(frame, [68 + i * 6, 80 + i * 6], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <g key={i} opacity={itemO}>
                <circle cx={110} cy={item.y - 6} r={8}
                  fill={COLORS.accent} fillOpacity={0.15}
                  stroke={COLORS.accent} strokeWidth={1.5} />
                <path d={`M${106},${item.y - 6} l3,4 l6,-8`}
                  fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
                <text x={130} y={item.y}
                  fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
                  {item.text}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        <g opacity={shimmer * 0.2}>
          <circle cx={200} cy={1540 + breathe} r={2.5} fill={COLORS.accent} />
          <circle cx={880} cy={1600 + breathe * 0.8} r={2} fill={COLORS.accent} />
          <circle cx={540} cy={1660 + breathe * 1.2} r={3} fill={COLORS.accent} opacity={0.3} />
          <circle cx={340} cy={1700 + breathe * 0.5} r={2} fill={COLORS.accent} opacity={0.4} />
          <circle cx={720} cy={1540 + breathe * 0.6} r={1.5} fill={COLORS.accent} opacity={0.3} />
        </g>

        {/* ── Pulsing ring on preview card ─────────────────────────────────── */}
        <g opacity={arrowPulse * 0.3}>
          <circle cx={540} cy={1100} r={100 * pulse} fill="none"
            stroke={COLORS.accent} strokeWidth={1} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
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
