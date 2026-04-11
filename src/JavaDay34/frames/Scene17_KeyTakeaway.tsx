/**
 * Scene 17 — Key Takeaway
 * Typographic summary of the day's core concept
 * Duration: 120 frames (4s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + main headline spring in
 *   Phase 2 (frames 20–70):  Summary cards cascade, code snippet, badge
 *   Phase 3 (frames 60–end): Pulse, float, shimmer on badge and decorations
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, SectionLabel } from '../helpers/components';

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

export const Scene17_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance   = useSpringEntrance(frame, 0);
  const heroLine1       = useSpringEntrance(frame, 4);
  const heroLine2       = useSpringEntrance(frame, 10);
  const heroLine3       = useSpringEntrance(frame, 16);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const takeaway1       = useSpringEntrance(frame, 24);
  const takeaway2       = useSpringEntrance(frame, 32);
  const takeaway3       = useSpringEntrance(frame, 40);
  const codeCard        = useSpringEntrance(frame, 48);
  const badge           = useSpringEntrance(frame, 58);
  const insightCard     = useSpringEntrance(frame, 66);

  // ── Path draws ────────────────────────────────────────────────────────────
  const accentLineLen = 680;
  const accentLineDash = usePathDraw(frame, 20, accentLineLen, 18);
  const codePerimeter = 2 * (960 + 200);
  const codeBorderDash = interpolate(frame, [48, 70], [codePerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe   = Math.sin(frame * 0.06) * 4;
  const pulse     = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer   = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="KEY TAKEAWAY · DAY 34" y={120} opacity={0.55} />
        </g>

        {/* ── Hero headline ──────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroLine1.translateY})`} opacity={heroLine1.opacity}>
          <text x={540} y={280} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900}
            fill={COLORS.deep_black}>
            Override Can
          </text>
        </g>
        <g transform={`translate(0, ${heroLine2.translateY})`} opacity={heroLine2.opacity}>
          <text x={540} y={370} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900}
            fill={COLORS.orange}>
            Narrow
          </text>
        </g>
        <g transform={`translate(0, ${heroLine3.translateY})`} opacity={heroLine3.opacity}>
          <text x={540} y={450} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={600}
            fill={COLORS.cool_silver}>
            The Return Type
          </text>
        </g>

        {/* Accent line */}
        <line x1={200} y1={475} x2={880} y2={475}
          stroke={COLORS.orange} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={accentLineLen}
          strokeDashoffset={accentLineDash} />

        {/* ── Takeaway bullets ───────────────────────────────────────────── */}
        {[
          { text: 'A child override can return a more specific subtype', icon: 'N', color: COLORS.green, ent: takeaway1 },
          { text: 'The subtype IS-A parent type — contract preserved', icon: 'S', color: COLORS.sky_blue, ent: takeaway2 },
          { text: 'No casting needed — compiler guarantees the type', icon: 'C', color: COLORS.orange, ent: takeaway3 },
        ].map((item, i) => (
          <g key={i} opacity={item.ent.opacity}
            transform={`translate(60, ${530 + i * 110 + item.ent.translateY})`}>
            <rect x={0} y={0} width={960} height={88} rx={12}
              fill={item.color} fillOpacity={0.04}
              stroke={item.color} strokeWidth={1.5} />
            <circle cx={44} cy={44} r={24} fill={item.color} fillOpacity={0.1}
              stroke={item.color} strokeWidth={2} />
            <text x={44} y={52} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={800}
              fill={item.color}>
              {item.icon}
            </text>
            <text x={84} y={52} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
              fill={COLORS.deep_black}>
              {item.text}
            </text>
          </g>
        ))}

        {/* ── Code card ──────────────────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(60, ${870 + codeCard.translateY})`}>
          <rect x={0} y={0} width={960} height={200} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.orange} strokeWidth={2}
            strokeDasharray={codePerimeter}
            strokeDashoffset={codeBorderDash} />
          <rect x={0} y={0} width={8} height={200} rx={4} fill={COLORS.orange} />

          <text x={28} y={42} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
            fill={COLORS.orange}>
            COVARIANT RETURN
          </text>

          <text x={28} y={80} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400}
            fill={COLORS.cool_silver}>
            class Train {'{'} Engine getEngine(){'{'} ... {'}'} {'}'}
          </text>
          <text x={28} y={116} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400}
            fill={COLORS.deep_black}>
            class BulletTrain extends Train {'{'}
          </text>
          <text x={28} y={148} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={700}
            fill={COLORS.orange}>
            {'  '}MaglevEngine getEngine(){'{'} ... {'}'}
          </text>
          <text x={28} y={180} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400}
            fill={COLORS.deep_black}>
            {'}'}
          </text>
        </g>

        {/* ── Badge ──────────────────────────────────────────────────────── */}
        <g
          opacity={badge.opacity * shimmer}
          transform={`translate(540, ${1130 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '540px 1130px' }}
        >
          <rect x={-160} y={-24} width={320} height={48} rx={24}
            fill={COLORS.orange} fillOpacity={0.12}
            stroke={COLORS.orange} strokeWidth={2} />
          <text textAnchor="middle" y={8}
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={800}
            fill={COLORS.orange}>
            COVARIANCE = NARROWING
          </text>
        </g>

        {/* ── Insight card ───────────────────────────────────────────────── */}
        <g opacity={insightCard.opacity}
          transform={`translate(60, ${1200 + insightCard.translateY})`}>
          <rect x={0} y={0} width={960} height={140} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={16} y={16} width={6} height={108} rx={3} fill={COLORS.sky_blue} />
          <text x={40} y={50} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
            fill={COLORS.sky_blue}>
            Why It Matters
          </text>
          <text x={40} y={86} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}>
            Covariant returns allow polymorphic code to be both
          </text>
          <text x={40} y={118} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}>
            type-safe and expressive — no manual downcasting.
          </text>
        </g>

        {/* ── Floating decorations ───────────────────────────────────────── */}
        <circle cx={100} cy={1440 + breathe * 1.1} r={5} fill={COLORS.orange} opacity={0.08} />
        <circle cx={980} cy={1460 - breathe * 0.8} r={6} fill={COLORS.green} opacity={0.06} />
        <circle cx={540} cy={1480 + breathe * 0.4} r={3} fill={COLORS.sky_blue} opacity={0.05} />

        {/* ── Track decoration ───────────────────────────────────────────── */}
        <g opacity={0.04}>
          <line x1={60} y1={1680} x2={1020} y2={1680} stroke={COLORS.deep_black} strokeWidth={2} />
          <line x1={60} y1={1688} x2={1020} y2={1688} stroke={COLORS.deep_black} strokeWidth={2} />
          {Array.from({ length: 20 }, (_, i) => (
            <line key={i} x1={80 + i * 48} y1={1676} x2={80 + i * 48} y2={1692}
              stroke={COLORS.deep_black} strokeWidth={3} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
