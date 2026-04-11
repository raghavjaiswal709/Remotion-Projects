/**
 * Scene03 — Recap Yesterday
 * "Last day, we learned how child classes can override methods
 *  they inherit from the parent."
 * CSV: 4.80s -> 9.74s
 * Duration: 166 frames (5.53s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-30):  Label + headline spring up
 *   Phase 2 (frames 20-90): Parent/child class diagram builds with path-draw connectors
 *   Phase 3 (frames 80-end): Floating accent, shimmer, pulse on override arrow
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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

export const Scene03_RecapYesterday: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Diagram build ─────────────────────────────────────────────────
  const parentBox = useSpringEntrance(frame, 22);
  const childBox = useSpringEntrance(frame, 34);
  const inheritArrow = useSpringEntrance(frame, 46);
  const overrideLabel = useSpringEntrance(frame, 58);
  const methodParent = useSpringEntrance(frame, 30);
  const methodChild = useSpringEntrance(frame, 42);
  const overrideArrowEntry = useSpringEntrance(frame, 54);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const inheritLineLen = 240;
  const inheritLineDash = usePathDraw(frame, 40, inheritLineLen, 30);
  const overrideLineLen = 300;
  const overrideLineDash = usePathDraw(frame, 56, overrideLineLen, 25);

  // ── Border-draw on parent box ──────────────────────────────────────────────
  const parentPerimeter = 2 * (400 + 280);
  const parentBorderDash = interpolate(frame, [24, 54], [parentPerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Border-draw on child box ───────────────────────────────────────────────
  const childPerimeter = 2 * (400 + 280);
  const childBorderDash = interpolate(frame, [36, 66], [childPerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Recap badge entrance ───────────────────────────────────────────────────
  const badgeEntrance = useSpringEntrance(frame, 16);
  const badgePerimeter = 2 * (220 + 48);
  const badgeBorderDash = interpolate(frame, [18, 42], [badgePerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Summary card ───────────────────────────────────────────────────────────
  const summaryCard = useSpringEntrance(frame, 70);
  const summaryPerimeter = 2 * (960 + 120);
  const summaryBorderDash = interpolate(frame, [72, 100], [summaryPerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const overridePulse = 1 + Math.sin(frame * 0.12) * 0.03;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · DAY 32" y={120} opacity={0.55} />
        </g>

        {/* ── Recap badge ─────────────────────────────────────────────────── */}
        <g
          opacity={badgeEntrance.opacity}
          transform={`translate(800, ${86 + badgeEntrance.translateY})`}
        >
          <rect
            x={0} y={0} width={220} height={48} rx={24}
            fill={COLORS.cool_silver} fillOpacity={0.1}
          />
          <rect
            x={0} y={0} width={220} height={48} rx={24}
            fill="none"
            stroke={COLORS.cool_silver} strokeWidth={1.5}
            strokeDasharray={badgePerimeter}
            strokeDashoffset={badgeBorderDash}
          />
          <text
            x={110} y={32}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600}
            fill={COLORS.cool_silver}
          >
            YESTERDAY
          </text>
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Method Overriding
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={500}
            fill={COLORS.orange}
          >
            Child classes replace parent behavior
          </text>
        </g>

        {/* ── ZONE C — Class diagram ──────────────────────────────────────── */}

        {/* Parent class box */}
        <g
          opacity={parentBox.opacity}
          transform={`translate(100, ${420 + parentBox.translateY})`}
        >
          <rect
            x={0} y={0} width={400} height={280} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.06}
          />
          <rect
            x={0} y={0} width={400} height={280} rx={16}
            fill="none"
            stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={parentPerimeter}
            strokeDashoffset={parentBorderDash}
          />
          <text
            x={200} y={52}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.sky_blue}
          >
            Train
          </text>
          <line x1={20} y1={72} x2={380} y2={72} stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.3} />

          {/* Method inside parent */}
          <g opacity={methodParent.opacity} transform={`translate(0, ${methodParent.translateY * 0.5})`}>
            <text
              x={30} y={120}
              fontFamily="'Fira Code', 'Courier New', monospace"
              fontSize={28} fontWeight={400}
              fill={COLORS.deep_black}
            >
              calculateFare()
            </text>
            <text
              x={30} y={160}
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={24} fontWeight={400}
              fill={COLORS.cool_silver}
            >
              returns base fare
            </text>
            <text
              x={30} y={200}
              fontFamily="'Fira Code', 'Courier New', monospace"
              fontSize={24} fontWeight={400}
              fill={COLORS.cool_silver}
            >
              return 100;
            </text>
          </g>
        </g>

        {/* Inheritance arrow (path draw) — vertical line from parent to child */}
        <g opacity={inheritArrow.opacity}>
          <path
            d="M 300,700 L 300,820"
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth={2.5}
            strokeDasharray={inheritLineLen}
            strokeDashoffset={inheritLineDash}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />
          <text
            x={320} y={770}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500}
            fill={COLORS.cool_silver}
            opacity={inheritArrow.opacity}
          >
            extends
          </text>
        </g>

        {/* Child class box */}
        <g
          opacity={childBox.opacity}
          transform={`translate(100, ${840 + childBox.translateY})`}
        >
          <rect
            x={0} y={0} width={400} height={280} rx={16}
            fill={COLORS.orange} fillOpacity={0.06}
          />
          <rect
            x={0} y={0} width={400} height={280} rx={16}
            fill="none"
            stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={childPerimeter}
            strokeDashoffset={childBorderDash}
          />
          <text
            x={200} y={52}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.orange}
          >
            ExpressTrain
          </text>
          <line x1={20} y1={72} x2={380} y2={72} stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />

          {/* Override method inside child */}
          <g opacity={methodChild.opacity} transform={`translate(0, ${methodChild.translateY * 0.5})`}>
            <text
              x={30} y={120}
              fontFamily="'Fira Code', 'Courier New', monospace"
              fontSize={28} fontWeight={400}
              fill={COLORS.deep_black}
            >
              calculateFare()
            </text>
            <text
              x={30} y={160}
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={24} fontWeight={400}
              fill={COLORS.cool_silver}
            >
              returns express fare
            </text>
            <text
              x={30} y={200}
              fontFamily="'Fira Code', 'Courier New', monospace"
              fontSize={24} fontWeight={400}
              fill={COLORS.cool_silver}
            >
              return 250;
            </text>
          </g>
        </g>

        {/* Override arrow — curved path from child method back to parent method */}
        <g opacity={overrideArrowEntry.opacity}>
          <path
            d="M 520,980 C 680,980 680,580 520,580"
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={3}
            strokeDasharray={overrideLineLen}
            strokeDashoffset={overrideLineDash}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
            opacity={shimmer}
          />
        </g>

        {/* OVERRIDES label */}
        <g
          opacity={overrideLabel.opacity}
          transform={`translate(0, ${overrideLabel.translateY})`}
        >
          <text
            x={700} y={780}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={800}
            fill={COLORS.orange}
            transform={`scale(${overridePulse})`}
            style={{ transformOrigin: '700px 780px' }}
          >
            OVERRIDES
          </text>
          <text
            x={700} y={820}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            same name, same params
          </text>
        </g>

        {/* ── Summary card at bottom of Zone C ────────────────────────────── */}
        <g
          opacity={summaryCard.opacity}
          transform={`translate(60, ${1320 + summaryCard.translateY})`}
        >
          <rect
            x={0} y={0} width={960} height={120} rx={12}
            fill={COLORS.green} fillOpacity={0.06}
          />
          <rect
            x={0} y={0} width={960} height={120} rx={12}
            fill="none"
            stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={summaryPerimeter}
            strokeDashoffset={summaryBorderDash}
          />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.green} />
          <text
            x={32} y={72}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={600}
            fill={COLORS.deep_black}
          >
            Child classes can replace inherited behavior
          </text>
        </g>

        {/* ── Phase 3: Floating accents ───────────────────────────────────── */}
        <g transform={`translate(${940 + breathe * 0.6}, ${460 + breathe})`}>
          <circle cx={0} cy={0} r={16} fill={COLORS.sky_blue} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.sky_blue} strokeWidth={1}
            opacity={0.15 * shimmer} transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(${80 + breathe * -0.4}, ${1560 + breathe * 1.1})`}>
          <circle cx={0} cy={0} r={12} fill={COLORS.orange} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={12} fill="none" stroke={COLORS.orange} strokeWidth={1}
            opacity={0.12 * shimmer} transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
