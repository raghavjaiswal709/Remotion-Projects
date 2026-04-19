/**
 * Scene 10 — User Gives A Goal
 * "User gives a goal."
 * CSV: 30.240s → 31.640s
 * Duration: 42 frames (1.4s)
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline spring
 *   Phase 2 (8–30): User icon → speech bubble → goal card
 *   Phase 3 (25–end): Pulse, breathing on elements
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene10_UserGivesGoal: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const stepBadge = useSpringEntrance(frame, 6);

  // ── Phase 2 ──
  const userIn = useSpringEntrance(frame, 8);
  const bubbleIn = useSpringEntrance(frame, 12);
  const goalCard = useSpringEntrance(frame, 16);
  const arrowIn = useSpringEntrance(frame, 18);
  const agentIn = useSpringEntrance(frame, 20);
  const statusCard = useSpringEntrance(frame, 22);

  // Arrow path draw
  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 18, arrowLen, 15);

  // ── Phase 3 ──
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ── */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY EXAMPLE · STEP 1" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            User Gives
          </text>
          <text x={60} y={410} fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            a Goal
          </text>
        </g>

        {/* Step badge */}
        <g opacity={stepBadge.opacity} transform={`translate(0, ${stepBadge.translateY})`}>
          <rect x={820} y={260} width={200} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={920} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            s₀
          </text>
        </g>

        {/* ── ZONE C — User figure ── */}
        <g opacity={userIn.opacity} transform={`translate(200, ${620 + userIn.translateY + breathe})`}>
          {/* Head */}
          <circle cx={0} cy={0} r={70} fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.2)" strokeWidth={3} />
          {/* Eyes */}
          <circle cx={-22} cy={-10} r={8} fill={COLORS.white} opacity={0.7} />
          <circle cx={22} cy={-10} r={8} fill={COLORS.white} opacity={0.7} />
          {/* Smile */}
          <path d="M -18,18 Q 0,32 18,18" fill="none"
            stroke={COLORS.white} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
          {/* Body */}
          <rect x={-60} y={80} width={120} height={160} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          {/* Shoulder line */}
          <line x1={-60} y1={100} x2={60} y2={100}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {/* Label */}
          <text x={0} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            USER
          </text>
        </g>

        {/* Speech bubble */}
        <g opacity={bubbleIn.opacity} transform={`translate(0, ${bubbleIn.translateY})`}>
          {/* Bubble body */}
          <rect x={320} y={560} width={520} height={180} rx={24}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Bubble tail */}
          <polygon points="340,740 280,780 360,740"
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <rect x={335} y={738} width={30} height={6} fill={COLORS.bg_secondary} />

          {/* Bubble text */}
          <text x={360} y={620} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            GOAL
          </text>
          <text x={360} y={670} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            "Summarize this
          </text>
          <text x={360} y={716} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            article for me."
          </text>
        </g>

        {/* Arrow from bubble to agent */}
        <path
          d="M 580,740 C 580,820 580,880 580,920"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Goal card — received by agent */}
        <g opacity={goalCard.opacity} transform={`translate(0, ${goalCard.translateY})`}>
          <BentoCard x={280} y={960} w={560} h={200} accent />
          <rect x={280} y={960} width={6} height={200} rx={3} fill={COLORS.accent} />
          {/* Goal icon */}
          <circle cx={330} cy={1060} r={24} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <path d="M 320,1060 L 330,1072 L 344,1048" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <text x={370} y={1030} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            INITIAL STATE — s₀
          </text>
          <text x={370} y={1080} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Goal received
          </text>
          <text x={370} y={1120} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Agent begins trajectory
          </text>
        </g>

        {/* Agent (robot) node preview */}
        <g opacity={agentIn.opacity} transform={`translate(540, ${1280 + agentIn.translateY + breathe * 0.5})`}>
          {/* Robot head */}
          <rect x={-60} y={0} width={120} height={90} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eyes */}
          <circle cx={-20} cy={35} r={10} fill={COLORS.accent} opacity={0.5} />
          <circle cx={20} cy={35} r={10} fill={COLORS.accent} opacity={0.5} />
          {/* Antenna */}
          <line x1={0} y1={0} x2={0} y2={-20}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <circle cx={0} cy={-24} r={6} fill={COLORS.accent} opacity={0.3 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px -24px' }} />
          {/* Label */}
          <text x={0} y={130} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            AGENT
          </text>
        </g>

        {/* Status card */}
        <g opacity={statusCard.opacity} transform={`translate(0, ${statusCard.translateY})`}>
          <BentoCard x={60} y={1500} w={960} h={140} />
          <circle cx={110} cy={1570} r={20}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={110} y={1577} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
            1
          </text>
          <text x={150} y={1560} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Trajectory entry #1: Initial state
          </text>
          <text x={150} y={1600} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            s₀ = "User wants article summarized"
          </text>
        </g>

        {/* Decorative dots */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={160 + i * 360} cy={1700}
            r={4} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── CAPTION ── */}
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
