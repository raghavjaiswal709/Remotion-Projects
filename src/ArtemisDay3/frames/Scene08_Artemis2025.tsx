/**
 * Scene 08 — Artemis2025
 * "In 2025, Artemis II does the same thing."
 * CSV: 35.420s → 38.760s
 * Duration: 118 frames (3.93s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring in
 *   Phase 2 (20–65): Year 2025 counter, mission badge, SLS rocket illustration
 *   Phase 3 (60–end): Rocket flame flicker, badge pulse
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents, Divider } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene08_Artemis2025: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const yearStr = useCounter(frame, 18, 2025, 35);
  const rocketEntrance = useSpringEntrance(frame, 22);
  const badge = useSpringEntrance(frame, 30);
  const card1 = useSpringEntrance(frame, 40);
  const card2 = useSpringEntrance(frame, 52);
  const sameLabel = useSpringEntrance(frame, 58);

  // SLS body outline draw
  const rocketOutline = 600;
  const rocketDash = usePathDraw(frame, 24, rocketOutline, 35);

  // Flame flicker path draw
  const flamePath = 120;
  const flameDash = usePathDraw(frame, 38, flamePath, 20);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const flameFlicker = Math.sin(frame * 0.25) * 6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Ghost background year */}
        <text x={820} y={520} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={380} fontWeight={900} fill={COLORS.sky_blue} opacity={0.03}>
          25
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ARTEMIS II · 2025 MISSION" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Year display */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={540} y={410} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={140} fontWeight={900} fill={COLORS.sky_blue}>
            {yearStr}
          </text>
          {/* Ghost layer */}
          <text x={540} y={410} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={140} fontWeight={900} fill={COLORS.sky_blue} opacity={0.08}>
            2025
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={540} y={480} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={500} fill={COLORS.cool_silver}>
            The Same Mission. New Technology.
          </text>
        </g>

        {/* Zone C — SLS Rocket illustration */}
        <g opacity={rocketEntrance.opacity} transform={`translate(540, ${720 + rocketEntrance.translateY})`}>
          {/* Rocket body (tall cylinder) */}
          <rect x={-40} y={-200} width={80} height={400} rx={8}
            fill="none" stroke={COLORS.deep_black} strokeWidth={2.5}
            strokeDasharray={rocketOutline} strokeDashoffset={rocketDash}
          />
          {/* Nose cone */}
          <polygon points="0,-250 -40,-200 40,-200"
            fill="none" stroke={COLORS.deep_black} strokeWidth={2.5}
            strokeDasharray={120} strokeDashoffset={rocketDash * 0.2}
          />
          {/* Capsule (Orion) at top */}
          <rect x={-30} y={-210} width={60} height={30} rx={4}
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={2}
          />
          <text x={0} y={-190} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={700} fill={COLORS.sky_blue}>
            ORION
          </text>
          {/* SLS Label */}
          <text x={0} y={20} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black} opacity={rocketEntrance.opacity}>
            SLS
          </text>
          {/* Side boosters */}
          <rect x={-70} y={-100} width={24} height={260} rx={4}
            fill="none" stroke={COLORS.deep_black} strokeWidth={1.5}
            strokeDasharray={550} strokeDashoffset={rocketDash * 0.5}
          />
          <rect x={46} y={-100} width={24} height={260} rx={4}
            fill="none" stroke={COLORS.deep_black} strokeWidth={1.5}
            strokeDasharray={550} strokeDashoffset={rocketDash * 0.5}
          />
          {/* Exhaust flame */}
          <g opacity={rocketEntrance.opacity}>
            <polygon
              points={`-24,200 24,200 ${12 + flameFlicker},${280 + Math.abs(flameFlicker)} ${-12 - flameFlicker},${270 + Math.abs(flameFlicker)}`}
              fill={COLORS.orange} fillOpacity={0.15}
              stroke={COLORS.orange} strokeWidth={1.5}
              strokeDasharray={flamePath} strokeDashoffset={flameDash}
            />
            <polygon
              points={`-14,200 14,200 ${6 + flameFlicker * 0.6},${250 + Math.abs(flameFlicker) * 0.8} ${-6 - flameFlicker * 0.6},${245 + Math.abs(flameFlicker) * 0.8}`}
              fill={COLORS.amber} fillOpacity={0.1}
            />
          </g>
          {/* Fins */}
          <polygon points="-40,180 -60,200 -40,200" fill="none" stroke={COLORS.deep_black} strokeWidth={1.5} />
          <polygon points="40,180 60,200 40,200" fill="none" stroke={COLORS.deep_black} strokeWidth={1.5} />
        </g>

        {/* Mission badge */}
        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`} style={{ transformOrigin: '540px 1140px' }}>
          <circle cx={540} cy={1140} r={60} fill={COLORS.sky_blue} fillOpacity={0.12} stroke={COLORS.sky_blue} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '540px 1140px' }}
          />
          <text x={540} y={1132} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800} fill={COLORS.sky_blue} letterSpacing="0.1em">
            ARTEMIS
          </text>
          <text x={540} y={1162} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={900} fill={COLORS.deep_black}>
            II
          </text>
        </g>

        {/* "Same thing" equivalence label */}
        <g opacity={sameLabel.opacity * shimmer}>
          <text x={540} y={1260} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={600} fill={COLORS.deep_black} letterSpacing="0.08em">
            DOES THE SAME THING
          </text>
          <line x1={340} y1={1275} x2={740} y2={1275} stroke={COLORS.sky_blue} strokeWidth={2} opacity={0.3} />
        </g>

        {/* Info cards */}
        <g opacity={card1.opacity} transform={`translate(60, ${1320 + card1.translateY})`}>
          <rect x={0} y={0} width={460} height={100} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.04} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.sky_blue} />
          <text x={24} y={42} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Same loop around the Moon
          </text>
          <text x={24} y={76} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Free return trajectory
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(560, ${1320 + card2.translateY})`}>
          <rect x={0} y={0} width={460} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.04} stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.orange} />
          <text x={24} y={42} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Test human survival
          </text>
          <text x={24} y={76} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Beyond Earth's shield
          </text>
        </g>

        {/* Star decorations */}
        {Array.from({ length: 8 }, (_, i) => (
          <circle
            key={i}
            cx={80 + (i * 130) % 920}
            cy={560 + (i * 47) % 120}
            r={1.5}
            fill={COLORS.sky_blue}
            opacity={interpolate(Math.sin(frame * 0.05 + i * 0.8), [-1, 1], [0.1, 0.25])}
          />
        ))}

        {/* Bottom text */}
        <g opacity={card2.opacity * shimmer}>
          <text x={540} y={1700} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.12em">
            56 YEARS LATER
          </text>
        </g>

        {/* Bottom divider + note */}
        <Divider y={1740} opacity={0.12} />
        <text x={540} y={1770} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={shimmer * 0.6} letterSpacing="0.12em">
          SAME MISSION · NEW MACHINE · 2025
        </text>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
