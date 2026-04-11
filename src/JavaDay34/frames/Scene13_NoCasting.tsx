/**
 * Scene 13 — NoCasting
 * "Code working directly with BulletTrain objects gets a MaglevEngine back, no casting required."
 * CSV: 64.03s → 70.23s
 * Duration: 197 frames (6.57s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + headline spring up
 *   Phase 2 (frames 20–100): Code comparison (with casting vs without), NO CASTING badge
 *   Phase 3 (frames 90–end): Badge pulse, floating, shimmer
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

export const Scene13_NoCasting: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance    = useSpringEntrance(frame, 0);
  const headlineEntrance = useSpringEntrance(frame, 6);
  const subEntrance      = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const withCastCard     = useSpringEntrance(frame, 20);
  const castCode1        = useSpringEntrance(frame, 28);
  const castCode2        = useSpringEntrance(frame, 34);
  const castCode3        = useSpringEntrance(frame, 40);
  const xMark            = useSpringEntrance(frame, 44);

  const noCastCard       = useSpringEntrance(frame, 50);
  const noCastCode1      = useSpringEntrance(frame, 58);
  const noCastCode2      = useSpringEntrance(frame, 64);
  const noCastCode3      = useSpringEntrance(frame, 70);
  const checkMark        = useSpringEntrance(frame, 74);

  const noCastBadge      = useSpringEntrance(frame, 80);
  const explanationCard  = useSpringEntrance(frame, 88);
  const directBenefit    = useSpringEntrance(frame, 96);

  // ── Path draws ────────────────────────────────────────────────────────────
  const xPathLen   = 60;
  const xDash      = usePathDraw(frame, 44, xPathLen, 15);
  const checkLen   = 50;
  const checkDash  = usePathDraw(frame, 74, checkLen, 15);
  const strikeLen  = 400;
  const strikeDash = usePathDraw(frame, 44, strikeLen, 20);

  // ── Border draws ──────────────────────────────────────────────────────────
  const cardPerimeterOld = 2 * (960 + 260);
  const oldBorderDash = interpolate(frame, [20, 48], [cardPerimeterOld, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const cardPerimeterNew = 2 * (960 + 260);
  const newBorderDash = interpolate(frame, [50, 78], [cardPerimeterNew, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe      = Math.sin(frame * 0.06) * 3;
  const pulse        = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer      = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const badgePulse   = 1 + Math.sin(frame * 0.1) * 0.03;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TYPE SAFETY · CLEAN CODE" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEntrance.translateY})`} opacity={headlineEntrance.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            No Casting
          </text>
          <text
            x={460} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.green}
          >
            {' '}Required
          </text>
        </g>
        <g transform={`translate(0, ${subEntrance.translateY})`} opacity={subEntrance.opacity}>
          <text
            x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            BulletTrain directly returns MaglevEngine
          </text>
        </g>

        {/* ── ZONE C — With Casting (old way) ────────────────────────────── */}
        <g opacity={withCastCard.opacity} transform={`translate(60, ${380 + withCastCard.translateY})`}>
          {/* Card background */}
          <rect x={0} y={0} width={960} height={260} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.03}
            stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray={cardPerimeterOld}
            strokeDashoffset={oldBorderDash} />

          {/* Label */}
          <rect x={0} y={0} width={200} height={38} rx={8} fill={COLORS.vibrant_red} fillOpacity={0.1} />
          <text x={16} y={26} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            WITHOUT COVARIANCE
          </text>

          {/* Code lines */}
          <g opacity={castCode1.opacity} transform={`translate(0, ${castCode1.translateY * 0.3})`}>
            <text x={24} y={76} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
              Train t = new BulletTrain();
            </text>
          </g>
          <g opacity={castCode2.opacity} transform={`translate(0, ${castCode2.translateY * 0.3})`}>
            <text x={24} y={120} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
              Engine e = t.getEngine();
            </text>
          </g>
          <g opacity={castCode3.opacity} transform={`translate(0, ${castCode3.translateY * 0.3})`}>
            <text x={24} y={164} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700} fill={COLORS.vibrant_red}>
              MaglevEngine me = (MaglevEngine) e;
            </text>
            <text x={24} y={200} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.cool_silver}>
              {'  '}// Explicit cast required — ugly and unsafe!
            </text>
          </g>

          {/* Strikethrough line */}
          <line
            x1={20} y1={164} x2={620} y2={164}
            stroke={COLORS.vibrant_red} strokeWidth={2.5}
            strokeDasharray={strikeLen}
            strokeDashoffset={strikeDash}
            opacity={0.5}
          />

          {/* X mark */}
          <g opacity={xMark.opacity} transform={`translate(900, 130)`}>
            <circle cx={0} cy={0} r={24} fill={COLORS.vibrant_red} fillOpacity={0.1} />
            <path
              d="M -10,-10 L 10,10 M 10,-10 L -10,10"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={3.5}
              strokeLinecap="round"
              strokeDasharray={xPathLen}
              strokeDashoffset={xDash}
            />
          </g>
        </g>

        {/* ── Without Casting (covariant way) ────────────────────────────── */}
        <g opacity={noCastCard.opacity} transform={`translate(60, ${680 + noCastCard.translateY})`}>
          <rect x={0} y={0} width={960} height={260} rx={12}
            fill={COLORS.green} fillOpacity={0.03}
            stroke={COLORS.green} strokeWidth={2}
            strokeDasharray={cardPerimeterNew}
            strokeDashoffset={newBorderDash} />

          {/* Label */}
          <rect x={0} y={0} width={200} height={38} rx={8} fill={COLORS.green} fillOpacity={0.1} />
          <text x={16} y={26} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
            fill={COLORS.green} letterSpacing="0.1em">
            WITH COVARIANCE
          </text>

          {/* Code lines */}
          <g opacity={noCastCode1.opacity} transform={`translate(0, ${noCastCode1.translateY * 0.3})`}>
            <text x={24} y={76} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
              BulletTrain bt = new BulletTrain();
            </text>
          </g>
          <g opacity={noCastCode2.opacity} transform={`translate(0, ${noCastCode2.translateY * 0.3})`}>
            <text x={24} y={120} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700} fill={COLORS.green}>
              MaglevEngine me = bt.getEngine();
            </text>
          </g>
          <g opacity={noCastCode3.opacity} transform={`translate(0, ${noCastCode3.translateY * 0.3})`}>
            <text x={24} y={164} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.cool_silver}>
              {'  '}// Direct — no casting needed!
            </text>
            <text x={24} y={200} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.cool_silver}>
              {'  '}// Clean, type-safe, readable
            </text>
          </g>

          {/* Check mark */}
          <g opacity={checkMark.opacity} transform={`translate(900, 130)`}>
            <circle cx={0} cy={0} r={24} fill={COLORS.green} fillOpacity={0.15} />
            <path
              d="M -10,2 L -3,10 L 12,-6"
              fill="none" stroke={COLORS.green} strokeWidth={3.5}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen}
              strokeDashoffset={checkDash}
            />
          </g>
        </g>

        {/* ── NO CASTING badge ───────────────────────────────────────────── */}
        <g
          opacity={noCastBadge.opacity * shimmer}
          transform={`translate(540, ${1000 + breathe}) scale(${badgePulse})`}
          style={{ transformOrigin: '540px 1000px' }}
        >
          <rect x={-130} y={-28} width={260} height={56} rx={28}
            fill={COLORS.green} fillOpacity={0.12}
            stroke={COLORS.green} strokeWidth={2.5} />
          <text
            textAnchor="middle" y={8}
            fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={800}
            fill={COLORS.green}
          >
            NO CASTING
          </text>
        </g>

        {/* ── Explanation card ────────────────────────────────────────────── */}
        <g opacity={explanationCard.opacity} transform={`translate(60, ${1080 + explanationCard.translateY})`}>
          <rect x={0} y={0} width={960} height={180} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <text x={36} y={48} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.sky_blue}>
            Why No Cast?
          </text>
          <text x={36} y={88} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            BulletTrain.getEngine() declares MaglevEngine
          </text>
          <text x={36} y={122} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            as the return type. The compiler already knows it.
          </text>
          <text x={36} y={158} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600} fill={COLORS.cool_silver}>
            Covariance = compiler-assisted type narrowing
          </text>
        </g>

        {/* ── Direct benefit card ────────────────────────────────────────── */}
        <g opacity={directBenefit.opacity} transform={`translate(60, ${1300 + directBenefit.translateY})`}>
          <rect x={0} y={0} width={960} height={140} rx={12}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={24} y={24} width={6} height={92} rx={3} fill={COLORS.orange} />
          <text x={50} y={58} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            Direct BulletTrain Usage
          </text>
          <text x={50} y={94} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            Caller works with BulletTrain type directly —
          </text>
          <text x={50} y={124} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            MaglevEngine returned without explicit cast.
          </text>
        </g>

        {/* ── Floating decorations ───────────────────────────────────────── */}
        <circle cx={130} cy={1540 + breathe * 1.1} r={5} fill={COLORS.green} opacity={0.1 * shimmer} />
        <circle cx={950} cy={1520 - breathe * 0.8} r={7} fill={COLORS.sky_blue} opacity={0.08} />
        <circle cx={260} cy={1560 + breathe * 0.5} r={4} fill={COLORS.orange} opacity={0.1} />

        {/* ── Track decoration ───────────────────────────────────────────── */}
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
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
