/**
 * Scene 20 — Retriable
 * "Each step is separately retriable."
 * CSV: 63.800s → 66.460s
 * Duration: 80 frames (2.67s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline
 *   Phase 2 (frames 16–55): Retry loop illustration
 *   Phase 3 (frames 50–end): Loop arrow pulse
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene20_Retriable: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const loopCard = useSpringEntrance(frame, 16);
  const defCard = useSpringEntrance(frame, 40);

  // Circular retry arrow
  const arcLen = Math.PI * 2 * 120 * 0.75; // 270 degrees
  const arcDash = usePathDraw(frame, 20, arcLen, 25);

  // Rotation for arrow
  const arrowSpin = frame > 50 ? Math.sin(frame * 0.06) * 5 : 0;

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="PROPERTY 3 · RETRY" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Retriable
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Each step, separately
          </text>
        </g>

        {/* ZONE C — Retry loop card */}
        <g opacity={loopCard.opacity} transform={`translate(0, ${loopCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={540} accent />

          {/* Circular retry arrow */}
          <g transform={`translate(540, 750) rotate(${arrowSpin}) scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            {/* Arc path */}
            <path d="M 0,-120 A 120,120 0 1,1 -85,-85" fill="none"
              stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round"
              strokeDasharray={arcLen} strokeDashoffset={arcDash} />
            {/* Arrowhead at end */}
            <polygon points="-85,-85 -95,-55 -55,-75" fill={COLORS.accent}
              opacity={interpolate(frame, [35, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />

            {/* Center label */}
            <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800}
              fill={COLORS.accent}>RETRY</text>
          </g>

          {/* Step box inside loop */}
          <rect x={480} y={620} width={120} height={60} rx={12}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={660} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>STEP</text>

          {/* X mark on first attempt */}
          <g opacity={interpolate(frame, [28, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
            <line x1={370} y1={700} x2={400} y2={730} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
            <line x1={400} y1={700} x2={370} y2={730} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
            <text x={385} y={770} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.vibrant_red}>FAIL</text>
          </g>

          {/* Checkmark on retry */}
          <g opacity={interpolate(frame, [48, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
            <path d="M 670,705 L 690,725 L 730,680" fill="none"
              stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            <text x={700} y={770} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.accent}>PASS</text>
          </g>
        </g>

        {/* Definition card */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY + breathe})`}>
          <BentoCard x={60} y={1080} w={960} h={140} accent />
          <rect x={60} y={1080} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1165} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Failed? <tspan fill={COLORS.accent} fontStyle="italic">Retry just that step</tspan>
          </text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
