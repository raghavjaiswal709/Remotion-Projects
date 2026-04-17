/**
 * Scene 13 — System Increases
 * "and totalPassengersInSystem for the class increases by 300."
 * CSV: 56.730s → 61.660s
 * Duration: 148 frames (4.93s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Shows the STATIC field increasing: the class-level totalPassengersInSystem
 * counter ticking up by 300 (e.g., 429 → 729).
 * Contrasts with instance: instance card on left, class card on right.
 * Arrow paths from instance action to class-level update.
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Label + headline spring
 *   Phase 2 (frames 18–90): Two cards, counter tick, arrow path-draw
 *   Phase 3 (frames 80–end): Pulse, shimmer, glow
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

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

export const Scene13_SystemIncreases: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headlineEntry = useSpringEntrance(frame, 6);
  const subEntry = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Left card: Instance action (KL2401 boards 300)
  const leftCard = useSpringEntrance(frame, 18);
  const leftPerim = 2 * (440 + 340);
  const leftBorderDash = interpolate(frame, [18, 42], [leftPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Right card: Class-level update (totalPassengersInSystem += 300)
  const rightCard = useSpringEntrance(frame, 26);
  const rightPerim = 2 * (440 + 480);
  const rightBorderDash = interpolate(frame, [26, 52], [rightPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Arrow from left to right
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 34, arrowLen, 22);

  // Counter ticking: 429 → 729 (old value + 300)
  const staticOld = 429;
  const staticNew = 729;
  const staticCounter = useCounter(frame, 30, staticNew - staticOld, 40) + staticOld;

  // "+300" pop
  const plusPop = useSpringEntrance(frame, 36);

  // Code card
  const codeCard = useSpringEntrance(frame, 44);
  const codePerim = 2 * (960 + 120);
  const codeBorderDash = interpolate(frame, [44, 66], [codePerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Bottom info cards
  const infoLeft = useSpringEntrance(frame, 56);
  const infoRight = useSpringEntrance(frame, 62);

  // Summary
  const summaryCard = useSpringEntrance(frame, 72);

  // Badges
  const instanceBadge = useSpringEntrance(frame, 22);
  const classBadge = useSpringEntrance(frame, 30);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const counterGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.03, 0.1]);
  const arrowPulse = interpolate(Math.sin(frame * 0.13), [-1, 1], [0.4, 0.8]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="STATIC UPDATE · CLASS COUNTER" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ────────────────────────────────────────── */}
        <g opacity={headlineEntry.opacity} transform={`translate(0, ${headlineEntry.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={68} fontWeight={800}
            fill={COLORS.white}>
            System Total
          </text>
        </g>
        <g opacity={subEntry.opacity} transform={`translate(0, ${subEntry.translateY})`}>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Increases by 300
          </text>
        </g>

        {/* ── ZONE C — Left card: Instance action ─────────────────────── */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <rect x={60} y={460} width={440} height={340} rx={20}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1.5}
            strokeDasharray={leftPerim} strokeDashoffset={leftBorderDash} />

          {/* Header */}
          <rect x={60} y={460} width={440} height={48} rx={20}
            fill="rgba(255,255,255,0.03)" />
          <text x={280} y={492} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.06em">
            INSTANCE ACTION
          </text>

          {/* INSTANCE badge */}
          <g opacity={instanceBadge.opacity}>
            <rect x={160} y={520} width={240} height={36} rx={10}
              fill={COLORS.text_muted} fillOpacity={0.08} />
            <text x={280} y={544} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.text_muted} fontStyle="italic">
              PER-OBJECT
            </text>
          </g>

          {/* Train ID */}
          <text x={280} y={600} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            KL2401
          </text>

          {/* Mini train */}
          <rect x={200} y={620} width={160} height={36} rx={6}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={235} cy={664} r={8} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={325} cy={664} r={8} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} />

          <text x={280} y={716} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            boards 300 passengers
          </text>

          {/* Checkmark */}
          <text x={280} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>
            300 boarded
          </text>
        </g>

        {/* ── Arrow: left → right ─────────────────────────────────────── */}
        <path d="M 510,630 L 570,630"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeOpacity={arrowPulse}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Right card: Class-level counter ─────────────────────────── */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <rect x={580} y={460} width={440} height={480} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={rightPerim} strokeDashoffset={rightBorderDash} />

          {/* Header */}
          <rect x={580} y={460} width={440} height={48} rx={20}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={800} y={492} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.06em">
            CLASS COUNTER
          </text>

          {/* STATIC badge */}
          <g opacity={classBadge.opacity}>
            <rect x={680} y={520} width={240} height={36} rx={10}
              fill={COLORS.accent} fillOpacity={0.08} />
            <text x={800} y={544} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic"
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '800px 540px' }}>
              STATIC — SHARED
            </text>
          </g>

          {/* field name */}
          <text x={800} y={590} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted}>
            totalPassengersInSystem
          </text>

          {/* Ghost counter */}
          <text x={800} y={740} textAnchor="middle"
            fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent} opacity={counterGlow}>
            {staticCounter}
          </text>

          {/* Main counter */}
          <text x={800} y={735} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.white}>
            {staticCounter}
          </text>

          {/* +300 pop */}
          <g opacity={plusPop.opacity} transform={`translate(0, ${plusPop.translateY})`}>
            <text x={920} y={660} fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.accent}>
              +300
            </text>
          </g>

          {/* SHARED label */}
          <text x={800} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            ALL TRAINS SEE THIS VALUE
          </text>

          {/* Glow ring */}
          <rect x={610} y={620} width={380} height={200} rx={12}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            strokeOpacity={counterGlow * 0.5} />
        </g>

        {/* ── Code card ────────────────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <rect x={60} y={980} width={960} height={120} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={codePerim} strokeDashoffset={codeBorderDash} />
          <rect x={60} y={980} width={6} height={120} rx={3}
            fill={COLORS.accent} />

          <text x={90} y={1050} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={20} fontWeight={500} fill={COLORS.text_muted} opacity={0.4}>
            25
          </text>
          <text x={130} y={1050}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500}>
            <tspan fill={COLORS.accent}>Train</tspan>
            <tspan fill={COLORS.text_muted}>.totalPassengersInSystem += </tspan>
            <tspan fill={COLORS.white}>300</tspan>
            <tspan fill={COLORS.text_muted}>;</tspan>
          </text>
        </g>

        {/* ── Bottom info cards ────────────────────────────────────────── */}
        <g opacity={infoLeft.opacity} transform={`translate(0, ${infoLeft.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={160} />
          <text x={100} y={1196} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.06em">
            BEFORE BOARDING
          </text>
          <text x={100} y={1248} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>
            429
          </text>
          <text x={290} y={1248} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            total in system
          </text>
        </g>

        <g opacity={infoRight.opacity} transform={`translate(0, ${infoRight.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={160} accent />
          <text x={600} y={1196} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.06em">
            AFTER BOARDING
          </text>
          <text x={600} y={1248} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent}>
            729
          </text>
          <text x={790} y={1248} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            total in system
          </text>
        </g>

        {/* ── Summary strip ────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={120} />
          <rect x={60} y={1340} width={6} height={120} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1410} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>
            Class counter updates — visible to all train objects
          </text>
        </g>

        {/* ── Network diagram at bottom ────────────────────────────────── */}
        <g opacity={summaryCard.opacity * 0.3} transform={`translate(540, ${1540 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} fillOpacity={0.04}
            stroke={COLORS.accent} strokeWidth={1} />
          <text x={0} y={5} textAnchor="middle"
            fontFamily={FONT} fontSize={12} fontWeight={800} fill={COLORS.accent}>
            729
          </text>
          {[0, 120, 240].map((a, i) => {
            const rad = ((a - 90) * Math.PI) / 180;
            const nx = Math.cos(rad) * 80;
            const ny = Math.sin(rad) * 50;
            return (
              <g key={i}>
                <line x1={0} y1={0} x2={nx} y2={ny}
                  stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.12} />
                <circle cx={nx} cy={ny} r={10} fill={COLORS.accent} fillOpacity={0.03}
                  stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.15} />
              </g>
            );
          })}
        </g>

        {/* Floating accents */}
        <g transform={`translate(100, ${1660 + breathe * 0.5})`}>
          <circle cx={0} cy={0} r={10} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>
        <g transform={`translate(980, ${1680 + breathe * 0.3})`}>
          <circle cx={0} cy={0} r={7} fill={COLORS.accent} fillOpacity={0.02 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
