/**
 * Scene 04 — Instance Variables
 * "Every train object has its own passenger count, its own speed, its own route. Those are instance variables unique per object."
 * CSV: 17.960s → 27.480s
 * Duration: 285 frames (9.5s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Scene reveal — label slides in, headline springs up
 *   Phase 2 (frames 15–90): Three train objects appear staggered, each with unique properties
 *   Phase 3 (frames 80–end): Subtle float/pulse on train objects, property values shimmer
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
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

// Train data for each object
const TRAINS = [
  { name: 'train1', passengers: 248, speed: 120, route: 'Delhi → Mumbai', color: '#D87656' },
  { name: 'train2', passengers: 186, speed: 95, route: 'Chennai → Bangalore', color: '#76ABAE' },
  { name: 'train3', passengers: 312, speed: 140, route: 'Kolkata → Patna', color: '#93B1A6' },
];

export const Scene04_InstanceVariables: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = FPS;

  // ── Phase 1: Scene reveal ─────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headline      = useSpringEntrance(frame, 6);
  const subline       = useSpringEntrance(frame, 12);

  // ── Phase 2: Three train objects staggered ────────────────────────────────
  const train1 = useSpringEntrance(frame, 20);
  const train2 = useSpringEntrance(frame, 34);
  const train3 = useSpringEntrance(frame, 48);
  const trainCards = [train1, train2, train3];

  // Wheel path draw
  const wheelDraw1 = usePathDraw(frame, 22, 88, 20);
  const wheelDraw2 = usePathDraw(frame, 36, 88, 20);
  const wheelDraw3 = usePathDraw(frame, 50, 88, 20);
  const wheelDraws = [wheelDraw1, wheelDraw2, wheelDraw3];

  // Label card
  const labelCard = useSpringEntrance(frame, 62);

  // Track line
  const trackLen = 960;
  const trackDash = usePathDraw(frame, 15, trackLen, 35);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const float1 = Math.sin(frame * 0.05) * 3;
  const float2 = Math.sin(frame * 0.05 + 2) * 3;
  const float3 = Math.sin(frame * 0.05 + 4) * 3;
  const floats = [float1, float2, float3];
  const pulse  = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Wheel spin
  const wheelSpin = frame * 2.5;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 2 · STATIC VARIABLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────── */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Instance Variables
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            Unique per object
          </text>
        </g>

        {/* ── Decorative track line across top of Zone C ──────────────── */}
        <line x1={60} y1={440} x2={1020} y2={440}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={trackLen}
          strokeDashoffset={trackDash}
          opacity={0.3} />

        {/* ── ZONE C — Three train object cards ──────────────────────── */}
        {TRAINS.map((train, i) => {
          const cardY = 480 + i * 360;
          const tc = trainCards[i];
          const wd = wheelDraws[i];
          const fl = floats[i];
          const circumference = 2 * Math.PI * 14;

          return (
            <g key={train.name} opacity={tc.opacity}
              transform={`translate(0, ${tc.translateY + fl})`}>

              {/* Main card */}
              <BentoCard x={60} y={cardY} w={960} h={320} accent={i === 0} />

              {/* Train body illustration */}
              <rect x={100} y={cardY + 30} width={200} height={80} rx={12}
                fill={train.color} fillOpacity={0.15}
                stroke={train.color} strokeWidth={2} />
              {/* Cab */}
              <rect x={260} y={cardY + 50} width={50} height={60} rx={6}
                fill={train.color} fillOpacity={0.1}
                stroke={train.color} strokeWidth={1.5} />
              {/* Smokestack */}
              <rect x={120} y={cardY + 14} width={20} height={20} rx={4}
                fill={train.color} fillOpacity={0.2} />

              {/* Wheels with spin animation */}
              <g transform={`rotate(${wheelSpin}, ${140}, ${cardY + 126})`}>
                <circle cx={140} cy={cardY + 126} r={14}
                  fill="none" stroke={train.color} strokeWidth={2}
                  strokeDasharray={circumference}
                  strokeDashoffset={wd} />
                <line x1={140} y1={cardY + 114} x2={140} y2={cardY + 138}
                  stroke={train.color} strokeWidth={1} opacity={0.5} />
              </g>
              <g transform={`rotate(${wheelSpin}, ${240}, ${cardY + 126})`}>
                <circle cx={240} cy={cardY + 126} r={14}
                  fill="none" stroke={train.color} strokeWidth={2}
                  strokeDasharray={circumference}
                  strokeDashoffset={wd} />
                <line x1={240} y1={cardY + 114} x2={240} y2={cardY + 138}
                  stroke={train.color} strokeWidth={1} opacity={0.5} />
              </g>

              {/* Rail line under train */}
              <line x1={80} y1={cardY + 144} x2={320} y2={cardY + 144}
                stroke={train.color} strokeWidth={2} opacity={0.3} />

              {/* Object label */}
              <text x={100} y={cardY + 200}
                fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
                {train.name}
              </text>

              {/* Property labels */}
              <text x={380} y={cardY + 80}
                fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
                passengers:
              </text>
              <text x={680} y={cardY + 80}
                fontFamily={FONT} fontSize={36} fontWeight={800} fill={train.color}>
                {train.passengers}
              </text>

              <text x={380} y={cardY + 130}
                fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
                speed:
              </text>
              <text x={680} y={cardY + 130}
                fontFamily={FONT} fontSize={36} fontWeight={800} fill={train.color}>
                {train.speed} km/h
              </text>

              <text x={380} y={cardY + 180}
                fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
                route:
              </text>
              <text x={680} y={cardY + 180}
                fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
                {train.route}
              </text>

              {/* "UNIQUE" badge */}
              <rect x={380} y={cardY + 220} width={160} height={44} rx={22}
                fill={train.color} fillOpacity={0.12}
                stroke={train.color} strokeWidth={1} />
              <text x={460} y={cardY + 250} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800} fill={train.color}>
                UNIQUE
              </text>
            </g>
          );
        })}

        {/* ── Bottom label card ───────────────────────────────────────── */}
        <g opacity={labelCard.opacity} transform={`translate(0, ${labelCard.translateY})`}>
          <BentoCard x={60} y={1580} w={960} h={130} />
          <text x={540} y={1656} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted} opacity={shimmer}>
            Each object owns its own data —{' '}
            <tspan fill={COLORS.accent} fontStyle="italic">instance variables</tspan>
          </text>
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────── */}
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
