/**
 * Scene 10 — LegalBecause
 * "This is legal in Java because a MaglevEngine is still an Engine."
 * CSV: 50.00s → 55.60s
 * Duration: 186 frames (6.2s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + "Legal in Java" headline spring up
 *   Phase 2 (frames 20–100): Type hierarchy with checkmark validation, IS-A proof chain
 *   Phase 3 (frames 90–end): Pulse on checkmark, breathing elements, shimmer on badge
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

export const Scene10_LegalBecause: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance    = useSpringEntrance(frame, 0);
  const headlineEntrance = useSpringEntrance(frame, 6);
  const subEntrance      = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const proofBox       = useSpringEntrance(frame, 22);
  const maglevLabel    = useSpringEntrance(frame, 30);
  const extendsArrow   = useSpringEntrance(frame, 38);
  const engineLabel    = useSpringEntrance(frame, 46);
  const checkBadge     = useSpringEntrance(frame, 54);
  const ruleCard1      = useSpringEntrance(frame, 60);
  const ruleCard2      = useSpringEntrance(frame, 70);
  const ruleCard3      = useSpringEntrance(frame, 80);
  const legalBadge     = useSpringEntrance(frame, 88);

  // ── Summary card ──────────────────────────────────────────────────────────
  const summaryCard    = useSpringEntrance(frame, 96);

  // ── Path draws ────────────────────────────────────────────────────────────
  const arrowLen      = 200;
  const arrowDash     = usePathDraw(frame, 38, arrowLen, 24);
  const checkPathLen  = 60;
  const checkDash     = usePathDraw(frame, 54, checkPathLen, 18);

  // ── Border draws ──────────────────────────────────────────────────────────
  const proofPerimeter = 2 * (960 + 280);
  const proofBorderDash = interpolate(frame, [22, 52], [proofPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe      = Math.sin(frame * 0.06) * 3;
  const pulse        = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer      = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const checkPulse   = 1 + Math.sin(frame * 0.12) * 0.05;
  const legalGlow    = interpolate(Math.sin(frame * 0.07), [-1, 1], [0.7, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="INHERITANCE · TYPE SAFETY" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEntrance.translateY})`} opacity={headlineEntrance.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={800}
            fill={COLORS.green}
          >
            Legal in Java
          </text>
        </g>
        <g transform={`translate(0, ${subEntrance.translateY})`} opacity={subEntrance.opacity}>
          <text
            x={60} y={320}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Because MaglevEngine IS-A Engine
          </text>
        </g>

        {/* ── ZONE C — Proof Box ─────────────────────────────────────────── */}
        <g opacity={proofBox.opacity} transform={`translate(60, ${400 + proofBox.translateY})`}>
          <rect
            x={0} y={0} width={960} height={280} rx={16}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={2}
            strokeDasharray={proofPerimeter}
            strokeDashoffset={proofBorderDash}
          />
          {/* Header bar */}
          <rect x={0} y={0} width={960} height={50} rx={16} fill={COLORS.green} fillOpacity={0.08} />
          <text
            x={24} y={35}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={700}
            fill={COLORS.green}
            letterSpacing="0.12em"
          >
            TYPE HIERARCHY PROOF
          </text>
        </g>

        {/* MaglevEngine label inside proof box */}
        <g opacity={maglevLabel.opacity} transform={`translate(100, ${510 + maglevLabel.translateY})`}>
          <rect
            x={0} y={-32} width={280} height={64} rx={10}
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={2}
          />
          <text
            x={140} y={6}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={800}
            fill={COLORS.orange}
          >
            MaglevEngine
          </text>
        </g>

        {/* extends arrow */}
        <path
          d="M 400,510 L 600,510"
          fill="none"
          stroke={COLORS.green}
          strokeWidth={3}
          strokeDasharray={arrowLen}
          strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)"
          strokeLinecap="round"
        />

        {/* "extends" text on arrow */}
        <g opacity={extendsArrow.opacity}>
          <text
            x={500} y={496}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600}
            fill={COLORS.green}
          >
            extends
          </text>
        </g>

        {/* Engine label inside proof box */}
        <g opacity={engineLabel.opacity} transform={`translate(630, ${510 + engineLabel.translateY})`}>
          <rect
            x={0} y={-32} width={200} height={64} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.08}
            stroke={COLORS.sky_blue} strokeWidth={2}
          />
          <text
            x={100} y={6}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={800}
            fill={COLORS.sky_blue}
          >
            Engine
          </text>
        </g>

        {/* IS-A conclusion text */}
        <g opacity={maglevLabel.opacity}>
          <text
            x={540} y={620}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={600}
            fill={COLORS.deep_black}
          >
            Therefore: MaglevEngine IS-A Engine
          </text>
        </g>

        {/* Checkmark badge */}
        <g
          opacity={checkBadge.opacity}
          transform={`translate(540, ${650}) scale(${checkPulse})`}
          style={{ transformOrigin: '540px 650px' }}
        >
          <circle
            cx={0} cy={30} r={28}
            fill={COLORS.green} fillOpacity={0.15}
            stroke={COLORS.green} strokeWidth={2.5}
          />
          <path
            d="M -10,30 L -3,38 L 12,22"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={checkPathLen}
            strokeDashoffset={checkDash}
          />
        </g>

        {/* ── Rule cards ─────────────────────────────────────────────────── */}
        <g opacity={ruleCard1.opacity} transform={`translate(60, ${740 + ruleCard1.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={20} y={24} width={8} height={52} rx={4} fill={COLORS.sky_blue} />
          <text x={48} y={46} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600} fill={COLORS.sky_blue}>
            Rule 1: Subtype Relationship
          </text>
          <text x={48} y={80} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            MaglevEngine extends Engine — valid subtype
          </text>
        </g>

        <g opacity={ruleCard2.opacity} transform={`translate(60, ${858 + ruleCard2.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={10}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={20} y={24} width={8} height={52} rx={4} fill={COLORS.green} />
          <text x={48} y={46} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600} fill={COLORS.green}>
            Rule 2: Liskov Substitution
          </text>
          <text x={48} y={80} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            MaglevEngine can replace Engine anywhere
          </text>
        </g>

        <g opacity={ruleCard3.opacity} transform={`translate(60, ${976 + ruleCard3.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={10}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={20} y={24} width={8} height={52} rx={4} fill={COLORS.orange} />
          <text x={48} y={46} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600} fill={COLORS.orange}>
            Rule 3: Covariance Allowed
          </text>
          <text x={48} y={80} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Return type can narrow — Java compiler approves
          </text>
        </g>

        {/* ── LEGAL badge ────────────────────────────────────────────────── */}
        <g
          opacity={legalBadge.opacity * legalGlow}
          transform={`translate(540, ${1140 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '540px 1140px' }}
        >
          <rect
            x={-100} y={-30}
            width={200} height={60} rx={30}
            fill={COLORS.green} fillOpacity={0.12}
            stroke={COLORS.green} strokeWidth={2.5}
          />
          <text
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={800}
            fill={COLORS.green}
            y={8}
          >
            LEGAL
          </text>
        </g>

        {/* ── Summary card ───────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${1220 + summaryCard.translateY})`}>
          <rect
            x={0} y={0} width={960} height={160} rx={12}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={2}
          />
          <text
            x={40} y={55}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={700}
            fill={COLORS.deep_black}
          >
            A MaglevEngine is still an Engine
          </text>
          <text
            x={40} y={100}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            The subtype guarantee makes covariant returns safe.
          </text>
          <text
            x={40} y={136}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Callers expecting Engine always get a valid object.
          </text>
        </g>

        {/* ── Floating decorations ───────────────────────────────────────── */}
        <circle cx={130} cy={1480 + breathe * 1.1} r={5} fill={COLORS.green} opacity={0.1 * shimmer} />
        <circle cx={950} cy={1460 - breathe * 0.8} r={7} fill={COLORS.sky_blue} opacity={0.08 * shimmer} />
        <circle cx={200} cy={1500 + breathe * 0.5} r={4} fill={COLORS.orange} opacity={0.12} />
        <circle cx={880} cy={1520 - breathe * 0.6} r={3} fill={COLORS.green} opacity={0.1} />

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
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
