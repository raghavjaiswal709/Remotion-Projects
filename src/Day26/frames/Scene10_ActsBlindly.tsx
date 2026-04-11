/**
 * Scene10_ActsBlindly.tsx — Day 26: Observations
 *
 * "Without observations, the agent acts blindly."
 *
 * Agent robot with X's over its eyes (blind). Dark fog/smoke surrounding it.
 * Red warning symbols. Arrows shooting outward but hitting nothing.
 * "BLIND" text pulsing in red. Scratchy pencil lines for chaos.
 * Confusion particles swirling around the disoriented agent.
 *
 * Canvas: 1080×1920 portrait (9:16), 30fps.
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/* ── Confusion particles ──────────────────────────────────────────────── */
const confusionParticles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  angle: (i / 40) * Math.PI * 2,
  radius: 120 + (i % 6) * 35,
  size: 2 + (i % 4) * 1.5,
  speed: 0.02 + (i % 5) * 0.008,
  phase: (i * 2.7) % (Math.PI * 2),
}));

/* ── Smoke blobs ──────────────────────────────────────────────────────── */
const smokeBlobs = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  cx: 200 + (i * 67) % 680,
  cy: 600 + (i * 89) % 800,
  rx: 60 + (i % 5) * 30,
  ry: 40 + (i % 4) * 20,
  drift: (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.2),
  phase: (i * 1.1) % (Math.PI * 2),
}));

/* ── Blind arrows ─────────────────────────────────────────────────────── */
const blindArrows = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i / 8) * Math.PI * 2 + 0.2,
  length: 140 + (i % 3) * 40,
  delay: i * 5,
}));

/* ── Warning symbols ──────────────────────────────────────────────────── */
const warnings = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: 150 + (i % 3) * 340,
  y: 350 + Math.floor(i / 3) * 950,
  size: 30 + (i % 3) * 10,
  delay: 10 + i * 6,
}));

/* ── Scratchy pencil lines ────────────────────────────────────────────── */
const scratchLines = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x1: 100 + (i * 73) % 880,
  y1: 400 + (i * 113) % 1200,
  x2: 130 + (i * 73) % 880 + (i % 2 === 0 ? 40 : -40),
  y2: 420 + (i * 113) % 1200 + (i % 2 === 0 ? -30 : 30),
  delay: i * 2,
}));

