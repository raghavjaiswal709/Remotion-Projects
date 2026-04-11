/**
 * Scene07 — Lowercase f Problem
 * "What if you accidentally write calculatefare with a lowercase f?
 *  Java would treat it as a brand new method."
 * CSV: 25.78s -> 32.32s
 * Duration: 214 frames (7.13s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-30):   Label + headline spring
 *   Phase 2 (frames 20-100): Code block with highlighted typo, class diagram showing NEW method
 *   Phase 3 (frames 90-end): Pulse on red 'f', shimmer, warning badge
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

export const Scene07_LowercaseF: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Code block ────────────────────────────────────────────────────
  const codeBlock = useSpringEntrance(frame, 18);
  const codeLine1 = useSpringEntrance(frame, 24);
  const codeLine2 = useSpringEntrance(frame, 30);
  const codeLine3 = useSpringEntrance(frame, 36);
  const codeLine4 = useSpringEntrance(frame, 42);

  // ── Class diagram ──────────────────────────────────────────────────────────
  const parentBox = useSpringEntrance(frame, 48);
  const childBox = useSpringEntrance(frame, 56);
  const inheritArrow = useSpringEntrance(frame, 62);
  const newMethodLabel = useSpringEntrance(frame, 68);

  // ── X mark on override ─────────────────────────────────────────────────────
  const xMarkSnap = spring({ frame: Math.max(0, frame - 74), fps, config: SPRING_SNAP });
  const xMarkOpacity = interpolate(Math.max(0, frame - 74), [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // "NEW METHOD" badge
  const newBadge = useSpringEntrance(frame, 78);

  // Result card
  const resultCard = useSpringEntrance(frame, 86);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const codeBlockPerim = 2 * (960 + 260);
  const codeBlockBorder = interpolate(frame, [20, 45], [codeBlockPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const inheritLineLen = 200;
  const inheritLineDash = usePathDraw(frame, 64, inheritLineLen, 20);

  const xLineLen = 60;
  const xLineDash1 = usePathDraw(frame, 76, xLineLen, 12);
  const xLineDash2 = usePathDraw(frame, 78, xLineLen, 12);

  const resultPerim = 2 * (960 + 140);
  const resultBorder = interpolate(frame, [88, 110], [resultPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const redPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.6, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · THE TYPO TRAP" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={230}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Lowercase f Trap
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={290}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={500}
            fill={COLORS.vibrant_red}
          >
            Java treats it as a brand new method
          </text>
        </g>

        {/* ── ZONE C — Code block with highlighted typo ───────────────────── */}
        <g opacity={codeBlock.opacity} transform={`translate(0, ${codeBlock.translateY * 0.5})`}>
          <rect x={60} y={340} width={960} height={260} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.04} />
          <rect x={60} y={340} width={960} height={260} rx={12}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray={codeBlockPerim} strokeDashoffset={codeBlockBorder}
            opacity={0.4} />
          <rect x={60} y={340} width={6} height={260} rx={3} fill={COLORS.vibrant_red} />
        </g>

        {/* Code line: class declaration */}
        <g opacity={codeLine1.opacity} transform={`translate(0, ${codeLine1.translateY * 0.3})`}>
          <text x={100} y={398} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.sky_blue}>
            class
          </text>
          <text x={168} y={398} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={600} fill={COLORS.deep_black}>
            {' ExpressTrain extends Train {'}
          </text>
        </g>

        {/* Code line: the typo method */}
        <g opacity={codeLine2.opacity} transform={`translate(0, ${codeLine2.translateY * 0.3})`}>
          <text x={140} y={448} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            {'  int '}
          </text>
          <text x={224} y={448} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            calculate
          </text>
          <text x={410} y={448} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            f
          </text>
          <text x={430} y={448} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            are(int distance)
          </text>
          {/* Red circle on lowercase f */}
          <circle cx={418} cy={440} r={18} fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
            opacity={redPulse * codeLine2.opacity} transform={`scale(${pulse})`}
            style={{ transformOrigin: '418px 440px' }} />
        </g>

        {/* Code line: body */}
        <g opacity={codeLine3.opacity} transform={`translate(0, ${codeLine3.translateY * 0.3})`}>
          <text x={140} y={498} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            {'    return distance * 2;'}
          </text>
        </g>

        {/* Code line: closing */}
        <g opacity={codeLine4.opacity} transform={`translate(0, ${codeLine4.translateY * 0.3})`}>
          <text x={100} y={548} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.deep_black}>
            {'}'}
          </text>
        </g>

        {/* Arrow from typo pointing up */}
        <g opacity={codeLine2.opacity * redPulse}>
          <line x1={418} y1={460} x2={418} y2={500} stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <text x={420} y={530} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={COLORS.vibrant_red}>
            lowercase 'f' — NOT 'F'
          </text>
        </g>

        {/* ── Class diagram ───────────────────────────────────────────────── */}

        {/* Parent box */}
        <g opacity={parentBox.opacity} transform={`translate(0, ${parentBox.translateY * 0.5})`}>
          <rect x={140} y={640} width={360} height={180} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <text x={320} y={690} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.sky_blue}>
            Train
          </text>
          <line x1={160} y1={708} x2={480} y2={708} stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.3} />
          <text x={170} y={748} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            calculate
          </text>
          <text x={340} y={748} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700} fill={COLORS.green}>
            F
          </text>
          <text x={358} y={748} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            are()
          </text>
        </g>

        {/* Child box */}
        <g opacity={childBox.opacity} transform={`translate(0, ${childBox.translateY * 0.5})`}>
          <rect x={580} y={640} width={400} height={280} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2} />
          <text x={780} y={690} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.orange}>
            ExpressTrain
          </text>
          <line x1={600} y1={708} x2={960} y2={708} stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />

          {/* Methods in child — typo version */}
          <text x={610} y={748} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            calculate
          </text>
          <text x={780} y={748} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700} fill={COLORS.vibrant_red}>
            f
          </text>
          <text x={798} y={748} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            are()
          </text>

          {/* Inherited original method too! */}
          <line x1={610} y1={770} x2={950} y2={770} stroke={COLORS.deep_black} strokeWidth={0.5} opacity={0.1} />
          <text x={610} y={808} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.cool_silver} opacity={0.5}>
            calculate
          </text>
          <text x={780} y={808} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.cool_silver} opacity={0.5}>
            F
          </text>
          <text x={798} y={808} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.cool_silver} opacity={0.5}>
            are()
          </text>
          <text x={610} y={838} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={400} fill={COLORS.cool_silver} opacity={0.4}>
            (inherited, still runs parent logic)
          </text>
        </g>

        {/* Inheritance arrow */}
        <path
          d={`M 500,730 L 580,730`}
          fill="none" stroke={COLORS.deep_black} strokeWidth={2}
          strokeDasharray={inheritLineLen} strokeDashoffset={inheritLineDash}
          opacity={inheritArrow.opacity * 0.5}
          markerEnd="url(#arrow)"
        />

        {/* X mark on the override attempt */}
        <g opacity={xMarkOpacity}>
          <path d={`M 530,700 L 570,740`} fill="none" stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={xLineLen} strokeDashoffset={xLineDash1} />
          <path d={`M 570,700 L 530,740`} fill="none" stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={xLineLen} strokeDashoffset={xLineDash2} />
        </g>

        {/* "NEW METHOD" badge */}
        <g opacity={newBadge.opacity} transform={`translate(780, ${655 + newBadge.translateY})`}>
          <rect x={-80} y={-18} width={160} height={34} rx={17}
            fill={COLORS.vibrant_red} fillOpacity={0.12} />
          <text textAnchor="middle" y={6} fontFamily="'Inter', sans-serif"
            fontSize={20} fontWeight={800} fill={COLORS.vibrant_red}
            letterSpacing="0.12em"
            opacity={redPulse}>
            NEW METHOD
          </text>
        </g>

        {/* "NOT OVERRIDE" label on the method */}
        <g opacity={newMethodLabel.opacity} transform={`translate(780, ${760 + newMethodLabel.translateY})`}>
          <text textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.vibrant_red} opacity={redPulse * shimmer}>
            NOT AN OVERRIDE
          </text>
        </g>

        {/* ── Result card ─────────────────────────────────────────────────── */}
        <g opacity={resultCard.opacity} transform={`translate(60, ${960 + resultCard.translateY})`}>
          <rect x={0} y={0} width={960} height={140} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.04} />
          <rect x={0} y={0} width={960} height={140} rx={12}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray={resultPerim} strokeDashoffset={resultBorder}
            opacity={0.4} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.vibrant_red} />
          <text x={32} y={52} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={700} fill={COLORS.vibrant_red}>
            Java creates TWO methods
          </text>
          <text x={32} y={100} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={400} fill={COLORS.deep_black}>
            calculatefare() (new) + calculateFare() (inherited)
          </text>
        </g>

        {/* ── Phase 3: Breathing accent ───────────────────────────────────── */}
        <g transform={`translate(970, ${340 + breathe})`} opacity={0.08 * shimmer}>
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
