/**
 * Scene02 — Day 32 Intro
 * "This is day 32 of learning Java from first principles."
 * CSV: 0.00s → 3.80s
 * Duration: 132 frames (4.4s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — day number springs up, series label fades
 *   Phase 2 (frames 20–80):  Content build — java logo, day counter tick, decorative elements
 *   Phase 3 (frames 70–end): Steady-state micro-animations — pulse ring, floating badge
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

// ─── Spring configs ──────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

export const Scene02_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const sceneReveal = spring({ frame, fps, config: SPRING_SOFT });
  const labelEntrance = useSpringEntrance(frame, 0);
  const seriesLabel = useSpringEntrance(frame, 4);
  const dayNumberEntrance = useSpringEntrance(frame, 8);
  const subtitleEntrance = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const badge1 = useSpringEntrance(frame, 22);
  const badge2 = useSpringEntrance(frame, 34);
  const badge3 = useSpringEntrance(frame, 46);
  const dividerDraw = usePathDraw(frame, 20, 960, 25);
  const dayCounter = useCounter(frame, 10, 32, 40);
  const ringEntrance = spring({ frame: Math.max(0, frame - 18), fps, config: SPRING_SNAP });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // ── Ring draw ──────────────────────────────────────────────────────────────
  const ringCircumference = 2 * Math.PI * 140;
  const ringProgress = interpolate(frame, [18, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const ringOffset = ringCircumference * (1 - ringProgress);

  // ── Decorative dots ────────────────────────────────────────────────────────
  const dots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r = 200;
    const cx = 540 + Math.cos(angle + frame * 0.003) * r;
    const cy = 700 + Math.sin(angle + frame * 0.003) * r;
    const dotOp = interpolate(frame, [30 + i * 3, 40 + i * 3], [0, 0.3], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return { cx, cy, opacity: dotOp * shimmer };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series anchor ──────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="NATIONAL RAILWAY SYSTEM" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Series subtitle ────────────────────────────────────── */}
        <g transform={`translate(0, ${seriesLabel.translateY})`} opacity={seriesLabel.opacity}>
          <text
            x={60} y={200}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            JAVA FROM FIRST PRINCIPLES
          </text>
        </g>

        {/* ── Divider line (path-draw) ────────────────────────────────────── */}
        <line
          x1={60} y1={240} x2={1020} y2={240}
          stroke={COLORS.deep_black}
          strokeWidth={1}
          strokeDasharray={960}
          strokeDashoffset={dividerDraw}
          opacity={0.15}
        />

        {/* ── ZONE C — Hero day number ────────────────────────────────────── */}
        {/* Decorative orbit dots */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={4} fill={COLORS.orange} opacity={d.opacity} />
        ))}

        {/* Animated ring behind day number */}
        <circle
          cx={540} cy={700} r={140}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={4}
          strokeDasharray={ringCircumference}
          strokeDashoffset={ringOffset}
          opacity={ringEntrance * 0.25}
          transform={`rotate(-90 540 700)`}
        />

        {/* Pulse ring */}
        <circle
          cx={540} cy={700} r={140}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          opacity={0.08 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '540px 700px' }}
        />

        {/* Ghost number (large, transparent) */}
        <text
          x={540} y={750}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={320} fontWeight={900}
          fill={COLORS.orange}
          opacity={dayNumberEntrance.opacity * 0.08}
        >
          {dayCounter}
        </text>

        {/* Day number (prominent) */}
        <g
          opacity={dayNumberEntrance.opacity}
          transform={`translate(0, ${dayNumberEntrance.translateY})`}
        >
          <text
            x={540} y={740}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={240} fontWeight={900}
            fill={COLORS.deep_black}
          >
            {dayCounter}
          </text>
        </g>

        {/* "DAY" label */}
        <g opacity={subtitleEntrance.opacity} transform={`translate(0, ${subtitleEntrance.translateY})`}>
          <text
            x={540} y={830}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={700}
            fill={COLORS.orange}
            letterSpacing="0.3em"
          >
            DAY
          </text>
        </g>

        {/* ── Topic badge ─────────────────────────────────────────────────── */}
        <g opacity={badge1.opacity} transform={`translate(0, ${badge1.translateY + breathe})`}>
          <rect
            x={200} y={920} width={680} height={80} rx={40}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={2}
          />
          <text
            x={540} y={970}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.deep_black}
          >
            METHOD OVERRIDING
          </text>
        </g>

        {/* ── Module badge ────────────────────────────────────────────────── */}
        <g opacity={badge2.opacity} transform={`translate(0, ${badge2.translateY})`}>
          <rect
            x={240} y={1040} width={600} height={64} rx={32}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={1.5}
          />
          <text
            x={540} y={1082}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={600}
            fill={COLORS.sky_blue}
          >
            MODULE 2 — NETWORK EXPANSION
          </text>
        </g>

        {/* ── Info row ────────────────────────────────────────────────────── */}
        <g opacity={badge3.opacity} transform={`translate(0, ${badge3.translateY})`}>
          {/* Left info */}
          <rect x={60} y={1160} width={6} height={52} rx={3} fill={COLORS.orange} />
          <text
            x={90} y={1196}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={600}
            fill={COLORS.deep_black}
          >
            Polymorphism Foundation
          </text>

          {/* Right info */}
          <rect x={60} y={1240} width={6} height={52} rx={3} fill={COLORS.green} />
          <text
            x={90} y={1276}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={600}
            fill={COLORS.deep_black}
          >
            Child Redefines Parent Behavior
          </text>

          {/* Third info */}
          <rect x={60} y={1320} width={6} height={52} rx={3} fill={COLORS.sky_blue} />
          <text
            x={90} y={1356}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={600}
            fill={COLORS.deep_black}
          >
            Runtime Method Resolution
          </text>
        </g>

        {/* ── Corner accents (floating) ───────────────────────────────────── */}
        <g opacity={0.35 * shimmer}>
          <path d="M 60,70 L 60,150 M 60,70 L 140,70" fill="none" stroke={COLORS.orange} strokeWidth={3} strokeLinecap="round" />
          <path d="M 1020,70 L 1020,150 M 1020,70 L 940,70" fill="none" stroke={COLORS.orange} strokeWidth={3} strokeLinecap="round" />
          <path d="M 60,1720 L 60,1640 M 60,1720 L 140,1720" fill="none" stroke={COLORS.orange} strokeWidth={3} strokeLinecap="round" />
          <path d="M 1020,1720 L 1020,1640 M 1020,1720 L 940,1720" fill="none" stroke={COLORS.orange} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* ── Decorative train track at bottom ────────────────────────────── */}
        <g opacity={badge3.opacity * 0.3}>
          {Array.from({ length: 18 }, (_, i) => {
            const trackX = 60 + i * 56;
            const trackOp = interpolate(frame, [50 + i * 2, 60 + i * 2], [0, 0.4], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <g key={i} opacity={trackOp}>
                <rect x={trackX} y={1500} width={36} height={6} rx={3} fill={COLORS.brown} />
              </g>
            );
          })}
          <line x1={60} y1={1510} x2={1020} y2={1510} stroke={COLORS.brown} strokeWidth={2} opacity={0.2} />
          <line x1={60} y1={1520} x2={1020} y2={1520} stroke={COLORS.brown} strokeWidth={2} opacity={0.2} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
