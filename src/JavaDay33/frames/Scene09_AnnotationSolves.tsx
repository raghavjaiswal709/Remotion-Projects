/**
 * Scene09 — AnnotationSolves
 * "The @Override annotation solves this."
 * CSV: 35.48s -> 37.94s
 * Duration: 92 frames (3.07s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-20):  Label + headline spring in
 *   Phase 2 (frames 15-60): @Override hero text, shield metaphor, solution card
 *   Phase 3 (frames 55-end): Glow pulse on @Override, micro-animations
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

export const Scene09_AnnotationSolves: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const heroOverride = useSpringEntrance(frame, 14);
  const shieldIcon = useSpringEntrance(frame, 20);
  const problemCard = useSpringEntrance(frame, 26);
  const arrowDivide = useSpringEntrance(frame, 32);
  const solutionCard = useSpringEntrance(frame, 36);
  const summaryCard = useSpringEntrance(frame, 42);
  const detailCard1 = useSpringEntrance(frame, 48);
  const detailCard2 = useSpringEntrance(frame, 54);

  // Hero snap
  const heroSnap = spring({ frame: Math.max(0, frame - 14), fps: 30, config: SPRING_SNAP });
  const heroScale = interpolate(heroSnap, [0, 1], [0.5, 1]);

  // Path draws
  const shieldLen = 320;
  const shieldDash = usePathDraw(frame, 22, shieldLen, 22);
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 34, arrowLen, 16);

  // Card borders
  const probPerim = 2 * (400 + 140);
  const probBorder = interpolate(frame, [28, 44], [probPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const solPerim = 2 * (400 + 140);
  const solBorder = interpolate(frame, [38, 54], [solPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const sumPerim = 2 * (960 + 140);
  const sumBorder = interpolate(frame, [44, 60], [sumPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glowPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.08, 0.2]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · SOLUTION" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={540} y={250} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={700} fill={COLORS.deep_black}>
            The Annotation That
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={540} y={340} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800} fill={COLORS.green}>
            Solves Everything
          </text>
        </g>

        {/* ── Hero @Override ───────────────────────────────────────────────── */}
        <g opacity={heroOverride.opacity}
          transform={`translate(540, ${440 + heroOverride.translateY}) scale(${heroScale})`}
          style={{ transformOrigin: '540px 440px' }}>
          {/* Glow circle behind */}
          <circle cx={0} cy={0} r={110} fill={COLORS.green} fillOpacity={glowPulse} />
          <text textAnchor="middle" y={18}
            fontFamily="'Fira Code', monospace" fontSize={72} fontWeight={700}
            fill={COLORS.green}>
            @Override
          </text>
        </g>

        {/* ── Shield icon ─────────────────────────────────────────────────── */}
        <g opacity={shieldIcon.opacity} transform={`translate(540, ${600 + breathe})`}>
          <path
            d="M 0,-50 L 40,-35 L 40,10 C 40,40 0,60 0,60 C 0,60 -40,40 -40,10 L -40,-35 Z"
            fill={COLORS.green} fillOpacity={0.08}
            stroke={COLORS.green} strokeWidth={2.5}
            strokeDasharray={shieldLen} strokeDashoffset={shieldDash}
            strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Check mark inside shield */}
          <path
            d="M -15,5 L -5,18 L 18,-10"
            fill="none" stroke={COLORS.green} strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round"
            opacity={shieldIcon.opacity * shimmer}
          />
        </g>

        {/* ── Problem → Solution comparison ───────────────────────────────── */}

        {/* Problem card (left) */}
        <g opacity={problemCard.opacity} transform={`translate(60, ${700 + problemCard.translateY})`}>
          <rect x={0} y={0} width={400} height={140} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.04} />
          <rect x={0} y={0} width={400} height={140} rx={12}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray={probPerim} strokeDashoffset={probBorder} opacity={0.3} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.vibrant_red} />
          <text x={28} y={44} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            WITHOUT
          </text>
          <text x={28} y={82} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.vibrant_red}>
            Silent failure
          </text>
          <text x={28} y={118} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            Bug hides until runtime
          </text>
        </g>

        {/* Arrow between cards */}
        <g opacity={arrowDivide.opacity}>
          <path d="M 490,770 L 600,770" fill="none" stroke={COLORS.green} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* Solution card (right) */}
        <g opacity={solutionCard.opacity} transform={`translate(620, ${700 + solutionCard.translateY})`}>
          <rect x={0} y={0} width={400} height={140} rx={12}
            fill={COLORS.green} fillOpacity={0.04} />
          <rect x={0} y={0} width={400} height={140} rx={12}
            fill="none" stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={solPerim} strokeDashoffset={solBorder} opacity={0.3} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.green} />
          <text x={28} y={44} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            WITH @OVERRIDE
          </text>
          <text x={28} y={82} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.green}>
            Compile error
          </text>
          <text x={28} y={118} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            Bug caught instantly
          </text>
        </g>

        {/* ── Summary card ────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${900 + summaryCard.translateY})`}>
          <rect x={0} y={0} width={960} height={140} rx={12}
            fill={COLORS.green} fillOpacity={0.04} />
          <rect x={0} y={0} width={960} height={140} rx={12}
            fill="none" stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={sumPerim} strokeDashoffset={sumBorder} opacity={0.2} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.green} />
          <text x={32} y={52} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={700} fill={COLORS.green}>
            The @Override annotation
          </text>
          <text x={32} y={96} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={400} fill={COLORS.deep_black}>
            Tells the compiler: "I intend to override — verify it."
          </text>
        </g>

        {/* ── Detail cards ────────────────────────────────────────────────── */}
        <g opacity={detailCard1.opacity} transform={`translate(60, ${1090 + detailCard1.translateY})`}>
          <rect x={0} y={0} width={440} height={100} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.3} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.sky_blue} />
          <text x={28} y={42} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600} fill={COLORS.sky_blue}>
            Catches typos
          </text>
          <text x={28} y={78} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            calculatefare vs calculateFare
          </text>
        </g>

        <g opacity={detailCard2.opacity} transform={`translate(540, ${1090 + detailCard2.translateY})`}>
          <rect x={0} y={0} width={440} height={100} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.3} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.sky_blue} />
          <text x={28} y={42} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600} fill={COLORS.sky_blue}>
            Catches signature mismatch
          </text>
          <text x={28} y={78} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            Wrong parameters or types
          </text>
        </g>

        {/* ── Phase 3: Decorative pulse on shield ─────────────────────────── */}
        <g transform={`translate(540, ${600 + breathe})`} opacity={0.08 * shimmer}>
          <circle cx={0} cy={0} r={80} fill="none" stroke={COLORS.green} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
