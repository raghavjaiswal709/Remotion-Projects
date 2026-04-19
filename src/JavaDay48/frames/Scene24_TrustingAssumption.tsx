/**
 * Scene 24 — Trusting Assumption
 * "you are trusting that the object is what you assume."
 * CSV: 69.720s → 71.960s | Duration: 75 frames
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline
 *   Phase 2 (8–40): Trust visual
 *   Phase 3 (35–end): Pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene24_TrustingAssumption: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);
  const objE = useSpringEntrance(frame, 10);
  const arrowE = useSpringEntrance(frame, 18);
  const questionE = useSpringEntrance(frame, 24);
  const noteE = useSpringEntrance(frame, 32);
  const bottomE = useSpringEntrance(frame, 38);

  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 20, arrowLen, 18);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const breathe = Math.sin(frame * 0.07) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s24.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="BLIND TRUST · RISK" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={320} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>Trusting</text>
          <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.vibrant_red}>Assumptions</text>
        </g>

        {/* Object box with question mark */}
        <g opacity={objE.opacity} transform={`translate(0, ${objE.translateY})`}>
          <BentoCard x={320} y={520} w={440} h={140} />
          <text x={540} y={608} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>Train t = ???</text>
        </g>

        {/* Arrow pointing down */}
        <path d="M 540,660 L 540,800" fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
          strokeLinecap="round" strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={arrowE.opacity} />

        {/* Assumed type — with question */}
        <g opacity={questionE.opacity} transform={`translate(0, ${questionE.translateY})`}>
          <BentoCard x={180} y={820} w={720} h={160} accent />
          <text x={540} y={880} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>(ExpressTrain) t</text>
          <text x={540} y={930} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>But is it really an ExpressTrain?</text>
        </g>

        {/* Big question mark */}
        <g transform={`translate(540, ${1100 + breathe})`} opacity={questionE.opacity}>
          <text textAnchor="middle" fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.vibrant_red} fillOpacity={0.15}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}>?</text>
        </g>

        {/* Note cards */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={120} />
          <text x={540} y={1332} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>You're betting on the runtime type</text>
        </g>

        <g opacity={bottomE.opacity} transform={`translate(0, ${bottomE.translateY})`}>
          <BentoCard x={60} y={1420} w={960} h={120} />
          <rect x={60} y={1420} width={6} height={120} rx={3} fill={COLORS.vibrant_red} />
          <text x={540} y={1492} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>Without verification — you're guessing</text>
        </g>

        {/* Decorative dots */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={200 + i * 220} cy={1620 + Math.sin(frame * 0.05 + i * 1.2) * 3}
            r={3} fill={COLORS.accent} fillOpacity={0.08} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s24.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
