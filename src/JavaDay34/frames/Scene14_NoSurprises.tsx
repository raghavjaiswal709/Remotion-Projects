/**
 * Scene 14 — NoSurprises
 * "No surprises, no ClassCastException at runtime."
 * CSV: 70.23s → 73.66s
 * Duration: 121 frames (4.03s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + headline spring up
 *   Phase 2 (frames 20–80):  Exception explosion, shield guard, safety checklist
 *   Phase 3 (frames 70–end): Shield pulse, floating, shimmer
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
const SPRING_HEAVY  = { damping: 28, stiffness: 100, mass: 1.4 } as const;

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

export const Scene14_NoSurprises: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance     = useSpringEntrance(frame, 0);
  const headlineA         = useSpringEntrance(frame, 6);
  const headlineB         = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const exceptionBox      = useSpringEntrance(frame, 18);
  const exceptionText     = useSpringEntrance(frame, 24);
  const exceptionX        = useSpringEntrance(frame, 30);
  const vsLabel           = useSpringEntrance(frame, 32);
  const shieldBox         = useSpringEntrance(frame, 36);
  const shieldIcon        = useSpringEntrance(frame, 42);
  const shieldLabel       = useSpringEntrance(frame, 46);
  const check1            = useSpringEntrance(frame, 52);
  const check2            = useSpringEntrance(frame, 58);
  const check3            = useSpringEntrance(frame, 64);
  const safetyBadge       = useSpringEntrance(frame, 72);
  const explanationCard   = useSpringEntrance(frame, 78);

  // ── Path draws ────────────────────────────────────────────────────────────
  const xLen = 70;
  const xDash = usePathDraw(frame, 30, xLen, 15);
  const shieldPathLen = 200;
  const shieldDash = usePathDraw(frame, 42, shieldPathLen, 25);
  const checkLineLen = 40;
  const checkDash1 = usePathDraw(frame, 52, checkLineLen, 12);
  const checkDash2 = usePathDraw(frame, 58, checkLineLen, 12);
  const checkDash3 = usePathDraw(frame, 64, checkLineLen, 12);

  // ── Border draw ───────────────────────────────────────────────────────────
  const exceptionPerimeter = 2 * (960 + 240);
  const exceptionBorderDash = interpolate(frame, [18, 44], [exceptionPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe      = Math.sin(frame * 0.06) * 4;
  const pulse        = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer      = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const shieldPulse  = 1 + Math.sin(frame * 0.1) * 0.025;
  const shakeX       = frame > 24 && frame < 34
    ? Math.sin(frame * 2.2) * 6 * interpolate(frame, [24, 34], [1, 0], { extrapolateRight: 'clamp' })
    : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RUNTIME SAFETY · TYPE GUARANTEE" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800}
            fill={COLORS.deep_black}
          >
            No Surprises
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={500}
            fill={COLORS.vibrant_red}
          >
            No ClassCastException at runtime
          </text>
        </g>

        {/* ── ZONE C — Exception block (danger) ──────────────────────────── */}
        <g
          opacity={exceptionBox.opacity}
          transform={`translate(${60 + shakeX}, ${400 + exceptionBox.translateY})`}
        >
          <rect x={0} y={0} width={960} height={240} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.04}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={exceptionPerimeter}
            strokeDashoffset={exceptionBorderDash} />

          {/* Danger header bar */}
          <rect x={0} y={0} width={960} height={44} rx={12} ry={0}
            fill={COLORS.vibrant_red} fillOpacity={0.08} />
          <text x={20} y={30} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={700}
            fill={COLORS.vibrant_red}>
            ClassCastException
          </text>

          <g opacity={exceptionText.opacity}>
            <text x={24} y={84} fontFamily="'Fira Code', monospace" fontSize={23} fontWeight={400}
              fill={COLORS.deep_black}>
              Engine e = train.getEngine();
            </text>
            <text x={24} y={120} fontFamily="'Fira Code', monospace" fontSize={23} fontWeight={700}
              fill={COLORS.vibrant_red}>
              MaglevEngine me = (MaglevEngine) e;
            </text>
            <text x={24} y={160} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400}
              fill={COLORS.cool_silver}>
              {'  '}// Runtime risk: Engine may not be MaglevEngine!
            </text>
            <text x={24} y={196} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={700}
              fill={COLORS.vibrant_red}>
              {'  '}// Crash at runtime if wrong type
            </text>
          </g>

          {/* Big X */}
          <g opacity={exceptionX.opacity} transform="translate(880, 140)">
            <circle cx={0} cy={0} r={32} fill={COLORS.vibrant_red} fillOpacity={0.1} />
            <path d="M -14,-14 L 14,14 M 14,-14 L -14,14"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round"
              strokeDasharray={xLen} strokeDashoffset={xDash} />
          </g>
        </g>

        {/* ── VS divider ─────────────────────────────────────────────────── */}
        <g opacity={vsLabel.opacity}>
          <text
            x={540} y={690}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={32} fontWeight={800}
            fill={COLORS.cool_silver}
          >
            VS
          </text>
          <line x1={60} y1={700} x2={480} y2={700}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />
          <line x1={600} y1={700} x2={1020} y2={700}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />
        </g>

        {/* ── Shield / Safe block ────────────────────────────────────────── */}
        <g opacity={shieldBox.opacity} transform={`translate(60, ${740 + shieldBox.translateY})`}>
          <rect x={0} y={0} width={960} height={240} rx={12}
            fill={COLORS.green} fillOpacity={0.04}
            stroke={COLORS.green} strokeWidth={2.5} />

          {/* Shield icon */}
          <g
            opacity={shieldIcon.opacity}
            transform={`translate(480, 100) scale(${shieldPulse})`}
            style={{ transformOrigin: '480px 100px' }}
          >
            <path
              d="M 0,-60 L 50,-36 L 50,16 C 50,52 0,80 0,80 C 0,80 -50,52 -50,16 L -50,-36 Z"
              fill={COLORS.green} fillOpacity={0.08}
              stroke={COLORS.green} strokeWidth={3}
              strokeDasharray={shieldPathLen}
              strokeDashoffset={shieldDash}
            />
            <path d="M -14,6 L -4,18 L 18,-6"
              fill="none" stroke={COLORS.green} strokeWidth={4}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>

          <g opacity={shieldLabel.opacity}>
            <text x={260} y={50} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
              fill={COLORS.green}>
              Covariant Return = Compile-Time Safety
            </text>
            <text x={260} y={88} fontFamily="'Fira Code', monospace" fontSize={23} fontWeight={400}
              fill={COLORS.deep_black}>
              MaglevEngine me = bt.getEngine();
            </text>
            <text x={260} y={124} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400}
              fill={COLORS.cool_silver}>
              {'  '}// Compiler guarantees the type — no cast needed
            </text>
          </g>
        </g>

        {/* ── Safety checklist ───────────────────────────────────────────── */}
        {[
          { label: 'No runtime ClassCastException', delay: check1, dash: checkDash1 },
          { label: 'Compiler catches type mismatches', delay: check2, dash: checkDash2 },
          { label: 'Clean, predictable return types', delay: check3, dash: checkDash3 },
        ].map((item, i) => (
          <g key={i} opacity={item.delay.opacity} transform={`translate(60, ${1040 + i * 80 + item.delay.translateY})`}>
            <circle cx={22} cy={16} r={16} fill={COLORS.green} fillOpacity={0.08}
              stroke={COLORS.green} strokeWidth={2} />
            <path
              d={`M 14,18 L 20,26 L 32,8`}
              fill="none" stroke={COLORS.green} strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLineLen}
              strokeDashoffset={item.dash}
            />
            <text x={54} y={24} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={600}
              fill={COLORS.deep_black}>
              {item.label}
            </text>
          </g>
        ))}

        {/* ── Safety badge ───────────────────────────────────────────────── */}
        <g
          opacity={safetyBadge.opacity * shimmer}
          transform={`translate(540, ${1310 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '540px 1310px' }}
        >
          <rect x={-110} y={-24} width={220} height={48} rx={24}
            fill={COLORS.green} fillOpacity={0.12}
            stroke={COLORS.green} strokeWidth={2} />
          <text textAnchor="middle" y={8} fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={800} fill={COLORS.green}>
            TYPE SAFE
          </text>
        </g>

        {/* ── Explanation card ────────────────────────────────────────────── */}
        <g opacity={explanationCard.opacity} transform={`translate(60, ${1380 + explanationCard.translateY})`}>
          <rect x={0} y={0} width={960} height={120} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={20} y={20} width={6} height={80} rx={3} fill={COLORS.sky_blue} />
          <text x={44} y={52} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600}
            fill={COLORS.sky_blue}>
            Zero Surprises: Compile-Time Guarantee
          </text>
          <text x={44} y={88} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}>
            The type system ensures safety before code ever runs.
          </text>
        </g>

        {/* ── Floating decorations ───────────────────────────────────────── */}
        <circle cx={100} cy={1560 + breathe * 1.2} r={5} fill={COLORS.green} opacity={0.1 * shimmer} />
        <circle cx={980} cy={1540 - breathe * 0.8} r={6} fill={COLORS.orange} opacity={0.07} />
        <circle cx={320} cy={1580 + breathe * 0.6} r={3} fill={COLORS.sky_blue} opacity={0.08} />

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
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
