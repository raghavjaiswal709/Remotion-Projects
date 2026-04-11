/**
 * Scene 10 — Observe
 * "It receives the result of that action back. That is observe."
 * Amber/orange theme (#F59E0B), eye/radar visual, data flowing back,
 * result returning, feedback animation.
 * Duration: 114 frames (3.8s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  AIRobot,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const AMBER = '#F59E0B';
const AMBER_DEEP = '#B45309';
const AMBER_LIGHT = '#FCD34D';

// ── Radar sweep parameters ─────────────────────────────────────────────────
const RADAR_RINGS = [60, 100, 140, 180, 220];
const RADAR_CX = 540;
const RADAR_CY = 560;

// ── Data result packets flowing back ───────────────────────────────────────
const RESULT_PACKETS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: i * 4,
  speed: 0.5 + (i % 4) * 0.15,
  offsetX: Math.sin(i * 1.9) * 35,
  offsetY: Math.cos(i * 2.3) * 20,
  size: 3 + (i % 3) * 1.5,
  type: i % 3, // 0=circle, 1=square, 2=hexagon
}));

// ── Feedback arrows (result → agent) ───────────────────────────────────────
const FEEDBACK_ARROWS = [
  { fromX: 200, fromY: 900, toX: 540, toY: 700, delay: 0 },
  { fromX: 880, fromY: 900, toX: 540, toY: 700, delay: 8 },
  { fromX: 540, fromY: 1000, toX: 540, toY: 700, delay: 16 },
];

// ── Result data blocks ─────────────────────────────────────────────────────
const RESULT_BLOCKS = [
  { text: '200 OK', icon: '✓', x: 160, y: 860, status: 'success' },
  { text: 'data: [...]', icon: '📦', x: 440, y: 920, status: 'data' },
  { text: 'error: null', icon: '✓', x: 720, y: 860, status: 'success' },
  { text: 'tokens: 142', icon: '🔢', x: 300, y: 1000, status: 'info' },
  { text: 'latency: 45ms', icon: '⏱', x: 660, y: 1000, status: 'info' },
];

// ── Concentric pulse rings (at result source) ──────────────────────────────
const PULSE_SOURCES = [
  { cx: 200, cy: 900, delay: 0 },
  { cx: 880, cy: 900, delay: 10 },
  { cx: 540, cy: 1050, delay: 20 },
];

// ── Background ambient particles ───────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 34 }, (_, i) => ({
  x: (i * 167.3 + 35) % 1080,
  y: (i * 221.7 + 55) % 1920,
  r: 1 + (i % 3) * 0.7,
  speed: 0.1 + (i % 5) * 0.07,
  phase: i * 0.58,
}));

// ── Scan lines for radar ───────────────────────────────────────────────────
const SCAN_BLIPS = Array.from({ length: 6 }, (_, i) => ({
  angle: (i / 6) * Math.PI * 2 + 0.3,
  dist: 80 + (i % 3) * 50,
  size: 4 + (i % 2) * 2,
}));

// ── Eye detail geometry ────────────────────────────────────────────────────
const EYE_LASHES = Array.from({ length: 10 }, (_, i) => ({
  angle: (i / 10) * Math.PI - Math.PI / 2,
  len: 12 + (i % 3) * 4,
}));

export const Scene10_Observe: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const globalEnter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [3, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [3, 24], [40, 0], { extrapolateRight: 'clamp', easing: ease });
  const radarEnter = interpolate(frame, [10, 38], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const radarScale = scaleAnim(frame, 10, 28, 0.3, 1);
  const robotEnter = interpolate(frame, [18, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const resultsEnter = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const feedbackEnter = interpolate(frame, [42, 68], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const eyeEnter = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bottomEnter = interpolate(frame, [70, 92], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Radar sweep angle
  const sweepAngle = (frame * 3.5) % 360;
  const sweepRad = sweepAngle * Math.PI / 180;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.2} />

          {/* ── Extra defs ── */}
          <defs>
            <filter id="amberGlow10" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feFlood floodColor={AMBER} floodOpacity="0.45" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="resultGlow10" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feFlood floodColor={AMBER_LIGHT} floodOpacity="0.5" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="radarGrad10" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={AMBER_LIGHT} stopOpacity="0.4" />
              <stop offset="50%" stopColor={AMBER} stopOpacity="0.15" />
              <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sweepGrad10" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
              <stop offset="60%" stopColor={AMBER_LIGHT} stopOpacity="0.3" />
              <stop offset="100%" stopColor={AMBER} stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="eyeAmber10" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={AMBER_LIGHT} stopOpacity="0.8" />
              <stop offset="60%" stopColor={AMBER} stopOpacity="0.3" />
              <stop offset="100%" stopColor={AMBER_DEEP} stopOpacity="0" />
            </radialGradient>
            {/* Radar sweep cone clip */}
            <clipPath id="radarSweep10">
              <path d={`M ${RADAR_CX} ${RADAR_CY} L ${RADAR_CX + 240 * Math.cos(sweepRad)} ${RADAR_CY + 240 * Math.sin(sweepRad)} A 240 240 0 0 0 ${RADAR_CX + 240 * Math.cos(sweepRad - 0.6)} ${RADAR_CY + 240 * Math.sin(sweepRad - 0.6)} Z`} />
            </clipPath>
          </defs>

          {/* ── Background particles ── */}
          {BG_PARTICLES.map((p, i) => {
            const yOff = (frame * p.speed + p.phase * 48) % 1920;
            return (
              <circle key={i} cx={p.x} cy={(p.y + yOff) % 1920} r={p.r}
                fill={AMBER}
                opacity={globalEnter * (0.04 + Math.sin(frame * 0.035 + p.phase) * 0.02)} />
            );
          })}

          {/* ── Section label ── */}
          <g opacity={globalEnter}>
            <rect x={80} y={60} width={240} height={52} rx={12}
              fill={AMBER} opacity={0.9} />
            <text x={200} y={94} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={900}
              fill="white" letterSpacing="0.10em">OBSERVE</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={200} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={54} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              Receive The Result
            </text>
            <text x={540} y={255} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600}
              fill={AMBER} opacity={0.8}>
              Step 4: Observe
            </text>
          </g>

          {/* ── Divider ── */}
          <line x1={200} y1={300} x2={880} y2={300}
            stroke={AMBER} strokeWidth={1.5} opacity={titleEnter * 0.2} />

          {/* ── Radar visualization ── */}
          <g opacity={radarEnter}>
            {/* Radar glow */}
            <circle cx={RADAR_CX} cy={RADAR_CY} r={220 * radarScale}
              fill="url(#radarGrad10)" opacity={0.5} />

            {/* Radar rings */}
            {RADAR_RINGS.map((r, i) => (
              <circle key={i} cx={RADAR_CX} cy={RADAR_CY} r={r * radarScale}
                fill="none" stroke={AMBER} strokeWidth={1.5}
                opacity={0.15 + (i === 2 ? 0.1 : 0)}
                strokeDasharray={i % 2 === 0 ? 'none' : '4 4'} />
            ))}

            {/* Cross-hairs */}
            <line x1={RADAR_CX - 220} y1={RADAR_CY} x2={RADAR_CX + 220} y2={RADAR_CY}
              stroke={AMBER} strokeWidth={1} opacity={0.1} />
            <line x1={RADAR_CX} y1={RADAR_CY - 220} x2={RADAR_CX} y2={RADAR_CY + 220}
              stroke={AMBER} strokeWidth={1} opacity={0.1} />

            {/* Sweep line */}
            <line x1={RADAR_CX} y1={RADAR_CY}
              x2={RADAR_CX + Math.cos(sweepRad) * 220 * radarScale}
              y2={RADAR_CY + Math.sin(sweepRad) * 220 * radarScale}
              stroke={AMBER} strokeWidth={2.5} opacity={0.8} />

            {/* Sweep cone (fading trail) */}
            <circle cx={RADAR_CX} cy={RADAR_CY} r={220 * radarScale}
              fill={AMBER} opacity={0.06}
              clipPath="url(#radarSweep10)" />

            {/* Blip points */}
            {SCAN_BLIPS.map((blip, i) => {
              const blipAngle = blip.angle + frame * 0.01;
              const bx = RADAR_CX + Math.cos(blipAngle) * blip.dist * radarScale;
              const by = RADAR_CY + Math.sin(blipAngle) * blip.dist * radarScale;
              const nearSweep = Math.abs(((blipAngle - sweepRad + Math.PI) % (2 * Math.PI)) - Math.PI) < 0.5;
              return (
                <g key={i}>
                  <circle cx={bx} cy={by} r={blip.size}
                    fill={AMBER_LIGHT}
                    opacity={nearSweep ? 0.9 : 0.2}
                    filter={nearSweep ? 'url(#resultGlow10)' : undefined} />
                  {nearSweep && (
                    <circle cx={bx} cy={by} r={blip.size + 6}
                      fill="none" stroke={AMBER_LIGHT} strokeWidth={1}
                      opacity={0.4} />
                  )}
                </g>
              );
            })}

            {/* Center dot */}
            <circle cx={RADAR_CX} cy={RADAR_CY} r={6}
              fill={AMBER} opacity={0.9}
              filter="url(#amberGlow10)" />
          </g>

          {/* ── AIRobot (receiving) ── */}
          <AIRobot cx={540} cy={560} scale={robotEnter * 0.55}
            opacity={robotEnter * 0.7}
            coreGlow={0.5 + Math.sin(frame * 0.08) * 0.2}
            frame={frame} variant="active" />

          {/* ── Result data blocks ── */}
          {RESULT_BLOCKS.map((rb, i) => {
            const rbOp = interpolate(frame, [32 + i * 5, 50 + i * 5], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const rbSlide = interpolate(frame, [32 + i * 5, 50 + i * 5], [20, 0], { extrapolateRight: 'clamp', easing: ease });
            const isSuccess = rb.status === 'success';
            return (
              <g key={i} opacity={rbOp * resultsEnter}
                transform={`translate(0, ${rbSlide})`}>
                <rect x={rb.x - 10} y={rb.y - 16} width={rb.text.length * 10 + 50} height={36} rx={10}
                  fill="#F9FAFB" stroke={isSuccess ? '#22C55E' : AMBER}
                  strokeWidth={1.5} filter="url(#shadow)" />
                <text x={rb.x + 5} y={rb.y + 7} textAnchor="start" fontSize={16}>
                  {rb.icon}
                </text>
                <text x={rb.x + 28} y={rb.y + 7} textAnchor="start"
                  fontFamily="'Courier New', monospace" fontSize={14} fontWeight={600}
                  fill={isSuccess ? '#22C55E' : AMBER}>
                  {rb.text}
                </text>
              </g>
            );
          })}

          {/* ── Feedback arrows (result → agent center) ── */}
          {FEEDBACK_ARROWS.map((fa, i) => {
            const faOp = interpolate(frame, [44 + fa.delay, 62 + fa.delay], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const t = Math.min(faOp * feedbackEnter, 1);
            const midX = fa.fromX + (fa.toX - fa.fromX) * t;
            const midY = fa.fromY + (fa.toY - fa.fromY) * t;
            return (
              <g key={i} opacity={feedbackEnter * 0.6}>
                <line x1={fa.fromX} y1={fa.fromY}
                  x2={midX} y2={midY}
                  stroke={AMBER} strokeWidth={2.5}
                  strokeDasharray="8 4"
                  strokeLinecap="round" />
                {/* Moving dot along the arrow */}
                <circle cx={midX} cy={midY} r={5}
                  fill={AMBER_LIGHT} opacity={faOp}
                  filter="url(#resultGlow10)" />
              </g>
            );
          })}

          {/* ── Pulse rings from sources ── */}
          {PULSE_SOURCES.map((ps, si) =>
            [0, 1, 2].map(ri => {
              const pulseT = ((frame - ps.delay + ri * 12) % 36) / 36;
              const pulseR = 20 + pulseT * 50;
              const pulseOp = Math.max(0, (1 - pulseT) * 0.3);
              return (
                <circle key={`${si}-${ri}`}
                  cx={ps.cx} cy={ps.cy} r={pulseR}
                  fill="none" stroke={AMBER}
                  strokeWidth={2 - ri * 0.5}
                  opacity={pulseOp * resultsEnter} />
              );
            })
          )}

          {/* ── Result streaming particles ── */}
          {RESULT_PACKETS.map((rp) => {
            const t = ((frame - 30 - rp.delay) * rp.speed * 0.02) % 1;
            if (t < 0 || feedbackEnter < 0.1) return null;
            const startX = 200 + rp.id * 40;
            const startY = 950;
            const px = startX + (RADAR_CX - startX) * t + rp.offsetX * Math.sin(t * Math.PI);
            const py = startY + (RADAR_CY - startY) * t + rp.offsetY * Math.cos(t * Math.PI);
            const pOp = Math.sin(t * Math.PI) * feedbackEnter * 0.7;
            return (
              <g key={rp.id}>
                {rp.type === 0 && <circle cx={px} cy={py} r={rp.size} fill={AMBER} opacity={pOp} />}
                {rp.type === 1 && <rect x={px - rp.size} y={py - rp.size} width={rp.size * 2} height={rp.size * 2} fill={AMBER_LIGHT} opacity={pOp} rx={1} />}
                {rp.type === 2 && <polygon points={`${px},${py - rp.size * 1.3} ${px + rp.size},${py + rp.size * 0.7} ${px - rp.size},${py + rp.size * 0.7}`} fill={AMBER} opacity={pOp} />}
              </g>
            );
          })}

          {/* ── Large eye visual ── */}
          <g opacity={eyeEnter} transform={`translate(540, 1180)`}>
            {/* Outer eye shape */}
            <ellipse cx={0} cy={0} rx={130} ry={60} fill="none" stroke={AMBER}
              strokeWidth={3.5} opacity={0.6} />
            <ellipse cx={0} cy={0} rx={110} ry={48} fill="none" stroke={AMBER}
              strokeWidth={1.5} opacity={0.25} />

            {/* Iris */}
            <circle cx={0} cy={0} r={38} fill="url(#eyeAmber10)" />
            <circle cx={0} cy={0} r={38} fill="none" stroke={AMBER} strokeWidth={2.5} opacity={0.7} />

            {/* Pupil */}
            <circle cx={Math.sin(frame * 0.07) * 4} cy={Math.cos(frame * 0.09) * 3}
              r={16} fill={COLORS.deep_black} opacity={0.85} />
            <circle cx={Math.sin(frame * 0.07) * 4 - 5} cy={Math.cos(frame * 0.09) * 3 - 6}
              r={5} fill="white" opacity={0.6} />

            {/* Eyelashes */}
            {EYE_LASHES.map((el, i) => {
              const lx1 = Math.cos(el.angle) * 60;
              const ly1 = Math.sin(el.angle) * 28;
              const lx2 = Math.cos(el.angle) * (60 + el.len);
              const ly2 = Math.sin(el.angle) * (28 + el.len * 0.5);
              return (
                <line key={i} x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                  stroke={AMBER} strokeWidth={1.5} opacity={0.3}
                  strokeLinecap="round" />
              );
            })}

            {/* Data reception arcs */}
            {[0, 1, 2].map(i => {
              const arcR = 80 + i * 20;
              const arcOp = 0.2 + Math.sin(frame * 0.06 + i * 1.5) * 0.1;
              return (
                <path key={i}
                  d={`M ${-arcR * 0.7} ${arcR * 0.5} A ${arcR} ${arcR} 0 0 1 ${arcR * 0.7} ${arcR * 0.5}`}
                  fill="none" stroke={AMBER} strokeWidth={1.5}
                  opacity={arcOp * eyeEnter} strokeDasharray="6 4" />
              );
            })}

            {/* "OBSERVE" label */}
            <text x={0} y={100} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={900}
              fill={AMBER} letterSpacing="0.18em" opacity={0.8}>
              OBSERVE
            </text>
            <text x={0} y={132} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={500}
              fill={COLORS.light_gray}>
              Processing feedback from the environment
            </text>
          </g>

          {/* ── Bottom insight box ── */}
          <g opacity={bottomEnter}>
            <rect x={120} y={1380} width={840} height={150} rx={18}
              fill="#F9FAFB" stroke={AMBER} strokeWidth={1.5}
              filter="url(#shadow)" opacity={0.9} />
            <rect x={120} y={1380} width={6} height={150} rx={3} fill={AMBER} />
            <text x={170} y={1428} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={COLORS.deep_black}>
              It receives the result of that action.
            </text>
            <text x={170} y={1468} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={AMBER}>
              That is observe.
            </text>
            <text x={170} y={1505} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={17} fontWeight={500}
              fill={COLORS.light_gray}>
              Results · Feedback · Error signals · State updates
            </text>
          </g>

          {/* ── Flow direction label ── */}
          <g opacity={feedbackEnter * 0.5}>
            <text x={540} y={780} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={700}
              fill={AMBER} letterSpacing="0.06em">
              RESULT → AGENT
            </text>
          </g>

          {/* ── Decorative bottom dashes ── */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i}
              x1={100 + i * 160} y1={1590}
              x2={140 + i * 160} y2={1590}
              stroke={AMBER} strokeWidth={1.5} opacity={globalEnter * 0.1}
              strokeLinecap="round" />
          ))}
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="It receives the result of that action back. That is observe."
          opacity={captionEnter}
          highlightWords={['receives', 'result', 'observe']} />
      </PaperBackground>
    </AbsoluteFill>
  );
};
