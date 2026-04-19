/**
 * Scene 17 — Reference Same
 * "The reference stays the same."
 * Duration: 55 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Headline
 *   Phase 2 (frames 15–40): Reference card locked
 *   Phase 3 (frames 35–end): Lock pulse
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

export const Scene17_ReferenceSame: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 3);
  const refCard = useSpringEntrance(frame, 10);
  const lockIcon = useSpringEntrance(frame, 16);
  const typeCard = useSpringEntrance(frame, 22);
  const insightCard = useSpringEntrance(frame, 28);

  const lockPulse = 1 + Math.sin(frame * 0.1) * 0.03;
  const breathe = Math.sin(frame * 0.05) * 3;

  // Lock path draw
  const lockLen = 120;
  const lockDash = usePathDraw(frame, 18, lockLen, 20);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · REFERENCE" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={540} y={340} textAnchor="middle" fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>The Reference</text>
          <text x={540} y={440} textAnchor="middle" fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.accent}>Stays The Same</text>
        </g>

        {/* ── Reference card ───────────────────────────────────────────── */}
        <g opacity={refCard.opacity} transform={`translate(0, ${refCard.translateY})`}>
          <BentoCard x={120} y={520} w={840} h={280} accent />
          <text x={540} y={600} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">DECLARED TYPE</text>
          <text x={540} y={680} textAnchor="middle" fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>FareCalculator fc</text>
          <text x={540} y={745} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Parent reference — unchanging</text>
        </g>

        {/* ── Lock icon ────────────────────────────────────────────────── */}
        <g opacity={lockIcon.opacity} transform={`translate(540, ${890 + breathe}) scale(${lockPulse})`}
          style={{ transformOrigin: '540px 890px' }}>
          {/* Lock body */}
          <rect x={-35} y={10} width={70} height={55} rx={8}
            fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={3} />
          {/* Lock shackle */}
          <path d={`M -18,-15 A 18,18 0 0 1 18,-15 L 18,10 M -18,-15 L -18,10`}
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={lockLen} strokeDashoffset={lockDash} />
          {/* Keyhole */}
          <circle cx={0} cy={32} r={6} fill={COLORS.accent} />
          <rect x={-3} y={34} width={6} height={14} rx={2} fill={COLORS.accent} />
        </g>

        {/* ── Type card ────────────────────────────────────────────────── */}
        <g opacity={typeCard.opacity} transform={`translate(0, ${typeCard.translateY})`}>
          <BentoCard x={60} y={1000} w={460} h={180} />
          <text x={80} y={1060} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>COMPILE-TIME</text>
          <text x={80} y={1110} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Fixed at declaration</text>
          <text x={80} y={1155} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Cannot change</text>
        </g>

        <g opacity={typeCard.opacity} transform={`translate(0, ${typeCard.translateY})`}>
          <BentoCard x={560} y={1000} w={460} h={180} accent />
          <text x={580} y={1060} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>IMMUTABLE</text>
          <text x={580} y={1110} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Same variable type</text>
          <text x={580} y={1155} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Always parent</text>
        </g>

        {/* ── Insight bottom ───────────────────────────────────────────── */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={130} accent />
          <rect x={60} y={1240} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={1318} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Stability through abstraction
          </text>
        </g>

        {/* ── Accent dots ──────────────────────────────────────────────── */}
        {Array.from({ length: 5 }, (_, i) => (
          <circle key={i} cx={300 + i * 120} cy={1480 + Math.sin(frame * 0.05 + i) * 4}
            r={4} fill={COLORS.accent} fillOpacity={0.15} />
        ))}

        {/* ── Bottom track lines ───────────────────────────────────────── */}
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
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
