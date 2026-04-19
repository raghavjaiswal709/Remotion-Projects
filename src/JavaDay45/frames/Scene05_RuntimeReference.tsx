/**
 * Scene 05 — Runtime Reference
 * "At runtime, that reference points to an ExpressFareCalculator object."
 * CSV: 20.340s → 24.860s
 * Duration: 151 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label + headline spring
 *   Phase 2 (frames 20–80): Parent ref box + child object box + arrow
 *   Phase 3 (frames 70–end): Memory address pulses, micro-animations
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

export const Scene05_RuntimeReference: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE   = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 5);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const refBox   = useSpringEntrance(frame, 18);
  const arrowE   = useSpringEntrance(frame, 32);
  const childBox = useSpringEntrance(frame, 40);
  const memCard  = useSpringEntrance(frame, 55);
  const noteCard = useSpringEntrance(frame, 65);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const refPerim   = 2 * (400 + 180);
  const refDash    = usePathDraw(frame, 18, refPerim, 25);
  const childPerim = 2 * (500 + 280);
  const childDash  = usePathDraw(frame, 40, childPerim, 30);
  const arrowLen   = 220;
  const arrowDash  = usePathDraw(frame, 32, arrowLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 4;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const addrBlink = Math.floor(frame * 0.08) % 2 === 0 ? 1 : 0.6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · RUNTIME" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            At Runtime
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            reference points to child object
          </text>
        </g>

        {/* ── ZONE C — Reference box (left) ────────────────────────────── */}
        <g opacity={refBox.opacity} transform={`translate(0, ${refBox.translateY})`}>
          <rect x={60} y={520} width={400} height={180} rx={20}
            fill={COLORS.bg_secondary} />
          <rect x={60} y={520} width={400} height={180} rx={20}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2}
            strokeDasharray={refPerim} strokeDashoffset={refDash} />
          <text x={100} y={570} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            REFERENCE TYPE
          </text>
          <text x={100} y={630} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            FareCalculator
          </text>
          <text x={100} y={680} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            (parent class)
          </text>
        </g>

        {/* ── Arrow ────────────────────────────────────────────────────── */}
        <g opacity={arrowE.opacity}>
          <path d="M 460,610 C 520,610 520,780 540,780"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
          <text x={520} y={700} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}
            opacity={0.7}>
            points to
          </text>
        </g>

        {/* ── Child object box (right/below) ───────────────────────────── */}
        <g opacity={childBox.opacity} transform={`translate(0, ${childBox.translateY})`}>
          <rect x={340} y={740} width={680} height={280} rx={20}
            fill={COLORS.bg_secondary} />
          <rect x={340} y={740} width={680} height={280} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={childPerim} strokeDashoffset={childDash} />
          {/* Header */}
          <rect x={340} y={740} width={680} height={55} rx={20}
            fill={COLORS.accent} fillOpacity={0.12} />
          <rect x={340} y={778} width={680} height={17}
            fill={COLORS.accent} fillOpacity={0.12} />
          <text x={370} y={782} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            EXPRESS FARE CALCULATOR
          </text>
          <line x1={340} y1={795} x2={1020} y2={795}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          {/* Body */}
          <text x={370} y={850} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            + calculate()
          </text>
          <text x={370} y={900} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            + getExpressSurcharge()
          </text>
          <text x={370} y={950} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            + applyDiscount()
          </text>
          {/* Actual object badge */}
          <rect x={750} y={960} width={240} height={44} rx={12}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={870} y={990} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            ACTUAL OBJECT
          </text>
        </g>

        {/* ── Memory address card ──────────────────────────────────────── */}
        <g opacity={memCard.opacity} transform={`translate(0, ${memCard.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={160} accent />
          <text x={100} y={1130} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>HEAP MEMORY</text>
          <text x={100} y={1185} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Object at
          </text>
          <text x={340} y={1185} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} opacity={addrBlink}>
            0x7F3A
          </text>
          <text x={570} y={1185} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            is ExpressFareCalculator
          </text>
        </g>

        {/* ── Note card ────────────────────────────────────────────────── */}
        <g opacity={noteCard.opacity} transform={`translate(0, ${noteCard.translateY})`}>
          <BentoCard x={60} y={1280} w={460} h={200} />
          <rect x={60} y={1280} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1345} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            DECLARED AS
          </text>
          <text x={100} y={1400} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            FareCalculator
          </text>
          <text x={100} y={1450} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Parent type
          </text>

          <BentoCard x={560} y={1280} w={460} h={200} accent />
          <text x={600} y={1345} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            ACTUALLY IS
          </text>
          <text x={600} y={1400} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            ExpressFareCalc
          </text>
          <text x={600} y={1450} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} opacity={0.6}>
            Child type
          </text>
        </g>

        {/* ── Floating particles ───────────────────────────────────────── */}
        <circle cx={200} cy={500 + breathe} r={5} fill={COLORS.accent} fillOpacity={0.12} />
        <circle cx={950} cy={650 + breathe * 0.8} r={6} fill={COLORS.accent} fillOpacity={0.1 * shimmer} />

        {/* ── Track decorations ────────────────────────────────────────── */}
        <g opacity={0.12 * shimmer}>
          <line x1={60} y1={1540} x2={1020} y2={1540} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1550} x2={1020} y2={1550} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 75} y={1535} width={28} height={6} rx={2}
              fill={COLORS.accent} opacity={0.3} />
          ))}
        </g>

        {/* ── Caption ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
