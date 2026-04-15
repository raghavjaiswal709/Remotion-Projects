/**
 * Scene 13 — Java Utility Examples
 * "Math.squareroot.collections.sort. Every Java utility method you have ever called."
 * CSV: 67.860s → 74.900s | Duration: 211 frames
 * Animation: Phase 1 headline → Phase 2 examples cascade → Phase 3 breathe
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene13_JavaUtilityExamples: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);

  const examples = [
    { cls: 'Math', method: '.sqrt()', desc: 'Square root' },
    { cls: 'Math', method: '.abs()', desc: 'Absolute value' },
    { cls: 'Collections', method: '.sort()', desc: 'Sort a list' },
    { cls: 'Arrays', method: '.toString()', desc: 'Array to text' },
    { cls: 'Integer', method: '.parseInt()', desc: 'String to int' },
  ];

  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="JAVA · BUILT-IN EXAMPLES" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>Every Utility</text>
          <text x={60} y={390} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>You've Ever Called</text>
        </g>

        {/* Example cards cascade */}
        {examples.map((ex, i) => {
          const ent = useSpringEntrance(frame, 18 + i * 10);
          const cardY = 460 + i * 160;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0,${ent.translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={140} accent={i === 0} />
              <rect x={60} y={cardY} width={6} height={140} rx={3} fill={COLORS.accent} />

              {/* Class.method() code */}
              <text x={110} y={cardY + 60} fontFamily={MONO} fontSize={38} fontWeight={500} fill={COLORS.accent}>{ex.cls}</text>
              <text x={110 + ex.cls.length * 23} y={cardY + 60} fontFamily={MONO} fontSize={38} fontWeight={500} fill={COLORS.white}>{ex.method}</text>

              {/* Description */}
              <text x={110} y={cardY + 108} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>{ex.desc}</text>

              {/* Static badge */}
              <rect x={800} y={cardY + 35} width={160} height={44} rx={8} fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={880} y={cardY + 64} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>STATIC</text>
            </g>
          );
        })}

        {/* Bottom summary */}
        {(() => {
          const ent = useSpringEntrance(frame, 70);
          return (
            <g opacity={ent.opacity} transform={`translate(0,${ent.translateY})`}>
              <BentoCard x={60} y={1280} w={960} h={120} accent />
              <text x={540} y={1356} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
                All <tspan fill={COLORS.accent}>static</tspan> — no objects needed
              </text>
            </g>
          );
        })()}

        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.06} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
