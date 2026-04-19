/**
 * Scene 18 — Can Be Undone Proceeds
 * "If the action can be undone, the agent proceeds."
 * CSV: 66.367s → 69.700s | Duration: 100 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–70): Undo arrow + green proceed flow
 *   Phase 3 (70–end): Micro animations
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

export const Scene18_CanBeUndoneProceeds: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 35);
  const card3 = useSpringEntrance(frame, 50);
  const card4 = useSpringEntrance(frame, 64);

  // Undo arrow path draw
  const undoLen = 280;
  const undoDash = usePathDraw(frame, 25, undoLen, 25);

  // Checkmark path draw
  const checkLen = 60;
  const checkDash = usePathDraw(frame, 40, checkLen, 15);

  // Forward arrow
  const fwdLen = 150;
  const fwdDash = usePathDraw(frame, 48, fwdLen, 18);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · REVERSIBLE ACTIONS" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            Can Be Undone?
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent}>
            Agent proceeds.
          </text>
        </g>

        {/* Card 1 — Large undo illustration */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={380} accent />

          {/* Big circular undo arrow */}
          <g transform="translate(320, 680)">
            <path d="M 50,-100 A 110,110 0 1,0 -80,-70"
              fill="none" stroke={COLORS.accent} strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={undoLen} strokeDashoffset={undoDash} />
            {/* Arrowhead */}
            <polygon points="-80,-90 -60,-70 -80,-50"
              fill={COLORS.accent}
              opacity={interpolate(frame, [40, 50], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })} />
            <text x={0} y={10} textAnchor="middle" fontFamily={FONT}
              fontSize={36} fontWeight={800} fill={COLORS.accent}>
              UNDO
            </text>
          </g>

          {/* Green checkmark */}
          <g transform="translate(700, 620)">
            <circle cx={0} cy={0} r={50} fill="rgba(76,175,80,0.08)"
              stroke="rgba(76,175,80,0.5)" strokeWidth={2.5} />
            <path d="M -20,0 L -6,14 L 22,-14"
              fill="none" stroke="rgba(76,175,80,1)" strokeWidth={5}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          </g>
          <text x={700} y={704} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill="rgba(76,175,80,0.9)">
            SAFE
          </text>

          {/* Forward arrow */}
          <g transform="translate(700, 760)">
            <path d="M -60,0 L 60,0"
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={fwdLen} strokeDashoffset={fwdDash}
              markerEnd="url(#arrow)" />
          </g>
        </g>

        {/* Examples row */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={900} w={300} h={180} />
          <text x={210} y={975} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.white}>
            Create file
          </text>
          <text x={210} y={1020} textAnchor="middle" fontFamily={FONT}
            fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Delete later
          </text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={390} y={900} w={300} h={180} />
          <text x={540} y={975} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.white}>
            Edit config
          </text>
          <text x={540} y={1020} textAnchor="middle" fontFamily={FONT}
            fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Revert changes
          </text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={720} y={900} w={300} h={180} />
          <text x={870} y={975} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.white}>
            Add entry
          </text>
          <text x={870} y={1020} textAnchor="middle" fontFamily={FONT}
            fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Remove entry
          </text>
        </g>

        {/* Bottom cards */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1120} w={460} h={200} accent />
          <text x={100} y={1210} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            Low risk
          </text>
          <text x={100} y={1260} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Mistakes correctable
          </text>
          <text x={100} y={1294} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            No lasting damage
          </text>
        </g>
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={1120} w={460} h={200} />
          <text x={600} y={1210} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            No bottleneck
          </text>
          <text x={600} y={1260} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Agent moves fast
          </text>
          <text x={600} y={1294} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            No waiting on humans
          </text>
        </g>

        {/* Summary */}
        <g opacity={card4.opacity}>
          <BentoCard x={60} y={1360} w={960} h={100} />
          <text x={540} y={1422} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Reversible = Autonomous
          </text>
        </g>

        {/* Micro */}
        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent}
            fillOpacity={0.03} />
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent}
            strokeWidth={1} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.1} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
