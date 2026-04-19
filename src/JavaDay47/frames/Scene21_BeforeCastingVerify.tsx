/**
 * Scene 21 — Before Casting You Verify
 * "Before casting, you verify."
 * CSV: 75.860s → 78.400s
 * Duration: ~76 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–55): Two-step flow (verify → cast)
 *   Phase 3 (frames 45–end): Micro-pulse
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

export const Scene21_BeforeCastingVerify: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const step1Ent = useSpringEntrance(frame, 16);
  const arrowEnt = useSpringEntrance(frame, 28);
  const step2Ent = useSpringEntrance(frame, 34);
  const summaryEnt = useSpringEntrance(frame, 46);

  // Arrow path draw
  const arrowLen = 180;
  const arrowDash = usePathDraw(frame, 30, arrowLen, 20);

  // Checkmark draw
  const checkLen = 60;
  const checkDash = usePathDraw(frame, 20, checkLen, 15);

  // Lock open animation
  const lockOpen = interpolate(frame, [36, 48], [0, -15], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[20];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SAFETY · PROTOCOL" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={540} y={290} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Before casting,
          </text>
          <text x={540} y={400} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            you verify.
          </text>
        </g>

        {/* Step 1: Verify */}
        <g opacity={step1Ent.opacity} transform={`translate(0, ${step1Ent.translateY})`}>
          {/* Number badge */}
          <circle cx={170} cy={560} r={36}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={170} y={572} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            1
          </text>

          <BentoCard x={60} y={620} w={440} h={420} accent />
          <rect x={60} y={620} width={8} height={420} rx={4} fill={COLORS.accent} />

          <text x={280} y={690} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            VERIFY
          </text>

          {/* Magnifying glass icon */}
          <g transform="translate(280, 800)">
            <circle cx={0} cy={-10} r={45}
              fill="none" stroke={COLORS.accent} strokeWidth={4} />
            <line x1={32} y1={22} x2={55} y2={45}
              stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round" />
            {/* Checkmark inside */}
            <path d="M -15,-10 L -5,2 L 18,-20"
              fill="none" stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
              strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          </g>

          <text x={280} y={890} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Check the actual type
          </text>
          <text x={280} y={935} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            "Is this object an
          </text>
          <text x={280} y={970} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            ExpressTrain?"
          </text>
        </g>

        {/* Arrow between steps */}
        <g opacity={arrowEnt.opacity}>
          <path d="M 510,830 L 570,830"
            fill="none" stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
            markerEnd="url(#arrow)"
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash} />
        </g>

        {/* Step 2: Cast */}
        <g opacity={step2Ent.opacity} transform={`translate(0, ${step2Ent.translateY})`}>
          {/* Number badge */}
          <circle cx={710} cy={560} r={36}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={710} y={572} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            2
          </text>

          <BentoCard x={580} y={620} w={440} h={420} />

          <text x={800} y={690} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            CAST
          </text>

          {/* Lock opening */}
          <g transform="translate(800, 800)">
            {/* Lock body */}
            <rect x={-25} y={0} width={50} height={40} rx={6}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Shackle */}
            <path d={`M -15,0 L -15,${lockOpen} Q -15,${-25 + lockOpen} 0,${-25 + lockOpen} Q 15,${-25 + lockOpen} 15,${lockOpen} L 15,0`}
              fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
            {/* Keyhole */}
            <circle cx={0} cy={16} r={6} fill={COLORS.accent} fillOpacity={0.5} />
          </g>

          <text x={800} y={890} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Only if verified
          </text>
          <text x={800} y={935} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The cast proceeds
          </text>
          <text x={800} y={970} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            safely
          </text>
        </g>

        {/* Summary */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={280} />

          <text x={540} y={1180} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The two-step safety pattern:
          </text>

          {/* Step labels */}
          <g transform="translate(320, 1260)">
            <circle cx={0} cy={0} r={22} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={0} y={8} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>1</text>
            <text x={40} y={8}
              fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
              Verify type
            </text>
          </g>

          <text x={540} y={1268} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            →
          </text>

          <g transform="translate(620, 1260)">
            <circle cx={0} cy={0} r={22} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={0} y={8} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>2</text>
            <text x={40} y={8}
              fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
              Then cast
            </text>
          </g>

          <text x={540} y={1335} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Never skip step one
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
            sceneDuration={SCENE_TIMING.s21.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
