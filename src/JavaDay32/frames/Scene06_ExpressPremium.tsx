/**
 * Scene06 — Express Train Premium Pricing
 * "Every train inherits it, but an express train has premium pricing."
 * CSV: 18.08s → 22.90s
 * Duration: 162 frames (5.4s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Scene reveal — label, headline spring
 *   Phase 2 (frames 20–90):  Two-column comparison build — Train vs ExpressTrain, arrow connector
 *   Phase 3 (frames 80–end): Micro — premium badge pulse, price counter tick, shimmer
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

export const Scene06_ExpressPremium: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  // Left column — base Train
  const leftBox = useSpringEntrance(frame, 20);
  const leftHeader = useSpringEntrance(frame, 24);
  const leftMethod = useSpringEntrance(frame, 30);
  const leftPrice = useSpringEntrance(frame, 36);

  // Right column — ExpressTrain
  const rightBox = useSpringEntrance(frame, 32);
  const rightHeader = useSpringEntrance(frame, 36);
  const rightMethod = useSpringEntrance(frame, 42);
  const rightPrice = useSpringEntrance(frame, 48);
  const premiumBadge = useSpringEntrance(frame, 54);

  // Vertical divider
  const dividerDraw = usePathDraw(frame, 22, 900, 25);

  // Arrow from left to right — "inherits but overrides"
  const arrowDraw = usePathDraw(frame, 40, 120, 18);

  // Inheritance arrow (dashed, upward)
  const inheritDraw = usePathDraw(frame, 28, 200, 22);

  // Border draws
  const leftPerimeter = 2 * (420 + 360);
  const leftBorder = usePathDraw(frame, 20, leftPerimeter, 28);
  const rightPerimeter = 2 * (420 + 360);
  const rightBorder = usePathDraw(frame, 32, rightPerimeter, 28);

  // ── Counters ───────────────────────────────────────────────────────────────
  const baseFare = useCounter(frame, 40, 100, 35);
  const premiumFare = useCounter(frame, 50, 250, 40);

  // ── Explanation card ───────────────────────────────────────────────────────
  const explainCard = useSpringEntrance(frame, 60);
  const explainPerimeter = 2 * (960 + 160);
  const explainBorder = usePathDraw(frame, 60, explainPerimeter, 26);

  // ── VS badge ───────────────────────────────────────────────────────────────
  const vsBadge = spring({ frame: Math.max(0, frame - 34), fps, config: SPRING_SNAP });
  const vsScale = interpolate(vsBadge, [0, 1], [0.5, 1]);
  const vsOpacity = interpolate(vsBadge, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const premiumGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.06, 0.15]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="INHERITANCE · OVERRIDE" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headlines ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Express Train
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={500}
            fill={COLORS.orange}
          >
            Premium pricing override
          </text>
        </g>

        {/* ── Vertical divider ────────────────────────────────────────────── */}
        <line
          x1={540} y1={380} x2={540} y2={1280}
          stroke={COLORS.deep_black}
          strokeWidth={1}
          strokeDasharray={900}
          strokeDashoffset={dividerDraw}
          opacity={0.12}
        />

        {/* ── LEFT COLUMN — Base Train ────────────────────────────────────── */}
        <rect
          x={60} y={400} width={420} height={360} rx={16}
          fill="none"
          stroke={COLORS.cool_silver}
          strokeWidth={2}
          strokeDasharray={leftPerimeter}
          strokeDashoffset={leftBorder}
        />
        <rect
          x={60} y={400} width={420} height={360} rx={16}
          fill={COLORS.cool_silver}
          fillOpacity={leftBox.opacity * 0.03}
        />

        {/* Left header */}
        <g opacity={leftHeader.opacity} transform={`translate(0, ${leftHeader.translateY * 0.3})`}>
          <rect x={60} y={400} width={420} height={60} rx={16} ry={0} fill={COLORS.cool_silver} fillOpacity={0.08} />
          <text
            x={270} y={440}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.cool_silver}
          >
            Train (Parent)
          </text>
        </g>

        {/* Left method */}
        <g opacity={leftMethod.opacity} transform={`translate(0, ${leftMethod.translateY * 0.3})`}>
          <rect x={80} y={490} width={380} height={56} rx={8} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <text
            x={270} y={526}
            textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={600}
            fill={COLORS.cool_silver}
          >
            calculateFare()
          </text>
        </g>

        {/* Left price display */}
        <g opacity={leftPrice.opacity} transform={`translate(0, ${leftPrice.translateY * 0.3})`}>
          <text
            x={270} y={630}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900}
            fill={COLORS.cool_silver}
          >
            {baseFare}
          </text>
          <text
            x={270} y={680}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            BASE FARE
          </text>
        </g>

        {/* ── RIGHT COLUMN — ExpressTrain ─────────────────────────────────── */}
        <rect
          x={600} y={400} width={420} height={360} rx={16}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={rightPerimeter}
          strokeDashoffset={rightBorder}
        />
        <rect
          x={600} y={400} width={420} height={360} rx={16}
          fill={COLORS.orange}
          fillOpacity={rightBox.opacity * 0.05}
        />

        {/* Right header */}
        <g opacity={rightHeader.opacity} transform={`translate(0, ${rightHeader.translateY * 0.3})`}>
          <rect x={600} y={400} width={420} height={60} rx={16} ry={0} fill={COLORS.orange} fillOpacity={0.1} />
          <text
            x={810} y={440}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.orange}
          >
            ExpressTrain (Child)
          </text>
        </g>

        {/* Right method — highlighted as overridden */}
        <g opacity={rightMethod.opacity} transform={`translate(0, ${rightMethod.translateY * 0.3})`}>
          <rect
            x={620} y={490} width={380} height={56} rx={8}
            fill={COLORS.orange}
            opacity={premiumGlow}
          />
          <text
            x={810} y={526}
            textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={700}
            fill={COLORS.orange}
          >
            calculateFare()
          </text>
        </g>

        {/* Right price display — premium */}
        <g opacity={rightPrice.opacity} transform={`translate(0, ${rightPrice.translateY * 0.3})`}>
          <text
            x={810} y={630}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900}
            fill={COLORS.orange}
          >
            {premiumFare}
          </text>
          <text
            x={810} y={680}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.orange}
          >
            PREMIUM FARE
          </text>
        </g>

        {/* ── VS Badge ────────────────────────────────────────────────────── */}
        <g
          opacity={vsOpacity}
          transform={`translate(540, 560) scale(${vsScale})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          <circle cx={0} cy={0} r={32} fill={COLORS.bg_paper} stroke={COLORS.deep_black} strokeWidth={2} />
          <text
            x={0} y={8}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={900}
            fill={COLORS.deep_black}
          >
            VS
          </text>
        </g>

        {/* ── Inheritance arrow (dashed, from child to parent) ────────────── */}
        <path
          d="M 810,395 C 810,340 270,340 270,395"
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={2}
          strokeDasharray={200}
          strokeDashoffset={inheritDraw}
          strokeLinecap="round"
          opacity={0.5}
        />
        <g opacity={rightBox.opacity * 0.6}>
          <text
            x={540} y={330}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600}
            fill={COLORS.sky_blue}
            letterSpacing="0.1em"
          >
            EXTENDS
          </text>
        </g>

        {/* ── Premium badge ───────────────────────────────────────────────── */}
        <g
          opacity={premiumBadge.opacity}
          transform={`translate(0, ${premiumBadge.translateY + breathe})`}
        >
          <rect
            x={660} y={780} width={300} height={50} rx={25}
            fill={COLORS.orange} fillOpacity={0.1}
            stroke={COLORS.orange} strokeWidth={1.5}
          />
          <text
            x={810} y={813}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={700}
            fill={COLORS.orange}
            letterSpacing="0.15em"
          >
            OVERRIDDEN
          </text>
        </g>

        {/* ── Horizontal comparison arrow ──────────────────────────────────── */}
        <path
          d="M 480,560 L 600,560"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={120}
          strokeDashoffset={arrowDraw}
          strokeLinecap="round"
          markerEnd="url(#arrowOrange)"
        />

        {/* ── Explanation card ─────────────────────────────────────────────── */}
        <rect
          x={60} y={870} width={960} height={160} rx={16}
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={1.5}
          strokeDasharray={explainPerimeter}
          strokeDashoffset={explainBorder}
        />
        <rect
          x={60} y={870} width={960} height={160} rx={16}
          fill={COLORS.sky_blue}
          fillOpacity={explainCard.opacity * 0.04}
        />
        <g opacity={explainCard.opacity} transform={`translate(0, ${explainCard.translateY * 0.3})`}>
          <rect x={60} y={870} width={6} height={160} rx={3} fill={COLORS.sky_blue} />
          <text
            x={100} y={925}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Same method name, different logic
          </text>
          <text
            x={100} y={975}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            ExpressTrain adds surcharge + comfort fees
          </text>
        </g>

        {/* ── Price comparison summary ─────────────────────────────────────── */}
        <g opacity={explainCard.opacity * 0.8}>
          <text
            x={540} y={1120}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.deep_black}
          >
            {baseFare} base vs {premiumFare} premium
          </text>
          <line
            x1={300} y1={1140} x2={780} y2={1140}
            stroke={COLORS.orange}
            strokeWidth={2}
            opacity={0.2}
          />
          <text
            x={540} y={1180}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            The child defines its own fare calculation
          </text>
        </g>

        {/* ── Pulse on premium column ─────────────────────────────────────── */}
        <circle
          cx={1000} cy={420} r={6}
          fill={COLORS.orange}
          opacity={0.5 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '1000px 420px' }}
        />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
