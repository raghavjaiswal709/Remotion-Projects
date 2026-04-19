/**
 * Scene 24 — TeaserNext
 * "And that is exactly what we cover next."
 * CSV: 72.060s → 73.860s
 * Duration: 54 frames (1.8s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–16):  Label + hero "Coming Next" reveal
 *   Phase 2 (frames 12–40): Day 45 preview card, arrow, topic title
 *   Phase 3 (frames 35–end): Pulse, shimmer, floating dots
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene24_TeaserNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const heroA = useSpringEntrance(frame, 3);
  const heroB = useSpringEntrance(frame, 6);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const dayBadge  = useSpringEntrance(frame, 10);
  const arrowCard = useSpringEntrance(frame, 14);
  const nextCard  = useSpringEntrance(frame, 18);
  const topicE    = useSpringEntrance(frame, 22);
  const recapE    = useSpringEntrance(frame, 26);
  const locoPrev  = useSpringEntrance(frame, 30);
  const summaryE  = useSpringEntrance(frame, 34);

  // Arrow path draw
  const arrowLen = 200;
  const arrowD   = usePathDraw(frame, 14, arrowLen, 14);

  // Track line draw
  const trackLen = 960;
  const trackD   = usePathDraw(frame, 20, trackLen, 22);

  // Border draw for next card
  const cardPerim = 2 * (880 + 260);
  const cardBdrD  = usePathDraw(frame, 18, cardPerim, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const locoX   = interpolate(frame, [30, 54], [0, 120], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s24.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            NEXT LESSON · PREVIEW
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.text_muted}>
            And That Is Exactly
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={410} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent}>
            What We Cover <tspan fontStyle="italic">Next</tspan>
          </text>
        </g>

        {/* ── Day 44 badge (current) ─────────────────────────────────────── */}
        <g opacity={dayBadge.opacity} transform={`translate(0, ${dayBadge.translateY})`}>
          <BentoCard x={120} y={520} w={360} h={100} />
          <rect x={120} y={520} width={6} height={100} rx={3}
            fill={COLORS.text_muted} />
          <text x={160} y={565}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            TODAY — DAY 44
          </text>
          <text x={160} y={600}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>
            Method Overloading
          </text>
        </g>

        {/* ── Forward arrow ──────────────────────────────────────────────── */}
        <g opacity={arrowCard.opacity}>
          <path d="M 500,570 L 580,570"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowD}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* ── Day 45 badge (next) ────────────────────────────────────────── */}
        <g opacity={arrowCard.opacity} transform={`translate(0, ${arrowCard.translateY})`}>
          <BentoCard x={600} y={520} w={360} h={100} accent />
          <rect x={600} y={520} width={6} height={100} rx={3}
            fill={COLORS.accent} />
          <text x={640} y={565}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            NEXT — DAY 45
          </text>
          <text x={640} y={600}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>
            Runtime Polymorphism
          </text>
        </g>

        {/* ── Preview card with border draw ──────────────────────────────── */}
        <g opacity={nextCard.opacity} transform={`translate(0, ${nextCard.translateY})`}>
          {/* Filled background */}
          <BentoCard x={100} y={680} w={880} h={260} />
          {/* Border draw */}
          <rect x={100} y={680} width={880} height={260} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={cardPerim} strokeDashoffset={cardBdrD} />
          {/* Topic title */}
          <text x={540} y={760} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Runtime Polymorphism
          </text>
          {/* Subtitle */}
          <text x={540} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            When the JVM decides which method to call
          </text>
          {/* Key concept bullets */}
          <text x={200} y={870}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            FareCalculator → ExpressFareCalculator
          </text>
          <text x={200} y={908}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            calculate() determined at runtime
          </text>
        </g>

        {/* ── Track line ─────────────────────────────────────────────────── */}
        <g opacity={topicE.opacity}>
          <line x1={60} y1={1000} x2={1020} y2={1000}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={trackLen} strokeDashoffset={trackD}
            strokeLinecap="round" opacity={0.5} />
          {/* Cross ties */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={120 + i * 75} y={993} width={20} height={14} rx={2}
              fill={COLORS.accent} fillOpacity={topicE.opacity * 0.2} />
          ))}
        </g>

        {/* ── Recap: what we learned today ───────────────────────────────── */}
        <g opacity={recapE.opacity} transform={`translate(0, ${recapE.translateY})`}>
          <text x={540} y={1078} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            TODAY WE LEARNED
          </text>
        </g>

        {/* ── Three recap tiles ──────────────────────────────────────────── */}
        <g opacity={recapE.opacity} transform={`translate(0, ${recapE.translateY})`}>
          {/* Tile 1 */}
          <BentoCard x={60} y={1110} w={300} h={130} />
          <text x={210} y={1165} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            Method
          </text>
          <text x={210} y={1200} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            Overloading
          </text>
          {/* Tile 2 */}
          <BentoCard x={390} y={1110} w={300} h={130} />
          <text x={540} y={1165} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            Same Name
          </text>
          <text x={540} y={1200} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            Diff Params
          </text>
          {/* Tile 3 */}
          <BentoCard x={720} y={1110} w={300} h={130} />
          <text x={870} y={1165} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.white}>
            Compile-Time
          </text>
          <text x={870} y={1200} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            Resolution
          </text>
        </g>

        {/* ── Locomotive preview ─────────────────────────────────────────── */}
        <g opacity={locoPrev.opacity}
          transform={`translate(${160 + locoX}, ${1310 + breathe})`}>
          {/* Body */}
          <rect x={0} y={0} width={200} height={80} rx={10}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Cab */}
          <rect x={140} y={-30} width={60} height={30} rx={6}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Smokestack */}
          <rect x={30} y={-20} width={20} height={20} rx={4}
            fill={COLORS.accent} fillOpacity={0.3} />
          {/* Wheels */}
          <circle cx={50} cy={85} r={16}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={150} cy={85} r={16}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Cowcatcher */}
          <polygon points="0,80 -20,80 0,40"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Window */}
          <rect x={150} y={-22} width={30} height={18} rx={3}
            fill={COLORS.accent} fillOpacity={0.12} />
          {/* EXPRESS label */}
          <text x={100} y={48} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent} opacity={0.8}>
            EXPRESS
          </text>
        </g>

        {/* ── Track under loco ───────────────────────────────────────────── */}
        <g opacity={locoPrev.opacity * 0.4}>
          <line x1={60} y1={1402} x2={1020} y2={1402}
            stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={60} y1={1414} x2={1020} y2={1414}
            stroke={COLORS.text_muted} strokeWidth={2} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={80 + i * 60} y={1404} width={24} height={8} rx={2}
              fill={COLORS.text_muted} fillOpacity={0.3} />
          ))}
        </g>

        {/* ── Summary card ───────────────────────────────────────────────── */}
        <g opacity={summaryE.opacity * shimmer} transform={`translate(0, ${summaryE.translateY})`}>
          <BentoCard x={100} y={1480} w={880} h={100} />
          <text x={540} y={1542} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>
            Tomorrow: the <tspan fill={COLORS.accent} fontStyle="italic">JVM</tspan> picks the method — not the compiler
          </text>
        </g>

        {/* ── CTA line ───────────────────────────────────────────────────── */}
        <g opacity={summaryE.opacity * 0.7}>
          <text x={540} y={1640} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} opacity={shimmer}>
            DAY 45 — RUNTIME POLYMORPHISM
          </text>
          {/* Forward chevron */}
          <path d="M 820,1630 L 840,1640 L 820,1650"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeLinecap="round" />
        </g>

        {/* ── Floating dots ──────────────────────────────────────────────── */}
        <g transform={`translate(80, ${1720 + breathe})`} opacity={0.06}>
          <circle cx={0} cy={0} r={4} fill={COLORS.accent} />
        </g>
        <g transform={`translate(1000, ${1710 + breathe * 0.7})`} opacity={0.05}>
          <circle cx={0} cy={0} r={5}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s24.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
