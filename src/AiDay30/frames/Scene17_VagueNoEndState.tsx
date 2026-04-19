/**
 * Scene 17 — VagueNoEndState
 * "Help me with flights. There is no end state."
 * CSV: 51.920s → 54.160s
 * Duration: ~72 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 18–65):  Empty end-state void, agent in infinite loop
 *   Phase 3 (frames 50+):    Spinning loop arrow, void pulse
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

export const Scene17_VagueNoEndState: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const leftCard  = useSpringEntrance(frame, 18);
  const rightCard = useSpringEntrance(frame, 30);
  const loopCard  = useSpringEntrance(frame, 42);
  const infoCard  = useSpringEntrance(frame, 54);

  // Dashed box border draw
  const dashedPerim = 2 * (440 + 460);
  const dashedBorderDash = usePathDraw(frame, 32, dashedPerim, 18);

  // Loop arrow path draw
  const loopLen = 400;
  const loopDash = usePathDraw(frame, 44, loopLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const loopRot = frame * 1.8; // continuous rotation for infinite loop
  const voidPulse = 1 + Math.sin(frame * 0.1) * 0.03;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="COUNTER-EXAMPLE · MISSING END STATE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.text_muted}>
            "Help me with flights"
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.vibrant_red}>
            No End State
          </text>

          <rect x={430} y={370} width={220} height={44} rx={22}
            fill={COLORS.vibrant_red} fillOpacity={0.12}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <text x={540} y={400} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.vibrant_red}>
            UNDEFINED
          </text>
        </g>

        {/* ── Left card: Start State (has one) ───────────────────────────── */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={480} w={460} h={460} />
          <rect x={60} y={480} width={6} height={460} rx={3} fill={COLORS.text_muted} />

          <text x={100} y={530} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">
            START STATE
          </text>

          {/* Ticket/booking blank */}
          <rect x={120} y={560} width={340} height={180} rx={12}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
          {/* Placeholder lines */}
          <rect x={150} y={590} width={200} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          <rect x={150} y={620} width={260} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          <rect x={150} y={650} width={180} height={8} rx={4} fill="rgba(255,255,255,0.08)" />

          <text x={150} y={710} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            "No booking exists"
          </text>

          {/* Checkmark (start state exists) */}
          <circle cx={420} y={910} r={0} fill="none" />
          <g transform="translate(420, 520)">
            <circle cx={0} cy={0} r={16}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <path d="M -6,2 L -2,8 L 8,-4"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Additional "vague" info */}
          <text x={100} y={790} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Vague start
          </text>
          <text x={100} y={825} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            What kind of flights? Where?
          </text>
          <text x={100} y={858} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            When? How many passengers?
          </text>
          <text x={100} y={891} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Budget? Direct or connecting?
          </text>
        </g>

        {/* ── Right card: End State (MISSING — void) ─────────────────────── */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          {/* Dashed border indicating void/missing */}
          <rect x={560} y={480} width={460} height={460} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray="16,10"
            strokeDashoffset={dashedBorderDash} />

          <text x={600} y={530} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.12em">
            END STATE
          </text>

          {/* Large void/empty indicator */}
          <g transform={`translate(790, 700) scale(${voidPulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            {/* Concentric void rings */}
            <circle cx={0} cy={0} r={80} fill="none"
              stroke={COLORS.vibrant_red} strokeWidth={1} opacity={0.1} />
            <circle cx={0} cy={0} r={55} fill="none"
              stroke={COLORS.vibrant_red} strokeWidth={1.5} opacity={0.2} />
            <circle cx={0} cy={0} r={30} fill="none"
              stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.3} />

            {/* Question mark in center */}
            <text x={0} y={14} textAnchor="middle"
              fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.vibrant_red}>
              ?
            </text>
          </g>

          <text x={600} y={850} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.vibrant_red}>
            WHERE TO?
          </text>
          <text x={600} y={888} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Agent has no target to reach
          </text>
          <text x={600} y={918} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            No way to know when finished
          </text>
        </g>

        {/* ── Infinite loop indicator ─────────────────────────────────────── */}
        <g opacity={loopCard.opacity} transform={`translate(0, ${loopCard.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={260} />
          <rect x={60} y={980} width={6} height={260} rx={3} fill={COLORS.vibrant_red} />

          {/* Spinning loop circle */}
          <g transform={`translate(200, 1110) rotate(${loopRot})`}
            style={{ transformOrigin: '0px 0px' }}>
            <path d="M 0,-40 A 40,40 0 1,1 -28,-28"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={loopLen} strokeDashoffset={loopDash} />
            {/* Arrow at end */}
            <polygon points="-36,-28 -22,-22 -28,-36"
              fill={COLORS.vibrant_red} />
          </g>

          <text x={280} y={1070} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            RESULT: Infinite Loop
          </text>
          <text x={280} y={1114} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Agent cycles endlessly — search, filter, search again
          </text>
          <text x={280} y={1150} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No termination condition = no halt
          </text>

          {/* Loop count indicator */}
          <g transform="translate(880, 1110)">
            <text x={0} y={0} textAnchor="middle"
              fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.vibrant_red}>
              ...
            </text>
            <text x={0} y={32} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
              forever
            </text>
          </g>
        </g>

        {/* ── Info card ──────────────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={140} />

          {/* Arrow icon */}
          <g transform="translate(120, 1350)">
            <path d="M -16,0 L 16,0 M 8,-10 L 18,0 L 8,10"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round"
              strokeLinejoin="round" />
          </g>

          <text x={160} y={1335} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Fix: Define the desired end state
          </text>
          <text x={160} y={1375} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            "One confirmed ticket, cheapest, shortest layover"
          </text>
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        <g opacity={shimmer * 0.2}>
          <circle cx={140} cy={1500 + breathe} r={2.5} fill={COLORS.vibrant_red} />
          <circle cx={920} cy={1570 + breathe * 0.8} r={2} fill={COLORS.accent} />
          <circle cx={540} cy={1640 + breathe * 1.1} r={3} fill={COLORS.vibrant_red} opacity={0.3} />
          <circle cx={300} cy={1700 + breathe * 0.6} r={2} fill={COLORS.accent} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s17.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
