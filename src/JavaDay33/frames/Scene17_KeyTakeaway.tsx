/**
 * Scene17 — KeyTakeaway
 * Duration: 120 frames (4.0s)
 * Core message: @Override makes the compiler verify your override is real.
 *
 * Animation phases:
 *   Phase 1 (frames 0-25):  Label + hero @Override spring
 *   Phase 2 (frames 20-70): Key points with staggered entrance, path-draw connectors
 *   Phase 3 (frames 65-end): Breathe, shimmer, pulse micro-animations
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

export const Scene17_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);

  const heroF = Math.max(0, frame - 6);
  const heroProg = spring({ frame: heroF, fps: 30, config: SPRING_SNAP });
  const heroOp = interpolate(heroF, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const heroScale = interpolate(heroProg, [0, 1], [0.6, 1]);

  const subtitle = useSpringEntrance(frame, 14);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const divLineLen = 900;
  const divLineDash = usePathDraw(frame, 18, divLineLen, 14);

  const point1 = useSpringEntrance(frame, 24);
  const point2 = useSpringEntrance(frame, 36);
  const point3 = useSpringEntrance(frame, 48);

  const barLen = 80;
  const bar1Dash = usePathDraw(frame, 26, barLen, 8);
  const bar2Dash = usePathDraw(frame, 38, barLen, 8);
  const bar3Dash = usePathDraw(frame, 50, barLen, 8);

  // Bottom summary card
  const summaryCard = useSpringEntrance(frame, 58);
  const summaryPerim = 2 * (960 + 100);
  const summaryBorder = usePathDraw(frame, 60, summaryPerim, 16);

  // Rule line
  const ruleLineLen = 400;
  const ruleLineDash = usePathDraw(frame, 66, ruleLineLen, 10);

  const ruleText = useSpringEntrance(frame, 70);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="KEY TAKEAWAY" y={120} opacity={0.55} />
        </g>

        {/* ── Hero @Override ──────────────────────────────────────────────── */}
        <g opacity={heroOp} transform={`translate(540, 340) scale(${heroScale})`}
          style={{ transformOrigin: '540px 340px' }}>
          {/* Ghost */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Fira Code', monospace"
            fontSize={110} fontWeight={900} fill={COLORS.orange} opacity={0.08}>
            @Override
          </text>
          {/* Main */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Fira Code', monospace"
            fontSize={96} fontWeight={900} fill={COLORS.orange}>
            @Override
          </text>
        </g>

        {/* Subtitle */}
        <g opacity={subtitle.opacity} transform={`translate(0, ${subtitle.translateY})`}>
          <text x={540} y={430} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={36} fontWeight={500} fill={COLORS.cool_silver}>
            Compile-time override verification
          </text>
        </g>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <line x1={60} y1={480} x2={1020} y2={480}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.12}
          strokeDasharray={divLineLen} strokeDashoffset={divLineDash}
          strokeLinecap="round" />

        {/* ── Key points ──────────────────────────────────────────────────── */}
        <g opacity={point1.opacity} transform={`translate(60, ${530 + point1.translateY})`}>
          <line x1={0} y1={0} x2={0} y2={60}
            stroke={COLORS.orange} strokeWidth={5}
            strokeDasharray={barLen} strokeDashoffset={bar1Dash}
            strokeLinecap="round" />
          <text x={24} y={22} fontFamily="'Inter', sans-serif" fontSize={30}
            fontWeight={700} fill={COLORS.deep_black}>
            Place above overriding method
          </text>
          <text x={24} y={56} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={400} fill={COLORS.cool_silver}>
            Tells the compiler: "check this override"
          </text>
        </g>

        <g opacity={point2.opacity} transform={`translate(60, ${640 + point2.translateY})`}>
          <line x1={0} y1={0} x2={0} y2={60}
            stroke={COLORS.sky_blue} strokeWidth={5}
            strokeDasharray={barLen} strokeDashoffset={bar2Dash}
            strokeLinecap="round" />
          <text x={24} y={22} fontFamily="'Inter', sans-serif" fontSize={30}
            fontWeight={700} fill={COLORS.deep_black}>
            Catches typos at compile time
          </text>
          <text x={24} y={56} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={400} fill={COLORS.cool_silver}>
            No more silent runtime bugs from name mismatches
          </text>
        </g>

        <g opacity={point3.opacity} transform={`translate(60, ${750 + point3.translateY})`}>
          <line x1={0} y1={0} x2={0} y2={60}
            stroke={COLORS.green} strokeWidth={5}
            strokeDasharray={barLen} strokeDashoffset={bar3Dash}
            strokeLinecap="round" />
          <text x={24} y={22} fontFamily="'Inter', sans-serif" fontSize={30}
            fontWeight={700} fill={COLORS.deep_black}>
            Does not change behavior
          </text>
          <text x={24} y={56} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={400} fill={COLORS.cool_silver}>
            Purely a safety mechanism — no runtime effect
          </text>
        </g>

        {/* ── Summary card ────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${880 + summaryCard.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill="none" stroke={COLORS.orange} strokeWidth={1.5}
            strokeDasharray={summaryPerim} strokeDashoffset={summaryBorder} />
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.03} />
          <text x={480} y={40} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.orange}>
            @Override = Compiler-Verified Override
          </text>
          <text x={480} y={76} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            One annotation eliminates an entire class of silent bugs
          </text>
        </g>

        {/* ── Rule line + text ────────────────────────────────────────────── */}
        <line x1={340} y1={1040} x2={740} y2={1040}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1}
          strokeDasharray={ruleLineLen} strokeDashoffset={ruleLineDash}
          strokeLinecap="round" />

        <g opacity={ruleText.opacity} transform={`translate(540, ${1090 + ruleText.translateY + breathe})`}>
          <text textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={32} fontWeight={800} fill={COLORS.green} opacity={shimmer}>
            Always annotate your overrides.
          </text>
        </g>

        {/* ── Phase 3 deco ────────────────────────────────────────────────── */}
        <g transform={`translate(100, ${340 + breathe})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={6} fill="none" stroke={COLORS.orange} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(980, ${340 + breathe * -1})`} opacity={0.03 * shimmer}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.green} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

      </svg>
    </AbsoluteFill>
  );
};
