/**
 * Scene05 — Abort Button Significance
 * "The abort button is the most consequential single action any Artemis II crew member can take,"
 * CSV: 19.280s → 25.120s
 * Duration: 193 frames (6.43s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — label + headline spring
 *   Phase 2 (20–100): Content build — large button, consequence cards, connector paths
 *   Phase 3 (90–end): Micro-animations — pulsing ring, floating particles
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

export const Scene05_AbortButton: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const buttonEntrance = useSpringEntrance(frame, 18);
  const card1 = useSpringEntrance(frame, 40);
  const card2 = useSpringEntrance(frame, 52);
  const card3 = useSpringEntrance(frame, 64);

  // Button ring
  const ringCirc = 2 * Math.PI * 100;
  const ringDash = usePathDraw(frame, 20, ringCirc, 35);

  // Outer warning ring
  const outerCirc = 2 * Math.PI * 140;
  const outerDash = usePathDraw(frame, 25, outerCirc, 40);

  // Connector paths from button to cards
  const conn1Length = 250;
  const conn1Dash = usePathDraw(frame, 50, conn1Length, 25);
  const conn2Length = 200;
  const conn2Dash = usePathDraw(frame, 58, conn2Length, 25);
  const conn3Length = 250;
  const conn3Dash = usePathDraw(frame, 66, conn3Length, 25);

  // Hand illustration entrance
  const handEntrance = useSpringEntrance(frame, 30);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const warningFlash = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.3, 0.8]);

  // Floating warning particles
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + frame * 0.02;
    const radius = 170 + Math.sin(frame * 0.03 + i) * 20;
    return {
      cx: Math.cos(angle) * radius,
      cy: Math.sin(angle) * radius,
      r: 2 + Math.sin(frame * 0.05 + i * 2) * 1,
    };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} color={COLORS.vibrant_red} />

        {/* Ghost watermark */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={220} fontWeight={900} fill={COLORS.vibrant_red} opacity={0.04}>
          ABORT
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MISSION CONTROL · ABORT SYSTEMS" y={260} opacity={0.55} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={370} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={900} fill={COLORS.deep_black}>
            Most Consequential
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={440} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={48} fontWeight={700} fill={COLORS.vibrant_red}>
            Single Action
          </text>
        </g>

        {/* Zone C — Large abort button */}
        <g opacity={buttonEntrance.opacity}
          transform={`translate(540, ${650 + buttonEntrance.translateY + breathe})`}>
          {/* Outer warning ring */}
          <circle cx={0} cy={0} r={140} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={outerCirc} strokeDashoffset={outerDash}
            opacity={warningFlash} />

          {/* Main button ring */}
          <circle cx={0} cy={0} r={100} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={5}
            strokeDasharray={ringCirc} strokeDashoffset={ringDash}
            strokeLinecap="round" />

          {/* Button fill */}
          <circle cx={0} cy={0} r={80}
            fill={COLORS.vibrant_red} fillOpacity={0.1 * pulse}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />

          {/* Inner circle */}
          <circle cx={0} cy={0} r={50}
            fill={COLORS.vibrant_red} fillOpacity={0.2 * shimmer} />

          {/* ABORT text */}
          <text x={0} y={10} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={900} fill={COLORS.vibrant_red}
            letterSpacing="0.2em">
            ABORT
          </text>

          {/* Hand reaching for button */}
          <g opacity={handEntrance.opacity}
            transform={`translate(${-180 + handEntrance.translateY * 2}, 20)`}>
            {/* Arm/hand silhouette */}
            <path d="M -60,0 L -20,-10 L 0,-15 L 15,-12 L 25,-8 L 30,0 L 25,8 L 15,12 L 0,15 L -20,10 Z"
              fill={COLORS.deep_black} fillOpacity={0.15} />
            {/* Finger pointing */}
            <path d="M 30,0 L 60,-2 L 70,0 L 60,2 Z"
              fill={COLORS.deep_black} fillOpacity={0.2} />
          </g>

          {/* Floating particles */}
          {particles.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r}
              fill={COLORS.vibrant_red} opacity={0.3 * shimmer} />
          ))}
        </g>

        {/* Consequence cards */}
        {/* Card 1: Left — Instant response */}
        <g opacity={card1.opacity}
          transform={`translate(60, ${900 + card1.translateY})`}>
          <rect x={0} y={0} width={440} height={140} rx={16}
            fill={COLORS.vibrant_red} fillOpacity={0.06}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.vibrant_red} />
          <text x={30} y={50} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Instant Response
          </text>
          <text x={30} y={90} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            No delay, no override
          </text>
          <text x={30} y={120} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver} opacity={0.6}>
            Fires immediately on press
          </text>
        </g>

        {/* Card 2: Right — Mission abort */}
        <g opacity={card2.opacity}
          transform={`translate(580, ${900 + card2.translateY})`}>
          <rect x={0} y={0} width={440} height={140} rx={16}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.orange} />
          <text x={30} y={50} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Mission Abort
          </text>
          <text x={30} y={90} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Entire trajectory shifts
          </text>
          <text x={30} y={120} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver} opacity={0.6}>
            No returning to plan
          </text>
        </g>

        {/* Card 3: Full width — Crew survival */}
        <g opacity={card3.opacity}
          transform={`translate(60, ${1080 + card3.translateY})`}>
          <rect x={0} y={0} width={960} height={120} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={50} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.deep_black}>
            Crew Survival Priority
          </text>
          <text x={30} y={90} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Every system exists to bring the crew home alive
          </text>
        </g>

        {/* Connectors from button to cards */}
        <path d="M 440,700 Q 350,800 280,900"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
          strokeDasharray={conn1Length} strokeDashoffset={conn1Dash}
          opacity={0.3} strokeLinecap="round" />
        <path d="M 640,700 Q 720,800 800,900"
          fill="none" stroke={COLORS.orange} strokeWidth={1.5}
          strokeDasharray={conn2Length} strokeDashoffset={conn2Dash}
          opacity={0.3} strokeLinecap="round" />
        <path d="M 540,780 L 540,1080"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5}
          strokeDasharray={conn3Length} strokeDashoffset={conn3Dash}
          opacity={0.3} strokeLinecap="round" />

        {/* Warning stripes at bottom */}
        <g opacity={interpolate(frame, [80, 100], [0, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          {Array.from({ length: 20 }, (_, i) => (
            <rect key={i} x={60 + i * 48} y={1250}
              width={24} height={4} rx={2}
              fill={i % 2 === 0 ? COLORS.vibrant_red : COLORS.amber}
              opacity={0.4 * shimmer} />
          ))}
        </g>

        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif"
          fontSize={18} fontWeight={500} fill={COLORS.cool_silver} opacity={0.45}
          letterSpacing="0.22em">ABORT · 4 SECONDS · LIFE OR DEATH</text>

        {/* Caption */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
