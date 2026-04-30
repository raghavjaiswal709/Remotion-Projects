/**
 * Scene 02 — Recap Decomposition
 * "Last day, we learned task decomposition,"
 * CSV: 5.200s → 8.067s | Duration: 86 frames (2.87s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + "RECAP" badge spring in
 *   Phase 2 (frames 18–70):  Decomposition diagram builds — goal node → 3 sub-tasks
 *   Phase 3 (frames 60–end): Connector pulse, node glow breathing
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene02_RecapDecomposition: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const recapBadge    = useSpringEntrance(frame, 10);

  // Phase 2 — diagram nodes
  const goalNode    = useSpringEntrance(frame, 18);
  const sub1        = useSpringEntrance(frame, 30);
  const sub2        = useSpringEntrance(frame, 38);
  const sub3        = useSpringEntrance(frame, 46);

  // Path draw for connectors
  const conn1 = usePathDraw(frame, 34, 160, 16);
  const conn2 = usePathDraw(frame, 42, 140, 16);
  const conn3 = usePathDraw(frame, 50, 155, 16);

  // Phase 3
  const pulse  = 1 + Math.sin(frame * 0.10) * 0.018;
  const breathe= Math.sin(frame * 0.07) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelEntrance.opacity} transform={`translate(0,${labelEntrance.translateY})`}>
          <SectionLabel text="DAY 34 RECAP · TASK DECOMPOSITION" y={120} opacity={0.8} />
        </g>

        {/* Recap badge */}
        <g opacity={recapBadge.opacity} transform={`translate(0,${recapBadge.translateY})`}>
          <rect x={60} y={138} width={140} height={46} rx={10}
            fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={130} y={169} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>RECAP</text>
        </g>

        {/* ZONE B — Headline */}
        <g opacity={headlineA.opacity} transform={`translate(0,${headlineA.translateY})`}>
          <text x={60} y={310} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Task
          </text>
          <text x={60} y={410} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}>
            Decomposition
          </text>
        </g>

        {/* ZONE C — Decomposition diagram */}
        {/* Goal node — top center */}
        <g opacity={goalNode.opacity} transform={`translate(540, ${620 + goalNode.translateY})`}>
          <circle cx={0} cy={0} r={72}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <text x={0} y={-10} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>LARGE</text>
          <text x={0} y={18} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>GOAL</text>
        </g>

        {/* Connector lines */}
        {/* Left branch */}
        <line x1={488} y1={692} x2={250} y2={860}
          stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
          strokeDasharray={160} strokeDashoffset={conn1} />
        {/* Center branch */}
        <line x1={540} y1={692} x2={540} y2={860}
          stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
          strokeDasharray={140} strokeDashoffset={conn2} />
        {/* Right branch */}
        <line x1={592} y1={692} x2={830} y2={860}
          stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
          strokeDasharray={155} strokeDashoffset={conn3} />

        {/* Sub-task nodes */}
        {/* Sub-task 1 */}
        <g opacity={sub1.opacity} transform={`translate(250, ${890 + sub1.translateY + breathe})`}>
          <rect x={-110} y={-50} width={220} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1.5} />
          <text x={0} y={-8} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>Sub-task</text>
          <text x={0} y={26} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent}>1</text>
        </g>

        {/* Sub-task 2 */}
        <g opacity={sub2.opacity} transform={`translate(540, ${890 + sub2.translateY + breathe * 0.7})`}>
          <rect x={-110} y={-50} width={220} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={0} y={-8} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>Sub-task</text>
          <text x={0} y={26} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent}>2</text>
        </g>

        {/* Sub-task 3 */}
        <g opacity={sub3.opacity} transform={`translate(830, ${890 + sub3.translateY - breathe * 0.5})`}>
          <rect x={-110} y={-50} width={220} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1.5} />
          <text x={0} y={-8} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>Sub-task</text>
          <text x={0} y={26} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent}>3</text>
        </g>

        {/* Insight card */}
        <g opacity={sub3.opacity} transform={`translate(0,${sub3.translateY})`}>
          <BentoCard x={60} y={1060} w={960} h={120} accent />
          <rect x={60} y={1060} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1118} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Large goals broken into achievable steps
          </text>
        </g>

        {/* Summary stat tiles */}
        <g opacity={sub3.opacity} transform={`translate(0,0)`}>
          <BentoCard x={60} y={1220} w={300} h={120} />
          <text x={210} y={1262} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>YESTERDAY</text>
          <text x={210} y={1298} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>Day 34</text>
        </g>
        <g opacity={sub3.opacity} transform={`translate(0,0)`}>
          <BentoCard x={390} y={1220} w={300} h={120} />
          <text x={540} y={1262} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>CONCEPT</text>
          <text x={540} y={1298} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.white}>Decomposition</text>
        </g>
        <g opacity={sub3.opacity} transform={`translate(0,0)`}>
          <BentoCard x={720} y={1220} w={300} h={120} />
          <text x={870} y={1262} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>TODAY</text>
          <text x={870} y={1298} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>Day 35</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s02.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
