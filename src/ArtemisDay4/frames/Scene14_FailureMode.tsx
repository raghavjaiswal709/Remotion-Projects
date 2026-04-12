/**
 * Scene14 — Failure Mode
 * "Every failure mode was modeled, tested, and modeled again."
 * CSV: 69.780s → 73.380s
 * Duration: 126 frames (4.20s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, headline
 *   Phase 2 (20–90): Content — model→test→model cycle diagram, iteration arrows
 *   Phase 3 (80–end): Micro — cycle rotation pulse, glow, breathe
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents, Divider } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

const CYCLE_STEPS = [
  { label: 'MODEL', icon: 'model', color: COLORS.sky_blue },
  { label: 'TEST', icon: 'test', color: COLORS.orange },
  { label: 'MODEL\nAGAIN', icon: 'remodel', color: COLORS.purple },
];

export const Scene14_FailureMode: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // Phase 2
  const stepEntrances = CYCLE_STEPS.map((_, i) =>
    useSpringEntrance(frame, 18 + i * 12)
  );
  const arrowDraw1 = usePathDraw(frame, 30, 200, 20);
  const arrowDraw2 = usePathDraw(frame, 42, 200, 20);
  const arrowDraw3 = usePathDraw(frame, 54, 300, 25);

  const factCard1 = useSpringEntrance(frame, 60);
  const factCard2 = useSpringEntrance(frame, 72);
  const iterationCard = useSpringEntrance(frame, 80);

  const iterCount = useCounter(frame, 50, 1000, 40);

  // Phase 3
  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const cycleGlow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.4, 0.8]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  const CX = 540;
  const CY = 700;
  const NODE_R = 75;

  // Triangle positions for 3 cycle nodes
  const nodePositions = [
    { x: CX, y: CY - 130 },           // top — MODEL
    { x: CX + 160, y: CY + 90 },      // bottom-right — TEST
    { x: CX - 160, y: CY + 90 },      // bottom-left — MODEL AGAIN
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.vibrant_red} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={240} fontWeight={900} fill={COLORS.vibrant_red} opacity={0.04}>
          FAIL
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ABORT SYSTEMS · VERIFICATION" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={900} fill={COLORS.deep_black}>
            Every Failure Mode
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={450} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={38} fontWeight={600} fill={COLORS.orange}>
            Modeled, Tested, Modeled Again
          </text>
        </g>

        {/* Zone C — Cycle diagram */}
        {/* Central cycle indicator */}
        <circle cx={CX} cy={CY} r={40}
          fill={COLORS.sky_blue} fillOpacity={0.04 * shimmer}
          stroke={COLORS.sky_blue} strokeWidth={1} opacity={cycleGlow} />
        <text x={CX} y={CY + 8} textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={700} fill={COLORS.sky_blue}
          opacity={cycleGlow}>
          CYCLE
        </text>

        {/* Cycle nodes */}
        {CYCLE_STEPS.map((step, i) => {
          const pos = nodePositions[i];
          const ent = stepEntrances[i];
          return (
            <g key={i} opacity={ent.opacity}
              transform={`translate(${pos.x}, ${pos.y + ent.translateY})`}>
              {/* Node circle */}
              <circle cx={0} cy={0} r={NODE_R}
                fill={step.color} fillOpacity={0.06}
                stroke={step.color} strokeWidth={2.5}
                style={{ transform: `scale(${pulse})`, transformOrigin: '0px 0px' }} />

              {/* Icon area */}
              {i === 0 && (
                /* Computer/model icon */
                <g>
                  <rect x={-22} y={-25} width={44} height={30} rx={4}
                    fill="none" stroke={step.color} strokeWidth={2} />
                  <line x1={-10} y1={7} x2={10} y2={7}
                    stroke={step.color} strokeWidth={2} strokeLinecap="round" />
                  <line x1={0} y1={5} x2={0} y2={15}
                    stroke={step.color} strokeWidth={2} />
                </g>
              )}
              {i === 1 && (
                /* Beaker/test icon */
                <g>
                  <path d="M -12,-25 L -12,-5 L -20,10 Q -20,18 0,18 Q 20,18 20,10 L 12,-5 L 12,-25"
                    fill="none" stroke={step.color} strokeWidth={2} />
                  <line x1={-12} y1={-25} x2={12} y2={-25}
                    stroke={step.color} strokeWidth={2} strokeLinecap="round" />
                </g>
              )}
              {i === 2 && (
                /* Refresh/re-model icon */
                <g>
                  <path d="M 12,-15 A 18,18 0 1,1 -5,-20"
                    fill="none" stroke={step.color} strokeWidth={2} />
                  <path d="M 12,-15 L 18,-10 L 7,-10"
                    fill={step.color} />
                </g>
              )}

              {/* Label */}
              <text x={0} y={NODE_R + 30} textAnchor="middle"
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={24} fontWeight={700} fill={step.color}>
                {step.label.split('\n').map((line, li) => (
                  <tspan key={li} x={0} dy={li === 0 ? 0 : 26}>{line}</tspan>
                ))}
              </text>
            </g>
          );
        })}

        {/* Arrows between nodes — path draw */}
        {/* MODEL → TEST */}
        <path d={`M ${nodePositions[0].x + 55},${nodePositions[0].y + 55} L ${nodePositions[1].x - 55},${nodePositions[1].y - 55}`}
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2.5}
          strokeDasharray={200} strokeDashoffset={arrowDraw1}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* TEST → MODEL AGAIN */}
        <path d={`M ${nodePositions[1].x - 35},${nodePositions[1].y + 10} L ${nodePositions[2].x + 35},${nodePositions[2].y + 10}`}
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2.5}
          strokeDasharray={200} strokeDashoffset={arrowDraw2}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* MODEL AGAIN → MODEL (feedback loop) */}
        <path d={`M ${nodePositions[2].x + 55},${nodePositions[2].y - 55} L ${nodePositions[0].x - 55},${nodePositions[0].y + 55}`}
          fill="none" stroke={COLORS.green} strokeWidth={2.5}
          strokeDasharray={300} strokeDashoffset={arrowDraw3}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Iteration counter */}
        <g opacity={iterationCard.opacity}
          transform={`translate(${CX}, ${1000 + iterationCard.translateY + breathe})`}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={120} fontWeight={900} fill={COLORS.sky_blue}
            opacity={0.12}>
            {iterCount}+
          </text>
          <text x={0} y={0} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={96} fontWeight={900} fill={COLORS.deep_black}>
            {iterCount}+
          </text>
          <text x={0} y={50} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            ITERATIONS
          </text>
        </g>

        {/* Fact cards */}
        <g opacity={factCard1.opacity}
          transform={`translate(60, ${1140 + factCard1.translateY})`}>
          <rect x={0} y={0} width={460} height={110} rx={12}
            fill={COLORS.orange} fillOpacity={0.05}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={110} rx={3} fill={COLORS.orange} />
          <text x={30} y={42} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            SIMULATION FIDELITY
          </text>
          <text x={30} y={80} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Hardware-in-Loop
          </text>
        </g>

        <g opacity={factCard2.opacity}
          transform={`translate(540, ${1140 + factCard2.translateY})`}>
          <rect x={0} y={0} width={460} height={110} rx={12}
            fill={COLORS.purple} fillOpacity={0.05}
            stroke={COLORS.purple} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={110} rx={3} fill={COLORS.purple} />
          <text x={30} y={42} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            REDUNDANCY
          </text>
          <text x={30} y={80} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Triple Verified
          </text>
        </g>

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">EVERY FAILURE · ANTICIPATED · TESTED</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
