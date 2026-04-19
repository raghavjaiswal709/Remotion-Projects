/**
 * Scene 23 — RuntimePolymorphismReveal
 * "That is runtime polymorphism."
 * CSV: 69.840s → 71.620s
 * Duration: 67 frames (2.2s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + hero "Runtime Polymorphism" reveal
 *   Phase 2 (frames 14–50): JVM execution flow, parent→child dispatch
 *   Phase 3 (frames 45–end): Pulse, glow ring, micro-float
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene23_RuntimePolymorphismReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const heroWord1 = useSpringEntrance(frame, 3);
  const heroWord2 = useSpringEntrance(frame, 7);
  const heroWord3 = useSpringEntrance(frame, 11);

  // Underline draw
  const ulLen = 620;
  const ulDash = usePathDraw(frame, 12, ulLen, 18);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const jvmBox    = useSpringEntrance(frame, 16);
  const parentCard = useSpringEntrance(frame, 22);
  const childCard  = useSpringEntrance(frame, 28);
  const arrowE     = useSpringEntrance(frame, 34);
  const defCardE   = useSpringEntrance(frame, 38);
  const contrastE  = useSpringEntrance(frame, 42);
  const summaryE   = useSpringEntrance(frame, 48);

  // Arrow path draws
  const dispatchLen = 160;
  const dispatchD = usePathDraw(frame, 34, dispatchLen, 16);

  const selectLen = 240;
  const selectD = usePathDraw(frame, 36, selectLen, 18);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glowR   = interpolate(Math.sin(frame * 0.1), [-1, 1], [60, 80]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            POLYMORPHISM · RUNTIME
          </text>
        </g>

        {/* ── ZONE B — Hero text (per-word spring) ───────────────────────── */}
        <g transform={`translate(0, ${heroWord1.translateY})`} opacity={heroWord1.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.text_muted}>
            That Is
          </text>
        </g>
        <g transform={`translate(0, ${heroWord2.translateY})`} opacity={heroWord2.opacity}>
          <text x={540} y={400} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Runtime
          </text>
        </g>
        <g transform={`translate(0, ${heroWord3.translateY})`} opacity={heroWord3.opacity}>
          <text x={540} y={480} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.white}>
            Polymorphism
          </text>
        </g>

        {/* Underline accent */}
        <line x1={220} y1={500} x2={860} y2={500}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={ulLen} strokeDashoffset={ulDash}
          strokeLinecap="round" opacity={0.6} />

        {/* ── JVM dispatch box ───────────────────────────────────────────── */}
        <g opacity={jvmBox.opacity} transform={`translate(0, ${jvmBox.translateY})`}>
          <BentoCard x={280} y={540} w={520} h={100} accent />
          <circle cx={320} cy={590} r={20}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={320} y={597} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent}>
            JVM
          </text>
          <text x={560} y={598} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Runtime Dispatch
          </text>
        </g>

        {/* ── Parent card (faded) ────────────────────────────────────────── */}
        <g opacity={parentCard.opacity * 0.4} transform={`translate(0, ${parentCard.translateY})`}>
          <BentoCard x={60} y={700} w={440} h={200} />
          <rect x={60} y={700} width={440} height={50} rx={20}
            fill={COLORS.text_muted} fillOpacity={0.06} />
          <text x={280} y={733} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            TRAIN (Parent)
          </text>
          <text x={100} y={808}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            calculateFare()
          </text>
          <text x={100} y={856}
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Returns base fare
          </text>
        </g>

        {/* ── Child card (highlighted) ───────────────────────────────────── */}
        <g opacity={childCard.opacity} transform={`translate(0, ${childCard.translateY})`}>
          <BentoCard x={560} y={700} w={460} h={200} accent />
          <rect x={560} y={700} width={460} height={50} rx={20}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={790} y={733} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>
            EXPRESS TRAIN (Child)
          </text>
          <text x={600} y={808}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            calculateFare()
          </text>
          <text x={600} y={856}
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent} opacity={0.8}>
            Returns base + surcharge
          </text>
          {/* Glow ring */}
          <circle cx={790} cy={800} r={glowR}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.12} />
        </g>

        {/* ── Dispatch arrow from JVM to child ───────────────────────────── */}
        <g opacity={arrowE.opacity}>
          <path d="M 540,640 L 540,680 Q 540,700 600,700"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={dispatchLen} strokeDashoffset={dispatchD}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* ── Selection indicator → child selected ───────────────────────── */}
        <g opacity={arrowE.opacity}>
          <path d="M 540,640 C 540,660 540,680 280,700"
            fill="none" stroke={COLORS.text_muted} strokeWidth={1.5}
            strokeDasharray="4 4" opacity={0.25} />
          <text x={160} y={696}
            fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.4}>
            SKIPPED
          </text>
        </g>

        {/* ── Definition card ────────────────────────────────────────────── */}
        <g opacity={defCardE.opacity} transform={`translate(0, ${defCardE.translateY})`}>
          <BentoCard x={100} y={960} w={880} h={130} />
          <rect x={100} y={960} width={6} height={130} rx={3}
            fill={COLORS.accent} />
          <text x={140} y={1015}
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>
            The actual object type determines which method runs
          </text>
          <text x={140} y={1060}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Not the declared reference type — the real object in memory
          </text>
        </g>

        {/* ── Contrast tiles ─────────────────────────────────────────────── */}
        <g opacity={contrastE.opacity} transform={`translate(0, ${contrastE.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={130} />
          <text x={100} y={1195}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            COMPILE TIME
          </text>
          <text x={100} y={1235}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Overloading (resolved early)
          </text>
          <line x1={80} y1={1200} x2={480} y2={1200}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} opacity={0.3} />
        </g>
        <g opacity={contrastE.opacity} transform={`translate(0, ${contrastE.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={130} accent />
          <text x={600} y={1195}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>
            RUNTIME
          </text>
          <text x={600} y={1235}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} opacity={0.7}>
            Overriding (resolved late)
          </text>
          {/* Check line */}
          <path d="M 970,1185 L 990,1205 L 1010,1165"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeLinecap="round" />
        </g>

        {/* ── Summary ────────────────────────────────────────────────────── */}
        <g opacity={summaryE.opacity * shimmer} transform={`translate(0, ${summaryE.translateY})`}>
          <BentoCard x={100} y={1320} w={880} h={100} />
          <text x={540} y={1382} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>
            The <tspan fill={COLORS.accent} fontStyle="italic">JVM</tspan> decides at execution — not the compiler
          </text>
        </g>

        {/* ── Bottom tag ─────────────────────────────────────────────────── */}
        <g opacity={summaryE.opacity * 0.6}>
          <BentoCard x={280} y={1470} w={520} h={80} />
          <text x={540} y={1522} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>
            METHOD OVERRIDING = RUNTIME POLYMORPHISM
          </text>
        </g>

        {/* ── Bottom insight card ────────────────────────────────────────── */}
        <g opacity={summaryE.opacity * shimmer}>
          <BentoCard x={160} y={1600} w={760} h={90} />
          <text x={540} y={1656} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Same reference, different behavior — determined by the <tspan fill={COLORS.accent}>actual object</tspan>
          </text>
        </g>

        {/* ── Micro-animation dots ───────────────────────────────────────── */}
        <g transform={`translate(100, ${1730 + breathe})`} opacity={0.06}>
          <circle cx={0} cy={0} r={4} fill={COLORS.accent} />
        </g>
        <g transform={`translate(980, ${1720 + breathe * 0.8})`} opacity={0.05}>
          <circle cx={0} cy={0} r={3}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s23.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
