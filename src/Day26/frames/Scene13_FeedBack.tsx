/**
 * Scene13_FeedBack.tsx — Day 26: Observations
 *
 * "Observations feed directly back into the perceive step."
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

const CX = 540;
const CY = 920;
const R = 280;

const OBSERVE_ANGLE = Math.PI;        // left
const PERCEIVE_ANGLE = -Math.PI / 2;  // top

const observePt = { x: CX + Math.cos(OBSERVE_ANGLE) * R, y: CY + Math.sin(OBSERVE_ANGLE) * R };
const perceivePt = { x: CX + Math.cos(PERCEIVE_ANGLE) * R, y: CY + Math.sin(PERCEIVE_ANGLE) * R };

const feedbackCP1 = { x: observePt.x - 220, y: observePt.y - 200 };
const feedbackCP2 = { x: perceivePt.x - 200, y: perceivePt.y - 180 };

const feedbackParticles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  t: i / 25,
  size: 3 + (i % 4) * 1.5,
}));

const circuitTraces = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (i * 131) % 1080,
  y: (i * 199) % 1920,
  len: 30 + (i % 5) * 20,
  horiz: i % 2 === 0,
  delay: i * 2,
}));

const sparkles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: (i * 131) % 1080,
  y: (i * 199) % 1920,
  r: 0.6 + (i % 4) * 0.5,
  phase: (i * 2.3) % (Math.PI * 2),
}));

const trailDots = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  t: i / 40,
  r: 1 + (i % 3) * 0.5,
}));

const cubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

const feedbackPt = (t: number) => ({
  x: cubicBezier(t, observePt.x, feedbackCP1.x, feedbackCP2.x, perceivePt.x),
  y: cubicBezier(t, observePt.y, feedbackCP1.y, feedbackCP2.y, perceivePt.y),
});

export const Scene13_FeedBack: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { easing: ease });
  const feedbackDraw = interpolate(frame, [20, 50], [0, 1], { easing: ease });
  const labelFade = interpolate(frame, [35, 48], [0, 1], { easing: ease });
  const perceivePulse = interpolate(frame, [50, 58, 70], [1, 1.4, 1]);
  const perceiveGlow = interpolate(frame, [50, 58, 70], [0, 1, 0.3]);
  const subtitleOpacity = interpolate(frame, [55, 68], [0, 1]);
  const flowOffset = (frame * 0.02) % 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="feedbackGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="feedbackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.purple} />
            <stop offset="50%" stopColor={COLORS.electric_cyan} />
            <stop offset="100%" stopColor={COLORS.vibrant_green} />
          </linearGradient>
        </defs>

        <rect width="1080" height="1920" fill={COLORS.bg_black} />

        {/* Sparkles */}
        <g opacity={fadeIn * 0.5}>
          {sparkles.map((s) => (
            <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill={COLORS.soft_white}
              opacity={0.3 + Math.sin(frame * 0.04 + s.phase) * 0.2} />
          ))}
        </g>

        {/* Title */}
        <g opacity={fadeIn}>
          <text x={540} y={240} textAnchor="middle" fill={COLORS.electric_cyan}
            fontSize="52" fontFamily="monospace" fontWeight="bold" filter="url(#cyanGlow)">
            FEEDBACK PATH
          </text>
        </g>

        {/* Nodes */}
        {[
          { label: 'OBSERVE', color: COLORS.purple, pt: observePt, delay: 10 },
          { label: 'PERCEIVE', color: COLORS.vibrant_green, pt: perceivePt, delay: 40 }
        ].map((n, i) => {
          const isPerceive = n.label === 'PERCEIVE';
          const nScale = scaleAnim(frame, n.delay, 15, 0, 1) * (isPerceive ? perceivePulse : 1);
          return (
            <g key={i} transform={`translate(${n.pt.x}, ${n.pt.y}) scale(${nScale})`}>
              <circle cx={0} cy={0} r={80} fill={COLORS.bg_black} stroke={n.color} strokeWidth="4" />
              <circle cx={0} cy={0} r={65} fill={n.color} opacity={isPerceive ? 0.2 + perceiveGlow * 0.3 : 0.1} />
              <text x={0} y={15} textAnchor="middle" fill={n.color} fontSize="72" fontWeight="bold">{n.label === 'OBSERVE' ? '📡' : '👁'}</text>
              <text x={0} y={115} textAnchor="middle" fill={n.color} fontSize="52" fontWeight="bold" opacity={0.8}>{n.label}</text>
            </g>
          );
        })}

        {/* Feedback Curve */}
        <g opacity={feedbackDraw}>
          <path
            d={`M ${observePt.x} ${observePt.y} C ${feedbackCP1.x} ${feedbackCP1.y}, ${feedbackCP2.x} ${feedbackCP2.y}, ${perceivePt.x} ${perceivePt.y}`}
            fill="none" stroke="url(#feedbackGrad)" strokeWidth="6"
            strokeDasharray="1200" strokeDashoffset={1200 * (1 - feedbackDraw)} filter="url(#feedbackGlow)"
          />
        </g>

        {/* Particles */}
        <g opacity={feedbackDraw > 0.5 ? 1 : 0}>
          {feedbackParticles.map((p) => {
            const t = (p.t + flowOffset) % 1;
            const pt = feedbackPt(t * feedbackDraw);
            return (
              <circle key={p.id} cx={pt.x} cy={pt.y} r={p.size} fill={COLORS.electric_cyan} opacity={0.8} />
            );
          })}
        </g>

        {/* FEEDBACK Label */}
        <g opacity={labelFade} transform={`translate(280, 580)`}>
          <rect x="-100" y="-30" width="200" height="60" rx="12" fill={COLORS.bg_black} stroke={COLORS.electric_cyan} strokeWidth="2" />
          <text x="0" y="10" textAnchor="middle" fill={COLORS.electric_cyan} fontSize="42" fontWeight="bold">FEEDBACK</text>
        </g>

        {/* Subtitle */}
        <g opacity={subtitleOpacity}>
          <rect x={60} y={1540} width={960} height={160} rx="20" fill={COLORS.deep_black} fillOpacity="0.8" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <text x={540} y={1600} textAnchor="middle" fill={COLORS.soft_white} fontSize="56">Observations feed directly</text>
          <text x={540} y={1675} textAnchor="middle" fill={COLORS.vibrant_green} fontSize="56" fontWeight="bold">into the perceive step.</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
