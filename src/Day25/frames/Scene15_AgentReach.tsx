/**
 * Scene 15 — Agent Reach
 * "The action set defines the agent's reach."
 * Radar/reach circle expanding based on number of actions.
 * Range visualization with concentric rings.
 * Duration: 78 frames (~2.6s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  AIRobot, SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout ───────────────────────────────────────────────────────────────
const CX = 540;
const CY = 720;
const MAX_R = 340;

// ── Radar rings ──────────────────────────────────────────────────────────
const RADAR_RINGS = Array.from({ length: 6 }, (_, i) => ({
  r: 60 + i * 56,
  label: `R${i + 1}`,
  delay: 10 + i * 5,
}));

// ── Radar sweep line ─────────────────────────────────────────────────────
const SWEEP_SPEED = 3.5;

// ── Action dots on radar (each adds reach) ───────────────────────────────
interface ActionDot {
  id: number;
  angle: number;
  distance: number; // fraction 0-1
  label: string;
  color: string;
  delay: number;
  size: number;
}

const ACTION_DOTS: ActionDot[] = [
  { id: 0, angle: 0.3, distance: 0.25, label: 'API', color: COLORS.electric_cyan, delay: 15, size: 8 },
  { id: 1, angle: 1.2, distance: 0.35, label: 'DB', color: COLORS.warm_blue, delay: 18, size: 7 },
  { id: 2, angle: 2.0, distance: 0.45, label: 'FILE', color: COLORS.vibrant_green, delay: 21, size: 9 },
  { id: 3, angle: 2.8, distance: 0.55, label: 'MSG', color: COLORS.amber, delay: 24, size: 7 },
  { id: 4, angle: 3.5, distance: 0.65, label: 'WEB', color: COLORS.purple, delay: 27, size: 8 },
  { id: 5, angle: 4.3, distance: 0.72, label: 'CODE', color: COLORS.electric_cyan, delay: 30, size: 9 },
  { id: 6, angle: 5.0, distance: 0.8, label: 'SEARCH', color: COLORS.warm_blue, delay: 33, size: 8 },
  { id: 7, angle: 5.8, distance: 0.88, label: 'DEPLOY', color: COLORS.vibrant_green, delay: 36, size: 10 },
];

// ── Radar cross-hairs ────────────────────────────────────────────────────
const CROSSHAIR_LINES = [
  { angle: 0 },
  { angle: Math.PI / 4 },
  { angle: Math.PI / 2 },
  { angle: (3 * Math.PI) / 4 },
];

// ── Floating particles ───────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 167.3 + 30) % 1080,
  y: (i * 223.1 + 50) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.35,
}));

// ── Pulsing blips on radar ───────────────────────────────────────────────
const BLIPS = Array.from({ length: 12 }, (_, i) => ({
  angle: (i / 12) * Math.PI * 2,
  r: 120 + (i % 4) * 50,
  delay: 20 + i * 2,
  size: 3 + (i % 3),
}));

// ── Distance labels ──────────────────────────────────────────────────────
const DIST_LABELS = [
  { r: 120, label: 'NEAR', delay: 20 },
  { r: 230, label: 'MID', delay: 28 },
  { r: MAX_R, label: 'FAR', delay: 36 },
];

// ── Reach expansion ring ─────────────────────────────────────────────────
const EXPAND_RING_STAGES = Array.from({ length: 4 }, (_, i) => ({
  targetR: 100 + i * 70,
  delay: 20 + i * 8,
  color: [COLORS.electric_cyan, COLORS.warm_blue, COLORS.vibrant_green, COLORS.purple][i],
}));

export const Scene15_AgentReach: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ─────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const radarScale = scaleAnim(frame, 2, 20, 0.4, 1);
  const sweepAngle = frame * SWEEP_SPEED;
  const captionOp = interpolate(frame, [5, 18], [0, 1], { extrapolateRight: 'clamp' });
  const glowPulse = 0.5 + Math.sin(frame * 0.1) * 0.15;

  // ── Reach expansion (grows as actions are added) ───────────────────────
  const reachProgress = interpolate(frame, [15, 55], [0.15, 1], { extrapolateRight: 'clamp', easing: ease });
  const currentReachR = MAX_R * reachProgress;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="radarGlow15">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.35" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="dotGlow15">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="radarBg15" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.06" />
              <stop offset="60%" stopColor={COLORS.electric_cyan} stopOpacity="0.02" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sweepGrad15" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.3" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            </linearGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Particles ── */}
          {PARTICLES.map((p, i) => {
            const pulse = Math.sin(frame * 0.03 + p.phase) * 0.2 + 0.3;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.electric_cyan} opacity={enter * pulse * 0.04} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={540} y={180} text="AGENT'S REACH" fontSize={26}
            color={COLORS.electric_cyan} opacity={enter * 0.85}
            underlineColor={COLORS.electric_cyan} />

          <text x={540} y={228} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={17} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.5}>
            Defined by the action set
          </text>

          {/* ── Radar system ── */}
          <g transform={`translate(${CX}, ${CY}) scale(${radarScale})`}>

            {/* Background gradient */}
            <circle cx={0} cy={0} r={MAX_R}
              fill="url(#radarBg15)" opacity={0.8} />

            {/* Crosshair lines */}
            {CROSSHAIR_LINES.map((ch, i) => (
              <g key={`ch${i}`}>
                <line
                  x1={Math.cos(ch.angle) * -MAX_R} y1={Math.sin(ch.angle) * -MAX_R}
                  x2={Math.cos(ch.angle) * MAX_R} y2={Math.sin(ch.angle) * MAX_R}
                  stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={0.08} />
              </g>
            ))}

            {/* Radar rings */}
            {RADAR_RINGS.map((rr, i) => {
              const rrOp = interpolate(frame, [rr.delay, rr.delay + 10], [0, 0.2], { extrapolateRight: 'clamp' });
              return (
                <g key={`rr${i}`}>
                  <circle cx={0} cy={0} r={rr.r}
                    fill="none" stroke={COLORS.electric_cyan} strokeWidth={0.8}
                    strokeDasharray="4 8" opacity={rrOp} />
                </g>
              );
            })}

            {/* Sweep line */}
            {(() => {
              const sweepRad = (sweepAngle * Math.PI) / 180;
              const sx = Math.cos(sweepRad) * currentReachR;
              const sy = Math.sin(sweepRad) * currentReachR;
              return (
                <g>
                  <line x1={0} y1={0} x2={sx} y2={sy}
                    stroke={COLORS.electric_cyan} strokeWidth={2}
                    opacity={0.5} />
                  {/* Sweep trail arc */}
                  {Array.from({ length: 8 }, (_, j) => {
                    const trailAngle = sweepRad - (j + 1) * 0.06;
                    const trailX = Math.cos(trailAngle) * currentReachR;
                    const trailY = Math.sin(trailAngle) * currentReachR;
                    return (
                      <line key={`trail${j}`} x1={0} y1={0}
                        x2={trailX} y2={trailY}
                        stroke={COLORS.electric_cyan} strokeWidth={1}
                        opacity={0.15 - j * 0.015} />
                    );
                  })}
                </g>
              );
            })()}

            {/* Reach expansion rings */}
            {EXPAND_RING_STAGES.map((er, i) => {
              const erR = Math.min(er.targetR, currentReachR);
              const erOp = interpolate(frame, [er.delay, er.delay + 12], [0, 0.15], { extrapolateRight: 'clamp' });
              return (
                <circle key={`er${i}`} cx={0} cy={0} r={erR}
                  fill="none" stroke={er.color} strokeWidth={2}
                  opacity={erOp * glowPulse} />
              );
            })}

            {/* Current reach boundary */}
            <circle cx={0} cy={0} r={currentReachR}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth={2.5}
              opacity={0.4 + glowPulse * 0.2}
              filter="url(#radarGlow15)" />

            {/* Blips */}
            {BLIPS.map((bl, i) => {
              if (bl.r > currentReachR) return null;
              const blOp = interpolate(frame, [bl.delay, bl.delay + 8], [0, 0.3], { extrapolateRight: 'clamp' });
              const bx = Math.cos(bl.angle + frame * 0.01) * bl.r;
              const by = Math.sin(bl.angle + frame * 0.01) * bl.r;
              const blPulse = Math.sin(frame * 0.12 + i) > 0 ? 1 : 0.5;
              return (
                <circle key={`bl${i}`} cx={bx} cy={by} r={bl.size}
                  fill={COLORS.electric_cyan} opacity={blOp * blPulse} />
              );
            })}

            {/* Action dots */}
            {ACTION_DOTS.map((ad) => {
              const adR = ad.distance * MAX_R;
              if (adR > currentReachR + 10) return null;
              const adEnter = interpolate(frame, [ad.delay, ad.delay + 10], [0, 1],
                { extrapolateRight: 'clamp', easing: ease });
              const adX = Math.cos(ad.angle) * adR;
              const adY = Math.sin(ad.angle) * adR;
              return (
                <g key={`ad${ad.id}`} transform={`translate(${adX}, ${adY})`}
                  opacity={adEnter}>
                  {/* Glow ring */}
                  <circle cx={0} cy={0} r={ad.size + 6}
                    fill="none" stroke={ad.color} strokeWidth={1}
                    opacity={0.3 * glowPulse} />
                  {/* Dot */}
                  <circle cx={0} cy={0} r={ad.size}
                    fill={ad.color} opacity={0.8}
                    filter="url(#dotGlow15)" />
                  {/* Label */}
                  <text x={0} y={ad.size + 16} textAnchor="middle"
                    fontFamily="SF Mono, Menlo, monospace"
                    fontSize={9} fontWeight={700} letterSpacing={1.5}
                    fill={ad.color} opacity={0.7}>
                    {ad.label}
                  </text>
                </g>
              );
            })}

            {/* Distance labels */}
            {DIST_LABELS.map((dl, i) => {
              const dlOp = interpolate(frame, [dl.delay, dl.delay + 10], [0, 0.4], { extrapolateRight: 'clamp' });
              return dl.r <= currentReachR ? (
                <text key={`dl${i}`} x={dl.r - 10} y={-8}
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={9} fontWeight={600} letterSpacing={2}
                  fill={COLORS.cool_silver} opacity={dlOp}
                  transform={`rotate(0)`}>
                  {dl.label}
                </text>
              ) : null;
            })}

            {/* Center agent icon */}
            <g transform="scale(0.35)" opacity={enter}>
              <AIRobot cx={0} cy={0} scale={1} />
            </g>
          </g>

          {/* ── Reach counter ── */}
          <g opacity={interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })}>
            <rect x={CX - 70} y={280} width={140} height={44} rx={22}
              fill={COLORS.deep_black} stroke={COLORS.electric_cyan}
              strokeWidth={1.2} opacity={0.85} />
            <text x={CX} y={308} textAnchor="middle"
              fontFamily="SF Mono, Menlo, monospace"
              fontSize={16} fontWeight={700} letterSpacing={2}
              fill={COLORS.electric_cyan} opacity={0.9}>
              REACH: {Math.round(reachProgress * 100)}%
            </text>
          </g>

          {/* ── Bottom text ── */}
          <g opacity={interpolate(frame, [45, 65], [0, 1], { extrapolateRight: 'clamp' })}>
            <text x={540} y={1150} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={600} fill={COLORS.cool_silver} opacity={0.65}>
              More actions → Greater reach
            </text>
            <text x={540} y={1188} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={400} fill="#9CA3AF" opacity={0.4}>
              The action set is the agent's boundary
            </text>
          </g>

          {/* ── Caption ── */}
          <CaptionBar
            text="The action set defines the agent's reach."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
