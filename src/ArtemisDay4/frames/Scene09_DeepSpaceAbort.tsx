/**
 * Scene09 — Deep Space Abort
 * "Press it in deep space, and the picture changes completely."
 * CSV: 44.060s → 47.320s
 * Duration: 116 frames (3.87s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, dramatic headline
 *   Phase 2 (20–70): Content — deep space visualization, contrast cards
 *   Phase 3 (60–end): Micro — star field pulse, capsule float
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

export const Scene09_DeepSpaceAbort: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2 ──
  const spaceField = useSpringEntrance(frame, 16);
  const capsuleEntrance = useSpringEntrance(frame, 22);
  const earthEntrance = useSpringEntrance(frame, 28);
  const moonEntrance = useSpringEntrance(frame, 34);
  const contrastCard1 = useSpringEntrance(frame, 42);
  const contrastCard2 = useSpringEntrance(frame, 52);

  // Orbit path draw
  const orbitLength = 800;
  const orbitDash = usePathDraw(frame, 25, orbitLength, 40);

  // Distance line
  const distLine = 500;
  const distDash = usePathDraw(frame, 35, distLine, 25);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.05) * 4;
  const starTwinkle = (i: number) => interpolate(
    Math.sin(frame * 0.1 + i * 2.5), [-1, 1], [0.2, 0.8]
  );
  const pulse = 1 + Math.sin(frame * 0.07) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.purple} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={240} fontWeight={900} fill={COLORS.purple} opacity={0.04}>
          DEEP
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="DEEP SPACE · ABORT SCENARIO" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Dramatic headline */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={900} fill={COLORS.deep_black}>
            Deep Space
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={460} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={700} fill={COLORS.purple}>
            Picture Changes Completely
          </text>
        </g>

        {/* Zone C — Deep space visualization */}
        {/* Star field background */}
        <g opacity={spaceField.opacity}>
          {Array.from({ length: 45 }, (_, i) => {
            const sx = 80 + (i * 137) % 920;
            const sy = 530 + (i * 89) % 700;
            const sr = 1 + (i % 3) * 0.6;
            return (
              <circle key={i} cx={sx} cy={sy} r={sr}
                fill={COLORS.cool_silver} opacity={starTwinkle(i)} />
            );
          })}
        </g>

        {/* Earth (small, far left) */}
        <g opacity={earthEntrance.opacity}
          transform={`translate(160, ${780 + earthEntrance.translateY})`}>
          <circle cx={0} cy={0} r={55}
            fill={COLORS.sky_blue} fillOpacity={0.08}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Continental outlines */}
          <path d="M -20,-30 Q -10,-35 5,-25 Q 15,-20 10,-10 Q 5,0 -15,-5 Q -25,-15 -20,-30"
            fill={COLORS.green} fillOpacity={0.15}
            stroke={COLORS.green} strokeWidth={1} opacity={0.5} />
          <path d="M 10,10 Q 25,5 30,20 Q 25,35 15,30 Q 5,25 10,10"
            fill={COLORS.green} fillOpacity={0.15}
            stroke={COLORS.green} strokeWidth={1} opacity={0.5} />
          <text x={0} y={85} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={700} fill={COLORS.sky_blue}>
            EARTH
          </text>
        </g>

        {/* Moon (right side) */}
        <g opacity={moonEntrance.opacity}
          transform={`translate(880, ${700 + moonEntrance.translateY})`}>
          <circle cx={0} cy={0} r={40}
            fill={COLORS.cool_silver} fillOpacity={0.1}
            stroke={COLORS.cool_silver} strokeWidth={2} />
          {/* Crater marks */}
          <circle cx={-12} cy={-8} r={6} fill={COLORS.cool_silver} fillOpacity={0.08} />
          <circle cx={10} cy={5} r={8} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <circle cx={-5} cy={15} r={4} fill={COLORS.cool_silver} fillOpacity={0.07} />
          <text x={0} y={65} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600} fill={COLORS.cool_silver}>
            MOON
          </text>
        </g>

        {/* Orbit path from Earth to Moon */}
        <path d="M 220,780 Q 450,620 540,700 Q 630,780 840,700"
          fill="none" stroke={COLORS.purple} strokeWidth={2}
          strokeDasharray={orbitLength} strokeDashoffset={orbitDash}
          opacity={0.4} strokeLinecap="round" />

        {/* Orion capsule in deep space */}
        <g opacity={capsuleEntrance.opacity}
          transform={`translate(540, ${720 + breathe})`}>
          {/* Capsule */}
          <path d="M -18,-6 L -24,22 L 24,22 L 18,-6 Z"
            fill={COLORS.sky_blue} fillOpacity={0.12}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Service module */}
          <rect x={-24} y={22} width={48} height={35} rx={4}
            fill={COLORS.deep_black} fillOpacity={0.05}
            stroke={COLORS.cool_silver} strokeWidth={1.5} />
          {/* Solar panels */}
          <rect x={-70} y={28} width={40} height={14} rx={2}
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={1} />
          <rect x={30} y={28} width={40} height={14} rx={2}
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={1} />
          {/* Question mark — uncertainty */}
          <text x={0} y={-30} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={900} fill={COLORS.vibrant_red}
            opacity={0.7 * shimmer}
            style={{ transform: `scale(${pulse})`, transformOrigin: '540px 690px' }}>
            ?
          </text>
        </g>

        {/* Distance indicator */}
        <g opacity={contrastCard1.opacity * 0.7}>
          <line x1={220} y1={920} x2={840} y2={920}
            stroke={COLORS.deep_black} strokeWidth={1.5}
            strokeDasharray={distLine} strokeDashoffset={distDash}
            opacity={0.3} />
          <text x={540} y={955} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.purple}>
            ~ 400,000 KM FROM EARTH
          </text>
        </g>

        {/* Contrast cards — Launch vs Deep Space */}
        <g opacity={contrastCard1.opacity}
          transform={`translate(60, ${1020 + contrastCard1.translateY})`}>
          <rect x={0} y={0} width={460} height={160} rx={16}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={160} rx={3} fill={COLORS.orange} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.cool_silver}>
            LAUNCH ABORT
          </text>
          <text x={30} y={80} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={800} fill={COLORS.deep_black}>
            LAS Tower Fires
          </text>
          <text x={30} y={120} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Under 3 seconds to escape
          </text>
        </g>

        <g opacity={contrastCard2.opacity}
          transform={`translate(560, ${1020 + contrastCard2.translateY})`}>
          <rect x={0} y={0} width={460} height={160} rx={16}
            fill={COLORS.purple} fillOpacity={0.06}
            stroke={COLORS.purple} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={160} rx={3} fill={COLORS.purple} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.cool_silver}>
            DEEP SPACE ABORT
          </text>
          <text x={30} y={80} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={800} fill={COLORS.deep_black}>
            Completely Different
          </text>
          <text x={30} y={120} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            No tower, no quick escape
          </text>
        </g>

        {/* Decorative line between cards */}
        <line x1={540} y1={1030} x2={540} y2={1170}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.1} />

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">DEEP SPACE · NO TOWER · NO ESCAPE POD</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
