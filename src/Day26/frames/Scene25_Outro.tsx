/**
 * Scene25_Outro.tsx — Day 26: Observations
 *
 * Outro card. "DAY 26 — OBSERVATIONS" title fading out. Series branding
 * "AGENT AI FROM FIRST PRINCIPLES". Social media follow CTA. All elements
 * gracefully fade. Final particle burst. Corner brackets closing in.
 * Scan line sweep. Elegant exit animation. Dark background.
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

/* ── Burst particles ─────────────────────────────────────────────────── */
const burstParticles = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  angle: (i * 7.2) * (Math.PI / 180),
  speed: 3 + (i % 7) * 1.5,
  size: 1.5 + (i % 5) * 0.8,
  color: i % 4 === 0 ? COLORS.electric_cyan : i % 4 === 1 ? COLORS.warm_blue :
    i % 4 === 2 ? COLORS.purple : COLORS.amber,
  delay: 8 + (i % 10) * 0.5,
}));

/* ── Background particles ────────────────────────────────────────────── */
const bgParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: ((i * 163.3) % 1080),
  y: ((i * 199.7) % 1920),
  r: 0.5 + (i % 4) * 0.4,
  phase: (i * 0.9) % (Math.PI * 2),
  speed: 0.02 + (i % 5) * 0.005,
}));

/* ── Circuit lines ───────────────────────────────────────────────────── */
const circuits = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x1: (i * 97) % 1080,
  y1: (i * 167) % 1920,
  len: 40 + (i % 4) * 25,
  horiz: i % 2 === 0,
}));

/* ── Scan lines ──────────────────────────────────────────────────────── */
const scanLines = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  delay: 30 + i * 4,
  speed: 0.6 + i * 0.15,
}));

/* ── Social icons/labels ─────────────────────────────────────────────── */
const socials = [
  { label: '@AgentAI', icon: '𝕏', delay: 18 },
  { label: 'Subscribe', icon: '▶', delay: 22 },
  { label: 'Follow', icon: '★', delay: 26 },
];

/* ── Decorative ring segments ────────────────────────────────────────── */
const ringSegments = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  startAngle: i * 45,
  sweep: 30,
  r: 220,
  delay: 5 + i * 2,
}));

/* ── Corner bracket closing data ─────────────────────────────────────── */
const corners = [
  { x: 30, y: 30, sx: 1, sy: 1 },
  { x: 1050, y: 30, sx: -1, sy: 1 },
  { x: 1050, y: 1890, sx: -1, sy: -1 },
  { x: 30, y: 1890, sx: 1, sy: -1 },
];

/* ── Fade-out text elements ──────────────────────────────────────────── */
const fadeElements = [
  { text: 'DAY 26', y: 440, size: 84, color: COLORS.cool_silver, weight: '900' },
  { text: 'OBSERVATIONS', y: 560, size: 82, color: COLORS.electric_cyan, weight: '900' },
  { text: 'A Complete Feedback Loop', y: 660, size: 56, color: COLORS.cool_silver, weight: 'bold' },
];

