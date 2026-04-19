/**
 * Scene 05 — Seat Class Variant
 * "Sometimes it also knows the seat class."
 * CSV: 19.440s → 21.240s
 * Duration: 71 frames (2.37s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): label + headline entrance
 *   Phase 2 (frames 15–55): Two-column seat comparison with seat map SVGs
 *   Phase 3 (frames 45–end): Seat glow pulse, micro floats
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

export const Scene05_SeatClass: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 4);
  const subline  = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const leftCard  = useSpringEntrance(frame, 14);
  const rightCard = useSpringEntrance(frame, 22);
  const methodBox = useSpringEntrance(frame, 30);
  const seatRows  = [
    useSpringEntrance(frame, 18),
    useSpringEntrance(frame, 22),
    useSpringEntrance(frame, 26),
    useSpringEntrance(frame, 30),
  ];

  // ── Detail cards ───────────────────────────────────────────────────────────
  const detailCard1 = useSpringEntrance(frame, 36);
  const detailCard2 = useSpringEntrance(frame, 42);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe   = Math.sin(frame * 0.06) * 4;
  const pulse     = 1 + Math.sin(frame * 0.08) * 0.015;
  const seatGlow  = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 0.8]);
  const shimmer   = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  // ── Border draw ────────────────────────────────────────────────────────────
  const borderPerim = 2 * (460 + 520);
  const borderDash  = usePathDraw(frame, 14, borderPerim, 25);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

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
            MODULE 3 · METHOD OVERLOADING
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={310}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>
            + Seat Class
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.text_muted}>
            Route <tspan fill={COLORS.accent}>and</tspan> class are known
          </text>
        </g>

        {/* ── ZONE C — Two-column seat comparison ────────────────────────── */}

        {/* Left card — Economy/General */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={500} w={460} h={520} />
          <text x={290} y={560} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            GENERAL
          </text>

          {/* Seat grid — 4 rows × 5 seats */}
          {[0, 1, 2, 3].map((row) => (
            <g key={row} opacity={seatRows[row].opacity}>
              {[0, 1, 2, 3, 4].map((col) => {
                const sx = 120 + col * 72;
                const sy = 600 + row * 90;
                return (
                  <rect key={`${row}-${col}`}
                    x={sx} y={sy} width={52} height={64} rx={8}
                    fill={COLORS.bg_primary}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
                );
              })}
              {/* Aisle gap line */}
              <line x1={340} y1={600 + row * 90}
                x2={340} y2={664 + row * 90}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            </g>
          ))}

          {/* Price label */}
          <text x={290} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            Base Fare
          </text>
        </g>

        {/* Right card — First Class (accent highlighted) */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          {/* Border-draw animation */}
          <rect x={560} y={500} width={460} height={520} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={borderPerim} strokeDashoffset={borderDash} />
          <text x={790} y={560} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            FIRST CLASS
          </text>

          {/* Seat grid — 4 rows × 3 seats (wider) */}
          {[0, 1, 2, 3].map((row) => (
            <g key={row} opacity={seatRows[row].opacity}>
              {[0, 1, 2].map((col) => {
                const sx = 620 + col * 120;
                const sy = 600 + row * 90;
                return (
                  <rect key={`fc-${row}-${col}`}
                    x={sx} y={sy} width={80} height={64} rx={10}
                    fill={COLORS.accent} fillOpacity={seatGlow * 0.12}
                    stroke={COLORS.accent} strokeWidth={1.5} />
                );
              })}
            </g>
          ))}

          {/* Premium badge */}
          <rect x={690} y={950} width={200} height={50} rx={12}
            fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={790} y={985} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            +Premium
          </text>
        </g>

        {/* ── Method signature card ──────────────────────────────────────── */}
        <g opacity={methodBox.opacity} transform={`translate(0, ${methodBox.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={140} accent />
          <rect x={60} y={1080} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1165}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            calculateFare(
            <tspan fill={COLORS.accent} fontStyle="italic">route</tspan>
            , <tspan fill={COLORS.accent} fontStyle="italic">seatClass</tspan>
            )
          </text>
        </g>

        {/* ── Detail row ─────────────────────────────────────────────────── */}
        <g opacity={detailCard1.opacity} transform={`translate(0, ${detailCard1.translateY})`}>
          <BentoCard x={60} y={1270} w={460} h={180} />
          <text x={100} y={1340}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            2 Parameters
          </text>
          <text x={100} y={1395}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Route + Class
          </text>
        </g>
        <g opacity={detailCard2.opacity} transform={`translate(0, ${detailCard2.translateY})`}>
          <BentoCard x={560} y={1270} w={460} h={180} />
          <text x={600} y={1340}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Class-Adjusted
          </text>
          <text x={600} y={1395}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Premium multiplier
          </text>
        </g>

        {/* ── Floating accent ────────────────────────────────────────────── */}
        <g transform={`translate(540, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={30}
            fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={30}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.2} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Connector: left→right comparison arrow ─────────────────────── */}
        <path d="M 520,760 L 560,760"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          markerEnd="url(#arrow)" opacity={rightCard.opacity * 0.6} />

        {/* ── Bottom text ────────────────────────────────────────────────── */}
        <g opacity={detailCard2.opacity * 0.6}>
          <text x={540} y={1570} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Same method name — different pricing tier
          </text>
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.35}>
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
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
