/**
 * Scene01_ScrollTimeline — Day 5
 * Duration: 150 frames = 5s (SILENT)
 * Shows full day list, scrolls to day 5
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground } from '../helpers/components';

interface Props {
  currentDay: number;
  totalDays: number;
  seriesTitle: string;
}

const ALL_DAYS = [
  { day: 1, topic: 'The Moon Is Moving Away' },
  { day: 2, topic: 'Why Artemis II Matters' },
  { day: 3, topic: 'Apollo 8 vs Artemis II' },
  { day: 4, topic: 'The Abort Button' },
  { day: 5, topic: 'Orion Splashdown' },
];

const ROW_H = 220;
const VISIBLE = 6;
const VIEW_H = ROW_H * VISIBLE;
const VIEW_Y = Math.round((1920 - VIEW_H) / 2);

export const Scene01_ScrollTimeline: React.FC<Props> = ({ currentDay, totalDays, seriesTitle }) => {
  const frame = useCurrentFrame();

  const targetScrollY = -(currentDay - 1 - Math.floor(VISIBLE / 2) + 0.5) * ROW_H;
  const clampedTarget = Math.min(0, Math.max(-(ALL_DAYS.length - VISIBLE) * ROW_H, targetScrollY));

  const scrollY = interpolate(frame, [0, 120], [0, clampedTarget], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const sceneFade = interpolate(frame, [130, 149], [1, 0], { extrapolateRight: 'clamp' });
  const headerEnter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const progressWidth = (currentDay / totalDays) * 960;
  const progressEnter = interpolate(frame, [10, 60], [0, progressWidth], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: sceneFade }} width={1080} height={1920}>
        <PaperBackground />

        <g opacity={headerEnter}>
          <text x={60} y={90} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={800} fill={COLORS.sky_blue} letterSpacing="0.05em">
            DAY {currentDay}
          </text>
          <text x={60 + 28 * (String(currentDay).length * 0.7 + 4)} y={90}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            / {totalDays}
          </text>
          <rect x={60} y={110} width={960} height={6} rx={3} fill={COLORS.deep_black} opacity={0.08} />
          <rect x={60} y={110} width={progressEnter} height={6} rx={3} fill={COLORS.sky_blue} opacity={0.7} />
        </g>

        <text x={540} y={175} textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={22} fontWeight={500} fill={COLORS.cool_silver}
          letterSpacing="0.22em" opacity={headerEnter * 0.7}>
          {seriesTitle}
        </text>

        <defs>
          <clipPath id={`scrollClip-d${currentDay}`}>
            <rect x={0} y={VIEW_Y} width={1080} height={VIEW_H} />
          </clipPath>
        </defs>

        <rect x={0} y={VIEW_Y} width={1080} height={48} fill={COLORS.bg_paper} opacity={0.85} />
        <rect x={0} y={VIEW_Y + VIEW_H - 48} width={1080} height={48} fill={COLORS.bg_paper} opacity={0.85} />

        <g clipPath={`url(#scrollClip-d${currentDay})`} transform={`translate(0, ${VIEW_Y + scrollY})`}>
          {ALL_DAYS.map((d, idx) => {
            const isCurrent = d.day === currentDay;
            const rowY = idx * ROW_H;
            return (
              <g key={d.day}>
                {isCurrent && (
                  <rect x={60} y={rowY + 10} width={960} height={ROW_H - 20} rx={8}
                    fill={COLORS.sky_blue} opacity={0.06} />
                )}
                {isCurrent && (
                  <rect x={60} y={rowY + 30} width={6} height={160} rx={3} fill={COLORS.sky_blue} />
                )}
                <text x={isCurrent ? 90 : 80} y={rowY + 85}
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={isCurrent ? 52 : 40} fontWeight={isCurrent ? 900 : 600}
                  fill={isCurrent ? COLORS.sky_blue : COLORS.deep_black}
                  opacity={isCurrent ? 1 : 0.45}>
                  {`DAY ${d.day}`}
                </text>
                <text x={isCurrent ? 90 : 80} y={rowY + 142}
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={isCurrent ? 34 : 28} fontWeight={isCurrent ? 700 : 400}
                  fill={isCurrent ? COLORS.deep_black : COLORS.cool_silver}
                  opacity={isCurrent ? 0.9 : 0.4}>
                  {d.topic}
                </text>
                <line x1={60} y1={rowY + ROW_H - 1} x2={1020} y2={rowY + ROW_H - 1}
                  stroke={COLORS.deep_black} strokeWidth={1} opacity={0.07} />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
