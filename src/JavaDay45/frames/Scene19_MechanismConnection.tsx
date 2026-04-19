/**
 * Scene 19 — Mechanism Connection
 * "The mechanism that makes this possible is the connection between
 *  the parent reference and the child object."
 * Duration: 169 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Headline
 *   Phase 2 (frames 20–80): Parent ref → arrow → child object diagram
 *   Phase 3 (frames 70–end): Pulsing connection, floating
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

export const Scene19_MechanismConnection: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 9);
  const parentBox = useSpringEntrance(frame, 18);
  const childBox  = useSpringEntrance(frame, 30);
  const connLine  = useSpringEntrance(frame, 24);
  const mechLabel = useSpringEntrance(frame, 40);
  const detailCard1 = useSpringEntrance(frame, 50);
  const detailCard2 = useSpringEntrance(frame, 60);
  const insightCard = useSpringEntrance(frame, 70);

  const connLen = 400;
  const connDash = usePathDraw(frame, 26, connLen, 30);

  const pulse = 1 + Math.sin(frame * 0.07) * 0.015;
  const breathe = Math.sin(frame * 0.05) * 4;
  const glowOp = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.3, 0.7]);

  // Connection glow pulse
  const connGlow = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.1, 0.25]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · MECHANISM" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>The Mechanism</text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent}>Parent ↔ Child Connection</text>
        </g>

        {/* ── Parent reference box ─────────────────────────────────────── */}
        <g opacity={parentBox.opacity} transform={`translate(0, ${parentBox.translateY})`}>
          <BentoCard x={60} y={440} w={420} h={260} accent />
          <text x={80} y={495} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">PARENT REFERENCE</text>
          <rect x={80} y={510} width={380} height={3} rx={1} fill={COLORS.accent} fillOpacity={0.2} />
          <text x={80} y={570} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>FareCalculator</text>
          <text x={80} y={620} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>fc</text>
          <text x={80} y={672} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Declared type</text>
        </g>

        {/* ── Connection line with glow ─────────────────────────────────── */}
        <g opacity={connLine.opacity}>
          {/* Glow behind line */}
          <line x1={480} y1={570} x2={600} y2={570}
            stroke={COLORS.accent} strokeWidth={8} opacity={connGlow} strokeLinecap="round" />
          {/* Main connection line */}
          <path d="M 480,570 C 520,570 560,570 600,570"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={connLen} strokeDashoffset={connDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
          {/* Connection label */}
          <g opacity={mechLabel.opacity}>
            <rect x={498} y={530} width={90} height={30} rx={8}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1} />
            <text x={543} y={552} textAnchor="middle" fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.accent}>LINK</text>
          </g>
        </g>

        {/* ── Child object box ─────────────────────────────────────────── */}
        <g opacity={childBox.opacity} transform={`translate(0, ${childBox.translateY})`}>
          <BentoCard x={600} y={440} w={420} h={260} accent />
          <text x={620} y={495} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">CHILD OBJECT</text>
          <rect x={620} y={510} width={380} height={3} rx={1} fill={COLORS.accent} fillOpacity={0.2} />
          <text x={620} y={570} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>ExpressFare</text>
          <text x={620} y={615} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Calculator</text>
          <text x={620} y={672} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Actual object in heap</text>
        </g>

        {/* ── Detail cards ─────────────────────────────────────────────── */}
        <g opacity={detailCard1.opacity} transform={`translate(0, ${detailCard1.translateY})`}>
          <BentoCard x={60} y={740} w={460} h={200} />
          <rect x={60} y={740} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={800} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>REFERENCE SIDE</text>
          <text x={100} y={850} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Compile-time type</text>
          <text x={100} y={900} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Determines visible API</text>
        </g>

        <g opacity={detailCard2.opacity} transform={`translate(0, ${detailCard2.translateY})`}>
          <BentoCard x={560} y={740} w={460} h={200} accent />
          <rect x={560} y={740} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={600} y={800} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>OBJECT SIDE</text>
          <text x={600} y={850} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Runtime type</text>
          <text x={600} y={900} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Determines behavior</text>
        </g>

        {/* ── Insight card ─────────────────────────────────────────────── */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={140} accent />
          <rect x={60} y={980} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1060} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            This connection IS polymorphism
          </text>
        </g>

        {/* ── Connection illustration — larger ─────────────────────────── */}
        <g opacity={insightCard.opacity * 0.15} transform={`translate(540, ${1250 + breathe})`}>
          {/* Two circles connected by line */}
          <circle cx={-150} cy={0} r={50} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '-150px 0px' }} />
          <circle cx={150} cy={0} r={50} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '150px 0px' }} />
          <line x1={-100} y1={0} x2={100} y2={0} stroke={COLORS.accent} strokeWidth={2}
            opacity={glowOp} />
          <text x={-150} y={6} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent}>REF</text>
          <text x={150} y={6} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent}>OBJ</text>
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
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
