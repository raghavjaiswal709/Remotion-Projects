/**
 * Scene 20 — Outro
 * Day 27 recap + Day 28 "What Is Tool Calling?" preview
 * Duration: 362 frames (~12.1s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–40):   "DAY 27 COMPLETE" badge springs in, progress bar animates
 *   Phase 2 (frames 30–160): Today's 3 key concepts build in staggered bento cards
 *   Phase 3 (frames 150–260): "TOMORROW" preview card with Day 28 teaser animates in
 *   Phase 4 (frames 240–end): Follow CTA arrow bounces, steady-state micro-animations
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
import { DarkBackground, GlobalDefs, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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

export const Scene20_Outro: React.FC<OutroProps> = ({
  currentDay,
  nextDay,
  nextTopic,
  seriesTitle,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const totalDays = 120;

  // ── Phase 1: Badge + progress bar ──────────────────────────────────────────
  const badgeEnt = useSpringEntrance(frame, 0);
  const progressPop = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING_SNAP });
  const progressWidth = interpolate(progressPop, [0, 1], [0, (currentDay / totalDays) * 960]);
  const titleEnt = useSpringEntrance(frame, 8);
  const subtitleEnt = useSpringEntrance(frame, 16);

  // ── Phase 2: Today's key concepts ──────────────────────────────────────────
  const todayLabel = useSpringEntrance(frame, 30);
  const concept1 = useSpringEntrance(frame, 40);
  const concept2 = useSpringEntrance(frame, 52);
  const concept3 = useSpringEntrance(frame, 64);

  // Connector lines between concept cards
  const connLen = 60;
  const conn1Off = usePathDraw(frame, 50, connLen, 12);
  const conn2Off = usePathDraw(frame, 62, connLen, 12);

  // ── Phase 3: Tomorrow preview ──────────────────────────────────────────────
  const tomorrowLabel = useSpringEntrance(frame, 150);
  const tomorrowCard = useSpringEntrance(frame, 162);
  const tomorrowDesc = useSpringEntrance(frame, 174);

  // Tomorrow card border draw
  const tmrwPerimeter = 2 * (960 + 180);
  const tmrwBorderOff = usePathDraw(frame, 162, tmrwPerimeter, 25);

  // ── Phase 4: CTA + micro-animations ────────────────────────────────────────
  const ctaEnt = useSpringEntrance(frame, 240);
  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Arrow bounce for CTA
  const arrowBounce = Math.sin(frame * 0.12) * 6;

  // Accent ring around Day number
  const ringCircum = 2 * Math.PI * 56;
  const ringOffset = usePathDraw(frame, 4, ringCircum, 20);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── DAY COMPLETE BADGE ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${badgeEnt.translateY})`} opacity={badgeEnt.opacity}>
          {/* Day number with ring */}
          <circle cx={540} cy={140} r={56}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={ringCircum} strokeDashoffset={ringOffset}
            opacity={0.3} />
          <text x={540} y={155} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            {currentDay}
          </text>
          <text x={540} y={228} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}
            letterSpacing="0.15em">
            DAY COMPLETE
          </text>
        </g>

        {/* Progress bar */}
        <g opacity={badgeEnt.opacity}>
          <rect x={60} y={258} width={960} height={6} rx={3} fill="rgba(255,255,255,0.08)" />
          <rect x={60} y={258} width={progressWidth} height={6} rx={3}
            fill={COLORS.accent} opacity={0.9} />
          <text x={1020} y={290} textAnchor="end"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            {currentDay} / {totalDays}
          </text>
        </g>

        {/* ── Title ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${titleEnt.translateY})`} opacity={titleEnt.opacity}>
          <text x={540} y={370} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            What Is a Tool?
          </text>
        </g>
        <g transform={`translate(0, ${subtitleEnt.translateY})`} opacity={subtitleEnt.opacity}>
          <text x={540} y={430} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}
            letterSpacing="0.12em">
            {seriesTitle}
          </text>
        </g>

        {/* ── TODAY'S KEY CONCEPTS ────────────────────────────────────────── */}
        <g transform={`translate(0, ${todayLabel.translateY})`} opacity={todayLabel.opacity}>
          <text x={60} y={510} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em">
            TODAY'S KEY CONCEPTS
          </text>
          <line x1={60} y1={528} x2={350} y2={528}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
        </g>

        {/* Concept 1: Tool Definition */}
        <g opacity={concept1.opacity} transform={`translate(0, ${concept1.translateY})`}>
          <BentoCard x={60} y={552} w={960} h={120} accent />
          <rect x={60} y={552} width={6} height={120} rx={3} fill={COLORS.accent} />
          {/* Wrench icon */}
          <g transform="translate(110, 612)">
            <path d="M -10,-12 L 0,0 L 10,-12 M 0,0 L 0,14"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          </g>
          <text x={150} y={605} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            A tool is a
          </text>
          <text x={420} y={605} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            named, callable function
          </text>
          <text x={150} y={645} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Name + description + parameters + return type
          </text>
        </g>

        {/* Connector 1→2 */}
        <line x1={540} y1={682} x2={540} y2={710}
          stroke={COLORS.accent} strokeWidth={1.5}
          strokeDasharray={connLen} strokeDashoffset={conn1Off}
          opacity={0.3} />

        {/* Concept 2: Separation of reasoning & execution */}
        <g opacity={concept2.opacity} transform={`translate(0, ${concept2.translateY})`}>
          <BentoCard x={60} y={720} w={960} h={120} accent />
          <rect x={60} y={720} width={6} height={120} rx={3} fill={COLORS.accent} />
          {/* Split icon */}
          <g transform="translate(110, 780)">
            <rect x={-14} y={-10} width={12} height={20} rx={3}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <rect x={2} y={-10} width={12} height={20} rx={3}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
          </g>
          <text x={150} y={773} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Model
          </text>
          <text x={275} y={773} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            decides,
          </text>
          <text x={450} y={773} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            tool
          </text>
          <text x={530} y={773} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            executes
          </text>
          <text x={150} y={813} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            The model never directly touches the real world
          </text>
        </g>

        {/* Connector 2→3 */}
        <line x1={540} y1={850} x2={540} y2={878}
          stroke={COLORS.accent} strokeWidth={1.5}
          strokeDasharray={connLen} strokeDashoffset={conn2Off}
          opacity={0.3} />

        {/* Concept 3: Tools extend capabilities */}
        <g opacity={concept3.opacity} transform={`translate(0, ${concept3.translateY})`}>
          <BentoCard x={60} y={888} w={960} h={120} accent />
          <rect x={60} y={888} width={6} height={120} rx={3} fill={COLORS.accent} />
          {/* Star/expand icon */}
          <g transform="translate(110, 948)">
            {[0, 72, 144, 216, 288].map((a, i) => {
              const r = (a * Math.PI) / 180;
              return (
                <line key={i}
                  x1={Math.cos(r) * 4} y1={Math.sin(r) * 4}
                  x2={Math.cos(r) * 14} y2={Math.sin(r) * 14}
                  stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
              );
            })}
          </g>
          <text x={150} y={941} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Tools are the
          </text>
          <text x={458} y={941} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            agent's hands
          </text>
          <text x={150} y={981} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Search, code, browse, email, file — real-world capabilities
          </text>
        </g>

        {/* ── TOMORROW PREVIEW ────────────────────────────────────────────── */}
        <g transform={`translate(0, ${tomorrowLabel.translateY})`} opacity={tomorrowLabel.opacity}>
          <text x={60} y={1090} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em">
            TOMORROW
          </text>
          <line x1={60} y1={1108} x2={230} y2={1108}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
        </g>

        {/* Tomorrow card with border draw */}
        <g opacity={tomorrowCard.opacity} transform={`translate(0, ${tomorrowCard.translateY})`}>
          <rect x={60} y={1128} width={960} height={180} rx={20}
            fill={COLORS.bg_secondary}
            stroke="none" />
          <rect x={60} y={1128} width={960} height={180} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={tmrwPerimeter} strokeDashoffset={tmrwBorderOff} />

          {/* Day number badge */}
          <rect x={90} y={1148} width={80} height={44} rx={10}
            fill={COLORS.accent} fillOpacity={0.12} />
          <text x={130} y={1178} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            {nextDay}
          </text>

          {/* Tomorrow topic title */}
          <text x={200} y={1182} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            {nextTopic}
          </text>

          {/* Preview description */}
          <text x={90} y={1240} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            The model generates a structured specification
          </text>
          <text x={90} y={1275} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            of which tool to call and with what arguments.
          </text>
        </g>

        {/* Tomorrow arrow icon */}
        <g opacity={tomorrowDesc.opacity} transform={`translate(0, ${tomorrowDesc.translateY})`}>
          <g transform={`translate(540, ${1380 + breathe})`}>
            <circle cx={0} cy={0} r={24}
              fill={COLORS.accent} fillOpacity={0.08}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
            <path d="M -8,-6 L 2,0 L -8,6" fill="none"
              stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round"
              strokeLinejoin="round" />
          </g>
        </g>

        {/* ── FOLLOW CTA ─────────────────────────────────────────────────── */}
        <g opacity={ctaEnt.opacity} transform={`translate(0, ${ctaEnt.translateY})`}>
          <BentoCard x={160} y={1460} w={760} h={100} />

          <text x={540} y={1520} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Follow for Day {nextDay}
          </text>

          {/* Animated arrow */}
          <g transform={`translate(860, ${1510 + arrowBounce})`}>
            <path d="M 0,-8 L 0,8 M -5,3 L 0,8 L 5,3"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          </g>
        </g>

        {/* ── Series branding ────────────────────────────────────────────── */}
        <g opacity={ctaEnt.opacity * 0.6}>
          <text x={540} y={1620} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.18em">
            {seriesTitle}
          </text>
          <text x={540} y={1660} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5} letterSpacing="0.1em">
            120-PART SERIES
          </text>
        </g>

        {/* Decorative accent dots */}
        <g opacity={shimmer * 0.15}>
          <circle cx={200} cy={1700 + breathe * 0.5} r={3} fill={COLORS.accent} />
          <circle cx={880} cy={1710 + breathe * 0.7} r={2} fill={COLORS.accent} />
          <circle cx={540} cy={1720} r={2} fill={COLORS.accent} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
