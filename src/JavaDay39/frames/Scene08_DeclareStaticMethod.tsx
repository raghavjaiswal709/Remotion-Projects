/**
 * Scene 08 — Declare Static Method
 * "Declare the method as static and you call it directly on the class."
 * CSV: 42.080s → 46.460s | Duration: 132 frames
 * Animation: Phase 1 headline → Phase 2 code syntax → Phase 3 highlight pulse
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

export const Scene08_DeclareStaticMethod: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const card1 = useSpringEntrance(frame, 16);
  const card2 = useSpringEntrance(frame, 30);
  const card3 = useSpringEntrance(frame, 42);

  const breathe = Math.sin(frame * 0.06) * 3;
  const keywordPulse = 0.8 + 0.2 * Math.sin(frame * 0.12);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="SYNTAX · DECLARATION" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>Declare</text>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent} fontStyle="italic">static</text>
        </g>

        {/* Code block */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={340} accent />
          <rect x={60} y={480} width={6} height={340} rx={3} fill={COLORS.accent} />
          {/* Code lines */}
          <text x={100} y={550} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.text_muted}>{'public class Station {'}</text>
          <text x={140} y={610} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.text_muted}>{'  '}<tspan fill={COLORS.accent} opacity={keywordPulse}>static</tspan>{' int totalStations;'}</text>
          <text x={100} y={670} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.text_muted}>{''}</text>
          <text x={140} y={720} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.text_muted}>{'  public '}<tspan fill={COLORS.accent} opacity={keywordPulse}>static</tspan>{' int getTotal() {'}</text>
          <text x={180} y={770} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.text_muted}>{'    return totalStations;'}</text>
        </g>

        {/* Arrow pointing to 'static' keyword */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={860} w={960} h={200} />
          {/* Highlight box around static keyword concept */}
          <rect x={100} y={900} width={200} height={60} rx={8} fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={2} />
          <text x={200} y={942} textAnchor="middle" fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.accent}>static</text>

          <text x={340} y={942} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>= belongs to class</text>

          <text x={100} y={1010} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>No object needed to call</text>
        </g>

        {/* Call syntax */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={200} accent />
          <text x={100} y={1170} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>CALL DIRECTLY ON CLASS</text>
          <text x={100} y={1240} fontFamily={MONO} fontSize={40} fontWeight={500} fill={COLORS.white}>
            Station.<tspan fill={COLORS.accent}>getTotal()</tspan>
          </text>
        </g>

        {/* Two comparison cards */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={1340} w={460} h={140} />
          <text x={80} y={1400} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>Regular</text>
          <text x={80} y={1440} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>obj.method()</text>
        </g>
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={560} y={1340} w={460} h={140} accent />
          <text x={580} y={1400} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>Static</text>
          <text x={580} y={1440} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.accent}>Class.method()</text>
        </g>

        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.06} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
