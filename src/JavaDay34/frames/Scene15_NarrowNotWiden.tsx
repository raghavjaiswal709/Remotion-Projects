/**
 * Scene 15 — NarrowNotWiden
 * "The return type can narrow, it can never widen."
 * CSV: 75.30s → 79.54s
 * Duration: 146 frames (4.87s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + headline spring up
 *   Phase 2 (frames 20–85):  Funnel diagram, rule cards, arrow connectors
 *   Phase 3 (frames 75–end): Floating, pulse, shimmer
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

export const Scene15_NarrowNotWiden: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance   = useSpringEntrance(frame, 0);
  const headlineA       = useSpringEntrance(frame, 6);
  const headlineB       = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const wideBar         = useSpringEntrance(frame, 20);
  const narrowBar       = useSpringEntrance(frame, 30);
  const funnelArrow     = useSpringEntrance(frame, 36);
  const narrowLabel     = useSpringEntrance(frame, 40);
  const widenBlock      = useSpringEntrance(frame, 48);
  const widenX          = useSpringEntrance(frame, 54);
  const ruleCard1       = useSpringEntrance(frame, 60);
  const ruleCard2       = useSpringEntrance(frame, 68);
  const ruleCard3       = useSpringEntrance(frame, 76);
  const ruleBadge       = useSpringEntrance(frame, 84);
  const insightCard     = useSpringEntrance(frame, 90);

  // ── Path draws ────────────────────────────────────────────────────────────
  const funnelLen = 200;
  const funnelDash = usePathDraw(frame, 36, funnelLen, 20);
  const xPathLen = 56;
  const xDash = usePathDraw(frame, 54, xPathLen, 12);
  const dividerLen = 960;
  const dividerDash = usePathDraw(frame, 48, dividerLen, 25);

  // ── Border draws ──────────────────────────────────────────────────────────
  const widePerimeter = 2 * (500 + 90);
  const wideBorderDash = interpolate(frame, [20, 44], [widePerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const narrowPerimeter = 2 * (320 + 90);
  const narrowBorderDash = interpolate(frame, [30, 52], [narrowPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe   = Math.sin(frame * 0.06) * 4;
  const pulse     = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer   = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TYPE NARROWING · COVARIANCE RULE" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}>
            Narrow, Not Widen
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={500}
            fill={COLORS.orange}>
            The return type direction rule
          </text>
        </g>

        {/* ── Wide bar (parent type) ─────────────────────────────────────── */}
        <g opacity={wideBar.opacity} transform={`translate(60, ${400 + wideBar.translateY})`}>
          <rect x={0} y={0} width={500} height={90} rx={12}
            fill={COLORS.cool_silver} fillOpacity={0.06}
            stroke={COLORS.cool_silver} strokeWidth={2}
            strokeDasharray={widePerimeter}
            strokeDashoffset={wideBorderDash} />
          <text x={250} y={38} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={COLORS.cool_silver}>
            PARENT RETURN TYPE
          </text>
          <text x={250} y={70} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700}
            fill={COLORS.deep_black}>
            Engine
          </text>
          <text x={520} y={55} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
            fill={COLORS.cool_silver}>
            WIDE (general)
          </text>
        </g>

        {/* ── Funnel arrows ──────────────────────────────────────────────── */}
        <g opacity={funnelArrow.opacity}>
          <path
            d="M 310,500 L 310,560 M 250,500 L 310,560 L 370,500"
            fill="none" stroke={COLORS.green} strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={funnelLen}
            strokeDashoffset={funnelDash} />
          <text x={360} y={540} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
            fill={COLORS.green} opacity={funnelArrow.opacity}>
            NARROWS
          </text>
        </g>

        {/* ── Narrow bar (child type) ────────────────────────────────────── */}
        <g opacity={narrowBar.opacity} transform={`translate(130, ${580 + narrowBar.translateY})`}>
          <rect x={0} y={0} width={320} height={90} rx={12}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={2.5}
            strokeDasharray={narrowPerimeter}
            strokeDashoffset={narrowBorderDash} />
          <text x={160} y={38} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={COLORS.green}>
            CHILD RETURN TYPE
          </text>
          <text x={160} y={70} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700}
            fill={COLORS.deep_black}>
            MaglevEngine
          </text>
          <text x={340} y={55} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
            fill={COLORS.green}>
            NARROW (specific)
          </text>
        </g>

        {/* ── NARROW label ───────────────────────────────────────────────── */}
        <g opacity={narrowLabel.opacity} transform={`translate(540, ${460 + narrowLabel.translateY})`}>
          <rect x={0} y={0} width={300} height={210} rx={12}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={12} y={12} width={6} height={186} rx={3} fill={COLORS.green} />
          <text x={32} y={48} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={COLORS.green}>
            CAN NARROW
          </text>
          <text x={32} y={80} fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={400}
            fill={COLORS.deep_black}>
            Child can return a more
          </text>
          <text x={32} y={104} fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={400}
            fill={COLORS.deep_black}>
            specific subtype of the
          </text>
          <text x={32} y={128} fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={400}
            fill={COLORS.deep_black}>
            parent's declared type.
          </text>
          <text x={32} y={164} fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={600}
            fill={COLORS.green}>
            Engine → MaglevEngine
          </text>
          <text x={32} y={192} fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={400}
            fill={COLORS.cool_silver}>
            Subtype is always valid
          </text>
        </g>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <line x1={60} y1={720} x2={1020} y2={720}
          stroke={COLORS.deep_black} strokeWidth={1}
          opacity={0.1}
          strokeDasharray={dividerLen}
          strokeDashoffset={dividerDash} />

        {/* ── CANNOT WIDEN block ─────────────────────────────────────────── */}
        <g opacity={widenBlock.opacity} transform={`translate(60, ${750 + widenBlock.translateY})`}>
          <rect x={0} y={0} width={960} height={140} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.03}
            stroke={COLORS.vibrant_red} strokeWidth={2} strokeDasharray="8 4" />
          <text x={28} y={38} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={COLORS.vibrant_red}>
            CANNOT WIDEN
          </text>
          <text x={28} y={70} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400}
            fill={COLORS.deep_black}>
            Engine getEngine() → Object  {'  '}{/* wider type */}
          </text>
          <text x={28} y={100} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={400}
            fill={COLORS.cool_silver}>
            Returning a supertype would break callers expecting Engine
          </text>
          <text x={28} y={124} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={700}
            fill={COLORS.vibrant_red}>
            COMPILE ERROR — Type mismatch
          </text>
        </g>

        {/* X over widen block */}
        <g opacity={widenX.opacity} transform="translate(960, 820)">
          <circle cx={0} cy={0} r={28} fill={COLORS.vibrant_red} fillOpacity={0.08} />
          <path d="M -12,-12 L 12,12 M 12,-12 L -12,12"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={xPathLen} strokeDashoffset={xDash} />
        </g>

        {/* ── Rule cards ─────────────────────────────────────────────────── */}
        {[
          { label: 'Child return type must be same or subtype', color: COLORS.green, ent: ruleCard1 },
          { label: 'Supertypes are not allowed as overriding returns', color: COLORS.vibrant_red, ent: ruleCard2 },
          { label: 'Java compiler enforces direction at compile time', color: COLORS.sky_blue, ent: ruleCard3 },
        ].map((item, i) => (
          <g key={i} opacity={item.ent.opacity}
            transform={`translate(60, ${940 + i * 90 + item.ent.translateY})`}>
            <rect x={0} y={0} width={960} height={72} rx={10}
              fill={item.color} fillOpacity={0.04}
              stroke={item.color} strokeWidth={1.5} />
            <rect x={0} y={0} width={6} height={72} rx={3} fill={item.color} />
            <text x={28} y={44} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600}
              fill={COLORS.deep_black}>
              {item.label}
            </text>
          </g>
        ))}

        {/* ── Rule badge ─────────────────────────────────────────────────── */}
        <g
          opacity={ruleBadge.opacity * shimmer}
          transform={`translate(540, ${1230 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '540px 1230px' }}
        >
          <rect x={-150} y={-24} width={300} height={48} rx={24}
            fill={COLORS.orange} fillOpacity={0.12}
            stroke={COLORS.orange} strokeWidth={2} />
          <text textAnchor="middle" y={8} fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={800} fill={COLORS.orange}>
            NARROW ONLY
          </text>
        </g>

        {/* ── Insight card ───────────────────────────────────────────────── */}
        <g opacity={insightCard.opacity}
          transform={`translate(60, ${1290 + insightCard.translateY})`}>
          <rect x={0} y={0} width={960} height={140} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={16} y={16} width={6} height={108} rx={3} fill={COLORS.sky_blue} />
          <text x={40} y={48} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
            fill={COLORS.sky_blue}>
            Direction Matters
          </text>
          <text x={40} y={84} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}>
            Narrowing preserves the contract (more specific = still valid).
          </text>
          <text x={40} y={116} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}>
            Widening breaks it (callers lose the guarantee).
          </text>
        </g>

        {/* ── Track decoration ───────────────────────────────────────────── */}
        <g opacity={0.04}>
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
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
