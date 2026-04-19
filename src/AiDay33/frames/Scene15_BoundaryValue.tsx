/**
 * Scene 15 — Boundary Value
 * "The value of thinking in steps is what each boundary gives you."
 * CSV: 47.560s → 51.860s
 * Duration: 129 frames (4.3s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–22): Label + headline
 *   Phase 2 (frames 18–80): Three boundary lines with labels, path-draw
 *   Phase 3 (frames 70–end): Lines shimmer
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

const BOUNDARIES = [
  { label: 'AUDITABLE', desc: 'Was this correct?', y: 540, delay: 22 },
  { label: 'MEASURABLE', desc: 'How much did it cost?', y: 820, delay: 36 },
  { label: 'RETRIABLE', desc: 'Can we redo just this?', y: 1100, delay: 50 },
];

export const Scene15_BoundaryValue: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Boundary entries
  const entries = BOUNDARIES.map(b => ({
    ...b,
    ent: useSpringEntrance(frame, b.delay),
    lineDash: usePathDraw(frame, b.delay + 4, 960, 22),
  }));

  // Value card
  const valueCard = useSpringEntrance(frame, 65);

  // Phase 3
  const shimmer = (idx: number) => interpolate(
    Math.sin(frame * 0.04 + idx * 1.5), [-1, 1], [0.6, 1]
  );

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="STEP BENEFITS · BOUNDARIES" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Step Boundaries
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Three powers at every edge
          </text>
        </g>

        {/* ZONE C — Three boundary sections */}
        {entries.map((e, idx) => (
          <g key={idx} opacity={e.ent.opacity} transform={`translate(0, ${e.ent.translateY})`}>
            {/* Horizontal divider line */}
            <line x1={60} y1={e.y} x2={1020} y2={e.y}
              stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={960} strokeDashoffset={e.lineDash}
              strokeLinecap="round" opacity={shimmer(idx)}
            />

            {/* Content card */}
            <BentoCard x={60} y={e.y + 20} w={960} h={200} accent={idx === 0} />

            {/* Number */}
            <text x={120} y={e.y + 100} fontFamily={FONT} fontSize={72} fontWeight={800}
              fill={COLORS.accent} opacity={0.3}>
              {idx + 1}
            </text>

            {/* Label */}
            <text x={220} y={e.y + 90} fontFamily={FONT} fontSize={48} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic" letterSpacing="0.08em">
              {e.label}
            </text>

            {/* Description */}
            <text x={220} y={e.y + 150} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.text_muted}>
              {e.desc}
            </text>

            {/* Right accent dot */}
            <circle cx={960} cy={e.y + 120} r={8} fill={COLORS.accent} opacity={0.25 * shimmer(idx)} />
          </g>
        ))}

        {/* Value summary card */}
        <g opacity={valueCard.opacity} transform={`translate(0, ${valueCard.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={140} accent />
          <rect x={60} y={1400} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1485} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Every boundary = a <tspan fill={COLORS.accent} fontStyle="italic">control point</tspan>
          </text>
        </g>

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
