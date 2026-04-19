/**
 * Scene 10 — This Is Downcasting
 * "This is downcasting,"
 * CSV: 40.380s → 42.680s
 * Duration: ~69 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + hero text spring
 *   Phase 2 (frames 20–50):  Down arrow + definition card
 *   Phase 3 (frames 45–end): Micro-animations pulse
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene10_ThisIsDowncasting: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const heroWord = useSpringEntrance(frame, 6);
  const arrowEnt = useSpringEntrance(frame, 14);
  const defCard = useSpringEntrance(frame, 22);
  const diagramCard = useSpringEntrance(frame, 32);
  const summaryCard = useSpringEntrance(frame, 42);

  // Large down arrow path draw
  const arrowLen = 400;
  const arrowDash = usePathDraw(frame, 16, arrowLen, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[9];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="KEY CONCEPT" y={160} opacity={0.8} />
        </g>

        {/* Hero word — DOWNCASTING */}
        <g transform={`translate(0, ${heroWord.translateY})`} opacity={heroWord.opacity}>
          {/* Ghost text behind */}
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}>
            DOWNCASTING
          </text>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Downcasting
          </text>
        </g>

        {/* Large down arrow */}
        <g opacity={arrowEnt.opacity}>
          <path d="M 540,480 L 540,700 L 490,650 M 540,700 L 590,650"
            fill="none" stroke={COLORS.accent} strokeWidth={5}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Definition card */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={260} accent />
          <rect x={60} y={740} width={8} height={260} rx={4} fill={COLORS.accent} />

          <text x={110} y={810} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            DEFINITION
          </text>
          <text x={110} y={870} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            Casting from a parent type
          </text>
          <text x={110} y={930} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            down to a child type
          </text>
          <text x={110} y={975} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Narrowing the reference to access child-specific features
          </text>
        </g>

        {/* Visual: hierarchy arrows going DOWN */}
        <g opacity={diagramCard.opacity} transform={`translate(0, ${diagramCard.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={340} />

          {/* Parent box top */}
          <rect x={340} y={1080} width={400} height={80} rx={16}
            fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={2} />
          <text x={540} y={1130} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Train (parent)
          </text>

          {/* Down arrow */}
          <path d="M 540,1160 L 540,1220" fill="none" stroke={COLORS.accent} strokeWidth={3}
            markerEnd="url(#arrow)" />
          <text x={600} y={1200} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            DOWN
          </text>

          {/* Child box bottom */}
          <rect x={300} y={1230} width={480} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={540} y={1280} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain (child)
          </text>

          {/* Pulse ring around child */}
          <rect x={300} y={1230} width={480} height={80} rx={16}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.2 * shimmer}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 1270px' }} />
        </g>

        {/* Summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1420} w={960} h={120} />
          <text x={540} y={1493} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Up = widen | <tspan fill={COLORS.accent} fontStyle="italic">Down = narrow</tspan> | Cast = explicit
          </text>
        </g>

        <circle cx={200} cy={550 + breathe} r={5} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={880} cy={1000 + breathe * 0.7} r={4} fill={COLORS.accent} opacity={0.12} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
