/**
 * Scene 06 — StartEndState
 * "A start state, a desired end state,"
 * CSV: 18.920s → 21.080s
 * Duration: ~74 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring in
 *   Phase 2 (frames 20–80):  Large two-column comparison: Start vs End with animated arrow
 *   Phase 3 (frames 60–end): Pulse, shimmer, particles
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

export const Scene06_StartEndState: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 11);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const leftCard  = useSpringEntrance(frame, 18);
  const rightCard = useSpringEntrance(frame, 30);
  const arrowCard = useSpringEntrance(frame, 40);
  const infoCard  = useSpringEntrance(frame, 52);

  // Arrow connector between start → end
  const arrowLen = 180;
  const arrowDash = usePathDraw(frame, 36, arrowLen, 22);

  // Border draw on left card
  const leftPerim = 2 * (440 + 600);
  const leftBorderDash = usePathDraw(frame, 20, leftPerim, 30);

  // Border draw on right card
  const rightPerim = 2 * (440 + 600);
  const rightBorderDash = usePathDraw(frame, 32, rightPerim, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Floating orbit on left/right icons
  const orbitAngle = (frame * 0.04);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · TASK STRUCTURE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Start State,
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            End State
          </text>
        </g>

        {/* ── Left card: START STATE ─────────────────────────────────────── */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          {/* Card background */}
          <BentoCard x={60} y={460} w={440} h={600} />
          {/* Animated border */}
          <rect x={60} y={460} width={440} height={600} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={leftPerim} strokeDashoffset={leftBorderDash} />

          {/* Start icon — empty circle with dashed border */}
          <circle cx={280} cy={600} r={60}
            fill="none" stroke={COLORS.text_muted} strokeWidth={2.5}
            strokeDasharray="8,6" />
          <circle cx={280} cy={600} r={6} fill={COLORS.text_muted} opacity={0.5} />

          {/* Orbit dot */}
          <circle
            cx={280 + Math.cos(orbitAngle) * 75}
            cy={600 + Math.sin(orbitAngle) * 75}
            r={4} fill={COLORS.accent} opacity={0.4} />

          {/* Label */}
          <text x={280} y={710} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.white}>
            START
          </text>
          <text x={280} y={765} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            STATE
          </text>

          {/* Description lines */}
          <text x={280} y={840} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Current condition
          </text>
          <text x={280} y={876} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            before any action
          </text>

          {/* Empty state indicator dots */}
          <circle cx={230} cy={930} r={6} fill={COLORS.text_muted} opacity={0.3} />
          <circle cx={260} cy={930} r={6} fill={COLORS.text_muted} opacity={0.3} />
          <circle cx={290} cy={930} r={6} fill={COLORS.text_muted} opacity={0.3} />
          <circle cx={320} cy={930} r={6} fill="none" stroke={COLORS.text_muted}
            strokeWidth={1} opacity={0.3} />
          <text x={280} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
            NOTHING DONE YET
          </text>
        </g>

        {/* ── Arrow between cards ────────────────────────────────────────── */}
        <g opacity={arrowCard.opacity}>
          <path d="M 510,760 L 570,760" fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={540} y={730} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}
            opacity={arrowCard.opacity}>
            TRANSFORM
          </text>
        </g>

        {/* ── Right card: END STATE ──────────────────────────────────────── */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={580} y={460} w={440} h={600} accent />
          {/* Animated border */}
          <rect x={580} y={460} width={440} height={600} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={rightPerim} strokeDashoffset={rightBorderDash} />

          {/* End icon — filled circle with checkmark */}
          <circle cx={800} cy={600} r={60}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2.5} />
          <path d="M 776,600 L 792,618 L 826,582"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeLinecap="round" strokeLinejoin="round" />

          {/* Pulse ring */}
          <circle cx={800} cy={600} r={60}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.2 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '800px 600px' }} />

          {/* Label */}
          <text x={800} y={710} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.white}>
            END
          </text>
          <text x={800} y={765} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            STATE
          </text>

          {/* Description */}
          <text x={800} y={840} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Desired condition
          </text>
          <text x={800} y={876} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            after completion
          </text>

          {/* Filled state indicator dots */}
          <circle cx={750} cy={930} r={6} fill={COLORS.accent} opacity={0.7} />
          <circle cx={780} cy={930} r={6} fill={COLORS.accent} opacity={0.7} />
          <circle cx={810} cy={930} r={6} fill={COLORS.accent} opacity={0.7} />
          <circle cx={840} cy={930} r={6} fill={COLORS.accent} opacity={0.7} />
          <text x={800} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent} opacity={0.6}>
            GOAL ACHIEVED
          </text>
        </g>

        {/* ── Info strip at bottom of Zone C ─────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={140} />
          <rect x={60} y={1120} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1198} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Two boundaries that frame the agent's work
          </text>
        </g>

        {/* ── Robot holding arrow illustration ───────────────────────────── */}
        <g opacity={interpolate(frame, [55, 70], [0, 0.6], { extrapolateRight: 'clamp' })}
          transform={`translate(540, ${1400 + breathe})`}>
          {/* Robot simplified */}
          <rect x={-35} y={-35} width={70} height={50} rx={10}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={-14} cy={-14} r={6} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={14} cy={-14} r={6} fill={COLORS.accent} opacity={shimmer} />
          <rect x={-10} y={3} width={20} height={2} rx={1} fill={COLORS.accent} opacity={0.5} />
          <rect x={-28} y={20} width={56} height={60} rx={8}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          {/* Direction arrow the robot is "holding" */}
          <line x1={-60} y1={50} x2={60} y2={50} stroke={COLORS.accent} strokeWidth={2}
            strokeLinecap="round" />
          <path d="M 50,42 L 65,50 L 50,58" fill="none" stroke={COLORS.accent}
            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        <g opacity={interpolate(frame, [50, 65], [0, 0.35], { extrapolateRight: 'clamp' })}>
          <circle cx={140} cy={1550 + breathe * 0.8} r={3} fill={COLORS.accent} opacity={0.3} />
          <circle cx={930} cy={1600 + breathe * 1.2} r={4} fill={COLORS.accent} opacity={0.2} />
          <circle cx={700} cy={1560 + breathe * 0.6} r={2.5} fill={COLORS.accent} opacity={0.25} />
          <circle cx={350} cy={1650 + breathe * 0.9} r={3} fill={COLORS.accent} opacity={0.2} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
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
