/**
 * Scene 14 — Reversibility
 * "the reversibility of each action."
 * CSV: 49.980s → 52.700s | Duration: 81 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring entrance
 *   Phase 2 (20–60): Key/lock illustration + undo arrow
 *   Phase 3 (50–end): Micro animations
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene14_Reversibility: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 34);
  const card3 = useSpringEntrance(frame, 46);

  // Undo arrow path draw
  const undoLen = 320;
  const undoDash = usePathDraw(frame, 24, undoLen, 30);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Key rotation
  const keyRotation = interpolate(frame, [30, 50], [0, 35], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · CORE PRINCIPLE" y={160} />
        </g>

        {/* Zone B — Hero */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={540} y={320} textAnchor="middle" fontFamily={FONT}
            fontSize={100} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Reversibility
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={540} y={430} textAnchor="middle" fontFamily={FONT}
            fontSize={48} fontWeight={800} fill={COLORS.text_muted}>
            of each action
          </text>
        </g>

        {/* Zone C — Key/Lock + Undo concept */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={510} w={960} h={520} accent />

          {/* Large undo/reverse arrow */}
          <g transform="translate(540, 770)">
            {/* Circular arrow */}
            <path
              d="M 0,-120 A 120,120 0 1,1 -85,85"
              fill="none" stroke={COLORS.accent} strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={undoLen}
              strokeDashoffset={undoDash}
            />
            {/* Arrowhead at end */}
            <g opacity={interpolate(frame, [50, 56], [0, 1], { extrapolateRight: 'clamp' })}>
              <polygon points="-95,75 -75,95 -105,100" fill={COLORS.accent} />
            </g>

            {/* Key icon in center */}
            <g transform={`rotate(${keyRotation})`}>
              {/* Key head (circle) */}
              <circle cx={0} cy={0} r={36} fill={COLORS.bg_secondary}
                stroke={COLORS.accent} strokeWidth={3} />
              <circle cx={0} cy={0} r={12} fill="none"
                stroke={COLORS.accent} strokeWidth={2} />
              {/* Key shaft */}
              <rect x={-5} y={36} width={10} height={55} rx={3}
                fill={COLORS.accent} />
              {/* Key teeth */}
              <rect x={5} y={60} width={16} height={6} rx={2}
                fill={COLORS.accent} />
              <rect x={5} y={76} width={12} height={6} rx={2}
                fill={COLORS.accent} />
            </g>

            {/* Label: CAN BE REVERSED? */}
            <text x={0} y={160} textAnchor="middle" fontFamily={FONT}
              fontSize={32} fontWeight={800} fill={COLORS.white}>
              CAN IT BE REVERSED?
            </text>
          </g>
        </g>

        {/* Two outcome cards */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1080} w={460} h={260} />
          {/* Green checkmark */}
          <circle cx={140} cy={1170} r={30} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <path d="M 124,1170 L 135,1183 L 158,1155" fill="none"
            stroke={COLORS.accent} strokeWidth={3.5} strokeLinecap="round"
            strokeLinejoin="round" />
          <text x={190} y={1168} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            YES
          </text>
          <text x={100} y={1230} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Agent proceeds
          </text>
          <text x={100} y={1270} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            autonomously
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1080} w={460} h={260} accent />
          {/* Red X */}
          <circle cx={640} cy={1170} r={30}
            fill={COLORS.vibrant_red} fillOpacity={0.15}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <path d="M 626,1156 L 654,1184 M 654,1156 L 626,1184"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3.5}
            strokeLinecap="round" />
          <text x={690} y={1168} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>
            NO
          </text>
          <text x={600} y={1230} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Agent waits for
          </text>
          <text x={600} y={1270} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            human approval
          </text>
        </g>

        {/* Micro animations */}
        <g transform={`translate(540, ${1440 + breathe})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent}
            fillOpacity={0.03 * shimmer} />
          <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.15} />
        </g>

        {[0, 1, 2].map(i => (
          <circle key={i} cx={280 + i * 250}
            cy={1550 + Math.sin(frame * 0.05 + i) * 5}
            r={2.5} fill={COLORS.accent} opacity={0.08} />
        ))}

        {/* Bottom insight */}
        <g opacity={interpolate(frame, [60, 70], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1660} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The single most important factor
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
