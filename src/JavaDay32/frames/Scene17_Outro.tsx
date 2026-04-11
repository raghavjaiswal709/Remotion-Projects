/**
 * Scene17_Outro — Day 32 Outro
 * Duration: 362 frames (~12s)
 * Shows: today's recap + "TOMORROW" Day 33 preview (@Override annotation)
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Series badge + day number spring in
 *   Phase 2 (frames 25–120): Today's 3 key concepts build
 *   Phase 3 (frames 100–250): Tomorrow teaser slides up, accent bar draws
 *   Phase 4 (frames 240–end): CTA + follow prompt with subtle float
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
import { PaperBackground, GlobalDefs, CornerAccents, Divider } from '../helpers/components';

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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

interface Props {
  currentDay: number;
  nextDay: number;
  nextTopic: string;
  seriesTitle: string;
}

const TODAY_CONCEPTS = [
  { icon: 'OV', text: 'Child class overrides parent method', color: COLORS.orange },
  { icon: 'RT', text: 'JVM resolves at runtime, not compile time', color: COLORS.sky_blue },
  { icon: 'PM', text: 'Polymorphism: one interface, many forms', color: COLORS.green },
];

export const Scene17_Outro: React.FC<Props> = ({
  currentDay,
  nextDay,
  nextTopic,
  seriesTitle,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Series branding ──────────────────────────────────────────────
  const cornerEnter = interpolate(frame, [0, 20], [0, 0.35], { extrapolateRight: 'clamp' });
  const seriesBadge = useSpringEntrance(frame, 0);
  const dayNumber = useSpringEntrance(frame, 6);
  const topicLine = useSpringEntrance(frame, 12);
  const dividerDraw1 = usePathDraw(frame, 18, 960, 20);

  // ── Phase 2: Today's concepts ─────────────────────────────────────────────
  const todayLabel = useSpringEntrance(frame, 25);
  const concept0 = useSpringEntrance(frame, 35);
  const concept1 = useSpringEntrance(frame, 47);
  const concept2 = useSpringEntrance(frame, 59);
  const conceptSprings = [concept0, concept1, concept2];

  const CARD_PERIM = 2 * (920 + 110);
  const cBorder0 = interpolate(frame, [35, 60], [CARD_PERIM, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cBorder1 = interpolate(frame, [47, 72], [CARD_PERIM, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cBorder2 = interpolate(frame, [59, 84], [CARD_PERIM, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const conceptBorders = [cBorder0, cBorder1, cBorder2];

  const dividerDraw2 = usePathDraw(frame, 80, 960, 20);

  // ── Phase 3: Tomorrow teaser ──────────────────────────────────────────────
  const tomorrowLabel = useSpringEntrance(frame, 100);
  const nextDayNum = useSpringEntrance(frame, 110);
  const nextTopicLine = useSpringEntrance(frame, 120);

  const TEASER_PERIM = 2 * (920 + 200);
  const teaserBorder = interpolate(frame, [115, 145], [TEASER_PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 4: CTA ─────────────────────────────────────────────────────────
  const ctaLine = useSpringEntrance(frame, 160);
  const ctaArrow = usePathDraw(frame, 170, 80, 15);

  // ── Micro-animations ──────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // ── Scene fade out (last 30 frames) ───────────────────────────────────────
  const sceneFade = interpolate(frame, [332, 362], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: sceneFade }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        <CornerAccents opacity={cornerEnter} color={COLORS.orange} />

        {/* ── Series badge ───────────────────────────────────────────────── */}
        <g opacity={seriesBadge.opacity} transform={`translate(0, ${seriesBadge.translateY})`}>
          <text x={540} y={130} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={COLORS.cool_silver} letterSpacing="0.2em">
            {seriesTitle}
          </text>
        </g>

        {/* ── Day number ─────────────────────────────────────────────────── */}
        <g opacity={dayNumber.opacity} transform={`translate(0, ${dayNumber.translateY})`}>
          <text x={540} y={230} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900}
            fill={COLORS.deep_black}>
            {`DAY ${currentDay}`}
          </text>
        </g>

        {/* ── Topic ──────────────────────────────────────────────────────── */}
        <g opacity={topicLine.opacity} transform={`translate(0, ${topicLine.translateY})`}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={600}
            fill={COLORS.orange}>
            Method Overriding
          </text>
        </g>

        {/* ── Divider 1 ──────────────────────────────────────────────────── */}
        <line x1={60} y1={350} x2={1020} y2={350}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.15}
          strokeDasharray={960} strokeDashoffset={dividerDraw1} />

        {/* ── TODAY label ────────────────────────────────────────────────── */}
        <g opacity={todayLabel.opacity} transform={`translate(0, ${todayLabel.translateY})`}>
          <text x={80} y={410}
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={COLORS.cool_silver} letterSpacing="0.15em">
            TODAY YOU LEARNED
          </text>
        </g>

        {/* ── Concept cards ──────────────────────────────────────────────── */}
        {TODAY_CONCEPTS.map((c, i) => {
          const y = 445 + i * 140;
          const float = frame > 100 ? breathe * (i === 1 ? -0.6 : 0.6) : 0;
          return (
            <g key={i} opacity={conceptSprings[i].opacity}
              transform={`translate(80, ${y + conceptSprings[i].translateY + float})`}>
              <rect x={0} y={0} width={920} height={110} rx={14}
                fill="none" stroke={c.color} strokeWidth={1.5}
                strokeDasharray={CARD_PERIM} strokeDashoffset={conceptBorders[i]} />
              <rect x={0} y={0} width={920} height={110} rx={14}
                fill={c.color} fillOpacity={0.04} />

              {/* Icon circle */}
              <circle cx={56} cy={55} r={28} fill={c.color} fillOpacity={0.12}
                stroke={c.color} strokeWidth={1.5} />
              <text x={56} y={63} textAnchor="middle"
                fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={800}
                fill={c.color}>
                {c.icon}
              </text>

              {/* Text */}
              <text x={100} y={64}
                fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={600}
                fill={COLORS.deep_black}>
                {c.text}
              </text>
            </g>
          );
        })}

        {/* ── Divider 2 ──────────────────────────────────────────────────── */}
        <line x1={60} y1={880} x2={1020} y2={880}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.15}
          strokeDasharray={960} strokeDashoffset={dividerDraw2} />

        {/* ── TOMORROW label ─────────────────────────────────────────────── */}
        <g opacity={tomorrowLabel.opacity} transform={`translate(0, ${tomorrowLabel.translateY})`}>
          <text x={80} y={940}
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={COLORS.orange} letterSpacing="0.15em">
            TOMORROW
          </text>
        </g>

        {/* ── Next day teaser card ───────────────────────────────────────── */}
        <g opacity={nextDayNum.opacity} transform={`translate(0, ${nextDayNum.translateY})`}>
          <rect x={80} y={970} width={920} height={200} rx={16}
            fill="none" stroke={COLORS.orange} strokeWidth={2}
            strokeDasharray={TEASER_PERIM} strokeDashoffset={teaserBorder} />
          <rect x={80} y={970} width={920} height={200} rx={16}
            fill={COLORS.orange} fillOpacity={0.05} />
          <rect x={80} y={970} width={6} height={200} rx={3} fill={COLORS.orange} />

          {/* Day number */}
          <text x={120} y={1030}
            fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={900}
            fill={COLORS.deep_black}>
            {`DAY ${nextDay}`}
          </text>

          {/* Topic */}
          <g opacity={nextTopicLine.opacity} transform={`translate(0, ${nextTopicLine.translateY})`}>
            <text x={120} y={1090}
              fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700}
              fill={COLORS.orange}>
              {nextTopic}
            </text>
            <text x={120} y={1140}
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
              fill={COLORS.cool_silver}>
              Compile-time safety for method overriding
            </text>
          </g>

          {/* Pulsing dot */}
          {frame > 130 && (
            <circle cx={960} cy={1070} r={8 * pulse}
              fill={COLORS.orange} fillOpacity={0.3 * shimmer} />
          )}
        </g>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <g opacity={ctaLine.opacity} transform={`translate(0, ${ctaLine.translateY + breathe * 0.5})`}>
          {/* Follow + Subscribe */}
          <text x={540} y={1340} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700}
            fill={COLORS.deep_black}>
            Follow for the full 105-part journey
          </text>

          {/* Arrow indicator */}
          <path d="M 500,1380 L 540,1420 L 580,1380"
            fill="none" stroke={COLORS.orange} strokeWidth={3}
            strokeDasharray={80} strokeDashoffset={ctaArrow}
            strokeLinecap="round" strokeLinejoin="round" />

          {/* Series progress */}
          <text x={540} y={1470} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={COLORS.cool_silver}>
            {`Part ${currentDay} of 105 — National Railway Java OOPs`}
          </text>

          {/* Progress bar background */}
          <rect x={200} y={1500} width={680} height={8} rx={4}
            fill={COLORS.deep_black} fillOpacity={0.08} />
          {/* Progress bar fill */}
          {(() => {
            const pct = currentDay / 105;
            const barW = interpolate(frame, [170, 210], [0, 680 * pct], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            return (
              <rect x={200} y={1500} width={barW} height={8} rx={4}
                fill={COLORS.orange} />
            );
          })()}

          {/* Percentage label */}
          <text x={540} y={1550} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={600}
            fill={COLORS.cool_silver} opacity={shimmer}>
            {`${Math.round(currentDay / 105 * 100)}% complete`}
          </text>
        </g>

        {/* ── Decorative accent dots ─────────────────────────────────────── */}
        {frame > 180 && [0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={440 + i * 50} cy={1620} r={3}
            fill={COLORS.orange} opacity={0.2 + shimmer * 0.15} />
        ))}

        {/* ── Bottom accent line ─────────────────────────────────────────── */}
        <line x1={400} y1={1660} x2={680} y2={1660}
          stroke={COLORS.orange} strokeWidth={2} opacity={0.15} strokeLinecap="round" />

      </svg>
    </AbsoluteFill>
  );
};
