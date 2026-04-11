/**
 * Scene 05 — Action Examples
 * "Calling an API, writing a file, sending a message, running a database
 *  query, clicking a button on a web page."
 * 5 action cards appearing sequentially with unique icons:
 * API, File, Message, Database, Browser
 * Duration: 239 frames (~7.97s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Card definitions ──────────────────────────────────────────────────────
interface ActionCard {
  title: string;
  subtitle: string;
  color: string;
  iconPaths: string[];
  delay: number;
  x: number;
  y: number;
}

const CARDS: ActionCard[] = [
  {
    title: 'CALL API',
    subtitle: 'HTTP / REST / GraphQL',
    color: COLORS.electric_cyan,
    iconPaths: [
      'M-18,-10 L18,-10 L18,10 L-18,10 Z',
      'M-12,-4 L12,-4',
      'M-12,0 L8,0',
      'M-12,4 L5,4',
      'M14,-14 L22,-14 L22,-6',
      'M-14,14 L-22,14 L-22,6',
    ],
    delay: 10,
    x: 280,
    y: 400,
  },
  {
    title: 'WRITE FILE',
    subtitle: 'Create / Update / Delete',
    color: COLORS.vibrant_green,
    iconPaths: [
      'M-14,-16 L6,-16 L14,-8 L14,16 L-14,16 Z',
      'M6,-16 L6,-8 L14,-8',
      'M-8,-4 L8,-4',
      'M-8,2 L8,2',
      'M-8,8 L4,8',
    ],
    delay: 45,
    x: 800,
    y: 400,
  },
  {
    title: 'SEND MESSAGE',
    subtitle: 'Email / Chat / Webhook',
    color: COLORS.amber,
    iconPaths: [
      'M-18,-10 L18,-10 L18,10 L-18,10 Z',
      'M-18,-10 L0,4 L18,-10',
      'M-18,10 L-6,0',
      'M18,10 L6,0',
    ],
    delay: 80,
    x: 280,
    y: 720,
  },
  {
    title: 'DATABASE',
    subtitle: 'Query / Insert / Update',
    color: COLORS.warm_blue,
    iconPaths: [
      'M-16,-12 C-16,-20 16,-20 16,-12',
      'M-16,-12 L-16,12 C-16,20 16,20 16,12 L16,-12',
      'M-16,-2 C-16,6 16,6 16,-2',
      'M-16,8 C-16,16 16,16 16,8',
    ],
    delay: 120,
    x: 800,
    y: 720,
  },
  {
    title: 'BROWSER',
    subtitle: 'Click / Scrape / Navigate',
    color: COLORS.purple,
    iconPaths: [
      'M-18,-14 L18,-14 L18,14 L-18,14 Z',
      'M-18,-6 L18,-6',
      'M-14,-10 A2,2,0,1,1,-10,-10',
      'M-8,-10 A2,2,0,1,1,-4,-10',
      'M-12,0 L12,0',
      'M-12,6 L6,6',
    ],
    delay: 160,
    x: 540,
    y: 1040,
  },
];

// ── Connector lines between cards ────────────────────────────────────────
const CONNECTORS = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 },
  { from: 2, to: 4 }, { from: 3, to: 4 },
];

// ── Background ambient particles ─────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 151.7 + 30) % 1080,
  y: (i * 213.3 + 40) % 1920,
  r: 1 + (i % 4) * 0.4,
  phase: i * 0.41,
  speed: 0.2 + (i % 5) * 0.1,
}));

// ── Decorative grid lines ────────────────────────────────────────────────
const GRID_V = Array.from({ length: 7 }, (_, i) => 108 + i * 144);
const GRID_H = Array.from({ length: 10 }, (_, i) => 200 + i * 160);

// ── Card hover particles (per card) ─────────────────────────────────────
const CARD_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  cardIdx: i % 5,
  angle: (i / 6) * Math.PI * 2,
  dist: 80 + (i % 4) * 15,
  size: 1.5 + (i % 3),
  speed: 0.02 + (i % 5) * 0.005,
}));

// ── Card dimensions ──────────────────────────────────────────────────────
const CARD_W = 220;
const CARD_H = 160;
const ICON_AREA = 50;

export const Scene05_ActionExamples: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Master enter ────────────────────────────────────────────────────────
  const masterEnter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.25} />

          {/* ── Faint grid ── */}
          {GRID_V.map((gx, i) => (
            <line key={`gv${i}`} x1={gx} y1={0} x2={gx} y2={1920}
              stroke={COLORS.cool_silver} strokeWidth={0.4} opacity={masterEnter * 0.04} />
          ))}
          {GRID_H.map((gy, i) => (
            <line key={`gh${i}`} x1={0} y1={gy} x2={1080} y2={gy}
              stroke={COLORS.cool_silver} strokeWidth={0.4} opacity={masterEnter * 0.04} />
          ))}

          {/* ── Background particles ── */}
          {BG_PARTICLES.map((p, i) => {
            const yOff = ((frame * p.speed + p.phase * 40) % 1920);
            const flicker = 0.15 + Math.sin(frame * 0.04 + p.phase) * 0.08;
            return (
              <circle key={`bp${i}`} cx={p.x} cy={(p.y + yOff) % 1920}
                r={p.r} fill={COLORS.electric_cyan} opacity={masterEnter * flicker} />
            );
          })}

          {/* ── Section title ── */}
          <SectionLabel x={540} y={220} text="ACTION EXAMPLES" fontSize={26}
            color={COLORS.warm_blue} opacity={masterEnter * 0.85}
            underlineColor={COLORS.electric_cyan} />

          {/* ── Subtitle ── */}
          <text x={540} y={268} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={16} fontWeight={400} letterSpacing={2}
            fill={COLORS.cool_silver} opacity={masterEnter * 0.5}>
            5 ways agents interact with the world
          </text>

          {/* ── Connector lines between cards ── */}
          {CONNECTORS.map((conn, i) => {
            const from = CARDS[conn.from];
            const to = CARDS[conn.to];
            const connDelay = Math.max(from.delay, to.delay) + 15;
            const connOp = interpolate(frame, [connDelay, connDelay + 20], [0, 0.12], { extrapolateRight: 'clamp' });
            return (
              <line key={`conn${i}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={COLORS.cool_silver} strokeWidth={1}
                strokeDasharray="6 4" opacity={connOp} />
            );
          })}

          {/* ── Card particles ── */}
          {CARD_PARTICLES.map((cp, i) => {
            const card = CARDS[cp.cardIdx];
            const cardEnter = interpolate(frame, [card.delay, card.delay + 30], [0, 1], { extrapolateRight: 'clamp' });
            const a = cp.angle + frame * cp.speed;
            const px = card.x + Math.cos(a) * cp.dist;
            const py = card.y + Math.sin(a) * cp.dist;
            return (
              <circle key={`cp${i}`} cx={px} cy={py} r={cp.size}
                fill={card.color} opacity={cardEnter * 0.15} />
            );
          })}

          {/* ── Action cards ── */}
          {CARDS.map((card, i) => {
            const cardEnter = interpolate(frame, [card.delay, card.delay + 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const cardScale = scaleAnim(frame, card.delay, 30, 0.6, 1);
            const cardSlideY = interpolate(frame, [card.delay, card.delay + 30], [40, 0], { extrapolateRight: 'clamp', easing: ease });
            const pulse = 0.5 + Math.sin(frame * 0.06 + i * 1.2) * 0.15;

            return (
              <g key={`card${i}`}
                transform={`translate(${card.x}, ${card.y + cardSlideY}) scale(${cardScale})`}
                opacity={cardEnter}>

                {/* Card glow */}
                <rect x={-CARD_W / 2 - 6} y={-CARD_H / 2 - 6}
                  width={CARD_W + 12} height={CARD_H + 12} rx={20}
                  fill={card.color} opacity={0.06 + pulse * 0.03}
                  filter="url(#softGlow)" />

                {/* Card background */}
                <rect x={-CARD_W / 2} y={-CARD_H / 2}
                  width={CARD_W} height={CARD_H} rx={16}
                  fill={COLORS.bg_paper} stroke={card.color}
                  strokeWidth={2} opacity={0.95} />

                {/* Top accent line */}
                <line x1={-CARD_W / 2 + 16} y1={-CARD_H / 2 + 2}
                  x2={CARD_W / 2 - 16} y2={-CARD_H / 2 + 2}
                  stroke={card.color} strokeWidth={3} opacity={0.5}
                  strokeLinecap="round" />

                {/* Icon area */}
                <g transform={`translate(0, ${-CARD_H / 2 + 55})`}>
                  <circle cx={0} cy={0} r={ICON_AREA / 2 + 6}
                    fill={card.color} opacity={0.08} />
                  <circle cx={0} cy={0} r={ICON_AREA / 2}
                    fill="none" stroke={card.color} strokeWidth={1.5}
                    opacity={0.3} />
                  {/* Icon paths */}
                  {card.iconPaths.map((path, pi) => (
                    <path key={pi} d={path} fill="none"
                      stroke={card.color} strokeWidth={2}
                      strokeLinecap="round" strokeLinejoin="round" />
                  ))}
                </g>

                {/* Title */}
                <text x={0} y={CARD_H / 2 - 38} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={16} fontWeight={800} letterSpacing={3}
                  fill={card.color}>
                  {card.title}
                </text>

                {/* Subtitle */}
                <text x={0} y={CARD_H / 2 - 18} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={11} fontWeight={400} letterSpacing={1}
                  fill={COLORS.cool_silver} opacity={0.6}>
                  {card.subtitle}
                </text>

                {/* Number badge */}
                <g transform={`translate(${CARD_W / 2 - 20}, ${-CARD_H / 2 + 20})`}>
                  <circle cx={0} cy={0} r={12}
                    fill={card.color} opacity={0.15} />
                  <text x={0} y={4} textAnchor="middle"
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={11} fontWeight={700} fill={card.color}>
                    {i + 1}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ── Bottom summary label ── */}
          <g opacity={interpolate(frame, [190, 220], [0, 1], { extrapolateRight: 'clamp' })}>
            <rect x={340} y={1220} width={400} height={44} rx={22}
              fill="none" stroke={COLORS.amber} strokeWidth={1.5} opacity={0.4} />
            <text x={540} y={1248} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={700} letterSpacing={4}
              fill={COLORS.amber} opacity={0.8}>
              5 ACTION TYPES
            </text>
          </g>

          {/* ── Decorative bottom bar ── */}
          <line x1={200} y1={1340} x2={880} y2={1340}
            stroke={COLORS.cool_silver} strokeWidth={0.5}
            opacity={masterEnter * 0.15} />

          {/* ── Caption ── */}
          <CaptionBar
            text="Calling an API, writing a file, sending a message, running a database query, clicking a button on a web page."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