export const Scene10_ActsBlindly: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const robotScale = interpolate(frame, [5, 25], [0.3, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const fogOpacity = interpolate(frame, [0, 20], [0, 0.6], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const blindTextScale = interpolate(
    frame,
    [20, 35],
    [0, 1],
    { easing: ease, extrapolateRight: 'clamp' }
  );

  const blindPulse = interpolate(
    frame % 30,
    [0, 15, 30],
    [0.8, 1.2, 0.8],
    { extrapolateRight: 'clamp' }
  );

  const eyeXScale = interpolate(frame, [15, 25], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const arrowProgress = interpolate(frame, [25, 50], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const warningFlash = interpolate(
    frame % 20,
    [0, 10, 20],
    [0.4, 1, 0.4],
    { extrapolateRight: 'clamp' }
  );

  const shakeX = interpolate(
    frame % 6,
    [0, 1, 2, 3, 4, 5],
    [0, 3, -3, 2, -2, 0],
    { extrapolateRight: 'clamp' }
  );

  const scratchProgress = interpolate(frame, [10, 50], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [30, 42], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const confusionSpin = frame * 0.03;

  const cx = 540;
  const cy = 920; // Re-centered to 920

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          {/* ── Glow filters ────────────────────────────────────────── */}
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.6" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feFlood floodColor={COLORS.vibrant_red} floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="fogBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <radialGradient id="smokeFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#333" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#111" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="blindGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.vibrant_red} />
            <stop offset="100%" stopColor="#FF6666" />
          </linearGradient>
        </defs>

        {/* ── Background dark vignette ─────────────────────────────── */}
        <rect width="1080" height="1920" fill={COLORS.bg_black} />
        <circle
          cx="540" cy="960" r="900"
          fill="none" stroke="#1a1a1a" strokeWidth="200"
          opacity={0.5}
        />

        {/* ── Smoke / Fog layer ────────────────────────────────────── */}
        <g opacity={fogOpacity}>
          {smokeBlobs.map((s) => {
            const drift = Math.sin(frame * 0.02 + s.phase) * 30 * s.drift;
            return (
              <ellipse
                key={s.id}
                cx={s.cx + drift}
                cy={s.cy + Math.sin(frame * 0.015 + s.phase) * 15}
                rx={s.rx}
                ry={s.ry}
                fill="url(#smokeFill)"
                filter="url(#fogBlur)"
                opacity={0.4 + Math.sin(frame * 0.03 + s.phase) * 0.15}
              />
            );
          })}
        </g>

        {/* ── Scratchy pencil lines ────────────────────────────────── */}
        <g opacity={scratchProgress * 0.5}>
          {scratchLines.map((l) => {
            const prog = interpolate(frame, [l.delay, l.delay + 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <line
                key={l.id}
                x1={l.x1}
                y1={l.y1}
                x2={l.x1 + (l.x2 - l.x1) * prog}
                y2={l.y1 + (l.y2 - l.y1) * prog}
                stroke={COLORS.cool_silver}
                strokeWidth="1"
                strokeLinecap="round"
                opacity={0.3}
              />
            );
          })}
        </g>

        {/* ── Robot Agent (centered) ───────────────────────────────── */}
        <g
          transform={`translate(${cx + shakeX}, ${cy}) scale(${robotScale})`}
          opacity={fadeIn}
        >
          {/* Body */}
          <rect
            x={-80} y={-100} width={160} height={200}
            rx="20" ry="20"
            fill="#1E293B" stroke={COLORS.cool_silver}
            strokeWidth="3"
          />
          {/* Head */}
          <rect
            x={-60} y={-190} width={120} height={100}
            rx="15" ry="15"
            fill="#1E293B" stroke={COLORS.cool_silver}
            strokeWidth="3"
          />
          {/* Antenna */}
          <line
            x1={0} y1={-190} x2={0} y2={-230}
            stroke={COLORS.cool_silver} strokeWidth="3"
          />
          <circle cx={0} cy={-235} r={8} fill={COLORS.vibrant_red} opacity={warningFlash} />

          {/* ── Eyes with X marks ──────────────────────────────────── */}
          <g opacity={eyeXScale}>
            {/* Left eye socket */}
            <circle cx={-25} cy={-145} r={18} fill="#0F172A" />
            {/* Left X */}
            <line x1={-35} y1={-155} x2={-15} y2={-135}
              stroke={COLORS.vibrant_red} strokeWidth="4" strokeLinecap="round" />
            <line x1={-15} y1={-155} x2={-35} y2={-135}
              stroke={COLORS.vibrant_red} strokeWidth="4" strokeLinecap="round" />

            {/* Right eye socket */}
            <circle cx={25} cy={-145} r={18} fill="#0F172A" />
            {/* Right X */}
            <line x1={15} y1={-155} x2={35} y2={-135}
              stroke={COLORS.vibrant_red} strokeWidth="4" strokeLinecap="round" />
            <line x1={35} y1={-155} x2={15} y2={-135}
              stroke={COLORS.vibrant_red} strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Mouth (confused squiggle) */}
          <path
            d="M -30 -110 Q -15 -100, 0 -110 Q 15 -120, 30 -110"
            fill="none" stroke={COLORS.cool_silver} strokeWidth="3"
          />

          {/* Arms */}
          <rect x={-110} y={-70} width={30} height={100} rx="10"
            fill="#1E293B" stroke={COLORS.cool_silver} strokeWidth="2" />
          <rect x={80} y={-70} width={30} height={100} rx="10"
            fill="#1E293B" stroke={COLORS.cool_silver} strokeWidth="2" />

          {/* Legs */}
          <rect x={-50} y={100} width={35} height={80} rx="8"
            fill="#1E293B" stroke={COLORS.cool_silver} strokeWidth="2" />
          <rect x={15} y={100} width={35} height={80} rx="8"
            fill="#1E293B" stroke={COLORS.cool_silver} strokeWidth="2" />

          {/* Chest panel */}
          <rect x={-40} y={-50} width={80} height={60} rx="5"
            fill="#0F172A" stroke={COLORS.vibrant_red} strokeWidth="1.5"
            opacity={warningFlash * 0.6}
          />
          <text x={0} y={-15} textAnchor="middle" fill={COLORS.vibrant_red}
            fontSize="46" fontFamily="monospace" opacity={warningFlash}>
            ERROR
          </text>
        </g>

        {/* ── Blind arrows shooting outward ────────────────────────── */}
        <g opacity={arrowProgress}>
          {blindArrows.map((a) => {
            const prog = interpolate(frame, [a.delay + 25, a.delay + 50], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const endX = cx + Math.cos(a.angle) * a.length * prog;
            const endY = cy + Math.sin(a.angle) * a.length * prog;
            const arrowOpacity = interpolate(
              frame, [a.delay + 25, a.delay + 45, a.delay + 55], [0, 0.8, 0.2],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            return (
              <g key={a.id} opacity={arrowOpacity}>
                <line
                  x1={cx} y1={cy}
                  x2={endX} y2={endY}
                  stroke={COLORS.vibrant_red}
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  strokeLinecap="round"
                />
                {/* Arrow head */}
                <circle cx={endX} cy={endY} r={5}
                  fill={COLORS.vibrant_red} opacity={0.6} />
                {/* Miss marker */}
                {prog > 0.8 && (
                  <g>
                    <line
                      x1={endX - 8} y1={endY - 8}
                      x2={endX + 8} y2={endY + 8}
                      stroke={COLORS.vibrant_red} strokeWidth="2" opacity={0.5}
                    />
                    <line
                      x1={endX + 8} y1={endY - 8}
                      x2={endX - 8} y2={endY + 8}
                      stroke={COLORS.vibrant_red} strokeWidth="2" opacity={0.5}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* ── Confusion particles swirling ─────────────────────────── */}
        <g opacity={fadeIn * 0.8}>
          {confusionParticles.map((p) => {
            const currentAngle = p.angle + confusionSpin + Math.sin(frame * p.speed + p.phase) * 0.5;
            const px = cx + Math.cos(currentAngle) * p.radius;
            const py = cy + Math.sin(currentAngle) * p.radius * 0.7;
            const particleOp = 0.3 + Math.sin(frame * 0.05 + p.phase) * 0.2;
            return (
              <circle
                key={p.id}
                cx={px} cy={py}
                r={p.size}
                fill={p.id % 3 === 0 ? COLORS.vibrant_red : COLORS.cool_silver}
                opacity={particleOp}
              />
            );
          })}
        </g>

        {/* ── Warning symbols ──────────────────────────────────────── */}
        <g>
          {warnings.map((w) => {
            const wScale = scaleAnim(frame, w.delay, 15, 0, 1);
            return (
              <g key={w.id} transform={`translate(${w.x}, ${w.y}) scale(${wScale})`}
                opacity={warningFlash}>
                <polygon
                  points={`0,${-w.size} ${w.size * 0.9},${w.size * 0.7} ${-w.size * 0.9},${w.size * 0.7}`}
                  fill="none" stroke={COLORS.vibrant_red} strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <text x={0} y={w.size * 0.35} textAnchor="middle"
                  fill={COLORS.vibrant_red} fontSize={w.size * 0.8}
                  fontFamily="monospace" fontWeight="bold">
                  !
                </text>
              </g>
            );
          })}
        </g>

        {/* ── "BLIND" text pulsing ─────────────────────────────────── */}
        <g
          transform={`translate(540, 520) scale(${blindTextScale * blindPulse})`}
          filter="url(#softGlow)"
        >
          <text
            x={0} y={0} textAnchor="middle"
            fill="url(#blindGrad)"
            fontSize="180" fontFamily="monospace" fontWeight="900"
          >
            BLIND
          </text>
        </g>

        {/* ── Subtitle ─────────────────────────────────────────────── */}
        <g opacity={subtitleOpacity}>
          <rect
            x={60} y={1540} width={960} height={180}
            rx="24" ry="24"
            fill={COLORS.deep_black} fillOpacity="0.85"
            stroke={COLORS.vibrant_red} strokeWidth="3"
          />
          <text
            x={540} y={1610} textAnchor="middle"
            fill={COLORS.soft_white} fontSize="58" fontWeight="bold"
          >
            Without observations,
          </text>
          <text
            x={540} y={1690} textAnchor="middle"
            fill={COLORS.vibrant_red} fontSize="62" fontWeight="900"
          >
            the agent acts blindly.
          </text>
        </g>

        {/* ── Red scan lines overlay ───────────────────────────────── */}
        <g opacity={0.08}>
          {Array.from({ length: 40 }, (_, i) => (
            <line
              key={`scan-${i}`}
              x1={0} y1={i * 48}
              x2={1080} y2={i * 48}
              stroke={COLORS.vibrant_red} strokeWidth="1"
            />
          ))}
        </g>

        {/* ── Question marks floating ──────────────────────────────── */}
        {[
          { x: 200, y: 650, delay: 20 },
          { x: 880, y: 700, delay: 25 },
          { x: 300, y: 1100, delay: 30 },
          { x: 780, y: 1050, delay: 35 },
          { x: 540, y: 600, delay: 22 },
        ].map((q, i) => {
          const qScale = scaleAnim(frame, q.delay, 12, 0, 1);
          const floatY = Math.sin(frame * 0.05 + i) * 8;
          return (
            <text
              key={`q-${i}`}
              x={q.x} y={q.y + floatY}
              textAnchor="middle"
              fill={COLORS.cool_silver}
              fontSize="48" fontFamily="serif" fontWeight="bold"
              opacity={qScale * 0.5}
              transform={`scale(${qScale})`}
              style={{ transformOrigin: `${q.x}px ${q.y}px` }}
            >
              ?
            </text>
          );
        })}

        {/* ── Bottom subtitle ──────────────────────────────────────── */}
        <g opacity={subtitleOpacity}>
          <rect x={80} y={1560} width={920} height={130} rx="16"
            fill={COLORS.deep_black} fillOpacity="0.7"
            stroke={COLORS.vibrant_red} strokeWidth="1.5" />
          <text x={540} y={1615} textAnchor="middle"
            fill={COLORS.soft_white} fontSize="58" fontFamily="monospace">
            Without observations, the agent
          </text>
          <text x={540} y={1680} textAnchor="middle"
            fill={COLORS.vibrant_red} fontSize="62" fontFamily="monospace"
            fontWeight="bold">
            acts blindly.
          </text>
        </g>

        {/* ── Corner circuit accents ───────────────────────────────── */}
        <g opacity={fadeIn * 0.3}>
          <path d="M 0 200 L 0 0 L 200 0" fill="none" stroke={COLORS.vibrant_red}
            strokeWidth="2" />
          <path d="M 1080 200 L 1080 0 L 880 0" fill="none" stroke={COLORS.vibrant_red}
            strokeWidth="2" />
          <path d="M 0 1720 L 0 1920 L 200 1920" fill="none" stroke={COLORS.vibrant_red}
            strokeWidth="2" />
          <path d="M 1080 1720 L 1080 1920 L 880 1920" fill="none" stroke={COLORS.vibrant_red}
            strokeWidth="2" />
        </g>

        {/* ── Static noise dots ────────────────────────────────────── */}
        <g opacity={0.06}>
          {Array.from({ length: 50 }, (_, i) => (
            <rect
              key={`noise-${i}`}
              x={((i * 137 + frame * 13) % 1080)}
              y={((i * 211 + frame * 7) % 1920)}
              width="3" height="3"
              fill={COLORS.soft_white}
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
