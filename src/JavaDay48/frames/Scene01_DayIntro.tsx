/**
 * Scene 01 — Day Intro
 * "This is day 48 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 5.680s | Duration: 182 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Scene reveal, day badge springs in, progress bar
 *   Phase 2 (20–90): Locomotive illustration builds, title text
 *   Phase 3 (80–end): Micro-animations — wheels spin, smoke float
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1: Scene reveal
  const labelE = useSpringEntrance(frame, 0);
  const badgeE = useSpringEntrance(frame, 6);
  const titleE = useSpringEntrance(frame, 12);
  const subE = useSpringEntrance(frame, 18);

  // Phase 2: Locomotive + progress
  const locoE = useSpringEntrance(frame, 24);
  const progressW = interpolate(frame, [30, 80], [0, (48 / 105) * 960], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const trackDash = usePathDraw(frame, 30, 800, 40);

  // Phase 3: Micro-animations
  const wheelRot = frame * 3;
  const smokeY = Math.sin(frame * 0.08) * 6;
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Bottom card
  const cardE = useSpringEntrance(frame, 36);
  const card2E = useSpringEntrance(frame, 48);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A — Section label */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="MODULE 3 · TICKETING ENGINE" y={160} opacity={0.8} />
        </g>

        {/* Zone B — Day badge + title */}
        <g transform={`translate(0, ${badgeE.translateY})`} opacity={badgeE.opacity}>
          <text x={60} y={260} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            DAY 48
          </text>
          <text x={220} y={260} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.text_muted}>
            / 105
          </text>
        </g>

        {/* Progress bar */}
        <rect x={60} y={280} width={960} height={6} rx={3} fill="rgba(255,255,255,0.08)" opacity={badgeE.opacity} />
        <rect x={60} y={280} width={progressW} height={6} rx={3} fill={COLORS.accent} opacity={0.9} />

        <g transform={`translate(0, ${titleE.translateY})`} opacity={titleE.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            instanceof
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={460} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Runtime Type Check
          </text>
        </g>

        {/* Zone C — Locomotive illustration */}
        <g opacity={locoE.opacity} transform={`translate(0, ${locoE.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={460} accent />

          {/* Track rails */}
          <line x1={80} y1={920} x2={1000} y2={920} stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={800} strokeDashoffset={trackDash} />
          <line x1={80} y1={940} x2={1000} y2={940} stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={800} strokeDashoffset={trackDash} />

          {/* Cross-ties */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={120 + i * 72} y={916} width={8} height={28} rx={2}
              fill={COLORS.text_muted} opacity={0.4} />
          ))}

          {/* Locomotive body */}
          <rect x={200} y={720} width={500} height={180} rx={12}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={3} />
          {/* Cab */}
          <rect x={600} y={680} width={160} height={220} rx={8}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={3} />
          {/* Cab window */}
          <rect x={620} y={700} width={120} height={60} rx={6}
            fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={2} />
          {/* Smokestack */}
          <rect x={260} y={680} width={40} height={50} rx={4}
            fill={COLORS.accent} fillOpacity={0.3} stroke={COLORS.accent} strokeWidth={2} />
          {/* Smoke puffs */}
          <circle cx={280} cy={660 + smokeY} r={18} fill={COLORS.accent} fillOpacity={0.08 * shimmer} />
          <circle cx={260} cy={640 + smokeY * 1.3} r={24} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={300} cy={620 + smokeY * 1.6} r={14} fill={COLORS.accent} fillOpacity={0.05} />

          {/* Headlight */}
          <circle cx={210} cy={790} r={16} fill={COLORS.accent} fillOpacity={0.6 * shimmer} />
          <circle cx={210} cy={790} r={8} fill={COLORS.white} fillOpacity={0.9} />

          {/* Wheels */}
          {[320, 480, 660].map((wx, i) => (
            <g key={i} transform={`translate(${wx}, 910)`}>
              <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent} strokeWidth={3} />
              <circle cx={0} cy={0} r={6} fill={COLORS.accent} />
              <line x1={0} y1={-24} x2={0} y2={24}
                stroke={COLORS.accent} strokeWidth={2}
                transform={`rotate(${wheelRot + i * 30})`}
                style={{ transformOrigin: '0px 0px' }} />
              <line x1={-24} y1={0} x2={24} y2={0}
                stroke={COLORS.accent} strokeWidth={2}
                transform={`rotate(${wheelRot + i * 30})`}
                style={{ transformOrigin: '0px 0px' }} />
            </g>
          ))}

          {/* Coupling */}
          <rect x={760} y={830} width={60} height={16} rx={4}
            fill={COLORS.accent} fillOpacity={0.4} />

          {/* Label */}
          <text x={450} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            TRAIN
          </text>
        </g>

        {/* Info cards */}
        <g opacity={cardE.opacity} transform={`translate(0, ${cardE.translateY})`}>
          <BentoCard x={60} y={1010} w={460} h={200} />
          <rect x={60} y={1010} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1090} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            KEYWORD
          </text>
          <text x={100} y={1140} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            instanceof
          </text>
          <text x={100} y={1185} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Type safety at runtime
          </text>
        </g>

        <g opacity={card2E.opacity} transform={`translate(0, ${card2E.translateY})`}>
          <BentoCard x={560} y={1010} w={460} h={200} accent />
          <text x={600} y={1090} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            PURPOSE
          </text>
          <text x={600} y={1140} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Verify before cast
          </text>
          <text x={600} y={1185} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Prevent ClassCastException
          </text>
        </g>

        {/* Floating accent */}
        <g transform={`translate(540, ${1350 + breathe})`} opacity={card2E.opacity * 0.6}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.08} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* Shield icon with ? */}
        <g opacity={card2E.opacity} transform={`translate(540, ${1500 + breathe})`}>
          <path d="M0,-60 L50,-30 L50,20 C50,50 0,80 0,80 C0,80 -50,50 -50,20 L-50,-30 Z"
            fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={0} y={20} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            ?
          </text>
        </g>

        {/* Series title */}
        <g opacity={labelE.opacity * 0.5}>
          <text x={540} y={1720} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.18em">
            NATIONAL RAILWAY · JAVA
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s01.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
