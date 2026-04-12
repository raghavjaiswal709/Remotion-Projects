/**
 * Scene06 — Launch Abort
 * "press it at launch, and the launch abort system fires instantly,"
 * CSV: 25.600s → 29.040s
 * Duration: 121 frames (4.03s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, headline
 *   Phase 2 (20–80): Content — rocket + LAS tower, fire burst, separation arrows
 *   Phase 3 (70–end): Micro — flame flicker, smoke particles
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

export const Scene06_LaunchAbort: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const rocketEntrance = useSpringEntrance(frame, 16);
  const lasEntrance = useSpringEntrance(frame, 22);
  const fireEntrance = useSpringEntrance(frame, 30);
  const labelCard1 = useSpringEntrance(frame, 40);
  const labelCard2 = useSpringEntrance(frame, 50);

  // Flame path draw
  const flamePath = 300;
  const flameDash = usePathDraw(frame, 30, flamePath, 20);

  // Separation arrow
  const arrowLength = 150;
  const arrowDash = usePathDraw(frame, 35, arrowLength, 20);

  // LAS tower line
  const towerLength = 200;
  const towerDash = usePathDraw(frame, 24, towerLength, 25);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 3;
  const flameFlicker = interpolate(Math.sin(frame * 0.3), [-1, 1], [0.7, 1]);
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const smokeOffset = frame * 0.8;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.orange} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={280} fontWeight={900} fill={COLORS.orange} opacity={0.04}>
          LAS
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="LAUNCH ABORT SYSTEM · LAS" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={900} fill={COLORS.deep_black}>
            Press at Launch
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={455} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={600} fill={COLORS.vibrant_red}>
            System Fires Instantly
          </text>
        </g>

        {/* Zone C — Rocket + LAS illustration */}
        <g opacity={rocketEntrance.opacity}
          transform={`translate(540, ${820 + rocketEntrance.translateY})`}>

          {/* SLS Booster body */}
          <rect x={-40} y={0} width={80} height={300} rx={8}
            fill={COLORS.deep_black} fillOpacity={0.06}
            stroke={COLORS.cool_silver} strokeWidth={2} />
          {/* SLS label */}
          <text x={0} y={160} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={700} fill={COLORS.cool_silver} opacity={0.6}>
            SLS
          </text>

          {/* Side boosters */}
          <rect x={-65} y={60} width={20} height={200} rx={4}
            fill={COLORS.cool_silver} fillOpacity={0.15}
            stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.5} />
          <rect x={45} y={60} width={20} height={200} rx={4}
            fill={COLORS.cool_silver} fillOpacity={0.15}
            stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.5} />

          {/* Nozzle */}
          <path d="M -30,300 L -45,340 L 45,340 L 30,300"
            fill={COLORS.deep_black} fillOpacity={0.08}
            stroke={COLORS.cool_silver} strokeWidth={1.5} />

          {/* Engine flames on SLS */}
          <g opacity={fireEntrance.opacity * flameFlicker}>
            <path d="M -30,340 Q -40,380 0,420 Q 40,380 30,340"
              fill={COLORS.orange} fillOpacity={0.15} />
            <path d="M -20,340 Q -25,370 0,400 Q 25,370 20,340"
              fill={COLORS.vibrant_red} fillOpacity={0.2} />
          </g>
        </g>

        {/* Orion capsule (above SLS, being pulled away) */}
        <g opacity={lasEntrance.opacity}
          transform={`translate(540, ${680 + lasEntrance.translateY - (frame > 35 ? Math.min(80, (frame - 35) * 3) : 0)})`}>
          {/* Capsule body */}
          <path d="M -35,0 L -50,60 L 50,60 L 35,0 Z"
            fill={COLORS.sky_blue} fillOpacity={0.1}
            stroke={COLORS.sky_blue} strokeWidth={2.5} />
          {/* Heat shield bottom */}
          <rect x={-50} y={58} width={100} height={8} rx={4}
            fill={COLORS.sky_blue} fillOpacity={0.3} />
          {/* Window */}
          <rect x={-12} y={15} width={24} height={16} rx={4}
            fill={COLORS.sky_blue} fillOpacity={0.2}
            stroke={COLORS.sky_blue} strokeWidth={1} />

          {/* LAS Tower on top of capsule */}
          <line x1={0} y1={0} x2={0} y2={-120}
            stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={towerLength} strokeDashoffset={towerDash}
            strokeLinecap="round" />
          {/* LAS nozzles */}
          <path d="M -15,-120 L 0,-135 L 15,-120"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
            opacity={lasEntrance.opacity} />

          {/* LAS fire (pulling capsule up) */}
          <g opacity={fireEntrance.opacity * flameFlicker}>
            <path d="M -10,-135 Q -15,-170 0,-190 Q 15,-170 10,-135"
              fill={COLORS.vibrant_red} fillOpacity={0.2}
              strokeDasharray={flamePath} strokeDashoffset={flameDash} />
            <path d="M -6,-135 Q -8,-160 0,-175 Q 8,-160 6,-135"
              fill={COLORS.orange} fillOpacity={0.3} />
          </g>

          {/* Orion label */}
          <text x={80} y={35} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={700} fill={COLORS.sky_blue}>
            ORION
          </text>
        </g>

        {/* Separation arrows */}
        <g opacity={fireEntrance.opacity}>
          {/* Upward arrow for capsule */}
          <line x1={440} y1={720} x2={440} y2={600}
            stroke={COLORS.green} strokeWidth={2.5}
            strokeDasharray={arrowLength} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={400} y={590} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.green} opacity={0.7}>
            ESCAPE
          </text>
        </g>

        {/* Smoke particles */}
        {Array.from({ length: 12 }, (_, i) => {
          const x = 540 + Math.sin(i * 1.5 + smokeOffset) * (40 + i * 8);
          const y = 1020 + i * 15 + Math.cos(i * 2 + smokeOffset) * 10;
          return (
            <circle key={i} cx={x} cy={y} r={3 + i * 0.5}
              fill={COLORS.cool_silver} opacity={0.08 * shimmer} />
          );
        })}

        {/* Info cards */}
        <g opacity={labelCard1.opacity}
          transform={`translate(60, ${1150 + labelCard1.translateY})`}>
          <rect x={0} y={0} width={440} height={100} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.06}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.vibrant_red} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            Launch Abort System
          </text>
          <text x={30} y={72} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Solid rocket tower fires
          </text>
        </g>

        <g opacity={labelCard2.opacity}
          transform={`translate(540, ${1150 + labelCard2.translateY})`}>
          <rect x={0} y={0} width={480} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.orange} />
          <text x={30} y={40} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            Capsule Pulled Clear
          </text>
          <text x={30} y={72} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Away from SLS booster
          </text>
        </g>

        {/* Decorative danger stripes */}
        <g opacity={0.15 * shimmer}>
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={60 + i * 96} y={1290}
              width={48} height={6} rx={3}
              fill={i % 2 === 0 ? COLORS.vibrant_red : COLORS.amber} />
          ))}
        </g>

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">LAS · LAUNCH ABORT · T+0 TO T+120</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
