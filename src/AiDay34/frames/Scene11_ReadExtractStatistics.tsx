/**
 * Scene 11 — Read and Extract Statistics
 * "Read each source, extract key statistics,"
 * CSV: 40.320s → 43.560s | Duration: 97 frames (3.23s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–22):  Label + headline spring in
 *   Phase 2 (frames 18–75): Document illustration, extraction arrows, stats display
 *   Phase 3 (frames 70–end): Shimmer / breathing / data labels pulse
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 };
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30, config = SPRING_CONFIG) {
  const f = Math.max(0, frame - delay);
  const progress  = spring({ frame: f, fps, config });
  const opacity   = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 22) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

function useCounter(frame: number, startF: number, end: number, dur = 40) {
  const raw = interpolate(frame, [startF, startF + dur], [0, end], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

const STATS = [
  { label: 'EV Sales Growth', value: 38, unit: '%', delay: 40 },
  { label: 'New Models 2024', value: 74, unit: '+', delay: 52 },
  { label: 'Market Share',    value: 18, unit: '%', delay: 64 },
];

export const Scene11_ReadExtractStatistics: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 5);
  const docEnter   = useSpringEntrance(frame, 18);
  const arrowLen   = 120;
  const arrowDash  = usePathDraw(frame, 32, arrowLen, 18);

  const statEnters = STATS.map(s => useSpringEntrance(frame, s.delay, fps, SPRING_SNAP));
  const statValues = STATS.map(s => useCounter(frame, s.delay + 6, s.value, 30));

  const breathe  = Math.sin(frame * 0.08) * 4;
  const shimmer  = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · SUB-TASK 2" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>
            Sub-task 2
          </text>
          <text x={60} y={368}
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Read + Extract Statistics
          </text>
        </g>

        {/* Document card */}
        <g opacity={docEnter.opacity} transform={`translate(0, ${docEnter.translateY})`}>
          <BentoCard x={60} y={450} w={460} h={380} accent />
          <rect x={60} y={450} width={6} height={380} rx={3} fill={COLORS.accent} />
          <text x={290} y={500} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            SOURCE DOCUMENT
          </text>

          {/* Document lines */}
          {[530, 564, 598, 632, 666, 700, 734, 768].map((y, i) => (
            <rect key={i} x={100} y={y} width={i % 2 === 0 ? 380 : 310} height={12} rx={4}
              fill={COLORS.white} opacity={0.1} />
          ))}

          {/* "KEY STAT" highlight boxes */}
          <rect x={100} y={730} width={380} height={40} rx={8}
            fill={COLORS.accent} fillOpacity={0.18} />
          <text x={290} y={757} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            KEY STAT HIGHLIGHTED
          </text>
        </g>

        {/* Extraction arrow */}
        <path d="M 524,640 L 580,640"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeLinecap="round" markerEnd="url(#arrow)"
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash} />

        {/* Stats display */}
        <g>
          {STATS.map((stat, i) => (
            <g key={stat.label}
              opacity={statEnters[i].opacity}
              transform={`translate(0, ${statEnters[i].translateY})`}>
              <BentoCard x={600} y={450 + i * 140} w={420} h={120} accent={i === 1} />
              <text x={630} y={510 + i * 140}
                fontFamily={FONT} fontSize={22} fontWeight={800}
                fill={COLORS.text_muted} letterSpacing="0.06em">
                {stat.label.toUpperCase()}
              </text>
              <text x={810} y={556 + i * 140} textAnchor="middle"
                fontFamily={FONT} fontSize={48} fontWeight={800}
                fill={i === 1 ? COLORS.accent : COLORS.white}>
                {statValues[i]}{stat.unit}
              </text>
            </g>
          ))}
        </g>

        {/* Insight card */}
        <g opacity={statEnters[2].opacity} transform={`translate(0, ${statEnters[2].translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={130} />
          <rect x={60} y={1100} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={540} y={1158} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Each source is read fully
          </text>
          <text x={540} y={1204} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            key statistics extracted and stored
          </text>
        </g>

        {/* Floating data points */}
        {[0, 1, 2].map(i => (
          <g key={i}
            transform={`translate(${200 + i * 340}, ${1380 + breathe * (i % 2 === 0 ? 1 : -1)})`}
            opacity={statEnters[2].opacity * shimmer}>
            <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.12} />
          </g>
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
