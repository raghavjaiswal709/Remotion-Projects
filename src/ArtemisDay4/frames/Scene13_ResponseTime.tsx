/**
 * Scene13 — Response Time
 * "Every second of response time was calculated in advance."
 * CSV: 66.140s → 69.160s
 * Duration: 109 frames (3.63s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label, headline
 *   Phase 2 (20–80): Content — clock dial, time counter, calculation grid
 *   Phase 3 (70–end): Micro — clock hand sweep, pulse, shimmer
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene13_ResponseTime: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // Phase 2
  const clockBody = useSpringEntrance(frame, 16);
  const dialDraw = usePathDraw(frame, 18, 600, 40);
  const handEntrance = useSpringEntrance(frame, 30);
  const card1 = useSpringEntrance(frame, 40);
  const card2 = useSpringEntrance(frame, 52);
  const card3 = useSpringEntrance(frame, 64);

  // Clock hand rotation
  const handAngle = interpolate(frame, [30, 90], [0, 270], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Millisecond counter
  const msCounter = useCounter(frame, 25, 999, 50);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const tickBlink = Math.floor(frame * 0.15) % 2 === 0 ? 1 : 0.6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  const CX = 540;
  const CY = 740;
  const R = 170;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.green} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={240} fontWeight={900} fill={COLORS.green} opacity={0.04}>
          0.3s
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ABORT SYSTEMS · PRECISION" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={900} fill={COLORS.deep_black}>
            Every Second
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={450} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={40} fontWeight={600} fill={COLORS.sky_blue}>
            Calculated in Advance
          </text>
        </g>

        {/* Zone C — Clock illustration */}
        <g opacity={clockBody.opacity}>
          {/* Outer ring */}
          <circle cx={CX} cy={CY} r={R}
            fill="none" stroke={COLORS.deep_black} strokeWidth={3}
            strokeDasharray={600} strokeDashoffset={dialDraw}
            opacity={0.8} />
          {/* Inner ring */}
          <circle cx={CX} cy={CY} r={R - 15}
            fill={COLORS.sky_blue} fillOpacity={0.03}
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.3} />

          {/* Tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = CX + Math.cos(angle) * (R - 8);
            const y1 = CY + Math.sin(angle) * (R - 8);
            const x2 = CX + Math.cos(angle) * (R - 22);
            const y2 = CY + Math.sin(angle) * (R - 22);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS.deep_black} strokeWidth={i % 3 === 0 ? 3 : 1.5}
                opacity={0.6} strokeLinecap="round" />
            );
          })}

          {/* Minor ticks */}
          {Array.from({ length: 60 }, (_, i) => {
            if (i % 5 === 0) return null;
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const x1 = CX + Math.cos(angle) * (R - 8);
            const y1 = CY + Math.sin(angle) * (R - 8);
            const x2 = CX + Math.cos(angle) * (R - 14);
            const y2 = CY + Math.sin(angle) * (R - 14);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS.cool_silver} strokeWidth={0.8}
                opacity={0.4} strokeLinecap="round" />
            );
          })}

          {/* Center dot */}
          <circle cx={CX} cy={CY} r={8}
            fill={COLORS.sky_blue}
            style={{ transform: `scale(${pulse})`, transformOrigin: `${CX}px ${CY}px` }} />
        </g>

        {/* Animated hand */}
        <g opacity={handEntrance.opacity}>
          <line
            x1={CX} y1={CY}
            x2={CX + Math.cos((handAngle - 90) * Math.PI / 180) * (R - 40)}
            y2={CY + Math.sin((handAngle - 90) * Math.PI / 180) * (R - 40)}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Millisecond readout below clock */}
        <g opacity={clockBody.opacity} transform={`translate(0, ${breathe * 0.5})`}>
          <rect x={CX - 120} y={CY + R + 30} width={240} height={70} rx={10}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <text x={CX} y={CY + R + 76} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={36} fontWeight={700} fill={COLORS.sky_blue}
            opacity={tickBlink}>
            00:{String(msCounter).padStart(3, '0')}
          </text>
        </g>

        {/* Info cards */}
        <g opacity={card1.opacity}
          transform={`translate(60, ${1120 + card1.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.05}
            stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.orange} />
          <text x={30} y={42} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            EVERY DELAY MAPPED
          </text>
          <text x={30} y={76} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Ignition to Separation Timing
          </text>
        </g>

        <g opacity={card2.opacity}
          transform={`translate(60, ${1240 + card2.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.05}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={42} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            SEQUENCED RESPONSE
          </text>
          <text x={30} y={76} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Pre-Computed Abort Windows
          </text>
        </g>

        <g opacity={card3.opacity}
          transform={`translate(60, ${1360 + card3.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={12}
            fill={COLORS.green} fillOpacity={0.05}
            stroke={COLORS.green} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.green} />
          <text x={30} y={42} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            ZERO IMPROVISATION
          </text>
          <text x={30} y={76} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Calculated, Not Reactive
          </text>
        </g>

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">MILLISECONDS · AUTOMATED · ZERO MARGIN</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
