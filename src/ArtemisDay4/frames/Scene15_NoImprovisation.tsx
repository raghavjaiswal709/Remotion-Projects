/**
 * Scene15 — No Improvisation
 * "The button exists because deep space does not tolerate improvisation."
 * CSV: 74.060s → 78.680s
 * Duration: 157 frames (5.23s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, headline with per-word spring
 *   Phase 2 (20–100): Content — deep space void, lone capsule, "no improvisation" strike-through
 *   Phase 3 (80–end): Micro — star field twinkle, capsule float, void pulse
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents, Divider } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene15_NoImprovisation: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEntrance = useSpringEntrance(frame, 0);

  // Per-word headline springs
  const words = ['Deep', 'Space', 'Does', 'Not', 'Tolerate'];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - (6 + i * 6));
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const improvWord = useSpringEntrance(frame, 42);
  const strikeDraw = usePathDraw(frame, 52, 600, 15);

  // Phase 2
  const voidCircle = useSpringEntrance(frame, 20);
  const capsuleEntrance = useSpringEntrance(frame, 35);
  const buttonCard = useSpringEntrance(frame, 55);
  const factCard1 = useSpringEntrance(frame, 65);
  const factCard2 = useSpringEntrance(frame, 75);

  // Phase 3
  const breathe = Math.sin(frame * 0.04) * 4;
  const pulse = 1 + Math.sin(frame * 0.06) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  const CX = 540;
  const CY = 850;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.amber} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={360} fontWeight={900} fill={COLORS.amber} opacity={0.04}>
          0
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ABORT SYSTEMS · PHILOSOPHY" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Per-word headline */}
        {words.map((word, i) => (
          <text key={i} x={60} y={370 + i * 56}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={900}
            fill={word === 'Not' ? COLORS.vibrant_red : COLORS.deep_black}
            opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}>
            {word}
          </text>
        ))}

        {/* "IMPROVISATION" with strike-through */}
        <g opacity={improvWord.opacity}
          transform={`translate(60, ${650 + improvWord.translateY})`}>
          <text x={0} y={0} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={900} fill={COLORS.vibrant_red}
            opacity={0.7}>
            Improvisation
          </text>
          {/* Strike-through line */}
          <line x1={-5} y1={-10} x2={600} y2={-10}
            stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeDasharray={600} strokeDashoffset={strikeDraw}
            strokeLinecap="round" />
        </g>

        {/* Deep space void visualization */}
        <g opacity={voidCircle.opacity}>
          {/* Outer void ring */}
          <circle cx={CX} cy={CY} r={180}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.15} />
          <circle cx={CX} cy={CY} r={140}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.deep_black} strokeWidth={0.5} opacity={0.1} />
          <circle cx={CX} cy={CY} r={100}
            fill={COLORS.deep_black} fillOpacity={0.05}
            stroke="none" />

          {/* Void label */}
          <text x={CX} y={CY + 220} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600} fill={COLORS.cool_silver}
            letterSpacing="0.2em" opacity={shimmer * 0.6}>
            400,000 KM FROM HELP
          </text>
        </g>

        {/* Star field around void */}
        {Array.from({ length: 35 }, (_, i) => {
          const angle = (i * 137.5) * Math.PI / 180;
          const dist = 120 + (i * 23) % 180;
          const sx = CX + Math.cos(angle) * dist;
          const sy = CY + Math.sin(angle) * dist;
          const twinkle = interpolate(
            Math.sin(frame * 0.08 + i * 1.3), [-1, 1], [0.1, 0.5]
          );
          return (
            <circle key={i} cx={sx} cy={sy} r={1 + (i % 3) * 0.4}
              fill={COLORS.cool_silver} opacity={twinkle} />
          );
        })}

        {/* Lone capsule in the void */}
        <g opacity={capsuleEntrance.opacity}
          transform={`translate(${CX}, ${CY + breathe})`}>
          <path d="M -14,-4 L -18,16 L 18,16 L 14,-4 Z"
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <rect x={-18} y={16} width={36} height={22} rx={3}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.cool_silver} strokeWidth={1} />
          {/* Solar panels */}
          <rect x={-45} y={20} width={24} height={8} rx={2}
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={1} />
          <rect x={21} y={20} width={24} height={8} rx={2}
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={1} />
        </g>

        {/* Button card */}
        <g opacity={buttonCard.opacity}
          transform={`translate(60, ${1120 + buttonCard.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.04}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          {/* Button icon */}
          <circle cx={60} cy={50} r={24}
            fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            style={{ transform: `scale(${pulse})`, transformOrigin: '60px 50px' }} />
          <circle cx={60} cy={50} r={12} fill={COLORS.vibrant_red} fillOpacity={0.15} />
          <text x={110} y={38} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            THE ABORT BUTTON EXISTS BECAUSE
          </text>
          <text x={110} y={72} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Space Has Zero Tolerance
          </text>
        </g>

        {/* Fact cards */}
        <g opacity={factCard1.opacity}
          transform={`translate(60, ${1250 + factCard1.translateY})`}>
          <rect x={0} y={0} width={460} height={100} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.05}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            ENVIRONMENT
          </text>
          <text x={30} y={76} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            No Air, No Help
          </text>
        </g>

        <g opacity={factCard2.opacity}
          transform={`translate(540, ${1250 + factCard2.translateY})`}>
          <rect x={0} y={0} width={460} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.05}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.orange} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            RESPONSE
          </text>
          <text x={30} y={76} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Pre-Engineered Only
          </text>
        </g>

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">ZERO IMPROVISATION · ZERO GUESSWORK</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