export const Scene25_Outro: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ─────────────────────────────────────────────── */
  const masterOut = interpolate(frame, [35, 52], [1, 0], { extrapolateRight: 'clamp', easing: ease });
  const burstTrigger = interpolate(frame, [8, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bracketClose = interpolate(frame, [38, 52], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleFade = interpolate(frame, [0, 12, 36, 48], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const brandingFade = interpolate(frame, [10, 22, 38, 50], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const glowPulse = interpolate(frame, [0, 20, 40], [5, 12, 5], { extrapolateRight: 'extend' });
  const socialReveal = interpolate(frame, [16, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const scanSweep = interpolate(frame, [30, 50], [0, 1920], { extrapolateRight: 'clamp', easing: ease });
  const ringRotation = interpolate(frame, [0, 90], [0, 180], { extrapolateRight: 'extend' });

  const cx = 540;
  const cy = 960;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowPulse} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="bigGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.04" />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#bgGrad)" opacity={masterOut} />

        {/* Circuit lines */}
        {circuits.map((c) => {
          const o = interpolate(frame, [c.id * 2, c.id * 2 + 8], [0, 0.08], { extrapolateRight: 'clamp' });
          return (
            <line key={`ci-${c.id}`} x1={c.x1} y1={c.y1}
              x2={c.horiz ? c.x1 + c.len : c.x1}
              y2={c.horiz ? c.y1 : c.y1 + c.len}
              stroke={COLORS.cool_silver} strokeWidth="1" opacity={o * masterOut} />
          );
        })}

        {/* Background particles */}
        {bgParticles.map((p) => {
          const py = p.y + Math.sin(frame * p.speed + p.phase) * 14;
          const px = p.x + Math.cos(frame * p.speed * 0.6 + p.phase) * 10;
          const o = 0.1 + Math.sin(frame * 0.04 + p.phase) * 0.06;
          return (
            <circle key={`bp-${p.id}`} cx={px} cy={py} r={p.r}
              fill={p.id % 3 === 0 ? COLORS.electric_cyan : COLORS.cool_silver}
              opacity={o * masterOut} />
          );
        })}

        {/* Ring segments rotating */}
        <g transform={`translate(${cx}, ${cy}) rotate(${ringRotation})`} opacity={brandingFade * masterOut}>
          {ringSegments.map((rs) => {
            const rsO = interpolate(frame, [rs.delay, rs.delay + 10], [0, 0.3], { extrapolateRight: 'clamp' });
            const startRad = (rs.startAngle * Math.PI) / 180;
            const endRad = ((rs.startAngle + rs.sweep) * Math.PI) / 180;
            const x1 = Math.cos(startRad) * rs.r;
            const y1 = Math.sin(startRad) * rs.r;
            const x2 = Math.cos(endRad) * rs.r;
            const y2 = Math.sin(endRad) * rs.r;
            return (
              <path key={`rs-${rs.id}`}
                d={`M ${x1} ${y1} A ${rs.r} ${rs.r} 0 0 1 ${x2} ${y2}`}
                fill="none" stroke={COLORS.electric_cyan} strokeWidth="2"
                opacity={rsO} filter="url(#softGlow)" />
            );
          })}
        </g>

        {/* Burst particles */}
        {burstParticles.map((bp) => {
          const dist = burstTrigger * bp.speed * 80;
          const bpX = cx + Math.cos(bp.angle) * dist;
          const bpY = cy + Math.sin(bp.angle) * dist;
          const bpO = burstTrigger > 0 ? (1 - burstTrigger * 0.8) * masterOut : 0;
          return (
            <circle key={`burst-${bp.id}`} cx={bpX} cy={bpY} r={bp.size}
              fill={bp.color} opacity={bpO} filter="url(#softGlow)" />
          );
        })}

        {/* Main title elements */}
        {fadeElements.map((el, i) => {
          const elScale = scaleAnim(frame, 3 + i * 3, 10, 0.8, 1);
          return (
            <text key={`fe-${i}`} x={cx} y={el.y} textAnchor="middle"
              fontSize={el.size} fontWeight={el.weight}
              fill={el.color} fontFamily="monospace"
              opacity={titleFade}
              transform={`translate(0, 0) scale(${elScale})`}
              filter={i === 1 ? 'url(#cyanGlow)' : undefined}
              letterSpacing={i === 1 ? '4' : '2'}>
              {el.text}
            </text>
          );
        })}

        {/* Decorative divider */}
        <g transform={`translate(${cx}, 740)`} opacity={titleFade}>
          <line x1="-340" y1="0" x2="-60" y2="0" stroke={COLORS.cool_silver} strokeWidth="2" opacity="0.4" />
          <circle cx="0" cy="0" r="12" fill={COLORS.electric_cyan} filter="url(#softGlow)" />
          <line x1="60" y1="0" x2="340" y2="0" stroke={COLORS.cool_silver} strokeWidth="2" opacity="0.4" />
        </g>

        {/* Series branding */}
        <g transform={`translate(${cx}, 940)`} opacity={brandingFade}>
          <rect x="-480" y="-70" width="960" height="140" rx="28"
            fill={COLORS.deep_black} stroke={COLORS.warm_blue} strokeWidth="4" opacity="0.8" />
          <text x="0" y="15" textAnchor="middle" fontSize="56" fontWeight="900"
            fill={COLORS.warm_blue} fontFamily="monospace" letterSpacing="1">
            AGENT AI FIRST PRINCIPLES
          </text>
        </g>

        {/* Social media CTA */}
        {socials.map((s, i) => {
          const sO = interpolate(frame, [s.delay, s.delay + 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
          const sFade = interpolate(frame, [40, 50], [1, 0], { extrapolateRight: 'clamp' });
          return (
            <g key={`soc-${i}`} transform={`translate(${cx + (i - 1) * 320}, 1240)`}
              opacity={sO * socialReveal * sFade * masterOut}>
              <circle cx="0" cy="0" r="45" fill={COLORS.deep_black}
                stroke={COLORS.electric_cyan} strokeWidth="4" />
              <text x="0" y="12" textAnchor="middle" fontSize="48" fontWeight="bold"
                fill={COLORS.electric_cyan} fontFamily="monospace">{s.icon}</text>
              <text x="0" y="100" textAnchor="middle" fontSize="62" fontWeight="900"
                fill={COLORS.cool_silver} fontFamily="monospace">{s.label[0]}</text>
              <text x="0" y="150" textAnchor="middle" fontSize="38" fontWeight="bold"
                fill={COLORS.cool_silver} fontFamily="monospace" opacity="0.8">{s.label}</text>
            </g>
          );
        })}

        {/* "Follow for more" text */}
        <text x={cx} y={1500} textAnchor="middle" fontSize="52" fontWeight="bold"
          fill={COLORS.cool_silver} fontFamily="monospace"
          opacity={socialReveal * interpolate(frame, [40, 50], [1, 0], { extrapolateRight: 'clamp' })}>
          Follow for daily AI insights
        </text>

        {/* Scan line sweep */}
        {scanLines.map((sl) => {
          const slY = interpolate(frame, [sl.delay, sl.delay + 20], [0, 1920], { extrapolateRight: 'clamp' });
          return (
            <line key={`sl-${sl.id}`} x1="0" y1={slY} x2="1080" y2={slY}
              stroke={COLORS.electric_cyan} strokeWidth="2"
              opacity={slY > 0 && slY < 1920 ? 0.15 : 0} />
          );
        })}

        {/* Main scan sweep */}
        <rect x="0" y={scanSweep - 3} width="1080" height="6"
          fill={COLORS.electric_cyan} opacity={scanSweep > 0 && scanSweep < 1920 ? 0.2 : 0} />

        {/* Corner brackets closing in */}
        {corners.map((co, i) => {
          const closeX = interpolate(bracketClose, [0, 1], [co.x, cx + (co.sx * -30)],
            { extrapolateRight: 'clamp', easing: ease });
          const closeY = interpolate(bracketClose, [0, 1], [co.y, cy + (co.sy * -30)],
            { extrapolateRight: 'clamp', easing: ease });
          const bO = interpolate(frame, [2 + i * 2, 10 + i * 2], [0, 0.6], { extrapolateRight: 'clamp' });
          return (
            <g key={`cb-${i}`} transform={`translate(${closeX}, ${closeY}) scale(${co.sx}, ${co.sy})`}
              opacity={bO * masterOut}>
              <line x1="0" y1="0" x2="40" y2="0" stroke={COLORS.electric_cyan} strokeWidth="2.5" />
              <line x1="0" y1="0" x2="0" y2="40" stroke={COLORS.electric_cyan} strokeWidth="2.5" />
              <circle cx="0" cy="0" r="3" fill={COLORS.electric_cyan} />
            </g>
          );
        })}

        {/* Center dot that fades last */}
        <circle cx={cx} cy={cy} r={interpolate(frame, [46, 52], [8, 0], { extrapolateRight: 'clamp' })}
          fill={COLORS.electric_cyan} opacity={interpolate(frame, [46, 52], [0.8, 0], { extrapolateRight: 'clamp' })}
          filter="url(#bigGlow)" />

        {/* Final vignette overlay */}
        <rect x="0" y="0" width="1080" height="1920"
          fill={COLORS.bg_black}
          opacity={interpolate(frame, [42, 52], [0, 0.8], { extrapolateRight: 'clamp' })} />

        {/* Episode badge */}
        <g transform={`translate(${cx}, 520)`} opacity={titleFade * 0.6}>
          <rect x="-60" y="-16" width="120" height="32" rx="8"
            fill="none" stroke={COLORS.cool_silver} strokeWidth="1" />
          <text x="0" y="6" textAnchor="middle" fontSize="52"
            fill={COLORS.cool_silver} fontFamily="monospace">EP. 26</text>
        </g>

        {/* Minimal bottom text that fades early */}
        <text x={cx} y="1600" textAnchor="middle" fontSize="52"
          fill={COLORS.cool_silver} fontFamily="monospace"
          opacity={interpolate(frame, [0, 10, 30, 40], [0, 0.4, 0.4, 0], { extrapolateRight: 'clamp' })}>
          See you tomorrow for Day 27: Tools
        </text>
      </svg>
    </AbsoluteFill>
  );
};
