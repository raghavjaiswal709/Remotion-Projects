/**
 * Scene 17 — Booking System Breaks
 * "The booking system double count seats, the financial reports break."
 * CSV: 72.060s → 76.820s
 * Duration: 143 frames (4.77s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Two consequences: booking double-counts (left), financial reports break (right).
 * Error chain visualization: confusion → double count → bad report.
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 16–90): Error chain + two consequence cards + booking form
 *   Phase 3 (frames 75–end): Error flash, pulse, shimmer
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene17_BookingSystemBreaks: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headWord1 = useSpringEntrance(frame, 4);
  const headWord2 = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Error chain: 3 nodes
  const chain1 = useSpringEntrance(frame, 16);
  const chain2 = useSpringEntrance(frame, 26);
  const chain3 = useSpringEntrance(frame, 36);

  // Arrows between chain nodes
  const arrow1Len = 60;
  const arrow1Dash = usePathDraw(frame, 22, arrow1Len, 16);
  const arrow2Len = 60;
  const arrow2Dash = usePathDraw(frame, 32, arrow2Len, 16);

  // Left card: booking system
  const bookingCard = useSpringEntrance(frame, 42);
  const bookingPerim = 2 * (440 + 420);
  const bookingBorder = interpolate(frame, [42, 66], [bookingPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Right card: financial reports
  const finCard = useSpringEntrance(frame, 50);
  const finPerim = 2 * (440 + 420);
  const finBorder = interpolate(frame, [50, 74], [finPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Seat grid in booking card
  const seatGridEntry = useSpringEntrance(frame, 54);

  // Bottom summary
  const summaryEntry = useSpringEntrance(frame, 66);

  // Counters
  const doubleCount = useCounter(frame, 46, 600, 35); // doubled
  const correctCount = 300;
  const revenue = useCounter(frame, 54, 87500, 40);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const errorFlash = Math.abs(Math.sin(frame * 0.1)) * 0.2;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="INSTANCE VS STATIC · CONSEQUENCES" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────── */}
        <g opacity={headWord1.opacity} transform={`translate(0, ${headWord1.translateY})`}>
          <text x={60} y={290} fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Double Count Seats
          </text>
        </g>
        <g opacity={headWord2.opacity} transform={`translate(0, ${headWord2.translateY})`}>
          <text x={60} y={370} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.white}>
            Financial Reports Break
          </text>
        </g>

        {/* ── Error Chain — 3 nodes horizontal ────────────────────────── */}
        {/* Node 1: SCOPE CONFUSION */}
        <g opacity={chain1.opacity} transform={`translate(0, ${chain1.translateY})`}>
          <rect x={80} y={430} width={240} height={64} rx={32}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={200} y={470} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.vibrant_red}>
            SCOPE CONFUSION
          </text>
        </g>

        {/* Arrow 1 */}
        <line x1={325} y1={462} x2={385} y2={462}
          stroke={COLORS.vibrant_red} strokeWidth={2}
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash}
          markerEnd="url(#arrow)" />

        {/* Node 2: DOUBLE COUNT */}
        <g opacity={chain2.opacity} transform={`translate(0, ${chain2.translateY})`}>
          <rect x={390} y={430} width={260} height={64} rx={32}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={520} y={470} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.vibrant_red}>
            DOUBLE COUNT
          </text>
        </g>

        {/* Arrow 2 */}
        <line x1={655} y1={462} x2={715} y2={462}
          stroke={COLORS.vibrant_red} strokeWidth={2}
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash}
          markerEnd="url(#arrow)" />

        {/* Node 3: REPORTS BREAK */}
        <g opacity={chain3.opacity} transform={`translate(0, ${chain3.translateY})`}>
          <rect x={720} y={430} width={260} height={64} rx={32}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={850} y={470} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.vibrant_red}>
            REPORTS BREAK
          </text>
        </g>

        {/* ── Left card: Booking System ────────────────────────────────── */}
        <g opacity={bookingCard.opacity} transform={`translate(0, ${bookingCard.translateY})`}>
          <rect x={60} y={530} width={460} height={420} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={bookingPerim} strokeDashoffset={bookingBorder} />

          <text x={100} y={578} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            BOOKING SYSTEM
          </text>

          {/* Seat grid (6x4) */}
          <g opacity={seatGridEntry.opacity}>
            {Array.from({ length: 24 }, (_, i) => {
              const row = Math.floor(i / 6);
              const col = i % 6;
              const sx = 100 + col * 56;
              const sy = 610 + row * 48;
              const isDouble = i < 12; // first 12 seats shown as double-counted
              return (
                <g key={i}>
                  <rect x={sx} y={sy} width={40} height={32} rx={6}
                    fill={isDouble ? COLORS.vibrant_red : COLORS.accent}
                    fillOpacity={isDouble ? (0.15 + errorFlash * 0.1) : 0.08}
                    stroke={isDouble ? COLORS.vibrant_red : COLORS.accent}
                    strokeWidth={1} strokeOpacity={isDouble ? 0.5 : 0.2} />
                  {isDouble && (
                    <text x={sx + 20} y={sy + 22} textAnchor="middle"
                      fontFamily={FONT} fontSize={12} fontWeight={800}
                      fill={COLORS.vibrant_red} opacity={0.6}>
                      2x
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Aisle line */}
          <line x1={100 + 3 * 56 - 8} y1={608} x2={100 + 3 * 56 - 8} y2={808}
            stroke="rgba(255,255,255,0.04)" strokeWidth={1} strokeDasharray="4,4" />

          {/* Counter */}
          <text x={280} y={870} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.text_muted}>
            Reported seats:
          </text>
          <text x={280} y={920} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.vibrant_red}>
            {doubleCount}
          </text>
          <text x={380} y={920}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            (real: {correctCount})
          </text>
        </g>

        {/* ── Right card: Financial Reports ────────────────────────────── */}
        <g opacity={finCard.opacity} transform={`translate(0, ${finCard.translateY})`}>
          <rect x={560} y={530} width={460} height={420} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={finPerim} strokeDashoffset={finBorder} />

          <text x={600} y={578} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            FINANCIAL REPORT
          </text>

          {/* Report document illustration */}
          <rect x={620} y={610} width={360} height={240} rx={12}
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

          {/* Report header */}
          <rect x={640} y={630} width={120} height={10} rx={5}
            fill={COLORS.vibrant_red} fillOpacity={0.15} />
          {/* Report rows — jagged to suggest error */}
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i}>
              <rect x={640} y={665 + i * 30} width={180 + (i * 30) % 80} height={6} rx={3}
                fill="rgba(255,255,255,0.04)" />
              <rect x={900} y={665 + i * 30} width={60} height={6} rx={3}
                fill={COLORS.vibrant_red} fillOpacity={0.1 + errorFlash * 0.08} />
            </g>
          ))}

          {/* Big crossed-out revenue */}
          <text x={790} y={896} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Revenue:
          </text>
          <text x={790} y={940} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.vibrant_red}>
            ${revenue.toLocaleString()}
          </text>
          {/* Strike-through line */}
          <line x1={680} y1={932} x2={900} y2={932}
            stroke={COLORS.vibrant_red} strokeWidth={3} opacity={0.5}
            strokeDasharray={220}
            strokeDashoffset={usePathDraw(frame, 58, 220, 20)} />
        </g>

        {/* ── Vertical divider between cards ──────────────────────────── */}
        <line x1={540} y1={550} x2={540} y2={930}
          stroke="rgba(255,255,255,0.03)" strokeWidth={1}
          strokeDasharray="8,8"
          opacity={finCard.opacity * 0.3} />

        {/* ── Summary strip ────────────────────────────────────────────── */}
        <g opacity={summaryEntry.opacity} transform={`translate(0, ${summaryEntry.translateY})`}>
          <BentoCard x={60} y={990} w={960} h={100} />
          <rect x={60} y={990} width={6} height={100} rx={3}
            fill={COLORS.vibrant_red} />
          <text x={100} y={1045} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            Mixing scopes corrupts data across the entire system
          </text>
        </g>

        {/* ── Consequence arrow from summary down ─────────────────────── */}
        <g opacity={summaryEntry.opacity * 0.15}>
          <line x1={540} y1={1100} x2={540} y2={1200}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray="6,6" />
          <polygon points="530,1200 540,1218 550,1200"
            fill={COLORS.vibrant_red} fillOpacity={0.3} />
        </g>

        {/* ── Bottom illustration: broken ticket ──────────────────────── */}
        <g opacity={summaryEntry.opacity * 0.2}
          transform={`translate(540, ${1300 + breathe})`}>
          {/* Ticket body */}
          <rect x={-160} y={-50} width={320} height={100} rx={12}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} strokeOpacity={0.15} />
          {/* Perforations */}
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i}
              cx={-130 + i * 44} cy={-50}
              r={4} fill={COLORS.bg_primary} />
          ))}
          {/* Crack line through ticket */}
          <path d="M -80,-30 L -20,0 L 40,-20 L 100,10 L 140,-10"
            fill="none" stroke={COLORS.vibrant_red}
            strokeWidth={2} strokeOpacity={0.2}
            strokeDasharray="8,4" />
          {/* Invalid text */}
          <text x={0} y={15} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.3 + errorFlash * 0.15}
            transform={`rotate(-12)`}
            style={{ transformOrigin: '0px 15px' }}>
            INVALID
          </text>
        </g>

        {/* ── Floating error particles ─────────────────────────────────── */}
        {[
          { x: 100, y: 1500, r: 4 },
          { x: 950, y: 1520, r: 5 },
          { x: 200, y: 1560, r: 3 },
          { x: 880, y: 1580, r: 4 },
          { x: 540, y: 1600, r: 6 },
        ].map((dot, i) => (
          <circle key={i}
            cx={dot.x}
            cy={dot.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={dot.r}
            fill={COLORS.vibrant_red}
            fillOpacity={0.02 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s17.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
