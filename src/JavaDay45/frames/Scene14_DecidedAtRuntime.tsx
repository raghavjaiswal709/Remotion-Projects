/**
 * Scene 14 — Decided At Runtime
 * "It is decided when the program is running,"
 * CSV: 48.720s → 51.120s
 * Duration: 72 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Headline
 *   Phase 2 (frames 15–45): Running indicator, check badge
 *   Phase 3 (frames 40–end): Pulse animation
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

export const Scene14_DecidedAtRuntime: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 9);
  const checkBadge = useSpringEntrance(frame, 14);
  const runtimeCard = useSpringEntrance(frame, 22);
  const jvmCard = useSpringEntrance(frame, 30);
  const tile1 = useSpringEntrance(frame, 38);
  const tile2 = useSpringEntrance(frame, 44);
  const gearCard = useSpringEntrance(frame, 50);

  const checkLen = 60;
  const checkDash = usePathDraw(frame, 16, checkLen, 15);

  const gearAngle = interpolate(frame, [0, 90], [0, 360], { extrapolateRight: 'extend' });
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Running dots animation
  const dotPhase = (frame * 0.15) % (Math.PI * 2);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · RUNTIME" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Decided At
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">Runtime</text>
        </g>

        {/* ── Check badge ──────────────────────────────────────────────── */}
        <g opacity={checkBadge.opacity} transform={`translate(0, ${checkBadge.translateY})`}>
          <circle cx={540} cy={580} r={65}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={3}
            transform={`scale(${pulse})`} style={{ transformOrigin: '540px 580px' }} />
          {/* Check path draw */}
          <path d="M 510,580 L 530,605 L 570,555"
            fill="none" stroke={COLORS.accent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={checkLen} strokeDashoffset={checkDash} />
        </g>

        {/* ── Runtime card ─────────────────────────────────────────────── */}
        <g opacity={runtimeCard.opacity} transform={`translate(0, ${runtimeCard.translateY})`}>
          <BentoCard x={60} y={680} w={960} h={180} accent />
          <rect x={60} y={680} width={6} height={180} rx={3} fill={COLORS.accent} />

          <text x={100} y={740} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">PROGRAM IS RUNNING</text>
          <text x={100} y={795} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            JVM inspects actual object type
          </text>

          {/* Running dots */}
          {[0, 1, 2].map(i => (
            <circle key={i} cx={820 + i * 30} cy={740}
              r={6} fill={COLORS.accent}
              opacity={0.3 + 0.7 * Math.max(0, Math.sin(dotPhase - i * 0.8))} />
          ))}

          <text x={100} y={835} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Then dispatches the correct method</text>
        </g>

        {/* ── JVM card ─────────────────────────────────────────────────── */}
        <g opacity={jvmCard.opacity} transform={`translate(0, ${jvmCard.translateY})`}>
          <BentoCard x={60} y={900} w={960} h={200} />

          {/* Gear illustration */}
          <g transform={`translate(180, 1000) rotate(${gearAngle})`} style={{ transformOrigin: '0px 0px' }}>
            {[0, 60, 120, 180, 240, 300].map((a, i) => (
              <rect key={i} x={-6} y={-36} width={12} height={20} rx={4}
                fill={COLORS.accent} opacity={0.4}
                transform={`rotate(${a})`} style={{ transformOrigin: '0px 0px' }} />
            ))}
            <circle cx={0} cy={0} r={16} fill={COLORS.accent} opacity={0.2} />
            <circle cx={0} cy={0} r={8} fill={COLORS.accent} opacity={0.5} />
          </g>

          <text x={260} y={980} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            JVM Method Table
          </text>
          <text x={260} y={1030} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Virtual dispatch lookup</text>
          <text x={260} y={1075} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>O(1) vtable resolution</text>
        </g>

        {/* ── Compare tiles ────────────────────────────────────────────── */}
        <g opacity={tile1.opacity} transform={`translate(0, ${tile1.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={160} />
          <text x={100} y={1195} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red}>COMPILE TIME</text>
          <text x={100} y={1245} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>Type checking only</text>
        </g>

        <g opacity={tile2.opacity} transform={`translate(0, ${tile2.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={160} accent />
          <text x={600} y={1195} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>RUNTIME</text>
          <text x={600} y={1245} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Method dispatch</text>
        </g>

        {/* ── Bottom gear card ─────────────────────────────────────────── */}
        <g opacity={gearCard.opacity} transform={`translate(0, ${gearCard.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={120} />
          <text x={100} y={1410} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>Dynamic binding = late binding = virtual dispatch</text>
        </g>

        {/* ── Floating ─────────────────────────────────────────────────── */}
        <g opacity={0.05 * shimmer}>
          <circle cx={160} cy={1550 + breathe} r={20} fill={COLORS.accent} />
          <circle cx={920} cy={1530 - breathe} r={16} fill={COLORS.accent} />
        </g>

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <g opacity={0.07 * shimmer}>
          <line x1={60} y1={1640} x2={1020} y2={1640} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1650} x2={1020} y2={1650} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={90 + i * 72} y={1635} width={24} height={6} rx={2}
              fill={COLORS.accent} opacity={0.25} />
          ))}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
