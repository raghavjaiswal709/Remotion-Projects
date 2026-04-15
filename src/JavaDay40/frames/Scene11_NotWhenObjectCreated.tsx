/**
 * Scene 11 — Not When Object Created
 * "Not when an object is created, not when a method is called, once and only once."
 * CSV: 56.680s → 63.640s | Duration: 209 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–90): Three rows — two X marks, one checkmark
 *   Phase 3 (80–end): Breathing pulse
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

export const Scene11_NotWhenObjectCreated: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);
  const subE = useSpringEntrance(frame, 14);

  // Three comparison rows
  const row1 = useSpringEntrance(frame, 24); // Object created — X
  const row2 = useSpringEntrance(frame, 38); // Method called — X
  const row3 = useSpringEntrance(frame, 52); // Class loaded — check

  // X mark animations
  const x1 = useSpringEntrance(frame, 32);
  const x2 = useSpringEntrance(frame, 46);
  const check = useSpringEntrance(frame, 60);

  // ONCE emphasis
  const onceE = useSpringEntrance(frame, 70);

  // Bottom
  const summaryE = useSpringEntrance(frame, 82);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.018;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="WHEN IT RUNS" y={140} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Not When You Think
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            Once and only once
          </text>
        </g>

        {/* Row 1 — Object Created → X */}
        <g opacity={row1.opacity} transform={`translate(0, ${row1.translateY})`}>
          <BentoCard x={60} y={440} w={820} h={180} />
          {/* Event label */}
          <text x={100} y={510} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Object Created
          </text>
          <text x={100} y={560} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            new Train() / new Station()
          </text>
          {/* X mark */}
          <g opacity={x1.opacity}>
            <circle cx={920} cy={530} r={40} fill={COLORS.vibrant_red} fillOpacity={0.12}
              stroke={COLORS.vibrant_red} strokeWidth={2} />
            <line x1={900} y1={510} x2={940} y2={550} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
            <line x1={940} y1={510} x2={900} y2={550} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          </g>
        </g>

        {/* Row 2 — Method Called → X */}
        <g opacity={row2.opacity} transform={`translate(0, ${row2.translateY})`}>
          <BentoCard x={60} y={650} w={820} h={180} />
          <text x={100} y={720} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Method Called
          </text>
          <text x={100} y={770} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            train.run() / station.open()
          </text>
          <g opacity={x2.opacity}>
            <circle cx={920} cy={740} r={40} fill={COLORS.vibrant_red} fillOpacity={0.12}
              stroke={COLORS.vibrant_red} strokeWidth={2} />
            <line x1={900} y1={720} x2={940} y2={760} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
            <line x1={940} y1={720} x2={900} y2={760} stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          </g>
        </g>

        {/* Row 3 — Class Loaded → CHECK */}
        <g opacity={row3.opacity} transform={`translate(0, ${row3.translateY})`}>
          <BentoCard x={60} y={860} w={820} h={180} accent />
          <rect x={60} y={860} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={930} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Class Loaded by JVM
          </text>
          <text x={100} y={980} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            First reference to the class
          </text>
          <g opacity={check.opacity}>
            <circle cx={920} cy={950} r={40} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <path d="M 898,950 L 914,970 L 944,930" fill="none"
              stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
          </g>
        </g>

        {/* ONCE emphasis */}
        <g opacity={onceE.opacity} transform={`translate(0, ${onceE.translateY})`}>
          <text x={540} y={1160} textAnchor="middle" fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.accent}>ONCE</text>
          <text x={540} y={1220} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>and only once</text>
        </g>

        {/* Summary */}
        <g opacity={summaryE.opacity} transform={`translate(0, ${summaryE.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={120} />
          <text x={100} y={1352} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Static block fires at class load — never again
          </text>
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle r={30} fill={COLORS.accent} fillOpacity={0.05} />
          <circle r={30} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.3} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
