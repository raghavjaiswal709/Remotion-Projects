/**
 * Scene 17 — Delete DB Full Stop
 * "Deleting a database record? Full stop. Human decides."
 * CSV: 62.100s → 66.367s | Duration: 128 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–80): DB cylinder + danger zone + stop sign
 *   Phase 3 (80–end): Micro animations
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

export const Scene17_DeleteDBFullStop: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 52);
  const card4 = useSpringEntrance(frame, 66);

  // Stop sign X path draw
  const xLen = 100;
  const xDash1 = usePathDraw(frame, 30, xLen, 15);
  const xDash2 = usePathDraw(frame, 38, xLen, 15);

  // Warning triangle flash
  const flash = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.6, 1]);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · HIGH RISK" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Full Stop.
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white}>
            Human decides.
          </text>
        </g>

        {/* Card 1 — Database with danger zone */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={380} />

          {/* Database cylinder large */}
          <g transform="translate(300, 600)">
            <ellipse cx={0} cy={-80} rx={100} ry={28}
              fill={COLORS.bg_primary} stroke={COLORS.vibrant_red}
              strokeWidth={3} />
            <rect x={-100} y={-80} width={200} height={160}
              fill={COLORS.bg_primary} stroke="none" />
            <line x1={-100} y1={-80} x2={-100} y2={80}
              stroke={COLORS.vibrant_red} strokeWidth={3} />
            <line x1={100} y1={-80} x2={100} y2={80}
              stroke={COLORS.vibrant_red} strokeWidth={3} />
            <ellipse cx={0} cy={80} rx={100} ry={28}
              fill={COLORS.bg_primary} stroke={COLORS.vibrant_red}
              strokeWidth={3} />
            {/* Data lines inside DB */}
            {[0, 1, 2].map(i => (
              <rect key={i} x={-60} y={-40 + i * 32} width={120}
                height={6} rx={3} fill={COLORS.vibrant_red}
                fillOpacity={0.15} />
            ))}
            <text x={0} y={130} textAnchor="middle" fontFamily={FONT}
              fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
              DATABASE
            </text>
          </g>

          {/* Big red X over DB */}
          <g transform="translate(300, 600)">
            <line x1={-60} y1={-60} x2={60} y2={60}
              stroke={COLORS.vibrant_red} strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={xLen} strokeDashoffset={xDash1} />
            <line x1={60} y1={-60} x2={-60} y2={60}
              stroke={COLORS.vibrant_red} strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={xLen} strokeDashoffset={xDash2} />
          </g>

          {/* Warning triangle */}
          <g transform="translate(700, 600)" opacity={flash}>
            <polygon points="0,-70 70,50 -70,50"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={4}
              strokeLinejoin="round" />
            <text x={0} y={20} textAnchor="middle" fontFamily={FONT}
              fontSize={60} fontWeight={800} fill={COLORS.vibrant_red}>
              !
            </text>
          </g>

          {/* DELETE label */}
          <g transform={`translate(700, 720)`}>
            <rect x={-80} y={-20} width={160} height={40} rx={8}
              fill={COLORS.vibrant_red} fillOpacity={0.15}
              stroke={COLORS.vibrant_red} strokeWidth={1.5} />
            <text x={0} y={8} textAnchor="middle" fontFamily={FONT}
              fontSize={22} fontWeight={800} fill={COLORS.vibrant_red}>
              DELETE
            </text>
          </g>
        </g>

        {/* Card 2 — IRREVERSIBLE badge */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={900} w={960} h={120} accent />
          <rect x={100} y={930} width={240} height={56} rx={28}
            fill={COLORS.vibrant_red} fillOpacity={0.12}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <text x={220} y={966} textAnchor="middle" fontFamily={FONT}
            fontSize={22} fontWeight={800} fill={COLORS.vibrant_red}>
            IRREVERSIBLE
          </text>
          <text x={400} y={970} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            Data gone forever
          </text>
        </g>

        {/* Bottom cards */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1060} w={460} h={200} />
          {/* Stop sign icon */}
          <g transform="translate(160, 1160)">
            <polygon
              points="0,-36 25,-25 36,0 25,25 0,36 -25,25 -36,0 -25,-25"
              fill={COLORS.vibrant_red} fillOpacity={0.12}
              stroke={COLORS.vibrant_red} strokeWidth={2} />
            <text x={0} y={8} textAnchor="middle" fontFamily={FONT}
              fontSize={22} fontWeight={800} fill={COLORS.vibrant_red}>
              STOP
            </text>
          </g>
          <text x={220} y={1140} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            Agent pauses
          </text>
          <text x={220} y={1184} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Presents intent, waits
          </text>
        </g>
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={1060} w={460} h={200} accent />
          {/* Human icon */}
          <g transform="translate(660, 1160)">
            <circle cx={0} cy={-16} r={14} fill="none"
              stroke={COLORS.accent} strokeWidth={2.5} />
            <path d="M -20,20 Q 0,5 20,20" fill="none"
              stroke={COLORS.accent} strokeWidth={2.5} />
          </g>
          <text x={700} y={1140} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>
            Human decides
          </text>
          <text x={700} y={1184} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Approve or reject
          </text>
        </g>

        {/* Summary bottom */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={120} />
          <text x={540} y={1372} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            No autonomous action on permanent operations
          </text>
        </g>

        {/* Micro */}
        <g transform={`translate(540, ${1520 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.vibrant_red}
            fillOpacity={0.04} />
          <circle cx={0} cy={0} r={20} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={1}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.1} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
