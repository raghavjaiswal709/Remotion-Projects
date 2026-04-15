/**
 * Scene 12 — Utility Operations
 * "They are utility-level operations that exist at the class level."
 * CSV: 63.020s → 67.860s | Duration: 145 frames
 * Animation: Phase 1 headline → Phase 2 utility toolbox → Phase 3 micro
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

export const Scene12_UtilityOperations: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 32);
  const card3 = useSpringEntrance(frame, 44);

  const breathe = Math.sin(frame * 0.06) * 3;
  const gearRotate = frame * 1.5;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="CONCEPT · UTILITY LEVEL" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.accent} fontStyle="italic">Utility-Level</text>
        </g>
        <g opacity={headB.opacity} transform={`translate(0,${headB.translateY})`}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>Operations</text>
        </g>

        {/* Toolbox illustration */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={470} w={960} h={520} accent />

          {/* Large gear icon */}
          <g transform={`translate(300, 760) rotate(${gearRotate})`} style={{ transformOrigin: '0px 0px' }}>
            {/* Gear teeth */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45) * Math.PI / 180;
              const innerR = 60, outerR = 80;
              return (
                <line key={i}
                  x1={Math.cos(angle) * innerR} y1={Math.sin(angle) * innerR}
                  x2={Math.cos(angle) * outerR} y2={Math.sin(angle) * outerR}
                  stroke={COLORS.accent} strokeWidth={12} strokeLinecap="round" />
              );
            })}
            <circle cx={0} cy={0} r={50} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.2} />
          </g>

          {/* Utility tools around gear */}
          {[
            { x: 560, y: 580, lbl: 'Calculate', icon: '+' },
            { x: 560, y: 680, lbl: 'Convert', icon: '~' },
            { x: 560, y: 780, lbl: 'Validate', icon: '?' },
            { x: 560, y: 880, lbl: 'Format', icon: '#' },
          ].map((tool, i) => {
            const ent = useSpringEntrance(frame, 28 + i * 8);
            return (
              <g key={i} opacity={ent.opacity} transform={`translate(0,${ent.translateY})`}>
                <rect x={tool.x} y={tool.y} width={380} height={72} rx={12} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
                <circle cx={tool.x + 36} cy={tool.y + 36} r={20} fill={COLORS.accent} fillOpacity={0.15} />
                <text x={tool.x + 36} y={tool.y + 44} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>{tool.icon}</text>
                <text x={tool.x + 80} y={tool.y + 46} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>{tool.lbl}</text>
              </g>
            );
          })}
        </g>

        {/* Class level badge */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={1030} w={460} h={140} accent />
          <text x={290} y={1100} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>CLASS LEVEL</text>
          <text x={290} y={1140} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Not instance level</text>
        </g>
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={560} y={1030} w={460} h={140} />
          <text x={790} y={1100} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>SHARED</text>
          <text x={790} y={1140} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Available to all</text>
        </g>

        <g transform={`translate(540, ${1300 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.06} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
