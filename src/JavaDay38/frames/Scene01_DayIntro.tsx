/**
 * Scene 01 — Day Intro
 * "This is day 38 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 6.760s
 * Duration: 203 frames (6.77s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — day badge springs in, series label slides
 *   Phase 2 (frames 20–90):  Core content builds — headline + locomotive illustration
 *   Phase 3 (frames 80–end): Steady-state micro-animations — wheel spin, smoke float
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
  const fps = FPS;

  // ── Phase 1: Scene reveal (frames 0–30) ────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const badgeEntrance = useSpringEntrance(frame, 6);
  const headlineA     = useSpringEntrance(frame, 12);
  const headlineB     = useSpringEntrance(frame, 18);

  // ── Phase 2: Content build (frames 20–90) ─────────────────────────────────
  const locoCard      = useSpringEntrance(frame, 24);
  const trackCard     = useSpringEntrance(frame, 36);
  const infoCard      = useSpringEntrance(frame, 48);

  // Track path draw
  const trackLength = 900;
  const trackDash   = usePathDraw(frame, 40, trackLength, 35);

  // ── Phase 3: Micro-animations (frames 80–end) ─────────────────────────────
  const wheelSpin  = frame * 3;
  const smokeFloat = Math.sin(frame * 0.05) * 6;
  const breathe    = Math.sin(frame * 0.06) * 3;
  const pulse      = 1 + Math.sin(frame * 0.08) * 0.015;

  // Day counter animation
  const dayNum = Math.round(interpolate(frame, [10, 50], [0, 38], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series label ──────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="NATIONAL RAILWAY · JAVA" y={160} opacity={0.8} />
        </g>

        {/* ── Day Badge — large animated counter ─────────────────────────── */}
        <g transform={`translate(0, ${badgeEntrance.translateY})`} opacity={badgeEntrance.opacity}>
          <text
            x={60} y={300}
            fontFamily={FONT}
            fontSize={48} fontWeight={800}
            fill={COLORS.accent}
            letterSpacing="0.05em"
          >
            DAY
          </text>
          <text
            x={210} y={300}
            fontFamily={FONT}
            fontSize={48} fontWeight={800}
            fill={COLORS.white}
          >
            {dayNum}
          </text>
          <text
            x={310} y={300}
            fontFamily={FONT}
            fontSize={48} fontWeight={800}
            fill={COLORS.text_muted}
          >
            / 105
          </text>
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={430}
            fontFamily={FONT}
            fontSize={88} fontWeight={800}
            fill={COLORS.white}
          >
            Static Variable
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={510}
            fontFamily={FONT}
            fontSize={44} fontWeight={800}
            fill={COLORS.accent}
            fontStyle="italic"
          >
            First Principles
          </text>
        </g>

        {/* ── ZONE C — Locomotive Illustration ───────────────────────────── */}
        <g opacity={locoCard.opacity} transform={`translate(0, ${locoCard.translateY})`}>
          <BentoCard x={60} y={580} w={960} h={520} accent />

          {/* Locomotive body */}
          <rect x={160} y={700} width={500} height={200} rx={12}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />

          {/* Cab */}
          <rect x={520} y={650} width={140} height={250} rx={8}
            fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={2} />

          {/* Window */}
          <rect x={545} y={675} width={90} height={60} rx={6}
            fill={COLORS.bg_primary}
            stroke={COLORS.accent} strokeWidth={1.5} />

          {/* Smokestack */}
          <rect x={200} y={660} width={50} height={40} rx={4}
            fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={1.5} />

          {/* Smoke puffs — animated float */}
          <circle cx={225} cy={640 + smokeFloat} r={20}
            fill={COLORS.accent} fillOpacity={0.08} />
          <circle cx={250} cy={620 + smokeFloat * 1.3} r={28}
            fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={210} cy={600 + smokeFloat * 1.6} r={16}
            fill={COLORS.accent} fillOpacity={0.04} />

          {/* Boiler detail lines */}
          <line x1={180} y1={750} x2={500} y2={750}
            stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.3} />
          <line x1={180} y1={800} x2={500} y2={800}
            stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.3} />
          <line x1={180} y1={850} x2={500} y2={850}
            stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.3} />

          {/* Wheels — animated rotation */}
          <g transform={`translate(250, 920)`}>
            <circle cx={0} cy={0} r={40} fill="none"
              stroke={COLORS.accent} strokeWidth={3} />
            <line x1={-28} y1={0} x2={28} y2={0}
              stroke={COLORS.accent} strokeWidth={2}
              transform={`rotate(${wheelSpin})`} style={{ transformOrigin: '0 0' }} />
            <line x1={0} y1={-28} x2={0} y2={28}
              stroke={COLORS.accent} strokeWidth={2}
              transform={`rotate(${wheelSpin})`} style={{ transformOrigin: '0 0' }} />
            <circle cx={0} cy={0} r={10} fill={COLORS.accent} fillOpacity={0.4} />
          </g>

          <g transform={`translate(420, 920)`}>
            <circle cx={0} cy={0} r={40} fill="none"
              stroke={COLORS.accent} strokeWidth={3} />
            <line x1={-28} y1={0} x2={28} y2={0}
              stroke={COLORS.accent} strokeWidth={2}
              transform={`rotate(${wheelSpin})`} style={{ transformOrigin: '0 0' }} />
            <line x1={0} y1={-28} x2={0} y2={28}
              stroke={COLORS.accent} strokeWidth={2}
              transform={`rotate(${wheelSpin})`} style={{ transformOrigin: '0 0' }} />
            <circle cx={0} cy={0} r={10} fill={COLORS.accent} fillOpacity={0.4} />
          </g>

          <g transform={`translate(590, 920)`}>
            <circle cx={0} cy={0} r={32} fill="none"
              stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={0} cy={0} r={8} fill={COLORS.accent} fillOpacity={0.4} />
          </g>

          {/* Cowcatcher */}
          <polygon points="130,900 160,860 160,940"
            fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={1.5} />

          {/* Label */}
          <text x={300} y={1060} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            LOCOMOTIVE CLASS
          </text>
        </g>

        {/* ── Track Illustration — path draw ─────────────────────────────── */}
        <g opacity={trackCard.opacity} transform={`translate(0, ${trackCard.translateY})`}>
          <BentoCard x={60} y={1130} w={960} h={200} />

          {/* Rails — path draw */}
          <line x1={100} y1={1210} x2={1000} y2={1210}
            stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={trackLength} strokeDashoffset={trackDash}
            strokeLinecap="round" />
          <line x1={100} y1={1250} x2={1000} y2={1250}
            stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={trackLength} strokeDashoffset={trackDash}
            strokeLinecap="round" />

          {/* Cross-ties */}
          {Array.from({ length: 12 }, (_, i) => {
            const tx = 120 + i * 72;
            const tieOpacity = interpolate(frame, [45 + i * 2, 50 + i * 2], [0, 0.6], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <rect key={i} x={tx} y={1200} width={8} height={60} rx={2}
                fill={COLORS.text_muted} opacity={tieOpacity} />
            );
          })}

          <text x={540} y={1300} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            NETWORK EXPANSION · MODULE 2
          </text>
        </g>

        {/* ── Info tile ──────────────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={300} />

          {/* Progress indicator — animated */}
          <rect x={100} y={1400} width={880} height={8} rx={4}
            fill="rgba(255,255,255,0.08)" />
          <rect x={100} y={1400}
            width={interpolate(frame, [50, 90], [0, 880 * (38 / 105)], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            })}
            height={8} rx={4}
            fill={COLORS.accent} opacity={0.9} />

          {/* Stats row */}
          <text x={100} y={1470}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Part {dayNum}
          </text>
          <text x={320} y={1470}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            of 105
          </text>

          {/* Module info */}
          <text x={100} y={1540}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            Module 2
          </text>
          <text x={300} y={1540}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            Network Expansion
          </text>

          {/* Topic */}
          <text x={100} y={1610}
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}
            fontStyle="italic">
            Static Variable
          </text>
        </g>

        {/* ── Floating accent dot — micro-animation ──────────────────────── */}
        <g transform={`translate(980, ${1720 + breathe})`}>
          <circle cx={0} cy={0} r={16}
            fill={COLORS.accent} fillOpacity={0.08} />
          <circle cx={0} cy={0} r={16}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
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
