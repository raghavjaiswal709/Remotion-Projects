/**
 * Scene 04 — What Is An Action
 * "An action is anything the agent can do that changes the state of the
 *  world or retrieves information about it."
 * WorldGlobe with state-change arrows, agent hand reaching to globe,
 * orbiting data particles. Premium pencil-art style.
 * Duration: 202 frames (~6.73s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  AIRobot, WorldGlobe, SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout constants ──────────────────────────────────────────────────────
const GLOBE_CX = 540;
const GLOBE_CY = 820;
const GLOBE_R = 180;
const ROBOT_CX = 540;
const ROBOT_CY = 340;

// ── State-change arrows radiating from globe ─────────────────────────────
const STATE_ARROWS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
  return {
    angle,
    innerR: GLOBE_R + 30,
    outerR: GLOBE_R + 90 + (i % 3) * 20,
    color: [COLORS.electric_cyan, COLORS.amber, COLORS.vibrant_green, COLORS.warm_blue,
            COLORS.purple, COLORS.vibrant_red, COLORS.electric_cyan, COLORS.amber][i],
    delay: 30 + i * 8,
    label: ['STATE', 'CHANGE', 'UPDATE', 'READ', 'WRITE', 'QUERY', 'CALL', 'SEND'][i],
  };
});

// ── Orbit particles around globe ─────────────────────────────────────────
const ORBIT_PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  angle: (i / 24) * Math.PI * 2,
  r: GLOBE_R + 20 + (i % 4) * 15,
  size: 2 + (i % 3),
  speed: 0.015 + (i % 5) * 0.003,
  color: i % 2 === 0 ? COLORS.electric_cyan : COLORS.amber,
}));

// ── Background ambient dots ──────────────────────────────────────────────
const BG_DOTS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 143.7 + 25) % 1080,
  y: (i * 207.3 + 35) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: i * 0.39,
}));

// ── Connecting beam from robot to globe ──────────────────────────────────
const BEAM_SEGMENTS = Array.from({ length: 12 }, (_, i) => ({
  t: i / 12,
  size: 3 + (i % 3) * 1.5,
  phase: i * 0.5,
}));

// ── Impact ripples on globe surface ──────────────────────────────────────
const IMPACT_RIPPLES = Array.from({ length: 5 }, (_, i) => ({
  delay: 50 + i * 20,
  maxR: 30 + i * 15,
  angle: (i * 72 * Math.PI) / 180,
  dist: GLOBE_R * 0.6,
}));

// ── Keyword labels floating near globe ───────────────────────────────────
const KEYWORDS = [
  { text: 'CHANGES STATE', x: 180, y: 700, delay: 60 },
  { text: 'RETRIEVES INFO', x: 860, y: 700, delay: 80 },
  { text: 'AGENT ACTION', x: 540, y: 1100, delay: 100 },
];

// ── Decorative concentric arcs ───────────────────────────────────────────
const ARCS = Array.from({ length: 6 }, (_, i) => ({
  r: GLOBE_R + 120 + i * 25,
  startAngle: (i * 47 * Math.PI) / 180,
  sweep: (40 + i * 10) * Math.PI / 180,
  opacity: 0.04 + (i % 2) * 0.02,
}));

export const Scene04_WhatIsAction: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Master animations ────────────────────────────────────────────────
  const robotEnter = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const globeEnter = interpolate(frame, [15, 55], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const globeScale = scaleAnim(frame, 15, 55, 0.4, 1);
  const beamEnter = interpolate(frame, [35, 70], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const arrowsEnter = interpolate(frame, [50, 100], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const glowPulse = 0.5 + Math.sin(frame * 0.07) * 0.2;
  const captionOp = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });
  const rotSlow = frame * 0.1;

  // ── Hand reaching position ───────────────────────────────────────────
  const handExtend = interpolate(frame, [25, 65], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const handY = ROBOT_CY + 180 + handExtend * (GLOBE_CY - ROBOT_CY - 350);

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.25} />

          {/* ── Ambient bg dots ── */}
          {BG_DOTS.map((d, i) => {
            const pulse = Math.sin(frame * 0.04 + d.phase) * 0.3 + 0.4;
            return (
              <circle key={`bg${i}`} cx={d.x} cy={d.y} r={d.r}
                fill={COLORS.electric_cyan} opacity={robotEnter * pulse * 0.06} />
            );
          })}

          {/* ── Decorative concentric arcs ── */}
          {ARCS.map((arc, i) => {
            const x1 = GLOBE_CX + Math.cos(arc.startAngle + rotSlow * 0.01) * arc.r;
            const y1 = GLOBE_CY + Math.sin(arc.startAngle + rotSlow * 0.01) * arc.r;
            const x2 = GLOBE_CX + Math.cos(arc.startAngle + arc.sweep + rotSlow * 0.01) * arc.r;
            const y2 = GLOBE_CY + Math.sin(arc.startAngle + arc.sweep + rotSlow * 0.01) * arc.r;
            return (
              <path key={`arc${i}`}
                d={`M${x1},${y1} A${arc.r},${arc.r} 0 0,1 ${x2},${y2}`}
                fill="none" stroke={COLORS.cool_silver} strokeWidth={0.8}
                opacity={globeEnter * arc.opacity} />
            );
          })}

          {/* ── Title section ── */}
          <SectionLabel x={540} y={160} text="WHAT IS AN ACTION?" fontSize={28}
            color={COLORS.warm_blue} opacity={robotEnter * 0.8}
            underlineColor={COLORS.electric_cyan} />

          {/* ── AI Robot (top) ── */}
          <AIRobot cx={ROBOT_CX} cy={ROBOT_CY} scale={1.1 * robotEnter}
            opacity={robotEnter} coreGlow={glowPulse}
            frame={frame} variant="active" />

          {/* ── Agent hand/beam reaching to globe ── */}
          <g opacity={beamEnter}>
            {/* Main connection beam */}
            <line x1={540} y1={ROBOT_CY + 180} x2={540} y2={handY}
              stroke={COLORS.electric_cyan} strokeWidth={3}
              strokeDasharray="8 4" opacity={0.4} />
            {/* Beam particles */}
            {BEAM_SEGMENTS.map((seg, i) => {
              const by = ROBOT_CY + 180 + (handY - ROBOT_CY - 180) * ((seg.t + frame * 0.015) % 1);
              return (
                <circle key={`bp${i}`} cx={540 + Math.sin(frame * 0.08 + seg.phase) * 8}
                  cy={by} r={seg.size}
                  fill={COLORS.electric_cyan} opacity={0.3 + Math.sin(frame * 0.1 + seg.phase) * 0.1} />
              );
            })}
            {/* Hand endpoint glow */}
            <circle cx={540} cy={handY} r={18}
              fill={COLORS.electric_cyan} opacity={0.15 + glowPulse * 0.1}
              filter="url(#cyanGlow)" />
            <circle cx={540} cy={handY} r={8}
              fill={COLORS.electric_cyan} opacity={0.6} />
          </g>

          {/* ── WorldGlobe ── */}
          <WorldGlobe cx={GLOBE_CX} cy={GLOBE_CY} r={GLOBE_R}
            opacity={globeEnter} scale={globeScale}
            glowColor={COLORS.vibrant_green} />

          {/* ── Orbit particles ── */}
          {ORBIT_PARTICLES.map((op, i) => {
            const a = op.angle + frame * op.speed;
            const px = GLOBE_CX + Math.cos(a) * op.r;
            const py = GLOBE_CY + Math.sin(a) * op.r;
            return (
              <circle key={`op${i}`} cx={px} cy={py} r={op.size}
                fill={op.color} opacity={globeEnter * 0.25} />
            );
          })}

          {/* ── State-change arrows ── */}
          {STATE_ARROWS.map((arrow, i) => {
            const aEnter = interpolate(frame, [arrow.delay, arrow.delay + 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const ix = GLOBE_CX + Math.cos(arrow.angle) * arrow.innerR;
            const iy = GLOBE_CY + Math.sin(arrow.angle) * arrow.innerR;
            const ox = GLOBE_CX + Math.cos(arrow.angle) * arrow.outerR;
            const oy = GLOBE_CY + Math.sin(arrow.angle) * arrow.outerR;
            const cx1 = ix + (ox - ix) * aEnter;
            const cy1 = iy + (oy - iy) * aEnter;
            return (
              <g key={`sa${i}`} opacity={arrowsEnter * aEnter}>
                <line x1={ix} y1={iy} x2={cx1} y2={cy1}
                  stroke={arrow.color} strokeWidth={2}
                  markerEnd="none" opacity={0.6} />
                {/* Arrow head */}
                <circle cx={cx1} cy={cy1} r={4}
                  fill={arrow.color} opacity={0.8} />
                {/* Label */}
                <text x={ox + Math.cos(arrow.angle) * 15}
                  y={oy + Math.sin(arrow.angle) * 15}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize={10} fontWeight={600} letterSpacing={2}
                  fill={arrow.color} opacity={aEnter * 0.6}>
                  {arrow.label}
                </text>
              </g>
            );
          })}

          {/* ── Impact ripples ── */}
          {IMPACT_RIPPLES.map((rip, i) => {
            const ripEnter = interpolate(frame, [rip.delay, rip.delay + 30], [0, rip.maxR], { extrapolateRight: 'clamp' });
            const ripOp = interpolate(frame, [rip.delay, rip.delay + 30], [0.35, 0], { extrapolateRight: 'clamp' });
            const rx = GLOBE_CX + Math.cos(rip.angle) * rip.dist;
            const ry = GLOBE_CY + Math.sin(rip.angle) * rip.dist;
            return (
              <circle key={`rip${i}`} cx={rx} cy={ry} r={ripEnter}
                fill="none" stroke={COLORS.vibrant_green} strokeWidth={1.5}
                opacity={ripOp} />
            );
          })}

          {/* ── Floating keyword labels ── */}
          {KEYWORDS.map((kw, i) => {
            const kwOp = interpolate(frame, [kw.delay, kw.delay + 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const kwY = kw.y - interpolate(frame, [kw.delay, kw.delay + 25], [20, 0], { extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={`kw${i}`} opacity={kwOp}>
                <rect x={kw.x - 80} y={kwY - 16} width={160} height={32} rx={16}
                  fill={COLORS.bg_paper} stroke={COLORS.electric_cyan}
                  strokeWidth={1.5} opacity={0.8} />
                <text x={kw.x} y={kwY + 5} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={13} fontWeight={700} letterSpacing={3}
                  fill={COLORS.electric_cyan}>
                  {kw.text}
                </text>
              </g>
            );
          })}

          {/* ── Decorative bottom separator ── */}
          <line x1={250} y1={1300} x2={830} y2={1300}
            stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={globeEnter * 0.15} />

          {/* ── Definition text block ── */}
          <g opacity={interpolate(frame, [80, 120], [0, 1], { extrapolateRight: 'clamp' })}>
            <text x={540} y={1380} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={600} fill={COLORS.deep_black} opacity={0.6}>
              Anything the agent does that
            </text>
            <text x={540} y={1420} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={700} fill={COLORS.amber}>
              changes the world
            </text>
            <text x={540} y={1460} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={600} fill={COLORS.deep_black} opacity={0.6}>
              or retrieves information about it
            </text>
          </g>

          {/* ── Caption ── */}
          <CaptionBar
            text="An action is anything the agent can do that changes the state of the world or retrieves information about it."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
