/**
 * Scene17 — Outro
 * Final scene for Day 5 (and the 5-day Artemis II series)
 * Duration: 362 frames (~12s)
 *
 * Animation phases:
 *   Phase 1 (0–30):  Label + today summary with ghost "DAY 5"
 *   Phase 2 (25–120): 3 concept cards with unique SVG icons, series badge,
 *     celebration capsule, 5-day progress bar, CTA
 *   Phase 3 (100–end): Breathe, shimmer, star twinkle, fade out
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, ease } from '../helpers/timing';
import {
  PaperBackground, GlobalDefs, SectionLabel, CornerAccents, Divider,
} from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

interface OutroProps {
  currentDay: number;
  seriesTitle: string;
}

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

// Stars seed positions
const STARS = [
  { x: 120, y: 310, r: 2.5, phase: 0 },
  { x: 940, y: 340, r: 2, phase: 1.2 },
  { x: 200, y: 1750, r: 2, phase: 2.4 },
  { x: 880, y: 1760, r: 2.5, phase: 0.8 },
  { x: 500, y: 280, r: 1.8, phase: 3.1 },
  { x: 650, y: 1780, r: 1.8, phase: 1.8 },
];

export const Scene17_Outro: React.FC<OutroProps> = ({
  currentDay,
  seriesTitle,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const todayHead = useSpringEntrance(frame, 5);
  const todaySub = useSpringEntrance(frame, 10);

  // ── Phase 2: Content build ─────────────────────────────────────────────
  const concept1 = useSpringEntrance(frame, 20);
  const concept2 = useSpringEntrance(frame, 32);
  const concept3 = useSpringEntrance(frame, 44);
  const dividerDraw = usePathDraw(frame, 50, 960, 25);
  const seriesBadge = useSpringEntrance(frame, 60);
  const completeBadge = useSpringEntrance(frame, 70);
  const dayDots = useSpringEntrance(frame, 78);
  const ctaText = useSpringEntrance(frame, 88);
  const arrowEnt = useSpringEntrance(frame, 96);
  const capsuleDraw = usePathDraw(frame, 72, 320, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────
  const breathe = Math.sin(frame * 0.05) * 4;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.02;
  const shimmer = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.82, 1],
  );

  // Fade out at end
  const fadeOut = interpolate(frame, [330, 362], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={1080}
        height={1920}
        opacity={fadeOut}
      >
        <PaperBackground />
        <GlobalDefs />

        {/* ── Corner accents ── */}
        <CornerAccents opacity={0.35} color={COLORS.sky_blue} />

        {/* ── Celebration stars (twinkle) ── */}
        {STARS.map((s, i) => {
          const twinkle = interpolate(
            Math.sin(frame * 0.09 + s.phase),
            [-1, 1],
            [0.12, 0.45],
          );
          return (
            <circle
              key={`star-${i}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={COLORS.sky_blue}
              opacity={twinkle * completeBadge.opacity}
            />
          );
        })}

        {/* ── Ghost background ── */}
        <text
          x={540}
          y={600}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={280}
          fontWeight={900}
          fill={COLORS.sky_blue}
          opacity={0.03}
        >
          DAY 5
        </text>

        {/* ── Zone A — Section label ── */}
        <g
          transform={`translate(0, ${labelEnt.translateY})`}
          opacity={labelEnt.opacity}
        >
          <SectionLabel
            text={`DAY ${currentDay} · COMPLETE`}
            y={260}
            opacity={0.55}
          />
        </g>

        {/* ── Zone B — Today summary ── */}
        <g
          transform={`translate(0, ${todayHead.translateY})`}
          opacity={todayHead.opacity}
        >
          <text
            x={540}
            y={370}
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
          transform={`translate(0, ${todaySub.translateY})`}
          opacity={todaySub.opacity * 0.6}
        >
          <text
            x={540}
            y={428}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            From re-entry to Pacific recovery
          </text>
        </g>

        {/* ═══ CONCEPT 1 — PACIFIC IMPACT — wave icon ═══ */}
        <g
          opacity={concept1.opacity}
          transform={`translate(60, ${510 + concept1.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={120}
            rx={12}
            fill={COLORS.sky_blue}
            fillOpacity={0.05}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          <rect
            x={0}
            y={0}
            width={6}
            height={120}
            rx={3}
            fill={COLORS.sky_blue}
          />
          {/* Wave icon */}
          <g transform="translate(890, 42)">
            {[0, 1, 2].map(i => (
              <path
                key={`cw-${i}`}
                d={`M -24,${i * 10} Q -12,${i * 10 - 7} 0,${i * 10} Q 12,${i * 10 + 7} 24,${i * 10}`}
                fill="none"
                stroke={COLORS.sky_blue}
                strokeWidth={2}
                opacity={0.55}
              />
            ))}
          </g>
          <text
            x={28}
            y={48}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={800}
            fill={COLORS.sky_blue}
          >
            Pacific Impact
          </text>
          <text
            x={28}
            y={88}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Water spreads deceleration force over time
          </text>
        </g>

        {/* ═══ CONCEPT 2 — 6 PARACHUTES — chute icon ═══ */}
        <g
          opacity={concept2.opacity}
          transform={`translate(60, ${650 + concept2.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={120}
            rx={12}
            fill={COLORS.green}
            fillOpacity={0.05}
            stroke={COLORS.green}
            strokeWidth={1.5}
          />
          <rect
            x={0}
            y={0}
            width={6}
            height={120}
            rx={3}
            fill={COLORS.green}
          />
          {/* Triple chute icon */}
          <g transform="translate(878, 40)">
            {[-18, 0, 18].map((dx, i) => (
              <g key={`ch-${i}`} transform={`translate(${dx}, 0)`}>
                <path
                  d="M -8,0 Q 0,-14 8,0"
                  fill={COLORS.green}
                  fillOpacity={0.2}
                  stroke={COLORS.green}
                  strokeWidth={1.5}
                />
                <line
                  x1={-6}
                  y1={0}
                  x2={0}
                  y2={14}
                  stroke={COLORS.green}
                  strokeWidth={1}
                />
                <line
                  x1={6}
                  y1={0}
                  x2={0}
                  y2={14}
                  stroke={COLORS.green}
                  strokeWidth={1}
                />
              </g>
            ))}
          </g>
          <text
            x={28}
            y={48}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={800}
            fill={COLORS.green}
          >
            6 Parachutes
          </text>
          <text
            x={28}
            y={88}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Drogues + mains slow capsule to 10 m/s
          </text>
        </g>

        {/* ═══ CONCEPT 3 — MODERN CAPSULE — chip icon ═══ */}
        <g
          opacity={concept3.opacity}
          transform={`translate(60, ${790 + concept3.translateY})`}
        >
          <rect
            x={0}
            y={0}
            width={960}
            height={120}
            rx={12}
            fill={COLORS.purple}
            fillOpacity={0.05}
            stroke={COLORS.purple}
            strokeWidth={1.5}
          />
          <rect
            x={0}
            y={0}
            width={6}
            height={120}
            rx={3}
            fill={COLORS.purple}
          />
          {/* Chip / processor icon */}
          <g transform="translate(890, 40)">
            <rect
              x={-12}
              y={-12}
              width={24}
              height={24}
              rx={3}
              fill="none"
              stroke={COLORS.purple}
              strokeWidth={2}
            />
            <rect
              x={-5}
              y={-5}
              width={10}
              height={10}
              rx={1.5}
              fill={COLORS.purple}
              fillOpacity={0.25}
            />
            {[-7, 0, 7].map(p => (
              <React.Fragment key={`pn-${p}`}>
                <line
                  x1={p}
                  y1={-12}
                  x2={p}
                  y2={-18}
                  stroke={COLORS.purple}
                  strokeWidth={1.5}
                />
                <line
                  x1={p}
                  y1={12}
                  x2={p}
                  y2={18}
                  stroke={COLORS.purple}
                  strokeWidth={1.5}
                />
              </React.Fragment>
            ))}
          </g>
          <text
            x={28}
            y={48}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={800}
            fill={COLORS.purple}
          >
            Modern Capsule
          </text>
          <text
            x={28}
            y={88}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={26}
            fontWeight={500}
            fill={COLORS.cool_silver}
          >
            1969 shape, 2025 avionics and life support
          </text>
        </g>

        {/* ── Divider ── */}
        <line
          x1={60}
          y1={960}
          x2={1020}
          y2={960}
          stroke={COLORS.deep_black}
          strokeWidth={1}
          opacity={0.1}
          strokeDasharray={960}
          strokeDashoffset={dividerDraw}
        />

        {/* ── Series badge text ── */}
        <g
          opacity={seriesBadge.opacity}
          transform={`translate(540, ${1030 + seriesBadge.translateY})`}
        >
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22}
            fontWeight={500}
            fill={COLORS.cool_silver}
            letterSpacing="0.22em"
          >
            {seriesTitle}
          </text>
        </g>

        {/* ═══ SERIES COMPLETE — capsule + check ═══ */}
        <g
          opacity={completeBadge.opacity}
          transform={`translate(540, ${1160 + completeBadge.translateY + breathe})`}
        >
          {/* Outer ring */}
          <circle
            cx={0}
            cy={0}
            r={88}
            fill={COLORS.sky_blue}
            fillOpacity={0.03 * shimmer}
            stroke={COLORS.sky_blue}
            strokeWidth={2.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}
          />
          <circle
            cx={0}
            cy={0}
            r={68}
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
            opacity={0.25}
          />
          {/* Mini capsule inside ring */}
          <path
            d="M 0,-32 L -16,-10 L -16,18 Q -16,26 0,30 Q 16,26 16,18 L 16,-10 Z"
            fill={COLORS.sky_blue}
            fillOpacity={0.1}
            stroke={COLORS.sky_blue}
            strokeWidth={2}
            strokeDasharray={320}
            strokeDashoffset={capsuleDraw}
          />
          {/* Green check over capsule */}
          <path
            d="M -12,2 L -4,12 L 14,-10"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Label */}
          <text
            x={0}
            y={120}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30}
            fontWeight={800}
            fill={COLORS.sky_blue}
          >
            5-DAY SERIES COMPLETE
          </text>
        </g>

        {/* ── 5 Day progress bar ── */}
        <g opacity={dayDots.opacity}>
          {/* Connecting line behind dots */}
          <line
            x1={340}
            y1={1360}
            x2={740}
            y2={1360}
            stroke={COLORS.sky_blue}
            strokeWidth={2}
            opacity={0.12}
          />
          {Array.from({ length: 5 }, (_, i) => {
            const cx = 340 + i * 100;
            const dotSpring = spring({
              frame: Math.max(0, frame - (78 + i * 6)),
              fps,
              config: SPRING_SNAP,
            });
            const dotScale = interpolate(dotSpring, [0, 1], [0.4, 1]);
            return (
              <g key={`dot-${i}`}>
                <circle
                  cx={cx}
                  cy={1360}
                  r={20 * dotScale}
                  fill={COLORS.sky_blue}
                  fillOpacity={0.12}
                  stroke={COLORS.sky_blue}
                  strokeWidth={2.5}
                />
                <text
                  x={cx}
                  y={1368}
                  textAnchor="middle"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={20}
                  fontWeight={900}
                  fill={COLORS.sky_blue}
                >
                  {i + 1}
                </text>
                {/* Day topic label underneath */}
                <text
                  x={cx}
                  y={1400}
                  textAnchor="middle"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={16}
                  fontWeight={500}
                  fill={COLORS.cool_silver}
                  opacity={0.6}
                >
                  {
                    ['Launch', 'Orbit', 'Moon', 'Return', 'Splash'][i]
                  }
                </text>
              </g>
            );
          })}
        </g>

        {/* ── CTA ── */}
        <g
          opacity={ctaText.opacity}
          transform={`translate(540, ${1490 + ctaText.translateY})`}
        >
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32}
            fontWeight={700}
            fill={COLORS.deep_black}
          >
            Follow for more deep dives
          </text>
        </g>

        {/* ── Arrow CTA with rocket silhouette ── */}
        <g
          opacity={arrowEnt.opacity}
          transform={`translate(540, ${1570 + arrowEnt.translateY + breathe})`}
        >
          {/* Simple rocket silhouette */}
          <path
            d="M 0,-18 L -6,-4 L -6,10 L -10,16 L -6,14 L -6,18 L 0,14 L 6,18 L 6,14 L 10,16 L 6,10 L 6,-4 Z"
            fill={COLORS.sky_blue}
            fillOpacity={0.2}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          {/* Flame */}
          <path
            d="M -3,18 Q 0,28 3,18"
            fill={COLORS.orange}
            fillOpacity={0.35 * shimmer}
            stroke="none"
          />
        </g>

        {/* ── Bottom divider + note ── */}
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
          Artemis II — Humanity returns to the Moon
        </text>
      </svg>
    </AbsoluteFill>
  );
};
