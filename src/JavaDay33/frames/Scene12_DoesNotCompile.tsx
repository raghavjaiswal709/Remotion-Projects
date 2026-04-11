/**
 * Scene12 — DoesNotCompile
 * "If it does not, the program does not compile."
 * CSV: 47.78s -> 50.48s
 * Duration: 99 frames (3.30s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-20):  Label + headline spring in
 *   Phase 2 (frames 16-65): Big red X, error message block, console output
 *   Phase 3 (frames 60-end): Pulse on X, shimmer on error, breathe on decoration
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

export const Scene12_DoesNotCompile: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Big X mark
  const xMarkF = Math.max(0, frame - 14);
  const xMarkProg = spring({ frame: xMarkF, fps: 30, config: SPRING_SNAP });
  const xMarkOp = interpolate(xMarkF, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const xMarkScale = interpolate(xMarkProg, [0, 1], [0.4, 1]);

  // X lines path draw
  const xLineLen = 240;
  const xLine1Dash = usePathDraw(frame, 16, xLineLen, 14);
  const xLine2Dash = usePathDraw(frame, 20, xLineLen, 14);

  // Error text big
  const errorText = useSpringEntrance(frame, 20);
  const errorSubtext = useSpringEntrance(frame, 28);

  // Console block
  const consoleBlock = useSpringEntrance(frame, 34);
  const consoleLine1 = useSpringEntrance(frame, 40);
  const consoleLine2 = useSpringEntrance(frame, 46);
  const consoleLine3 = useSpringEntrance(frame, 52);

  // Strike-through on "compiles"
  const strikeLen = 280;
  const strikeDash = usePathDraw(frame, 22, strikeLen, 12);

  // Explanation cards
  const card1 = useSpringEntrance(frame, 56);
  const card2 = useSpringEntrance(frame, 64);
  const summaryCard = useSpringEntrance(frame, 72);

  // Card border draws
  const cardPerim = 2 * (440 + 100);
  const card1Border = usePathDraw(frame, 58, cardPerim, 16);
  const card2Border = usePathDraw(frame, 66, cardPerim, 16);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const xPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · COMPILE ERROR" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={250} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={800} fill={COLORS.vibrant_red}>
            Does Not Compile
          </text>
        </g>

        {/* ── Big Red X circle ────────────────────────────────────────────── */}
        <g opacity={xMarkOp} transform={`translate(540, 520) scale(${xMarkScale})`}
          style={{ transformOrigin: '540px 520px' }}>
          {/* Outer circle */}
          <circle cx={0} cy={0} r={120} fill={COLORS.vibrant_red} fillOpacity={0.06}
            stroke={COLORS.vibrant_red} strokeWidth={3} opacity={xPulse} />
          <circle cx={0} cy={0} r={90} fill={COLORS.vibrant_red} fillOpacity={0.04} />

          {/* X lines with path draw */}
          <line x1={-50} y1={-50} x2={50} y2={50}
            stroke={COLORS.vibrant_red} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={xLineLen} strokeDashoffset={xLine1Dash} />
          <line x1={50} y1={-50} x2={-50} y2={50}
            stroke={COLORS.vibrant_red} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={xLineLen} strokeDashoffset={xLine2Dash} />
        </g>

        {/* ── Error message text ──────────────────────────────────────────── */}
        <g opacity={errorText.opacity} transform={`translate(0, ${errorText.translateY})`}>
          <text x={540} y={710} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={44} fontWeight={700} fill={COLORS.vibrant_red}>
            Compilation Failed
          </text>
        </g>
        <g opacity={errorSubtext.opacity} transform={`translate(0, ${errorSubtext.translateY})`}>
          <text x={540} y={770} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={30} fontWeight={400} fill={COLORS.cool_silver}>
            The program cannot run
          </text>
          {/* Strike-through decoration */}
          <line x1={380} y1={771} x2={700} y2={771}
            stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.3}
            strokeDasharray={strikeLen} strokeDashoffset={strikeDash} />
        </g>

        {/* ── Console block ───────────────────────────────────────────────── */}
        <g opacity={consoleBlock.opacity} transform={`translate(60, ${830 + consoleBlock.translateY})`}>
          {/* Console background */}
          <rect x={0} y={0} width={960} height={260} rx={10}
            fill={COLORS.deep_black} fillOpacity={0.04} />
          <rect x={0} y={0} width={6} height={260} rx={3} fill={COLORS.vibrant_red} />

          {/* Console header */}
          <text x={28} y={38} fontFamily="'Fira Code', monospace" fontSize={20}
            fontWeight={400} fill={COLORS.cool_silver}>
            $ javac ExpressTrain.java
          </text>
          <line x1={28} y1={52} x2={932} y2={52} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08} />
        </g>

        {/* Console lines */}
        <g opacity={consoleLine1.opacity} transform={`translate(88, ${900 + consoleLine1.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.vibrant_red}>
            error: method does not override
          </text>
        </g>
        <g opacity={consoleLine2.opacity} transform={`translate(88, ${944 + consoleLine2.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.vibrant_red}>
            or implement a method from a
          </text>
        </g>
        <g opacity={consoleLine3.opacity} transform={`translate(88, ${988 + consoleLine3.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.vibrant_red}>
            supertype
          </text>
          <text x={160} fontFamily="'Fira Code', monospace" fontSize={22}
            fontWeight={400} fill={COLORS.cool_silver}>
            @Override
          </text>
        </g>

        {/* ── Result cards ────────────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(60, ${1140 + card1.translateY})`}>
          <rect x={0} y={0} width={440} height={100} rx={10}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray={cardPerim} strokeDashoffset={card1Border} opacity={shimmer} />
          <rect x={0} y={0} width={440} height={100} rx={10}
            fill={COLORS.vibrant_red} fillOpacity={0.03} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.vibrant_red} />
          <text x={28} y={42} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
            fill={COLORS.vibrant_red}>
            WITHOUT @Override
          </text>
          <text x={28} y={78} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}>
            Silently fails at runtime
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(540, ${1140 + card2.translateY})`}>
          <rect x={0} y={0} width={440} height={100} rx={10}
            fill="none" stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={cardPerim} strokeDashoffset={card2Border} opacity={shimmer} />
          <rect x={0} y={0} width={440} height={100} rx={10}
            fill={COLORS.green} fillOpacity={0.03} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.green} />
          <text x={28} y={42} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
            fill={COLORS.green}>
            WITH @Override
          </text>
          <text x={28} y={78} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}>
            Loudly fails at compile time
          </text>
        </g>

        {/* ── Summary ─────────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${1290 + summaryCard.translateY})`}>
          <rect x={0} y={0} width={960} height={70} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.03} />
          <text x={480} y={44} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={600} fill={COLORS.sky_blue}>
            Early failure saves hours of debugging
          </text>
        </g>

        {/* ── Phase 3 decoration ──────────────────────────────────────────── */}
        <g transform={`translate(100, ${480 + breathe})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.vibrant_red} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(980, ${700 + breathe * -1})`} opacity={0.03 * shimmer}>
          <circle cx={0} cy={0} r={10} fill="none" stroke={COLORS.cool_silver} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
