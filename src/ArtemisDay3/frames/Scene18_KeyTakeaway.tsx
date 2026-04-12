/**
 * Scene18_KeyTakeaway — Day 3 Key Takeaway
 * "Same orbit, different civilization — 56 years of human persistence"
 * Duration: 120 frames (4s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + hero text spring entrance
 *   Phase 2 (20–80): Supporting cards + orbit path draw
 *   Phase 3 (60–end): Pulse + float micro-animations
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, SectionLabel, CornerAccents } from '../helpers/components';

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

export const Scene18_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const heroWord1 = useSpringEntrance(frame, 6);
  const heroWord2 = useSpringEntrance(frame, 12);
  const heroWord3 = useSpringEntrance(frame, 18);
  const subtitleEnt = useSpringEntrance(frame, 24);

  // Phase 2
  const card1 = useSpringEntrance(frame, 30);
  const card2 = useSpringEntrance(frame, 42);
  const card3 = useSpringEntrance(frame, 54);
  const orbitLen = 500;
  const orbitDash = usePathDraw(frame, 25, orbitLen, 30);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <CornerAccents opacity={0.35} />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="KEY TAKEAWAY" y={260} opacity={0.55} />
        </g>

        {/* Hero headline — staggered per word */}
        <g transform={`translate(0, ${heroWord1.translateY})`} opacity={heroWord1.opacity}>
          <text x={540} y={400} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900}
            fill={COLORS.deep_black}>
            Same Orbit
          </text>
        </g>
        <g transform={`translate(0, ${heroWord2.translateY})`} opacity={heroWord2.opacity}>
          <text x={540} y={500} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900}
            fill={COLORS.sky_blue}>
            Different
          </text>
        </g>
        <g transform={`translate(0, ${heroWord3.translateY})`} opacity={heroWord3.opacity}>
          <text x={540} y={600} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900}
            fill={COLORS.sky_blue}>
            Civilization
          </text>
        </g>

        <g transform={`translate(0, ${subtitleEnt.translateY})`} opacity={subtitleEnt.opacity * 0.6}>
          <text x={540} y={680} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={500}
            fill={COLORS.cool_silver}>
            56 years of human persistence
          </text>
        </g>

        {/* Orbit illustration */}
        <g transform={`translate(540, ${920 + breathe})`}>
          {/* Moon (small) */}
          <circle cx={190} cy={0} r={18} fill={COLORS.cool_silver} fillOpacity={0.12}
            stroke={COLORS.cool_silver} strokeWidth={1.5} opacity={card1.opacity} />
          <circle cx={190} cy={-5} r={5} fill={COLORS.cool_silver} fillOpacity={0.08} opacity={card1.opacity} />

          {/* Orbit path */}
          <ellipse cx={0} cy={0} rx={190} ry={80} fill="none"
            stroke={COLORS.sky_blue} strokeWidth={2}
            strokeDasharray={orbitLen} strokeDashoffset={orbitDash}
            opacity={0.4}
          />

          {/* Earth (larger) */}
          <circle cx={-190} cy={0} r={30} fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2} opacity={card1.opacity}
            transform={`scale(${pulse})`} style={{ transformOrigin: '-190px 0px' }}
          />
          <text x={-190} y={55} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
            fill={COLORS.sky_blue} opacity={card1.opacity * 0.5}>
            EARTH
          </text>
          <text x={190} y={40} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
            fill={COLORS.cool_silver} opacity={card1.opacity * 0.5}>
            MOON
          </text>
        </g>

        {/* Three takeaway cards */}
        {[
          { label: 'Apollo 8', detail: 'December 1968', color: COLORS.cool_silver, ent: card1 },
          { label: 'Artemis II', detail: '2025 — Same trajectory', color: COLORS.sky_blue, ent: card2 },
          { label: '56 Years', detail: 'Of refusing to give up', color: COLORS.orange, ent: card3 },
        ].map((card, i) => (
          <g key={i} opacity={card.ent.opacity} transform={`translate(60, ${1100 + i * 150 + card.ent.translateY})`}>
            <rect x={0} y={0} width={960} height={120} rx={12}
              fill={card.color} fillOpacity={0.04} stroke={card.color} strokeWidth={1.5} />
            <rect x={0} y={0} width={6} height={120} rx={3} fill={card.color} />
            <text x={40} y={48} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800}
              fill={COLORS.deep_black}>{card.label}</text>
            <text x={40} y={90} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={500}
              fill={COLORS.cool_silver}>{card.detail}</text>
          </g>
        ))}

        {/* Bottom accent */}
        <line x1={60} y1={1600} x2={1020} y2={1600} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.07 * shimmer} />
      </svg>
    </AbsoluteFill>
  );
};
