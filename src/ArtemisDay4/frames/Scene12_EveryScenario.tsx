/**
 * Scene12 — Every Scenario
 * "Every abort scenario was designed before a single crew member ever boarded."
 * CSV: 61.300s → 65.680s
 * Duration: 149 frames (4.97s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, headline
 *   Phase 2 (20–100): Content — scenario grid matrix, pre-design emphasis
 *   Phase 3 (80–end): Micro — check marks pulse, grid shimmer
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

const SCENARIOS = [
  { label: 'PAD ABORT', phase: 'PRE-LAUNCH', icon: 'pad' },
  { label: 'LAUNCH ABORT', phase: 'ASCENT', icon: 'rocket' },
  { label: 'LOW ORBIT ABORT', phase: 'ORBIT', icon: 'orbit' },
  { label: 'TRANS-LUNAR ABORT', phase: 'TRANSIT', icon: 'transit' },
  { label: 'LUNAR ABORT', phase: 'LUNAR', icon: 'moon' },
  { label: 'RETURN ABORT', phase: 'RETURN', icon: 'return' },
];

export const Scene12_EveryScenario: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // Phase 2 — scenario cards staggered
  const scenarioEntrances = SCENARIOS.map((_, i) =>
    useSpringEntrance(frame, 20 + i * 10)
  );

  // Check marks appear after cards
  const checkMarks = SCENARIOS.map((_, i) => {
    const checkDelay = 46 + i * 8;
    const checkProgress = interpolate(frame, [checkDelay, checkDelay + 10], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return checkProgress;
  });

  // Bottom statement card
  const statementCard = useSpringEntrance(frame, 85);

  // Path draw for connecting line
  const lineLength = 1000;
  const lineDash = usePathDraw(frame, 30, lineLength, 60);

  // Phase 3
  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  const CARD_H = 150;
  const CARD_GAP = 10;
  const startY = 520;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.amber} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={240} fontWeight={900} fill={COLORS.amber} opacity={0.04}>
          ALL
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ABORT SYSTEMS · PLANNING" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={900} fill={COLORS.deep_black}>
            Every Scenario
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={450} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={38} fontWeight={600} fill={COLORS.sky_blue}>
            Designed Before Anyone Boarded
          </text>
        </g>

        {/* Vertical connecting line on left */}
        <line x1={85} y1={startY} x2={85} y2={startY + 6 * (CARD_H + CARD_GAP) - CARD_GAP}
          stroke={COLORS.sky_blue} strokeWidth={2}
          strokeDasharray={lineLength} strokeDashoffset={lineDash}
          strokeLinecap="round" />

        {/* Zone C — Scenario grid */}
        {SCENARIOS.map((scenario, i) => {
          const ent = scenarioEntrances[i];
          const y = startY + i * (CARD_H + CARD_GAP);
          const checkP = checkMarks[i];
          const colors = [
            COLORS.vibrant_red, COLORS.orange, COLORS.amber,
            COLORS.sky_blue, COLORS.purple, COLORS.green,
          ];
          const color = colors[i];

          return (
            <g key={i} opacity={ent.opacity}
              transform={`translate(110, ${y + ent.translateY})`}>
              {/* Card bg */}
              <rect x={0} y={0} width={860} height={CARD_H} rx={12}
                fill={color} fillOpacity={0.04}
                stroke={color} strokeWidth={1.5} />

              {/* Number badge */}
              <circle cx={40} cy={CARD_H / 2} r={24}
                fill={color} fillOpacity={0.1}
                stroke={color} strokeWidth={1.5} />
              <text x={40} y={CARD_H / 2 + 9} textAnchor="middle"
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={28} fontWeight={800} fill={color}>
                {i + 1}
              </text>

              {/* Phase label */}
              <text x={85} y={50} fontFamily="'Inter', system-ui, sans-serif"
                fontSize={20} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.1em">
                {scenario.phase}
              </text>

              {/* Scenario name */}
              <text x={85} y={95} fontFamily="'Inter', system-ui, sans-serif"
                fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
                {scenario.label}
              </text>

              {/* Checkmark */}
              <g opacity={checkP} transform={`translate(790, ${CARD_H / 2})`}>
                <circle cx={0} cy={0} r={20}
                  fill={COLORS.green} fillOpacity={0.12}
                  stroke={COLORS.green} strokeWidth={2}
                  style={{ transform: `scale(${pulse})`, transformOrigin: '0px 0px' }} />
                <path d="M -8,0 L -3,6 L 8,-6"
                  fill="none" stroke={COLORS.green} strokeWidth={3} strokeLinecap="round" />
              </g>

              {/* Node on connecting line */}
              <circle cx={-25} cy={CARD_H / 2} r={6}
                fill={color} opacity={ent.opacity} />
            </g>
          );
        })}

        {/* Statement bar */}
        <g opacity={statementCard.opacity}
          transform={`translate(60, ${1505 + statementCard.translateY})`}>
          <rect x={0} y={0} width={960} height={80} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <text x={480} y={50} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            ALL SCENARIOS PRE-ENGINEERED
          </text>
        </g>

        {/* Decorative timeline dots */}
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx={85}
            cy={startY + i * (CARD_H + CARD_GAP) + CARD_H / 2}
            r={4} fill={COLORS.sky_blue}
            opacity={scenarioEntrances[i].opacity * shimmer} />
        ))}

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">EVERY SCENARIO · PRE-PLANNED · REHEARSED</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
