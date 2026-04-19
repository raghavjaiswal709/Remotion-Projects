/**
 * Scene 18 — Why Does This Matter
 * "Why does this matter?"
 * CSV: 44.500s → 46.200s
 * Duration: 51 frames (1.7s)
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + large question headline
 *   Phase 2 (8–35): Three reason cards staggered
 *   Phase 3 (28–end): Pulse, shimmer
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

export const Scene18_WhyDoesThisMatter: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const questionMark = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_SNAP });
  const qScale = interpolate(questionMark, [0, 1], [0.5, 1]);
  const qOp = interpolate(questionMark, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  const reasons = [
    { icon: '?', title: 'DEBUGGING', desc: 'Trace what went wrong and where' },
    { icon: '!', title: 'EVALUATION', desc: 'Assess reasoning quality, not just answers' },
    { icon: '→', title: 'IMPROVEMENT', desc: 'Find patterns to optimize agent behavior' },
  ];
  const reasonEntrances = reasons.map((_, i) => useSpringEntrance(frame, 14 + i * 6));

  const transitionCard = useSpringEntrance(frame, 34);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY · IMPORTANCE" y={160} opacity={0.8} />
        </g>

        {/* ZONE B — Large question */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={340} fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.white}>
            Why does this
          </text>
          <text x={60} y={460} fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            matter?
          </text>
        </g>

        {/* Giant ghost question mark */}
        <text x={800} y={700} textAnchor="middle"
          fontFamily={FONT} fontSize={400} fontWeight={800}
          fill={COLORS.accent} opacity={0.04 * shimmer}
          transform={`scale(${qScale})`} style={{ transformOrigin: '800px 500px' }}>
          ?
        </text>

        {/* Animated question mark */}
        <g opacity={qOp} transform={`translate(800, ${500 + breathe})`}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.accent} opacity={0.3 * shimmer}
            transform={`scale(${qScale * pulse})`} style={{ transformOrigin: '0px -60px' }}>
            ?
          </text>
        </g>

        {/* Three reason cards */}
        {reasons.map((r, i) => (
          <g key={i} opacity={reasonEntrances[i].opacity}
            transform={`translate(0, ${reasonEntrances[i].translateY})`}>
            <BentoCard x={60} y={740 + i * 220} w={960} h={200} accent={i === 0} />
            <rect x={60} y={740 + i * 220} width={6} height={200} rx={3} fill={COLORS.accent} />
            {/* Number circle */}
            <circle cx={120} cy={840 + i * 220} r={28}
              fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={120} y={848 + i * 220} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
              {i + 1}
            </text>
            {/* Title */}
            <text x={170} y={810 + i * 220}
              fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.accent} letterSpacing="0.1em">
              {r.title}
            </text>
            {/* Description */}
            <text x={170} y={870 + i * 220}
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
              {r.desc}
            </text>
          </g>
        ))}

        {/* Transition arrow card */}
        <g opacity={transitionCard.opacity} transform={`translate(0, ${transitionCard.translateY})`}>
          <BentoCard x={60} y={1420} w={960} h={160} />
          <text x={100} y={1516} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            The final output alone doesn't tell the full story...
          </text>
          <path d="M 960,1510 L 990,1510" fill="none"
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* Floating accents */}
        {[80, 540, 1000].map((x, i) => (
          <circle key={i} cx={x} cy={1700 + Math.sin(frame * 0.05 + i) * 3}
            r={4} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
