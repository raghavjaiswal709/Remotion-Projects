/**
 * Scene 10 — Crew Alone
 * "The crew was completely alone on the far side of the moon, 385,000 kilometers from Earth."
 * Duration: 227 frames (~7.6s) — audio 58.200s → 65.760s
 *
 * Visual: Far side of Moon surface panorama (upper 2/3). Deep space below.
 * Tiny spacecraft in lunar orbit. Earth as distant dot, 385,000 km scale bar.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn } from '../helpers/timing';
import { StarField, CornerBrackets, CaptionBar, Spacecraft } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Far-side Moon surface silhouette: rugged terrain
const TERRAIN_PATH = `M 0,1100
  L 0,900 Q 60,860 120,880 Q 180,900 200,860 Q 240,810 300,840
  Q 360,870 400,830 Q 450,790 520,810 Q 580,830 620,800
  Q 680,760 740,790 Q 800,820 840,780 Q 900,730 960,760
  Q 1020,790 1080,760 L 1080,1100 Z`;

export const Scene10_CrewAlone: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 18);
  const captionOp  = fadeIn(frame, 10, 20);
  const surfaceEnter = interpolate(frame, [4, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const craftEnter   = interpolate(frame, [14, 36], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const earthEnter   = interpolate(frame, [20, 44], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const distEnter    = interpolate(frame, [36, 64], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const labelEnter   = interpolate(frame, [48, 72], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Spacecraft orbit animation — slow arc across Moon
  const craftOrbitT = (frame / 227);
  const orbitCX = 540;
  const orbitCY = 540;
  const orbitRX = 380;
  const orbitRY = 200;
  const craftAngleRad = craftOrbitT * Math.PI * 0.6 + Math.PI * 0.8;
  const craftX = orbitCX + Math.cos(craftAngleRad) * orbitRX;
  const craftY = orbitCY + Math.sin(craftAngleRad) * orbitRY;
  const craftHeading = (Math.atan2(
    -Math.sin(craftAngleRad) * orbitRY,
     Math.cos(craftAngleRad) * orbitRX
  ) * 180) / Math.PI;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="earthGlow10" x="-80%" y="-80%" width="360%" height="360%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={C.teal} floodOpacity="0.5" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="craftGlow10" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={C.warm_pink} floodOpacity="0.4" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="skyGrad10" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.bg} stopOpacity="1" />
            <stop offset="100%" stopColor={C.bg} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Stars — full frame */}
        <StarField opacity={enter * 0.9} />

        {/* ── Moon surface — upper 2/3 ── */}
        <g opacity={surfaceEnter}>
          {/* Moon bulk fill */}
          <path d={TERRAIN_PATH}
            fill={C.silver} opacity={0.18} />

          {/* Ground layer */}
          <rect x={0} y={870} width={1080} height={230}
            fill={C.silver} opacity={0.12} />

          {/* Surface silhouette line (horizon) */}
          <path d={`M 0,880 Q 200,840 400,860 Q 600,880 800,840 Q 1000,800 1080,820`}
            fill="none" stroke={C.silver} strokeWidth={2} opacity={0.5} />

          {/* Craters on surface */}
          {[
            { cx: 120, cy: 960, r: 45 },
            { cx: 340, cy: 1020, r: 30 },
            { cx: 600, cy: 950, r: 55 },
            { cx: 820, cy: 1010, r: 38 },
            { cx: 960, cy: 940, r: 28 },
          ].map((c, i) => (
            <g key={i}>
              <ellipse cx={c.cx} cy={c.cy} rx={c.r} ry={c.r * 0.4}
                fill="none" stroke={C.slate} strokeWidth={1.5} opacity={0.5} />
              <ellipse cx={c.cx} cy={c.cy + c.r * 0.1} rx={c.r * 0.7} ry={c.r * 0.25}
                fill={C.muted_blue} opacity={0.2} />
            </g>
          ))}

          {/* Rock formations */}
          {[180, 480, 750].map((x, i) => (
            <path key={i}
              d={`M ${x},880 L ${x - 20},840 L ${x + 10},820 L ${x + 30},850 Z`}
              fill={C.slate} opacity={0.4} />
          ))}

          {/* "FAR SIDE" label */}
          <text x={540} y={1060}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500}
            fill={C.slate} letterSpacing="0.3em" opacity={0.4}>
            FAR SIDE OF THE MOON
          </text>
        </g>

        {/* Orbit ellipse (dashed) */}
        <ellipse cx={orbitCX} cy={orbitCY}
          rx={orbitRX} ry={orbitRY}
          fill="none" stroke={C.teal} strokeWidth={1.5}
          strokeDasharray="10,12"
          opacity={craftEnter * 0.4}
        />

        {/* Spacecraft in orbit */}
        <Spacecraft
          cx={craftX} cy={craftY}
          scale={0.7}
          angle={craftHeading}
          opacity={craftEnter}
        />
        {/* Craft glow */}
        <circle cx={craftX} cy={craftY} r={20}
          fill={C.warm_pink} opacity={craftEnter * 0.15}
          filter="url(#craftGlow10)" />

        {/* Antenna signal (from craft downward to surface — no reception) */}
        <line x1={craftX} y1={craftY}
              x2={craftX} y2={Math.min(craftY + 80, 860)}
          stroke={C.rose_coral} strokeWidth={1.5} strokeDasharray="4,6"
          opacity={craftEnter * 0.35} />

        {/* ── Deep space lower third ── */}
        {/* Earth — tiny dot far right */}
        <g opacity={earthEnter}>
          <circle cx={980} cy={1380} r={9}
            fill={C.teal} stroke={C.mint} strokeWidth={1.5}
            filter="url(#earthGlow10)" />
          <text x={980} y={1408}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
            fill={C.mint} letterSpacing="0.1em" opacity={0.7}>
            EARTH
          </text>
        </g>

        {/* Distance line */}
        <g opacity={distEnter}>
          <line x1={craftX} y1={craftY + 10} x2={960} y2={1370}
            stroke={C.steel_blue} strokeWidth={1.5}
            strokeDasharray="6,10"
            opacity={0.4} />
          {/* Arrowhead at Earth */}
          <polygon points={`960,1370 952,1356 968,1356`}
            fill={C.steel_blue} opacity={0.6} />
        </g>

        {/* ── 385,000 km label ── */}
        <g opacity={distEnter}>
          {/* Background pill */}
          <rect x={260} y={1280} width={560} height={90} rx={45}
            fill={C.muted_blue} opacity={0.2} />
          <rect x={260} y={1280} width={560} height={90} rx={45}
            fill="none" stroke={C.steel_blue} strokeWidth={2} opacity={0.6} />

          <text x={540} y={1316}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
            fill={C.silver} letterSpacing="0.2em" opacity={0.6}>
            DISTANCE TO EARTH
          </text>
          <text x={540} y={1354}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={800}
            fill={C.steel_blue} letterSpacing="0.04em">
            385,000 KM
          </text>
        </g>

        {/* "COMPLETELY ALONE" hero label */}
        <g opacity={labelEnter}>
          <text x={540} y={1480}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={900}
            fill={C.warm_pink} letterSpacing="0.06em" opacity={0.9}>
            COMPLETELY
          </text>
          <text x={540} y={1548}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={60} fontWeight={900}
            fill={C.warm_pink} letterSpacing="0.06em" opacity={0.9}>
            ALONE
          </text>
        </g>

        {/* Spatial context: no signal lines going in all directions cut off */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={i}
              x1={craftX} y1={craftY}
              x2={craftX + Math.cos(rad) * 60}
              y2={craftY + Math.sin(rad) * 60}
              stroke={C.rose_coral} strokeWidth={1}
              strokeDasharray="3,5"
              opacity={craftEnter * 0.2}
            />
          );
        })}

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="The crew was completely alone on the far side of the moon, 385,000 kilometers from Earth."
          highlight={['alone', '385,000', 'far']}
        />
      </svg>
    </AbsoluteFill>
  );
};
