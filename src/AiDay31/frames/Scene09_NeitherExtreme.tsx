/**
 * Scene 09 — Neither Extreme
 * "Neither extreme is correct for every task."
 * CSV: 31.540s → 34.710s | Duration: 95 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–70): Balance visual
 *   Phase 3 (60–end): Micro animations
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

export const Scene09_NeitherExtreme: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 34);
  const card3 = useSpringEntrance(frame, 46);
  const card4 = useSpringEntrance(frame, 58);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Balance scale tilt
  const tiltAngle = interpolate(frame, [30, 60], [15, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // X marks
  const xDraw = usePathDraw(frame, 30, 40, 15);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · BALANCE" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Neither
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}>
            Extreme Works
          </text>
        </g>

        {/* Zone C — Balance scale */}
        <g opacity={card1.opacity} transform={`translate(540, ${700 + card1.translateY})`}>
          {/* Fulcrum triangle */}
          <polygon points="0,80 -30,130 30,130"
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Base */}
          <rect x={-50} y={130} width={100} height={8} rx={4}
            fill={COLORS.accent} opacity={0.3} />

          {/* Beam */}
          <g transform={`rotate(${tiltAngle})`} style={{ transformOrigin: '0px 80px' }}>
            <line x1={-280} y1={80} x2={280} y2={80}
              stroke={COLORS.white} strokeWidth={4} strokeLinecap="round" />

            {/* Left pan — Full Auto (red) */}
            <line x1={-280} y1={80} x2={-280} y2={120}
              stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <rect x={-360} y={120} width={160} height={50} rx={10}
              fill={COLORS.bg_secondary} stroke={COLORS.vibrant_red} strokeWidth={2} />
            <text x={-280} y={153} textAnchor="middle" fontFamily={FONT}
              fontSize={20} fontWeight={800} fill={COLORS.vibrant_red}>
              100% AUTO
            </text>

            {/* Right pan — Zero Auto (muted) */}
            <line x1={280} y1={80} x2={280} y2={120}
              stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <rect x={200} y={120} width={160} height={50} rx={10}
              fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={2} />
            <text x={280} y={153} textAnchor="middle" fontFamily={FONT}
              fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
              0% AUTO
            </text>
          </g>

          {/* X marks on both extremes */}
          <g opacity={card2.opacity}>
            {/* Left X */}
            <path d={`M -310,20 L -250,60`} fill="none" stroke={COLORS.vibrant_red}
              strokeWidth={4} strokeLinecap="round"
              strokeDasharray={40} strokeDashoffset={xDraw} />
            <path d={`M -250,20 L -310,60`} fill="none" stroke={COLORS.vibrant_red}
              strokeWidth={4} strokeLinecap="round"
              strokeDasharray={40} strokeDashoffset={xDraw} />
            {/* Right X */}
            <path d={`M 250,20 L 310,60`} fill="none" stroke={COLORS.vibrant_red}
              strokeWidth={4} strokeLinecap="round"
              strokeDasharray={40} strokeDashoffset={xDraw} />
            <path d={`M 310,20 L 250,60`} fill="none" stroke={COLORS.vibrant_red}
              strokeWidth={4} strokeLinecap="round"
              strokeDasharray={40} strokeDashoffset={xDraw} />
          </g>
        </g>

        {/* Explanation cards */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={960} w={960} h={180} accent />
          <rect x={60} y={960} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={120} y={1040} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Every task demands its
          </text>
          <text x={120} y={1095} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            own calibration
          </text>
        </g>

        {/* Two bottom detail cards */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={60} y={1180} w={460} h={200} />
          <text x={100} y={1260} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Full autonomy
          </text>
          <text x={100} y={1310} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Dangerous on critical ops
          </text>
        </g>
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={1180} w={460} h={200} />
          <text x={600} y={1260} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Zero autonomy
          </text>
          <text x={600} y={1310} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Wastes time on safe ops
          </text>
        </g>

        {/* Checkmark in center — ideal */}
        <g transform={`translate(540, ${1500 + breathe})`} opacity={card4.opacity * shimmer}>
          <circle cx={0} cy={0} r={38} fill={COLORS.accent} fillOpacity={0.08} />
          <circle cx={0} cy={0} r={38} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.25} />
          <path d="M -14,0 L -4,12 L 14,-8" fill="none" stroke={COLORS.accent}
            strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Floating hint */}
        <g opacity={interpolate(frame, [50, 70], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1600} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            The correct level depends on the action
          </text>
        </g>

        {/* Dots */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={400 + i * 140}
            cy={1680 + Math.sin(frame * 0.04 + i * 2) * 5}
            r={3} fill={COLORS.accent} opacity={0.12} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
