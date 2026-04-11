/**
 * Scene16 — OneAnnotation
 * "One annotation, zero room for silent failures."
 * CSV: 68.82s -> 71.82s
 * Duration: 108 frames (3.60s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-20):  Label + headline
 *   Phase 2 (frames 15-65): Big number "1" + "0", annotation line, detail cards
 *   Phase 3 (frames 60-end): Pulse, shimmer, breathe on hero numbers
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene16_OneAnnotation: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2: Hero numbers ──────────────────────────────────────────────────
  // Big "1" for @Override
  const heroOneF = Math.max(0, frame - 14);
  const heroOneProg = spring({ frame: heroOneF, fps: 30, config: SPRING_SNAP });
  const heroOneOp = interpolate(heroOneF, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const heroOneScale = interpolate(heroOneProg, [0, 1], [0.5, 1]);

  // Big "0" for silent failures
  const heroZeroF = Math.max(0, frame - 22);
  const heroZeroProg = spring({ frame: heroZeroF, fps: 30, config: SPRING_SNAP });
  const heroZeroOp = interpolate(heroZeroF, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const heroZeroScale = interpolate(heroZeroProg, [0, 1], [0.5, 1]);

  // Connecting line between 1 and 0
  const connectLen = 200;
  const connectDash = usePathDraw(frame, 26, connectLen, 14);

  // Annotation card
  const annoCard = useSpringEntrance(frame, 30);
  const annoPerim = 2 * (960 + 120);
  const annoBorder = usePathDraw(frame, 32, annoPerim, 18);

  // Code line inside annotation card
  const codeLine = useSpringEntrance(frame, 36);

  // Benefit cards
  const benefit1 = useSpringEntrance(frame, 42);
  const benefit2 = useSpringEntrance(frame, 50);
  const benefit3 = useSpringEntrance(frame, 58);

  // Benefit accent bars
  const barLen1 = 80;
  const barDash1 = usePathDraw(frame, 44, barLen1, 8);
  const barLen2 = 80;
  const barDash2 = usePathDraw(frame, 52, barLen2, 8);
  const barLen3 = 80;
  const barDash3 = usePathDraw(frame, 60, barLen3, 8);

  // Bottom summary
  const summaryEntrance = useSpringEntrance(frame, 66);
  const summaryBorderLen = 2 * (960 + 70);
  const summaryBorderDash = usePathDraw(frame, 68, summaryBorderLen, 14);

  // Counter: "100%" confidence
  const confCounter = useCounter(frame, 40, 100, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · CONCLUSION" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={230} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={800} fill={COLORS.deep_black}>
            One Annotation
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={310} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={500} fill={COLORS.cool_silver}>
            Zero room for silent failures
          </text>
        </g>

        {/* ── Hero Number "1" ─────────────────────────────────────────────── */}
        <g opacity={heroOneOp} transform={`translate(280, 540) scale(${heroOneScale})`}
          style={{ transformOrigin: '280px 540px' }}>
          {/* Ghost */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={280} fontWeight={900} fill={COLORS.green} opacity={0.08}>
            1
          </text>
          {/* Main */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={240} fontWeight={900} fill={COLORS.green}>
            1
          </text>
          {/* Label */}
          <text x={0} y={60} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={32} fontWeight={600} fill={COLORS.deep_black}>
            ANNOTATION
          </text>
        </g>

        {/* ── Connecting dash ─────────────────────────────────────────────── */}
        <line x1={400} y1={500} x2={680} y2={500}
          stroke={COLORS.cool_silver} strokeWidth={2} opacity={0.3}
          strokeDasharray={connectLen} strokeDashoffset={connectDash}
          strokeLinecap="round" />

        {/* ── Hero Number "0" ─────────────────────────────────────────────── */}
        <g opacity={heroZeroOp} transform={`translate(800, 540) scale(${heroZeroScale})`}
          style={{ transformOrigin: '800px 540px' }}>
          {/* Ghost */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={280} fontWeight={900} fill={COLORS.vibrant_red} opacity={0.06}>
            0
          </text>
          {/* Main */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={240} fontWeight={900} fill={COLORS.vibrant_red}>
            0
          </text>
          {/* Label */}
          <text x={0} y={60} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={600} fill={COLORS.deep_black}>
            SILENT FAILURES
          </text>
        </g>

        {/* ── Annotation card with code ───────────────────────────────────── */}
        <g opacity={annoCard.opacity} transform={`translate(60, ${660 + annoCard.translateY})`}>
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill="none" stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={annoPerim} strokeDashoffset={annoBorder} />
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill={COLORS.green} fillOpacity={0.03} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.green} />
        </g>
        <g opacity={codeLine.opacity} transform={`translate(90, ${700 + codeLine.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700}
            fill={COLORS.green}>
            @Override
          </text>
          <text x={0} y={40} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400}
            fill={COLORS.deep_black}>
            {'public int calculateFare(int distance) { ... }'}
          </text>
        </g>

        {/* ── Benefit cards ───────────────────────────────────────────────── */}
        <g opacity={benefit1.opacity} transform={`translate(60, ${820 + benefit1.translateY})`}>
          <line x1={0} y1={0} x2={0} y2={56}
            stroke={COLORS.sky_blue} strokeWidth={4}
            strokeDasharray={barLen1} strokeDashoffset={barDash1}
            strokeLinecap="round" />
          <text x={20} y={20} fontFamily="'Inter', sans-serif" fontSize={28}
            fontWeight={700} fill={COLORS.sky_blue}>
            Catches Typos
          </text>
          <text x={20} y={50} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.deep_black}>
            calculatefare vs calculateFare — caught at compile time
          </text>
        </g>

        <g opacity={benefit2.opacity} transform={`translate(60, ${910 + benefit2.translateY})`}>
          <line x1={0} y1={0} x2={0} y2={56}
            stroke={COLORS.orange} strokeWidth={4}
            strokeDasharray={barLen2} strokeDashoffset={barDash2}
            strokeLinecap="round" />
          <text x={20} y={20} fontFamily="'Inter', sans-serif" fontSize={28}
            fontWeight={700} fill={COLORS.orange}>
            Catches Signature Changes
          </text>
          <text x={20} y={50} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.deep_black}>
            If parent method evolves, child must update too
          </text>
        </g>

        <g opacity={benefit3.opacity} transform={`translate(60, ${1000 + benefit3.translateY})`}>
          <line x1={0} y1={0} x2={0} y2={56}
            stroke={COLORS.green} strokeWidth={4}
            strokeDasharray={barLen3} strokeDashoffset={barDash3}
            strokeLinecap="round" />
          <text x={20} y={20} fontFamily="'Inter', sans-serif" fontSize={28}
            fontWeight={700} fill={COLORS.green}>
            Documents Intent
          </text>
          <text x={20} y={50} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.deep_black}>
            Tells future developers: "this is meant to override"
          </text>
        </g>

        {/* ── Confidence counter ──────────────────────────────────────────── */}
        <g opacity={summaryEntrance.opacity} transform={`translate(540, ${1140 + summaryEntrance.translateY + breathe})`}>
          <text textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={64} fontWeight={900} fill={COLORS.green} opacity={shimmer}>
            {confCounter}%
          </text>
          <text x={0} y={44} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            OVERRIDE CONFIDENCE
          </text>
        </g>

        {/* ── Bottom summary ──────────────────────────────────────────────── */}
        <g opacity={summaryEntrance.opacity} transform={`translate(60, ${1240 + summaryEntrance.translateY})`}>
          <rect x={0} y={0} width={960} height={70} rx={10}
            fill="none" stroke={COLORS.deep_black} strokeWidth={1}
            strokeDasharray={summaryBorderLen} strokeDashoffset={summaryBorderDash} opacity={0.1} />
          <rect x={0} y={0} width={960} height={70} rx={10}
            fill={COLORS.deep_black} fillOpacity={0.02} />
          <text x={480} y={44} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={26} fontWeight={600} fill={COLORS.deep_black}>
            @Override — the simplest safety net in Java
          </text>
        </g>

        {/* ── Phase 3 micro deco ──────────────────────────────────────────── */}
        <g transform={`translate(100, ${400 + breathe})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={6} fill="none" stroke={COLORS.green} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(980, ${650 + breathe * -0.7})`} opacity={0.03 * shimmer}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.vibrant_red} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
