/**
 * Scene 11 — Loop Again
 * "Then it runs the loop again from the beginning."
 * Circular loop animation completing and restarting, LoopArrow spinning.
 * Show the 4 steps (perceive/think/act/observe) on the loop perimeter cycling.
 * Duration: 62 frames (2.07s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  LoopArrow,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Four-step labels positioned around the loop ────────────────────────────
const LOOP_STEPS = [
  { label: 'PERCEIVE', color: COLORS.vibrant_green, angle: -90, icon: '👁' },
  { label: 'THINK',    color: COLORS.warm_blue,     angle: 0,   icon: '🧠' },
  { label: 'ACT',      color: COLORS.vibrant_red,   angle: 90,  icon: '⚡' },
  { label: 'OBSERVE',  color: COLORS.amber,         angle: 180, icon: '📡' },
];

// ── Orbit ring scales for pulsing background ───────────────────────────────
const ORBIT_RINGS = [
  { r: 220, width: 2, delay: 0 },
  { r: 260, width: 1.5, delay: 5 },
  { r: 300, width: 1, delay: 10 },
  { r: 340, width: 0.8, delay: 15 },
  { r: 380, width: 0.5, delay: 20 },
];

// ── Cycling particles along the loop perimeter ─────────────────────────────
const CYCLE_PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  baseAngle: (i / 24) * Math.PI * 2,
  r: 3 + (i % 3) * 1.5,
  speed: 0.04 + (i % 5) * 0.008,
  opacity: 0.3 + (i % 4) * 0.15,
  color: LOOP_STEPS[i % 4].color,
}));

// ── Background ambient floating dots ───────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 173.3 + 20) % 1080,
  y: (i * 197.7 + 40) % 1920,
  r: 1 + (i % 3) * 0.8,
  speed: 0.15 + (i % 4) * 0.08,
  phase: i * 0.65,
}));

// ── Progress tick marks around the loop ────────────────────────────────────
const TICK_MARKS = Array.from({ length: 36 }, (_, i) => ({
  angle: (i / 36) * Math.PI * 2 - Math.PI / 2,
  len: i % 3 === 0 ? 14 : 7,
  width: i % 3 === 0 ? 2 : 1,
}));

// ── Radial burst lines for restart moment ──────────────────────────────────
const BURST_LINES = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * Math.PI * 2,
  innerR: 150,
  outerR: 200 + (i % 3) * 20,
  width: 1.5 + (i % 2),
  delay: i * 1.5,
}));

// ── Step connector arcs ────────────────────────────────────────────────────
const CONNECTORS = LOOP_STEPS.map((_, i) => {
  const from = ((LOOP_STEPS[i].angle - 90) * Math.PI) / 180;
  const to = ((LOOP_STEPS[(i + 1) % 4].angle - 90) * Math.PI) / 180;
  return { from, to, color: LOOP_STEPS[i].color };
});

// ── Center constants ───────────────────────────────────────────────────────
const CX = 540;
const CY = 680;
const LOOP_R = 180;

export const Scene11_LoopAgain: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const labelEnter = interpolate(frame, [4, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopProgress = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const restartFlash = interpolate(frame, [42, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const restartFade = interpolate(frame, [50, 58], [1, 0], { extrapolateRight: 'clamp' });
  const captionEnter = interpolate(frame, [3, 16], [0, 1], { extrapolateRight: 'clamp' });
  const titleSlide = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp', easing: ease });
  const stepsEnter = interpolate(frame, [8, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const particleEnter = interpolate(frame, [6, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Rotation for the spinning loop
  const spinAngle = interpolate(frame, [0, 62], [0, 420], { extrapolateRight: 'clamp' });

  // Dash offset for the main loop line drawing
  const mainLoopDash = interpolate(frame, [0, 35], [1130, 0], { extrapolateRight: 'clamp', easing: ease });

  // Highlight cycling step index
  const activeStep = Math.floor(((frame * 2.5) / 62) * 4) % 4;

  // Pulse for restart burst
  const burstScale = interpolate(frame, [42, 55], [0.5, 1.4], { extrapolateRight: 'clamp', easing: ease });
  const burstOp = restartFlash * restartFade;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="loopGlowS11" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" result="blur"/>
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="restartBurstS11" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="20" result="blur"/>
              <feFlood floodColor="#00E5FF" floodOpacity="0.7" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="restartRadS11" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.6"/>
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="loopArcS11" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.electric_cyan}/>
              <stop offset="50%" stopColor={COLORS.warm_blue}/>
              <stop offset="100%" stopColor={COLORS.purple}/>
            </linearGradient>
          </defs>

          {/* ── Background ambient particles ── */}
          {BG_PARTICLES.map((p, i) => {
            const yOff = (frame * p.speed + p.phase * 30) % 1920;
            return (
              <circle key={i}
                cx={p.x} cy={(p.y + yOff) % 1920} r={p.r}
                fill={COLORS.electric_cyan}
                opacity={enter * (0.04 + Math.sin(frame * 0.05 + p.phase) * 0.02)}/>
            );
          })}

          {/* ── Section label ── */}
          <g opacity={enter}>
            <rect x={80} y={60} width={320} height={52} rx={12}
              fill={COLORS.warm_blue} opacity={0.9}/>
            <text x={240} y={94} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={900}
              fill="white" letterSpacing="0.12em">LOOP RESTART</text>
          </g>

          {/* ── Title text ── */}
          <g opacity={labelEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={200} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.03em">
              Run It Again
            </text>
            <text x={540} y={260} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={600}
              fill={COLORS.warm_blue} opacity={0.8}>
              From the Beginning
            </text>
          </g>

          {/* ── Horizontal divider ── */}
          <line x1={200} y1={310} x2={880} y2={310}
            stroke={COLORS.warm_blue} strokeWidth={1.5} opacity={labelEnter * 0.18}/>

          {/* ── Orbit ring backgrounds ── */}
          {ORBIT_RINGS.map((ring, i) => {
            const pulse = Math.sin((frame + ring.delay) * 0.12) * 0.08;
            return (
              <circle key={i}
                cx={CX} cy={CY} r={ring.r}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={ring.width}
                opacity={enter * (0.06 + pulse)}
                strokeDasharray="4 8"/>
            );
          })}

          {/* ── Tick marks around the loop ── */}
          {TICK_MARKS.map((tick, i) => {
            const innerX = CX + Math.cos(tick.angle) * (LOOP_R - 8);
            const innerY = CY + Math.sin(tick.angle) * (LOOP_R - 8);
            const outerX = CX + Math.cos(tick.angle) * (LOOP_R - 8 - tick.len);
            const outerY = CY + Math.sin(tick.angle) * (LOOP_R - 8 - tick.len);
            return (
              <line key={i}
                x1={innerX} y1={innerY} x2={outerX} y2={outerY}
                stroke={COLORS.cool_silver} strokeWidth={tick.width}
                opacity={enter * 0.2}/>
            );
          })}

          {/* ── Main loop circle (drawn progressively) ── */}
          <circle cx={CX} cy={CY} r={LOOP_R}
            fill="none" stroke="url(#loopArcS11)" strokeWidth={6}
            strokeDasharray={1130} strokeDashoffset={mainLoopDash}
            strokeLinecap="round"
            opacity={enter * 0.8}/>

          {/* ── Inner glow ring ── */}
          <circle cx={CX} cy={CY} r={LOOP_R - 15}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}
            opacity={enter * 0.12}/>

          {/* ── Cycling particles along the loop ── */}
          {CYCLE_PARTICLES.map((p) => {
            const currentAngle = p.baseAngle + frame * p.speed;
            const px = CX + Math.cos(currentAngle) * LOOP_R;
            const py = CY + Math.sin(currentAngle) * LOOP_R;
            return (
              <circle key={p.id}
                cx={px} cy={py} r={p.r}
                fill={p.color}
                opacity={particleEnter * p.opacity}/>
            );
          })}

          {/* ── LoopArrow — spinning in center ── */}
          <g transform={`translate(${CX}, ${CY}) rotate(${spinAngle}) translate(${-CX}, ${-CY})`}>
            <LoopArrow cx={CX} cy={CY} r={130}
              color={COLORS.electric_cyan} strokeWidth={4}
              dashOffset={mainLoopDash * 0.3} opacity={enter * 0.6}
              showArrow={true} label=""/>
          </g>

          {/* ── Four step nodes around the perimeter ── */}
          {LOOP_STEPS.map((step, i) => {
            const angleRad = (step.angle * Math.PI) / 180;
            const nodeX = CX + Math.cos(angleRad) * (LOOP_R + 70);
            const nodeY = CY + Math.sin(angleRad) * (LOOP_R + 70);
            const isActive = activeStep === i;
            const nodeScale = isActive ? scaleAnim(frame, 0, 62, 1, 1.15) : 1;
            const nodeOp = stepsEnter * (isActive ? 1 : 0.55);
            const glowR = isActive ? 52 : 40;

            return (
              <g key={step.label} opacity={nodeOp}
                transform={`translate(${nodeX}, ${nodeY}) scale(${nodeScale}) translate(${-nodeX}, ${-nodeY})`}>
                {/* Glow behind active node */}
                {isActive && (
                  <circle cx={nodeX} cy={nodeY} r={glowR + 10}
                    fill={step.color} opacity={0.12}/>
                )}
                {/* Node circle */}
                <circle cx={nodeX} cy={nodeY} r={glowR}
                  fill="#FFFFFF" stroke={step.color}
                  strokeWidth={isActive ? 4 : 2}
                  filter="url(#shadow)"/>
                {/* Icon */}
                <text x={nodeX} y={nodeY - 6} textAnchor="middle" dominantBaseline="middle"
                  fontSize={24}>{step.icon}</text>
                {/* Label */}
                <text x={nodeX} y={nodeY + 24} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={14} fontWeight={800}
                  fill={step.color} letterSpacing="0.08em">
                  {step.label}
                </text>
              </g>
            );
          })}

          {/* ── Connector arcs between steps ── */}
          {CONNECTORS.map((conn, i) => {
            const progress = interpolate(frame, [10 + i * 6, 30 + i * 6], [0, 1], { extrapolateRight: 'clamp' });
            const arcR = LOOP_R + 70;
            const startX = CX + Math.cos(conn.from) * arcR;
            const startY = CY + Math.sin(conn.from) * arcR;
            const endX = CX + Math.cos(conn.to) * arcR;
            const endY = CY + Math.sin(conn.to) * arcR;
            return (
              <line key={i}
                x1={startX} y1={startY} x2={endX} y2={endY}
                stroke={conn.color} strokeWidth={1.5}
                strokeDasharray={`${progress * 100} 200`}
                opacity={stepsEnter * 0.3}/>
            );
          })}

          {/* ── Restart burst effect ── */}
          <g opacity={burstOp}
            transform={`translate(${CX}, ${CY}) scale(${burstScale}) translate(${-CX}, ${-CY})`}>
            {BURST_LINES.map((b, i) => {
              const ix = CX + Math.cos(b.angle) * b.innerR;
              const iy = CY + Math.sin(b.angle) * b.innerR;
              const ox = CX + Math.cos(b.angle) * b.outerR;
              const oy = CY + Math.sin(b.angle) * b.outerR;
              return (
                <line key={i}
                  x1={ix} y1={iy} x2={ox} y2={oy}
                  stroke={COLORS.electric_cyan} strokeWidth={b.width}
                  strokeLinecap="round" filter="url(#restartBurstS11)"/>
              );
            })}
            <circle cx={CX} cy={CY} r={80}
              fill="url(#restartRadS11)" opacity={0.8}/>
          </g>

          {/* ── Center core ── */}
          <circle cx={CX} cy={CY} r={28}
            fill={COLORS.deep_black} stroke={COLORS.electric_cyan}
            strokeWidth={3} opacity={enter * 0.9}/>
          <text x={CX} y={CY + 2} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Inter', sans-serif" fontSize={13} fontWeight={900}
            fill={COLORS.electric_cyan} letterSpacing="0.10em" opacity={enter}>
            LOOP
          </text>

          {/* ── "AGAIN" indicator text ── */}
          <g opacity={restartFlash}>
            <text x={CX} y={CY + 70} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={900}
              fill={COLORS.electric_cyan} letterSpacing="0.2em"
              filter="url(#loopGlowS11)">
              ↻ AGAIN
            </text>
          </g>

          {/* ── Bottom insight panel ── */}
          <g opacity={enter}>
            <rect x={120} y={1060} width={840} height={170} rx={18}
              fill="#FFFFFF" stroke={COLORS.warm_blue} strokeWidth={1.5}
              opacity={0.92} filter="url(#shadow)"/>
            <rect x={120} y={1060} width={6} height={170} rx={3}
              fill={COLORS.warm_blue}/>
            <text x={170} y={1120} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={COLORS.deep_black}>
              The cycle never ends.
            </text>
            <text x={170} y={1165} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
              fill={COLORS.light_gray}>
              Each completion triggers the next iteration.
            </text>
            <text x={170} y={1200} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
              fill={COLORS.light_gray}>
              Perceive → Think → Act → Observe → Repeat ∞
            </text>
          </g>

          {/* ── Decorative progress bar ── */}
          <g opacity={enter * 0.35}>
            <rect x={120} y={1280} width={840} height={8} rx={4}
              fill={COLORS.cool_silver} opacity={0.2}/>
            <rect x={120} y={1280} width={840 * loopProgress} height={8} rx={4}
              fill={COLORS.electric_cyan}/>
          </g>

          {/* ── Frame counter ── */}
          <text x={960} y={1340} textAnchor="end"
            fontFamily="'Courier New', monospace" fontSize={16} fontWeight={600}
            fill={COLORS.light_gray} opacity={enter * 0.3}>
            iteration: {Math.floor(frame / 15) + 1} / ∞
          </text>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="Then it runs the loop again from the beginning."
          opacity={captionEnter}
          highlightWords={['loop again', 'beginning']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
