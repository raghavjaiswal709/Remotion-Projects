/**
 * Scene 20 — Connection Has Name
 * "That connection has a name."
 * Duration: 54 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–15): Headline reveal
 *   Phase 2 (frames 12–35): Mystery card with question mark
 *   Phase 3 (frames 30–end): Pulse glow
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene20_ConnectionHasName: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 3);
  const headB  = useSpringEntrance(frame, 7);
  const mysteryCard = useSpringEntrance(frame, 12);
  const qMark  = useSpringEntrance(frame, 18);
  const hintCard = useSpringEntrance(frame, 24);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.025;
  const breathe = Math.sin(frame * 0.06) * 5;
  const glowOp = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.08, 0.2]);

  // Question mark bounce
  const qBounce = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_SNAP });
  const qScale = interpolate(qBounce, [0, 1], [0.5, 1]);

  // Border draw
  const borderLen = 2 * (840 + 400);
  const borderDash = usePathDraw(frame, 14, borderLen, 25);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · NAMING" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={540} y={340} textAnchor="middle" fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>That Connection</text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={540} y={450} textAnchor="middle" fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.accent}>Has A Name</text>
        </g>

        {/* ── Mystery card with animated border ────────────────────────── */}
        <g opacity={mysteryCard.opacity} transform={`translate(0, ${mysteryCard.translateY})`}>
          <rect x={120} y={530} width={840} height={400} rx={20}
            fill={COLORS.bg_secondary} />
          <rect x={120} y={530} width={840} height={400} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={borderLen} strokeDashoffset={borderDash} />

          {/* Glow behind question mark */}
          <circle cx={540} cy={730} r={120} fill={COLORS.accent} fillOpacity={glowOp} />

          {/* Big question mark */}
          <g opacity={qMark.opacity}
            transform={`translate(540, ${730 + breathe}) scale(${qScale * pulse})`}
            style={{ transformOrigin: '540px 730px' }}>
            <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT} fontSize={240} fontWeight={800}
              fill={COLORS.accent}>?</text>
          </g>
        </g>

        {/* ── Hint card ────────────────────────────────────────────────── */}
        <g opacity={hintCard.opacity} transform={`translate(0, ${hintCard.translateY})`}>
          <BentoCard x={120} y={980} w={840} h={140} accent />
          <rect x={120} y={980} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={540} y={1065} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>A formal OOP term you need to know</text>
        </g>

        {/* ── Connection dots ──────────────────────────────────────────── */}
        {Array.from({ length: 3 }, (_, i) => (
          <circle key={i} cx={420 + i * 120} cy={1200 + Math.sin(frame * 0.07 + i * 1.2) * 5}
            r={6} fill={COLORS.accent} fillOpacity={0.15 + i * 0.05} />
        ))}

        {/* ── Parent → ? → Child diagram below ────────────────────────── */}
        <g opacity={hintCard.opacity * 0.4}>
          <rect x={160} y={1280} width={200} height={80} rx={12}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <text x={260} y={1328} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>Parent</text>
          <line x1={360} y1={1320} x2={460} y2={1320}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          <text x={510} y={1330} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>?</text>
          <line x1={560} y1={1320} x2={660} y2={1320}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          <rect x={660} y={1280} width={200} height={80} rx={12}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <text x={760} y={1328} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>Child</text>
        </g>

        {/* Track lines */}
        <g opacity={0.06}>
          <line x1={60} y1={1640} x2={1020} y2={1640} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1650} x2={1020} y2={1650} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={90 + i * 72} y={1635} width={24} height={6} rx={2}
              fill={COLORS.accent} opacity={0.25} />
          ))}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
