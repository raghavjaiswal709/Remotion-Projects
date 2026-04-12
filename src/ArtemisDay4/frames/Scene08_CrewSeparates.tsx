/**
 * Scene08 — Crew Separates
 * "The crew separates from the explosion before the explosion reaches them."
 * CSV: 39.480s → 43.400s
 * Duration: 136 frames (4.53s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, headline
 *   Phase 2 (20–80): Content — explosion blast, capsule escaping, distance marker
 *   Phase 3 (70–end): Micro — shockwave rings, debris particles
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

export const Scene08_CrewSeparates: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const explosionEntrance = useSpringEntrance(frame, 18);
  const capsuleEntrance = useSpringEntrance(frame, 24);
  const distanceMarker = useSpringEntrance(frame, 36);
  const timelineCard = useSpringEntrance(frame, 48);
  const factCard = useSpringEntrance(frame, 56);

  // Explosion expand
  const explosionRadius = interpolate(frame, [22, 70], [20, 140], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Capsule escape path
  const escapeProgress = interpolate(frame, [28, 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const capsuleX = interpolate(escapeProgress, [0, 1], [380, 700]);
  const capsuleY = interpolate(escapeProgress, [0, 1], [850, 620]);

  // Distance line draw
  const distanceLine = 400;
  const distDash = usePathDraw(frame, 40, distanceLine, 25);

  // Shockwave ring path
  const shockwavePath = 2 * Math.PI * 160;
  const shockDash = usePathDraw(frame, 30, shockwavePath, 35);

  // ── Phase 3 ──
  const shockwaveExpand = interpolate(frame, [30, 90], [0, 200], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const shockwaveOpacity = interpolate(frame, [30, 90], [0.4, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.orange} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={280} fontWeight={900} fill={COLORS.orange} opacity={0.04}>
          SEP
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ESCAPE SEQUENCE · SEPARATION" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={900} fill={COLORS.deep_black}>
            Crew Separates
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={455} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={42} fontWeight={600} fill={COLORS.vibrant_red}>
            Before Explosion Reaches Them
          </text>
        </g>

        {/* Zone C — Explosion + Escape scene */}
        {/* Explosion origin */}
        <g opacity={explosionEntrance.opacity}
          transform={`translate(300, 850)`}>
          {/* Blast radius circles */}
          <circle cx={0} cy={0} r={explosionRadius}
            fill={COLORS.vibrant_red} fillOpacity={0.08} />
          <circle cx={0} cy={0} r={explosionRadius * 0.7}
            fill={COLORS.orange} fillOpacity={0.1} />
          <circle cx={0} cy={0} r={explosionRadius * 0.4}
            fill={COLORS.amber} fillOpacity={0.15} />

          {/* Inner explosion starburst */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const len = explosionRadius * 0.8;
            return (
              <line key={i}
                x1={0} y1={0}
                x2={Math.cos(angle) * len} y2={Math.sin(angle) * len}
                stroke={COLORS.orange} strokeWidth={2} opacity={0.15}
                strokeLinecap="round" />
            );
          })}

          {/* Danger label */}
          <text x={0} y={-explosionRadius - 20} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={700} fill={COLORS.vibrant_red}
            opacity={0.7}>
            EXPLOSION
          </text>
        </g>

        {/* Shockwave rings */}
        <circle cx={300} cy={850} r={shockwaveExpand}
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
          opacity={shockwaveOpacity} />
        <circle cx={300} cy={850} r={shockwaveExpand * 0.6}
          fill="none" stroke={COLORS.orange} strokeWidth={1.5}
          opacity={shockwaveOpacity * 0.6} />

        {/* Escaping capsule */}
        <g opacity={capsuleEntrance.opacity}
          transform={`translate(${capsuleX}, ${capsuleY + breathe})`}>
          {/* Capsule body */}
          <path d="M -22,-8 L -30,28 L 30,28 L 22,-8 Z"
            fill={COLORS.sky_blue} fillOpacity={0.12}
            stroke={COLORS.sky_blue} strokeWidth={2.5} />
          {/* Heat shield */}
          <rect x={-30} y={26} width={60} height={5} rx={2.5}
            fill={COLORS.sky_blue} fillOpacity={0.3} />
          {/* LAS tower */}
          <line x1={0} y1={-8} x2={0} y2={-55}
            stroke={COLORS.vibrant_red} strokeWidth={2.5} strokeLinecap="round" />
          {/* LAS nozzle */}
          <path d="M -8,-55 L 0,-65 L 8,-55"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Check mark (safe) */}
          <circle cx={55} cy={10} r={18}
            fill={COLORS.green} fillOpacity={0.12}
            stroke={COLORS.green} strokeWidth={2}
            style={{ transform: `scale(${pulse})`, transformOrigin: `${capsuleX + 55}px ${capsuleY + 10}px` }} />
          <path d="M 47,10 L 53,16 L 63,4"
            fill="none" stroke={COLORS.green} strokeWidth={2.5} strokeLinecap="round" />
          {/* Label */}
          <text x={0} y={-75} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.sky_blue}>
            ORION · SAFE
          </text>
        </g>

        {/* Escape path trail */}
        <path d={`M 300,850 Q 450,750 ${capsuleX},${capsuleY + 30}`}
          fill="none" stroke={COLORS.green} strokeWidth={2}
          strokeDasharray="8,8" opacity={capsuleEntrance.opacity * 0.4} />

        {/* Distance marker line */}
        <g opacity={distanceMarker.opacity}>
          <line x1={300} y1={1030} x2={700} y2={1030}
            stroke={COLORS.deep_black} strokeWidth={1.5}
            strokeDasharray={distanceLine} strokeDashoffset={distDash}
            strokeLinecap="round" />
          {/* End ticks */}
          <line x1={300} y1={1020} x2={300} y2={1040}
            stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          <line x1={700} y1={1020} x2={700} y2={1040}
            stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          {/* Distance label */}
          <text x={500} y={1070} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            SAFE DISTANCE
          </text>
        </g>

        {/* Timeline info card */}
        <g opacity={timelineCard.opacity}
          transform={`translate(60, ${1120 + timelineCard.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.green} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Separation Before Impact
          </text>
          <text x={30} y={74} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Crew clears blast radius before shockwave propagates
          </text>
        </g>

        {/* Fact card */}
        <g opacity={factCard.opacity}
          transform={`translate(60, ${1250 + factCard.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.orange} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Speed vs. Blast Wave
          </text>
          <text x={30} y={74} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            LAS outpaces the explosion shockwave propagation rate
          </text>
        </g>

        {/* Debris particles */}
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const dist = explosionRadius + 30 + i * 8;
          const px = 300 + Math.cos(angle + frame * 0.02) * dist;
          const py = 850 + Math.sin(angle + frame * 0.02) * dist;
          return (
            <circle key={i} cx={px} cy={py}
              r={1.5 + Math.sin(i) * 0.5}
              fill={i % 2 === 0 ? COLORS.orange : COLORS.cool_silver}
              opacity={0.1 * shimmer} />
          );
        })}

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">CREW SEPARATES · CAPSULE DETACHES</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
