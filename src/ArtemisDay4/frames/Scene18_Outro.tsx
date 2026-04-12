/**
 * Scene18 — Outro
 * Duration: 362 frames (12.07s)
 * Shows current day recap + tomorrow preview (Day 5: Orion Splashdown)
 *
 * Animation phases:
 *   Phase 1 (0–40): Reveal header + day badge
 *   Phase 2 (30–160): Content — recap bullets + tomorrow teaser
 *   Phase 3 (150–end): Steady micro-animations, CTA arrow
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CornerAccents } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

interface OutroProps {
  currentDay: number;
  nextDay: number;
  nextTopic: string;
  seriesTitle: string;
}

export const Scene18_Outro: React.FC<OutroProps> = ({
  currentDay,
  nextDay,
  nextTopic,
  seriesTitle,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1 — reveal
  const headerEnt = useSpringEntrance(frame, 0);
  const dayBadge = useSpringEntrance(frame, 8);
  const topicEnt = useSpringEntrance(frame, 16);
  const divider1Draw = usePathDraw(frame, 24, 960, 25);

  // Phase 2 — recap / tomorrow
  const recapLabel = useSpringEntrance(frame, 32);
  const recap1 = useSpringEntrance(frame, 44);
  const recap2 = useSpringEntrance(frame, 56);
  const recap3 = useSpringEntrance(frame, 68);
  const divider2Draw = usePathDraw(frame, 78, 960, 25);
  const tomorrowLabel = useSpringEntrance(frame, 85);
  const tomorrowCard = useSpringEntrance(frame, 95);
  const ctaEnt = useSpringEntrance(frame, 110);

  // Phase 3 — micro
  const breathe = Math.sin(frame * 0.04) * 3;
  const pulse = 1 + Math.sin(frame * 0.06) * 0.012;
  const arrowBob = Math.sin(frame * 0.08) * 6;

  const RECAP_ITEMS = [
    { text: 'Abort system: launch vs deep space', icon: 'A' },
    { text: 'Pre-engineered scenarios, zero improvisation', icon: 'B' },
    { text: 'Every failure mode modeled and tested', icon: 'C' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.3} />

        {/* Header — series tag */}
        <g transform={`translate(0, ${headerEnt.translateY})`} opacity={headerEnt.opacity}>
          <text x={540} y={280} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}
            letterSpacing="0.22em">
            {seriesTitle.toUpperCase()}
          </text>
        </g>

        {/* Day badge */}
        <g transform={`translate(0, ${dayBadge.translateY})`} opacity={dayBadge.opacity}>
          <text x={540} y={380} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={80} fontWeight={900} fill={COLORS.sky_blue}>
            DAY {currentDay}
          </text>
        </g>

        {/* Today's topic */}
        <g transform={`translate(0, ${topicEnt.translateY})`} opacity={topicEnt.opacity}>
          <text x={540} y={450} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
            The Abort Button
          </text>
        </g>

        {/* Divider 1 */}
        <line x1={60} y1={500} x2={1020} y2={500}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.12}
          strokeDasharray={960} strokeDashoffset={divider1Draw} />

        {/* RECAP label */}
        <g transform={`translate(0, ${recapLabel.translateY})`} opacity={recapLabel.opacity}>
          <text x={60} y={560} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}
            letterSpacing="0.18em">
            TODAY&apos;S KEY POINTS
          </text>
        </g>

        {/* Recap points */}
        {RECAP_ITEMS.map((item, i) => {
          const ent = [recap1, recap2, recap3][i];
          return (
            <g key={i} opacity={ent.opacity}
              transform={`translate(60, ${600 + i * 110 + ent.translateY})`}>
              <circle cx={30} cy={30} r={22}
                fill={COLORS.sky_blue} fillOpacity={0.06}
                stroke={COLORS.sky_blue} strokeWidth={1.5}
                style={{ transform: `scale(${pulse})`, transformOrigin: '30px 30px' }} />
              <text x={30} y={37} textAnchor="middle"
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={22} fontWeight={800} fill={COLORS.sky_blue}>
                {i + 1}
              </text>
              <text x={70} y={38} fontFamily="'Inter', system-ui, sans-serif"
                fontSize={32} fontWeight={600} fill={COLORS.deep_black}>
                {item.text}
              </text>
            </g>
          );
        })}

        {/* Divider 2 */}
        <line x1={60} y1={950} x2={1020} y2={950}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.12}
          strokeDasharray={960} strokeDashoffset={divider2Draw} />

        {/* TOMORROW label */}
        <g transform={`translate(0, ${tomorrowLabel.translateY})`} opacity={tomorrowLabel.opacity}>
          <text x={60} y={1010} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}
            letterSpacing="0.18em">
            TOMORROW
          </text>
        </g>

        {/* Tomorrow preview card */}
        <g opacity={tomorrowCard.opacity}
          transform={`translate(60, ${1050 + tomorrowCard.translateY + breathe})`}>
          <rect x={0} y={0} width={960} height={200} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Day number */}
          <text x={60} y={60} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={800} fill={COLORS.sky_blue}>
            DAY {nextDay}
          </text>
          {/* Topic title */}
          <text x={60} y={110} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={700} fill={COLORS.deep_black}>
            {nextTopic}
          </text>
          {/* Teaser line */}
          <text x={60} y={160} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Why the most advanced capsule lands in the ocean
          </text>
          {/* Arrow accent */}
          <path d="M 880,70 L 910,100 L 880,130" fill="none"
            stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round"
            transform={`translate(${arrowBob}, 0)`} />
        </g>

        {/* CTA */}
        <g opacity={ctaEnt.opacity}
          transform={`translate(0, ${ctaEnt.translateY})`}>
          <text x={540} y={1400} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={600} fill={COLORS.deep_black}>
            Follow for Day {nextDay}
          </text>
          {/* Arrow down */}
          <path d={`M 540,1430 L 540,1470`} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round"
            transform={`translate(0, ${arrowBob})`} />
          <path d={`M 525,1458 L 540,1475 L 555,1458`} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
            transform={`translate(0, ${arrowBob})`} />
        </g>

        {/* Corner accents */}
        <g opacity={0.35}>
          <path d="M 60,70 L 60,150 M 60,70 L 140,70" fill="none"
            stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round" />
          <path d="M 1020,70 L 1020,150 M 1020,70 L 940,70" fill="none"
            stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round" />
          <path d="M 60,1850 L 60,1770 M 60,1850 L 140,1850" fill="none"
            stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round" />
          <path d="M 1020,1850 L 1020,1770 M 1020,1850 L 940,1850" fill="none"
            stroke={COLORS.sky_blue} strokeWidth={3} strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
