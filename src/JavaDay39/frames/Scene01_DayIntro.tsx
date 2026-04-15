/**
 * Scene 01 — Day Intro
 * "This is day 39 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 6.460s | Duration: 194 frames
 * Animation: Phase 1 spring reveal → Phase 2 day counter + train → Phase 3 micro-float
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
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
  const fps = FPS;

  // Phase 1: Scene reveal
  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Phase 2: Content build
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 32);
  const card3 = useSpringEntrance(frame, 44);

  // Day counter
  const dayCount = Math.round(interpolate(frame, [20, 55], [0, 39], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  }));

  // Track draw
  const trackLen = 800;
  const trackDash = usePathDraw(frame, 30, trackLen, 40);

  // Phase 3: micro
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const wheelRot = frame * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="MODULE 2 · NETWORK EXPANSION" y={160} />
        </g>

        {/* Zone B — DAY counter */}
        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={540} y={340} textAnchor="middle" fontFamily={FONT} fontSize={160} fontWeight={800} fill={COLORS.accent}>
            DAY {dayCount}
          </text>
        </g>
        <g opacity={headB.opacity} transform={`translate(0,${headB.translateY})`}>
          <text x={540} y={440} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.text_muted}>
            NATIONAL RAILWAY · JAVA
          </text>
        </g>

        {/* Zone C — Topic card */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={180} accent />
          <rect x={60} y={520} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={590} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>TODAY'S TOPIC</text>
          <text x={100} y={650} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.white}>Static Method</text>
        </g>

        {/* Railway tracks illustration */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={730} w={960} h={480} />
          {/* Tracks */}
          <line x1={140} y1={1050} x2={940} y2={1050} stroke={COLORS.text_muted} strokeWidth={4} strokeDasharray={trackLen} strokeDashoffset={trackDash} />
          <line x1={140} y1={1080} x2={940} y2={1080} stroke={COLORS.text_muted} strokeWidth={4} strokeDasharray={trackLen} strokeDashoffset={trackDash} />
          {/* Cross ties */}
          {Array.from({ length: 12 }, (_, i) => {
            const tx = 160 + i * 65;
            const tieOp = interpolate(frame, [35 + i * 2, 45 + i * 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return <rect key={i} x={tx} y={1042} width={8} height={46} rx={2} fill={COLORS.accent} opacity={tieOp * 0.5} />;
          })}
          {/* Train body */}
          <g transform={`translate(${interpolate(spring({ frame: Math.max(0, frame - 40), fps, config: SPRING_SOFT }), [0, 1], [-200, 340])}, 920)`}>
            <rect x={0} y={0} width={280} height={100} rx={16} fill={COLORS.accent} opacity={0.9} />
            <rect x={240} y={-30} width={80} height={130} rx={8} fill={COLORS.accent} opacity={0.8} />
            <rect x={20} y={15} width={80} height={50} rx={6} fill={COLORS.bg_primary} opacity={0.5} />
            <rect x={120} y={15} width={80} height={50} rx={6} fill={COLORS.bg_primary} opacity={0.5} />
            {/* Wheels */}
            <g transform={`rotate(${wheelRot}, 60, 110)`}><circle cx={60} cy={110} r={22} fill="none" stroke={COLORS.white} strokeWidth={3} /><line x1={60} y1={88} x2={60} y2={110} stroke={COLORS.white} strokeWidth={2} /></g>
            <g transform={`rotate(${wheelRot}, 200, 110)`}><circle cx={200} cy={110} r={22} fill="none" stroke={COLORS.white} strokeWidth={3} /><line x1={200} y1={88} x2={200} y2={110} stroke={COLORS.white} strokeWidth={2} /></g>
            {/* Smokestack */}
            <rect x={50} y={-20} width={30} height={20} rx={4} fill={COLORS.accent} />
          </g>
        </g>

        {/* Progress card */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={140} />
          <text x={100} y={1310} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>PROGRESS</text>
          <rect x={320} y={1290} width={660} height={12} rx={6} fill="rgba(255,255,255,0.08)" />
          <rect x={320} y={1290} width={interpolate(frame, [50, 90], [0, 660 * (39 / 105)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} height={12} rx={6} fill={COLORS.accent} />
          <text x={1000} y={1330} textAnchor="end" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>39 / 105</text>
        </g>

        {/* Floating accent dot */}
        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.08} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={2} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s01.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
