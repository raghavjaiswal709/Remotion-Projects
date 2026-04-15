/**
 * Scene 12 — Class Loading Triggers
 * "No constructor triggers it, no method call triggers it. The class loading itself triggers it."
 * CSV: 63.640s → 70.040s | Duration: 192 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–90): Three X marks on false triggers + checkmark on true trigger
 *   Phase 3 (80–end): Pulse on "CLASS LOADING"
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

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene12_ClassLoadingTriggers: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);

  // False triggers — two columns
  const col1 = useSpringEntrance(frame, 24); // Constructor
  const col2 = useSpringEntrance(frame, 38); // Method call

  // X marks on false triggers
  const xMark1 = useSpringEntrance(frame, 34);
  const xMark2 = useSpringEntrance(frame, 48);

  // True trigger — class loading
  const trueE = useSpringEntrance(frame, 56);
  const checkE = useSpringEntrance(frame, 66);
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 70, arrowLen, 25);

  // Result card
  const resultE = useSpringEntrance(frame, 78);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TRIGGER MECHANISM" y={140} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            What Triggers It?
          </text>
          <text x={60} y={370} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            Only one thing
          </text>
        </g>

        {/* False trigger 1 — Constructor */}
        <g opacity={col1.opacity} transform={`translate(0, ${col1.translateY})`}>
          <BentoCard x={60} y={440} w={460} h={240} />
          {/* Constructor icon — gear shape */}
          <circle cx={180} cy={530} r={30} fill="none" stroke={COLORS.text_muted} strokeWidth={2} opacity={0.4} />
          <text x={180} y={538} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.4}>C</text>
          <text x={240} y={530} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Constructor
          </text>
          <text x={100} y={580} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
            new RailwaySystem()
          </text>
          <text x={100} y={630} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted} opacity={0.4}>
            Does NOT trigger
          </text>
          {/* X overlay */}
          <g opacity={xMark1.opacity}>
            <line x1={80} y1={460} x2={500} y2={660} stroke={COLORS.vibrant_red} strokeWidth={3} opacity={0.6} />
            <line x1={500} y1={460} x2={80} y2={660} stroke={COLORS.vibrant_red} strokeWidth={3} opacity={0.6} />
          </g>
        </g>

        {/* False trigger 2 — Method Call */}
        <g opacity={col2.opacity} transform={`translate(0, ${col2.translateY})`}>
          <BentoCard x={560} y={440} w={460} h={240} />
          <circle cx={680} cy={530} r={30} fill="none" stroke={COLORS.text_muted} strokeWidth={2} opacity={0.4} />
          <text x={680} y={538} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.4}>M</text>
          <text x={740} y={530} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Method Call
          </text>
          <text x={600} y={580} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
            system.loadRoutes()
          </text>
          <text x={600} y={630} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted} opacity={0.4}>
            Does NOT trigger
          </text>
          {/* X overlay */}
          <g opacity={xMark2.opacity}>
            <line x1={580} y1={460} x2={1000} y2={660} stroke={COLORS.vibrant_red} strokeWidth={3} opacity={0.6} />
            <line x1={1000} y1={460} x2={580} y2={660} stroke={COLORS.vibrant_red} strokeWidth={3} opacity={0.6} />
          </g>
        </g>

        {/* Arrow down to true trigger */}
        <line x1={540} y1={700} x2={540} y2={780}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={trueE.opacity * 0.8} />

        {/* True trigger — Class Loading */}
        <g opacity={trueE.opacity} transform={`translate(0, ${trueE.translateY})`}>
          <BentoCard x={60} y={790} w={960} h={240} accent />
          <rect x={60} y={790} width={6} height={240} rx={3} fill={COLORS.accent} />
          {/* Checkmark */}
          <g opacity={checkE.opacity}>
            <circle cx={150} cy={910} r={44} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <path d="M 126,910 L 144,932 L 176,886" fill="none"
              stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
          </g>
          <text x={220} y={880} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            CLASS LOADING
          </text>
          <text x={220} y={930} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The class loading itself
          </text>
          <text x={220} y={976} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            JVM references the class for the first time
          </text>
        </g>

        {/* Result card */}
        <g opacity={resultE.opacity} transform={`translate(0, ${resultE.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={140} />
          <text x={100} y={1164} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The class loading
          </text>
          <text x={520} y={1164} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            itself triggers it
          </text>
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1360 + breathe})`}>
          <circle r={34} fill={COLORS.accent} fillOpacity={0.05} />
          <circle r={34} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.35} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
