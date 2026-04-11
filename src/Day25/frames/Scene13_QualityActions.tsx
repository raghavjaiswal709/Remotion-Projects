/**
 * Scene 13 — Quality of Actions
 * "The quality of what an agent can accomplish is exactly the quality
 *  of the actions available to it."
 * Quality meter/gauge visualization, action cards with quality ratings.
 * Duration: 188 frames (~6.27s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout ───────────────────────────────────────────────────────────────
const CX = 540;
const GAUGE_CY = 550;
const GAUGE_R = 160;

// ── Gauge arc parameters ─────────────────────────────────────────────────
const GAUGE_START_ANGLE = Math.PI * 0.8;
const GAUGE_END_ANGLE = Math.PI * 0.2;
const GAUGE_SWEEP = GAUGE_START_ANGLE + (2 * Math.PI - GAUGE_START_ANGLE) + GAUGE_END_ANGLE;

// ── Gauge segments (colored zones) ───────────────────────────────────────
interface GaugeZone {
  startFrac: number;
  endFrac: number;
  color: string;
  label: string;
}

const GAUGE_ZONES: GaugeZone[] = [
  { startFrac: 0, endFrac: 0.33, color: COLORS.vibrant_red, label: 'WEAK' },
  { startFrac: 0.33, endFrac: 0.66, color: COLORS.amber, label: 'DECENT' },
  { startFrac: 0.66, endFrac: 1, color: COLORS.vibrant_green, label: 'EXCELLENT' },
];

// ── Gauge tick marks ─────────────────────────────────────────────────────
const GAUGE_TICKS = Array.from({ length: 21 }, (_, i) => ({
  frac: i / 20,
  isMajor: i % 5 === 0,
}));

// ── Action cards with quality levels ─────────────────────────────────────
interface ActionCard {
  id: number;
  x: number;
  y: number;
  label: string;
  quality: number; // 0-1
  icon: string;
  delay: number;
}

const ACTION_CARDS: ActionCard[] = [
  { id: 0, x: 180, y: 850, label: 'Search API', quality: 0.92, icon: '🔍', delay: 40 },
  { id: 1, x: 380, y: 850, label: 'DB Write', quality: 0.85, icon: '💾', delay: 50 },
  { id: 2, x: 580, y: 850, label: 'Send Email', quality: 0.78, icon: '📧', delay: 60 },
  { id: 3, x: 780, y: 850, label: 'Parse PDF', quality: 0.65, icon: '📄', delay: 70 },
  { id: 4, x: 280, y: 1010, label: 'Web Scrape', quality: 0.45, icon: '🌐', delay: 80 },
  { id: 5, x: 480, y: 1010, label: 'OCR Text', quality: 0.55, icon: '👁', delay: 90 },
  { id: 6, x: 680, y: 1010, label: 'Run Code', quality: 0.88, icon: '⚡', delay: 100 },
];

const CARD_W = 150;
const CARD_H = 110;

// ── Quality bar helpers ──────────────────────────────────────────────────
const qualityColor = (q: number): string => {
  if (q >= 0.75) return COLORS.vibrant_green;
  if (q >= 0.5) return COLORS.amber;
  return COLORS.vibrant_red;
};

// ── Floating particles ───────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 149.7 + 30) % 1080,
  y: (i * 213.3 + 50) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: i * 0.33,
}));

// ── Decorative radial lines around gauge ─────────────────────────────────
const RADIAL_DECO = Array.from({ length: 12 }, (_, i) => ({
  angle: GAUGE_START_ANGLE + (i / 11) * GAUGE_SWEEP,
  delay: 20 + i * 2,
}));

// ── Equals sign connector ────────────────────────────────────────────────
const EQ_Y = 770;

// ── Result label ─────────────────────────────────────────────────────────
const RESULT_Y = 1150;

export const Scene13_QualityActions: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ─────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });
  const gaugeEnter = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const needleAngle = interpolate(frame, [30, 120], [0, 0.82], { extrapolateRight: 'clamp', easing: ease });
  const glowPulse = 0.5 + Math.sin(frame * 0.09) * 0.15;

  // ── Needle position ────────────────────────────────────────────────────
  const needleRad = GAUGE_START_ANGLE + needleAngle * GAUGE_SWEEP;
  const needleX = CX + Math.cos(needleRad) * (GAUGE_R - 20);
  const needleY = GAUGE_CY + Math.sin(needleRad) * (GAUGE_R - 20);

  // ── Current quality value display ──────────────────────────────────────
  const qualityPercent = Math.round(needleAngle * 100);
  const currentQColor = qualityColor(needleAngle);

  // ── Helper: arc path ───────────────────────────────────────────────────
  const arcPath = (cx: number, cy: number, r: number, startA: number, endA: number): string => {
    const x1 = cx + Math.cos(startA) * r;
    const y1 = cy + Math.sin(startA) * r;
    const x2 = cx + Math.cos(endA) * r;
    const y2 = cy + Math.sin(endA) * r;
    const sweep = endA - startA;
    const largeArc = sweep > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2}`;
  };

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="gaugeGlow13">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.35" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="needleGlow13">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="cardShadow13">
              <feDropShadow dx="0" dy="3" stdDeviation="6"
                floodColor="#0D0D0D" floodOpacity="0.12" />
            </filter>
            <linearGradient id="needleGrad13" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.soft_white} />
              <stop offset="100%" stopColor={COLORS.cool_silver} />
            </linearGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Ambient particles ── */}
          {PARTICLES.map((p, i) => {
            const pulse = Math.sin(frame * 0.03 + p.phase) * 0.2 + 0.3;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.electric_cyan} opacity={enter * pulse * 0.04} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={540} y={180} text="QUALITY OF ACTIONS" fontSize={26}
            color={COLORS.electric_cyan} opacity={enter * 0.85}
            underlineColor={COLORS.electric_cyan} />

          <text x={540} y={228} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={17} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.5}>
            Defines what the agent can accomplish
          </text>

          {/* ── Gauge background ── */}
          <g opacity={gaugeEnter}>
            {/* Outer decorative ring */}
            <circle cx={CX} cy={GAUGE_CY} r={GAUGE_R + 20}
              fill="none" stroke={COLORS.cool_silver} strokeWidth={0.5}
              strokeDasharray="3 6" opacity={0.15} />

            {/* Radial decorative lines */}
            {RADIAL_DECO.map((rd, i) => {
              const rdOp = interpolate(frame, [rd.delay, rd.delay + 8], [0, 0.12], { extrapolateRight: 'clamp' });
              const ix = CX + Math.cos(rd.angle) * (GAUGE_R + 25);
              const iy = GAUGE_CY + Math.sin(rd.angle) * (GAUGE_R + 25);
              const ox = CX + Math.cos(rd.angle) * (GAUGE_R + 40);
              const oy = GAUGE_CY + Math.sin(rd.angle) * (GAUGE_R + 40);
              return (
                <line key={`rd${i}`} x1={ix} y1={iy} x2={ox} y2={oy}
                  stroke={COLORS.cool_silver} strokeWidth={0.8} opacity={rdOp} />
              );
            })}

            {/* Gauge zone arcs */}
            {GAUGE_ZONES.map((gz, i) => {
              const gzStart = GAUGE_START_ANGLE + gz.startFrac * GAUGE_SWEEP;
              const gzEnd = GAUGE_START_ANGLE + gz.endFrac * GAUGE_SWEEP;
              return (
                <g key={`gz${i}`}>
                  <path d={arcPath(CX, GAUGE_CY, GAUGE_R, gzStart, gzEnd)}
                    fill="none" stroke={gz.color} strokeWidth={18}
                    strokeLinecap="butt" opacity={0.25 + glowPulse * 0.1} />
                  {/* Zone label */}
                  {(() => {
                    const midAngle = (gzStart + gzEnd) / 2;
                    const lx = CX + Math.cos(midAngle) * (GAUGE_R + 55);
                    const ly = GAUGE_CY + Math.sin(midAngle) * (GAUGE_R + 55);
                    return (
                      <text x={lx} y={ly} textAnchor="middle"
                        fontFamily="SF Mono, Menlo, monospace"
                        fontSize={10} fontWeight={600} letterSpacing={1.5}
                        fill={gz.color} opacity={0.6}>
                        {gz.label}
                      </text>
                    );
                  })()}
                </g>
              );
            })}

            {/* Tick marks */}
            {GAUGE_TICKS.map((gt, i) => {
              const tAngle = GAUGE_START_ANGLE + gt.frac * GAUGE_SWEEP;
              const innerR = gt.isMajor ? GAUGE_R - 28 : GAUGE_R - 22;
              const outerR = GAUGE_R - 12;
              const tx1 = CX + Math.cos(tAngle) * innerR;
              const ty1 = GAUGE_CY + Math.sin(tAngle) * innerR;
              const tx2 = CX + Math.cos(tAngle) * outerR;
              const ty2 = GAUGE_CY + Math.sin(tAngle) * outerR;
              return (
                <line key={`gt${i}`} x1={tx1} y1={ty1} x2={tx2} y2={ty2}
                  stroke={COLORS.deep_black} strokeWidth={gt.isMajor ? 2 : 1}
                  opacity={gt.isMajor ? 0.4 : 0.2} />
              );
            })}

            {/* Needle */}
            <line x1={CX} y1={GAUGE_CY} x2={needleX} y2={needleY}
              stroke="url(#needleGrad13)" strokeWidth={3}
              strokeLinecap="round" filter="url(#needleGlow13)" />
            <circle cx={CX} cy={GAUGE_CY} r={8}
              fill={COLORS.deep_black} stroke={currentQColor} strokeWidth={2} />

            {/* Needle tip glow */}
            <circle cx={needleX} cy={needleY} r={5}
              fill={currentQColor} opacity={0.6 + glowPulse * 0.2}
              filter="url(#gaugeGlow13)" />

            {/* Center quality display */}
            <text x={CX} y={GAUGE_CY + 55} textAnchor="middle"
              fontFamily="SF Mono, Menlo, monospace"
              fontSize={36} fontWeight={800} letterSpacing={2}
              fill={currentQColor} opacity={0.9}>
              {qualityPercent}%
            </text>
            <text x={CX} y={GAUGE_CY + 80} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={13} fontWeight={600} letterSpacing={3}
              fill={COLORS.cool_silver} opacity={0.5}>
              ACTION QUALITY
            </text>
          </g>

          {/* ── Equals sign ── */}
          <g opacity={interpolate(frame, [35, 50], [0, 0.7], { extrapolateRight: 'clamp' })}>
            <text x={CX} y={EQ_Y} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={28} fontWeight={800} letterSpacing={3}
              fill={COLORS.electric_cyan} opacity={0.6}>
              = AGENT CAPABILITY =
            </text>
          </g>

          {/* ── Action cards with quality bars ── */}
          {ACTION_CARDS.map((ac) => {
            const acEnter = interpolate(frame, [ac.delay, ac.delay + 16], [0, 1],
              { extrapolateRight: 'clamp', easing: ease });
            const acScale = scaleAnim(frame, ac.delay, 16, 0.6, 1);
            const barWidth = interpolate(frame, [ac.delay + 10, ac.delay + 35], [0, ac.quality],
              { extrapolateRight: 'clamp', easing: ease });
            const qc = qualityColor(ac.quality);

            return (
              <g key={`ac${ac.id}`}
                transform={`translate(${ac.x}, ${ac.y}) scale(${acScale})`}
                opacity={acEnter}>
                {/* Card bg */}
                <rect x={-CARD_W / 2} y={-CARD_H / 2}
                  width={CARD_W} height={CARD_H} rx={10}
                  fill={COLORS.soft_white} stroke={qc}
                  strokeWidth={1.2} opacity={0.95}
                  filter="url(#cardShadow13)" />

                {/* Icon */}
                <text x={0} y={-CARD_H / 2 + 35} textAnchor="middle"
                  fontSize={24}>{ac.icon}</text>

                {/* Label */}
                <text x={0} y={CARD_H / 2 - 38} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={12} fontWeight={700} letterSpacing={1}
                  fill={COLORS.deep_black} opacity={0.8}>
                  {ac.label}
                </text>

                {/* Quality bar track */}
                <rect x={-CARD_W / 2 + 15} y={CARD_H / 2 - 25}
                  width={CARD_W - 30} height={8} rx={4}
                  fill="#E5E7EB" opacity={0.6} />
                {/* Quality bar fill */}
                <rect x={-CARD_W / 2 + 15} y={CARD_H / 2 - 25}
                  width={(CARD_W - 30) * barWidth} height={8} rx={4}
                  fill={qc} opacity={0.8} />

                {/* Quality percent */}
                <text x={CARD_W / 2 - 18} y={CARD_H / 2 - 28}
                  textAnchor="end"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={9} fontWeight={600}
                  fill={qc} opacity={0.7}>
                  {Math.round(ac.quality * 100)}%
                </text>
              </g>
            );
          })}

          {/* ── Result label ── */}
          <g opacity={interpolate(frame, [110, 140], [0, 1], { extrapolateRight: 'clamp' })}>
            <line x1={280} y1={RESULT_Y - 25} x2={800} y2={RESULT_Y - 25}
              stroke={COLORS.electric_cyan} strokeWidth={0.5} opacity={0.15} />
            <text x={540} y={RESULT_Y + 10} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={600} fill={COLORS.cool_silver} opacity={0.65}>
              Better actions → Better outcomes
            </text>
            <text x={540} y={RESULT_Y + 48} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={400} fill="#9CA3AF" opacity={0.4}>
              Quality in = Quality out
            </text>
          </g>

          {/* ── Caption ── */}
          <CaptionBar
            text="The quality of actions available defines what the agent can accomplish."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
