/**
 * Scene 13 — EndStateExample
 * "End state, one confirmed ticket."
 * CSV: 39.940s → 41.960s
 * Duration: ~81 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 18–65):  Confirmed ticket card with full details, checkmark, CONFIRMED stamp
 *   Phase 3 (frames 50+):    Glow pulse on ticket, float, shimmer
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

export const Scene13_EndStateExample: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);
  const badgeEntrance = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const ticketCard  = useSpringEntrance(frame, 18);
  const stampEnter  = useSpringEntrance(frame, 34);
  const detailsA    = useSpringEntrance(frame, 24);
  const detailsB    = useSpringEntrance(frame, 30);
  const infoCard    = useSpringEntrance(frame, 48);

  // Ticket border draw
  const ticketPerim = 2 * (800 + 420);
  const ticketDash = usePathDraw(frame, 18, ticketPerim, 20);

  // Checkmark draw
  const checkLen = 60;
  const checkDash = usePathDraw(frame, 36, checkLen, 14);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glowRadius = interpolate(Math.sin(frame * 0.06), [-1, 1], [0, 6]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · TASK COMPONENT 2" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            End State
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.text_muted}>
            Where the world should be
          </text>
        </g>

        {/* ── "END" Badge ───────────────────────────────────────────────── */}
        <g transform={`translate(0, ${badgeEntrance.translateY})`} opacity={badgeEntrance.opacity}>
          <rect x={60} y={440} width={110} height={44} rx={22}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={115} y={469} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            END
          </text>
        </g>

        {/* ── Confirmed ticket illustration ──────────────────────────────── */}
        <g opacity={ticketCard.opacity} transform={`translate(0, ${ticketCard.translateY})`}>
          {/* Ticket border — solid with glow */}
          <rect x={140} y={530} width={800} height={420} rx={24}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={ticketPerim} strokeDashoffset={ticketDash} />

          {/* Inner glow ring */}
          <rect x={148} y={538} width={784} height={404} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.15 + glowRadius * 0.02} />

          {/* Perforation dots (left side) */}
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i}
              cx={160} cy={560 + i * 44} r={4}
              fill={COLORS.bg_primary}
              stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          ))}

          {/* Vertical dashed separator */}
          <line x1={680} y1={560} x2={680} y2={920}
            stroke="rgba(255,255,255,0.12)" strokeWidth={1.5}
            strokeDasharray="8 6" />

          {/* Flight route */}
          <g opacity={detailsA.opacity} transform={`translate(0, ${detailsA.translateY})`}>
            <text x={220} y={600} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.white}>
              DEL
            </text>
            {/* Arrow path */}
            <line x1={340} y1={592} x2={520} y2={592}
              stroke={COLORS.accent} strokeWidth={2}
              markerEnd="url(#arrow)" />
            {/* Plane icon */}
            <g transform="translate(430, 582) rotate(0)">
              <path d="M 0,0 L 14,-6 L 14,6 Z" fill={COLORS.accent} />
              <rect x={-16} y={-3} width={16} height={6} rx={2} fill={COLORS.accent} />
            </g>
            <text x={540} y={600} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.white}>
              LHR
            </text>
          </g>

          {/* Details */}
          <g opacity={detailsB.opacity} transform={`translate(0, ${detailsB.translateY})`}>
            {/* Date */}
            <text x={220} y={665} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
              Next Tuesday
            </text>
            {/* Airline */}
            <text x={220} y={710} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
              British Airways
            </text>
            {/* Layover */}
            <text x={220} y={755} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
              Layover: 1h 45m (shortest)
            </text>

            {/* Price in right section */}
            <text x={720} y={620} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
              $428
            </text>
            <text x={720} y={665} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
              ROUND TRIP
            </text>

            {/* Booking ref */}
            <text x={720} y={730} fontFamily={FONT} fontSize={22} fontWeight={800}
              fill={COLORS.text_muted} letterSpacing="0.1em">
              REF: BA2847X
            </text>

            {/* Barcode lines */}
            {Array.from({ length: 16 }, (_, i) => (
              <rect key={i}
                x={720 + i * 10} y={760}
                width={i % 3 === 0 ? 3 : 5} height={40}
                fill={COLORS.text_muted} opacity={0.3} />
            ))}

            {/* Seat */}
            <text x={220} y={800} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.white}>
              Seat 14A — Window
            </text>

            {/* Status bar */}
            <rect x={220} y={840} width={300} height={36} rx={18}
              fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={370} y={865} textAnchor="middle"
              fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
              CONFIRMED
            </text>
          </g>
        </g>

        {/* ── CONFIRMED stamp ────────────────────────────────────────────── */}
        <g opacity={stampEnter.opacity}>
          <g transform={`translate(820, 620) rotate(15) scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={44}
              fill={COLORS.accent} fillOpacity={0.1}
              stroke={COLORS.accent} strokeWidth={2.5} />
            <path d="M -14,2 L -4,14 L 16,-10"
              fill="none" stroke={COLORS.accent} strokeWidth={3.5}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          </g>
        </g>

        {/* ── Info card ──────────────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1000} w={960} h={200} accent />
          <rect x={60} y={1000} width={6} height={200} rx={3} fill={COLORS.accent} />

          {/* Ticket icon */}
          <g transform="translate(110, 1100)">
            <rect x={-24} y={-18} width={48} height={36} rx={6}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <line x1={-12} y1={-6} x2={12} y2={-6}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <line x1={-12} y1={4} x2={6} y2={4}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          </g>

          <text x={155} y={1080} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            One confirmed ticket
          </text>
          <text x={155} y={1125} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The desired state the agent must reach
          </text>
          <text x={155} y={1165} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            Concrete, verifiable, unambiguous
          </text>
        </g>

        {/* ── Contrast card — Before vs After ────────────────────────────── */}
        <g opacity={infoCard.opacity * shimmer} transform={`translate(0, ${infoCard.translateY * 0.5})`}>
          <BentoCard x={60} y={1240} w={460} h={120} />
          <text x={100} y={1295} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Before: empty
          </text>
          <circle cx={420} cy={1300} r={14} fill="none" stroke={COLORS.text_muted} strokeWidth={2}
            strokeDasharray="6 4" />

          <BentoCard x={560} y={1240} w={460} h={120} accent />
          <text x={600} y={1295} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            After: booked
          </text>
          <circle cx={920} cy={1300} r={14} fill={COLORS.accent} fillOpacity={0.3}
            stroke={COLORS.accent} strokeWidth={2} />
          <path d="M 912,1300 L 917,1308 L 928,1292"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeLinecap="round" />
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        <g opacity={0.25}>
          <circle cx={200} cy={1480 + breathe} r={3} fill={COLORS.accent} />
          <circle cx={860} cy={1540 + breathe * 0.8} r={2.5} fill={COLORS.accent} />
          <circle cx={500} cy={1620 + breathe * 1.1} r={2} fill={COLORS.accent} />
          <circle cx={700} cy={1700 + breathe * 0.6} r={3} fill={COLORS.accent} opacity={0.3} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
