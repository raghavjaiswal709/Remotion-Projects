/**
 * Scene02 — One Button
 * "One button, four astronauts, zero second chances."
 * CSV: 0.000s → 3.880s
 * Duration: 134 frames (4.47s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Scene reveal — label + headline spring up
 *   Phase 2 (20–90): Content build — abort button SVG, stat counters, cards
 *   Phase 3 (80–end): Micro-animations — button pulse, ring breathe
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

export const Scene02_OneButton: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (0–30) ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ──
  const buttonReveal = useSpringEntrance(frame, 18);
  const stat1 = useSpringEntrance(frame, 28);
  const stat2 = useSpringEntrance(frame, 38);
  const stat3 = useSpringEntrance(frame, 48);

  // Button ring draw
  const ringCircumference = 2 * Math.PI * 120;
  const ringDash = usePathDraw(frame, 22, ringCircumference, 35);

  // Counters
  const counterOne = useCounter(frame, 30, 1, 25);
  const counterFour = useCounter(frame, 40, 4, 25);
  const counterZero = useCounter(frame, 50, 0, 1);

  // Outer ring path draw
  const outerRingCirc = 2 * Math.PI * 160;
  const outerRingDash = usePathDraw(frame, 30, outerRingCirc, 40);

  // ── Phase 3: Micro-animations ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const buttonGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.6, 1]);

  // Warning tick marks around button
  const tickRotation = interpolate(frame, [0, 134], [0, 15], { extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.vibrant_red} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={360} fontWeight={900} fill={COLORS.vibrant_red} opacity={0.04}>
          1
        </text>

        {/* Zone A — Section label */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ARTEMIS II · THE ABORT BUTTON" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Headlines */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={80} fontWeight={900} fill={COLORS.deep_black}>
            One Button
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={460} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={500} fill={COLORS.vibrant_red}>
            Zero Second Chances
          </text>
        </g>

        {/* Zone C — Abort button illustration */}
        <g opacity={buttonReveal.opacity}
          transform={`translate(540, ${700 + buttonReveal.translateY + breathe})`}>
          {/* Outer warning ring */}
          <circle cx={0} cy={0} r={160} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeOpacity={0.2 * shimmer}
            strokeDasharray={outerRingCirc} strokeDashoffset={outerRingDash} />

          {/* Main button ring */}
          <circle cx={0} cy={0} r={120} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={6}
            strokeDasharray={ringCircumference} strokeDashoffset={ringDash}
            strokeLinecap="round" />

          {/* Button inner fill */}
          <circle cx={0} cy={0} r={100}
            fill={COLORS.vibrant_red} fillOpacity={0.08 * buttonGlow}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />

          {/* Button center */}
          <circle cx={0} cy={0} r={60}
            fill={COLORS.vibrant_red} fillOpacity={0.15 * buttonGlow} />
          <circle cx={0} cy={0} r={40}
            fill={COLORS.vibrant_red} fillOpacity={0.3 * buttonGlow} />

          {/* ABORT text on button */}
          <text x={0} y={12} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={900} fill={COLORS.vibrant_red}
            letterSpacing="0.15em" opacity={buttonReveal.opacity}>
            ABORT
          </text>

          {/* Warning tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 + tickRotation) * (Math.PI / 180);
            const x1 = Math.cos(angle) * 135;
            const y1 = Math.sin(angle) * 135;
            const x2 = Math.cos(angle) * 148;
            const y2 = Math.sin(angle) * 148;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS.vibrant_red} strokeWidth={2}
                opacity={0.3 * shimmer} strokeLinecap="round" />
            );
          })}
        </g>

        {/* Stat cards — three columns */}
        {/* Stat 1: ONE button */}
        <g opacity={stat1.opacity} transform={`translate(60, ${920 + stat1.translateY})`}>
          <rect x={0} y={0} width={290} height={200} rx={16}
            fill={COLORS.vibrant_red} fillOpacity={0.06}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={145} y={100} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900} fill={COLORS.vibrant_red}>
            {counterOne}
          </text>
          <text x={145} y={150} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={600} fill={COLORS.cool_silver}>
            BUTTON
          </text>
        </g>

        {/* Stat 2: FOUR astronauts */}
        <g opacity={stat2.opacity} transform={`translate(385, ${920 + stat2.translateY})`}>
          <rect x={0} y={0} width={290} height={200} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <text x={145} y={100} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900} fill={COLORS.sky_blue}>
            {counterFour}
          </text>
          <text x={145} y={150} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={600} fill={COLORS.cool_silver}>
            ASTRONAUTS
          </text>
        </g>

        {/* Stat 3: ZERO second chances */}
        <g opacity={stat3.opacity} transform={`translate(710, ${920 + stat3.translateY})`}>
          <rect x={0} y={0} width={290} height={200} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.04}
            stroke={COLORS.deep_black} strokeWidth={2} strokeOpacity={0.3} />
          <text x={145} y={100} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900} fill={COLORS.deep_black}>
            {counterZero}
          </text>
          <text x={145} y={150} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={600} fill={COLORS.cool_silver}>
            CHANCES
          </text>
        </g>

        {/* Bottom accent — caution stripe pattern */}
        {Array.from({ length: 24 }, (_, i) => {
          const stripeEnter = useSpringEntrance(frame, 60 + i * 2);
          return (
            <rect key={i}
              x={60 + i * 40} y={1200}
              width={20} height={6} rx={3}
              fill={i % 2 === 0 ? COLORS.vibrant_red : COLORS.amber}
              opacity={stripeEnter.opacity * 0.3}
              transform={`translate(0, ${stripeEnter.translateY * 0.5})`}
            />
          );
        })}

        {/* Small label under caution stripe */}
        <g opacity={interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <text x={540} y={1260} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500} fill={COLORS.cool_silver}
            letterSpacing="0.2em">
            MISSION CRITICAL
          </text>
        </g>

        {/* Decorative cross-hairs around button area */}
        <g opacity={buttonReveal.opacity * 0.2}>
          {/* Horizontal crosshair */}
          <line x1={340} y1={700} x2={420} y2={700}
            stroke={COLORS.vibrant_red} strokeWidth={1} />
          <line x1={660} y1={700} x2={740} y2={700}
            stroke={COLORS.vibrant_red} strokeWidth={1} />
          {/* Vertical crosshair */}
          <line x1={540} y1={500} x2={540} y2={560}
            stroke={COLORS.vibrant_red} strokeWidth={1} />
          <line x1={540} y1={840} x2={540} y2={900}
            stroke={COLORS.vibrant_red} strokeWidth={1} />
        </g>

        {/* Corner brackets */}
        <g opacity={buttonReveal.opacity * 0.15}>
          <path d="M 370,540 L 370,570 L 400,570" fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <path d="M 710,540 L 710,570 L 680,570" fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <path d="M 370,860 L 370,830 L 400,830" fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <path d="M 710,860 L 710,830 L 680,830" fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5} />
        </g>

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">ONE BUTTON · LIFE OR DEATH</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s02.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
