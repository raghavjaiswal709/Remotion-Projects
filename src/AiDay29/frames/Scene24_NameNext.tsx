/**
 * Scene 24 — NameNext
 * "That is exactly what we name next."
 * CSV: 68.600s → 70.520s
 * Duration: 59 frames (1.97s)
 *
 * Animation phases:
 *   Phase 1 (0–14): headline snap
 *   Phase 2 (10–40): teaser card + forward arrow
 *   Phase 3 (30–end): micro
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene24_NameNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);

  // Per-word: "What We Name Next"
  const words = ['What We', 'Name Next'];
  const wordEnts = words.map((_, i) => {
    const f2 = Math.max(0, frame - 2 - i * 5);
    const sp = spring({ frame: f2, fps, config: SPRING_SNAP });
    return {
      ty: interpolate(sp, [0, 1], [24, 0]),
      op: interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
    };
  });

  const subEnt = useSpringEntrance(frame, 10);

  // Forward arrow (large, dramatic)
  const arrowLen = 600;
  const arrowDash = usePathDraw(frame, 14, arrowLen, 25);

  // "DAY 30" teaser card
  const teaserEnt = useSpringEntrance(frame, 20);

  // Dots trail
  const dotsEnts = Array.from({ length: 5 }, (_, i) => useSpringEntrance(frame, 16 + i * 3));

  // Summary cards
  const card1 = useSpringEntrance(frame, 26);
  const card2 = useSpringEntrance(frame, 32);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Big accent circle behind
  const circleEnt = useSpringEntrance(frame, 12);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s24.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        {words.map((w, i) => (
          <text key={i} x={60} y={310 + i * 100} opacity={wordEnts[i].op}
            transform={`translate(0, ${wordEnts[i].ty})`}
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={i === 1 ? COLORS.accent : COLORS.white}>{w}</text>
        ))}

        <g opacity={subEnt.opacity} transform={`translate(0, ${subEnt.translateY})`}>
          <text x={60} y={500} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>Coming up in Day 30...</text>
        </g>

        {/* Large background circle */}
        <circle cx={540} cy={880} r={220} fill={COLORS.accent}
          opacity={circleEnt.opacity * 0.04 * shimmer} />
        <circle cx={540} cy={880} r={220} fill="none" stroke={COLORS.accent}
          strokeWidth={2} opacity={circleEnt.opacity * 0.15} />

        {/* Forward arrow — dramatic horizontal */}
        <path d="M 160,880 L 920,880"
          fill="none" stroke={COLORS.accent} strokeWidth={4}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Dots trail below arrow */}
        {dotsEnts.map((ent, i) => {
          const dx = 200 + i * 140;
          return (
            <g key={i} opacity={ent.opacity}>
              <circle cx={dx} cy={940} r={4} fill={COLORS.accent} opacity={0.4 + i * 0.1} />
              <circle cx={dx} cy={940} r={10} fill={COLORS.accent} opacity={0.06} />
            </g>
          );
        })}

        {/* NEXT label at arrow tip */}
        <text x={920} y={850} textAnchor="end" opacity={circleEnt.opacity}
          fontFamily={FONT} fontSize={28} fontWeight={800}
          fill={COLORS.accent} letterSpacing="0.15em">NEXT</text>

        {/* Teaser card: DAY 30 */}
        <g opacity={teaserEnt.opacity} transform={`translate(0, ${teaserEnt.translateY})`}>
          <BentoCard x={200} y={1020} w={680} h={200} accent />
          {/* Day number */}
          <text x={260} y={1100} fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent}>DAY 30</text>
          {/* Topic hint */}
          <text x={260} y={1150} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>Agent Goals & Objectives</text>
          <text x={260} y={1188} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Giving the loop its purpose</text>
          {/* Chevron */}
          <path d="M 820,1100 L 840,1120 L 820,1140" fill="none"
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <path d="M 800,1100 L 820,1120 L 800,1140" fill="none"
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
        </g>

        {/* Summary cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1280} w={460} h={120} />
          <rect x={60} y={1280} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1330} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>TODAY: RUNTIME</text>
          <text x={100} y={1366} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>The engine that runs agents</text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1280} w={460} h={120} />
          <rect x={560} y={1280} width={6} height={120} rx={3} fill={COLORS.white} />
          <text x={600} y={1330} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>TOMORROW: GOALS</text>
          <text x={600} y={1366} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>The direction agents follow</text>
        </g>

        {/* Bottom bar */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1440} w={960} h={90} />
          <text x={540} y={1498} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Stay tuned — <tspan fill={COLORS.accent}>Day 30</tspan> continues the journey
          </text>
        </g>

        {/* Floating */}
        {Array.from({ length: 6 }, (_, i) => {
          const px = 120 + i * 150;
          const py = 1620 + breathe * (i % 2 === 0 ? 1 : -1);
          return <circle key={i} cx={px} cy={py} r={2} fill={COLORS.accent} opacity={0.05 * shimmer} />;
        })}

        <g transform={`translate(540, ${1680 + breathe})`}>
          <circle cx={0} cy={0} r={16} fill={COLORS.accent} opacity={0.03} />
          <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.08} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s24.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
