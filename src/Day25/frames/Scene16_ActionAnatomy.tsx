/**
 * Scene 16 — Action Anatomy
 * Visual breakdown of what an action looks like:
 * name, parameters, execution, result.
 * Code-style card showing action structure.
 * Duration: 30 frames (~1s)
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
const CARD_TOP = 320;
const CARD_W = 720;
const CARD_H = 880;
const CARD_RX = 20;
const PADDING = 40;

// ── Code lines ───────────────────────────────────────────────────────────
interface CodeLine {
  indent: number;
  text: string;
  color: string;
  isBold: boolean;
  delay: number;
  isComment: boolean;
}

const CODE_LINES: CodeLine[] = [
  { indent: 0, text: '// Action Structure', color: '#6B7280', isBold: false, delay: 2, isComment: true },
  { indent: 0, text: '{', color: COLORS.cool_silver, isBold: false, delay: 3, isComment: false },

  { indent: 1, text: '// ── NAME ──────────────────', color: '#6B7280', isBold: false, delay: 4, isComment: true },
  { indent: 1, text: '"name": "send_email",', color: COLORS.electric_cyan, isBold: true, delay: 5, isComment: false },
  { indent: 0, text: '', color: '', isBold: false, delay: 5, isComment: false },

  { indent: 1, text: '// ── DESCRIPTION ──────────', color: '#6B7280', isBold: false, delay: 6, isComment: true },
  { indent: 1, text: '"description": "Send an email', color: COLORS.vibrant_green, isBold: false, delay: 7, isComment: false },
  { indent: 2, text: 'to a specified recipient",', color: COLORS.vibrant_green, isBold: false, delay: 7, isComment: false },
  { indent: 0, text: '', color: '', isBold: false, delay: 7, isComment: false },

  { indent: 1, text: '// ── PARAMETERS ──────────', color: '#6B7280', isBold: false, delay: 8, isComment: true },
  { indent: 1, text: '"parameters": {', color: COLORS.amber, isBold: true, delay: 9, isComment: false },
  { indent: 2, text: '"to":      { type: "string" },', color: COLORS.amber, isBold: false, delay: 10, isComment: false },
  { indent: 2, text: '"subject": { type: "string" },', color: COLORS.amber, isBold: false, delay: 10, isComment: false },
  { indent: 2, text: '"body":    { type: "string" }', color: COLORS.amber, isBold: false, delay: 11, isComment: false },
  { indent: 1, text: '},', color: COLORS.amber, isBold: false, delay: 11, isComment: false },
  { indent: 0, text: '', color: '', isBold: false, delay: 11, isComment: false },

  { indent: 1, text: '// ── EXECUTION ───────────', color: '#6B7280', isBold: false, delay: 12, isComment: true },
  { indent: 1, text: '"execute": async (params) => {', color: COLORS.warm_blue, isBold: true, delay: 13, isComment: false },
  { indent: 2, text: 'return smtp.send(params);', color: COLORS.warm_blue, isBold: false, delay: 14, isComment: false },
  { indent: 1, text: '},', color: COLORS.warm_blue, isBold: false, delay: 14, isComment: false },
  { indent: 0, text: '', color: '', isBold: false, delay: 14, isComment: false },

  { indent: 1, text: '// ── RESULT ─────────────', color: '#6B7280', isBold: false, delay: 15, isComment: true },
  { indent: 1, text: '"result": {', color: COLORS.purple, isBold: true, delay: 16, isComment: false },
  { indent: 2, text: '"status": "sent",', color: COLORS.purple, isBold: false, delay: 17, isComment: false },
  { indent: 2, text: '"messageId": "abc-123"', color: COLORS.purple, isBold: false, delay: 17, isComment: false },
  { indent: 1, text: '}', color: COLORS.purple, isBold: false, delay: 17, isComment: false },

  { indent: 0, text: '}', color: COLORS.cool_silver, isBold: false, delay: 18, isComment: false },
];

const LINE_H = 28;
const INDENT_W = 28;

// ── Section highlights (vertical color bars) ─────────────────────────────
interface SectionHighlight {
  label: string;
  color: string;
  startLine: number;
  endLine: number;
  delay: number;
}

const SECTION_HIGHLIGHTS: SectionHighlight[] = [
  { label: 'NAME', color: COLORS.electric_cyan, startLine: 2, endLine: 4, delay: 5 },
  { label: 'DESC', color: COLORS.vibrant_green, startLine: 5, endLine: 8, delay: 7 },
  { label: 'PARAMS', color: COLORS.amber, startLine: 9, endLine: 15, delay: 9 },
  { label: 'EXEC', color: COLORS.warm_blue, startLine: 16, endLine: 20, delay: 13 },
  { label: 'RESULT', color: COLORS.purple, startLine: 21, endLine: 26, delay: 16 },
];

// ── Line numbers ─────────────────────────────────────────────────────────
const SHOW_LINE_NUMBERS = true;
const LINE_NUM_X = 55;

// ── Window dots (macOS style) ────────────────────────────────────────────
const WINDOW_DOTS = [
  { cx: -CARD_W / 2 + 35, cy: -CARD_H / 2 + 25, color: '#EF4444' },
  { cx: -CARD_W / 2 + 58, cy: -CARD_H / 2 + 25, color: '#F59E0B' },
  { cx: -CARD_W / 2 + 81, cy: -CARD_H / 2 + 25, color: '#22C55E' },
];

// ── Particles ────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 171.3 + 25) % 1080,
  y: (i * 219.7 + 40) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.31,
}));

export const Scene16_ActionAnatomy: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ─────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const cardScale = scaleAnim(frame, 0, 12, 0.85, 1);
  const captionOp = interpolate(frame, [2, 10], [0, 1], { extrapolateRight: 'clamp' });
  const glowPulse = 0.5 + Math.sin(frame * 0.12) * 0.15;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="cardGlow16">
              <feGaussianBlur stdDeviation="12" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.15" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="cardBg16" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1D23" />
              <stop offset="100%" stopColor="#12151A" />
            </linearGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Particles ── */}
          {PARTICLES.map((p, i) => {
            const pulse = Math.sin(frame * 0.04 + p.phase) * 0.2 + 0.3;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.electric_cyan} opacity={enter * pulse * 0.04} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={540} y={180} text="ANATOMY OF AN ACTION" fontSize={26}
            color={COLORS.electric_cyan} opacity={enter * 0.85}
            underlineColor={COLORS.electric_cyan} />

          <text x={540} y={228} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={17} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.5}>
            Structure and components
          </text>

          {/* ── Code card ── */}
          <g transform={`translate(${CX}, ${CARD_TOP + CARD_H / 2}) scale(${cardScale})`}
            opacity={enter}>

            {/* Card background */}
            <rect x={-CARD_W / 2} y={-CARD_H / 2}
              width={CARD_W} height={CARD_H} rx={CARD_RX}
              fill="url(#cardBg16)" stroke={COLORS.electric_cyan}
              strokeWidth={1} opacity={0.95}
              filter="url(#cardGlow16)" />

            {/* Window dots */}
            {WINDOW_DOTS.map((wd, i) => (
              <circle key={`wd${i}`} cx={wd.cx} cy={wd.cy} r={6}
                fill={wd.color} opacity={0.8} />
            ))}

            {/* Title bar */}
            <line x1={-CARD_W / 2} y1={-CARD_H / 2 + 48}
              x2={CARD_W / 2} y2={-CARD_H / 2 + 48}
              stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={0.1} />
            <text x={0} y={-CARD_H / 2 + 30} textAnchor="middle"
              fontFamily="SF Mono, Menlo, monospace"
              fontSize={11} fontWeight={600} letterSpacing={2}
              fill={COLORS.cool_silver} opacity={0.4}>
              action.schema.json
            </text>

            {/* ── Section highlight bars ── */}
            {SECTION_HIGHLIGHTS.map((sh, i) => {
              const shOp = interpolate(frame, [sh.delay, sh.delay + 5], [0, 0.08], { extrapolateRight: 'clamp' });
              const shY = -CARD_H / 2 + 50 + sh.startLine * LINE_H;
              const shH = (sh.endLine - sh.startLine + 1) * LINE_H;
              return (
                <g key={`sh${i}`}>
                  {/* Background highlight */}
                  <rect x={-CARD_W / 2 + 5} y={shY}
                    width={CARD_W - 10} height={shH} rx={4}
                    fill={sh.color} opacity={shOp} />
                  {/* Side bar */}
                  <rect x={-CARD_W / 2 + 8} y={shY + 4}
                    width={3} height={shH - 8} rx={1.5}
                    fill={sh.color} opacity={shOp * 4 + glowPulse * 0.1} />
                </g>
              );
            })}

            {/* ── Code lines ── */}
            {CODE_LINES.map((cl, i) => {
              if (!cl.text) return null;
              const clOp = interpolate(frame, [cl.delay, cl.delay + 4], [0, 1], { extrapolateRight: 'clamp' });
              const lineY = -CARD_H / 2 + 50 + i * LINE_H + LINE_H * 0.65;
              const lineX = -CARD_W / 2 + PADDING + cl.indent * INDENT_W + (SHOW_LINE_NUMBERS ? 30 : 0);

              return (
                <g key={`cl${i}`} opacity={clOp}>
                  {/* Line number */}
                  {SHOW_LINE_NUMBERS && (
                    <text x={-CARD_W / 2 + LINE_NUM_X} y={lineY}
                      textAnchor="end"
                      fontFamily="SF Mono, Menlo, monospace"
                      fontSize={11} fontWeight={400}
                      fill="#4B5563" opacity={0.4}>
                      {i + 1}
                    </text>
                  )}
                  {/* Code text */}
                  <text x={lineX} y={lineY}
                    fontFamily="SF Mono, Menlo, monospace"
                    fontSize={cl.isComment ? 11 : 13}
                    fontWeight={cl.isBold ? 700 : 400}
                    fontStyle={cl.isComment ? 'italic' : 'normal'}
                    fill={cl.color} opacity={cl.isComment ? 0.5 : 0.85}>
                    {cl.text}
                  </text>
                </g>
              );
            })}

            {/* ── Section labels on right side ── */}
            {SECTION_HIGHLIGHTS.map((sh, i) => {
              const slOp = interpolate(frame, [sh.delay + 2, sh.delay + 6], [0, 0.7], { extrapolateRight: 'clamp' });
              const slY = -CARD_H / 2 + 50 + ((sh.startLine + sh.endLine) / 2) * LINE_H + LINE_H * 0.5;
              return (
                <g key={`sl${i}`} opacity={slOp}>
                  <rect x={CARD_W / 2 - 75} y={slY - 11}
                    width={60} height={22} rx={4}
                    fill={sh.color} opacity={0.15} />
                  <text x={CARD_W / 2 - 45} y={slY + 4}
                    textAnchor="middle"
                    fontFamily="SF Mono, Menlo, monospace"
                    fontSize={9} fontWeight={700} letterSpacing={1}
                    fill={sh.color}>
                    {sh.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── Bottom text ── */}
          <g opacity={interpolate(frame, [18, 26], [0, 1], { extrapolateRight: 'clamp' })}>
            <text x={540} y={1300} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={20} fontWeight={600} fill={COLORS.cool_silver} opacity={0.6}>
              Name → Params → Execute → Result
            </text>
            <text x={540} y={1336} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={15} fontWeight={400} fill="#9CA3AF" opacity={0.35}>
              Every action follows this structure
            </text>
          </g>

          {/* ── Caption ── */}
          <CaptionBar
            text="Anatomy of an action: name, parameters, execution, result."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
