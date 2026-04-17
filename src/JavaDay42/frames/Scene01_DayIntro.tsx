/**
 * Scene 01 — Day Intro
 * "This is day 42 of learning national railway system in Java from first principles."
 * CSV: 0.000s → 6.340s
 * Duration: 205 frames (6.83s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   DAY 42 badge springs in, section label slides down
 *   Phase 2 (frames 20–90):  Locomotive illustration builds with path-draw, bento cards stagger
 *   Phase 3 (frames 80–end): Micro-animations — wheel rotation, smoke float, pulse rings
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const dayBadge      = useSpringEntrance(frame, 5);
  const headlineA     = useSpringEntrance(frame, 10);
  const headlineB     = useSpringEntrance(frame, 16);

  // ── Phase 2: Content build ────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 24);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 48);
  const locoBody = useSpringEntrance(frame, 28);

  // ── Path draw for tracks ──────────────────────────────────────────────────
  const trackLength = 960;
  const trackDash = usePathDraw(frame, 30, trackLength, 40);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe    = Math.sin(frame * 0.06) * 4;
  const wheelAngle = frame * 3;
  const pulse      = 1 + Math.sin(frame * 0.08) * 0.015;
  const smokeY     = interpolate(frame % 60, [0, 60], [0, -40], { extrapolateRight: 'clamp' });
  const smokeOp    = interpolate(frame % 60, [0, 60], [0.6, 0], { extrapolateRight: 'clamp' });
  const shimmer    = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const dayNumber = interpolate(frame, [10, 40], [0, 42], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ──────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 2 · NETWORK EXPANSION" y={120} opacity={0.8} />
        </g>

        {/* ── DAY 42 badge ────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${dayBadge.translateY})`} opacity={dayBadge.opacity}>
          <rect x={60} y={160} width={220} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={170} y={214} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>
            DAY {Math.round(dayNumber)}
          </text>
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={340} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Object Class
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            The Universal Parent
          </text>
        </g>

        {/* ── ZONE C — Locomotive illustration ────────────────────────────── */}
        <g opacity={locoBody.opacity} transform={`translate(0, ${locoBody.translateY})`}>
          {/* Track rails */}
          <line x1={60} y1={920} x2={1020} y2={920}
            stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={trackLength} strokeDashoffset={trackDash}
            strokeLinecap="round" />
          <line x1={60} y1={940} x2={1020} y2={940}
            stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={trackLength} strokeDashoffset={trackDash}
            strokeLinecap="round" />
          {/* Cross ties */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={120 + i * 72} y={915} width={40} height={30} rx={4}
              fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={1}
              opacity={interpolate(frame, [30 + i * 2, 40 + i * 2], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
          ))}

          {/* Locomotive body */}
          <rect x={160} y={680} width={520} height={220} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Cab */}
          <rect x={560} y={620} width={160} height={280} rx={12}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Cab window */}
          <rect x={585} y={650} width={110} height={80} rx={8}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Smokestack */}
          <rect x={220} y={620} width={60} height={60} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <rect x={230} y={600} width={40} height={30} rx={6}
            fill={COLORS.accent} fillOpacity={0.2} />
          {/* Smoke puffs */}
          <circle cx={250} cy={580 + smokeY} r={18}
            fill={COLORS.accent} fillOpacity={smokeOp * 0.3} />
          <circle cx={230} cy={560 + smokeY * 1.3} r={14}
            fill={COLORS.accent} fillOpacity={smokeOp * 0.2} />
          <circle cx={265} cy={545 + smokeY * 1.5} r={10}
            fill={COLORS.accent} fillOpacity={smokeOp * 0.15} />

          {/* Headlight */}
          <circle cx={175} cy={760} r={18}
            fill={COLORS.accent} fillOpacity={0.3 * shimmer}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={175} cy={760} r={8} fill={COLORS.accent} fillOpacity={0.8} />

          {/* Wheels */}
          {[280, 420, 600].map((wx, i) => (
            <g key={i} transform={`translate(${wx}, 910)`}>
              <circle cx={0} cy={0} r={36}
                fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={3} />
              <line x1={-20} y1={0} x2={20} y2={0}
                stroke={COLORS.accent} strokeWidth={2}
                transform={`rotate(${wheelAngle + i * 30})`} />
              <line x1={0} y1={-20} x2={0} y2={20}
                stroke={COLORS.accent} strokeWidth={2}
                transform={`rotate(${wheelAngle + i * 30})`} />
              <circle cx={0} cy={0} r={8} fill={COLORS.accent} fillOpacity={0.4} />
            </g>
          ))}

          {/* Coupling */}
          <rect x={720} y={820} width={60} height={16} rx={4}
            fill={COLORS.accent} fillOpacity={0.5} />

          {/* Body label */}
          <text x={400} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic" opacity={shimmer}>
            java.lang.Object
          </text>
        </g>

        {/* ── Info cards ──────────────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1000} w={960} h={140} accent />
          <rect x={60} y={1000} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1060} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Every class has a hidden parent
          </text>
          <text x={100} y={1110} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            java.lang.Object — the root of all classes
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1160} w={460} h={180} />
          <text x={100} y={1230} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            3 Methods
          </text>
          <text x={100} y={1275} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            toString
          </text>
          <text x={100} y={1310} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            equals · hashCode
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1160} w={460} h={180} accent />
          <text x={600} y={1230} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Inherited
          </text>
          <text x={600} y={1275} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Automatically by
          </text>
          <text x={600} y={1310} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            every single class
          </text>
        </g>

        {/* ── Floating accent rings ─────────────────────────────────────── */}
        <g transform={`translate(900, ${500 + breathe})`} opacity={0.3}>
          <circle cx={0} cy={0} r={40} fill="none"
            stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={60} fill="none"
            stroke={COLORS.accent} strokeWidth={1} opacity={0.4}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s01.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
