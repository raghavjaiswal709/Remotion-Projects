/**
 * Scene 21 — It Was Lucky
 * "It was lucky."
 * CSV: 52.200s → 53.800s
 * Duration: 48 frames (1.6s)
 *
 * Animation phases:
 *   Phase 1 (0–10): Label + headline
 *   Phase 2 (8–30): Dice / luck illustration
 *   Phase 3 (25–end): Pulse
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

export const Scene21_ItWasLucky: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const lbl = useSpringEntrance(frame, 0);
  const heroText = useSpringEntrance(frame, 2);
  const diceCard = useSpringEntrance(frame, 6);
  const vsCard = useSpringEntrance(frame, 14);
  const bottomCard = useSpringEntrance(frame, 22);

  const diceRotate = interpolate(frame, [6, 20], [0, 360], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const dicePop = spring({ frame: Math.max(0, frame - 6), fps, config: SPRING_SNAP });
  const diceScale = interpolate(dicePop, [0, 1], [0.3, 1]);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${lbl.translateY})`} opacity={lbl.opacity}>
          <SectionLabel text="TRAJECTORY · WARNING" y={160} opacity={0.8} />
        </g>

        {/* Giant "LUCKY" */}
        <g transform={`translate(0, ${heroText.translateY})`} opacity={heroText.opacity}>
          <text x={540} y={380} textAnchor="middle"
            fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.vibrant_red} fontStyle="italic" opacity={0.08}>
            LUCKY
          </text>
          <text x={540} y={380} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.vibrant_red} fontStyle="italic">
            It was lucky.
          </text>
        </g>

        {/* Dice illustration */}
        <g opacity={diceCard.opacity} transform={`translate(540, ${700 + diceCard.translateY})`}>
          <g transform={`scale(${diceScale})`} style={{ transformOrigin: '0px 0px' }}>
            <rect x={-80} y={-80} width={160} height={160} rx={24}
              fill={COLORS.bg_secondary} stroke={COLORS.vibrant_red} strokeWidth={3}
              transform={`rotate(${diceRotate % 45})`}
              style={{ transformOrigin: '0px 0px' }} />
            {/* Dice dots */}
            <circle cx={-35} cy={-35} r={12} fill={COLORS.vibrant_red} opacity={0.6} />
            <circle cx={35} cy={-35} r={12} fill={COLORS.vibrant_red} opacity={0.6} />
            <circle cx={0} cy={0} r={12} fill={COLORS.vibrant_red} opacity={0.6} />
            <circle cx={-35} cy={35} r={12} fill={COLORS.vibrant_red} opacity={0.6} />
            <circle cx={35} cy={35} r={12} fill={COLORS.vibrant_red} opacity={0.6} />
          </g>
        </g>

        {/* LUCK vs SKILL comparison */}
        <g opacity={vsCard.opacity} transform={`translate(0, ${vsCard.translateY})`}>
          <BentoCard x={60} y={880} w={460} h={200} />
          <rect x={60} y={880} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={940} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            LUCK
          </text>
          <text x={100} y={990} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Got the right answer
          </text>
          <text x={100} y={1040} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            by accident
          </text>

          <BentoCard x={560} y={880} w={460} h={200} accent />
          <text x={600} y={940} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            SKILL
          </text>
          <text x={600} y={990} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Got the right answer
          </text>
          <text x={600} y={1040} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            through valid reasoning
          </text>
        </g>

        {/* Bottom */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1140} w={960} h={140} accent />
          <text x={540} y={1226} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The <tspan fill={COLORS.accent} fontStyle="italic">trajectory</tspan> distinguishes the two
          </text>
        </g>

        {/* Floating accents */}
        {[200, 540, 880].map((x, i) => (
          <circle key={i} cx={x} cy={1400 + breathe + i * 30}
            r={5} fill={COLORS.vibrant_red} opacity={0.05 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
