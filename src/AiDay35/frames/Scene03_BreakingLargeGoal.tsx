/**
 * Scene 03 — Breaking Large Goal
 * "breaking a large goal into a sequence of smaller sub-tasks the agent can execute step by step."
 * CSV: 8.067s → 14.217s | Duration: 185 frames (6.15s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + headline spring in
 *   Phase 2 (frames 22–100): Sequential step chain builds left to right
 *   Phase 3 (frames 90–end): Arrow pulse, step glow, floating micro-animation
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

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

export const Scene03_BreakingLargeGoal: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE  = useSpringEntrance(frame, 0);
  const headE   = useSpringEntrance(frame, 6);
  const subE    = useSpringEntrance(frame, 12);

  // Phase 2 — step chain
  const goalE  = useSpringEntrance(frame, 22);
  const step1E = useSpringEntrance(frame, 34);
  const step2E = useSpringEntrance(frame, 46);
  const step3E = useSpringEntrance(frame, 58);
  const step4E = useSpringEntrance(frame, 70);

  const arr1 = usePathDraw(frame, 38, 90, 14);
  const arr2 = usePathDraw(frame, 50, 90, 14);
  const arr3 = usePathDraw(frame, 62, 90, 14);

  // Extra insight card
  const insightE = useSpringEntrance(frame, 88);

  // Phase 3
  const breathe = Math.sin(frame * 0.07) * 4;
  const pulse   = 1 + Math.sin(frame * 0.10) * 0.018;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  const STEP_W = 200;
  const STEP_H = 110;
  const GAP    = 24;
  const ROW_Y  = 820;

  const steps = [
    { label: 'Search', color: COLORS.accent },
    { label: 'Read', color: COLORS.white },
    { label: 'Analyze', color: COLORS.white },
    { label: 'Synthesize', color: COLORS.accent },
  ];

  const stepEnters = [step1E, step2E, step3E, step4E];
  const arrows     = [arr1, arr2, arr3];

  // Total width: 4 * 200 + 3 * (24 + 24 + 24 arrow zone) ... simpler:
  // positions starting at x=60
  const startX = 60;
  const ARROW_W = 44;
  const blockW  = STEP_W + ARROW_W;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · TASK EXECUTION" y={120} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g opacity={headE.opacity} transform={`translate(0,${headE.translateY})`}>
          <text x={60} y={290} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Breaking
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent}>
            Large Goals
          </text>
        </g>
        <g opacity={subE.opacity} transform={`translate(0,${subE.translateY})`}>
          <text x={60} y={465} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            into a sequence of smaller sub-tasks
          </text>
        </g>

        {/* ZONE C — step chain */}
        {/* Large goal circle */}
        <g opacity={goalE.opacity} transform={`translate(540, ${640 + goalE.translateY})`}>
          <circle cx={0} cy={0} r={88}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <text x={0} y={-14} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>LARGE</text>
          <text x={0} y={20} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>GOAL</text>
        </g>

        {/* Down arrow from goal to steps */}
        <line x1={540} y1={730} x2={540} y2={780}
          stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round"
          strokeDasharray={50} strokeDashoffset={usePathDraw(frame, 26, 50, 12)} />
        <polygon points="528,772 540,792 552,772" fill={COLORS.accent}
          opacity={goalE.opacity} />

        {/* Step chain row */}
        {steps.map((step, i) => {
          const x = startX + i * (STEP_W + ARROW_W);
          const se = stepEnters[i];
          return (
            <g key={i}>
              <g opacity={se.opacity} transform={`translate(0, ${se.translateY + breathe * (i % 2 === 0 ? 1 : -0.8)})`}>
                <rect x={x} y={ROW_Y} width={STEP_W} height={STEP_H} rx={16}
                  fill={COLORS.bg_secondary}
                  stroke={i === 0 || i === 3 ? COLORS.accent : COLORS.accent_mid}
                  strokeWidth={i === 0 || i === 3 ? 2 : 1.5} />
                {/* Step number */}
                <text x={x + 20} y={ROW_Y + 38} fontFamily={FONT} fontSize={22} fontWeight={800}
                  fill={COLORS.text_muted}>{i + 1}</text>
                {/* Step label */}
                <text x={x + STEP_W / 2} y={ROW_Y + 72} textAnchor="middle"
                  fontFamily={FONT} fontSize={36} fontWeight={800} fill={step.color}>
                  {step.label}
                </text>
              </g>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <line
                  x1={x + STEP_W} y1={ROW_Y + STEP_H / 2}
                  x2={x + STEP_W + ARROW_W} y2={ROW_Y + STEP_H / 2}
                  stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round"
                  strokeDasharray={90} strokeDashoffset={arrows[i]}
                  markerEnd="url(#arrow)"
                />
              )}
            </g>
          );
        })}

        {/* "Step by step" label */}
        <g opacity={stepEnters[3].opacity}>
          <text x={540} y={ROW_Y + STEP_H + 48} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}
            letterSpacing="0.1em">
            STEP BY STEP
          </text>
        </g>

        {/* Insight card */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={130} accent />
          <rect x={60} y={1080} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={1130} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Each sub-task achievable in one step
          </text>
          <text x={100} y={1172} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Together they complete the original goal
          </text>
        </g>

        {/* Two stat tiles */}
        <g opacity={insightE.opacity}>
          <BentoCard x={60} y={1250} w={460} h={120} />
          <text x={290} y={1290} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>AGENT EXECUTES</text>
          <text x={290} y={1326} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>step by step</text>
        </g>
        <g opacity={insightE.opacity}>
          <BentoCard x={560} y={1250} w={460} h={120} accent />
          <text x={790} y={1290} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>MODEL GENERATES</text>
          <text x={790} y={1326} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>breakdown itself</text>
        </g>

        {/* Floating accent dots */}
        <g transform={`translate(540, ${1430 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} opacity={0.3} strokeDasharray="6 8" />
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} fillOpacity={0.08} />
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
