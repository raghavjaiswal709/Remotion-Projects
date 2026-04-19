/**
 * Scene 29 — Outro / Pattern Matching Next
 * "That is instanceof pattern matching. And that is exactly what we cover next."
 * CSV: 85.120s → 89.420s | Duration: 266 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline reveal
 *   Phase 2 (15–80): Today recap + tomorrow preview
 *   Phase 3 (70–end): Floating pulse, steady state
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene29_Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 6);
  const subE = useSpringEntrance(frame, 14);
  const todayE = useSpringEntrance(frame, 24);
  const item1E = useSpringEntrance(frame, 34);
  const item2E = useSpringEntrance(frame, 46);
  const item3E = useSpringEntrance(frame, 58);
  const tomorrowE = useSpringEntrance(frame, 70);
  const nextE = useSpringEntrance(frame, 82);
  const ctaE = useSpringEntrance(frame, 94);
  const cornerE = useSpringEntrance(frame, 10);

  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 76, arrowLen, 18);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe = Math.sin(frame * 0.05) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s29.from);

  const todayItems = [
    { label: 'instanceof keyword', desc: 'Runtime type check before cast' },
    { label: 'Safe downcasting', desc: 'Prevents ClassCastException' },
    { label: 'Multi-branch pattern', desc: 'if/else if for each child type' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={cornerE.opacity}>
          <CornerAccents />
        </g>

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="RECAP · DAY 48" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={310} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>instanceof</text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={540} y={400} textAnchor="middle" fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent}>Pattern Matching Next</text>
        </g>

        {/* Today header */}
        <g opacity={todayE.opacity} transform={`translate(0, ${todayE.translateY})`}>
          <text x={60} y={500} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">TODAY — KEY CONCEPTS</text>
        </g>

        {/* Today items */}
        {todayItems.map((item, i) => {
          const itemE = [item1E, item2E, item3E][i];
          const cardY = 530 + i * 140;
          return (
            <g key={i} opacity={itemE.opacity} transform={`translate(0, ${itemE.translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={120} accent={i === 0} />
              <rect x={60} y={cardY} width={6} height={120} rx={3}
                fill={i === 0 ? COLORS.accent : COLORS.text_muted} />
              <text x={100} y={cardY + 52} fontFamily={FONT} fontSize={38} fontWeight={800}
                fill={COLORS.white}>{item.label}</text>
              <text x={100} y={cardY + 95} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>{item.desc}</text>
            </g>
          );
        })}

        {/* Arrow to tomorrow */}
        <path d="M 540,960 L 540,1060" fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeLinecap="round" strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={tomorrowE.opacity} />

        {/* Tomorrow card */}
        <g opacity={tomorrowE.opacity} transform={`translate(0, ${tomorrowE.translateY})`}>
          <text x={60} y={1100} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">TOMORROW — DAY 49</text>
        </g>

        <g opacity={nextE.opacity} transform={`translate(0, ${nextE.translateY})`}>
          <BentoCard x={60} y={1130} w={960} h={200} accent />
          <rect x={60} y={1130} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1200} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>instanceof Pattern Matching</text>
          <text x={100} y={1258} fontFamily={MONO} fontSize={28} fontWeight={500}
            fill={COLORS.accent}>{'if (t instanceof ExpressTrain e)'}</text>
          <text x={100} y={1305} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Check + bind variable — one step — Java 16+</text>
        </g>

        {/* CTA */}
        <g opacity={ctaE.opacity} transform={`translate(0, ${ctaE.translateY})`}>
          <BentoCard x={200} y={1420} w={680} h={100} />
          <text x={540} y={1482} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>That is exactly what we cover next</text>
        </g>

        {/* Floating accent orbs */}
        <g transform={`translate(300, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(780, ${1620 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={22} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={22} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s29.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
