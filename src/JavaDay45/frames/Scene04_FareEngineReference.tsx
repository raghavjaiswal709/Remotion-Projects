/**
 * Scene 04 — Fare Engine Reference
 * "Now consider this. The Fare Engine holds a FareCalculator reference."
 * CSV: 15.200s → 19.860s
 * Duration: 154 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label + headline spring in
 *   Phase 2 (frames 20–80): Fare Engine box draws, FareCalculator reference card appears
 *   Phase 3 (frames 70–end): Connection line pulses, micro-animations
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene04_FareEngineReference: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const engineCard    = useSpringEntrance(frame, 18);
  const refCard       = useSpringEntrance(frame, 30);
  const arrowCard     = useSpringEntrance(frame, 42);
  const detailCard1   = useSpringEntrance(frame, 50);
  const detailCard2   = useSpringEntrance(frame, 58);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const engineBorder  = usePathDraw(frame, 18, 2 * (500 + 300), 28);
  const refBorder     = usePathDraw(frame, 30, 2 * (500 + 200), 25);
  const connectorLen  = 180;
  const connectorDash = usePathDraw(frame, 40, connectorLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe       = Math.sin(frame * 0.06) * 4;
  const pulse         = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer       = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const lineGlow      = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.8]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TICKETING ENGINE · REFERENCE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Fare Engine
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            holds a reference
          </text>
        </g>

        {/* ── ZONE C — Fare Engine box ─────────────────────────────────── */}
        <g opacity={engineCard.opacity} transform={`translate(0, ${engineCard.translateY})`}>
          {/* Engine container */}
          <rect x={100} y={520} width={500} height={300} rx={20}
            fill={COLORS.bg_secondary} />
          <rect x={100} y={520} width={500} height={300} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={2 * (500 + 300)} strokeDashoffset={engineBorder} />
          {/* Header stripe */}
          <rect x={100} y={520} width={500} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.12} />
          <rect x={100} y={560} width={500} height={20}
            fill={COLORS.accent} fillOpacity={0.12} />
          <text x={130} y={562} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            FARE ENGINE
          </text>
          {/* Class body */}
          <line x1={100} y1={580} x2={600} y2={580}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          <text x={130} y={640} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            - calculator:
          </text>
          <text x={460} y={640} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            FareCalc
          </text>
          <line x1={100} y1={670} x2={600} y2={670}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={130} y={730} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            + process()
          </text>
          <text x={130} y={780} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            + getResult()
          </text>
        </g>

        {/* ── Arrow connector ──────────────────────────────────────────── */}
        <g opacity={arrowCard.opacity}>
          <path d="M 600,670 L 680,670 L 680,750 L 760,750"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={connectorLen} strokeDashoffset={connectorDash}
            strokeLinecap="round" markerEnd="url(#arrow)"
            opacity={lineGlow} />
          <text x={680} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}
            opacity={arrowCard.opacity * 0.7}>
            holds
          </text>
        </g>

        {/* ── FareCalculator reference card ─────────────────────────────── */}
        <g opacity={refCard.opacity} transform={`translate(0, ${refCard.translateY})`}>
          <rect x={560} y={860} width={460} height={200} rx={20}
            fill={COLORS.bg_secondary} />
          <rect x={560} y={860} width={460} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={2 * (460 + 200)} strokeDashoffset={refBorder} />
          <rect x={560} y={860} width={460} height={50} rx={20}
            fill={COLORS.accent} fillOpacity={0.1} />
          <rect x={560} y={895} width={460} height={15}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={590} y={898} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            FARE CALCULATOR
          </text>
          <line x1={560} y1={910} x2={1020} y2={910}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
          <text x={590} y={960} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            + calculate()
          </text>
          <text x={590} y={1010} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            + getBaseFare()
          </text>
        </g>

        {/* ── Detail cards ─────────────────────────────────────────────── */}
        <g opacity={detailCard1.opacity} transform={`translate(0, ${detailCard1.translateY})`}>
          <BentoCard x={60} y={1120} w={460} h={180} />
          <rect x={60} y={1120} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={1185} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            REFERENCE TYPE
          </text>
          <text x={100} y={1240} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            FareCalculator
          </text>
        </g>

        <g opacity={detailCard2.opacity} transform={`translate(0, ${detailCard2.translateY})`}>
          <BentoCard x={560} y={1120} w={460} h={180} accent />
          <text x={600} y={1185} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            USAGE PATTERN
          </text>
          <text x={600} y={1240} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Interchangeable
          </text>
        </g>

        {/* ── Bottom note card ─────────────────────────────────────────── */}
        <g opacity={detailCard2.opacity} transform={`translate(0, ${detailCard2.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={140} />
          <text x={540} y={1425} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            Engine only sees the parent type — not the child
          </text>
        </g>

        {/* ── Decorative track at bottom ───────────────────────────────── */}
        <g opacity={0.15 * shimmer}>
          <line x1={60} y1={1540} x2={1020} y2={1540}
            stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1550} x2={1020} y2={1550}
            stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 75} y={1535} width={28} height={6} rx={2}
              fill={COLORS.accent} opacity={0.3} />
          ))}
        </g>

        {/* ── Floating particles ───────────────────────────────────────── */}
        <circle cx={180} cy={500 + breathe} r={5} fill={COLORS.accent} fillOpacity={0.12} />
        <circle cx={900} cy={550 + breathe * 0.7} r={7} fill={COLORS.accent} fillOpacity={0.1} />
        <circle cx={350} cy={1080 + breathe * 1.1} r={4} fill={COLORS.accent} fillOpacity={0.15} />

        {/* ── Pulsing glow ─────────────────────────────────────────────── */}
        <circle cx={350} cy={670} r={200}
          fill={COLORS.accent} fillOpacity={0.02 * pulse} />

        {/* ── Caption ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
