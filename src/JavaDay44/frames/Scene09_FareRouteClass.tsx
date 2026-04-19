/**
 * Scene 09 — calculateFare(route, seatClass)
 * "calculateFare(route, seatClass)."
 * CSV: 32.160s → 33.900s
 * Duration: 69 frames (2.30s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–15): Label + headline spring entrance
 *   Phase 2 (frames 12–50): Hero method card, two-column seat comparison, param badge
 *   Phase 3 (frames 40–end): Pulse, shimmer, breathing micro-animations
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

export const Scene09_FareRouteClass: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 3);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const heroCard  = useSpringEntrance(frame, 6);
  const leftCard  = useSpringEntrance(frame, 12);
  const rightCard = useSpringEntrance(frame, 18);
  const bottomCard = useSpringEntrance(frame, 24);
  const paramBadge = useSpringEntrance(frame, 28);

  // ── Border draw ────────────────────────────────────────────────────────────
  const heroPerim = 2 * (960 + 180);
  const heroBorder = usePathDraw(frame, 5, heroPerim, 18);

  // ── Seat multiplier path ───────────────────────────────────────────────────
  const arrowPath = 160;
  const arrowDash = usePathDraw(frame, 22, arrowPath, 15);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glow    = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

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
            OVERLOAD VARIANT 2
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={540} y={320} textAnchor="middle"
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            calculateFare
          </text>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            (route, seatClass)
          </text>
        </g>

        {/* ── Hero method card ───────────────────────────────────────────── */}
        <g opacity={heroCard.opacity} transform={`translate(0, ${heroCard.translateY})`}>
          <rect x={60} y={490} width={960} height={180} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={heroPerim} strokeDashoffset={heroBorder} />
          <rect x={60} y={490} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={570}
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            Two Parameters
          </text>
          <text x={100} y={620}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            <tspan fill={COLORS.accent} fontStyle="italic">route</tspan>
            {' + '}
            <tspan fill={COLORS.accent} fontStyle="italic">seatClass</tspan>
            {' '}— class-adjusted pricing
          </text>
        </g>

        {/* ── Two-column seat comparison ──────────────────────────────────── */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={720} w={460} h={440} />
          {/* General class header */}
          <text x={290} y={790} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            GENERAL
          </text>
          {/* Seat grid 5×3 */}
          {Array.from({ length: 15 }, (_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const sx = 110 + col * 72;
            const sy = 830 + row * 80;
            const seatDelay = 14 + i * 0.6;
            const seatOp = interpolate(frame, [seatDelay, seatDelay + 8], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <g key={i} opacity={seatOp}>
                <rect x={sx} y={sy} width={52} height={52} rx={8}
                  fill={COLORS.bg_primary}
                  stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
                <rect x={sx + 14} y={sy + 6} width={24} height={28} rx={4}
                  fill="rgba(255,255,255,0.06)" />
              </g>
            );
          })}
          {/* Price multiplier */}
          <text x={290} y={1110} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.text_muted}>
            1.0x
          </text>
        </g>

        {/* Arrow between columns */}
        <path d="M 520,940 L 560,940"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowPath} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={560} y={720} w={460} h={440} accent />
          {/* First class header */}
          <text x={790} y={790} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            FIRST CLASS
          </text>
          {/* Seat grid 3×3 (wider) */}
          {Array.from({ length: 9 }, (_, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const sx = 620 + col * 110;
            const sy = 830 + row * 80;
            const seatDelay = 20 + i * 0.8;
            const seatOp = interpolate(frame, [seatDelay, seatDelay + 8], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <g key={i} opacity={seatOp}>
                <rect x={sx} y={sy} width={80} height={52} rx={10}
                  fill={COLORS.bg_primary}
                  stroke={COLORS.accent} strokeWidth={1.5} />
                <rect x={sx + 22} y={sy + 6} width={36} height={28} rx={6}
                  fill={COLORS.accent} fillOpacity={0.08} />
              </g>
            );
          })}
          {/* Price multiplier */}
          <text x={790} y={1110} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent} opacity={glow}>
            1.5x
          </text>
        </g>

        {/* ── Bottom summary ─────────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={140} />
          <text x={540} y={1285} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            Class selection <tspan fill={COLORS.accent}>adjusts</tspan> the base fare
          </text>
        </g>

        {/* ── Param badges ───────────────────────────────────────────────── */}
        <g opacity={paramBadge.opacity} transform={`translate(0, ${paramBadge.translateY})`}>
          <BentoCard x={60} y={1390} w={460} h={120} accent />
          <circle cx={120} cy={1450} r={22}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '120px 1450px' }} />
          <text x={120} y={1458} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>
            2
          </text>
          <text x={165} y={1455}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            Parameters
          </text>
        </g>

        <g opacity={paramBadge.opacity} transform={`translate(0, ${paramBadge.translateY})`}>
          <BentoCard x={560} y={1390} w={460} h={120} />
          <text x={600} y={1450}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Route + Class context
          </text>
          <text x={600} y={1490}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Intermediate detail level
          </text>
        </g>

        {/* ── Floating accents ───────────────────────────────────────────── */}
        <g transform={`translate(900, ${1620 + breathe})`}>
          <circle cx={0} cy={0} r={24}
            fill={COLORS.accent} fillOpacity={0.04} />
        </g>
        <g transform={`translate(180, ${1650 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={18}
            fill={COLORS.accent} fillOpacity={0.03} />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── Subtle bottom text ─────────────────────────────────────────── */}
        <g opacity={paramBadge.opacity * shimmer * 0.5}>
          <text x={540} y={1580} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            More data means a more precise fare
          </text>
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
