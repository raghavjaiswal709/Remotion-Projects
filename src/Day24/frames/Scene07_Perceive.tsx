/**
 * Scene 07 — Perceive
 * "The agent takes in information about the world. That is perceive."
 * WorldGlobe with data streams flowing to an AIRobot.
 * Blue theme (#3B82F6), sensor/eye imagery, data particles flowing.
 * Duration: 109 frames (3.63s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  AIRobot, WorldGlobe,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const BLUE = '#3B82F6';

// ── Data stream particles flowing from globe to robot ──────────────────────
const STREAM_PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  delay: i * 3.5,
  speed: 0.6 + (i % 5) * 0.12,
  offsetX: (Math.sin(i * 1.3) * 30),
  offsetY: (Math.cos(i * 1.7) * 20),
  size: 3 + (i % 3) * 1.5,
  type: i % 4, // 0=circle, 1=square, 2=triangle, 3=diamond
}));

// ── Sensor ring positions around the robot ─────────────────────────────────
const SENSOR_RINGS = Array.from({ length: 5 }, (_, i) => ({
  r: 80 + i * 28,
  delay: i * 6,
  width: 2 - i * 0.25,
}));

// ── Floating data labels ───────────────────────────────────────────────────
const DATA_LABELS = [
  { text: 'user_input', x: 200, y: 580 },
  { text: 'api_response', x: 140, y: 680 },
  { text: 'env_state', x: 220, y: 780 },
  { text: 'sensor_data', x: 160, y: 880 },
  { text: 'context', x: 240, y: 480 },
];

// ── Eye/sensor detail particles ────────────────────────────────────────────
const EYE_PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * Math.PI * 2,
  dist: 40 + (i % 3) * 15,
  size: 2 + (i % 2),
  speed: 0.04 + (i % 4) * 0.01,
}));

// ── Background ambient dots ────────────────────────────────────────────────
const BG_DOTS = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 157.3 + 40) % 1080,
  y: (i * 213.7 + 80) % 1920,
  r: 1 + (i % 3) * 0.8,
  phase: i * 0.6,
}));

// ── Information wave arcs ──────────────────────────────────────────────────
const WAVE_ARCS = Array.from({ length: 6 }, (_, i) => ({
  r: 120 + i * 35,
  startAngle: -40 - i * 5,
  endAngle: 40 + i * 5,
  delay: i * 4,
}));

export const Scene07_Perceive: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const globalEnter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [3, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [3, 25], [40, 0], { extrapolateRight: 'clamp', easing: ease });
  const globeEnter = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const globeScale = scaleAnim(frame, 10, 25, 0.3, 1);
  const robotEnter = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const robotScale = scaleAnim(frame, 20, 25, 0.3, 1);
  const streamEnter = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const labelsEnter = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const eyeEnter = interpolate(frame, [50, 72], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bottomEnter = interpolate(frame, [60, 82], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Globe position & Robot position
  const globeCX = 260;
  const globeCY = 620;
  const robotCX = 800;
  const robotCY = 600;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.2} />

          {/* ── Extra defs ── */}
          <defs>
            <filter id="blueGlow07" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feFlood floodColor={BLUE} floodOpacity="0.45" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="streamGlow07" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor={BLUE} floodOpacity="0.6" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="streamGrad07" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={BLUE} stopOpacity="0.8" />
              <stop offset="50%" stopColor={COLORS.electric_cyan} stopOpacity="1" />
              <stop offset="100%" stopColor={BLUE} stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="eyeCenter07" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.9" />
              <stop offset="60%" stopColor={BLUE} stopOpacity="0.4" />
              <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dataFlow07" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={BLUE} stopOpacity="0" />
              <stop offset="30%" stopColor={BLUE} stopOpacity="0.8" />
              <stop offset="70%" stopColor={COLORS.electric_cyan} stopOpacity="0.8" />
              <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ── Background ambient dots ── */}
          {BG_DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r}
              fill={BLUE}
              opacity={globalEnter * (0.04 + Math.sin(frame * 0.03 + d.phase) * 0.02)} />
          ))}

          {/* ── Section label ── */}
          <g opacity={globalEnter}>
            <rect x={80} y={60} width={250} height={52} rx={12}
              fill={BLUE} opacity={0.9} />
            <text x={205} y={94} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={900}
              fill="white" letterSpacing="0.10em">PERCEIVE</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={200} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={54} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              Taking In The World
            </text>
            <text x={540} y={255} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600}
              fill={BLUE} opacity={0.8}>
              Step 1: Perceive
            </text>
          </g>

          {/* ── Divider ── */}
          <line x1={200} y1={300} x2={880} y2={300}
            stroke={BLUE} strokeWidth={1.5} opacity={titleEnter * 0.2} />

          {/* ── WorldGlobe ── */}
          <g opacity={globeEnter} transform={`translate(0,0) scale(1)`}>
            <WorldGlobe cx={globeCX} cy={globeCY} r={110 * globeScale}
              opacity={globeEnter} scale={1} glowColor={BLUE} />
          </g>

          {/* ── Information wave arcs from globe ── */}
          {WAVE_ARCS.map((arc, i) => {
            const waveOp = interpolate(frame, [15 + arc.delay, 40 + arc.delay], [0, 1], { extrapolateRight: 'clamp' });
            const pulse = 0.3 + Math.sin(frame * 0.06 + i) * 0.15;
            const startRad = arc.startAngle * Math.PI / 180;
            const endRad = arc.endAngle * Math.PI / 180;
            const path = `M ${globeCX + arc.r * Math.cos(startRad)} ${globeCY + arc.r * Math.sin(startRad)} A ${arc.r} ${arc.r} 0 0 1 ${globeCX + arc.r * Math.cos(endRad)} ${globeCY + arc.r * Math.sin(endRad)}`;
            return (
              <path key={i} d={path} fill="none" stroke={BLUE}
                strokeWidth={1.5} opacity={waveOp * pulse * streamEnter}
                strokeLinecap="round" />
            );
          })}

          {/* ── Data stream particles (globe → robot) ── */}
          {STREAM_PARTICLES.map((p) => {
            const t = ((frame - 30 - p.delay * 0.8) * p.speed * 0.025) % 1;
            if (t < 0 || streamEnter < 0.1) return null;
            const px = globeCX + (robotCX - globeCX) * t + p.offsetX * Math.sin(t * Math.PI);
            const py = globeCY + (robotCY - globeCY) * t + p.offsetY * Math.cos(t * Math.PI * 2);
            const particleOp = Math.sin(t * Math.PI) * streamEnter * 0.8;
            return (
              <g key={p.id}>
                {p.type === 0 && <circle cx={px} cy={py} r={p.size} fill={BLUE} opacity={particleOp} filter="url(#streamGlow07)" />}
                {p.type === 1 && <rect x={px - p.size} y={py - p.size} width={p.size * 2} height={p.size * 2} fill={COLORS.electric_cyan} opacity={particleOp} rx={1} />}
                {p.type === 2 && <polygon points={`${px},${py - p.size * 1.5} ${px - p.size},${py + p.size} ${px + p.size},${py + p.size}`} fill={BLUE} opacity={particleOp} />}
                {p.type === 3 && <polygon points={`${px},${py - p.size * 1.2} ${px + p.size},${py} ${px},${py + p.size * 1.2} ${px - p.size},${py}`} fill={COLORS.electric_cyan} opacity={particleOp} />}
              </g>
            );
          })}

          {/* ── Main data flow line ── */}
          <line x1={globeCX + 120} y1={globeCY} x2={robotCX - 80} y2={robotCY}
            stroke="url(#dataFlow07)" strokeWidth={3} opacity={streamEnter * 0.4}
            strokeDasharray="12 6"
            strokeDashoffset={-frame * 2} />

          {/* ── AIRobot ── */}
          <AIRobot cx={robotCX} cy={robotCY} scale={robotScale * 0.95}
            opacity={robotEnter} coreGlow={0.6 + Math.sin(frame * 0.08) * 0.2}
            frame={frame} variant="active" />

          {/* ── Sensor rings around robot ── */}
          {SENSOR_RINGS.map((ring, i) => {
            const ringOp = interpolate(frame, [25 + ring.delay, 45 + ring.delay], [0, 1], { extrapolateRight: 'clamp' });
            const pulse = ((frame + ring.delay) % 40) / 40;
            const ringScale = 1 + pulse * 0.12;
            return (
              <circle key={i}
                cx={robotCX} cy={robotCY}
                r={ring.r * ringScale}
                fill="none" stroke={BLUE}
                strokeWidth={ring.width}
                opacity={ringOp * (1 - pulse) * 0.3 * robotEnter}
                strokeDasharray="6 4" />
            );
          })}

          {/* ── Floating data labels ── */}
          {DATA_LABELS.map((dl, i) => {
            const dlOp = interpolate(frame, [42 + i * 5, 60 + i * 5], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const dlSlide = interpolate(frame, [42 + i * 5, 60 + i * 5], [20, 0], { extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={i} opacity={dlOp * labelsEnter}>
                <rect x={dl.x - 8} y={dl.y - 14 + dlSlide} width={dl.text.length * 10 + 16} height={28} rx={6}
                  fill={BLUE} opacity={0.1} />
                <text x={dl.x} y={dl.y + 4 + dlSlide} textAnchor="start"
                  fontFamily="'Courier New', monospace" fontSize={15} fontWeight={600}
                  fill={BLUE} opacity={0.7}>
                  {dl.text}
                </text>
                {/* Connecting dot to stream */}
                <circle cx={dl.x + dl.text.length * 5} cy={dl.y + 18 + dlSlide}
                  r={2} fill={BLUE} opacity={0.4} />
              </g>
            );
          })}

          {/* ── Large eye/sensor visual ── */}
          <g opacity={eyeEnter} transform={`translate(540, 1050)`}>
            {/* Outer eye shape */}
            <ellipse cx={0} cy={0} rx={120} ry={65} fill="none" stroke={BLUE}
              strokeWidth={3} opacity={0.6} />
            <ellipse cx={0} cy={0} rx={100} ry={50} fill="none" stroke={BLUE}
              strokeWidth={1.5} opacity={0.3} />

            {/* Iris */}
            <circle cx={0} cy={0} r={35} fill="url(#eyeCenter07)" />
            <circle cx={0} cy={0} r={35} fill="none" stroke={BLUE} strokeWidth={2.5} opacity={0.7} />

            {/* Pupil */}
            <circle cx={Math.sin(frame * 0.06) * 5} cy={Math.cos(frame * 0.08) * 3}
              r={14} fill={COLORS.deep_black} opacity={0.85} />
            <circle cx={Math.sin(frame * 0.06) * 5 - 4} cy={Math.cos(frame * 0.08) * 3 - 5}
              r={4} fill="white" opacity={0.7} />

            {/* Eye particles */}
            {EYE_PARTICLES.map((ep, i) => {
              const epAngle = ep.angle + frame * ep.speed;
              const epX = Math.cos(epAngle) * ep.dist;
              const epY = Math.sin(epAngle) * ep.dist * 0.55;
              return (
                <circle key={i} cx={epX} cy={epY} r={ep.size}
                  fill={BLUE} opacity={0.4 + Math.sin(frame * 0.05 + i) * 0.2} />
              );
            })}

            {/* PERCEIVE label below */}
            <text x={0} y={100} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={900}
              fill={BLUE} letterSpacing="0.18em" opacity={0.8}>
              PERCEIVE
            </text>
            <text x={0} y={130} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={500}
              fill={COLORS.light_gray}>
              Gathering inputs from the environment
            </text>
          </g>

          {/* ── Bottom insight box ── */}
          <g opacity={bottomEnter}>
            <rect x={120} y={1280} width={840} height={160} rx={18}
              fill="#F9FAFB" stroke={BLUE} strokeWidth={1.5}
              filter="url(#shadow)" opacity={0.9} />
            <rect x={120} y={1280} width={6} height={160} rx={3} fill={BLUE} />
            <text x={170} y={1330} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={COLORS.deep_black}>
              The agent takes in information
            </text>
            <text x={170} y={1368} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={BLUE}>
              about the world.
            </text>
            <text x={170} y={1410} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
              fill={COLORS.light_gray}>
              User input · API responses · Environment state · Sensor data
            </text>
          </g>

          {/* ── Flow direction arrow ── */}
          <g opacity={streamEnter * 0.6}>
            <text x={540} y={530} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
              fill={BLUE} opacity={0.5}>
              WORLD → AGENT
            </text>
            <line x1={460} y1={540} x2={620} y2={540}
              stroke={BLUE} strokeWidth={2} opacity={0.3}
              markerEnd="url(#arrowBlue07)" />
          </g>

          {/* ── Decorative circuit traces ── */}
          {[0, 1, 2, 3].map(i => {
            const y = 1500 + i * 40;
            const len = interpolate(frame, [5 + i * 8, 40 + i * 8], [0, 200 + i * 60], { extrapolateRight: 'clamp' });
            return (
              <line key={i} x1={100 + i * 30} y1={y} x2={100 + i * 30 + len} y2={y}
                stroke={BLUE} strokeWidth={1} opacity={globalEnter * 0.06}
                strokeLinecap="round" />
            );
          })}
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="The agent takes in information about the world. That is perceive."
          opacity={captionEnter}
          highlightWords={['perceive', 'information', 'world']} />
      </PaperBackground>
    </AbsoluteFill>
  );
};
