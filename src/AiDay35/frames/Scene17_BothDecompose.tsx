/**
 * Scene 17 — Both Can Decompose
 * "Both can decompose a goal into steps,"
 * CSV: 65.090s → 67.720s | Duration: 79 frames (2.63s)
 *
 * Theme: Dark #0D0D0D + teal accent
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–22):  "BOTH" big badge + headline
 *   Phase 2 (frames 18–62): Shared GOAL node fans out to Step 1 / 2 / 3
 *   Phase 3 (frames 55–end): Pipeline + Agent labels appear, "SHARED" stamp
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

function useSpringSnap(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_SNAP });
  const opacity  = interpolate(f, [0, 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const scale    = interpolate(progress, [0, 1], [0.65, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene17_BothDecompose: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const bothE  = useSpringSnap(frame, 4);
  const headE  = useSpringEntrance(frame, 10);

  // Phase 2 — shared GOAL node + fan lines + steps
  const goalE   = useSpringEntrance(frame, 18);
  const line1   = usePathDraw(frame, 24, 200, 16);
  const line2   = usePathDraw(frame, 28, 200, 16);
  const line3   = usePathDraw(frame, 32, 200, 16);
  const step1E  = useSpringEntrance(frame, 36);
  const step2E  = useSpringEntrance(frame, 44);
  const step3E  = useSpringEntrance(frame, 52);

  // Phase 3
  const pipeLabel  = useSpringEntrance(frame, 56);
  const agentLabel = useSpringEntrance(frame, 60);
  const sharedE    = useSpringSnap(frame, 64);

  const breathe = Math.sin(frame * 0.1) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  // Step nodes layout
  const GOAL_X = 540, GOAL_Y = 650;
  const STEP_NODES = [
    { x: 200, y: 950, label: 'Step 1',   enter: step1E },
    { x: 540, y: 950, label: 'Step 2',   enter: step2E },
    { x: 880, y: 950, label: 'Step 3',   enter: step3E },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · SIMILARITIES" y={120} opacity={0.8} />
        </g>

        {/* BOTH badge */}
        <g transform={`scale(${bothE.scale})`}
          style={{ transformOrigin: '540px 206px' }}
          opacity={bothE.opacity}>
          <rect x={180} y={160} width={360} height={92} rx={16}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={360} y={218} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">BOTH</text>
        </g>

        {/* Headline */}
        <g opacity={headE.opacity} transform={`translate(0,${headE.translateY})`}>
          <text x={540} y={314} textAnchor="middle"
            fontFamily={FONT} fontSize={46} fontWeight={800}
            fill={COLORS.white}>can decompose a goal into steps</text>
        </g>

        {/* Pipeline + Agent floating labels */}
        <g opacity={pipeLabel.opacity} transform={`translate(0,${pipeLabel.translateY})`}>
          <rect x={340} y={354} width={190} height={52} rx={10}
            fill="rgba(247,55,79,0.14)" stroke="rgba(247,55,79,0.5)" strokeWidth={1.5} />
          <text x={435} y={386} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red}>Pipeline</text>
        </g>
        <g opacity={agentLabel.opacity} transform={`translate(0,${agentLabel.translateY})`}>
          <rect x={550} y={354} width={190} height={52} rx={10}
            fill={COLORS.accent} fillOpacity={0.14}
            stroke={COLORS.accent} strokeOpacity={0.5} strokeWidth={1.5} />
          <text x={645} y={386} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>Agent</text>
        </g>

        {/* SHARED stamp */}
        <g transform={`scale(${sharedE.scale})`}
          style={{ transformOrigin: '540px 430px' }}
          opacity={sharedE.opacity}>
          <text x={540} y={438} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.18em">← SHARED CAPABILITY →</text>
        </g>

        {/* GOAL node */}
        <g opacity={goalE.opacity}
          transform={`translate(0, ${breathe + goalE.translateY})`}>
          <circle cx={GOAL_X} cy={GOAL_Y} r={78}
            fill={COLORS.accent} fillOpacity={0.18}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={GOAL_X} y={GOAL_Y - 10} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent}>GOAL</text>
          <text x={GOAL_X} y={GOAL_Y + 28} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>shared</text>
        </g>

        {/* Fan lines from GOAL to 3 steps */}
        <line x1={GOAL_X} y1={GOAL_Y + 78} x2={STEP_NODES[0].x} y2={STEP_NODES[0].y - 50}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.6}
          strokeDasharray={200} strokeDashoffset={line1} />
        <line x1={GOAL_X} y1={GOAL_Y + 78} x2={STEP_NODES[1].x} y2={STEP_NODES[1].y - 50}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.6}
          strokeDasharray={200} strokeDashoffset={line2} />
        <line x1={GOAL_X} y1={GOAL_Y + 78} x2={STEP_NODES[2].x} y2={STEP_NODES[2].y - 50}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.6}
          strokeDasharray={200} strokeDashoffset={line3} />

        {/* 3 Step nodes */}
        {STEP_NODES.map(({ x, y, label, enter }, idx) => (
          <g key={idx} opacity={enter.opacity}
            transform={`translate(0, ${enter.translateY + breathe * 0.4})`}>
            <circle cx={x} cy={y} r={54}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeOpacity={0.5} strokeWidth={1.8} />
            <text x={x} y={y + 10} textAnchor="middle"
              fontFamily={FONT} fontSize={26} fontWeight={800}
              fill={COLORS.white}>{label}</text>
          </g>
        ))}

        {/* Bottom line */}
        <g opacity={interpolate(frame, [60, 74], [0, 1], { extrapolateRight: 'clamp' })}>
          <BentoCard x={60} y={1068} w={960} h={86} />
          <rect x={60} y={1068} width={6} height={86} rx={3} fill={COLORS.accent} />
          <text x={100} y={1118} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>Decomposition is the starting point —</text>
          <text x={100} y={1150} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>what happens next is where they differ.</text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
