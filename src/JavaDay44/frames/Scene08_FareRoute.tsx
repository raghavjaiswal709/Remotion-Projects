/**
 * Scene 08 — calculateFare(route)
 * "calculateFare(route)."
 * CSV: 30.700s → 31.700s
 * Duration: 44 frames (1.47s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–12): Rapid scene reveal
 *   Phase 2 (frames 8–30): Hero method signature + route SVG map
 *   Phase 3 (frames 25–end): Micro-animations, path glow
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

export const Scene08_FareRoute: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 3);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const heroCard = useSpringEntrance(frame, 5);
  const mapCard  = useSpringEntrance(frame, 8);
  const badge1   = useSpringEntrance(frame, 12);
  const badge2   = useSpringEntrance(frame, 16);

  // ── Route path draw ────────────────────────────────────────────────────────
  const routeLen = 600;
  const routeDash = usePathDraw(frame, 8, routeLen, 20);

  // ── Border draw ────────────────────────────────────────────────────────────
  const heroPerim = 2 * (960 + 200);
  const heroBorderDash = usePathDraw(frame, 5, heroPerim, 18);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  // ── Station dots pulsing ───────────────────────────────────────────────────
  const stPulse1 = 1 + Math.sin(frame * 0.12) * 0.1;
  const stPulse2 = 1 + Math.sin(frame * 0.12 + 2) * 0.1;
  const stPulse3 = 1 + Math.sin(frame * 0.12 + 4) * 0.1;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

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
            OVERLOAD VARIANT 1
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={540} y={340} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>
            calculateFare
          </text>
          <text x={540} y={430} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            (route)
          </text>
        </g>

        {/* ── Hero method card ───────────────────────────────────────────── */}
        <g opacity={heroCard.opacity} transform={`translate(0, ${heroCard.translateY})`}>
          <rect x={60} y={500} width={960} height={200} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={heroPerim} strokeDashoffset={heroBorderDash} />
          <rect x={60} y={500} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={585}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Simplest Version
          </text>
          <text x={100} y={640}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Only the <tspan fill={COLORS.accent} fontStyle="italic">route</tspan> is known
          </text>
          <text x={100} y={680}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.6}>
            1 parameter &#x2192; distance-based fare
          </text>
        </g>

        {/* ── Route map SVG ──────────────────────────────────────────────── */}
        <g opacity={mapCard.opacity} transform={`translate(0, ${mapCard.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={500} />

          {/* Track lines */}
          <path d="M 200,990 L 880,990"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={routeLen} strokeDashoffset={routeDash}
            strokeLinecap="round" />
          <path d="M 200,996 L 880,996"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={routeLen} strokeDashoffset={routeDash}
            opacity={0.3} />

          {/* Cross-ties */}
          {Array.from({ length: 18 }, (_, i) => {
            const tx = 210 + i * 38;
            const tieOpacity = interpolate(frame, [10 + i * 0.5, 14 + i * 0.5], [0, 0.3], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <rect key={i} x={tx} y={984} width={4} height={18} rx={1}
                fill={COLORS.accent} opacity={tieOpacity} />
            );
          })}

          {/* Station A — origin */}
          <g transform={`scale(${stPulse1})`} style={{ transformOrigin: '200px 990px' }}>
            <circle cx={200} cy={990} r={20}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={200} cy={990} r={8} fill={COLORS.accent} />
          </g>
          <text x={200} y={940} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            ORIGIN
          </text>
          <text x={200} y={1050} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            Station A
          </text>

          {/* Station B — midpoint */}
          <g transform={`scale(${stPulse2})`} style={{ transformOrigin: '540px 990px' }}>
            <circle cx={540} cy={990} r={16}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
            <circle cx={540} cy={990} r={5} fill={COLORS.accent} opacity={0.5} />
          </g>
          <text x={540} y={940} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.6}>
            STOP
          </text>

          {/* Station C — destination */}
          <g transform={`scale(${stPulse3})`} style={{ transformOrigin: '880px 990px' }}>
            <circle cx={880} cy={990} r={20}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={880} cy={990} r={8} fill={COLORS.accent} />
          </g>
          <text x={880} y={940} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            DEST
          </text>
          <text x={880} y={1050} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            Station C
          </text>

          {/* Route label */}
          <text x={540} y={820} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} opacity={shimmer}>
            ROUTE PATH
          </text>

          {/* Distance indicator */}
          <line x1={200} y1={1100} x2={880} y2={1100}
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3}
            strokeDasharray="8,6" />
          <text x={540} y={1140} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Distance determines fare
          </text>
        </g>

        {/* ── Param badge ────────────────────────────────────────────────── */}
        <g opacity={badge1.opacity} transform={`translate(0, ${badge1.translateY})`}>
          <BentoCard x={60} y={1290} w={460} h={140} accent />
          <circle cx={120} cy={1360} r={24}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '120px 1360px' }} />
          <text x={120} y={1368} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            1
          </text>
          <text x={170} y={1365}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Parameter
          </text>
        </g>

        <g opacity={badge2.opacity} transform={`translate(0, ${badge2.translateY})`}>
          <BentoCard x={560} y={1290} w={460} h={140} />
          <text x={600} y={1365}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Base-level fare
          </text>
          <text x={600} y={1405}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            No extras applied
          </text>
        </g>

        {/* ── Floating elements ──────────────────────────────────────────── */}
        <g transform={`translate(900, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={30}
            fill={COLORS.accent} fillOpacity={0.04} />
          <circle cx={0} cy={0} r={16}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={shimmer * 0.3} />
        </g>
        <g transform={`translate(180, ${1600 + breathe * 0.8})`}>
          <circle cx={0} cy={0} r={20}
            fill={COLORS.accent} fillOpacity={0.03} />
        </g>

        {/* ── Bottom summary ─────────────────────────────────────────────── */}
        <g opacity={badge2.opacity * 0.5}>
          <text x={540} y={1520} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} opacity={shimmer}>
            The minimal calculation path
          </text>
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
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
