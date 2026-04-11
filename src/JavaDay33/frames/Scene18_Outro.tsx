/**
 * Scene18 — Outro
 * Duration: 362 frames (12.07s)
 * Shows Day 33 recap + Day 34 preview: "Covariant Return Type"
 *
 * Animation phases:
 *   Phase 1 (frames 0-30):  Label + current day recap
 *   Phase 2 (frames 25-120): Today's key concepts, divider, tomorrow preview
 *   Phase 3 (frames 110-end): Breathing, shimmer, CTA pulse
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
import { PaperBackground, GlobalDefs, SectionLabel } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

interface Props {
  currentDay: number;
  nextDay: number;
  nextTopic: string;
  seriesTitle: string;
}

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

export const Scene18_Outro: React.FC<Props> = ({
  currentDay,
  nextDay,
  nextTopic,
  seriesTitle,
}) => {
  const frame = useCurrentFrame();

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const dayHero = useSpringEntrance(frame, 6);
  const topicLabel = useSpringEntrance(frame, 12);

  // ── Phase 2: Today's concepts ──────────────────────────────────────────────
  const conceptsTitle = useSpringEntrance(frame, 20);

  const concept1 = useSpringEntrance(frame, 28);
  const concept2 = useSpringEntrance(frame, 38);
  const concept3 = useSpringEntrance(frame, 48);

  const barLen = 80;
  const bar1Dash = usePathDraw(frame, 30, barLen, 8);
  const bar2Dash = usePathDraw(frame, 40, barLen, 8);
  const bar3Dash = usePathDraw(frame, 50, barLen, 8);

  // Divider
  const dividerLen = 900;
  const dividerDash = usePathDraw(frame, 56, dividerLen, 14);

  // Tomorrow section
  const tomorrowLabel = useSpringEntrance(frame, 62);
  const tomorrowDay = useSpringEntrance(frame, 68);
  const tomorrowTopic = useSpringEntrance(frame, 74);

  // Tomorrow card
  const tCardPerim = 2 * (960 + 120);
  const tCardBorder = usePathDraw(frame, 70, tCardPerim, 18);

  // CTA
  const ctaEntrance = useSpringEntrance(frame, 84);
  const ctaArrowLen = 40;
  const ctaArrowDash = usePathDraw(frame, 88, ctaArrowLen, 8);

  // Series footer
  const footerEntrance = useSpringEntrance(frame, 94);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Outro fade-out
  const outroFade = interpolate(frame, [330, 362], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: outroFade }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="DAY COMPLETE" y={120} opacity={0.55} />
        </g>

        {/* ── Day number hero ─────────────────────────────────────────────── */}
        <g opacity={dayHero.opacity} transform={`translate(0, ${dayHero.translateY})`}>
          {/* Ghost */}
          <text x={540} y={330} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={200} fontWeight={900} fill={COLORS.orange} opacity={0.06}>
            {currentDay}
          </text>
          {/* Main */}
          <text x={540} y={320} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={160} fontWeight={900} fill={COLORS.orange}>
            DAY {currentDay}
          </text>
        </g>

        <g opacity={topicLabel.opacity} transform={`translate(0, ${topicLabel.translateY})`}>
          <text x={540} y={400} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
            @Override Annotation
          </text>
        </g>

        {/* ── Today's concepts ────────────────────────────────────────────── */}
        <g opacity={conceptsTitle.opacity} transform={`translate(0, ${conceptsTitle.translateY})`}>
          <text x={60} y={490} fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.15em">
            WHAT YOU LEARNED
          </text>
        </g>

        <g opacity={concept1.opacity} transform={`translate(60, ${520 + concept1.translateY})`}>
          <line x1={0} y1={0} x2={0} y2={48}
            stroke={COLORS.orange} strokeWidth={4}
            strokeDasharray={barLen} strokeDashoffset={bar1Dash}
            strokeLinecap="round" />
          <text x={20} y={18} fontFamily="'Inter', sans-serif" fontSize={28}
            fontWeight={700} fill={COLORS.deep_black}>
            @Override placement
          </text>
          <text x={20} y={46} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.cool_silver}>
            Place directly above the overriding method
          </text>
        </g>

        <g opacity={concept2.opacity} transform={`translate(60, ${600 + concept2.translateY})`}>
          <line x1={0} y1={0} x2={0} y2={48}
            stroke={COLORS.sky_blue} strokeWidth={4}
            strokeDasharray={barLen} strokeDashoffset={bar2Dash}
            strokeLinecap="round" />
          <text x={20} y={18} fontFamily="'Inter', sans-serif" fontSize={28}
            fontWeight={700} fill={COLORS.deep_black}>
            Compile-time verification
          </text>
          <text x={20} y={46} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.cool_silver}>
            Typos become compile errors, not silent runtime bugs
          </text>
        </g>

        <g opacity={concept3.opacity} transform={`translate(60, ${680 + concept3.translateY})`}>
          <line x1={0} y1={0} x2={0} y2={48}
            stroke={COLORS.green} strokeWidth={4}
            strokeDasharray={barLen} strokeDashoffset={bar3Dash}
            strokeLinecap="round" />
          <text x={20} y={18} fontFamily="'Inter', sans-serif" fontSize={28}
            fontWeight={700} fill={COLORS.deep_black}>
            Safety, not behavior
          </text>
          <text x={20} y={46} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.cool_silver}>
            @Override doesn't change logic — it protects your intent
          </text>
        </g>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <line x1={60} y1={780} x2={1020} y2={780}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.12}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDash}
          strokeLinecap="round" />

        {/* ── Tomorrow section ─────────────────────────────────────────────── */}
        <g opacity={tomorrowLabel.opacity} transform={`translate(0, ${tomorrowLabel.translateY})`}>
          <text x={60} y={840} fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.15em">
            TOMORROW
          </text>
        </g>

        <g opacity={tomorrowDay.opacity} transform={`translate(60, ${870 + tomorrowDay.translateY})`}>
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill="none" stroke={COLORS.orange} strokeWidth={1.5}
            strokeDasharray={tCardPerim} strokeDashoffset={tCardBorder} />
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill={COLORS.orange} fillOpacity={0.03} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.orange} />
        </g>

        <g opacity={tomorrowTopic.opacity} transform={`translate(0, ${tomorrowTopic.translateY})`}>
          <text x={90} y={920} fontFamily="'Inter', sans-serif"
            fontSize={44} fontWeight={800} fill={COLORS.orange}>
            Day {nextDay}
          </text>
          <text x={90} y={968} fontFamily="'Inter', sans-serif"
            fontSize={32} fontWeight={500} fill={COLORS.deep_black}>
            {nextTopic}
          </text>
        </g>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <g opacity={ctaEntrance.opacity} transform={`translate(540, ${1060 + ctaEntrance.translateY + breathe})`}>
          <text textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={600} fill={COLORS.deep_black} opacity={shimmer}>
            Follow for Day {nextDay}
          </text>
          {/* Arrow */}
          <line x1={-12} y1={30} x2={0} y2={42}
            stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={ctaArrowLen} strokeDashoffset={ctaArrowDash}
            strokeLinecap="round" />
          <line x1={0} y1={42} x2={12} y2={30}
            stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={ctaArrowLen} strokeDashoffset={ctaArrowDash}
            strokeLinecap="round" />
        </g>

        {/* ── Series footer ───────────────────────────────────────────────── */}
        <g opacity={footerEntrance.opacity} transform={`translate(0, ${footerEntrance.translateY})`}>
          <text x={540} y={1160} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}
            letterSpacing="0.18em" opacity={0.5}>
            {seriesTitle}
          </text>
        </g>

        {/* ── Phase 3 deco ────────────────────────────────────────────────── */}
        <g transform={`translate(100, ${300 + breathe})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={6} fill="none" stroke={COLORS.orange} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(980, ${800 + breathe * -1})`} opacity={0.03 * shimmer}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.sky_blue} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

      </svg>
    </AbsoluteFill>
  );
};
