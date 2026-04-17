/**
 * Scene 01 — Day Intro
 * "This is day 41 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 5.940s
 * Duration: 193 frames (6.43s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — day badge springs in, headline per-word spring
 *   Phase 2 (frames 20–90):  Locomotive illustration builds with path-draw, bento cards stagger
 *   Phase 3 (frames 80–end): Steady-state micro-animations — wheel rotation, smoke float, pulse
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

// ─── Spring configs ──────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (frames 0–30) ────────────────────────────────────
  const badgeEntrance = useSpringEntrance(frame, 0);
  const seriesLabel = useSpringEntrance(frame, 4);

  // Per-word headline springs
  const headlineWords = ['DAY', '41'];
  const wordSprings = headlineWords.map((_, i) => {
    const f = Math.max(0, frame - 8 - i * 6);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [40, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const subtitleEntrance = useSpringEntrance(frame, 18);

  // ── Phase 2: Content build (frames 20–90) ──────────────────────────────────
  const locoCard = useSpringEntrance(frame, 24);
  const trackDraw = usePathDraw(frame, 30, 800, 40);
  const bodyDraw = usePathDraw(frame, 35, 600, 35);
  const infoCard1 = useSpringEntrance(frame, 48);
  const infoCard2 = useSpringEntrance(frame, 60);
  const infoCard3 = useSpringEntrance(frame, 72);

  // Card border draw
  const cardPerimeter = 2 * (960 + 280);
  const cardBorderDash = interpolate(frame, [24, 54], [cardPerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations (frames 80+) ────────────────────────────────
  const wheelRotation = frame * 3;
  const smokeFloat = Math.sin(frame * 0.05) * 8;
  const smokeDrift = Math.cos(frame * 0.03) * 5;
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series label ────────────────────────────────────── */}
        <g transform={`translate(0, ${seriesLabel.translateY})`} opacity={seriesLabel.opacity}>
          <text
            x={60} y={160}
            fontFamily={FONT}
            fontSize={28} fontWeight={800}
            fill={COLORS.accent}
            letterSpacing="0.15em"
            opacity={0.8}
          >
            NATIONAL RAILWAY · JAVA
          </text>
        </g>

        {/* ── ZONE B — Day badge + headline ────────────────────────────── */}
        {/* DAY 41 large display */}
        <g transform={`translate(0, ${badgeEntrance.translateY})`} opacity={badgeEntrance.opacity}>
          {/* Ghost number behind */}
          <text
            x={540} y={380}
            textAnchor="middle"
            fontFamily={FONT} fontSize={220} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}
          >
            41
          </text>
        </g>

        {headlineWords.map((word, i) => (
          <text
            key={word}
            x={i === 0 ? 320 : 520}
            y={360}
            fontFamily={FONT}
            fontSize={i === 0 ? 80 : 140}
            fontWeight={800}
            fill={i === 0 ? COLORS.text_muted : COLORS.accent}
            opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}
          >
            {word}
          </text>
        ))}

        {/* Subtitle */}
        <g transform={`translate(0, ${subtitleEntrance.translateY})`} opacity={subtitleEntrance.opacity}>
          <text
            x={540} y={440}
            textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}
          >
            Instance vs Static Variables
          </text>
          <text
            x={540} y={490}
            textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}
          >
            National Railway System · Java First Principles
          </text>
        </g>

        {/* ── ZONE C — Locomotive illustration + info cards ─────────────── */}

        {/* Main locomotive bento card */}
        <g opacity={locoCard.opacity} transform={`translate(0, ${locoCard.translateY})`}>
          {/* Animated border draw */}
          <rect
            x={60} y={540} width={960} height={280} rx={20}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={2}
            strokeDasharray={cardPerimeter}
            strokeDashoffset={cardBorderDash}
          />
          <BentoCard x={60} y={540} w={960} h={280} accent={false} />

          {/* Track lines */}
          <line
            x1={100} y1={780} x2={980} y2={780}
            stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={800}
            strokeDashoffset={trackDraw}
            strokeLinecap="round"
          />
          <line
            x1={100} y1={794} x2={980} y2={794}
            stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={800}
            strokeDashoffset={trackDraw}
            strokeLinecap="round"
          />

          {/* Cross ties */}
          {Array.from({ length: 14 }, (_, i) => {
            const tieX = 120 + i * 62;
            const tieOp = interpolate(frame, [35 + i * 2, 40 + i * 2], [0, 0.5], { extrapolateRight: 'clamp' });
            return (
              <rect key={i} x={tieX} y={774} width={8} height={26} rx={2}
                fill={COLORS.text_muted} opacity={tieOp} />
            );
          })}

          {/* Locomotive body */}
          <g transform={`translate(280, 600)`}>
            {/* Main body */}
            <rect x={0} y={40} width={400} height={120} rx={12}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={600} strokeDashoffset={bodyDraw}
            />
            <rect x={0} y={40} width={400} height={120} rx={12}
              fill={COLORS.accent} fillOpacity={0.08}
            />

            {/* Cab */}
            <rect x={320} y={10} width={80} height={150} rx={8}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1.5}
            />

            {/* Smokestack */}
            <rect x={60} y={20} width={30} height={40} rx={4}
              fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={1.5}
            />

            {/* Smoke puffs */}
            <circle cx={75 + smokeDrift} cy={-10 + smokeFloat} r={18}
              fill={COLORS.white} fillOpacity={0.06 * shimmer} />
            <circle cx={55 + smokeDrift * 0.7} cy={-30 + smokeFloat * 1.3} r={14}
              fill={COLORS.white} fillOpacity={0.04 * shimmer} />
            <circle cx={85 + smokeDrift * 1.2} cy={-50 + smokeFloat * 0.8} r={10}
              fill={COLORS.white} fillOpacity={0.03 * shimmer} />

            {/* Wheels */}
            <g transform={`translate(80, 160)`}>
              <circle cx={0} cy={0} r={24}
                fill="none" stroke={COLORS.accent} strokeWidth={2} />
              <line x1={-16} y1={0} x2={16} y2={0}
                stroke={COLORS.accent} strokeWidth={1.5}
                transform={`rotate(${wheelRotation})`}
                style={{ transformOrigin: '0px 0px' }}
              />
              <circle cx={0} cy={0} r={6} fill={COLORS.accent} fillOpacity={0.3} />
            </g>
            <g transform={`translate(200, 160)`}>
              <circle cx={0} cy={0} r={24}
                fill="none" stroke={COLORS.accent} strokeWidth={2} />
              <line x1={-16} y1={0} x2={16} y2={0}
                stroke={COLORS.accent} strokeWidth={1.5}
                transform={`rotate(${wheelRotation})`}
                style={{ transformOrigin: '0px 0px' }}
              />
              <circle cx={0} cy={0} r={6} fill={COLORS.accent} fillOpacity={0.3} />
            </g>
            <g transform={`translate(320, 160)`}>
              <circle cx={0} cy={0} r={24}
                fill="none" stroke={COLORS.accent} strokeWidth={2} />
              <line x1={-16} y1={0} x2={16} y2={0}
                stroke={COLORS.accent} strokeWidth={1.5}
                transform={`rotate(${wheelRotation})`}
                style={{ transformOrigin: '0px 0px' }}
              />
              <circle cx={0} cy={0} r={6} fill={COLORS.accent} fillOpacity={0.3} />
            </g>

            {/* Train label */}
            <text x={200} y={115} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white} opacity={0.9}
            >
              JAVA EXPRESS
            </text>
          </g>
        </g>

        {/* Info cards row — 3 cards */}
        <g opacity={infoCard1.opacity} transform={`translate(0, ${infoCard1.translateY})`}>
          <BentoCard x={60} y={860} w={290} h={200} accent />
          <text x={205} y={940} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent}
          >
            41
          </text>
          <text x={205} y={990} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}
          >
            DAYS
          </text>
        </g>

        <g opacity={infoCard2.opacity} transform={`translate(0, ${infoCard2.translateY})`}>
          <BentoCard x={390} y={860} w={290} h={200} />
          <text x={535} y={940} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}
          >
            INSTANCE
          </text>
          <text x={535} y={990} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}
          >
            vs STATIC
          </text>
        </g>

        <g opacity={infoCard3.opacity} transform={`translate(0, ${infoCard3.translateY})`}>
          <BentoCard x={720} y={860} w={300} h={200} />
          <text x={870} y={940} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}
          >
            FIRST
          </text>
          <text x={870} y={990} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}
          >
            PRINCIPLES
          </text>
        </g>

        {/* Bottom floating accent orbs */}
        <g transform={`translate(200, ${1200 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(880, ${1300 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={32} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={32} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
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
