/**
 * Scene 27 — Every Rule and Edge Case of Overloading
 * "But first, every rule and edge case of overloading itself."
 * CSV: 101.460s → 105.240s
 * Duration: ~113 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–70): Checklist of topics with stagger
 *   Phase 3 (60–end): Micro breathe
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

export const Scene27_RulesAndEdgeCases: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  const items = [
    { text: 'Parameter count rules', icon: '#' },
    { text: 'Type matching & widening', icon: 'T' },
    { text: 'Return type restrictions', icon: 'R' },
    { text: 'Ambiguity resolution', icon: '?' },
    { text: 'Varargs interactions', icon: '...' },
  ];
  const itemEnts = items.map((_, i) => useSpringEntrance(frame, 20 + i * 10));

  const summaryEnt = useSpringEntrance(frame, 72);
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s27.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="DEEP DIVE · PREVIEW" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800} fill={COLORS.white}>
            Every Rule
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={540} y={385} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            & Edge Case
          </text>
        </g>

        {/* Checklist items */}
        {items.map((item, i) => {
          const ent = itemEnts[i];
          const cardY = 480 + i * 170;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={140} accent={i === 0} />
              <rect x={60} y={cardY} width={6} height={140} rx={3}
                fill={i === 0 ? COLORS.accent : COLORS.text_muted} opacity={i === 0 ? 1 : 0.3} />

              {/* Icon circle */}
              <circle cx={130} cy={cardY + 70} r={28}
                fill={COLORS.accent} opacity={0.1} />
              <text x={130} y={cardY + 78} textAnchor="middle"
                fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={700}
                fill={COLORS.accent}>
                {item.icon}
              </text>

              {/* Label */}
              <text x={180} y={cardY + 78}
                fontFamily={FONT} fontSize={34} fontWeight={800}
                fill={COLORS.white}>
                {item.text}
              </text>

              {/* Number */}
              <text x={970} y={cardY + 78} textAnchor="end"
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted} opacity={0.3}>
                {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          );
        })}

        {/* Summary */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={120} y={1380} w={840} h={100} accent />
          <text x={540} y={1442} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
            All overloading rules — <tspan fill={COLORS.accent}>next session</tspan>
          </text>
        </g>

        {/* Tracks */}
        <line x1={60} y1={1580} x2={1020} y2={1580}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />
        <line x1={60} y1={1596} x2={1020} y2={1596}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />

        <g transform={`translate(540, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.accent}
            strokeWidth={2} opacity={0.04}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s27.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
