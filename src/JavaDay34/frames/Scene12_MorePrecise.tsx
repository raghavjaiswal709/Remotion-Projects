/**
 * Scene 12 — MorePrecise
 * "The child simply fulfills it with a more precise type."
 * CSV: 59.43s → 63.10s
 * Duration: 126 frames (4.2s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + headline spring up
 *   Phase 2 (frames 20–80):  Funnel from general → precise, code block, precision meter
 *   Phase 3 (frames 70–end): Meter pulse, floating dots, shimmer on badge
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

export const Scene12_MorePrecise: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance    = useSpringEntrance(frame, 0);
  const headlineA        = useSpringEntrance(frame, 6);
  const headlineB        = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const funnelTop        = useSpringEntrance(frame, 20);
  const funnelMid        = useSpringEntrance(frame, 28);
  const funnelBot        = useSpringEntrance(frame, 36);
  const arrowDown        = useSpringEntrance(frame, 32);
  const codeCard         = useSpringEntrance(frame, 44);
  const codeLine1        = useSpringEntrance(frame, 50);
  const codeLine2        = useSpringEntrance(frame, 56);
  const codeLine3        = useSpringEntrance(frame, 62);
  const meterBox         = useSpringEntrance(frame, 54);
  const precisionBadge   = useSpringEntrance(frame, 68);
  const insightCard      = useSpringEntrance(frame, 74);

  // ── Path draws ────────────────────────────────────────────────────────────
  const funnelLineLen = 320;
  const leftLineDash  = usePathDraw(frame, 28, funnelLineLen, 22);
  const rightLineDash = usePathDraw(frame, 28, funnelLineLen, 22);
  const arrowPathLen  = 120;
  const arrowDash     = usePathDraw(frame, 32, arrowPathLen, 18);

  // ── Counter (precision %) ─────────────────────────────────────────────────
  const precisionValue = useCounter(frame, 54, 100, 35);

  // ── Meter fill width ──────────────────────────────────────────────────────
  const meterWidth = interpolate(frame, [54, 89], [0, 400], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe    = Math.sin(frame * 0.06) * 3;
  const pulse      = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer    = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const meterPulse = 1 + Math.sin(frame * 0.1) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="COVARIANCE · PRECISION" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            More Precise
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={500}
            fill={COLORS.orange}
          >
            Child fulfills with specificity
          </text>
        </g>

        {/* ── ZONE C — Funnel visualization ──────────────────────────────── */}

        {/* Wide top: Engine */}
        <g opacity={funnelTop.opacity} transform={`translate(0, ${funnelTop.translateY})`}>
          <rect
            x={140} y={400} width={800} height={80} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2}
          />
          <text
            x={540} y={452}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.sky_blue}
          >
            Engine (General)
          </text>
        </g>

        {/* Funnel lines */}
        <path
          d="M 140,480 L 280,640"
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
          strokeDasharray={funnelLineLen}
          strokeDashoffset={leftLineDash}
          strokeLinecap="round" opacity={0.4}
        />
        <path
          d="M 940,480 L 800,640"
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
          strokeDasharray={funnelLineLen}
          strokeDashoffset={rightLineDash}
          strokeLinecap="round" opacity={0.4}
        />

        {/* Down arrow (center) */}
        <path
          d="M 540,490 L 540,620"
          fill="none" stroke={COLORS.orange} strokeWidth={3}
          strokeDasharray={arrowPathLen}
          strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)"
          strokeLinecap="round"
        />

        {/* "narrows" label */}
        <g opacity={arrowDown.opacity}>
          <text
            x={570} y={564}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600}
            fill={COLORS.orange}
          >
            narrows
          </text>
        </g>

        {/* Narrow bottom: MaglevEngine */}
        <g opacity={funnelBot.opacity} transform={`translate(0, ${funnelBot.translateY})`}>
          <rect
            x={280} y={640} width={520} height={80} rx={12}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={2.5}
          />
          <text
            x={540} y={692}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={800}
            fill={COLORS.orange}
          >
            MaglevEngine (Precise)
          </text>
        </g>

        {/* Middle funnel label */}
        <g opacity={funnelMid.opacity}>
          <text
            x={100} y={576}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            General
          </text>
          <text
            x={100} y={680}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={700}
            fill={COLORS.orange}
          >
            Specific
          </text>
        </g>

        {/* ── Code block ─────────────────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(60, ${780 + codeCard.translateY})`}>
          <rect x={0} y={0} width={960} height={220} rx={10}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.sky_blue} strokeWidth={0} />
          <rect x={0} y={0} width={6} height={220} rx={3} fill={COLORS.orange} />

          <g opacity={codeLine1.opacity} transform={`translate(0, ${codeLine1.translateY * 0.3})`}>
            <text x={32} y={44} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
              // Parent contract
            </text>
            <text x={32} y={76} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={600} fill={COLORS.sky_blue}>
              Engine getEngine()
            </text>
          </g>

          <g opacity={codeLine2.opacity} transform={`translate(0, ${codeLine2.translateY * 0.3})`}>
            <text x={32} y={120} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
              // Child fulfillment (more precise)
            </text>
          </g>

          <g opacity={codeLine3.opacity} transform={`translate(0, ${codeLine3.translateY * 0.3})`}>
            <text x={32} y={154} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700} fill={COLORS.orange}>
              MaglevEngine getEngine()
            </text>
            <text x={32} y={194} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.green}>
              {'  '}// Fulfills + narrows
            </text>
          </g>
        </g>

        {/* ── Precision meter ────────────────────────────────────────────── */}
        <g opacity={meterBox.opacity} transform={`translate(60, ${1050 + meterBox.translateY})`}>
          <text
            x={0} y={0}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Type Precision
          </text>

          {/* Meter track */}
          <rect x={0} y={20} width={700} height={28} rx={14}
            fill={COLORS.deep_black} fillOpacity={0.05}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.15} />

          {/* Meter fill */}
          <rect
            x={0} y={20} width={meterWidth} height={28} rx={14}
            fill={COLORS.orange} fillOpacity={0.7}
            transform={`scale(${meterPulse}, 1)`}
            style={{ transformOrigin: '0px 34px' }}
          />

          {/* Percentage counter */}
          <text
            x={730} y={44}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={900}
            fill={COLORS.orange}
          >
            {precisionValue}%
          </text>
        </g>

        {/* ── Precision badge ────────────────────────────────────────────── */}
        <g
          opacity={precisionBadge.opacity * shimmer}
          transform={`translate(540, ${1160 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '540px 1160px' }}
        >
          <rect x={-110} y={-24} width={220} height={48} rx={24}
            fill={COLORS.orange} fillOpacity={0.12}
            stroke={COLORS.orange} strokeWidth={2} />
          <text
            textAnchor="middle" y={8}
            fontFamily="'Inter', sans-serif"
            fontSize={26} fontWeight={800}
            fill={COLORS.orange}
          >
            MORE PRECISE
          </text>
        </g>

        {/* ── Insight card ───────────────────────────────────────────────── */}
        <g opacity={insightCard.opacity} transform={`translate(60, ${1240 + insightCard.translateY})`}>
          <rect x={0} y={0} width={960} height={200} rx={12}
            fill={COLORS.green} fillOpacity={0.05}
            stroke={COLORS.green} strokeWidth={2} />
          <text x={40} y={50} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.green}>
            Fulfillment, Not Violation
          </text>
          <text x={40} y={92} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            The child method doesn't change the contract —
          </text>
          <text x={40} y={126} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            it fulfills it with greater specificity.
          </text>
          <text x={40} y={170} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600} fill={COLORS.cool_silver}>
            Engine ← MaglevEngine : narrowing = always safe
          </text>
        </g>

        {/* ── Floating decorations ───────────────────────────────────────── */}
        <circle cx={120} cy={1540 + breathe * 1.1} r={5} fill={COLORS.orange} opacity={0.1 * shimmer} />
        <circle cx={960} cy={1520 - breathe * 0.8} r={7} fill={COLORS.sky_blue} opacity={0.08} />
        <circle cx={300} cy={1560 + breathe * 0.6} r={3} fill={COLORS.green} opacity={0.1} />
        <circle cx={840} cy={1550 - breathe} r={4} fill={COLORS.orange} opacity={0.07} />

        {/* ── Track accent ───────────────────────────────────────────────── */}
        <g opacity={0.05}>
          <line x1={60} y1={1680} x2={1020} y2={1680} stroke={COLORS.deep_black} strokeWidth={2} />
          <line x1={60} y1={1688} x2={1020} y2={1688} stroke={COLORS.deep_black} strokeWidth={2} />
          {Array.from({ length: 20 }, (_, i) => (
            <line key={i} x1={80 + i * 48} y1={1676} x2={80 + i * 48} y2={1692}
              stroke={COLORS.deep_black} strokeWidth={3} />
          ))}
        </g>

        {/* ── Caption ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
