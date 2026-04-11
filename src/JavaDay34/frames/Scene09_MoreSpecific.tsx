/**
 * Scene 09 — MoreSpecific
 * "The return type in the child is more specific than the return type in the parent."
 * CSV: 45.16s → 50.00s
 * Duration: 163 frames (5.4s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring entrance
 *   Phase 2 (frames 20–90):  Funnel diagram: wide (Engine) narrows to specific (MaglevEngine)
 *   Phase 3 (frames 80–end): Floating specificity gradient, pulse on "MORE SPECIFIC" badge
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene09_MoreSpecific: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance    = useSpringEntrance(frame, 0);
  const headlineEntrance = useSpringEntrance(frame, 6);
  const subEntrance      = useSpringEntrance(frame, 14);

  // ── Phase 2: Funnel diagram ────────────────────────────────────────────────
  const wideBox     = useSpringEntrance(frame, 22);
  const funnelLine1 = useSpringEntrance(frame, 32);
  const narrowBox   = useSpringEntrance(frame, 42);
  const specBadge   = useSpringEntrance(frame, 50);
  const parentLabel = useSpringEntrance(frame, 28);
  const childLabel  = useSpringEntrance(frame, 48);

  // ── Comparison cards ──────────────────────────────────────────────────────
  const compCard1   = useSpringEntrance(frame, 56);
  const compCard2   = useSpringEntrance(frame, 66);
  const compCard3   = useSpringEntrance(frame, 76);

  // ── Insight card ──────────────────────────────────────────────────────────
  const insightCard = useSpringEntrance(frame, 84);

  // ── Path draws ────────────────────────────────────────────────────────────
  const funnelLeftLen  = 280;
  const funnelRightLen = 280;
  const funnelLeftDash  = usePathDraw(frame, 32, funnelLeftLen, 25);
  const funnelRightDash = usePathDraw(frame, 34, funnelRightLen, 25);

  // ── Border draws ──────────────────────────────────────────────────────────
  const widePerimeter = 2 * (800 + 120);
  const wideBorderDash = interpolate(frame, [22, 50], [widePerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const narrowPerimeter = 2 * (500 + 120);
  const narrowBorderDash = interpolate(frame, [42, 70], [narrowPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 3;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const badgePulse = 1 + Math.sin(frame * 0.1) * 0.03;

  // ── Specificity counter ───────────────────────────────────────────────────
  const specCounter = useCounter(frame, 55, 100, 40);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="INHERITANCE · SPECIFICITY" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEntrance.translateY})`} opacity={headlineEntrance.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={800}
            fill={COLORS.deep_black}
          >
            More Specific
          </text>
        </g>
        <g transform={`translate(0, ${subEntrance.translateY})`} opacity={subEntrance.opacity}>
          <text
            x={60} y={320}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={500}
            fill={COLORS.orange}
          >
            Child narrows the return type
          </text>
        </g>

        {/* ── ZONE C — Funnel Diagram ────────────────────────────────────── */}

        {/* Wide box — Parent return type (Engine) */}
        <g opacity={wideBox.opacity} transform={`translate(140, ${460 + wideBox.translateY})`}>
          <rect
            x={0} y={0} width={800} height={120} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2.5}
            strokeDasharray={widePerimeter}
            strokeDashoffset={wideBorderDash}
          />
          <text
            x={400} y={72}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={800}
            fill={COLORS.sky_blue}
          >
            Engine
          </text>
        </g>

        {/* Parent label */}
        <g opacity={parentLabel.opacity} transform={`translate(0, ${parentLabel.translateY})`}>
          <text
            x={60} y={530}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={600}
            fill={COLORS.cool_silver}
          >
            PARENT
          </text>
        </g>

        {/* Funnel lines — converging from wide to narrow */}
        <path
          d="M 240,580 L 330,720"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={funnelLeftLen}
          strokeDashoffset={funnelLeftDash}
          strokeLinecap="round"
          opacity={0.5}
        />
        <path
          d="M 840,580 L 750,720"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={funnelRightLen}
          strokeDashoffset={funnelRightDash}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Downward arrow in center */}
        <path
          d="M 540,590 L 540,710"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={3}
          strokeDasharray={120}
          strokeDashoffset={usePathDraw(frame, 36, 120, 20)}
          markerEnd="url(#arrow)"
          strokeLinecap="round"
        />

        {/* Narrow box — Child return type (MaglevEngine) */}
        <g opacity={narrowBox.opacity} transform={`translate(290, ${730 + narrowBox.translateY})`}>
          <rect
            x={0} y={0} width={500} height={120} rx={14}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={2.5}
            strokeDasharray={narrowPerimeter}
            strokeDashoffset={narrowBorderDash}
          />
          <text
            x={250} y={72}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={800}
            fill={COLORS.orange}
          >
            MaglevEngine
          </text>
        </g>

        {/* Child label */}
        <g opacity={childLabel.opacity} transform={`translate(0, ${childLabel.translateY})`}>
          <text
            x={60} y={800}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={600}
            fill={COLORS.cool_silver}
          >
            CHILD
          </text>
        </g>

        {/* "MORE SPECIFIC" badge */}
        <g
          opacity={specBadge.opacity}
          transform={`translate(540, ${920 + breathe}) scale(${badgePulse})`}
          style={{ transformOrigin: '540px 920px' }}
        >
          <rect
            x={-120} y={-24}
            width={240} height={48} rx={24}
            fill={COLORS.orange} fillOpacity={0.15}
            stroke={COLORS.orange} strokeWidth={2}
          />
          <text
            x={0} y={7}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={800}
            fill={COLORS.orange}
          >
            MORE SPECIFIC
          </text>
        </g>

        {/* ── Comparison cards ────────────────────────────────────────────── */}
        <g opacity={compCard1.opacity} transform={`translate(60, ${1000 + compCard1.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={20} y={24} width={8} height={52} rx={4} fill={COLORS.sky_blue} />
          <text x={44} y={42} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            Parent returns
          </text>
          <text x={44} y={78} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.sky_blue}>
            Engine (broad type)
          </text>
        </g>

        <g opacity={compCard2.opacity} transform={`translate(60, ${1120 + compCard2.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={10}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={20} y={24} width={8} height={52} rx={4} fill={COLORS.orange} />
          <text x={44} y={42} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            Child returns
          </text>
          <text x={44} y={78} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.orange}>
            MaglevEngine (narrow type)
          </text>
        </g>

        <g opacity={compCard3.opacity} transform={`translate(60, ${1240 + compCard3.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={10}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={20} y={24} width={8} height={52} rx={4} fill={COLORS.green} />
          <text x={44} y={42} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            Specificity level
          </text>
          <text x={44} y={78} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.green}>
            {specCounter}% more precise
          </text>
        </g>

        {/* ── Insight card ───────────────────────────────────────────────── */}
        <g opacity={insightCard.opacity} transform={`translate(60, ${1390 + insightCard.translateY})`}>
          <rect
            x={0} y={0} width={960} height={130} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2}
          />
          <text
            x={40} y={50}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Narrowing preserves compatibility
          </text>
          <text
            x={40} y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Every MaglevEngine IS-A Engine — the contract holds
          </text>
        </g>

        {/* ── Floating decorations ───────────────────────────────────────── */}
        <circle cx={120} cy={1590 + breathe * 1.2} r={5} fill={COLORS.orange} opacity={0.1 * shimmer} />
        <circle cx={960} cy={1610 - breathe * 0.9} r={6} fill={COLORS.sky_blue} opacity={0.08 * shimmer} />
        <circle cx={540} cy={1570 + breathe * 0.5} r={4} fill={COLORS.green} opacity={0.12} />

        {/* ── Pulse ring ─────────────────────────────────────────────────── */}
        <circle
          cx={540} cy={790}
          r={interpolate(pulse, [0.985, 1.015], [50, 56])}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={1}
          opacity={0.08 * shimmer}
        />

        {/* ── Track decoration ───────────────────────────────────────────── */}
        <g opacity={0.05}>
          <line x1={60} y1={1680} x2={1020} y2={1680} stroke={COLORS.deep_black} strokeWidth={2} />
          <line x1={60} y1={1688} x2={1020} y2={1688} stroke={COLORS.deep_black} strokeWidth={2} />
          {Array.from({ length: 20 }, (_, i) => (
            <line
              key={i}
              x1={80 + i * 48} y1={1676}
              x2={80 + i * 48} y2={1692}
              stroke={COLORS.deep_black}
              strokeWidth={3}
            />
          ))}
        </g>

        {/* ── Caption ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
