/**
 * Scene 22 — Start To Finish Record
 * "from start to finish, forms a complete record"
 * CSV: 82.833s → 86.100s | Duration: 98 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–70): Timeline/log visualization
 *   Phase 3 (65–end): Micro
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
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene22_StartToFinishRecord: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);
  const card1 = useSpringEntrance(frame, 20);

  // Timeline entries staggered
  const entries = [
    { label: 'START', desc: 'Task received', time: '0:00' },
    { label: 'READ', desc: 'Load context', time: '0:02' },
    { label: 'PLAN', desc: 'Decompose task', time: '0:05' },
    { label: 'ACT', desc: 'Execute step 1', time: '0:08' },
    { label: 'CHECK', desc: 'Validate output', time: '0:12' },
    { label: 'ACT', desc: 'Execute step 2', time: '0:15' },
    { label: 'FINISH', desc: 'Return result', time: '0:20' },
  ];

  const entryEntrances = entries.map((_, i) =>
    useSpringEntrance(frame, 24 + i * 8)
  );

  // Vertical timeline line
  const timelineLen = 800;
  const timelineDash = usePathDraw(frame, 22, timelineLen, 40);

  const summaryCard = useSpringEntrance(frame, 80);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · RECORDING" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>Complete Record</text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent}>From start to finish</text>
        </g>

        {/* Timeline card */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={880} accent />

          {/* Vertical line */}
          <line x1={200} y1={530} x2={200} y2={1330}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={timelineLen} strokeDashoffset={timelineDash} />

          {/* Timeline entries */}
          {entries.map((entry, i) => {
            const ey = 540 + i * 112;
            const ent = entryEntrances[i];
            const isFirst = i === 0;
            const isLast = i === entries.length - 1;
            return (
              <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
                {/* Dot on timeline */}
                <circle cx={200} cy={ey + 20} r={isFirst || isLast ? 10 : 7}
                  fill={isFirst || isLast ? COLORS.accent : COLORS.bg_secondary}
                  stroke={COLORS.accent} strokeWidth={2} />

                {/* Label badge */}
                <rect x={240} y={ey} width={120} height={36} rx={8}
                  fill={COLORS.accent} fillOpacity={isFirst || isLast ? 0.15 : 0.06}
                  stroke={COLORS.accent} strokeWidth={1} />
                <text x={300} y={ey + 24} textAnchor="middle" fontFamily={FONT}
                  fontSize={18} fontWeight={800}
                  fill={isFirst || isLast ? COLORS.accent : COLORS.text_muted}>
                  {entry.label}
                </text>

                {/* Description */}
                <text x={380} y={ey + 26} fontFamily={FONT} fontSize={28}
                  fontWeight={800} fill={COLORS.white}>
                  {entry.desc}
                </text>

                {/* Timestamp */}
                <text x={900} y={ey + 26} textAnchor="end" fontFamily={FONT}
                  fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
                  {entry.time}
                </text>
              </g>
            );
          })}
        </g>

        {/* Summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={100} />
          <text x={540} y={1462} textAnchor="middle" fontFamily={FONT}
            fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Every agent run produces a{' '}
            <tspan fill={COLORS.accent} fontStyle="italic">full log</tspan>
          </text>
        </g>

        {/* Micro */}
        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent}
            fillOpacity={0.03 * shimmer} />
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent}
            strokeWidth={1} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.1} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
