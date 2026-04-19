/**
 * Scene 06 — Calling Code Knows
 * "The calling code only knows it is a FareCalculator."
 * CSV: 25.360s → 28.520s
 * Duration: 95 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline
 *   Phase 2 (frames 15–60): Caller perspective — blurred child, visible parent type
 *   Phase 3 (frames 50–end): Micro-animations
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

export const Scene06_CallingCodeKnows: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE  = useSpringEntrance(frame, 0);
  const headA   = useSpringEntrance(frame, 4);
  const headB   = useSpringEntrance(frame, 9);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const callerCard  = useSpringEntrance(frame, 16);
  const eyeIcon     = useSpringEntrance(frame, 24);
  const parentCard  = useSpringEntrance(frame, 30);
  const childCard   = useSpringEntrance(frame, 40);
  const infoCard1   = useSpringEntrance(frame, 50);
  const infoCard2   = useSpringEntrance(frame, 58);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const eyePathLen  = 300;
  const eyeDash     = usePathDraw(frame, 24, eyePathLen, 20);
  const sightLine   = usePathDraw(frame, 28, 200, 18);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 4;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Eye outline path — elliptical eye shape
  const eyeD = 'M 200,780 Q 290,720 380,780 Q 290,840 200,780 Z';

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · VISIBILITY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Calling Code
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            only knows the parent
          </text>
        </g>

        {/* ── ZONE C — Caller card ─────────────────────────────────────── */}
        <g opacity={callerCard.opacity} transform={`translate(0, ${callerCard.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={160} accent />
          <rect x={60} y={520} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={575} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            CALLING CODE
          </text>
          <text x={100} y={635} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            engine.process(calculator)
          </text>
        </g>

        {/* ── Eye illustration ─────────────────────────────────────────── */}
        <g opacity={eyeIcon.opacity} transform={`translate(0, ${eyeIcon.translateY})`}>
          <path d={eyeD}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={eyePathLen} strokeDashoffset={eyeDash} />
          <circle cx={290} cy={780} r={25}
            fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={290} cy={780} r={10}
            fill={COLORS.accent} fillOpacity={0.6} />
          <text x={290} y={870} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            SEES
          </text>
        </g>

        {/* ── Sight line to parent ─────────────────────────────────────── */}
        <g opacity={parentCard.opacity}>
          <path d="M 380,780 L 570,780"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={200} strokeDashoffset={sightLine}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* ── Visible parent card ──────────────────────────────────────── */}
        <g opacity={parentCard.opacity} transform={`translate(0, ${parentCard.translateY})`}>
          <rect x={580} y={720} width={440} height={140} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={620} y={770} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            VISIBLE
          </text>
          <text x={620} y={825} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            FareCalculator
          </text>
        </g>

        {/* ── Hidden child card (dimmed) ───────────────────────────────── */}
        <g opacity={childCard.opacity * 0.35} transform={`translate(0, ${childCard.translateY})`}>
          <rect x={580} y={900} width={440} height={140} rx={20}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1}
            strokeDasharray="8 6" />
          <text x={620} y={950} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.08em">
            HIDDEN
          </text>
          <text x={620} y={1005} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}>
            ExpressFareCalc
          </text>
          {/* Question marks */}
          <text x={960} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.text_muted} opacity={0.3}>
            ?
          </text>
        </g>

        {/* ── Info cards ───────────────────────────────────────────────── */}
        <g opacity={infoCard1.opacity} transform={`translate(0, ${infoCard1.translateY})`}>
          <BentoCard x={60} y={1100} w={460} h={200} />
          <text x={100} y={1165} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            WHAT IT SEES
          </text>
          <text x={100} y={1220} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            calculate()
          </text>
          <text x={100} y={1270} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Parent methods only
          </text>
        </g>

        <g opacity={infoCard2.opacity} transform={`translate(0, ${infoCard2.translateY})`}>
          <BentoCard x={560} y={1100} w={460} h={200} accent />
          <text x={600} y={1165} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            WHAT EXISTS
          </text>
          <text x={600} y={1220} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Express logic
          </text>
          <text x={600} y={1270} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} opacity={0.6}>
            Hidden from caller
          </text>
        </g>

        {/* ── Summary bar ──────────────────────────────────────────────── */}
        <g opacity={infoCard2.opacity} transform={`translate(0, ${infoCard2.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={120} />
          <text x={540} y={1415} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            Abstraction hides implementation details
          </text>
        </g>

        {/* ── Decorative elements ──────────────────────────────────────── */}
        <circle cx={160} cy={980 + breathe} r={5} fill={COLORS.accent} fillOpacity={0.12} />
        <circle cx={520} cy={1060 + breathe * 0.7} r={4} fill={COLORS.accent} fillOpacity={0.1 * shimmer} />

        <g opacity={0.12 * shimmer}>
          <line x1={60} y1={1520} x2={1020} y2={1520} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1530} x2={1020} y2={1530} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 75} y={1515} width={28} height={6} rx={2}
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
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
