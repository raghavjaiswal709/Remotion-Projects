/**
 * Scene 10 — FlightExample
 * "Find the three cheapest flights from Delhi to London next Tuesday."
 * CSV: 30.860s → 34.520s
 * Duration: ~84 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring in
 *   Phase 2 (frames 18–75):  Flight path SVG (globe+route), search card, 3 ticket cards
 *   Phase 3 (frames 60+):    Plane float, ticket shimmer, pulse rings
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

export const Scene10_FlightExample: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const routeCard     = useSpringEntrance(frame, 16);
  const ticket1       = useSpringEntrance(frame, 32);
  const ticket2       = useSpringEntrance(frame, 42);
  const ticket3       = useSpringEntrance(frame, 52);
  const dateCard      = useSpringEntrance(frame, 26);

  // Flight route arc path draw
  const arcLen = 400;
  const arcDash = usePathDraw(frame, 20, arcLen, 30);

  // Dashed target ring draw
  const ringLen = Math.PI * 2 * 28;
  const ringDash = usePathDraw(frame, 24, ringLen, 20);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Plane position along arc
  const planeProg = interpolate(frame, [22, 55], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  // Simple parabolic arc from left to right
  const planeX = interpolate(planeProg, [0, 1], [200, 820]);
  const planeY = 700 - Math.sin(planeProg * Math.PI) * 120;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · CONCRETE EXAMPLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Find 3 Cheapest
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            Delhi → London
          </text>
        </g>

        {/* ── Date card ──────────────────────────────────────────────────── */}
        <g opacity={dateCard.opacity} transform={`translate(0, ${dateCard.translateY})`}>
          <BentoCard x={60} y={420} w={300} h={80} />
          {/* Calendar icon */}
          <rect x={80} y={440} width={32} height={30} rx={4}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <line x1={80} y1={448} x2={112} y2={448} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={90} cy={460} r={3} fill={COLORS.accent} />
          <circle cx={102} cy={460} r={3} fill={COLORS.accent} />
          <text x={130} y={466} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Next Tuesday
          </text>
        </g>

        {/* ── Flight route illustration ──────────────────────────────────── */}
        <g opacity={routeCard.opacity} transform={`translate(0, ${routeCard.translateY})`}>
          <BentoCard x={60} y={530} w={960} h={340} accent />

          {/* DEL node */}
          <circle cx={200} cy={720} r={32} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={200} y={728} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            DEL
          </text>
          <text x={200} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Delhi
          </text>

          {/* LHR node */}
          <circle cx={820} cy={720} r={32} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={ringLen} strokeDashoffset={ringDash} />
          <text x={820} y={728} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            LHR
          </text>
          <text x={820} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            London
          </text>

          {/* Route arc */}
          <path d="M 230,710 C 350,560 680,560 800,710"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arcLen} strokeDashoffset={arcDash}
            strokeLinecap="round" />

          {/* Dashed baseline */}
          <line x1={240} y1={720} x2={790} y2={720}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="8,8" />

          {/* Animated plane along arc */}
          <g transform={`translate(${planeX}, ${planeY})`} opacity={interpolate(frame, [22, 28], [0, 1], { extrapolateRight: 'clamp' })}>
            {/* Simple plane shape */}
            <polygon points="0,-8 20,0 0,8 4,0"
              fill={COLORS.white} opacity={shimmer} />
            {/* Trail */}
            <line x1={0} y1={0} x2={-30} y2={0}
              stroke={COLORS.accent} strokeWidth={1.5}
              strokeDasharray="4,4" opacity={0.4} />
          </g>

          {/* Altitude label */}
          <text x={510} y={620} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={routeCard.opacity * 0.6}>
            ~6,700 km
          </text>
        </g>

        {/* ── 3 Ticket cards ─────────────────────────────────────────────── */}
        {[
          { idx: 0, ent: ticket1, price: '$412', stops: 'Non-stop', badge: 'CHEAPEST' },
          { idx: 1, ent: ticket2, price: '$428', stops: '1 Stop', badge: '' },
          { idx: 2, ent: ticket3, price: '$455', stops: '1 Stop', badge: '' },
        ].map(({ idx, ent, price, stops, badge }) => {
          const tY = 910 + idx * 180;
          return (
            <g key={idx} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={60} y={tY} w={960} h={160} accent={idx === 0} />
              {/* Left accent bar */}
              <rect x={60} y={tY} width={6} height={160} rx={3}
                fill={idx === 0 ? COLORS.accent : COLORS.text_muted} />
              {/* Number badge */}
              <circle cx={110} cy={tY + 80} r={24}
                fill={COLORS.accent} fillOpacity={idx === 0 ? 0.2 : 0.08}
                stroke={COLORS.accent} strokeWidth={idx === 0 ? 2 : 1} />
              <text x={110} y={tY + 88} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={idx === 0 ? COLORS.accent : COLORS.text_muted}>
                {idx + 1}
              </text>
              {/* Price */}
              <text x={170} y={tY + 70} fontFamily={FONT} fontSize={44} fontWeight={800}
                fill={COLORS.white}>
                {price}
              </text>
              {/* Stops */}
              <text x={170} y={tY + 115} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>
                {stops}
              </text>
              {/* Badge */}
              {badge && (
                <g>
                  <rect x={750} y={tY + 48} width={220} height={40} rx={20}
                    fill={COLORS.accent} fillOpacity={0.15}
                    stroke={COLORS.accent} strokeWidth={1.5} />
                  <text x={860} y={tY + 76} textAnchor="middle"
                    fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
                    {badge}
                  </text>
                </g>
              )}
              {/* Plane icon */}
              <polygon
                points={`${940},${tY + 78} ${960},${tY + 70} ${960},${tY + 86}`}
                fill={COLORS.text_muted} opacity={0.3} />
            </g>
          );
        })}

        {/* ── Floating particles ─────────────────────────────────────────── */}
        <g opacity={0.25}>
          <circle cx={100} cy={1580 + breathe} r={3} fill={COLORS.accent} />
          <circle cx={980} cy={1620 + breathe * 0.7} r={2.5} fill={COLORS.accent} />
          <circle cx={540} cy={1680 + breathe * 1.2} r={2} fill={COLORS.accent} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
