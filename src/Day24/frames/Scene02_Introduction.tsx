/**
 * Scene 02 — Introduction
 * "This is day 24 of learning Agentic AI from first principles."
 * Paper background, animated text reveal, subtle AI robot in bg.
 * Orbit concept nodes, section label, premium caption bar.
 * Duration: 134 frames (4.46s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets, AIRobot,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Concept orbit nodes ────────────────────────────────────────────────────
const ORBIT_NODES = [
  { label: 'DAY 24',           angle: -45,  dist: 280, color: '#00E5FF' },
  { label: 'AGENTIC AI',       angle:  45,  dist: 280, color: '#3B82F6' },
  { label: 'FIRST\nPRINCIPLES', angle: 135, dist: 280, color: '#22C55E' },
  { label: 'THE LOOP',         angle: 225,  dist: 280, color: '#F59E0B' },
];

const ORBIT_CX = 540;
const ORBIT_CY = 1200;

// ── Floating keywords ──────────────────────────────────────────────────────
const KEYWORDS = [
  { text: 'perceive', x: 120, y: 450, size: 22, color: '#22C55E' },
  { text: 'think',    x: 900, y: 520, size: 20, color: '#3B82F6' },
  { text: 'act',      x: 180, y: 1580, size: 24, color: '#F59E0B' },
  { text: 'observe',  x: 860, y: 1500, size: 20, color: '#A78BFA' },
  { text: 'loop',     x: 140, y: 1050, size: 18, color: '#00E5FF' },
  { text: 'repeat',   x: 920, y: 980, size: 18, color: '#EF4444' },
];

// ── Subtle background circuit dots ─────────────────────────────────────────
const BG_DOTS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 173.5) % 1080,
  y: (i * 241.3) % 1920,
  r: 2 + (i % 3) * 1.2,
}));

export const Scene02_Introduction: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const robotEnter = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [15, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [15, 50], [60, 0], { extrapolateRight: 'clamp', easing: ease });
  const subtitleEnter = interpolate(frame, [30, 65], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const orbitSpin = frame * 0.12;
  const kwFloat = Math.sin(frame * 0.06) * 8;
  const badgeEnter = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });
  const dayBadgeScale = scaleAnim(frame, 20, 40, 0.7, 1);
  const pulse = 0.9 + Math.sin(frame * 0.1) * 0.1;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.28}/>

          {/* ── Subtle background circuit dots ── */}
          {BG_DOTS.map((d, i) => (
            <circle key={`bg${i}`}
              cx={d.x} cy={d.y} r={d.r}
              fill={COLORS.electric_cyan}
              opacity={0.025 + Math.abs(Math.sin(i * 0.7)) * 0.015}/>
          ))}

          {/* ── Vertical accent lines ── */}
          {[0, 1, 2, 3].map(i => (
            <line key={`vl${i}`}
              x1={100 + i * 260} y1={0} x2={80 + i * 260} y2={1920}
              stroke={COLORS.electric_cyan} strokeWidth={0.6} opacity={0.035}/>
          ))}

          {/* ── Ambient glow behind robot ── */}
          <ellipse cx={540} cy={420} rx={280} ry={360}
            fill={COLORS.electric_cyan} opacity={0.03 * robotEnter}/>

          {/* ── Floating keywords (subtle watermark effect) ── */}
          {KEYWORDS.map((kw, i) => {
            const kwEnter = interpolate(frame, [20 + i * 8, 50 + i * 8], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={kw.text}
                x={kw.x} y={kw.y + kwFloat * (i % 2 === 0 ? 1 : -1)}
                fontFamily="'Inter', sans-serif" fontSize={kw.size} fontWeight={700}
                fill={kw.color} opacity={kwEnter * 0.08}
                letterSpacing="0.08em"
                textAnchor="middle">
                {kw.text.toUpperCase()}
              </text>
            );
          })}

          {/* ── AI Robot (upper half) ── */}
          <AIRobot
            cx={540} cy={100}
            scale={robotEnter} opacity={robotEnter}
            coreGlow={pulse} eyeColor="#00E5FF"
            frame={frame} variant="active"/>

          {/* ── Day badge chip ── */}
          <g opacity={badgeEnter}
            transform={`translate(540, 820) scale(${dayBadgeScale})`}>
            {/* Glow */}
            <rect x={-100} y={-30} width={200} height={60} rx={30}
              fill={COLORS.electric_cyan} opacity={0.12} filter="url(#softGlow)"/>
            {/* Badge bg */}
            <rect x={-96} y={-28} width={192} height={56} rx={28}
              fill={COLORS.deep_black} stroke={COLORS.electric_cyan} strokeWidth={2}/>
            <text x={0} y={6} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800}
              fill={COLORS.electric_cyan} letterSpacing="0.14em">
              DAY 24
            </text>
          </g>

          {/* ── Orbit section (lower half) ── */}

          {/* Outer orbit ring */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={280}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}
            strokeDasharray="14 10" opacity={0.16 * robotEnter}
            transform={`rotate(${orbitSpin}, ${ORBIT_CX}, ${ORBIT_CY})`}/>
          {/* Mid orbit ring */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={240}
            fill="none" stroke={COLORS.warm_blue} strokeWidth={0.8}
            opacity={0.1 * robotEnter}/>
          {/* Inner ring */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={160}
            fill="none" stroke={COLORS.purple} strokeWidth={0.6}
            opacity={0.08 * robotEnter}
            strokeDasharray="8 6"/>

          {/* Center dot */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={10}
            fill={COLORS.electric_cyan} opacity={0.35 * robotEnter}
            filter="url(#cyanGlow)"/>
          {/* Center cross */}
          <line x1={ORBIT_CX - 16} y1={ORBIT_CY} x2={ORBIT_CX + 16} y2={ORBIT_CY}
            stroke={COLORS.electric_cyan} strokeWidth={1.5} opacity={0.3 * robotEnter}/>
          <line x1={ORBIT_CX} y1={ORBIT_CY - 16} x2={ORBIT_CX} y2={ORBIT_CY + 16}
            stroke={COLORS.electric_cyan} strokeWidth={1.5} opacity={0.3 * robotEnter}/>

          {/* Orbit nodes */}
          {ORBIT_NODES.map((n, i) => {
            const rad = ((n.angle + orbitSpin * (i % 2 === 0 ? 1 : -0.7)) * Math.PI) / 180;
            const nx = ORBIT_CX + Math.cos(rad) * n.dist;
            const ny = ORBIT_CY + Math.sin(rad) * n.dist;
            const nEnter = interpolate(frame, [10 + i * 10, 38 + i * 10], [0, 1], { extrapolateRight: 'clamp' });
            const lines = n.label.split('\n');
            return (
              <g key={i} opacity={nEnter}>
                {/* Connector */}
                <line x1={ORBIT_CX} y1={ORBIT_CY} x2={nx} y2={ny}
                  stroke={n.color} strokeWidth={1.5} opacity={0.2}/>
                {/* Glow halo */}
                <circle cx={nx} cy={ny} r={52}
                  fill={n.color} opacity={0.06} filter="url(#softGlow)"/>
                {/* Node circle */}
                <circle cx={nx} cy={ny} r={46}
                  fill="#F5F0E8" stroke={n.color} strokeWidth={3}
                  filter="url(#shadow)"/>
                {/* Inner ring */}
                <circle cx={nx} cy={ny} r={40}
                  fill="none" stroke={n.color} strokeWidth={1} opacity={0.3}/>
                {/* Label */}
                {lines.map((line, li) => (
                  <text key={li}
                    x={nx} y={ny + li * 20 - (lines.length - 1) * 10}
                    textAnchor="middle" dominantBaseline="middle"
                    fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={800}
                    fill={n.color} letterSpacing="0.02em">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* ── Decorative horizontal divider ── */}
          <line x1={140} y1={870} x2={940} y2={870}
            stroke={COLORS.warm_blue} strokeWidth={1.2} opacity={badgeEnter * 0.15}/>
          <circle cx={540} cy={870} r={4}
            fill={COLORS.warm_blue} opacity={badgeEnter * 0.3}/>

          {/* ── Series progress bar ── */}
          <g opacity={subtitleEnter * 0.6}>
            {/* Track */}
            <rect x={200} y={1040} width={680} height={6} rx={3}
              fill={COLORS.deep_black} opacity={0.08}/>
            {/* Filled portion (24/30 days) */}
            <rect x={200} y={1040}
              width={interpolate(frame, [40, 80], [0, 680 * (24 / 30)], { extrapolateRight: 'clamp' })}
              height={6} rx={3}
              fill={COLORS.warm_blue} opacity={0.5}/>
            {/* Progress dot */}
            <circle cx={200 + 680 * (24 / 30)} cy={1043} r={8}
              fill={COLORS.warm_blue} opacity={subtitleEnter * 0.7}/>
            {/* Labels */}
            <text x={200} y={1072} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={14} fontWeight={600}
              fill={COLORS.light_gray} opacity={0.5}>DAY 1</text>
            <text x={880} y={1072} textAnchor="end"
              fontFamily="'Inter', sans-serif" fontSize={14} fontWeight={600}
              fill={COLORS.light_gray} opacity={0.5}>DAY 30</text>
            <text x={200 + 680 * (24 / 30)} y={1072} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={14} fontWeight={800}
              fill={COLORS.warm_blue}>DAY 24</text>
          </g>

          {/* ── Bottom section: preview of what's coming ── */}
          <g opacity={subtitleEnter}>
            {/* Container card */}
            <rect x={100} y={1100} width={880} height={320} rx={20}
              fill="#F9FAFB" stroke={COLORS.electric_cyan} strokeWidth={1.5}
              filter="url(#shadow)" opacity={0.85}/>
            {/* Left accent bar */}
            <rect x={100} y={1100} width={6} height={320} rx={3}
              fill={COLORS.electric_cyan}/>

            {/* Section title */}
            <text x={160} y={1148} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={800}
              fill={COLORS.electric_cyan} letterSpacing="0.12em">
              TODAY WE LEARN
            </text>

            {/* Topic list items */}
            {[
              { text: 'The Agent Loop — perceive, think, act, observe', y: 1195, color: COLORS.warm_blue },
              { text: 'Why the loop is the heartbeat of every agent', y: 1240, color: COLORS.deep_black },
              { text: 'How it separates models from agents', y: 1285, color: COLORS.deep_black },
              { text: 'Why every concept builds on this loop', y: 1330, color: COLORS.deep_black },
            ].map((item, i) => {
              const itemEnter = interpolate(frame, [55 + i * 8, 75 + i * 8], [0, 1], { extrapolateRight: 'clamp' });
              return (
                <g key={i} opacity={itemEnter}>
                  {/* Bullet */}
                  <circle cx={172} cy={item.y - 6} r={5}
                    fill={i === 0 ? COLORS.electric_cyan : COLORS.light_gray}
                    opacity={i === 0 ? 0.8 : 0.4}/>
                  {/* Text */}
                  <text x={194} y={item.y} textAnchor="start"
                    fontFamily="'Inter', sans-serif" fontSize={22}
                    fontWeight={i === 0 ? 700 : 500}
                    fill={item.color}>
                    {item.text}
                  </text>
                </g>
              );
            })}

            {/* Decorative loop icon in bottom-right */}
            <g opacity={subtitleEnter * 0.2}>
              <circle cx={900} cy={1350} r={40}
                fill="none" stroke={COLORS.electric_cyan} strokeWidth={2}
                strokeDasharray="12 8"/>
              <polygon points="900,1310 894,1322 906,1322"
                fill={COLORS.electric_cyan}/>
            </g>
          </g>

          {/* ── Decorative: floating data particles ── */}
          {Array.from({ length: 8 }, (_, i) => {
            const px = 120 + i * 120;
            const py = 1500 + Math.sin(i * 1.2) * 40;
            const pEnter = interpolate(frame, [60 + i * 4, 85 + i * 4], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={`dp${i}`} opacity={pEnter * 0.15}>
                <rect x={px - 20} y={py - 8} width={40} height={16} rx={4}
                  fill={COLORS.electric_cyan}/>
              </g>
            );
          })}

          {/* ── Ambient hex pattern (very faint) ── */}
          {Array.from({ length: 6 }, (_, i) => {
            const hx = 180 + i * 160;
            const hy = 1600;
            const hexSize = 24;
            const hexPoints = Array.from({ length: 6 }, (__, j) => {
              const angle = (Math.PI / 3) * j - Math.PI / 6;
              return `${hx + hexSize * Math.cos(angle)},${hy + hexSize * Math.sin(angle)}`;
            }).join(' ');
            return (
              <polygon key={`hex${i}`}
                points={hexPoints}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={0.8} opacity={robotEnter * 0.04}/>
            );
          })}
        </svg>

        {/* ── DOM text layer ── */}

        {/* Main title */}
        <div style={{
          position: 'absolute', top: 880, left: 80, right: 80,
          opacity: titleEnter,
          transform: `translateY(${titleSlide}px)`,
        }}>
          <div style={{
            fontSize: 64, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.08, letterSpacing: '-0.03em',
            textAlign: 'center',
          }}>
            The{' '}
            <span style={{ color: COLORS.warm_blue }}>Agent Loop</span>
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          position: 'absolute', top: 970, left: 100, right: 100,
          opacity: subtitleEnter,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 28, fontWeight: 500,
            color: COLORS.light_gray,
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.4,
          }}>
            Learning Agentic AI from first principles
          </div>
        </div>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="This is day 24 of learning agentic AI from first principles."
          opacity={captionEnter}
          highlightWords={['day 24', 'agentic AI', 'first principles']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
