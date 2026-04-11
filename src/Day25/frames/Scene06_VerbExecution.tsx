/**
 * Scene 06 — Verb Execution
 * "Each of these is an action, a verb that agent executes against the environment."
 * Large "VERB" text with action animation, environment visualization
 * showing the agent sending a verb-arrow into the world.
 * Duration: 150 frames (~5s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  AIRobot, WorldGlobe, SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout ────────────────────────────────────────────────────────────────
const AGENT_CX = 260;
const AGENT_CY = 700;
const ENV_CX = 820;
const ENV_CY = 700;
const VERB_CX = 540;
const VERB_CY = 440;

// ── Action verbs cycling around ──────────────────────────────────────────
const VERBS = [
  { text: 'CALL', color: COLORS.electric_cyan },
  { text: 'WRITE', color: COLORS.vibrant_green },
  { text: 'SEND', color: COLORS.amber },
  { text: 'QUERY', color: COLORS.warm_blue },
  { text: 'CLICK', color: COLORS.purple },
  { text: 'READ', color: COLORS.vibrant_red },
  { text: 'UPDATE', color: COLORS.electric_cyan },
  { text: 'DELETE', color: COLORS.vibrant_red },
];

// ── Arrow projectiles from agent to environment ──────────────────────────
const PROJECTILES = Array.from({ length: 8 }, (_, i) => ({
  delay: 20 + i * 14,
  yOffset: -30 + (i % 3) * 30,
  speed: 0.025,
  color: VERBS[i % VERBS.length].color,
  verb: VERBS[i % VERBS.length].text,
}));

// ── Environment ripple effects ───────────────────────────────────────────
const ENV_RIPPLES = Array.from({ length: 6 }, (_, i) => ({
  delay: 35 + i * 16,
  maxR: 20 + i * 12,
}));

// ── Background ambient particles ─────────────────────────────────────────
const AMBIENT = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 167.3 + 20) % 1080,
  y: (i * 203.9 + 50) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: i * 0.44,
}));

// ── Decorative circuit traces (horizontal emphasis) ──────────────────────
const H_TRACES = Array.from({ length: 5 }, (_, i) => ({
  y: 550 + i * 70,
  dashArray: `${10 + i * 5} ${8 + i * 3}`,
  opacity: 0.03 + (i === 2 ? 0.015 : 0),
}));

// ── Radial dots around environment ───────────────────────────────────────
const ENV_DOTS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  return { angle, r: 130 + (i % 3) * 15, size: 2 + (i % 2) };
});

// ── Connecting field lines between agent zone and env zone ───────────────
const FIELD_LINES = Array.from({ length: 8 }, (_, i) => ({
  y1: 600 + i * 25,
  curve: 15 + (i % 3) * 10,
  delay: 10 + i * 4,
}));

// ── "VERB" letter particles ──────────────────────────────────────────────
const VERB_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  angle: (i / 20) * Math.PI * 2,
  dist: 80 + (i % 4) * 20,
  size: 2 + (i % 3),
  speed: 0.012 + (i % 5) * 0.004,
}));

export const Scene06_VerbExecution: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const verbScale = scaleAnim(frame, 5, 30, 0.3, 1);
  const verbOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: 'clamp' });
  const agentEnter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const envEnter = interpolate(frame, [10, 45], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const glowPulse = 0.5 + Math.sin(frame * 0.08) * 0.2;
  const captionOp = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });

  // Active verb index (cycles every ~18 frames)
  const activeVerbIdx = Math.floor(frame / 18) % VERBS.length;
  const activeVerb = VERBS[activeVerbIdx];

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.25} />

          {/* ── Ambient dots ── */}
          {AMBIENT.map((a, i) => {
            const pulse = Math.sin(frame * 0.04 + a.phase) * 0.25 + 0.4;
            return (
              <circle key={`a${i}`} cx={a.x} cy={a.y} r={a.r}
                fill={COLORS.electric_cyan} opacity={enter * pulse * 0.06} />
            );
          })}

          {/* ── Horizontal traces ── */}
          {H_TRACES.map((ht, i) => (
            <line key={`ht${i}`} x1={AGENT_CX + 60} y1={ht.y}
              x2={ENV_CX - 60} y2={ht.y}
              stroke={COLORS.cool_silver} strokeWidth={0.7}
              strokeDasharray={ht.dashArray} opacity={enter * ht.opacity * 3} />
          ))}

          {/* ── Field lines connecting agent zone → env zone ── */}
          {FIELD_LINES.map((fl, i) => {
            const flOp = interpolate(frame, [fl.delay, fl.delay + 20], [0, 0.1], { extrapolateRight: 'clamp' });
            return (
              <path key={`fl${i}`}
                d={`M${AGENT_CX + 70},${fl.y1} Q${540},${fl.y1 - fl.curve} ${ENV_CX - 70},${fl.y1}`}
                fill="none" stroke={COLORS.electric_cyan} strokeWidth={0.8}
                opacity={flOp} strokeDasharray="4 6" />
            );
          })}

          {/* ── Section title ── */}
          <SectionLabel x={540} y={180} text="ACTIONS ARE VERBS" fontSize={26}
            color={COLORS.warm_blue} opacity={enter * 0.8}
            underlineColor={COLORS.electric_cyan} />

          {/* ── Large "VERB" text ── */}
          <g transform={`translate(${VERB_CX}, ${VERB_CY}) scale(${verbScale})`}
            opacity={verbOpacity}>
            {/* Background glow */}
            <ellipse cx={0} cy={0} rx={160} ry={60}
              fill={activeVerb.color} opacity={0.06}
              filter="url(#softGlow)" />
            {/* Main text */}
            <text textAnchor="middle" y={20}
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={100} fontWeight={900} letterSpacing={12}
              fill={activeVerb.color} filter="url(#cyanGlow)">
              {activeVerb.text}
            </text>
            {/* Subtitle */}
            <text textAnchor="middle" y={55}
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={500} letterSpacing={4}
              fill={COLORS.cool_silver} opacity={0.5}>
              AGENT VERB
            </text>
          </g>

          {/* ── VERB particles ── */}
          {VERB_PARTICLES.map((vp, i) => {
            const a = vp.angle + frame * vp.speed;
            return (
              <circle key={`vp${i}`}
                cx={VERB_CX + Math.cos(a) * vp.dist}
                cy={VERB_CY + Math.sin(a) * vp.dist}
                r={vp.size} fill={activeVerb.color}
                opacity={verbOpacity * 0.15} />
            );
          })}

          {/* ── Zone labels ── */}
          <g opacity={enter * 0.6}>
            <rect x={AGENT_CX - 50} y={560} width={100} height={28} rx={14}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth={1} opacity={0.4} />
            <text x={AGENT_CX} y={579} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={12} fontWeight={700} letterSpacing={3}
              fill={COLORS.electric_cyan}>
              AGENT
            </text>
          </g>
          <g opacity={enter * 0.6}>
            <rect x={ENV_CX - 70} y={560} width={140} height={28} rx={14}
              fill="none" stroke={COLORS.vibrant_green} strokeWidth={1} opacity={0.4} />
            <text x={ENV_CX} y={579} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={12} fontWeight={700} letterSpacing={3}
              fill={COLORS.vibrant_green}>
              ENVIRONMENT
            </text>
          </g>

          {/* ── AI Robot (agent side) ── */}
          <AIRobot cx={AGENT_CX} cy={AGENT_CY} scale={0.9 * agentEnter}
            opacity={agentEnter} coreGlow={glowPulse}
            frame={frame} variant="active" />

          {/* ── World Globe (environment side) ── */}
          <WorldGlobe cx={ENV_CX} cy={ENV_CY} r={100}
            opacity={envEnter} scale={envEnter}
            glowColor={COLORS.vibrant_green} />

          {/* ── Environment radial dots ── */}
          {ENV_DOTS.map((ed, i) => {
            const a = ed.angle + frame * 0.008;
            return (
              <circle key={`ed${i}`}
                cx={ENV_CX + Math.cos(a) * ed.r}
                cy={ENV_CY + Math.sin(a) * ed.r}
                r={ed.size} fill={COLORS.vibrant_green}
                opacity={envEnter * 0.12} />
            );
          })}

          {/* ── Projectiles: verb arrows agent → environment ── */}
          {PROJECTILES.map((proj, i) => {
            const projProgress = interpolate(frame, [proj.delay, proj.delay + 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const projX = AGENT_CX + 80 + (ENV_CX - AGENT_CX - 160) * projProgress;
            const projY = 700 + proj.yOffset;
            const projOp = projProgress > 0 && projProgress < 1 ? 0.7 : 0;
            return (
              <g key={`proj${i}`} opacity={projOp}>
                {/* Trail */}
                <line x1={projX - 30} y1={projY} x2={projX} y2={projY}
                  stroke={proj.color} strokeWidth={2} opacity={0.4} />
                {/* Head */}
                <circle cx={projX} cy={projY} r={5}
                  fill={proj.color} opacity={0.8} />
                {/* Label */}
                <text x={projX} y={projY - 12}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize={9} fontWeight={700} letterSpacing={1}
                  fill={proj.color} opacity={0.6}>
                  {proj.verb}
                </text>
              </g>
            );
          })}

          {/* ── Environment ripples on impact ── */}
          {ENV_RIPPLES.map((rip, i) => {
            const ripR = interpolate(frame, [rip.delay, rip.delay + 25], [0, rip.maxR], { extrapolateRight: 'clamp' });
            const ripOp = interpolate(frame, [rip.delay, rip.delay + 25], [0.3, 0], { extrapolateRight: 'clamp' });
            return (
              <circle key={`rip${i}`} cx={ENV_CX} cy={ENV_CY} r={ripR}
                fill="none" stroke={COLORS.vibrant_green} strokeWidth={1.5}
                opacity={ripOp} />
            );
          })}

          {/* ── Bottom explanation ── */}
          <g opacity={interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' })}>
            <text x={540} y={1100} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={20} fontWeight={600} fill={COLORS.deep_black} opacity={0.55}>
              A verb the agent executes
            </text>
            <text x={540} y={1135} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={20} fontWeight={700} fill={COLORS.amber}>
              against the environment
            </text>
          </g>

          {/* ── Decorative separator ── */}
          <line x1={250} y1={1200} x2={830} y2={1200}
            stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={enter * 0.15} />

          {/* ── Caption ── */}
          <CaptionBar
            text="Each of these is an action, a verb that agent executes against the environment."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
