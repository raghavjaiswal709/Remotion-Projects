/**
 * Scene 08 — Real Happens
 * "Act is the step where something real happens."
 * Dramatic visual: green bolt/lightning, impact effect, "REAL" text,
 * energy burst from center. Dark premium styling with bold emphasis.
 * Duration: 81 frames (~2.7s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Impact center ─────────────────────────────────────────────────────────
const IMPACT_CX = 540;
const IMPACT_CY = 700;

// ── Lightning bolt segments ──────────────────────────────────────────────
const BOLT_POINTS = [
  { x: 540, y: 200 },
  { x: 500, y: 380 },
  { x: 560, y: 420 },
  { x: 510, y: 560 },
  { x: 570, y: 600 },
  { x: 530, y: 680 },
  { x: 540, y: 700 },
];

const BOLT_PATH = BOLT_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

// ── Secondary bolt (thinner, offset) ─────────────────────────────────────
const BOLT2_POINTS = [
  { x: 560, y: 230 },
  { x: 580, y: 360 },
  { x: 540, y: 400 },
  { x: 590, y: 520 },
  { x: 550, y: 580 },
  { x: 560, y: 660 },
  { x: 540, y: 700 },
];
const BOLT2_PATH = BOLT2_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

// ── Impact shockwave rings ───────────────────────────────────────────────
const SHOCKWAVES = Array.from({ length: 6 }, (_, i) => ({
  delay: 15 + i * 6,
  maxR: 60 + i * 60,
  strokeW: 3 - i * 0.3,
}));

// ── Radial debris particles from impact ──────────────────────────────────
const DEBRIS = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2;
  return {
    angle,
    speed: 4 + (i % 5) * 2,
    size: 2 + (i % 4) * 1.5,
    delay: 15 + (i % 8) * 1.5,
    color: [COLORS.vibrant_green, COLORS.amber, COLORS.electric_cyan, COLORS.soft_white][i % 4],
  };
});

// ── Energy sparks ────────────────────────────────────────────────────────
const SPARKS = Array.from({ length: 20 }, (_, i) => ({
  angle: (i / 20) * Math.PI * 2 + 0.3,
  dist: 30 + (i % 6) * 25,
  size: 1.5 + (i % 3),
  delay: 12 + (i % 5) * 3,
}));

// ── Background energy field lines ────────────────────────────────────────
const FIELD_LINES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return {
    angle,
    innerR: 120,
    outerR: 400 + (i % 3) * 60,
    delay: 10 + i * 2,
  };
});

// ── Ambient background particles ─────────────────────────────────────────
const BG_DOTS = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 161.3 + 30) % 1080,
  y: (i * 221.7 + 50) % 1920,
  r: 1.2 + (i % 3) * 0.4,
  phase: i * 0.37,
}));

// ── Dramatic "REAL" letter shadow layers ─────────────────────────────────
const REAL_LAYERS = [
  { dy: 8, opacity: 0.1, blur: 12 },
  { dy: 4, opacity: 0.2, blur: 6 },
  { dy: 0, opacity: 1, blur: 0 },
];

export const Scene08_RealHappens: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const boltEnter = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const boltFlash = frame > 14 && frame < 22 ? 1 : 0;
  const impactEnter = interpolate(frame, [15, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const realScale = scaleAnim(frame, 18, 25, 0.2, 1);
  const realOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: 'clamp' });
  const glowPulse = 0.5 + Math.sin(frame * 0.12) * 0.25;
  const captionOp = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });
  const screenShake = frame > 14 && frame < 24 ?
    Math.sin(frame * 8) * (24 - frame) * 0.5 : 0;

  // ── Bolt dash animation ──────────────────────────────────────────────
  const boltLen = 800;
  const boltDash = interpolate(frame, [5, 18], [boltLen, 0], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="greenGlow08">
              <feGaussianBlur stdDeviation="14" result="b" />
              <feFlood floodColor="#22C55E" floodOpacity="0.6" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="whiteFlash08">
              <feGaussianBlur stdDeviation="20" result="b" />
              <feFlood floodColor="#FFFFFF" floodOpacity="0.4" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="boldGlow08">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="impactGrad08" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#22C55E" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
            </radialGradient>
          </defs>

          <GlobalDefs />

          {/* ── Screen shake wrapper ── */}
          <g transform={`translate(${screenShake}, ${screenShake * 0.7})`}>
            <CornerBrackets opacity={0.25} />

            {/* ── Background dots ── */}
            {BG_DOTS.map((d, i) => {
              const pulse = Math.sin(frame * 0.05 + d.phase) * 0.25 + 0.4;
              return (
                <circle key={`bg${i}`} cx={d.x} cy={d.y} r={d.r}
                  fill={COLORS.vibrant_green} opacity={enter * pulse * 0.06} />
              );
            })}

            {/* ── Energy field lines radiating from impact ── */}
            {FIELD_LINES.map((fl, i) => {
              const flOp = interpolate(frame, [fl.delay, fl.delay + 15], [0, 0.08], { extrapolateRight: 'clamp' });
              const x1 = IMPACT_CX + Math.cos(fl.angle) * fl.innerR;
              const y1 = IMPACT_CY + Math.sin(fl.angle) * fl.innerR;
              const x2 = IMPACT_CX + Math.cos(fl.angle) * fl.outerR;
              const y2 = IMPACT_CY + Math.sin(fl.angle) * fl.outerR;
              return (
                <line key={`fl${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={COLORS.vibrant_green} strokeWidth={1}
                  opacity={flOp * impactEnter} strokeDasharray="6 8" />
              );
            })}

            {/* ── Section title ── */}
            <SectionLabel x={540} y={140} text="SOMETHING REAL" fontSize={26}
              color={COLORS.vibrant_green} opacity={enter * 0.8}
              underlineColor={COLORS.vibrant_green} />

            {/* ── Lightning bolt (primary) ── */}
            <path d={BOLT_PATH}
              fill="none" stroke={COLORS.vibrant_green} strokeWidth={6}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={boltLen} strokeDashoffset={boltDash}
              opacity={boltEnter * 0.9}
              filter="url(#greenGlow08)" />

            {/* ── Lightning bolt (secondary) ── */}
            <path d={BOLT2_PATH}
              fill="none" stroke={COLORS.vibrant_green} strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={boltLen} strokeDashoffset={boltDash * 1.1}
              opacity={boltEnter * 0.5} />

            {/* ── Flash overlay ── */}
            {boltFlash > 0 && (
              <rect x={0} y={0} width={1080} height={1920}
                fill="#FFFFFF" opacity={boltFlash * 0.08} />
            )}

            {/* ── Impact zone glow ── */}
            <ellipse cx={IMPACT_CX} cy={IMPACT_CY}
              rx={180 * impactEnter} ry={120 * impactEnter}
              fill="url(#impactGrad08)" opacity={impactEnter * 0.8} />

            {/* ── Shockwave rings ── */}
            {SHOCKWAVES.map((sw, i) => {
              const swR = interpolate(frame, [sw.delay, sw.delay + 20], [0, sw.maxR], { extrapolateRight: 'clamp' });
              const swOp = interpolate(frame, [sw.delay, sw.delay + 20], [0.5, 0], { extrapolateRight: 'clamp' });
              return (
                <circle key={`sw${i}`} cx={IMPACT_CX} cy={IMPACT_CY} r={swR}
                  fill="none" stroke={COLORS.vibrant_green} strokeWidth={sw.strokeW}
                  opacity={swOp} />
              );
            })}

            {/* ── Debris particles ── */}
            {DEBRIS.map((db, i) => {
              const dbDist = interpolate(frame, [db.delay, db.delay + 40], [0, db.speed * 40], { extrapolateRight: 'clamp' });
              const dbOp = interpolate(frame, [db.delay, db.delay + 40], [0.7, 0], { extrapolateRight: 'clamp' });
              const dx = IMPACT_CX + Math.cos(db.angle) * dbDist;
              const dy = IMPACT_CY + Math.sin(db.angle) * dbDist;
              return (
                <circle key={`db${i}`} cx={dx} cy={dy} r={db.size}
                  fill={db.color} opacity={dbOp} />
              );
            })}

            {/* ── Energy sparks ── */}
            {SPARKS.map((sp, i) => {
              const spOp = interpolate(frame, [sp.delay, sp.delay + 10, sp.delay + 30], [0, 0.6, 0], { extrapolateRight: 'clamp' });
              const sx = IMPACT_CX + Math.cos(sp.angle + frame * 0.03) * sp.dist;
              const sy = IMPACT_CY + Math.sin(sp.angle + frame * 0.03) * sp.dist;
              return (
                <circle key={`sp${i}`} cx={sx} cy={sy} r={sp.size}
                  fill={COLORS.amber} opacity={spOp} filter="url(#boldGlow08)" />
              );
            })}

            {/* ── "REAL" dramatic text ── */}
            <g transform={`translate(${IMPACT_CX}, ${IMPACT_CY}) scale(${realScale})`}
              opacity={realOpacity}>
              {REAL_LAYERS.map((layer, li) => (
                <text key={`rl${li}`} textAnchor="middle" y={layer.dy + 15}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={120} fontWeight={900} letterSpacing={16}
                  fill={li === REAL_LAYERS.length - 1 ? COLORS.vibrant_green : '#000'}
                  opacity={layer.opacity}
                  filter={li === REAL_LAYERS.length - 1 ? 'url(#greenGlow08)' : undefined}>
                  REAL
                </text>
              ))}
            </g>

            {/* ── "ACT" badge ── */}
            <g transform="translate(540, 880)"
              opacity={interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' })}>
              <rect x={-60} y={-18} width={120} height={36} rx={18}
                fill={COLORS.amber} opacity={0.15} />
              <rect x={-60} y={-18} width={120} height={36} rx={18}
                fill="none" stroke={COLORS.amber} strokeWidth={1.5} opacity={0.5} />
              <text textAnchor="middle" y={6}
                fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                fontSize={18} fontWeight={800} letterSpacing={6}
                fill={COLORS.amber}>
                ACT
              </text>
            </g>

            {/* ── Supporting text ── */}
            <g opacity={interpolate(frame, [35, 55], [0, 1], { extrapolateRight: 'clamp' })}>
              <text x={540} y={980} textAnchor="middle"
                fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                fontSize={22} fontWeight={600} fill={COLORS.deep_black} opacity={0.5}>
                The step where something
              </text>
              <text x={540} y={1020} textAnchor="middle"
                fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                fontSize={26} fontWeight={800} fill={COLORS.vibrant_green}
                filter="url(#boldGlow08)">
                actually happens
              </text>
            </g>

            {/* ── Pulsing ring at impact ── */}
            <circle cx={IMPACT_CX} cy={IMPACT_CY}
              r={40 + glowPulse * 20}
              fill="none" stroke={COLORS.vibrant_green} strokeWidth={1.5}
              opacity={impactEnter * (0.15 + glowPulse * 0.1)} />

          </g>

          {/* ── Caption ── */}
          <CaptionBar
            text="Act is the step where something real happens."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
