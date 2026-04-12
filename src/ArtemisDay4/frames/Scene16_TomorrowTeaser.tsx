/**
 * Scene16 — Tomorrow Teaser
 * "Tomorrow, why the most advanced capsule ever built still lands in the ocean like it is 1969."
 * CSV: 79.200s → 85.420s
 * Duration: 205 frames (6.83s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, headline
 *   Phase 2 (20–120): Content — capsule descending with parachutes, ocean waves, 1969 badge
 *   Phase 3 (100–end): Micro — wave motion, capsule sway, parachute float
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene16_TomorrowTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // Phase 2
  const parachuteEntrance = useSpringEntrance(frame, 18);
  const capsuleDrop = useSpringEntrance(frame, 20);
  const oceanEntrance = useSpringEntrance(frame, 30);
  const yearBadge = useSpringEntrance(frame, 45);
  const arrowCard = useSpringEntrance(frame, 55);
  const factCard1 = useSpringEntrance(frame, 65);
  const factCard2 = useSpringEntrance(frame, 75);

  // Capsule descend animation
  const capsuleY = interpolate(frame, [20, 100], [600, 900], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Phase 3
  const breathe = Math.sin(frame * 0.04) * 4;
  const sway = Math.sin(frame * 0.06) * 8;
  const waveMotion = Math.sin(frame * 0.08) * 6;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  const CX = 540;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.sky_blue} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={280} fontWeight={900} fill={COLORS.sky_blue} opacity={0.04}>
          TMW
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TOMORROW · DAY 5 PREVIEW" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={370} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={48} fontWeight={900} fill={COLORS.deep_black}>
            Most Advanced Capsule
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={440} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={600} fill={COLORS.sky_blue}>
            Still Lands in the Ocean
          </text>
        </g>

        {/* Zone C — Splashdown illustration */}
        {/* Parachutes */}
        <g opacity={parachuteEntrance.opacity}
          transform={`translate(${CX + sway}, ${capsuleY - 200 + breathe})`}>
          {/* Main chute 1 */}
          <path d="M -120,-80 Q -60,-140 0,-80"
            fill={COLORS.orange} fillOpacity={0.08}
            stroke={COLORS.orange} strokeWidth={2} />
          {/* Chute 2 */}
          <path d="M 0,-80 Q 60,-140 120,-80"
            fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Center chute */}
          <path d="M -60,-80 Q 0,-150 60,-80"
            fill={COLORS.orange} fillOpacity={0.1}
            stroke={COLORS.orange} strokeWidth={2} />
          {/* Suspension lines */}
          <line x1={-120} y1={-80} x2={-15} y2={80} stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.3} />
          <line x1={0} y1={-80} x2={0} y2={80} stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.3} />
          <line x1={120} y1={-80} x2={15} y2={80} stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.3} />
          <line x1={-60} y1={-80} x2={-5} y2={80} stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.2} />
          <line x1={60} y1={-80} x2={5} y2={80} stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.2} />
        </g>

        {/* Orion capsule */}
        <g opacity={capsuleDrop.opacity}
          transform={`translate(${CX + sway}, ${capsuleY + breathe * 0.5})`}>
          {/* Heat shield bottom */}
          <ellipse cx={0} cy={30} rx={40} ry={10}
            fill={COLORS.brown} fillOpacity={0.15}
            stroke={COLORS.brown} strokeWidth={1.5} />
          {/* Capsule body */}
          <path d="M -35,25 L -25,-30 Q 0,-50 25,-30 L 35,25 Z"
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={2.5} />
          {/* Window */}
          <ellipse cx={0} cy={-10} rx={12} ry={8}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={1} />
        </g>

        {/* Ocean waves */}
        <g opacity={oceanEntrance.opacity}>
          {/* Wave layer 1 */}
          <path d={`M 0,${1050 + waveMotion} Q 180,${1030 + waveMotion} 360,${1050 + waveMotion} Q 540,${1070 + waveMotion} 720,${1050 + waveMotion} Q 900,${1030 + waveMotion} 1080,${1050 + waveMotion} L 1080,1100 L 0,1100 Z`}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.5} />
          {/* Wave layer 2 */}
          <path d={`M 0,${1070 - waveMotion * 0.7} Q 270,${1050 - waveMotion * 0.7} 540,${1070 - waveMotion * 0.7} Q 810,${1090 - waveMotion * 0.7} 1080,${1070 - waveMotion * 0.7} L 1080,1120 L 0,1120 Z`}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.3} />
          {/* Splash spray */}
          {Array.from({ length: 8 }, (_, i) => {
            const sx = CX + (i - 4) * 50 + sway * 0.3;
            const sy = 1040 + Math.abs(i - 4) * 5 + waveMotion * 0.5;
            return (
              <circle key={i} cx={sx} cy={sy} r={2}
                fill={COLORS.sky_blue} opacity={0.2 * shimmer} />
            );
          })}
        </g>

        {/* "LIKE 1969" badge */}
        <g opacity={yearBadge.opacity}
          transform={`translate(${CX}, ${1180 + yearBadge.translateY})`}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={180} fontWeight={900}
            fill={COLORS.cool_silver} opacity={0.08}>
            1969
          </text>
          <text x={0} y={0} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={140} fontWeight={900}
            fill={COLORS.deep_black}
            style={{ transform: `scale(${pulse})`, transformOrigin: `0px ${-40}px` }}>
            1969
          </text>
          <text x={0} y={55} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={600} fill={COLORS.cool_silver}>
            SAME METHOD, DIFFERENT ERA
          </text>
        </g>

        {/* Tomorrow arrow card */}
        <g opacity={arrowCard.opacity}
          transform={`translate(60, ${1350 + arrowCard.translateY})`}>
          <rect x={0} y={0} width={960} height={90} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          {/* Arrow icon */}
          <path d="M 920,45 L 940,45 M 935,37 L 943,45 L 935,53"
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5} strokeLinecap="round" />
          <text x={40} y={38} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={500} fill={COLORS.cool_silver}
            letterSpacing="0.15em">
            TOMORROW
          </text>
          <text x={40} y={70} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Why Orion Still Splashes Down
          </text>
        </g>

        {/* Fact cards */}
        <g opacity={factCard1.opacity}
          transform={`translate(60, ${1470 + factCard1.translateY})`}>
          <rect x={0} y={0} width={460} height={90} rx={12}
            fill={COLORS.orange} fillOpacity={0.05}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.orange} />
          <text x={30} y={36} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={500} fill={COLORS.cool_silver}>
            REENTRY SPEED
          </text>
          <text x={30} y={68} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            40,000 km/h
          </text>
        </g>

        <g opacity={factCard2.opacity}
          transform={`translate(540, ${1470 + factCard2.translateY})`}>
          <rect x={0} y={0} width={460} height={90} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.05}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={90} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={36} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={500} fill={COLORS.cool_silver}>
            LANDING ZONE
          </text>
          <text x={30} y={68} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Pacific Ocean
          </text>
        </g>

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">TOMORROW · COMMUNICATION BLACKOUT</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
