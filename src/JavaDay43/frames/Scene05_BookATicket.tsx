/**
 * Scene 05 — Book A Ticket
 * "The booking service needs to book a ticket,"
 * CSV: 21.880s → 23.920s
 * Duration: ~97 frames
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + headline spring in
 *   Phase 2 (frames 20–80):  Ticket illustration + booking service node
 *   Phase 3 (frames 70–end): Floating animation, ticket pulse
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

export const Scene05_BookATicket: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const serviceNode = useSpringEntrance(frame, 20);
  const ticketCard  = useSpringEntrance(frame, 32);
  const arrowCard   = useSpringEntrance(frame, 44);
  const detailCard  = useSpringEntrance(frame, 56);

  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 35, arrowLen, 25);

  const ticketPerim = 2 * (800 + 500);
  const ticketBorder = usePathDraw(frame, 32, ticketPerim, 35);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const ticketFloat = Math.sin(frame * 0.05) * 6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TICKETING ENGINE · BOOKING" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Booking Service
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Needs to book a ticket
          </text>
        </g>

        {/* ── ZONE C — Service node ─────────────────────────────────── */}
        <g opacity={serviceNode.opacity} transform={`translate(0, ${serviceNode.translateY})`}>
          <BentoCard x={60} y={440} w={960} h={190} accent />
          {/* Service icon — rounded rect with gear */}
          <rect x={100} y={470} width={120} height={120} rx={20}
            fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={160} cy={530} r={30} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={160} cy={530} r={10} fill={COLORS.accent} />
          {/* Label */}
          <text x={260} y={520} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            BookingService
          </text>
          <text x={260} y={570} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Central ticket booking handler
          </text>
        </g>

        {/* Arrow down to ticket */}
        <line x1={540} y1={630} x2={540} y2={720}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* Large ticket illustration */}
        <g opacity={ticketCard.opacity} transform={`translate(0, ${ticketCard.translateY + ticketFloat})`}>
          <BentoCard x={100} y={720} w={880} h={480} accent />
          {/* Animated border */}
          <rect x={100} y={720} width={880} height={480} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={ticketPerim} strokeDashoffset={ticketBorder} />

          {/* Ticket body */}
          <rect x={140} y={760} width={800} height={400} rx={16}
            fill={COLORS.bg_primary} stroke={COLORS.accent_mid} strokeWidth={1.5} />

          {/* Perforation line */}
          <line x1={640} y1={780} x2={640} y2={1140}
            stroke={COLORS.accent_mid} strokeWidth={1.5}
            strokeDasharray="8 6" />

          {/* Left side — ticket info */}
          <text x={180} y={830} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            RAILWAY TICKET
          </text>
          <text x={180} y={890} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Passenger ID
          </text>
          <rect x={180} y={905} width={400} height={4} rx={2} fill={COLORS.accent_dim} />
          <text x={180} y={960} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Route
          </text>
          <rect x={180} y={975} width={400} height={4} rx={2} fill={COLORS.accent_dim} />
          <text x={180} y={1030} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Seat Class
          </text>
          <rect x={180} y={1045} width={400} height={4} rx={2} fill={COLORS.accent_dim} />
          <text x={180} y={1100} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Concession
          </text>
          <rect x={180} y={1115} width={400} height={4} rx={2} fill={COLORS.accent_dim} />

          {/* Right side — barcode stub */}
          <rect x={680} y={800} width={220} height={60} rx={8}
            fill={COLORS.accent} opacity={0.15} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i}
              x={700 + i * 16} y={820}
              width={6} height={20 + (i % 3) * 10} rx={1}
              fill={COLORS.accent} opacity={0.5} />
          ))}
          <text x={790} y={920} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            ?
          </text>
          <text x={790} y={990} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Details
          </text>
          <text x={790} y={1030} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Vary
          </text>
        </g>

        {/* Detail card */}
        <g opacity={detailCard.opacity} transform={`translate(0, ${detailCard.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={160} />
          <rect x={60} y={1260} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1330} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            One goal — multiple booking paths
          </text>
          <text x={100} y={1380} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Same service, different input combinations
          </text>
        </g>

        {/* Floating accent particles */}
        {[
          { x: 160, y: 1500, r: 22 },
          { x: 920, y: 1540, r: 16 },
          { x: 540, y: 1580, r: 26 },
          { x: 800, y: 1620, r: 14 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y + breathe * (1 + i * 0.15)})`}>
            <circle cx={0} cy={0} r={p.r} fill={COLORS.accent}
              fillOpacity={0.06 * shimmer} />
            <circle cx={0} cy={0} r={p.r} fill="none"
              stroke={COLORS.accent_mid} strokeWidth={1.5}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          </g>
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────── */}
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
