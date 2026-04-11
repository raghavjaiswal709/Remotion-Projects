/**
 * Scene 16 — Summary
 * "That is covariant return type."
 * CSV: 80.43s → 82.86s
 * Duration: 86 frames (2.87s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Section label + hero text spring up
 *   Phase 2 (frames 16–55):  Definition card, key points, badge
 *   Phase 3 (frames 50–end): Floating, pulse, shimmer
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

export const Scene16_Summary: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance   = useSpringEntrance(frame, 0);
  const heroWord1       = useSpringEntrance(frame, 4);
  const heroWord2       = useSpringEntrance(frame, 8);
  const heroWord3       = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const defCard         = useSpringEntrance(frame, 18);
  const summaryLine1    = useSpringEntrance(frame, 24);
  const summaryLine2    = useSpringEntrance(frame, 30);
  const summaryLine3    = useSpringEntrance(frame, 36);
  const summaryLine4    = useSpringEntrance(frame, 42);
  const badge           = useSpringEntrance(frame, 48);
  const flowCard        = useSpringEntrance(frame, 40);
  const arrowEntrance   = useSpringEntrance(frame, 46);

  // ── Path draws ────────────────────────────────────────────────────────────
  const underlineLen = 580;
  const underlineDash = usePathDraw(frame, 16, underlineLen, 20);
  const defBorderPerimeter = 2 * (960 + 220);
  const defBorderDash = interpolate(frame, [18, 42], [defBorderPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const arrowPathLen = 260;
  const arrowDash = usePathDraw(frame, 46, arrowPathLen, 20);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe   = Math.sin(frame * 0.06) * 4;
  const pulse     = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer   = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="DAY 34 · CONCEPT SUMMARY" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Hero text per-word spring ─────────────────────────── */}
        <g transform={`translate(0, ${heroWord1.translateY})`} opacity={heroWord1.opacity}>
          <text x={540} y={280} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={80} fontWeight={900}
            fill={COLORS.deep_black}>
            Covariant
          </text>
        </g>
        <g transform={`translate(0, ${heroWord2.translateY})`} opacity={heroWord2.opacity}>
          <text x={540} y={370} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={80} fontWeight={900}
            fill={COLORS.orange}>
            Return
          </text>
        </g>
        <g transform={`translate(0, ${heroWord3.translateY})`} opacity={heroWord3.opacity}>
          <text x={540} y={460} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={80} fontWeight={900}
            fill={COLORS.deep_black}>
            Type
          </text>
        </g>

        {/* Underline accent */}
        <line x1={230} y1={480} x2={850} y2={480}
          stroke={COLORS.orange} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={underlineLen}
          strokeDashoffset={underlineDash} />

        {/* ── Definition card ────────────────────────────────────────────── */}
        <g opacity={defCard.opacity} transform={`translate(60, ${530 + defCard.translateY})`}>
          <rect x={0} y={0} width={960} height={220} rx={14}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={2}
            strokeDasharray={defBorderPerimeter}
            strokeDashoffset={defBorderDash} />
          <rect x={0} y={0} width={8} height={220} rx={4} fill={COLORS.orange} />
          <text x={30} y={48} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700}
            fill={COLORS.orange}>
            DEFINITION
          </text>
          <text x={30} y={88} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
            fill={COLORS.deep_black}>
            When a child class overrides a method,
          </text>
          <text x={30} y={124} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
            fill={COLORS.deep_black}>
            it can return a more specific subtype
          </text>
          <text x={30} y={160} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
            fill={COLORS.deep_black}>
            of the original return type.
          </text>
          <text x={30} y={200} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.cool_silver}>
            Java allows narrowing, never widening.
          </text>
        </g>

        {/* ── Summary points ─────────────────────────────────────────────── */}
        {[
          { text: 'Override can narrow the return type', color: COLORS.green, ent: summaryLine1 },
          { text: 'Must be a subtype of parent return type', color: COLORS.sky_blue, ent: summaryLine2 },
          { text: 'No casting needed by the caller', color: COLORS.orange, ent: summaryLine3 },
          { text: 'Compiler enforces the contract', color: COLORS.purple, ent: summaryLine4 },
        ].map((item, i) => (
          <g key={i} opacity={item.ent.opacity}
            transform={`translate(60, ${800 + i * 80 + item.ent.translateY})`}>
            <rect x={0} y={0} width={6} height={52} rx={3} fill={item.color} />
            <text x={28} y={36} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={600}
              fill={COLORS.deep_black}>
              {item.text}
            </text>
          </g>
        ))}

        {/* ── Flow card: Engine → MaglevEngine ───────────────────────────── */}
        <g opacity={flowCard.opacity} transform={`translate(60, ${1130 + flowCard.translateY})`}>
          <rect x={0} y={0} width={960} height={120} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />

          {/* Parent box */}
          <rect x={24} y={24} width={280} height={72} rx={8}
            fill={COLORS.cool_silver} fillOpacity={0.06}
            stroke={COLORS.cool_silver} strokeWidth={1.5} />
          <text x={164} y={68} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700}
            fill={COLORS.deep_black}>
            Engine
          </text>

          {/* Arrow */}
          <g opacity={arrowEntrance.opacity}>
            <path d="M 330,60 L 530,60"
              fill="none" stroke={COLORS.orange} strokeWidth={3}
              markerEnd="url(#arrow)"
              strokeLinecap="round"
              strokeDasharray={arrowPathLen}
              strokeDashoffset={arrowDash} />
            <text x={430} y={50} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={600}
              fill={COLORS.orange}>
              NARROWS TO
            </text>
          </g>

          {/* Child box */}
          <rect x={556} y={24} width={380} height={72} rx={8}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={2} />
          <text x={746} y={68} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700}
            fill={COLORS.deep_black}>
            MaglevEngine
          </text>
        </g>

        {/* ── Badge ──────────────────────────────────────────────────────── */}
        <g
          opacity={badge.opacity * shimmer}
          transform={`translate(540, ${1320 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '540px 1320px' }}
        >
          <rect x={-180} y={-26} width={360} height={52} rx={26}
            fill={COLORS.orange} fillOpacity={0.12}
            stroke={COLORS.orange} strokeWidth={2} />
          <text textAnchor="middle" y={8}
            fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={800}
            fill={COLORS.orange}>
            COVARIANT RETURN TYPE
          </text>
        </g>

        {/* ── Decorative floating dots ───────────────────────────────────── */}
        <circle cx={120} cy={1480 + breathe * 1.2} r={5} fill={COLORS.orange} opacity={0.08} />
        <circle cx={960} cy={1500 - breathe * 0.7} r={6} fill={COLORS.green} opacity={0.07} />
        <circle cx={540} cy={1460 + breathe * 0.5} r={4} fill={COLORS.sky_blue} opacity={0.06} />

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
            sceneDuration={SCENE_TIMING.s16.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
