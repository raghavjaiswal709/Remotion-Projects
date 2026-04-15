/**
 * Scene 10 — Counter Decrements
 * "Every time a train is retired, it decrements."
 * CSV: 52.610s → 55.780s
 * Duration: 95 frames (3.17s)
 *
 * Animation phases:
 *   Phase 1 (0–20):  Label + headline spring
 *   Phase 2 (15–60): Train retires, counter ticks down
 *   Phase 3 (55–end): Pulse, shimmer
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

export const Scene10_CounterDecrements: React.FC = () => {
  const frame = useCurrentFrame();

  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 6);
  const card1    = useSpringEntrance(frame, 14);
  const card2    = useSpringEntrance(frame, 26);
  const summary  = useSpringEntrance(frame, 50);

  // Counter from 3 → 2
  const counterVal = interpolate(frame, [30, 55], [3, 2], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const displayCount = Math.round(counterVal);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe = Math.sin(frame * 0.06) * 3;

  // Retired train fade-out
  const retireOp = interpolate(frame, [25, 50], [1, 0.15], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // X mark on retired train
  const xScale = spring({ frame: Math.max(0, frame - 30), fps: 30, config: SPRING_SNAP });

  // Minus badge
  const minusBadge = spring({ frame: Math.max(0, frame - 35), fps: 30, config: SPRING_SNAP });

  // Path draw for connection
  const arrowLen = 150;
  const arrowDash = interpolate(frame, [35, 55], [arrowLen, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="RETIRE · DECREMENT" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Counter --
          </text>
          <text x={60} y={370} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            Retired trains decrement
          </text>
        </g>

        {/* Counter display */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={340} y={430} w={400} h={200} accent />
          <text x={540} y={510} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            totalActiveTrains
          </text>
          <text x={540} y={590} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent}
            style={{ transform: `scale(${pulse})`, transformOrigin: '540px 570px' }}>
            {displayCount}
          </text>
        </g>

        {/* Trains — one retired (faded & X), two active */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          {/* Retired train */}
          <g opacity={retireOp}>
            <BentoCard x={60} y={700} w={300} h={180} />
            <rect x={80} y={730} width={80} height={40} rx={6}
              fill={COLORS.vibrant_red} opacity={0.15} />
            <rect x={80} y={730} width={80} height={40} rx={6}
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} />
            <text x={100} y={820} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
              Train 2
            </text>
            <text x={100} y={856} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.vibrant_red}>
              RETIRED
            </text>
          </g>
          {/* Red X over retired */}
          <g opacity={xScale} transform={`translate(210, 790) scale(${xScale})`}
            style={{ transformOrigin: '210px 790px' }}>
            <line x1={-30} y1={-30} x2={30} y2={30} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
            <line x1={30} y1={-30} x2={-30} y2={30} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          </g>

          {/* Active trains */}
          {[{ name: 'Train 1', x: 400 }, { name: 'Train 3', x: 720 }].map((t, i) => (
            <g key={i} transform={`translate(0, ${breathe * (i === 0 ? 1 : -1)})`}>
              <BentoCard x={t.x} y={700} w={300} h={180} />
              <rect x={t.x + 20} y={730} width={80} height={40} rx={6}
                fill={COLORS.accent} opacity={0.15} />
              <rect x={t.x + 20} y={730} width={80} height={40} rx={6}
                fill="none" stroke={COLORS.accent} strokeWidth={2} />
              <circle cx={t.x + 35} cy={780} r={8} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
              <circle cx={t.x + 85} cy={780} r={8} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={t.x + 20} y={860} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
                {t.name}
              </text>
            </g>
          ))}

          {/* Minus badge */}
          <g opacity={minusBadge} transform={`translate(210, 920)`}>
            <circle cx={0} cy={0} r={28} fill={COLORS.vibrant_red} opacity={0.15} />
            <text x={0} y={10} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
              −1
            </text>
          </g>
        </g>

        {/* Arrow from retire to counter */}
        <path d="M 210,690 L 440,640"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" />

        {/* Summary */}
        <g opacity={summary.opacity} transform={`translate(0, ${summary.translateY})`}>
          <BentoCard x={60} y={1050} w={960} h={120} accent />
          <text x={540} y={1125} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Retire a train → counter <tspan fill={COLORS.vibrant_red}>decrements</tspan> automatically
          </text>
        </g>

        {/* Rail tracks */}
        <g opacity={0.15}>
          <line x1={100} y1={1240} x2={980} y2={1240} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={100} y1={1250} x2={980} y2={1250} stroke={COLORS.text_muted} strokeWidth={2} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={120 + i * 72} y={1236} width={30} height={4}
              fill={COLORS.text_muted} rx={1} />
          ))}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
