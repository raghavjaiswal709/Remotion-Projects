/**
 * Scene 04 — Regular Method Call
 * "To call a regular method, you need an object, train1.getSpeed. The object must exist first."
 * CSV: 16.500s → 24.240s | Duration: 232 frames
 * Animation: Phase 1 label → Phase 2 object → method call flow → Phase 3 micro
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

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) });
  return len * (1 - p);
}

export const Scene04_RegularMethodCall: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const card1 = useSpringEntrance(frame, 18);
  const card2 = useSpringEntrance(frame, 30);
  const card3 = useSpringEntrance(frame, 42);
  const card4 = useSpringEntrance(frame, 54);

  const arrowLen = 200;
  const arrow1 = usePathDraw(frame, 50, arrowLen, 25);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="REGULAR METHOD · INSTANCE CALL" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>Regular Method</text>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>Requires an Object</text>
        </g>

        {/* Step 1: Create object */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={470} w={960} h={180} accent />
          <text x={100} y={530} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>STEP 1</text>
          <text x={100} y={590} fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.white}>Train train1 = new Train();</text>
          <circle cx={960} cy={560} r={24} fill={COLORS.accent} opacity={0.15} />
          <text x={960} y={568} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>1</text>
        </g>

        {/* Arrow down */}
        <line x1={540} y1={650} x2={540} y2={700} stroke={COLORS.accent} strokeWidth={2} strokeDasharray={arrowLen} strokeDashoffset={arrow1} markerEnd="url(#arrow)" />

        {/* Step 2: Call method */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={710} w={960} h={180} accent />
          <text x={100} y={770} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>STEP 2</text>
          <text x={100} y={830} fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.white}>train1.getSpeed();</text>
          <circle cx={960} cy={800} r={24} fill={COLORS.accent} opacity={0.15} />
          <text x={960} y={808} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>2</text>
        </g>

        {/* Train illustration — object diagram */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={940} w={960} h={380} />
          {/* Train body (the object) */}
          <rect x={140} y={1020} width={320} height={140} rx={16} fill={COLORS.accent} opacity={0.15} stroke={COLORS.accent} strokeWidth={2} />
          <text x={300} y={1080} textAnchor="middle" fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.white}>train1</text>
          <text x={300} y={1130} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Object</text>
          {/* Wheels */}
          <circle cx={200} cy={1180} r={20} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={380} cy={1180} r={20} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />

          {/* Method box */}
          <rect x={620} y={1020} width={320} height={140} rx={16} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={780} y={1075} textAnchor="middle" fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.accent}>getSpeed()</text>
          <text x={780} y={1125} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Method</text>

          {/* Arrow from object to method */}
          <line x1={460} y1={1090} x2={620} y2={1090} stroke={COLORS.accent} strokeWidth={2.5} markerEnd="url(#arrow)" />
          <text x={540} y={1070} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>calls</text>
        </g>

        {/* Key rule card */}
        <g opacity={card4.opacity} transform={`translate(0,${card4.translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={140} accent />
          <rect x={60} y={1360} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={540} y={1448} textAnchor="middle" fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            Object must exist first
          </text>
        </g>

        {/* Micro floating */}
        <g transform={`translate(540, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent} strokeWidth={1.5} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
