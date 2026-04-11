/**
 * Scene 11 — Connects to the World
 * "Actions are how intelligence connects to the world."
 * A glowing bridge from an AI brain on the left to a WorldGlobe on the right.
 * Energy flows across the bridge, particles stream through it.
 * Duration: 86 frames (~2.87s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  AIRobot, WorldGlobe, SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout ───────────────────────────────────────────────────────────────
const BRAIN_CX = 270;
const BRAIN_CY = 720;
const GLOBE_CX = 810;
const GLOBE_CY = 720;
const BRIDGE_Y = 720;

// ── Bridge pillars ───────────────────────────────────────────────────────
const BRIDGE_START_X = 370;
const BRIDGE_END_X = 710;
const BRIDGE_SEGMENTS = 20;
const BRIDGE_HALF_H = 35;

// ── Energy particles flowing across bridge ───────────────────────────────
interface EnergyParticle {
  id: number;
  delay: number;
  yOff: number;
  size: number;
  speed: number;
  color: string;
}

const ENERGY_PARTICLES: EnergyParticle[] = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: 20 + i * 3,
  yOff: ((i * 7 + 3) % 50) - 25,
  size: 3 + (i % 4) * 1.5,
  speed: 0.6 + (i % 5) * 0.15,
  color: [COLORS.electric_cyan, COLORS.warm_blue, COLORS.vibrant_green,
          COLORS.electric_cyan, COLORS.purple][i % 5],
}));

// ── Background connection lines (decorative) ─────────────────────────────
const CONNECTION_LINES = Array.from({ length: 8 }, (_, i) => ({
  x1: BRAIN_CX + 60 + (i % 3) * 15,
  y1: BRAIN_CY + ((i * 23 + 7) % 100) - 50,
  x2: GLOBE_CX - 60 - (i % 3) * 15,
  y2: GLOBE_CY + ((i * 31 + 11) % 100) - 50,
  delay: 15 + i * 5,
  dashArray: `${4 + (i % 3) * 2} ${6 + (i % 4) * 2}`,
}));

// ── Glow rings around brain and globe ────────────────────────────────────
const GLOW_RINGS = Array.from({ length: 4 }, (_, i) => ({
  r: 85 + i * 18,
  delay: 5 + i * 6,
  strokeW: 1.5 - i * 0.3,
}));

// ── Floating ambient particles ───────────────────────────────────────────
const AMBIENT_PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  x: (i * 157.3 + 40) % 1080,
  y: (i * 211.7 + 60) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: i * 0.41,
}));

// ── Bridge cable arcs ────────────────────────────────────────────────────
const CABLE_ARCS = Array.from({ length: 3 }, (_, i) => ({
  yOffset: -8 - i * 14,
  strokeW: 2 - i * 0.4,
  opacity: 0.6 - i * 0.15,
}));

// ── Spark bursts at connection points ────────────────────────────────────
const SPARK_COUNT = 6;
const SPARK_R = 12;

// ── Labels for brain and globe sides ─────────────────────────────────────
const SIDE_LABELS = [
  { x: BRAIN_CX, y: 560, text: 'INTELLIGENCE', color: COLORS.warm_blue },
  { x: GLOBE_CX, y: 560, text: 'THE WORLD', color: COLORS.vibrant_green },
];

// ── Action word tags flowing across ──────────────────────────────────────
const ACTION_TAGS = [
  { label: 'CALL API', delay: 25, yOff: -45 },
  { label: 'WRITE FILE', delay: 35, yOff: -15 },
  { label: 'SEND MSG', delay: 45, yOff: 15 },
  { label: 'RUN QUERY', delay: 55, yOff: 45 },
];

export const Scene11_ConnectsWorld: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ─────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const brainScale = scaleAnim(frame, 0, 20, 0.4, 1);
  const globeScale = scaleAnim(frame, 5, 25, 0.4, 1);
  const bridgeDraw = interpolate(frame, [12, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const glowPulse = 0.5 + Math.sin(frame * 0.1) * 0.2;
  const captionOp = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });

  // ── Bridge path ────────────────────────────────────────────────────────
  const bridgeWidth = BRIDGE_END_X - BRIDGE_START_X;
  const drawnWidth = bridgeWidth * bridgeDraw;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="bridgeGlow11">
              <feGaussianBlur stdDeviation="10" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="sideGlow11">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="bridgeGrad11" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.warm_blue} />
              <stop offset="50%" stopColor={COLORS.electric_cyan} />
              <stop offset="100%" stopColor={COLORS.vibrant_green} />
            </linearGradient>
            <radialGradient id="brainAura11" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity="0.15" />
              <stop offset="100%" stopColor={COLORS.warm_blue} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="globeAura11" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.vibrant_green} stopOpacity="0.15" />
              <stop offset="100%" stopColor={COLORS.vibrant_green} stopOpacity="0" />
            </radialGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Ambient particles ── */}
          {AMBIENT_PARTICLES.map((p, i) => {
            const pulse = Math.sin(frame * 0.03 + p.phase) * 0.25 + 0.3;
            return (
              <circle key={`ap${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.electric_cyan} opacity={enter * pulse * 0.05} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={540} y={180} text="CONNECTING INTELLIGENCE" fontSize={26}
            color={COLORS.electric_cyan} opacity={enter * 0.8}
            underlineColor={COLORS.electric_cyan} />

          <text x={540} y={228} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={17} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.5}>
            To the world through actions
          </text>

          {/* ── Auras ── */}
          <circle cx={BRAIN_CX} cy={BRAIN_CY} r={130}
            fill="url(#brainAura11)" opacity={enter * glowPulse} />
          <circle cx={GLOBE_CX} cy={GLOBE_CY} r={130}
            fill="url(#globeAura11)" opacity={enter * glowPulse} />

          {/* ── Glow rings around brain ── */}
          {GLOW_RINGS.map((gr, i) => {
            const grOp = interpolate(frame, [gr.delay, gr.delay + 15], [0, 0.12], { extrapolateRight: 'clamp' });
            return (
              <circle key={`gbr${i}`} cx={BRAIN_CX} cy={BRAIN_CY} r={gr.r}
                fill="none" stroke={COLORS.warm_blue} strokeWidth={gr.strokeW}
                opacity={grOp * glowPulse} strokeDasharray="4 8" />
            );
          })}

          {/* ── Glow rings around globe ── */}
          {GLOW_RINGS.map((gr, i) => {
            const grOp = interpolate(frame, [gr.delay + 5, gr.delay + 20], [0, 0.12], { extrapolateRight: 'clamp' });
            return (
              <circle key={`ggr${i}`} cx={GLOBE_CX} cy={GLOBE_CY} r={gr.r}
                fill="none" stroke={COLORS.vibrant_green} strokeWidth={gr.strokeW}
                opacity={grOp * glowPulse} strokeDasharray="4 8" />
            );
          })}

          {/* ── Side labels ── */}
          {SIDE_LABELS.map((sl, i) => (
            <text key={`sl${i}`} x={sl.x} y={sl.y} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={700} letterSpacing={3}
              fill={sl.color} opacity={enter * 0.7}>
              {sl.text}
            </text>
          ))}

          {/* ── AI Brain (left side) ── */}
          <g transform={`translate(${BRAIN_CX}, ${BRAIN_CY}) scale(${brainScale * 0.65})`}
            opacity={interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' })}>
            <AIRobot cx={0} cy={0} scale={1} />
          </g>

          {/* ── World Globe (right side) ── */}
          <g transform={`translate(${GLOBE_CX}, ${GLOBE_CY}) scale(${globeScale * 0.65})`}
            opacity={interpolate(frame, [5, 23], [0, 1], { extrapolateRight: 'clamp' })}>
            <WorldGlobe cx={0} cy={0} scale={1} />
          </g>

          {/* ── Bridge structure ── */}
          <g opacity={bridgeDraw}>
            {/* Bridge beam */}
            <rect x={BRIDGE_START_X} y={BRIDGE_Y - 4}
              width={drawnWidth} height={8} rx={4}
              fill="url(#bridgeGrad11)" opacity={0.8}
              filter="url(#bridgeGlow11)" />

            {/* Bridge segments (vertical supports) */}
            {Array.from({ length: BRIDGE_SEGMENTS }, (_, i) => {
              const segX = BRIDGE_START_X + (i / (BRIDGE_SEGMENTS - 1)) * bridgeWidth;
              const segProgress = segX <= BRIDGE_START_X + drawnWidth ? 1 : 0;
              return segProgress > 0 ? (
                <g key={`bs${i}`} opacity={0.4 * bridgeDraw}>
                  <line x1={segX} y1={BRIDGE_Y - BRIDGE_HALF_H}
                    x2={segX} y2={BRIDGE_Y + BRIDGE_HALF_H}
                    stroke={COLORS.electric_cyan} strokeWidth={1} opacity={0.3} />
                </g>
              ) : null;
            })}

            {/* Cable arcs */}
            {CABLE_ARCS.map((ca, i) => {
              const midX = (BRIDGE_START_X + BRIDGE_START_X + drawnWidth) / 2;
              const arcY = BRIDGE_Y + ca.yOffset;
              return (
                <path key={`ca${i}`}
                  d={`M${BRIDGE_START_X},${BRIDGE_Y} Q${midX},${arcY} ${BRIDGE_START_X + drawnWidth},${BRIDGE_Y}`}
                  fill="none" stroke={COLORS.electric_cyan} strokeWidth={ca.strokeW}
                  opacity={ca.opacity * bridgeDraw} strokeDasharray="6 4" />
              );
            })}
          </g>

          {/* ── Background connection lines ── */}
          {CONNECTION_LINES.map((cl, i) => {
            const clOp = interpolate(frame, [cl.delay, cl.delay + 20], [0, 0.1], { extrapolateRight: 'clamp' });
            return (
              <line key={`cl${i}`} x1={cl.x1} y1={cl.y1} x2={cl.x2} y2={cl.y2}
                stroke={COLORS.electric_cyan} strokeWidth={0.8}
                strokeDasharray={cl.dashArray} opacity={clOp} />
            );
          })}

          {/* ── Energy particles flowing across bridge ── */}
          {ENERGY_PARTICLES.map((ep) => {
            const epProgress = interpolate(frame,
              [ep.delay, ep.delay + Math.round(40 / ep.speed)],
              [0, 1], { extrapolateRight: 'clamp' });
            const epX = BRIDGE_START_X + epProgress * bridgeWidth;
            const epY = BRIDGE_Y + ep.yOff + Math.sin(epProgress * Math.PI * 3) * 8;
            const epOp = interpolate(epProgress, [0, 0.1, 0.9, 1], [0, 0.8, 0.8, 0], { extrapolateRight: 'clamp' });
            return epX <= BRIDGE_START_X + drawnWidth ? (
              <g key={`ep${ep.id}`}>
                <circle cx={epX} cy={epY} r={ep.size}
                  fill={ep.color} opacity={epOp * 0.7}
                  filter="url(#sideGlow11)" />
                {/* Trail */}
                <circle cx={epX - 6} cy={epY} r={ep.size * 0.5}
                  fill={ep.color} opacity={epOp * 0.3} />
              </g>
            ) : null;
          })}

          {/* ── Action tags flowing across bridge ── */}
          {ACTION_TAGS.map((at, i) => {
            const atProgress = interpolate(frame,
              [at.delay, at.delay + 30], [0, 1], { extrapolateRight: 'clamp' });
            const atX = BRIDGE_START_X + atProgress * bridgeWidth;
            const atY = BRIDGE_Y + at.yOff;
            const atOp = interpolate(atProgress, [0, 0.15, 0.85, 1], [0, 0.85, 0.85, 0], { extrapolateRight: 'clamp' });
            return atX <= BRIDGE_START_X + drawnWidth ? (
              <g key={`at${i}`} transform={`translate(${atX}, ${atY})`} opacity={atOp}>
                <rect x={-40} y={-11} width={80} height={22} rx={11}
                  fill={COLORS.deep_black} stroke={COLORS.electric_cyan}
                  strokeWidth={1} opacity={0.85} />
                <text x={0} y={4} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={9} fontWeight={600} letterSpacing={1}
                  fill={COLORS.electric_cyan}>
                  {at.label}
                </text>
              </g>
            ) : null;
          })}

          {/* ── Spark bursts at connection points ── */}
          {[BRIDGE_START_X, BRIDGE_START_X + drawnWidth].map((sx, si) => {
            const sparkOp = bridgeDraw > 0.3 ? glowPulse * 0.5 : 0;
            return (
              <g key={`spark${si}`} opacity={sparkOp}>
                {Array.from({ length: SPARK_COUNT }, (_, j) => {
                  const sAngle = (j / SPARK_COUNT) * Math.PI * 2 + frame * 0.15;
                  const sRad = SPARK_R + Math.sin(frame * 0.2 + j) * 4;
                  return (
                    <circle key={`s${si}_${j}`}
                      cx={sx + Math.cos(sAngle) * sRad}
                      cy={BRIDGE_Y + Math.sin(sAngle) * sRad}
                      r={2} fill={COLORS.electric_cyan} opacity={0.5} />
                  );
                })}
              </g>
            );
          })}

          {/* ── Arrow indicator ── */}
          <g opacity={interpolate(frame, [35, 50], [0, 0.7], { extrapolateRight: 'clamp' })}>
            <text x={540} y={BRIDGE_Y + 75} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={20} fontWeight={600} letterSpacing={4}
              fill={COLORS.electric_cyan} opacity={0.6}
              filter="url(#sideGlow11)">
              ← ACTIONS →
            </text>
          </g>

          {/* ── Bottom text ── */}
          <g opacity={interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' })}>
            <text x={540} y={1050} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={600} fill={COLORS.cool_silver} opacity={0.65}>
              The bridge between thinking and doing
            </text>
            <text x={540} y={1090} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={400} fill="#9CA3AF" opacity={0.4}>
              Intelligence needs actions to matter
            </text>
          </g>

          {/* ── Separator ── */}
          <line x1={300} y1={1150} x2={780} y2={1150}
            stroke={COLORS.electric_cyan} strokeWidth={0.5} opacity={enter * 0.08} />

          {/* ── Caption ── */}
          <CaptionBar
            text="Actions are how intelligence connects to the world."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
