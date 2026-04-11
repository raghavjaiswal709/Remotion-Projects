/**
 * Scene 18 — Outro
 * Day 34 recap + Day 35 "final variable" preview
 * Duration: 362 frames (12.07s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–40):   Day number, title, recap bar spring in
 *   Phase 2 (frames 30–180): Today's 3 highlights, divider, tomorrow teaser
 *   Phase 3 (frames 160–end): CTA, floating, fade-out at end
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

// ─── Spring configs ──────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene18_Outro: React.FC<Props> = ({
  currentDay,
  nextDay,
  nextTopic,
  seriesTitle,
}) => {
  const frame = useCurrentFrame();

  // ── Phase 1: Opening spring cascade ────────────────────────────────────────
  const labelEntrance   = useSpringEntrance(frame, 0);
  const dayNumber       = useSpringEntrance(frame, 6);
  const titleLine       = useSpringEntrance(frame, 14);
  const subtitleLine    = useSpringEntrance(frame, 20);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const recapLabel      = useSpringEntrance(frame, 30);
  const highlight1      = useSpringEntrance(frame, 40);
  const highlight2      = useSpringEntrance(frame, 50);
  const highlight3      = useSpringEntrance(frame, 60);
  const dividerEnt      = useSpringEntrance(frame, 72);
  const tomorrowLabel   = useSpringEntrance(frame, 80);
  const tomorrowTopic   = useSpringEntrance(frame, 90);
  const tomorrowDesc    = useSpringEntrance(frame, 100);
  const ctaCard         = useSpringEntrance(frame, 120);
  const ctaArrow        = useSpringEntrance(frame, 130);

  // ── Path draws ────────────────────────────────────────────────────────────
  const dividerLen = 960;
  const dividerDash = usePathDraw(frame, 72, dividerLen, 22);
  const arrowPathLen = 80;
  const arrowDash = usePathDraw(frame, 130, arrowPathLen, 15);
  const recapBarLen = 2 * (960 + 48);
  const recapBarDash = interpolate(frame, [30, 56], [recapBarLen, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const tomorrowPerimeter = 2 * (960 + 200);
  const tomorrowBorderDash = interpolate(frame, [80, 108], [tomorrowPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe    = Math.sin(frame * 0.06) * 4;
  const pulse      = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer    = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // ── Outro fade-out (last 40 frames) ────────────────────────────────────────
  const outroFade = interpolate(frame, [322, 362], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg
        style={{ position: 'absolute', inset: 0, opacity: outroFade }}
        width={1080} height={1920}
      >
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series title ──────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text={seriesTitle} y={120} opacity={0.5} />
        </g>

        {/* ── Day number ─────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${dayNumber.translateY})`} opacity={dayNumber.opacity}>
          <text x={540} y={260} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={120} fontWeight={900}
            fill={COLORS.orange} opacity={0.12}>
            {currentDay}
          </text>
          <text x={540} y={250} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={96} fontWeight={900}
            fill={COLORS.deep_black}>
            Day {currentDay}
          </text>
        </g>

        {/* ── Title ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${titleLine.translateY})`} opacity={titleLine.opacity}>
          <text x={540} y={340} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={48} fontWeight={700}
            fill={COLORS.orange}>
            Covariant Return Type
          </text>
        </g>
        <g transform={`translate(0, ${subtitleLine.translateY})`} opacity={subtitleLine.opacity}>
          <text x={540} y={390} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}>
            Override methods can return more specific subtypes
          </text>
        </g>

        {/* ── Recap section ──────────────────────────────────────────────── */}
        <g opacity={recapLabel.opacity} transform={`translate(60, ${440 + recapLabel.translateY})`}>
          <rect x={0} y={0} width={960} height={48} rx={8}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1.5}
            strokeDasharray={recapBarLen}
            strokeDashoffset={recapBarDash} />
          <text x={480} y={32} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={COLORS.orange}>
            TODAY'S HIGHLIGHTS
          </text>
        </g>

        {/* ── 3 highlight cards ──────────────────────────────────────────── */}
        {[
          { text: 'Child can return a more specific subtype', icon: '01', color: COLORS.green, ent: highlight1 },
          { text: 'Subtype relationship makes it type-safe', icon: '02', color: COLORS.sky_blue, ent: highlight2 },
          { text: 'No casting required by the caller', icon: '03', color: COLORS.orange, ent: highlight3 },
        ].map((item, i) => (
          <g key={i} opacity={item.ent.opacity}
            transform={`translate(60, ${520 + i * 100 + item.ent.translateY})`}>
            <rect x={0} y={0} width={960} height={80} rx={10}
              fill={item.color} fillOpacity={0.04}
              stroke={item.color} strokeWidth={1.5} />
            <circle cx={44} cy={40} r={22} fill={item.color} fillOpacity={0.1}
              stroke={item.color} strokeWidth={2} />
            <text x={44} y={48} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={800}
              fill={item.color}>
              {item.icon}
            </text>
            <text x={84} y={48} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
              fill={COLORS.deep_black}>
              {item.text}
            </text>
          </g>
        ))}

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <g opacity={dividerEnt.opacity}>
          <line x1={60} y1={850} x2={1020} y2={850}
            stroke={COLORS.deep_black} strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={dividerLen}
            strokeDashoffset={dividerDash}
            opacity={0.12} />
        </g>

        {/* ── Tomorrow section ───────────────────────────────────────────── */}
        <g opacity={tomorrowLabel.opacity} transform={`translate(0, ${tomorrowLabel.translateY})`}>
          <text x={540} y={920} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500}
            fill={COLORS.cool_silver} letterSpacing="0.18em">
            TOMORROW
          </text>
        </g>

        <g opacity={tomorrowTopic.opacity}
          transform={`translate(60, ${950 + tomorrowTopic.translateY})`}>
          <rect x={0} y={0} width={960} height={200} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={2}
            strokeDasharray={tomorrowPerimeter}
            strokeDashoffset={tomorrowBorderDash} />
          <rect x={0} y={0} width={8} height={200} rx={4} fill={COLORS.sky_blue} />

          <text x={30} y={48} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={600}
            fill={COLORS.sky_blue}>
            DAY {nextDay}
          </text>
          <text x={30} y={96} fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={800}
            fill={COLORS.deep_black}>
            {nextTopic.charAt(0).toUpperCase() + nextTopic.slice(1)}
          </text>
        </g>

        <g opacity={tomorrowDesc.opacity}
          transform={`translate(90, ${1088 + tomorrowDesc.translateY})`}>
          <text x={0} y={0} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.cool_silver}>
            Continue your journey on the National Railway
          </text>
          <text x={0} y={34} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.cool_silver}>
            as we explore the next OOP concept.
          </text>
        </g>

        {/* ── CTA card ───────────────────────────────────────────────────── */}
        <g opacity={ctaCard.opacity}
          transform={`translate(60, ${1220 + ctaCard.translateY})`}>
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={2} />

          <text x={480} y={46} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={800}
            fill={COLORS.orange}>
            Follow for Day {nextDay}
          </text>
          <text x={480} y={86} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}>
            105 days of Java OOPs — one concept at a time
          </text>
        </g>

        {/* CTA Arrow */}
        <g opacity={ctaArrow.opacity}>
          <path d="M 540,1370 L 540,1420 M 520,1400 L 540,1420 L 560,1400"
            fill="none" stroke={COLORS.orange} strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={arrowPathLen}
            strokeDashoffset={arrowDash} />
        </g>

        {/* ── Progress bar ───────────────────────────────────────────────── */}
        <g opacity={ctaCard.opacity * 0.6}>
          <text x={60} y={1490} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
            fill={COLORS.cool_silver}>
            PROGRESS
          </text>
          <text x={1020} y={1490} textAnchor="end"
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
            fill={COLORS.orange}>
            {currentDay}/105
          </text>
          <rect x={60} y={1500} width={960} height={8} rx={4}
            fill={COLORS.deep_black} fillOpacity={0.06} />
          <rect x={60} y={1500}
            width={interpolate(frame, [120, 180], [0, 960 * (currentDay / 105)], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            })}
            height={8} rx={4} fill={COLORS.orange} />
        </g>

        {/* ── Series badge ───────────────────────────────────────────────── */}
        <g
          opacity={ctaCard.opacity * shimmer}
          transform={`translate(540, ${1570 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '540px 1570px' }}
        >
          <rect x={-140} y={-22} width={280} height={44} rx={22}
            fill={COLORS.orange} fillOpacity={0.1}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <text textAnchor="middle" y={6}
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
            fill={COLORS.orange}>
            NATIONAL RAILWAY JAVA
          </text>
        </g>

        {/* ── Track decoration ───────────────────────────────────────────── */}
        <g opacity={0.04}>
          <line x1={60} y1={1680} x2={1020} y2={1680} stroke={COLORS.deep_black} strokeWidth={2} />
          <line x1={60} y1={1688} x2={1020} y2={1688} stroke={COLORS.deep_black} strokeWidth={2} />
          {Array.from({ length: 20 }, (_, i) => (
            <line key={i} x1={80 + i * 48} y1={1676} x2={80 + i * 48} y2={1692}
              stroke={COLORS.deep_black} strokeWidth={3} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
