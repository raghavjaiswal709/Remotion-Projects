/**
 * Scene 12 — Not a Metaphor
 * "This is not a metaphor."
 * Bold dramatic text, dark background, red accent slash marks.
 * Typography-heavy scene, large impactful words appearing with emphasis.
 * Duration: 42 frames (1.4s — short, punchy)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import {
  BlackBackground, CaptionBar, GlobalDefs, CornerBrackets,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Slash mark geometry — dramatic red accent lines ────────────────────────
const SLASH_MARKS = [
  { x1: 150, y1: 600, x2: 320, y2: 1050, width: 6, delay: 4 },
  { x1: 760, y1: 550, x2: 930, y2: 1100, width: 5, delay: 7 },
  { x1: 70,  y1: 700, x2: 200, y2: 1000, width: 3, delay: 10 },
  { x1: 880, y1: 650, x2: 1010, y2: 980, width: 3, delay: 12 },
  { x1: 400, y1: 500, x2: 500, y2: 780, width: 4, delay: 6 },
  { x1: 580, y1: 520, x2: 680, y2: 800, width: 4, delay: 8 },
];

// ── Background X-cross marks ───────────────────────────────────────────────
const X_MARKS = Array.from({ length: 12 }, (_, i) => ({
  cx: 100 + (i % 4) * 300,
  cy: 450 + Math.floor(i / 4) * 350,
  size: 20 + (i % 3) * 12,
  rotation: 45 + (i % 2) * 15,
  delay: i * 2,
}));

// ── Horizontal scan lines ──────────────────────────────────────────────────
const SCAN_LINES = Array.from({ length: 40 }, (_, i) => ({
  y: i * 48,
  speed: 0.5 + (i % 3) * 0.3,
  opacity: 0.02 + (i % 4) * 0.01,
}));

// ── Red pulse rings ────────────────────────────────────────────────────────
const PULSE_RINGS = [
  { r: 200, delay: 0, width: 3 },
  { r: 300, delay: 4, width: 2 },
  { r: 400, delay: 8, width: 1.5 },
  { r: 500, delay: 12, width: 1 },
];

// ── Shatter fragment positions ─────────────────────────────────────────────
const SHATTER_FRAGMENTS = Array.from({ length: 20 }, (_, i) => ({
  angle: (i / 20) * Math.PI * 2,
  dist: 60 + (i % 5) * 30,
  size: 4 + (i % 3) * 3,
  speed: 2 + (i % 4),
  delay: 8 + i * 0.8,
}));

// ── Glitch offset lines ───────────────────────────────────────────────────
const GLITCH_LINES = [
  { y: 780, height: 4, offsetX: -12, delay: 10 },
  { y: 820, height: 6, offsetX: 18, delay: 12 },
  { y: 860, height: 3, offsetX: -8, delay: 14 },
  { y: 900, height: 5, offsetX: 14, delay: 11 },
  { y: 940, height: 3, offsetX: -20, delay: 13 },
];

// ── Corners — emphasis brackets ────────────────────────────────────────────
const EMPHASIS_BRACKETS = [
  { x: 160, y: 740, rot: 0 },
  { x: 920, y: 740, rot: 90 },
  { x: 920, y: 1020, rot: 180 },
  { x: 160, y: 1020, rot: 270 },
];

// ── Background noise dots ──────────────────────────────────────────────────
const NOISE_DOTS = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 127.3 + 15) % 1080,
  y: (i * 183.7 + 25) % 1920,
  r: 0.8 + (i % 3) * 0.5,
  flicker: i * 0.7,
}));

// ── Strikethrough positions across "metaphor" text ─────────────────────────
const STRIKETHROUGH_LINES = [
  { y: 870, width: 520, delay: 18 },
  { y: 878, width: 480, delay: 20 },
];

export const Scene12_NotMetaphor: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const textEnter = interpolate(frame, [3, 14], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const slashEnter = interpolate(frame, [4, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const emphasisPulse = Math.sin(frame * 0.35) * 0.15 + 0.85;
  const captionEnter = interpolate(frame, [2, 12], [0, 1], { extrapolateRight: 'clamp' });
  const shakeX = frame > 6 && frame < 18 ? Math.sin(frame * 2.5) * 4 : 0;
  const shakeY = frame > 6 && frame < 18 ? Math.cos(frame * 3.1) * 2 : 0;
  const redFlash = interpolate(frame, [6, 10], [0, 0.15], { extrapolateRight: 'clamp' })
    * interpolate(frame, [10, 20], [1, 0], { extrapolateRight: 'clamp' });

  // Scale slam for "NOT"
  const notScale = interpolate(frame, [6, 12], [2.5, 1], { extrapolateRight: 'clamp', easing: ease });
  const notOpacity = interpolate(frame, [6, 10], [0, 1], { extrapolateRight: 'clamp' });

  // Vignette darkness
  const vignetteOp = interpolate(frame, [0, 15], [0.4, 0.7], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <BlackBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="redGlowS12" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="16" result="blur"/>
              <feFlood floodColor="#EF4444" floodOpacity="0.6" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="textGlowS12" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="vignetteS12" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="100%" stopColor="#0D0D0D"/>
            </radialGradient>
            <linearGradient id="slashGradS12" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3"/>
            </linearGradient>
          </defs>

          {/* ── Vignette overlay ── */}
          <rect x={0} y={0} width={1080} height={1920}
            fill="url(#vignetteS12)" opacity={vignetteOp}/>

          {/* ── Red flash overlay ── */}
          <rect x={0} y={0} width={1080} height={1920}
            fill={COLORS.vibrant_red} opacity={redFlash}/>

          {/* ── Scan lines ── */}
          {SCAN_LINES.map((line, i) => (
            <rect key={i}
              x={0} y={line.y + Math.sin(frame * line.speed) * 3}
              width={1080} height={2}
              fill="#FFFFFF" opacity={enter * line.opacity}/>
          ))}

          {/* ── Noise dots ── */}
          {NOISE_DOTS.map((dot, i) => {
            const flicker = Math.sin(frame * 0.8 + dot.flicker) > 0.3 ? 1 : 0;
            return (
              <circle key={i}
                cx={dot.x} cy={dot.y} r={dot.r}
                fill="#FFFFFF" opacity={enter * 0.06 * flicker}/>
            );
          })}

          {/* ── Pulse rings from center ── */}
          {PULSE_RINGS.map((ring, i) => {
            const ringEnter = interpolate(frame, [ring.delay, ring.delay + 15], [0, 1], { extrapolateRight: 'clamp' });
            const ringFade = interpolate(frame, [ring.delay + 15, ring.delay + 30], [0.4, 0], { extrapolateRight: 'clamp' });
            return (
              <circle key={i}
                cx={540} cy={880} r={ring.r * ringEnter}
                fill="none" stroke={COLORS.vibrant_red}
                strokeWidth={ring.width}
                opacity={ringFade}/>
            );
          })}

          {/* ── Red slash marks ── */}
          {SLASH_MARKS.map((slash, i) => {
            const sEnter = interpolate(frame, [slash.delay, slash.delay + 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            return (
              <line key={i}
                x1={slash.x1} y1={slash.y1}
                x2={interpolate(sEnter, [0, 1], [slash.x1, slash.x2])}
                y2={interpolate(sEnter, [0, 1], [slash.y1, slash.y2])}
                stroke="url(#slashGradS12)" strokeWidth={slash.width}
                strokeLinecap="round"
                opacity={slashEnter * 0.7}/>
            );
          })}

          {/* ── X marks background ── */}
          {X_MARKS.map((xm, i) => {
            const xEnter = interpolate(frame, [xm.delay, xm.delay + 10], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={i} opacity={enter * xEnter * 0.08}
                transform={`translate(${xm.cx}, ${xm.cy}) rotate(${xm.rotation})`}>
                <line x1={-xm.size} y1={-xm.size} x2={xm.size} y2={xm.size}
                  stroke={COLORS.vibrant_red} strokeWidth={2}/>
                <line x1={xm.size} y1={-xm.size} x2={-xm.size} y2={xm.size}
                  stroke={COLORS.vibrant_red} strokeWidth={2}/>
              </g>
            );
          })}

          {/* ── Emphasis corner brackets ── */}
          {EMPHASIS_BRACKETS.map((b, i) => {
            const bEnter = interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={i} opacity={bEnter * 0.6}
                transform={`translate(${b.x}, ${b.y}) rotate(${b.rot})`}>
                <line x1={0} y1={0} x2={40} y2={0}
                  stroke={COLORS.vibrant_red} strokeWidth={3}/>
                <line x1={0} y1={0} x2={0} y2={40}
                  stroke={COLORS.vibrant_red} strokeWidth={3}/>
              </g>
            );
          })}

          {/* ── Main text group (with shake) ── */}
          <g transform={`translate(${shakeX}, ${shakeY})`}>

            {/* "This is" — subtle top line */}
            <text x={540} y={780} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={42} fontWeight={600}
              fill={COLORS.cool_silver} opacity={textEnter * 0.7}
              letterSpacing="0.06em">
              This is
            </text>

            {/* "NOT" — big, bold, red, slam entrance */}
            <g opacity={notOpacity}
              transform={`translate(540, 870) scale(${notScale}) translate(-540, -870)`}>
              <text x={540} y={880} textAnchor="middle"
                fontFamily="'Inter', sans-serif" fontSize={140} fontWeight={900}
                fill={COLORS.vibrant_red}
                letterSpacing="-0.02em"
                filter="url(#redGlowS12)"
                opacity={emphasisPulse}>
                NOT
              </text>
            </g>

            {/* "a metaphor." — bottom line */}
            <text x={540} y={970} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={700}
              fill={COLORS.soft_white} opacity={textEnter * 0.85}
              letterSpacing="0.04em">
              a metaphor.
            </text>

            {/* Period emphasis dot */}
            <circle cx={726} cy={958} r={5}
              fill={COLORS.vibrant_red}
              opacity={textEnter * emphasisPulse}
              filter="url(#redGlowS12)"/>
          </g>

          {/* ── Strikethrough lines over "metaphor" concept ── */}
          {STRIKETHROUGH_LINES.map((st, i) => {
            const stEnter = interpolate(frame, [st.delay, st.delay + 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            return (
              <line key={i}
                x1={540 - st.width / 2} y1={st.y}
                x2={540 - st.width / 2 + st.width * stEnter} y2={st.y}
                stroke={COLORS.vibrant_red} strokeWidth={3}
                strokeLinecap="round" opacity={0.5}/>
            );
          })}

          {/* ── Shatter fragments expanding ── */}
          {SHATTER_FRAGMENTS.map((frag, i) => {
            const fragProgress = interpolate(frame, [frag.delay, frag.delay + 12], [0, 1], { extrapolateRight: 'clamp' });
            const fragOp = interpolate(frame, [frag.delay, frag.delay + 12], [0.6, 0], { extrapolateRight: 'clamp' });
            const fx = 540 + Math.cos(frag.angle) * frag.dist * fragProgress * frag.speed;
            const fy = 880 + Math.sin(frag.angle) * frag.dist * fragProgress * frag.speed;
            return (
              <rect key={i}
                x={fx - frag.size / 2} y={fy - frag.size / 2}
                width={frag.size} height={frag.size}
                fill={COLORS.vibrant_red} opacity={fragOp}
                transform={`rotate(${frame * 3 + i * 45}, ${fx}, ${fy})`}/>
            );
          })}

          {/* ── Glitch offset lines ── */}
          {GLITCH_LINES.map((gl, i) => {
            const glitchOn = frame > gl.delay && frame < gl.delay + 4;
            return glitchOn ? (
              <rect key={i}
                x={gl.offsetX > 0 ? gl.offsetX : 0}
                y={gl.y} width={1080} height={gl.height}
                fill={COLORS.vibrant_red} opacity={0.08}/>
            ) : null;
          })}

          {/* ── Bottom divider ── */}
          <line x1={200} y1={1120} x2={880} y2={1120}
            stroke={COLORS.vibrant_red} strokeWidth={1}
            opacity={enter * 0.2}/>

          {/* ── Subtext ── */}
          <text x={540} y={1180} textAnchor="middle"
            fontFamily="'Courier New', monospace" fontSize={18} fontWeight={600}
            fill={COLORS.vibrant_red} opacity={enter * 0.4}
            letterSpacing="0.15em">
            // LITERAL TRUTH
          </text>

          <CornerBrackets opacity={enter * 0.15}/>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="This is not a metaphor."
          opacity={captionEnter}
          highlightWords={['not', 'metaphor']}/>
      </BlackBackground>
    </AbsoluteFill>
  );
};
