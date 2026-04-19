/**
 * Scene 04 — Route Only
 * "Sometimes it only knows the route."
 * CSV: 17.280s → 18.940s
 * Duration: 65 frames (2.17s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): label + headline spring entrance
 *   Phase 2 (frames 15–50): Route map SVG with path-draw tracks, station dots
 *   Phase 3 (frames 40–end): Pulse on route highlight, breathing ring
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

export const Scene04_RouteOnly: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 4);
  const subline  = useSpringEntrance(frame, 8);

  // ── Phase 2: Route map ─────────────────────────────────────────────────────
  const mapCard    = useSpringEntrance(frame, 12);
  const trackDraw  = usePathDraw(frame, 14, 800, 25);
  const stationA   = useSpringEntrance(frame, 18);
  const stationB   = useSpringEntrance(frame, 24);
  const stationC   = useSpringEntrance(frame, 30);

  // ── Method card ────────────────────────────────────────────────────────────
  const methodCard = useSpringEntrance(frame, 30);
  const paramCard  = useSpringEntrance(frame, 36);
  const descCard   = useSpringEntrance(frame, 42);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe    = Math.sin(frame * 0.07) * 5;
  const pulse      = 1 + Math.sin(frame * 0.09) * 0.02;
  const ringPulse  = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.4, 1]);

  // ── Track glow animation ───────────────────────────────────────────────────
  const trackGlow  = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.3, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

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
            Route Only
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.text_muted}>
            Sometimes only the route is known
          </text>
        </g>

        {/* ── ZONE C — Route map illustration ────────────────────────────── */}
        <g opacity={mapCard.opacity} transform={`translate(0, ${mapCard.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={500} accent />

          {/* Rail tracks with path-draw */}
          <path d="M 160,750 C 300,650 540,650 700,750 C 860,850 900,750 920,750"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={800} strokeDashoffset={trackDraw}
            strokeLinecap="round" />
          <path d="M 160,770 C 300,670 540,670 700,770 C 860,870 900,770 920,770"
            fill="none" stroke={COLORS.accent} strokeWidth={4} opacity={0.3}
            strokeDasharray={800} strokeDashoffset={trackDraw}
            strokeLinecap="round" />

          {/* Cross-ties along track */}
          {[200, 300, 400, 500, 600, 700, 800, 880].map((tx, i) => (
            <rect key={i} x={tx} y={740} width={8} height={40} rx={2}
              fill={COLORS.accent} fillOpacity={0.2 * stationA.opacity} />
          ))}

          {/* Station A */}
          <g opacity={stationA.opacity}>
            <circle cx={160} cy={750} r={20}
              fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={160} cy={750} r={8} fill={COLORS.accent} />
            <text x={160} y={710} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.white}>
              ORIGIN
            </text>
          </g>

          {/* Station B (intermediate) */}
          <g opacity={stationB.opacity}>
            <circle cx={540} cy={670} r={16}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={540} cy={670} r={6} fill={COLORS.accent} opacity={0.6} />
            <text x={540} y={640} textAnchor="middle"
              fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.text_muted}>
              STOP
            </text>
          </g>

          {/* Station C */}
          <g opacity={stationC.opacity}>
            <circle cx={920} cy={750} r={20}
              fill={COLORS.accent} fillOpacity={ringPulse * 0.3}
              stroke={COLORS.accent} strokeWidth={3}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '920px 750px' }} />
            <circle cx={920} cy={750} r={8} fill={COLORS.accent} />
            <text x={920} y={710} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.accent}>
              DEST
            </text>
          </g>

          {/* Direction arrow */}
          <path d="M 420,600 L 460,600" fill="none"
            stroke={COLORS.accent} strokeWidth={2}
            markerEnd="url(#arrow)" opacity={stationB.opacity} />

          {/* Route label */}
          <text x={540} y={560} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic" opacity={trackGlow}>
            route
          </text>

          {/* Glow ring on destination */}
          <circle cx={920} cy={750} r={36}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={ringPulse * stationC.opacity * 0.4} />
        </g>

        {/* ── Method signature card ──────────────────────────────────────── */}
        <g opacity={methodCard.opacity} transform={`translate(0, ${methodCard.translateY})`}>
          <BentoCard x={60} y={1060} w={960} h={140} accent />
          <rect x={60} y={1060} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1145}
            fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.white}>
            calculateFare(
            <tspan fill={COLORS.accent} fontStyle="italic">route</tspan>
            )
          </text>
        </g>

        {/* ── Parameter info ─────────────────────────────────────────────── */}
        <g opacity={paramCard.opacity} transform={`translate(0, ${paramCard.translateY})`}>
          <BentoCard x={60} y={1240} w={460} h={200} />
          <text x={100} y={1310}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            1 Parameter
          </text>
          <text x={100} y={1370}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Distance-based fare
          </text>
        </g>
        <g opacity={descCard.opacity} transform={`translate(0, ${descCard.translateY})`}>
          <BentoCard x={560} y={1240} w={460} h={200} />
          <text x={600} y={1310}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Simplest Path
          </text>
          <text x={600} y={1370}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Route is all we need
          </text>
        </g>

        {/* ── Floating accent ────────────────────────────────────────────── */}
        <g transform={`translate(120, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={20}
            fill={COLORS.accent} fillOpacity={0.05} />
        </g>
        <g transform={`translate(960, ${1550 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={24}
            fill={COLORS.accent} fillOpacity={0.06}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Subtitle detail ────────────────────────────────────────────── */}
        <g opacity={descCard.opacity * 0.7}>
          <text x={540} y={1560} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Minimum input — maximum flexibility
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
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
