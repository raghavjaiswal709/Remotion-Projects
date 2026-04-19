/**
 * Scene 01 — Day Intro
 * "This is day 47 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 6.960s
 * Duration: ~209 frames
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Badge + day number spring in
 *   Phase 2 (frames 20–80):  Topic title + module label + railway illustration
 *   Phase 3 (frames 70–end): Micro-animations — pulse rings, floating tracks
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Badge + day number ────────────────────────────────────────────
  const badgeSpring = spring({ frame, fps, config: SPRING_SNAP });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  const dayNumEntrance = useSpringEntrance(frame, 8);
  const seriesLabel = useSpringEntrance(frame, 4);

  // ── Phase 2: Title + module + illustration ─────────────────────────────────
  const titleWords = ["Downcasting"];
  const titleSprings = titleWords.map((_, i) => {
    const f = Math.max(0, frame - 20 - i * 8);
    const sp = spring({ frame: f, fps, config: SPRING_CONFIG });
    const ty = interpolate(sp, [0, 1], [28, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const moduleCard = useSpringEntrance(frame, 30);
  const trainCard = useSpringEntrance(frame, 40);
  const trackDraw = usePathDraw(frame, 50, 860, 35);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const wheelRotation = frame * 2.5;

  // Connector path-draw
  const connectorLen = 300;
  const connectorDash = usePathDraw(frame, 55, connectorLen, 30);

  // Progress bar animation
  const progressW = interpolate(frame, [10, 60], [0, (47 / 105) * 860], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const caption = CAPTIONS[0];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series badge ─────────────────────────────────────── */}
        <g transform={`translate(0, ${seriesLabel.translateY})`} opacity={seriesLabel.opacity}>
          <SectionLabel text="NATIONAL RAILWAY · JAVA" y={100} opacity={0.8} />
        </g>

        {/* Day badge — large number */}
        <g
          transform={`translate(540, 260) scale(${badgeScale})`}
          opacity={badgeOpacity}
          style={{ transformOrigin: '540px 260px' }}
        >
          {/* Ghost behind number */}
          <text
            x={0} y={0}
            textAnchor="middle"
            fontFamily={FONT} fontSize={280} fontWeight={800}
            fill={COLORS.accent} opacity={0.08}
          >
            47
          </text>
          {/* Main number */}
          <text
            x={0} y={0}
            textAnchor="middle"
            fontFamily={FONT} fontSize={240} fontWeight={800}
            fill={COLORS.white}
          >
            47
          </text>
        </g>

        {/* "DAY" label above number */}
        <g transform={`translate(0, ${dayNumEntrance.translateY})`} opacity={dayNumEntrance.opacity}>
          <text
            x={540} y={130}
            textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em"
          >
            DAY
          </text>
        </g>

        {/* Progress bar — day 47/105 */}
        <g opacity={dayNumEntrance.opacity}>
          <rect x={110} y={380} width={860} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          <rect x={110} y={380} width={progressW} height={8} rx={4} fill={COLORS.accent} opacity={0.9} />
          <text
            x={110 + progressW + 12} y={392}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}
          >
            / 105
          </text>
        </g>

        {/* ── ZONE B — Topic title ──────────────────────────────────────── */}
        {titleWords.map((word, i) => (
          <g key={i} transform={`translate(0, ${titleSprings[i].ty})`} opacity={titleSprings[i].op}>
            <text
              x={540} y={500}
              textAnchor="middle"
              fontFamily={FONT} fontSize={96} fontWeight={800}
              fontStyle="italic"
              fill={COLORS.accent}
            >
              {word}
            </text>
          </g>
        ))}

        {/* Subtitle */}
        <g opacity={moduleCard.opacity} transform={`translate(0, ${moduleCard.translateY})`}>
          <text
            x={540} y={570}
            textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}
          >
            MODULE 3 — TICKETING ENGINE
          </text>
        </g>

        {/* ── ZONE C — Railway illustration (locomotive + tracks) ────────── */}
        {/* Full-width bento card wrapping the train */}
        <g opacity={trainCard.opacity} transform={`translate(0, ${trainCard.translateY})`}>
          <BentoCard x={60} y={640} w={960} h={520} accent />

          {/* Tracks — path-draw */}
          <line x1={100} y1={1080} x2={960} y2={1080}
            stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={860} strokeDashoffset={trackDraw}
            strokeLinecap="round" />
          <line x1={100} y1={1100} x2={960} y2={1100}
            stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={860} strokeDashoffset={trackDraw}
            strokeLinecap="round" />
          {/* Cross-ties */}
          {Array.from({ length: 14 }, (_, i) => {
            const tx = 120 + i * 60;
            const tieOpacity = interpolate(frame, [55 + i * 2, 65 + i * 2], [0, 0.5], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <rect key={i} x={tx} y={1074} width={8} height={32} rx={2}
                fill={COLORS.text_muted} opacity={tieOpacity} />
            );
          })}

          {/* Locomotive body */}
          <g transform={`translate(${interpolate(frame, [45, 90], [-200, 380], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          })}, 0)`}>
            {/* Main body */}
            <rect x={200} y={880} width={360} height={180} rx={12}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            {/* Cab */}
            <rect x={480} y={840} width={120} height={220} rx={8}
              fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={2} />
            {/* Cab window */}
            <rect x={500} y={860} width={80} height={60} rx={6}
              fill={COLORS.accent} fillOpacity={0.25}
              stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Smokestack */}
            <rect x={260} y={840} width={40} height={50} rx={4}
              fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Smoke puffs */}
            <circle cx={280} cy={820 + breathe} r={18}
              fill={COLORS.accent} fillOpacity={0.08 * shimmer} />
            <circle cx={300} cy={800 + breathe * 1.2} r={24}
              fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
            <circle cx={260} cy={790 + breathe * 0.8} r={14}
              fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
            {/* Wheels */}
            <g transform={`rotate(${wheelRotation}, 300, 1070)`}>
              <circle cx={300} cy={1070} r={28} fill="none"
                stroke={COLORS.accent} strokeWidth={3} />
              <line x1={300} y1={1042} x2={300} y2={1098}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <line x1={272} y1={1070} x2={328} y2={1070}
                stroke={COLORS.accent} strokeWidth={1.5} />
            </g>
            <g transform={`rotate(${wheelRotation}, 450, 1070)`}>
              <circle cx={450} cy={1070} r={28} fill="none"
                stroke={COLORS.accent} strokeWidth={3} />
              <line x1={450} y1={1042} x2={450} y2={1098}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <line x1={422} y1={1070} x2={478} y2={1070}
                stroke={COLORS.accent} strokeWidth={1.5} />
            </g>
            <g transform={`rotate(${wheelRotation}, 550, 1070)`}>
              <circle cx={550} cy={1070} r={22} fill="none"
                stroke={COLORS.accent} strokeWidth={2.5} />
              <line x1={550} y1={1048} x2={550} y2={1092}
                stroke={COLORS.accent} strokeWidth={1.5} />
            </g>
            {/* Cowcatcher front */}
            <polygon points="200,1060 170,1100 200,1100"
              fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Label */}
            <text x={380} y={985} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic">
              EXPRESS
            </text>
          </g>
        </g>

        {/* Connection arrow — downcast concept */}
        <path
          d="M 540,1180 C 540,1240 540,1260 540,1320"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={connectorLen} strokeDashoffset={connectorDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Bottom info cards — two columns */}
        <g opacity={moduleCard.opacity} transform={`translate(0, ${moduleCard.translateY})`}>
          <BentoCard x={60} y={1340} w={460} h={200} />
          <text x={100} y={1410} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            YESTERDAY
          </text>
          <text x={100} y={1460} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Upcasting
          </text>
          <text x={100} y={1510} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Child → Parent ref
          </text>
        </g>

        <g opacity={trainCard.opacity} transform={`translate(0, ${trainCard.translateY})`}>
          <BentoCard x={560} y={1340} w={460} h={200} accent />
          <text x={600} y={1410} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            TODAY
          </text>
          <text x={600} y={1460} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Downcasting
          </text>
          <text x={600} y={1510} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Parent → Child ref
          </text>
        </g>

        {/* Pulse ring around day number */}
        <circle cx={540} cy={230} r={160 * pulse} fill="none"
          stroke={COLORS.accent} strokeWidth={1.5}
          opacity={0.15 * shimmer} />
        <circle cx={540} cy={230} r={180 * pulse} fill="none"
          stroke={COLORS.accent} strokeWidth={1}
          opacity={0.08 * shimmer} />

        <CornerAccents opacity={moduleCard.opacity * 0.4} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s01.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
