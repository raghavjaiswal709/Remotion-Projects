/**
 * Scene07 — Metro Train Distance Slabs
 * "A metro train uses distance-based slabs."
 * CSV: 23.56s → 26.64s
 * Duration: 110 frames (3.7s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Scene reveal — label + headline spring
 *   Phase 2 (frames 20–85):  Metro card build, distance slab bars, path connectors
 *   Phase 3 (frames 75–end): Micro — slab shimmer, track pulse, distance counter
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene07_MetroSlabs: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const metroCard = useSpringEntrance(frame, 16);
  const metroCardPerimeter = 2 * (960 + 180);
  const metroCardBorder = usePathDraw(frame, 16, metroCardPerimeter, 25);

  // Distance slab bars
  const SLABS = [
    { label: '0–5 km', fare: 10, color: COLORS.green, width: 180 },
    { label: '5–15 km', fare: 25, color: COLORS.sky_blue, width: 380 },
    { label: '15–30 km', fare: 40, color: COLORS.amber, width: 580 },
    { label: '30+ km', fare: 60, color: COLORS.orange, width: 780 },
  ];

  const slab0 = useSpringEntrance(frame, 24);
  const slab1 = useSpringEntrance(frame, 34);
  const slab2 = useSpringEntrance(frame, 44);
  const slab3 = useSpringEntrance(frame, 54);
  const slabSprings = [slab0, slab1, slab2, slab3];

  // Distance connector line
  const connectorLen = 740;
  const connectorDash = usePathDraw(frame, 26, connectorLen, 30);

  // Method label entrance
  const methodLabel = useSpringEntrance(frame, 22);

  // Override badge
  const overrideBadge = useSpringEntrance(frame, 40);
  const overrideBadgeScale = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: SPRING_SNAP,
  });

  // Info note card
  const noteCard = useSpringEntrance(frame, 50);
  const notePerimeter = 2 * (960 + 140);
  const noteBorder = usePathDraw(frame, 50, notePerimeter, 22);

  // Distance counter
  const distCounter = useCounter(frame, 30, 30, 35);

  // Fare counter
  const fareCounter = useCounter(frame, 40, 40, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const trackPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.3, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="POLYMORPHISM · METRO" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headlines ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Metro Train
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={305}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={38} fontWeight={500}
            fill={COLORS.green}
          >
            Distance-based fare slabs
          </text>
        </g>

        {/* ── Metro Class Card ────────────────────────────────────────────── */}
        <rect
          x={60} y={370} width={960} height={180} rx={16}
          fill="none"
          stroke={COLORS.green}
          strokeWidth={2}
          strokeDasharray={metroCardPerimeter}
          strokeDashoffset={metroCardBorder}
        />
        <rect
          x={60} y={370} width={960} height={180} rx={16}
          fill={COLORS.green}
          fillOpacity={metroCard.opacity * 0.04}
        />

        {/* Method label inside card */}
        <g opacity={methodLabel.opacity} transform={`translate(0, ${methodLabel.translateY * 0.3})`}>
          <rect x={60} y={370} width={960} height={52} rx={16} ry={0} fill={COLORS.green} fillOpacity={0.08} />
          <text
            x={540} y={403}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.green}
          >
            MetroTrain extends Train
          </text>
          <text
            x={540} y={476}
            textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={32} fontWeight={600}
            fill={COLORS.deep_black}
          >
            calculateFare(int distanceKm)
          </text>
          <text
            x={540} y={528}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Returns fare based on distance brackets
          </text>
        </g>

        {/* ── Override Badge ───────────────────────────────────────────────── */}
        <g
          opacity={overrideBadge.opacity}
          transform={`translate(810, ${370 + overrideBadge.translateY}) scale(${interpolate(overrideBadgeScale, [0, 1], [0.6, 1])})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          <rect x={0} y={-16} width={190} height={36} rx={18} fill={COLORS.green} fillOpacity={0.15} stroke={COLORS.green} strokeWidth={1.5} />
          <text
            x={95} y={6}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={700}
            fill={COLORS.green}
            letterSpacing="0.12em"
          >
            OVERRIDES
          </text>
        </g>

        {/* ── Distance connector line ─────────────────────────────────────── */}
        <path
          d={`M 160,600 L 160,${600 + 740}`}
          fill="none"
          stroke={COLORS.deep_black}
          strokeWidth={2}
          strokeDasharray={connectorLen}
          strokeDashoffset={connectorDash}
          opacity={0.12}
          strokeLinecap="round"
        />

        {/* ── Fare slab bars ──────────────────────────────────────────────── */}
        {SLABS.map((slab, i) => {
          const s = slabSprings[i];
          const barY = 620 + i * 180;
          const barWidth = interpolate(s.progress, [0, 1], [0, slab.width]);

          return (
            <g key={slab.label} opacity={s.opacity}>
              {/* Slab label */}
              <text
                x={200} y={barY + 10}
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={30} fontWeight={700}
                fill={COLORS.deep_black}
                transform={`translate(0, ${s.translateY * 0.4})`}
              >
                {slab.label}
              </text>

              {/* Animated bar */}
              <rect
                x={200} y={barY + 24}
                width={barWidth} height={36} rx={8}
                fill={slab.color}
                fillOpacity={0.2}
              />
              <rect
                x={200} y={barY + 24}
                width={barWidth} height={36} rx={8}
                fill="none"
                stroke={slab.color}
                strokeWidth={2}
              />

              {/* Fare label at end of bar */}
              <text
                x={200 + slab.width + 20}
                y={barY + 52}
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={28} fontWeight={700}
                fill={slab.color}
                opacity={s.opacity}
              >
                {slab.fare}
              </text>

              {/* Dot on connector line */}
              <circle
                cx={160} cy={barY + 40}
                r={6}
                fill={slab.color}
                opacity={s.opacity * shimmer}
              />
            </g>
          );
        })}

        {/* ── Summary note card ────────────────────────────────────────────── */}
        <rect
          x={60} y={1380} width={960} height={140} rx={14}
          fill="none"
          stroke={COLORS.amber}
          strokeWidth={1.5}
          strokeDasharray={notePerimeter}
          strokeDashoffset={noteBorder}
        />
        <rect
          x={60} y={1380} width={960} height={140} rx={14}
          fill={COLORS.amber}
          fillOpacity={noteCard.opacity * 0.04}
        />
        <g opacity={noteCard.opacity} transform={`translate(0, ${noteCard.translateY * 0.3 + breathe * 0.5})`}>
          <rect x={60} y={1380} width={6} height={140} rx={3} fill={COLORS.amber} />
          <text
            x={100} y={1430}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Distance: {distCounter} km  →  Fare: {fareCounter}
          </text>
          <text
            x={100} y={1480}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Each distance bracket has its own pricing slab
          </text>
        </g>

        {/* ── Track pulse decoration ──────────────────────────────────────── */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <rect
            key={i}
            x={80 + i * 180} y={1560}
            width={120} height={4} rx={2}
            fill={COLORS.green}
            opacity={trackPulse * 0.3}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: `${80 + i * 180 + 60}px 1562px` }}
          />
        ))}

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
