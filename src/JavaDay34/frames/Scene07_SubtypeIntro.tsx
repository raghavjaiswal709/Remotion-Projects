/**
 * Scene 07 — SubtypeIntro
 * "It uses a MaglevEngine, which is a subtype of Engine."
 * CSV: 31.50s → 35.20s
 * Duration: 129 frames (4.3s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + headline spring up
 *   Phase 2 (frames 20–80):  IS-A hierarchy diagram builds with path-draw connectors
 *   Phase 3 (frames 70–end): Breathing pulse on subtype indicator + glow ring
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

export const Scene07_SubtypeIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance    = useSpringEntrance(frame, 0);
  const headlineEntrance = useSpringEntrance(frame, 6);
  const sublineEntrance  = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const engineBox     = useSpringEntrance(frame, 22);
  const maglevBox     = useSpringEntrance(frame, 34);
  const arrowDraw     = usePathDraw(frame, 40, 200, 28);
  const subtypeLabel  = useSpringEntrance(frame, 50);
  const codeCard      = useSpringEntrance(frame, 58);
  const detailCard1   = useSpringEntrance(frame, 66);
  const detailCard2   = useSpringEntrance(frame, 74);

  // ── Engine box border draw ────────────────────────────────────────────────
  const enginePerimeter = 2 * (440 + 140);
  const engineBorderDash = interpolate(frame, [22, 48], [enginePerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Maglev box border draw ────────────────────────────────────────────────
  const maglevPerimeter = 2 * (440 + 140);
  const maglevBorderDash = interpolate(frame, [34, 60], [maglevPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 3;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // ── IS-A badge pulse ──────────────────────────────────────────────────────
  const badgePulse = 1 + Math.sin(frame * 0.1) * 0.04;
  const ringScale  = interpolate(frame, [55, 80], [0.8, 1.2], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ringOpacity = interpolate(frame, [55, 80], [0.6, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Connector line between boxes ──────────────────────────────────────────
  const connectorLength = 200;
  const connectorDash   = usePathDraw(frame, 40, connectorLength, 25);

  // ── Inheritance arrow path ────────────────────────────────────────────────
  const arrowPathLen = 140;
  const arrowDash    = usePathDraw(frame, 44, arrowPathLen, 22);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="INHERITANCE · SUBTYPE" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEntrance.translateY})`} opacity={headlineEntrance.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            MaglevEngine
          </text>
        </g>
        <g transform={`translate(0, ${sublineEntrance.translateY})`} opacity={sublineEntrance.opacity}>
          <text
            x={60} y={320}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={500}
            fill={COLORS.orange}
          >
            A Subtype of Engine
          </text>
        </g>

        {/* ── ZONE C — IS-A Hierarchy Diagram ────────────────────────────── */}

        {/* Parent class: Engine (top center) */}
        <g opacity={engineBox.opacity} transform={`translate(320, ${480 + engineBox.translateY})`}>
          <rect
            x={0} y={0} width={440} height={140} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={enginePerimeter}
            strokeDashoffset={engineBorderDash}
          />
          {/* Class icon */}
          <rect x={24} y={30} width={8} height={80} rx={4} fill={COLORS.sky_blue} opacity={0.3} />
          <text
            x={52} y={65}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            PARENT CLASS
          </text>
          <text
            x={52} y={110}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Engine
          </text>
        </g>

        {/* Vertical connector line Engine → MaglevEngine */}
        <path
          d="M 540,620 L 540,780"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={3}
          strokeDasharray={connectorLength}
          strokeDashoffset={connectorDash}
          strokeLinecap="round"
        />

        {/* Inheritance arrow triangle */}
        <g opacity={subtypeLabel.opacity}>
          <polygon
            points="540,780 528,756 552,756"
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        </g>

        {/* IS-A badge on connector */}
        <g
          opacity={subtypeLabel.opacity}
          transform={`translate(540, ${700 + breathe}) scale(${badgePulse})`}
          style={{ transformOrigin: '540px 700px' }}
        >
          <rect
            x={-52} y={-22}
            width={104} height={44} rx={22}
            fill={COLORS.orange}
            fillOpacity={0.15}
            stroke={COLORS.orange}
            strokeWidth={2}
          />
          <text
            x={0} y={6}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={800}
            fill={COLORS.orange}
          >
            IS-A
          </text>
        </g>

        {/* Expanding ring around IS-A badge */}
        <circle
          cx={540} cy={700}
          r={interpolate(ringScale, [0.8, 1.2], [30, 50])}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={1.5}
          opacity={ringOpacity * shimmer}
        />

        {/* Child class: MaglevEngine (below) */}
        <g opacity={maglevBox.opacity} transform={`translate(320, ${800 + maglevBox.translateY})`}>
          <rect
            x={0} y={0} width={440} height={140} rx={14}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={maglevPerimeter}
            strokeDashoffset={maglevBorderDash}
          />
          <rect x={24} y={30} width={8} height={80} rx={4} fill={COLORS.orange} opacity={0.3} />
          <text
            x={52} y={65}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            CHILD CLASS
          </text>
          <text
            x={52} y={110}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={800}
            fill={COLORS.deep_black}
          >
            MaglevEngine
          </text>
        </g>

        {/* ── Code-style declaration card ────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(60, ${1020 + codeCard.translateY})`}>
          <rect
            x={0} y={0} width={960} height={160} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.04}
          />
          <rect x={0} y={0} width={6} height={160} rx={3} fill={COLORS.orange} />
          <text
            x={36} y={55}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={30} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            // Java type hierarchy
          </text>
          <text
            x={36} y={105}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={30} fontWeight={700}
            fill={COLORS.deep_black}
          >
            {'class '}
          </text>
          <text
            x={36 + 6 * 16} y={105}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={30} fontWeight={700}
            fill={COLORS.orange}
          >
            MaglevEngine
          </text>
          <text
            x={36 + 6 * 16 + 12 * 16} y={105}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={30} fontWeight={700}
            fill={COLORS.deep_black}
          >
            {' extends '}
          </text>
          <text
            x={36 + 6 * 16 + 12 * 16 + 9 * 16} y={105}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={30} fontWeight={700}
            fill={COLORS.sky_blue}
          >
            Engine
          </text>
          <text
            x={36} y={145}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={30} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            {'{ ... }'}
          </text>
        </g>

        {/* ── Detail cards ───────────────────────────────────────────────── */}
        <g opacity={detailCard1.opacity} transform={`translate(60, ${1230 + detailCard1.translateY})`}>
          <rect
            x={0} y={0} width={440} height={200} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2}
          />
          <circle cx={36} cy={40} r={18} fill={COLORS.sky_blue} fillOpacity={0.15} />
          <text
            x={36} y={46}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={800}
            fill={COLORS.sky_blue}
          >
            P
          </text>
          <text
            x={68} y={46}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Parent Type
          </text>
          <text
            x={28} y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={800}
            fill={COLORS.sky_blue}
          >
            Engine
          </text>
          <text
            x={28} y={150}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            General purpose
          </text>
          <text
            x={28} y={184}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            return type
          </text>
        </g>

        <g opacity={detailCard2.opacity} transform={`translate(580, ${1230 + detailCard2.translateY})`}>
          <rect
            x={0} y={0} width={440} height={200} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2}
          />
          <circle cx={36} cy={40} r={18} fill={COLORS.orange} fillOpacity={0.15} />
          <text
            x={36} y={46}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={800}
            fill={COLORS.orange}
          >
            C
          </text>
          <text
            x={68} y={46}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Child Type
          </text>
          <text
            x={28} y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={800}
            fill={COLORS.orange}
          >
            MaglevEngine
          </text>
          <text
            x={28} y={150}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Specialized
          </text>
          <text
            x={28} y={184}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            subtype
          </text>
        </g>

        {/* ── Arrow between detail cards ──────────────────────────────────── */}
        <path
          d="M 500,1330 L 580,1330"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={arrowPathLen}
          strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)"
          strokeLinecap="round"
        />

        {/* ── Floating subtype keyword ───────────────────────────────────── */}
        <g
          opacity={subtypeLabel.opacity * shimmer}
          transform={`translate(540, ${1510 + breathe})`}
        >
          <text
            x={0} y={0}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.orange}
            opacity={0.4}
          >
            SUBTYPE RELATIONSHIP
          </text>
        </g>

        {/* ── Decorative floating dots ───────────────────────────────────── */}
        <circle
          cx={140} cy={1600 + breathe * 1.2}
          r={6} fill={COLORS.orange} opacity={0.12 * shimmer}
        />
        <circle
          cx={940} cy={1580 - breathe * 0.8}
          r={8} fill={COLORS.sky_blue} opacity={0.1 * shimmer}
        />
        <circle
          cx={200} cy={440 + breathe * 0.5}
          r={5} fill={COLORS.orange} opacity={0.08}
        />
        <circle
          cx={880} cy={460 - breathe * 0.6}
          r={4} fill={COLORS.sky_blue} opacity={0.1}
        />

        {/* ── Train track decorative line ────────────────────────────────── */}
        <g opacity={0.06}>
          <line x1={60} y1={1660} x2={1020} y2={1660} stroke={COLORS.deep_black} strokeWidth={2} />
          <line x1={60} y1={1668} x2={1020} y2={1668} stroke={COLORS.deep_black} strokeWidth={2} />
          {Array.from({ length: 20 }, (_, i) => (
            <line
              key={i}
              x1={80 + i * 48} y1={1656}
              x2={80 + i * 48} y2={1672}
              stroke={COLORS.deep_black}
              strokeWidth={3}
            />
          ))}
        </g>

        {/* ── Pulse ring on Engine box ───────────────────────────────────── */}
        <circle
          cx={540} cy={550}
          r={interpolate(pulse, [0.985, 1.015], [75, 82])}
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={1}
          opacity={0.1 * shimmer}
        />

        {/* ── Caption ────────────────────────────────────────────────────── */}
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
