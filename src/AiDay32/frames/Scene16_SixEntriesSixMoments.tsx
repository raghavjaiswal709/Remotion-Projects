/**
 * Scene 16 — Six Entries Six Moments
 * "Six entries. Six moments."
 * CSV: 40.040s → 42.500s
 * Duration: 74 frames (2.47s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline per-word spring
 *   Phase 2 (10–50): 6 trajectory nodes staggered cascade, counter
 *   Phase 3 (40–end): Pulse, breathe
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene16_SixEntriesSixMoments: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelIn = useSpringEntrance(frame, 0);

  // Per-word spring for headline
  const words = ['Six', 'entries.', 'Six', 'moments.'];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - i * 5);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const counterValue = useCounter(frame, 10, 6, 30);

  // 6 trajectory entries staggered
  const entries = [
    { label: 's₀', desc: 'Initial state', color: COLORS.text_muted },
    { label: 'a₁', desc: 'Search action', color: COLORS.accent },
    { label: 'o₁', desc: 'Results received', color: COLORS.text_muted },
    { label: 'a₂', desc: 'Read document', color: COLORS.accent },
    { label: 'o₂', desc: 'Text extracted', color: COLORS.text_muted },
    { label: 'a₃', desc: 'Produce summary', color: COLORS.accent },
  ];

  const entryEntrances = entries.map((_, i) => useSpringEntrance(frame, 12 + i * 5));

  const summaryCard = useSpringEntrance(frame, 48);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY RECAP" y={160} opacity={0.8} />
        </g>

        {/* ZONE B — per-word headline */}
        {words.map((word, i) => (
          <text key={i}
            x={60 + [0, 190, 450, 610][i]}
            y={320}
            opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={i % 2 === 0 ? COLORS.white : COLORS.accent}
            fontStyle={i >= 2 ? 'italic' : 'normal'}>
            {word}
          </text>
        ))}

        {/* Ghost counter behind */}
        <text x={540} y={580} textAnchor="middle"
          fontFamily={FONT} fontSize={300} fontWeight={800}
          fill={COLORS.accent} opacity={0.04}>
          {counterValue}
        </text>

        {/* Large counter */}
        <text x={540} y={580} textAnchor="middle"
          fontFamily={FONT} fontSize={200} fontWeight={800}
          fill={COLORS.accent} opacity={shimmer}>
          {counterValue}
        </text>

        {/* 6 entry cards — vertical list */}
        {entries.map((entry, i) => (
          <g key={i} opacity={entryEntrances[i].opacity}
            transform={`translate(0, ${entryEntrances[i].translateY})`}>
            <BentoCard x={60} y={660 + i * 120} w={960} h={100}
              accent={entry.color === COLORS.accent} />
            {/* Left accent bar */}
            <rect x={60} y={660 + i * 120} width={6} height={100} rx={3}
              fill={entry.color} />
            {/* Index circle */}
            <circle cx={120} cy={710 + i * 120} r={20}
              fill={entry.color === COLORS.accent ? COLORS.accent : COLORS.bg_primary}
              fillOpacity={entry.color === COLORS.accent ? 0.15 : 1}
              stroke={entry.color === COLORS.accent ? COLORS.accent : 'rgba(255,255,255,0.12)'}
              strokeWidth={1.5} />
            <text x={120} y={717 + i * 120} textAnchor="middle"
              fontFamily={FONT} fontSize={16} fontWeight={800}
              fill={entry.color === COLORS.accent ? COLORS.accent : COLORS.text_muted}>
              {entry.label}
            </text>
            {/* Description */}
            <text x={170} y={720 + i * 120}
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={entry.color === COLORS.accent ? COLORS.white : COLORS.text_muted}>
              {entry.desc}
            </text>
            {/* Number badge right */}
            <text x={960} y={718 + i * 120} textAnchor="end"
              fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
              #{i + 1}
            </text>
          </g>
        ))}

        {/* Summary bottom card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1420} w={960} h={180} accent />
          <text x={540} y={1510} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Six recorded moments
          </text>
          <text x={540} y={1560} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            = One complete trajectory
          </text>
        </g>

        {/* Floating accents */}
        {[80, 540, 1000].map((x, i) => (
          <circle key={i} cx={x} cy={1700 + Math.sin(frame * 0.05 + i) * 3}
            r={4} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
