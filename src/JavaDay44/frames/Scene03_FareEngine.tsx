/**
 * Scene 03 — Fare Booking Engine
 * "The fare booking engine calculates fares in multiple ways."
 * CSV: 13.740s → 16.780s
 * Duration: 106 frames (3.53s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label slides, headline springs up
 *   Phase 2 (frames 20–70): Ticket machine SVG builds with path-draw
 *   Phase 3 (frames 60–end): Ticket slots pulse, accent ring breathes
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

export const Scene03_FareEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);

  // ── Phase 2: Ticket machine ────────────────────────────────────────────────
  const machineCard   = useSpringEntrance(frame, 16);
  const machineOutline = usePathDraw(frame, 18, 1400, 30);
  const slot1         = useSpringEntrance(frame, 28);
  const slot2         = useSpringEntrance(frame, 38);
  const slot3         = useSpringEntrance(frame, 48);

  // ── Info cards ─────────────────────────────────────────────────────────────
  const infoCard1     = useSpringEntrance(frame, 55);
  const infoCard2     = useSpringEntrance(frame, 62);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe       = Math.sin(frame * 0.06) * 4;
  const pulse         = 1 + Math.sin(frame * 0.08) * 0.018;
  const shimmer       = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const slotGlow      = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            MODULE 3 · TICKETING ENGINE
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            Fare Booking
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Engine
          </text>
        </g>

        {/* ── ZONE C — Ticket machine illustration ───────────────────────── */}
        <g opacity={machineCard.opacity} transform={`translate(0, ${machineCard.translateY})`}>
          <BentoCard x={160} y={520} w={760} h={700} accent />

          {/* Machine outer frame with path-draw */}
          <rect x={200} y={560} width={680} height={620} rx={16}
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={1400} strokeDashoffset={machineOutline} />

          {/* Screen area */}
          <rect x={280} y={600} width={520} height={180} rx={12}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5} />

          {/* Screen text */}
          <text x={540} y={670} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            FARE CALCULATOR
          </text>
          <text x={540} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            calculateFare()
          </text>

          {/* Three ticket output slots */}
          <g opacity={slot1.opacity} transform={`translate(0, ${slot1.translateY})`}>
            <rect x={260} y={820} width={200} height={80} rx={10}
              fill={COLORS.accent} fillOpacity={slotGlow * 0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={360} y={870} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.white}>
              ROUTE
            </text>
          </g>

          <g opacity={slot2.opacity} transform={`translate(0, ${slot2.translateY})`}>
            <rect x={500} y={820} width={200} height={80} rx={10}
              fill={COLORS.accent} fillOpacity={slotGlow * 0.12}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={600} y={870} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.white}>
              CLASS
            </text>
          </g>

          <g opacity={slot3.opacity} transform={`translate(0, ${slot3.translateY})`}>
            <rect x={380} y={940} width={240} height={80} rx={10}
              fill={COLORS.accent} fillOpacity={slotGlow * 0.1}
              stroke={COLORS.accent} strokeWidth={1.5}  />
            <text x={500} y={990} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.accent}>
              PEAK HR
            </text>
          </g>

          {/* Ticket output slot */}
          <rect x={380} y={1060} width={240} height={40} rx={6}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1} strokeDasharray="8 4" />

          {/* Dashed ticket emerging */}
          <rect x={430} y={1100} width={140} height={60} rx={8}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={1.5} strokeDasharray="6 3"
            opacity={shimmer * slot3.opacity} />
          <text x={500} y={1140} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} opacity={shimmer * slot3.opacity}>
            TICKET
          </text>
        </g>

        {/* ── Info cards ──────────────────────────────────────────────────── */}
        <g opacity={infoCard1.opacity} transform={`translate(0, ${infoCard1.translateY})`}>
          <BentoCard x={60} y={1280} w={460} h={180} />
          <text x={100} y={1350}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Multiple
          </text>
          <text x={100} y={1400}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Calculation Paths
          </text>
        </g>
        <g opacity={infoCard2.opacity} transform={`translate(0, ${infoCard2.translateY})`}>
          <BentoCard x={560} y={1280} w={460} h={180} accent />
          <text x={600} y={1350}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            One Method
          </text>
          <text x={600} y={1400}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            Name
          </text>
        </g>

        {/* ── Floating accents ───────────────────────────────────────────── */}
        <g transform={`translate(180, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={28}
            fill={COLORS.accent} fillOpacity={0.04} />
        </g>
        <g transform={`translate(900, ${1520 + breathe * 0.8})`}>
          <circle cx={0} cy={0} r={36}
            fill={COLORS.accent} fillOpacity={0.05}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <line x1={60} y1={1500} x2={1020} y2={1500}
          stroke="rgba(255,255,255,0.08)" strokeWidth={1}
          opacity={infoCard2.opacity} />

        {/* ── Bottom detail text ──────────────────────────────────────────── */}
        <g opacity={infoCard2.opacity * shimmer}>
          <text x={540} y={1580} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Same interface — different data inputs
          </text>
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={labelEntrance.opacity * 0.4}>
          <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
