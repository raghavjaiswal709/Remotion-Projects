/**
 * Scene 08 — ExactSequence
 * "Here is what it does in exact sequence."
 * CSV: 25.260s → 27.300s
 * Duration: 61 frames (2.0s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline
 *   Phase 2 (15–45): sequence arrow + numbered steps preview
 *   Phase 3 (40–end): micro
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

export const Scene08_ExactSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);

  // 6 step circles in a vertical column
  const steps = [
    { label: '1', text: 'Receive' },
    { label: '2', text: 'Format' },
    { label: '3', text: 'Call' },
    { label: '4', text: 'Read' },
    { label: '5', text: 'Execute' },
    { label: '6', text: 'Append' },
  ];

  const stepEntrances = steps.map((_, i) => useSpringEntrance(frame, 12 + i * 4));

  // Vertical connector line
  const connLen = 800;
  const connDash = usePathDraw(frame, 14, connLen, 25);

  // Summary card
  const summaryEnt = useSpringEntrance(frame, 36);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + frame * 0.015;
    const r = 360 + Math.sin(frame * 0.02 + i * 1.2) * 30;
    return { x: 540 + Math.cos(angle) * r, y: 950 + Math.sin(angle) * r * 0.35, size: 2 + i % 2 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Exact Sequence
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            Step by step, the runtime loop
          </text>
        </g>

        {/* Vertical connector */}
        <line x1={180} y1={480} x2={180} y2={1280}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={connDash}
          opacity={0.4} />

        {/* 6 steps */}
        {steps.map((step, i) => {
          const yC = 520 + i * 130;
          const ent = stepEntrances[i];
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <circle cx={180} cy={yC} r={28}
                fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
              <text x={180} y={yC + 9} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
                {step.label}
              </text>
              <BentoCard x={230} y={yC - 38} w={720} h={76} />
              <text x={270} y={yC + 11}
                fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
                {step.text}
              </text>
            </g>
          );
        })}

        {/* Summary card */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={140} accent />
          <rect x={60} y={1380} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={120} y={1465}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Six steps, one continuous cycle
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size}
            fill={COLORS.accent} opacity={0.07 * shimmer} />
        ))}

        <g transform={`translate(540, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={22} fill={COLORS.accent} opacity={0.05} />
          <circle cx={0} cy={0} r={22} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.18} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
