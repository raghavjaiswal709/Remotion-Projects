/**
 * Scene16 — Key Takeaway
 * "Orion Splashdown — Physics Over Tradition"
 * Duration: 120 frames (4s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Label + headline spring entrance
 *   Phase 2 (18–70): Ghost text, 3 key point cards with unique SVG icons,
 *     path-draw connectors, summary badge
 *   Phase 3 (60–end): Breathe, pulse, shimmer, wave animation
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, ease } from '../helpers/timing';
import {
  PaperBackground, GlobalDefs, SectionLabel, CornerAccents, Divider,
} from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(
  frame: number,
  startFrame: number,
  totalLength: number,
  durationFrames = 30,
) {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
  );
  return totalLength * (1 - progress);
}

export const Scene16_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 10);
  const subline = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────
  const point1 = useSpringEntrance(frame, 20);
  const point2 = useSpringEntrance(frame, 32);
  const point3 = useSpringEntrance(frame, 44);
  const summaryCard = useSpringEntrance(frame, 56);
  const connector1 = usePathDraw(frame, 26, 120, 18);
  const connector2 = usePathDraw(frame, 38, 120, 18);
  const borderDraw1 = usePathDraw(frame, 20, 2200, 25);
  const borderDraw2 = usePathDraw(frame, 32, 2200, 25);
  const borderDraw3 = usePathDraw(frame, 44, 2200, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.82, 1],
  );
  const wavePhase = frame * 0.08;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={1080}
        height={1920}
      >
        <PaperBackground />
        <GlobalDefs />

        {/* ── Ghost background ── */}
        <text
          x={540}
          y={660}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={300}
          fontWeight={900}
          fill={COLORS.sky_blue}
          opacity={0.03}
        >
          KEY
        </text>

        {/* ── Zone A — Section label ── */}
        <g
          transform={`translate(0, ${labelEnt.translateY})`}
          opacity={labelEnt.opacity}
        >
          <SectionLabel text="KEY TAKEAWAY" y={260} opacity={0.55} />
        </g>

        {/* ── Zone B — Headline ── */}
        <g
          transform={`translate(0, ${headA.translateY})`}
          opacity={headA.opacity}
        >
          <text
            x={540}
            y={380}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56}
            fontWeight={900}
            fill={COLORS.deep_black}
          >
            Orion Splashdown
          </text>
        </g>
        <g
          transform={`translate(0, ${headB.translateY})`}
          opacity={headB.opacity}
        >
          <text
            x={540}
            y={470}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72}
            fontWeight={900}
            fill={COLORS.sky_blue}
          >
            Physics Over Tradition
          </text>
          <rect
            x={240}
            y={484}
            width={600}
            height={4}
            rx={2}
            fill={COLORS.sky_blue}
            opacity={0.3}
          />
        </g>
        <g
          transform={`translate(0, ${subline.translateY})`}
          opacity={subline.opacity * 0.6}
        >
          <text
            x={540}
            y={540}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Every system designed for one goal: crew survival
          </text>
        </g>

        {/* ═══ KEY POINT 1 — WATER ABSORBS IMPACT ═══ */}
        <g
          opacity={point1.opacity}
          transform={`translate(60, ${630 + point1.translateY})`}
        >
          {/* Card border with path-draw */}
          <rect
            x={0}
            y={0}
            width={960}
            height={160}
            rx={14}
            fill={COLORS.sky_blue}
            fillOpacity={0.05}
            stroke={COLORS.sky_blue}
            strokeWidth={2}
            strokeDasharray={2200}
            strokeDashoffset={borderDraw1}
          />
          {/* Number badge */}
          <circle
            cx={55}
            cy={80}
            r={32}
            fill={COLORS.sky_blue}
            fillOpacity={0.1}
            stroke={COLORS.sky_blue}
            strokeWidth={2.5}
          />
          <text
            x={55}
            y={90}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={900}
            fill={COLORS.sky_blue}
          >
            1
          </text>
          {/* Wave icon — 3 sine waves */}
          <g transform="translate(870, 60)">
            {[0, 1, 2].map(i => (
              <path
                key={`w-${i}`}
                d={`M -30,${i * 12} Q -15,${i * 12 - 8 + Math.sin(wavePhase + i) * 2} 0,${i * 12} Q 15,${i * 12 + 8 + Math.sin(wavePhase + i) * 2} 30,${i * 12}`}
                fill="none"
                stroke={COLORS.sky_blue}
                strokeWidth={2}
                opacity={0.5}
              />
            ))}
          </g>
          <text
            x={110}
            y={60}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={700}
            fill={COLORS.deep_black}
          >
            Water Absorbs Impact
          </text>
          <text
            x={110}
            y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Pacific Ocean spreads deceleration over time
          </text>
        </g>

        {/* Connector 1→2 */}
        <line
          x1={540}
          y1={790}
          x2={540}
          y2={880}
          stroke={COLORS.sky_blue}
          strokeWidth={2}
          opacity={0.2}
          strokeDasharray={120}
          strokeDashoffset={connector1}
        />

        {/* ═══ KEY POINT 2 — 6-CHUTE RECOVERY ═══ */}
        <g
          opacity={point2.opacity}
          transform={`translate(60, ${890 + point2.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={160}
            rx={14}
            fill={COLORS.green}
            fillOpacity={0.05}
            stroke={COLORS.green}
            strokeWidth={2}
            strokeDasharray={2200}
            strokeDashoffset={borderDraw2}
          />
          <circle
            cx={55}
            cy={80}
            r={32}
            fill={COLORS.green}
            fillOpacity={0.1}
            stroke={COLORS.green}
            strokeWidth={2.5}
          />
          <text
            x={55}
            y={90}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={900}
            fill={COLORS.green}
          >
            2
          </text>
          {/* Parachute icon */}
          <g transform="translate(870, 55)">
            <path
              d="M -20,0 Q 0,-22 20,0"
              fill={COLORS.green}
              fillOpacity={0.2}
              stroke={COLORS.green}
              strokeWidth={2}
            />
            <line
              x1={-16}
              y1={0}
              x2={0}
              y2={24}
              stroke={COLORS.green}
              strokeWidth={1.5}
            />
            <line
              x1={16}
              y1={0}
              x2={0}
              y2={24}
              stroke={COLORS.green}
              strokeWidth={1.5}
            />
            <rect
              x={-5}
              y={24}
              width={10}
              height={8}
              rx={2}
              fill={COLORS.green}
              fillOpacity={0.4}
            />
          </g>
          <text
            x={110}
            y={60}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={700}
            fill={COLORS.deep_black}
          >
            6-Chute Recovery System
          </text>
          <text
            x={110}
            y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            3 drogues + 3 mains slow Orion from Mach 33 to 10 m/s
          </text>
        </g>

        {/* Connector 2→3 */}
        <line
          x1={540}
          y1={1050}
          x2={540}
          y2={1140}
          stroke={COLORS.green}
          strokeWidth={2}
          opacity={0.2}
          strokeDasharray={120}
          strokeDashoffset={connector2}
        />

        {/* ═══ KEY POINT 3 — MODERN ENGINEERING ═══ */}
        <g
          opacity={point3.opacity}
          transform={`translate(60, ${1150 + point3.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={160}
            rx={14}
            fill={COLORS.purple}
            fillOpacity={0.05}
            stroke={COLORS.purple}
            strokeWidth={2}
            strokeDasharray={2200}
            strokeDashoffset={borderDraw3}
          />
          <circle
            cx={55}
            cy={80}
            r={32}
            fill={COLORS.purple}
            fillOpacity={0.1}
            stroke={COLORS.purple}
            strokeWidth={2.5}
          />
          <text
            x={55}
            y={90}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={900}
            fill={COLORS.purple}
          >
            3
          </text>
          {/* Circuit board / chip icon */}
          <g transform="translate(870, 55)">
            <rect
              x={-14}
              y={-14}
              width={28}
              height={28}
              rx={4}
              fill="none"
              stroke={COLORS.purple}
              strokeWidth={2}
            />
            <rect
              x={-6}
              y={-6}
              width={12}
              height={12}
              rx={2}
              fill={COLORS.purple}
              fillOpacity={0.25}
            />
            {/* Pin legs */}
            {[-10, -4, 4, 10].map(px => (
              <React.Fragment key={`pin-${px}`}>
                <line
                  x1={px}
                  y1={-14}
                  x2={px}
                  y2={-20}
                  stroke={COLORS.purple}
                  strokeWidth={1.5}
                />
                <line
                  x1={px}
                  y1={14}
                  x2={px}
                  y2={20}
                  stroke={COLORS.purple}
                  strokeWidth={1.5}
                />
              </React.Fragment>
            ))}
          </g>
          <text
            x={110}
            y={60}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={700}
            fill={COLORS.deep_black}
          >
            Modern Engineering Inside
          </text>
          <text
            x={110}
            y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            1969 shape, 2025 avionics, abort systems, life support
          </text>
        </g>

        {/* ═══ SUMMARY BADGE ═══ */}
        <g
          opacity={summaryCard.opacity}
          transform={`translate(540, ${1470 + summaryCard.translateY + breathe})`}
        >
          {/* Outer glow ring */}
          <circle
            cx={0}
            cy={0}
            r={80}
            fill={COLORS.sky_blue}
            fillOpacity={0.03 * shimmer}
            stroke={COLORS.sky_blue}
            strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}
          />
          <circle
            cx={0}
            cy={0}
            r={62}
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
            opacity={0.25}
          />
          {/* Shield + check */}
          <path
            d="M 0,-30 L -20,-14 L -20,10 Q -20,28 0,36 Q 20,28 20,10 L 20,-14 Z"
            fill={COLORS.sky_blue}
            fillOpacity={0.08}
            stroke={COLORS.sky_blue}
            strokeWidth={2}
          />
          <path
            d="M -10,4 L -3,12 L 12,-6"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Label */}
          <text
            x={0}
            y={110}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34}
            fontWeight={800}
            fill={COLORS.sky_blue}
          >
            Proven Shape + Modern Precision
          </text>
          <text
            x={0}
            y={146}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24}
            fontWeight={400}
            fill={COLORS.cool_silver}
            opacity={0.6}
          >
            NASA&apos;s next-generation crew vehicle
          </text>
        </g>

        {/* ── Corner accents ── */}
        <CornerAccents color={COLORS.sky_blue} opacity={0.4} />

        {/* ── Divider + note ── */}
        <Divider y={1840} opacity={0.1} />
        <text
          x={540}
          y={1870}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={28}
          fontWeight={400}
          fill={COLORS.cool_silver}
          opacity={0.5}
        >
          Designed for the Moon, proven by physics
        </text>
      </svg>
    </AbsoluteFill>
  );
};
