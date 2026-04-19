/**
 * Scene 19 — Cannot Be Undone Waits
 * "If the action cannot be undone, the agent waits."
 * CSV: 69.700s → 72.967s | Duration: 98 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–70): Locked/no-undo illustration + wait cards
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

export const Scene19_CannotBeUndoneWaits: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 38);
  const card3 = useSpringEntrance(frame, 52);
  const card4 = useSpringEntrance(frame, 64);

  // Lock body path draw
  const lockLen = 200;
  const lockDash = usePathDraw(frame, 24, lockLen, 22);

  // X mark path draw
  const xLen = 80;
  const xDash1 = usePathDraw(frame, 32, xLen, 12);
  const xDash2 = usePathDraw(frame, 38, xLen, 12);

  // Waiting pulse
  const waitPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 1]);

  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · IRREVERSIBLE ACTIONS" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800}
            fill={COLORS.white}>
            Cannot Undo?
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Agent waits.
          </text>
        </g>

        {/* Card 1 — Lock illustration */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={380} />

          {/* Large lock icon */}
          <g transform="translate(340, 650)">
            {/* Lock shackle */}
            <path d="M -40,-50 A 40,40 0 0,1 40,-50 L 40,-20 L -40,-20 Z"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={5}
              strokeDasharray={lockLen} strokeDashoffset={lockDash}
              strokeLinejoin="round" />
            {/* Lock body */}
            <rect x={-50} y={-20} width={100} height={80} rx={10}
              fill={COLORS.vibrant_red} fillOpacity={0.12}
              stroke={COLORS.vibrant_red} strokeWidth={3} />
            {/* Keyhole */}
            <circle cx={0} cy={14} r={10} fill={COLORS.vibrant_red}
              fillOpacity={0.4} />
            <rect x={-4} y={20} width={8} height={20} rx={2}
              fill={COLORS.vibrant_red} fillOpacity={0.4} />
          </g>

          {/* No-undo icon */}
          <g transform="translate(700, 620)">
            <circle cx={0} cy={0} r={60} fill="none"
              stroke={COLORS.vibrant_red} strokeWidth={3} opacity={0.3} />
            {/* Undo arrow with X through it */}
            <path d="M 20,-30 A 35,35 0 1,0 -20,-30"
              fill="none" stroke={COLORS.text_muted} strokeWidth={3}
              strokeLinecap="round" opacity={0.4} />
            {/* X across */}
            <line x1={-28} y1={-28} x2={28} y2={28}
              stroke={COLORS.vibrant_red} strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={xLen} strokeDashoffset={xDash1} />
            <line x1={28} y1={-28} x2={-28} y2={28}
              stroke={COLORS.vibrant_red} strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={xLen} strokeDashoffset={xDash2} />
          </g>
          <text x={700} y={710} textAnchor="middle" fontFamily={FONT}
            fontSize={26} fontWeight={800} fill={COLORS.vibrant_red}>
            NO UNDO
          </text>

          {/* LOCKED label */}
          <text x={340} y={790} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}
            opacity={waitPulse}>
            LOCKED
          </text>
        </g>

        {/* Examples */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={900} w={460} h={180} />
          <text x={100} y={980} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Send payment
          </text>
          <text x={100} y={1024} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Money transferred
          </text>
          <text x={100} y={1054} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Cannot recall
          </text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={900} w={460} h={180} />
          <text x={600} y={980} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Publish post
          </text>
          <text x={600} y={1024} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Seen by audience
          </text>
          <text x={600} y={1054} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Damage already done
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1120} w={460} h={180} accent />
          <text x={100} y={1200} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>
            High risk
          </text>
          <text x={100} y={1250} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Consequences permanent
          </text>
        </g>
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={1120} w={460} h={180} />
          <text x={600} y={1200} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Human gate
          </text>
          <text x={600} y={1250} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Approval required
          </text>
        </g>

        <g opacity={card4.opacity}>
          <BentoCard x={60} y={1340} w={960} h={100} />
          <text x={540} y={1402} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            Irreversible = Human approval
          </text>
        </g>

        {/* Micro */}
        <g transform={`translate(540, ${1540 + breathe})`}>
          <circle cx={0} cy={0} r={16} fill={COLORS.vibrant_red}
            fillOpacity={0.04} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
