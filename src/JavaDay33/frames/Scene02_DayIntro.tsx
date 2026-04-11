/**
 * Scene02 — Day Introduction
 * "This is day 33 of learning Java from first principles."
 * CSV: 0.00s -> 4.20s
 * Duration: 144 frames (4.8s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-30):  Scene reveal — section label + headline spring up
 *   Phase 2 (frames 20-80): Hero number 33 counter + supporting card builds
 *   Phase 3 (frames 70-end): Micro-animations — pulse ring, floating accent, shimmer
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

// ─── Helper: spring-based entrance ───────────────────────────────────────────
function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

// ─── Helper: path-draw animation ─────────────────────────────────────────────
function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

// ─── Helper: animated counter ────────────────────────────────────────────────
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
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const heroNumber = useSpringEntrance(frame, 18);
  const heroGhost = useSpringEntrance(frame, 14);
  const counterValue = useCounter(frame, 20, 33, 40);
  const subtitleCard = useSpringEntrance(frame, 32);
  const card1 = useSpringEntrance(frame, 44);
  const card2 = useSpringEntrance(frame, 56);
  const card3 = useSpringEntrance(frame, 68);

  // ── Path draw ──────────────────────────────────────────────────────────────
  const connectorLength = 180;
  const connectorDash1 = usePathDraw(frame, 50, connectorLength, 25);
  const connectorDash2 = usePathDraw(frame, 62, connectorLength, 25);

  // ── Border draw on subtitle card ───────────────────────────────────────────
  const subtitlePerimeter = 2 * (960 + 120);
  const subtitleBorderDash = interpolate(frame, [34, 64], [subtitlePerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const ringPulse = 1 + Math.sin(frame * 0.1) * 0.04;
  const floatY = Math.sin(frame * 0.05) * 5;

  // ── Ring animation ─────────────────────────────────────────────────────────
  const ringOpacity = interpolate(frame, [30, 50], [0, 0.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        {/* ALWAYS FIRST — paper background */}
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Topic anchor label ─────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="NATIONAL RAILWAY · JAVA" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Primary statement ──────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Learning Java
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={320}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={500}
            fill={COLORS.orange}
          >
            From First Principles
          </text>
        </g>

        {/* ── ZONE C — Hero number "33" ───────────────────────────────────── */}
        {/* Ghost layer behind hero number */}
        <g opacity={heroGhost.opacity * 0.12}>
          <text
            x={540} y={680}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={360} fontWeight={900}
            fill={COLORS.orange}
          >
            {counterValue}
          </text>
        </g>

        {/* Main hero number with counter */}
        <g
          opacity={heroNumber.opacity}
          transform={`translate(0, ${heroNumber.translateY})`}
        >
          <text
            x={540} y={660}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={280} fontWeight={900}
            fill={COLORS.deep_black}
          >
            {counterValue}
          </text>
          <text
            x={540} y={740}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            DAY
          </text>
        </g>

        {/* Pulsing ring behind hero number */}
        <circle
          cx={540} cy={620}
          r={interpolate(ringPulse, [0.96, 1.04], [160, 172])}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          opacity={ringOpacity * shimmer}
          style={{ transformOrigin: '540px 620px' }}
        />
        <circle
          cx={540} cy={620}
          r={interpolate(ringPulse, [0.96, 1.04], [190, 206])}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={1}
          opacity={ringOpacity * 0.5 * shimmer}
        />

        {/* ── Subtitle card with animated border ─────────────────────────── */}
        <g
          opacity={subtitleCard.opacity}
          transform={`translate(60, ${840 + subtitleCard.translateY})`}
        >
          <rect
            x={0} y={0} width={960} height={120} rx={16}
            fill={COLORS.orange} fillOpacity={0.06}
          />
          <rect
            x={0} y={0} width={960} height={120} rx={16}
            fill="none"
            stroke={COLORS.orange} strokeWidth={2}
            strokeDasharray={subtitlePerimeter}
            strokeDashoffset={subtitleBorderDash}
          />
          <text
            x={480} y={72}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={700}
            fill={COLORS.deep_black}
          >
            @Override Annotation
          </text>
        </g>

        {/* ── Connector line from subtitle to cards ──────────────────────── */}
        <path
          d="M 540,980 L 540,1060"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={connectorLength}
          strokeDashoffset={connectorDash1}
          strokeLinecap="round"
          markerEnd="url(#arrow)"
        />

        {/* ── Info cards — 3 staggered ────────────────────────────────────── */}
        {/* Card 1: Series */}
        <g
          opacity={card1.opacity}
          transform={`translate(60, ${1080 + card1.translateY + floatY * 0.3})`}
        >
          <rect
            x={0} y={0} width={960} height={140} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={1.5}
          />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.sky_blue} />
          <text
            x={32} y={48}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            SERIES
          </text>
          <text
            x={32} y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={38} fontWeight={700}
            fill={COLORS.deep_black}
          >
            National Railway — Java OOPs
          </text>
        </g>

        {/* Connector between cards */}
        <path
          d="M 540,1240 L 540,1280"
          fill="none"
          stroke={COLORS.cool_silver}
          strokeWidth={1.5}
          strokeDasharray={connectorLength}
          strokeDashoffset={connectorDash2}
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Card 2: Module */}
        <g
          opacity={card2.opacity}
          transform={`translate(60, ${1290 + card2.translateY + floatY * 0.5})`}
        >
          <rect
            x={0} y={0} width={460} height={140} rx={12}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={1.5}
          />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.green} />
          <text
            x={32} y={48}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            MODULE
          </text>
          <text
            x={32} y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Polymorphism
          </text>
        </g>

        {/* Card 3: Focus */}
        <g
          opacity={card3.opacity}
          transform={`translate(560, ${1290 + card3.translateY + floatY * 0.7})`}
        >
          <rect
            x={0} y={0} width={460} height={140} rx={12}
            fill={COLORS.amber} fillOpacity={0.06}
            stroke={COLORS.amber} strokeWidth={1.5}
          />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.amber} />
          <text
            x={32} y={48}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            FOCUS
          </text>
          <text
            x={32} y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Safety Guard
          </text>
        </g>

        {/* ── Decorative floating accent circles (Phase 3) ────────────────── */}
        <g transform={`translate(${900 + breathe * 0.8}, ${480 + breathe})`}>
          <circle
            cx={0} cy={0} r={24}
            fill={COLORS.orange} fillOpacity={0.08 * shimmer}
          />
          <circle
            cx={0} cy={0} r={24}
            fill="none"
            stroke={COLORS.orange} strokeWidth={1.5}
            opacity={0.2 * shimmer}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}
          />
        </g>

        <g transform={`translate(${160 + breathe * -0.5}, ${1560 + breathe * 1.2})`}>
          <circle
            cx={0} cy={0} r={18}
            fill={COLORS.sky_blue} fillOpacity={0.06 * shimmer}
          />
          <circle
            cx={0} cy={0} r={18}
            fill="none"
            stroke={COLORS.sky_blue} strokeWidth={1}
            opacity={0.15 * shimmer}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}
          />
        </g>

        {/* ── Small tick marks at the bottom of Zone C ────────────────────── */}
        <g opacity={card3.opacity * 0.3}>
          {[0, 1, 2, 3, 4].map(i => (
            <rect
              key={i}
              x={340 + i * 80} y={1640}
              width={40} height={4} rx={2}
              fill={COLORS.orange}
              opacity={i <= Math.floor(counterValue / 7) ? 0.5 : 0.1}
            />
          ))}
          <text
            x={540} y={1690}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
            opacity={0.5}
          >
            Progress: Day {counterValue} of 105
          </text>
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
