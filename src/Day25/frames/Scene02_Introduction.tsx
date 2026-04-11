/**
 * Scene 02 — Introduction
 * "This is day 25 of learning agentic AI from first principles."
 * Paper background, AI robot hero, series progress bar, orbit concept nodes.
 * Duration: 152 frames (~5.07s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  AIRobot, SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Concept orbit nodes ───────────────────────────────────────────────────
const ORBIT_NODES = [
  { label: 'DAY 25',            angle: -45,  dist: 290, color: COLORS.electric_cyan },
  { label: 'AGENTIC AI',        angle: 35,   dist: 290, color: COLORS.warm_blue },
  { label: 'FIRST\nPRINCIPLES', angle: 135,  dist: 290, color: COLORS.vibrant_green },
  { label: 'ACTIONS',           angle: 225,  dist: 290, color: COLORS.amber },
];

const ORBIT_CX = 540;
const ORBIT_CY = 1180;

// ── Progress milestones ───────────────────────────────────────────────────
const MILESTONES = Array.from({ length: 25 }, (_, i) => ({
  label: `${i + 1}`,
  x: 100 + (i % 13) * 70,
  y: 1500 + Math.floor(i / 13) * 50,
  active: true,
  current: i === 24,
}));

// ── Ambient floating dots ─────────────────────────────────────────────────
const AMBIENT_DOTS = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 173.3 + 40) % 1080,
  y: (i * 211.7 + 60) % 1920,
  r: 1.2 + (i % 3) * 0.5,
  phase: i * 0.43,
}));

// ── Decorative circuit traces ─────────────────────────────────────────────
const TRACES = [
  { x1: 80, y1: 0, x2: 80, y2: 1920 },
  { x1: 320, y1: 0, x2: 320, y2: 1920 },
  { x1: 560, y1: 0, x2: 560, y2: 1920 },
  { x1: 760, y1: 0, x2: 760, y2: 1920 },
  { x1: 1000, y1: 0, x2: 1000, y2: 1920 },
];

// ── Small constellation connectors ────────────────────────────────────────
const CONSTELLATIONS = Array.from({ length: 8 }, (_, i) => ({
  x1: (i * 197 + 50) % 1080,
  y1: (i * 283 + 100) % 800 + 200,
  x2: ((i + 3) * 197 + 50) % 1080,
  y2: ((i + 3) * 283 + 100) % 800 + 200,
  delay: 5 + i * 6,
}));

export const Scene02_Introduction: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ───────────────────────────────────────────────────────────
  const robotEnter = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const robotScale = scaleAnim(frame, 0, 45, 0.6, 1);
  const orbitSpin = frame * 0.12;
  const titleEnter = interpolate(frame, [20, 58], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [20, 58], [60, 0], { extrapolateRight: 'clamp', easing: ease });
  const progressEnter = interpolate(frame, [50, 90], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const subtitleOp = interpolate(frame, [35, 65], [0, 1], { extrapolateRight: 'clamp' });
  const glowPulse = 0.5 + Math.sin(frame * 0.07) * 0.15;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.3} />

          {/* ── Subtle circuit trace lines ── */}
          {TRACES.map((t, i) => (
            <line key={`tr${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={COLORS.electric_cyan} strokeWidth={0.6} opacity={0.035} />
          ))}

          {/* ── Ambient floating dots ── */}
          {AMBIENT_DOTS.map((d, i) => {
            const pulse = Math.sin(frame * 0.05 + d.phase) * 0.3 + 0.5;
            return (
              <circle key={`ad${i}`} cx={d.x} cy={d.y} r={d.r}
                fill={COLORS.electric_cyan} opacity={robotEnter * pulse * 0.08} />
            );
          })}

          {/* ── Constellation connectors (upper area) ── */}
          {CONSTELLATIONS.map((c, i) => {
            const cOp = interpolate(frame, [c.delay, c.delay + 25], [0, 0.08], { extrapolateRight: 'clamp' });
            return (
              <line key={`con${i}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
                stroke={COLORS.warm_blue} strokeWidth={0.8} opacity={cOp}
                strokeDasharray="6 4" />
            );
          })}

          {/* ── Ambient glow behind robot ── */}
          <ellipse cx={540} cy={440} rx={280} ry={350}
            fill={COLORS.electric_cyan} opacity={0.03 + glowPulse * 0.015} />

          {/* ── Title block ── */}
          <g transform={`translate(540, ${160 + titleSlide})`} opacity={titleEnter}>
            <text textAnchor="middle" y={0}
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={42} fontWeight={700} letterSpacing={8}
              fill={COLORS.warm_blue}>
              DAY 25
            </text>
            <line x1={-100} y1={18} x2={100} y2={18}
              stroke={COLORS.electric_cyan} strokeWidth={2} opacity={0.4} />
          </g>

          {/* ── Subtitle: Actions ── */}
          <g transform="translate(540, 220)" opacity={subtitleOp}>
            <text textAnchor="middle" y={0}
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={26} fontWeight={500} letterSpacing={6}
              fill={COLORS.amber}>
              ACTIONS
            </text>
          </g>

          {/* ── Orbit section (lower half) ── */}

          {/* Outer orbit ring */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={290}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}
            strokeDasharray="14 8" opacity={0.16 * robotEnter}
            transform={`rotate(${orbitSpin}, ${ORBIT_CX}, ${ORBIT_CY})`} />
          {/* Inner ring */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={250}
            fill="none" stroke={COLORS.warm_blue} strokeWidth={0.8}
            opacity={0.09 * robotEnter} />
          {/* Second inner ring */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={200}
            fill="none" stroke={COLORS.amber} strokeWidth={0.5}
            strokeDasharray="4 8" opacity={0.06 * robotEnter} />

          {/* Orbit center dot */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={8}
            fill={COLORS.electric_cyan} opacity={0.35 * robotEnter}
            filter="url(#cyanGlow)" />

          {/* ── Orbit nodes ── */}
          {ORBIT_NODES.map((n, i) => {
            const rad = ((n.angle + orbitSpin * (i % 2 === 0 ? 1 : -0.5)) * Math.PI) / 180;
            const nx = ORBIT_CX + Math.cos(rad) * n.dist;
            const ny = ORBIT_CY + Math.sin(rad) * n.dist;
            const nEnter = interpolate(frame, [12 + i * 14, 44 + i * 14], [0, 1], { extrapolateRight: 'clamp' });
            const lines = n.label.split('\n');
            return (
              <g key={`on${i}`} opacity={nEnter}>
                {/* Connector */}
                <line x1={ORBIT_CX} y1={ORBIT_CY} x2={nx} y2={ny}
                  stroke={n.color} strokeWidth={1.5} opacity={0.2} />
                {/* Glow halo */}
                <circle cx={nx} cy={ny} r={44} fill={n.color} opacity={0.06}
                  filter="url(#softGlow)" />
                {/* Node background */}
                <circle cx={nx} cy={ny} r={38} fill={COLORS.bg_paper}
                  stroke={n.color} strokeWidth={2} opacity={0.9} />
                {/* Label */}
                {lines.map((ln, li) => (
                  <text key={li} x={nx} y={ny + (li - (lines.length - 1) / 2) * 16 + 5}
                    textAnchor="middle"
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={12} fontWeight={700} letterSpacing={1}
                    fill={n.color}>
                    {ln}
                  </text>
                ))}
              </g>
            );
          })}

          {/* ── Series progress bar ── */}
          <g opacity={progressEnter}>
            <SectionLabel x={540} y={1470} text="SERIES PROGRESS" fontSize={16}
              color={COLORS.cool_silver} opacity={0.5} />
            {MILESTONES.map((m, i) => {
              const mEnter = interpolate(frame, [55 + i * 1.2, 80 + i * 1.2], [0, 1], { extrapolateRight: 'clamp' });
              const fillColor = m.current ? COLORS.electric_cyan : COLORS.warm_blue;
              const rad = m.current ? 12 : 8;
              return (
                <g key={`ms${i}`} opacity={mEnter}>
                  <circle cx={m.x} cy={m.y} r={rad}
                    fill={m.current ? fillColor : 'none'}
                    stroke={fillColor} strokeWidth={m.current ? 2 : 1}
                    opacity={m.current ? 0.9 : 0.3} />
                  {m.current && (
                    <circle cx={m.x} cy={m.y} r={18}
                      fill="none" stroke={COLORS.electric_cyan}
                      strokeWidth={1.5} opacity={0.25 + Math.sin(frame * 0.1) * 0.1}
                      filter="url(#cyanGlow)" />
                  )}
                  <text x={m.x} y={m.y + 4} textAnchor="middle"
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={9} fontWeight={m.current ? 800 : 500}
                    fill={m.current ? COLORS.soft_white : COLORS.cool_silver}
                    opacity={m.current ? 1 : 0.5}>
                    {m.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── AI Robot (upper area) ── */}
          <AIRobot cx={540} cy={520} scale={robotScale * 1.3}
            opacity={robotEnter} coreGlow={glowPulse}
            frame={frame} variant="active" />

          {/* ── Decorative bottom accent ── */}
          <line x1={200} y1={1640} x2={880} y2={1640}
            stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={progressEnter * 0.2} />

          {/* ── Caption ── */}
          <CaptionBar
            text="This is day 25 of learning agentic AI from first principles."
            opacity={interpolate(frame, [8, 28], [0, 1], { extrapolateRight: 'clamp' })}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
