/**
 * Scene 16 — Static Block Teaser
 * "That is the static block and that is exactly what we cover next."
 * CSV: 85.160s → 89.920s | Duration: 143 frames
 * Animation: Phase 1 headline → Phase 2 teaser card → Phase 3 pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene16_StaticBlockTeaser: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 48);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;

  // Snappy pop for the keyword
  const snapPop = spring({ frame: Math.max(0, frame - 16), fps: 30, config: SPRING_SNAP });
  const keywordScale = interpolate(snapPop, [0, 1], [0.6, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="NEXT · DAY 40 PREVIEW" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={310} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>That is the</text>
        </g>
        <g opacity={headB.opacity} transform={`translate(540,${380 + headB.translateY})`} style={{ transformOrigin: '540px 380px' }}>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent} fontStyle="italic"
            transform={`scale(${keywordScale})`} style={{ transformOrigin: '0px -20px' }}>
            Static Block
          </text>
        </g>

        {/* Ghost text */}
        <text x={540} y={620} textAnchor="middle" fontFamily={FONT} fontSize={200} fontWeight={800} fill={COLORS.accent} opacity={0.04}>
          static
        </text>

        {/* Code preview card */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={340} accent />
          <rect x={60} y={520} width={6} height={340} rx={3} fill={COLORS.accent} />

          <text x={120} y={590} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.text_muted}>{'class RailwaySystem {'}</text>
          <text x={160} y={650} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.accent}>{'static {'}</text>
          <text x={200} y={710} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>{'// runs ONCE when loaded'}</text>
          <text x={200} y={760} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>{'loadStations();'}</text>
          <text x={160} y={810} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.accent}>{'}'}</text>
        </g>

        {/* What we cover next */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={900} w={460} h={160} accent />
          <text x={290} y={970} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>DAY 40</text>
          <text x={290} y={1020} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Static Block</text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={560} y={900} w={460} h={160} />
          <text x={790} y={970} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>Runs Once</text>
          <text x={790} y={1020} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Before everything</text>
        </g>

        {/* Arrow next */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={200} y={1100} w={680} h={100} accent />
          <text x={540} y={1164} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            {'>>  COVER NEXT  >>'}
          </text>
        </g>

        <g transform={`translate(540, ${1340 + breathe})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent} strokeWidth={1.5} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
