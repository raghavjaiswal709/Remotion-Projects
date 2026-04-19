/**
 * Scene 18 — Behavior Changes
 * "The behavior changes entirely."
 * Duration: 82 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Headline
 *   Phase 2 (frames 15–50): Behavior morph cards
 *   Phase 3 (frames 45–end): Pulse, floating
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

export const Scene18_BehaviorChanges: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 3);
  const card1  = useSpringEntrance(frame, 12);
  const card2  = useSpringEntrance(frame, 24);
  const arrowE = useSpringEntrance(frame, 18);
  const insightCard = useSpringEntrance(frame, 34);
  const morphCard   = useSpringEntrance(frame, 42);

  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 20, arrowLen, 25);
  const breathe = Math.sin(frame * 0.05) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Morphing shape — circle to diamond
  const morphT = interpolate(frame, [60, 82], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · BEHAVIOR" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={540} y={310} textAnchor="middle" fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>Behavior</text>
          <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">Changes Entirely</text>
        </g>

        {/* ── Before behavior ──────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={500} w={460} h={300} />
          <text x={80} y={555} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">BEHAVIOR A</text>
          <text x={80} y={610} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>Express Fare</text>
          <text x={80} y={665} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>base + surcharge</text>
          {/* Simple fare bar */}
          <rect x={80} y={700} width={320} height={20} rx={10}
            fill={COLORS.accent} fillOpacity={0.15} />
          <rect x={80} y={700} width={220} height={20} rx={10}
            fill={COLORS.accent} />
          <text x={80} y={760} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent}>$12.50</text>
        </g>

        {/* ── Arrow between cards ──────────────────────────────────────── */}
        <g opacity={arrowE.opacity}>
          <path d="M 520,650 L 560,650"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* ── After behavior ───────────────────────────────────────────── */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={500} w={460} h={300} accent />
          <text x={580} y={555} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">BEHAVIOR B</text>
          <text x={580} y={610} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>Metro Fare</text>
          <text x={580} y={665} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>zones * rate</text>
          {/* Different fare bar */}
          <rect x={580} y={700} width={320} height={20} rx={10}
            fill={COLORS.accent} fillOpacity={0.15} />
          <rect x={580} y={700} width={180} height={20} rx={10}
            fill={COLORS.accent} />
          <text x={580} y={760} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent}>$8.00</text>
        </g>

        {/* ── Insight card ─────────────────────────────────────────────── */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={840} w={960} h={160} accent />
          <rect x={60} y={840} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={900} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Same method call, different output
          </text>
          <text x={100} y={956} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Polymorphism in action
          </text>
        </g>

        {/* ── Morphing shape illustration ───────────────────────────────── */}
        <g opacity={morphCard.opacity} transform={`translate(540, ${1150 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '540px 1150px' }}>
          {/* Circle morphing toward diamond */}
          <circle cx={0} cy={0} r={interpolate(morphT, [0, 1], [60, 40])}
            fill="none" stroke={COLORS.accent} strokeWidth={3} opacity={1 - morphT} />
          {/* Diamond */}
          <polygon points={`0,${-60 * morphT} ${60 * morphT},0 0,${60 * morphT} ${-60 * morphT},0`}
            fill="none" stroke={COLORS.accent} strokeWidth={3} opacity={morphT} />
          <text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Many Forms</text>
        </g>

        {/* ── Before/After labels ──────────────────────────────────────── */}
        <g opacity={morphCard.opacity}>
          <BentoCard x={120} y={1310} w={360} h={120} />
          <text x={300} y={1380} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Reference: SAME</text>
        </g>
        <g opacity={morphCard.opacity}>
          <BentoCard x={600} y={1310} w={360} h={120} accent />
          <text x={780} y={1380} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>Object: DIFFERENT</text>
        </g>

        {/* Train tracks */}
        <g opacity={0.06 * shimmer}>
          <line x1={60} y1={1640} x2={1020} y2={1640} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1650} x2={1020} y2={1650} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={90 + i * 72} y={1635} width={24} height={6} rx={2}
              fill={COLORS.accent} opacity={0.25} />
          ))}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
