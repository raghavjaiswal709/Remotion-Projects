/**
 * Scene 19 — Java Cannot Verify Until Runtime
 * "Java cannot verify it until the program runs."
 * CSV: 68.540s → 72.200s
 * Duration: ~110 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–60): Shield locked/unlocked diagram
 *   Phase 3 (frames 50–end): Pulse
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

export const Scene19_CannotVerifyUntilRuns: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const shieldEnt = useSpringEntrance(frame, 16);
  const leftEnt = useSpringEntrance(frame, 28);
  const rightEnt = useSpringEntrance(frame, 40);
  const summaryEnt = useSpringEntrance(frame, 52);

  // Shield outline path draw
  const shieldLen = 600;
  const shieldDash = usePathDraw(frame, 18, shieldLen, 25);

  // Question mark pulse
  const qPulse = 0.5 + Math.sin(frame * 0.12) * 0.5;
  const breathe = Math.sin(frame * 0.06) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Clock hand rotation for "until program runs"
  const clockAngle = interpolate(frame, [30, 80], [0, 360], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const caption = CAPTIONS[18];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="VERIFICATION · LIMIT" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={540} y={290} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800} fill={COLORS.white}>
            Java cannot verify
          </text>
          <text x={540} y={390} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            until the program runs
          </text>
        </g>

        {/* Shield with question mark */}
        <g opacity={shieldEnt.opacity} transform={`translate(540, ${620 + shieldEnt.translateY})`}>
          {/* Shield outline */}
          <path d="M 0,-100 L 80,-70 L 80,30 Q 80,100 0,130 Q -80,100 -80,30 L -80,-70 Z"
            fill={COLORS.accent} fillOpacity={0.05}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={shieldLen} strokeDashoffset={shieldDash} />
          {/* Question mark */}
          <text x={0} y={30} textAnchor="middle"
            fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.accent}
            opacity={qPulse}>
            ?
          </text>
        </g>

        {/* Left: Compile Phase */}
        <g opacity={leftEnt.opacity} transform={`translate(0, ${leftEnt.translateY})`}>
          <BentoCard x={60} y={800} w={460} h={380} />
          <text x={290} y={860} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} letterSpacing="0.1em">
            COMPILE PHASE
          </text>

          {/* Eye icon — can see syntax */}
          <g transform="translate(290, 940)">
            <ellipse cx={0} cy={0} rx={40} ry={24}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={0} cy={0} r={12} fill={COLORS.accent} fillOpacity={0.3} />
            <circle cx={0} cy={0} r={6} fill={COLORS.accent} />
          </g>

          <text x={290} y={1000} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Sees: syntax
          </text>
          <text x={290} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Sees: type hierarchy
          </text>
          <text x={290} y={1090} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Cannot see: actual
          </text>
          <text x={290} y={1125} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            object in memory
          </text>
        </g>

        {/* Right: Runtime Phase */}
        <g opacity={rightEnt.opacity} transform={`translate(0, ${rightEnt.translateY})`}>
          <BentoCard x={560} y={800} w={460} h={380} accent />
          <rect x={560} y={800} width={8} height={380} rx={4} fill={COLORS.accent} />
          <text x={790} y={860} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            RUNTIME PHASE
          </text>

          {/* Clock icon */}
          <g transform="translate(790, 940)">
            <circle cx={0} cy={0} r={30}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Clock hand */}
            <line x1={0} y1={0} x2={0} y2={-20}
              stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
              transform={`rotate(${clockAngle})`}
              style={{ transformOrigin: '0px 0px' }} />
            <circle cx={0} cy={0} r={3} fill={COLORS.accent} />
          </g>

          <text x={790} y={1000} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Sees: actual object
          </text>
          <text x={790} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Checks: real type
          </text>
          <text x={790} y={1090} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Can verify if cast
          </text>
          <text x={790} y={1125} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            is valid or not
          </text>
        </g>

        {/* Arrow between phases */}
        <g opacity={rightEnt.opacity}>
          <path d="M 530,990 L 555,990"
            stroke={COLORS.accent} strokeWidth={3} markerEnd="url(#arrow)" strokeLinecap="round" />
        </g>

        {/* Bottom summary */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={140} />
          <text x={540} y={1300} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The compiler trusts the developer's cast
          </text>
          <text x={540} y={1350} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            The JVM verifies it — and may reject it
          </text>
        </g>

        <circle cx={120} cy={1480 + breathe} r={3} fill={COLORS.accent} opacity={0.1 * shimmer} />
        <circle cx={960} cy={1530 - breathe} r={4} fill={COLORS.accent} opacity={0.08} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s19.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
