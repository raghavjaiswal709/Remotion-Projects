/**
 * Scene 20 — Never Done Blindly
 * "This is why downcasting is never done blindly."
 * CSV: 72.200s → 75.860s
 * Duration: ~110 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–60): Blindfold illustration + contrast cards
 *   Phase 3 (frames 50–end): Emphasis pulse
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

export const Scene20_NeverDoneBlindly: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const eyeEnt = useSpringEntrance(frame, 16);
  const blindEnt = useSpringEntrance(frame, 28);
  const safeEnt = useSpringEntrance(frame, 40);
  const ruleEnt = useSpringEntrance(frame, 52);

  // Blindfold strike line
  const strikeLen = 200;
  const strikeDash = usePathDraw(frame, 20, strikeLen, 15);

  // X cross over blindfold
  const crossLen = 100;
  const crossDash = usePathDraw(frame, 30, crossLen, 12);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[19];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SAFE PRACTICE · RULE" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={540} y={290} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Downcasting is
          </text>
          <text x={540} y={400} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.vibrant_red}
            fontStyle="italic">
            never done blindly
          </text>
        </g>

        {/* Eye with blindfold — large illustration */}
        <g opacity={eyeEnt.opacity} transform={`translate(540, ${640 + eyeEnt.translateY})`}>
          {/* Outer eye shape */}
          <ellipse cx={0} cy={0} rx={120} ry={70}
            fill="none" stroke={COLORS.text_muted} strokeWidth={4} />
          {/* Iris */}
          <circle cx={0} cy={0} r={40}
            fill="none" stroke={COLORS.accent} strokeWidth={3} />
          {/* Pupil */}
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.4} />

          {/* Blindfold bar */}
          <g opacity={blindEnt.opacity}>
            <rect x={-140} y={-25} width={280} height={50} rx={8}
              fill={COLORS.vibrant_red} fillOpacity={0.15}
              stroke={COLORS.vibrant_red} strokeWidth={3} />
            {/* Strike-through */}
            <line x1={-120} y1={0} x2={120} y2={0}
              stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round"
              strokeDasharray={strikeLen} strokeDashoffset={strikeDash} />
          </g>

          {/* X cross */}
          <path d={`M -50,-50 L 50,50 M 50,-50 L -50,50`}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={crossLen} strokeDashoffset={crossDash}
            opacity={0.6} />
        </g>

        {/* Blind vs Verified comparison */}
        <g opacity={blindEnt.opacity} transform={`translate(0, ${blindEnt.translateY})`}>
          <BentoCard x={60} y={800} w={460} h={320} />
          <rect x={60} y={800} width={8} height={320} rx={4} fill={COLORS.vibrant_red} />
          <text x={290} y={860} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red} letterSpacing="0.08em">
            BLIND CAST
          </text>

          {/* X icon */}
          <g transform="translate(290, 930)">
            <circle cx={0} cy={0} r={28}
              fill={COLORS.vibrant_red} fillOpacity={0.1} />
            <path d="M -12,-12 L 12,12 M 12,-12 L -12,12"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={4} strokeLinecap="round" />
          </g>

          <text x={290} y={995} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No type check
          </text>
          <text x={290} y={1035} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Hope it works
          </text>
          <text x={290} y={1080} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            ClassCastException
          </text>
        </g>

        <g opacity={safeEnt.opacity} transform={`translate(0, ${safeEnt.translateY})`}>
          <BentoCard x={560} y={800} w={460} h={320} accent />
          <rect x={560} y={800} width={8} height={320} rx={4} fill={COLORS.accent} />
          <text x={790} y={860} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} letterSpacing="0.08em">
            VERIFIED CAST
          </text>

          {/* Checkmark icon */}
          <g transform="translate(790, 930)">
            <circle cx={0} cy={0} r={28}
              fill={COLORS.accent} fillOpacity={0.1} />
            <path d="M -12,0 L -3,10 L 14,-10"
              fill="none" stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
          </g>

          <text x={790} y={995} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Check type first
          </text>
          <text x={790} y={1035} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Then cast safely
          </text>
          <text x={790} y={1080} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Safe operation
          </text>
        </g>

        {/* Bottom rule card */}
        <g opacity={ruleEnt.opacity} transform={`translate(0, ${ruleEnt.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={200} accent />
          <text x={540} y={1260} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Rule: Always verify before you cast
          </text>
          <text x={540} y={1320} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            "Is this object actually what I think it is?"
          </text>
        </g>

        {/* Floating accents */}
        <g transform={`translate(150, ${1480 + breathe})`}>
          <circle cx={0} cy={0} r={4} fill={COLORS.accent} opacity={0.1 * shimmer} />
        </g>
        <g transform={`translate(930, ${1530 - breathe})`}>
          <circle cx={0} cy={0} r={3} fill={COLORS.vibrant_red} opacity={0.08} />
        </g>
        <g transform={`translate(540, ${1600 + breathe * 0.5})`} style={{ transformOrigin: '540px 1600px' }}>
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.06} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s20.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
