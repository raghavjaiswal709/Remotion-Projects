/**
 * Scene 09 — Counter Increments
 * "Every time a new train object is created, this counter increments."
 * CSV: 48.010s → 52.610s
 * Duration: 138 frames (4.6s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Label + headline spring
 *   Phase 2 (18–80): Train objects spawn, counter ticks up
 *   Phase 3 (70–end): Pulse on counter, float on trains
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function useCounter(frame: number, startFrame: number, endVal: number, dur = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + dur], [0, endVal], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene09_CounterIncrements: React.FC = () => {
  const frame = useCurrentFrame();

  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 6);

  // Counter display
  const counterCard = useSpringEntrance(frame, 14);
  const counterVal = useCounter(frame, 20, 3, 60);
  const counterPulse = 1 + Math.sin(frame * 0.1) * 0.02;

  // Train objects spawn
  const trains = [
    { name: 'Train 1', color: COLORS.accent, delay: 20 },
    { name: 'Train 2', color: '#76ABAE', delay: 40 },
    { name: 'Train 3', color: '#93B1A6', delay: 60 },
  ];
  const trainSprings = trains.map(t => useSpringEntrance(frame, t.delay));

  // Arrow from trains to counter
  const arrowLen = 200;
  const arrowDash = interpolate(frame, [50, 75], [arrowLen, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Plus badges
  const plusSprings = trains.map((_, i) =>
    spring({ frame: Math.max(0, frame - trains[i].delay - 5), fps: 30, config: SPRING_SNAP })
  );

  const breathe = Math.sin(frame * 0.05) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Summary card
  const summary = useSpringEntrance(frame, 80);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="OBJECT CREATION · INCREMENT" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Counter ++
          </text>
          <text x={60} y={370} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            Every new train increments the count
          </text>
        </g>

        {/* Counter card — large, centered */}
        <g opacity={counterCard.opacity} transform={`translate(0, ${counterCard.translateY})`}>
          <BentoCard x={340} y={430} w={400} h={200} accent />
          <text x={540} y={510} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            totalActiveTrains
          </text>
          <text x={540} y={590} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent}
            style={{ transform: `scale(${counterPulse})`, transformOrigin: '540px 570px' }}>
            {counterVal}
          </text>
        </g>

        {/* Train objects spawning */}
        {trains.map((train, i) => {
          const s = trainSprings[i];
          const y = 700 + i * 200;
          return (
            <g key={i} opacity={s.opacity} transform={`translate(0, ${s.translateY + breathe * (i % 2 === 0 ? 1 : -1)})`}>
              <BentoCard x={60} y={y} w={700} h={160} />
              {/* Mini train icon */}
              <rect x={100} y={y + 50} width={100} height={50} rx={8}
                fill={train.color} opacity={0.15} />
              <rect x={100} y={y + 50} width={100} height={50} rx={8}
                fill="none" stroke={train.color} strokeWidth={2} />
              <circle cx={120} cy={y + 110} r={12} fill="none" stroke={train.color} strokeWidth={2} />
              <circle cx={180} cy={y + 110} r={12} fill="none" stroke={train.color} strokeWidth={2} />

              <text x={230} y={y + 82} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
                {train.name}
              </text>
              <text x={230} y={y + 126} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
                new Train()
              </text>

              {/* Plus badge */}
              <g opacity={plusSprings[i]} transform={`translate(${780}, ${y + 70})`}>
                <circle cx={0} cy={0} r={28} fill={COLORS.accent} opacity={0.15} />
                <text x={0} y={10} textAnchor="middle"
                  fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
                  +1
                </text>
              </g>
            </g>
          );
        })}

        {/* Arrow from creation area to counter */}
        <path d="M 540,680 L 540,650"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Summary */}
        <g opacity={summary.opacity} transform={`translate(0, ${summary.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={120} accent />
          <text x={540} y={1415} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Each <tspan fill={COLORS.accent} fontStyle="italic">new Train()</tspan> pushes the shared counter up
          </text>
        </g>

        {/* Decorative track lines */}
        <line x1={100} y1={1540} x2={980} y2={1540}
          stroke={COLORS.text_muted} strokeWidth={2} opacity={shimmer * 0.2} />
        <line x1={100} y1={1550} x2={980} y2={1550}
          stroke={COLORS.text_muted} strokeWidth={2} opacity={shimmer * 0.2} />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={120 + i * 72} y={1536} width={30} height={4}
            fill={COLORS.text_muted} opacity={0.15} rx={1} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
