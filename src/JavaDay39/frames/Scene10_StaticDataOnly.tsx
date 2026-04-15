/**
 * Scene 10 — Static Data Only
 * "Static methods can only work with static data."
 * CSV: 52.700s → 55.760s | Duration: 92 frames
 * Animation: Phase 1 headline → Phase 2 barrier diagram → Phase 3 pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene10_StaticDataOnly: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const card1 = useSpringEntrance(frame, 16);
  const card2 = useSpringEntrance(frame, 28);

  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="RULE · ACCESS RESTRICTION" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>Static Methods</text>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>Only Static Data</text>
        </g>

        {/* Two-column barrier diagram */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          {/* Left: accessible */}
          <BentoCard x={60} y={480} w={460} h={520} accent />
          <text x={290} y={540} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>CAN ACCESS</text>

          <rect x={100} y={570} width={380} height={80} rx={12} fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={290} y={622} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>static int total</text>

          <rect x={100} y={670} width={380} height={80} rx={12} fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={290} y={722} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>static String name</text>

          <rect x={100} y={770} width={380} height={80} rx={12} fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={290} y={822} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>other static methods</text>

          {/* check marks */}
          {[600, 700, 800].map((y, i) => (
            <text key={i} x={440} y={y} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
              {'>>'}
            </text>
          ))}

          {/* Right: blocked */}
          <BentoCard x={560} y={480} w={460} h={520} />
          <text x={790} y={540} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>CANNOT ACCESS</text>

          <rect x={600} y={570} width={380} height={80} rx={12} fill={COLORS.vibrant_red} fillOpacity={0.06} stroke={COLORS.vibrant_red} strokeWidth={1.5} strokeDasharray="8,4" />
          <text x={790} y={622} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>int speed</text>

          <rect x={600} y={670} width={380} height={80} rx={12} fill={COLORS.vibrant_red} fillOpacity={0.06} stroke={COLORS.vibrant_red} strokeWidth={1.5} strokeDasharray="8,4" />
          <text x={790} y={722} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>String route</text>

          <rect x={600} y={770} width={380} height={80} rx={12} fill={COLORS.vibrant_red} fillOpacity={0.06} stroke={COLORS.vibrant_red} strokeWidth={1.5} strokeDasharray="8,4" />
          <text x={790} y={822} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>this.anything</text>

          {/* X marks */}
          {[600, 700, 800].map((y, i) => (
            <g key={i}>
              <line x1={945} y1={y - 12} x2={970} y2={y + 12} stroke={COLORS.vibrant_red} strokeWidth={2.5} />
              <line x1={970} y1={y - 12} x2={945} y2={y + 12} stroke={COLORS.vibrant_red} strokeWidth={2.5} />
            </g>
          ))}
        </g>

        {/* Center barrier line */}
        <g opacity={card1.opacity}>
          <line x1={540} y1={480} x2={540} y2={1000} stroke={COLORS.text_muted} strokeWidth={2} strokeDasharray="8,4" />
        </g>

        {/* Bottom rule */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={140} accent />
          <rect x={60} y={1040} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={540} y={1128} textAnchor="middle" fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            Static world is isolated from instances
          </text>
        </g>

        <g transform={`translate(540, ${1300 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.06} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
