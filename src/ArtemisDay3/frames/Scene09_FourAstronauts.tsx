/**
 * Scene 09 — FourAstronauts
 * "Four astronauts, same free return trajectory around the moon,"
 * CSV: 39.460s → 43.680s
 * Duration: 144 frames (4.8s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–80): 4 astronaut silhouettes, trajectory path draw, moon node
 *   Phase 3 (70–end): Floating astronauts, trajectory shimmer
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

const CREW = [
  { name: 'REID', role: 'CDR', x: 160 },
  { name: 'VICTOR', role: 'PLT', x: 380 },
  { name: 'CHRISTINA', role: 'MS1', x: 600 },
  { name: 'JEREMY', role: 'MS2', x: 820 },
] as const;

export const Scene09_FourAstronauts: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Crew members ──
  const crewSprings = CREW.map((_, i) => useSpringEntrance(frame, 22 + i * 12));
  const trajectoryLength = 750;
  const trajectoryDash = usePathDraw(frame, 50, trajectoryLength, 35);
  const moonSpring = useSpringEntrance(frame, 60);
  const earthSpring = useSpringEntrance(frame, 55);
  const labelCard = useSpringEntrance(frame, 70);

  // ── Phase 3 ──
  const breathe = (i: number) => Math.sin(frame * 0.06 + i * 1.2) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Ghost background crew count */}
        <text x={860} y={500} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={400} fontWeight={900} fill={COLORS.sky_blue} opacity={0.03}>
          4
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ARTEMIS II · CREW" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={540} y={380} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900} fill={COLORS.deep_black}>
            Four Astronauts
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={540} y={450} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={500} fill={COLORS.sky_blue}>
            Same Free Return Trajectory
          </text>
        </g>

        {/* Zone C — Four astronaut silhouettes */}
        {CREW.map((crew, i) => (
          <g key={crew.name} opacity={crewSprings[i].opacity} transform={`translate(${crew.x}, ${580 + crewSprings[i].translateY + breathe(i)})`}>
            {/* Astronaut helmet (circle) */}
            <circle cx={0} cy={0} r={40} fill={COLORS.sky_blue} fillOpacity={0.1} stroke={COLORS.sky_blue} strokeWidth={2} />
            {/* Visor */}
            <rect x={-22} y={-10} width={44} height={18} rx={9} fill={COLORS.sky_blue} fillOpacity={0.15} />
            {/* Body (suit torso) */}
            <rect x={-28} y={45} width={56} height={70} rx={8} fill="none" stroke={COLORS.deep_black} strokeWidth={1.5} opacity={0.3} />
            {/* Backpack (life support) */}
            <rect x={-34} y={48} width={10} height={50} rx={2} fill={COLORS.cool_silver} fillOpacity={0.1} stroke={COLORS.cool_silver} strokeWidth={1} />
            {/* Number on chest */}
            <text x={0} y={85} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={800} fill={COLORS.sky_blue} opacity={0.4}>
              {i + 1}
            </text>
            {/* Name */}
            <text x={0} y={145} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
              {crew.name}
            </text>
            {/* Role */}
            <text x={0} y={175} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.1em">
              {crew.role}
            </text>
          </g>
        ))}

        {/* Horizontal divider */}
        <line x1={60} y1={810} x2={1020} y2={810} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08} />

        {/* Trajectory diagram — Earth → Moon → Earth */}
        <g opacity={earthSpring.opacity} transform={`translate(0, ${earthSpring.translateY})`}>
          {/* Earth */}
          <circle cx={180} cy={1020} r={50} fill={COLORS.sky_blue} fillOpacity={0.06} stroke={COLORS.sky_blue} strokeWidth={2} />
          <ellipse cx={170} cy={1010} rx={18} ry={12} fill={COLORS.green} fillOpacity={0.15} />
          <text x={180} y={1090} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            EARTH
          </text>
        </g>

        <g opacity={moonSpring.opacity} transform={`translate(0, ${moonSpring.translateY})`}>
          {/* Moon */}
          <circle cx={900} cy={1020} r={40} fill={COLORS.cool_silver} fillOpacity={0.08} stroke={COLORS.cool_silver} strokeWidth={2} />
          <circle cx={890} cy={1010} r={6} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <text x={900} y={1080} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            MOON
          </text>
        </g>

        {/* Free return trajectory arc */}
        <path
          d="M 230,1020 C 450,860 700,860 860,1020"
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={2.5}
          strokeDasharray={trajectoryLength}
          strokeDashoffset={trajectoryDash}
          strokeLinecap="round"
          opacity={0.5}
          markerEnd="url(#arrow)"
        />

        {/* Return path (below) */}
        <path
          d="M 860,1020 C 700,1180 450,1180 230,1020"
          fill="none"
          stroke={COLORS.green}
          strokeWidth={2}
          strokeDasharray={trajectoryLength}
          strokeDashoffset={usePathDraw(frame, 60, trajectoryLength, 30)}
          strokeLinecap="round"
          opacity={0.3}
          markerEnd="url(#arrow)"
        />

        {/* "FREE RETURN" label on arc */}
        <g opacity={moonSpring.opacity * shimmer}>
          <text x={540} y={880} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600} fill={COLORS.sky_blue} letterSpacing="0.15em">
            FREE RETURN TRAJECTORY
          </text>
        </g>

        {/* Info card */}
        <g opacity={labelCard.opacity} transform={`translate(60, ${1260 + labelCard.translateY})`}>
          <rect x={0} y={0} width={960} height={120} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.04} stroke={COLORS.sky_blue} strokeWidth={1.5}
          />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={48} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Same Path as Apollo 8
          </text>
          <text x={30} y={88} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Around the Moon and back — gravity provides the return ticket
          </text>
        </g>

        {/* Distance label */}
        <g opacity={labelCard.opacity * shimmer}>
          <text x={540} y={1460} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900} fill={COLORS.sky_blue} opacity={0.15}>
            385,000 km
          </text>
          <text x={540} y={1460} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={800} fill={COLORS.deep_black}>
            385,000 km
          </text>
          <text x={540} y={1510} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            DISTANCE TO THE MOON
          </text>
        </g>

        {/* Stars */}
        {Array.from({ length: 12 }, (_, i) => (
          <circle
            key={i}
            cx={100 + (i * 89) % 880}
            cy={920 + (i * 37) % 160}
            r={1.2 + (i % 3) * 0.5}
            fill={COLORS.sky_blue}
            opacity={interpolate(Math.sin(frame * 0.05 + i * 0.6), [-1, 1], [0.07, 0.2])}
          />
        ))}

        {/* Bottom note */}
        <g opacity={labelCard.opacity * shimmer}>
          <text x={540} y={1700} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.12em">
            FIRST CREWED LUNAR MISSION SINCE 1972
          </text>
        </g>

        {/* Divider + bottom note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.15em" opacity={0.45}>
          4 ASTRONAUTS · SAME TRAJECTORY · 385,000 KM
        </text>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
