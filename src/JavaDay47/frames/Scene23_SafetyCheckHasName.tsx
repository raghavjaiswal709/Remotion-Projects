/**
 * Scene 23 — Safety Check Has A Name
 * "That safety check has a name."
 * CSV: 82.980s → 85.360s
 * Duration: ~71 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–60): Hero keyword reveal
 *   Phase 3 (frames 50–end): Micro-pulse
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
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene23_SafetyCheckHasName: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const heroEnt = useSpringEntrance(frame, 16);
  const defEnt = useSpringEntrance(frame, 28);
  const card1Ent = useSpringEntrance(frame, 38);
  const card2Ent = useSpringEntrance(frame, 48);

  // Shield path draw
  const shieldLen = 320;
  const shieldDash = usePathDraw(frame, 18, shieldLen, 25);

  // Hero text spring
  const heroScale = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_SNAP });

  // Underline draw
  const underlineLen = 480;
  const underlineDash = usePathDraw(frame, 26, underlineLen, 20);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[22];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="KEYWORD · PREVIEW" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={540} y={280} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            That safety check
          </text>
          <text x={540} y={380} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            has a name.
          </text>
        </g>

        {/* Shield icon above hero */}
        <g opacity={heroEnt.opacity} transform={`translate(540, 520)`}>
          <path d="M 0,-70 L 45,-50 L 45,10 Q 45,50 0,70 Q -45,50 -45,10 L -45,-50 Z"
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={shieldLen} strokeDashoffset={shieldDash} />
          {/* Checkmark inside shield */}
          <path d="M -18,0 L -6,14 L 22,-16"
            fill="none" stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
            opacity={heroEnt.opacity} />
        </g>

        {/* Hero keyword */}
        <g opacity={heroEnt.opacity}
          transform={`translate(540, 700) scale(${interpolate(heroScale, [0, 1], [0.7, 1])})`}
          style={{ transformOrigin: '540px 700px' }}>
          {/* Ghost text */}
          <text x={0} y={0} textAnchor="middle"
            fontFamily={MONO} fontSize={96} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}>
            instanceof
          </text>
          {/* Main text */}
          <text x={0} y={0} textAnchor="middle"
            fontFamily={MONO} fontSize={96} fontWeight={800}
            fill={COLORS.accent}>
            instanceof
          </text>
          {/* Underline */}
          <line x1={-240} y1={20} x2={240} y2={20}
            stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={underlineLen} strokeDashoffset={underlineDash} />
        </g>

        {/* Definition */}
        <g opacity={defEnt.opacity} transform={`translate(0, ${defEnt.translateY})`}>
          <BentoCard x={60} y={790} w={960} h={200} accent />
          <rect x={60} y={790} width={8} height={200} rx={4} fill={COLORS.accent} />

          <text x={540} y={860} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Java's built-in keyword to check
          </text>
          <text x={540} y={910} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            an object's{' '}
            <tspan fill={COLORS.accent} fontStyle="italic">actual type</tspan>
            {' '}at runtime
          </text>
          <text x={540} y={960} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Returns true or false — nothing more
          </text>
        </g>

        {/* What it does */}
        <g opacity={card1Ent.opacity} transform={`translate(0, ${card1Ent.translateY})`}>
          <BentoCard x={60} y={1040} w={460} h={300} />

          <text x={290} y={1110} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            WHAT IT DOES
          </text>

          <text x={290} y={1165} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Checks if object is
          </text>
          <text x={290} y={1200} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            a specific type
          </text>

          {/* Boolean result */}
          <g transform="translate(230, 1260)">
            <rect x={0} y={0} width={120} height={40} rx={8}
              fill={COLORS.accent} fillOpacity={0.12} />
            <text x={60} y={28} textAnchor="middle"
              fontFamily={MONO} fontSize={24} fontWeight={800} fill={COLORS.accent}>
              true
            </text>
          </g>
          <text x={290} y={1288} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            /
          </text>
          <g transform="translate(310, 1260)">
            <rect x={0} y={0} width={120} height={40} rx={8}
              fill="rgba(247,55,79,0.12)" />
            <text x={60} y={28} textAnchor="middle"
              fontFamily={MONO} fontSize={24} fontWeight={800} fill={COLORS.vibrant_red}>
              false
            </text>
          </g>
        </g>

        {/* Why it matters */}
        <g opacity={card2Ent.opacity} transform={`translate(0, ${card2Ent.translateY})`}>
          <BentoCard x={560} y={1040} w={460} h={300} accent />

          <text x={790} y={1110} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            WHY IT MATTERS
          </text>

          <text x={790} y={1165} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Prevents
          </text>
          <text x={790} y={1200} textAnchor="middle"
            fontFamily={MONO} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            ClassCastException
          </text>

          {/* Shield mini icon */}
          <g transform="translate(790, 1280)">
            <path d="M 0,-20 L 18,-14 L 18,4 Q 18,18 0,24 Q -18,18 -18,4 L -18,-14 Z"
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <path d="M -6,2 L -2,8 L 8,-4"
              fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          </g>
        </g>

        {/* Micro-animations */}
        <circle cx={120} cy={1450 + breathe} r={3} fill={COLORS.accent} opacity={0.08 * shimmer} />
        <circle cx={960} cy={1500 - breathe} r={4} fill={COLORS.accent} opacity={0.06} />

        <g transform={`translate(540, ${1550 + breathe})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.15} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s23.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
