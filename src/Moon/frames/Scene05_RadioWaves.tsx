/**
 * Scene 05 — Radio Waves Travel Straight
 * "Radio waves travel in straight lines. They cannot bend around a rock that is 3,400 kilometers wide."
 * Duration: 228 frames (~7.6s) — audio 20.460s → 28.080s
 *
 * Visual: Horizontal radio wave lines from left → stopping dead at Moon's edge.
 * Rose coral curved path attempt (failed bend). 3,400 km scale label.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn, clamp } from '../helpers/timing';
import { StarField, CornerBrackets, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// 8 radio wave lines at different vertical positions
const WAVE_LINES = [
  { y: 520, color: C.powder_blue, strokeW: 2.5, label: 'RADIO WAVE 1' },
  { y: 600, color: C.steel_blue,  strokeW: 2.0, label: 'RADIO WAVE 2' },
  { y: 680, color: C.powder_blue, strokeW: 2.5, label: '' },
  { y: 760, color: C.teal,        strokeW: 2.0, label: '' },
  { y: 840, color: C.powder_blue, strokeW: 2.5, label: '' },
  { y: 920, color: C.steel_blue,  strokeW: 2.0, label: '' },
  { y: 1000, color: C.powder_blue, strokeW: 2.5, label: '' },
  { y: 1080, color: C.teal,        strokeW: 2.0, label: '' },
];

export const Scene05_RadioWaves: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 18);
  const captionOp  = fadeIn(frame, 10, 20);
  const moonEnter  = interpolate(frame, [6, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const waveEnter  = interpolate(frame, [14, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const xEnter     = interpolate(frame, [30, 54], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const scaleEnter = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const curveEnter = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Moon positioned on right side, half off canvas
  // Moon center: (880, 780), radius: 340
  // Moon left edge (where waves stop): x = 880 - 340 = 540

  const moonCX = 880;
  const moonCY = 780;
  const moonR  = 340;
  const moonEdgeX = moonCX - moonR; // ~540

  // Wave animation: draw from left to Moon's edge
  const maxWaveX = moonEdgeX - 10;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="waveGlow05" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="xGlow05" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor={C.rose_coral} floodOpacity="0.5" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="leftHalfClip05">
            <rect x={0} y={0} width={moonEdgeX} height={1920} />
          </clipPath>
        </defs>

        <StarField opacity={enter * 0.2} />

        {/* Scene header */}
        <text x={100} y={140}
          fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={C.slate} letterSpacing="0.3em"
          opacity={enter * 0.5}>
          ELECTROMAGNETIC PROPAGATION
        </text>

        {/* Moon — right side, partially off canvas */}
        <g opacity={moonEnter}>
          {/* Shadow zone */}
          <clipPath id="moonFullClip05">
            <circle cx={moonCX} cy={moonCY} r={moonR} />
          </clipPath>
          <circle cx={moonCX} cy={moonCY} r={moonR}
            fill={C.silver} stroke={C.slate} strokeWidth={2} />
          {/* Moon shadow */}
          <ellipse cx={moonCX - moonR * 0.22} cy={moonCY} rx={moonR * 0.5} ry={moonR}
            fill={C.muted_blue} opacity={0.4}
            clipPath="url(#moonFullClip05)" />
          {/* Craters */}
          {[
            { dx: -80, dy: -50, r: 30 },
            { dx: 40,  dy: 80,  r: 22 },
            { dx: -140, dy: 60, r: 18 },
            { dx: 20,  dy: -100, r: 26 },
          ].map((c, i) => (
            <circle key={i}
              cx={moonCX + c.dx} cy={moonCY + c.dy} r={c.r}
              fill="none" stroke={C.slate} strokeWidth={1.5} opacity={0.6} />
          ))}
          <circle cx={moonCX} cy={moonCY} r={moonR}
            fill="none" stroke={C.silver} strokeWidth={2.5} />
        </g>

        {/* City skyline silhouette at Moon base (scale reference) */}
        <g opacity={moonEnter * 0.6} transform={`translate(${moonEdgeX - 20}, ${moonCY + moonR - 50})`}>
          {[
            [0, -30, 12, 30],
            [14, -50, 10, 50],
            [26, -38, 12, 38],
            [40, -60, 10, 60],
            [52, -44, 12, 44],
            [66, -28, 12, 28],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={1}
              fill={C.copper} stroke={C.silver} strokeWidth={0.5} />
          ))}
          <text x={30} y={20}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={500}
            fill={C.peach} opacity={0.6}>
            SCALE REF
          </text>
        </g>

        {/* 3,400 km scale bar on Moon */}
        <g opacity={scaleEnter}>
          {/* Vertical dimension lines */}
          <line x1={moonEdgeX + 10} y1={moonCY - moonR + 10}
                x2={moonEdgeX + 10} y2={moonCY + moonR - 10}
            stroke={C.warm_pink} strokeWidth={2} />
          <line x1={moonEdgeX} y1={moonCY - moonR + 10}
                x2={moonEdgeX + 22} y2={moonCY - moonR + 10}
            stroke={C.warm_pink} strokeWidth={2} />
          <line x1={moonEdgeX} y1={moonCY + moonR - 10}
                x2={moonEdgeX + 22} y2={moonCY + moonR - 10}
            stroke={C.warm_pink} strokeWidth={2} />
          {/* Label */}
          <text x={moonEdgeX + 32} y={moonCY}
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
            fill={C.warm_pink} letterSpacing="0.04em">
            3,400 KM
          </text>
          <text x={moonEdgeX + 32} y={moonCY + 36}
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={400}
            fill={C.silver} letterSpacing="0.06em" opacity={0.7}>
            CANNOT BEND AROUND
          </text>
        </g>

        {/* Radio waves — horizontal lines stopped at Moon edge */}
        {WAVE_LINES.map((wl, i) => {
          const delay = i * 4;
          const wOp = interpolate(frame, [14 + delay, 34 + delay], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const wLen = interpolate(frame, [14 + delay, 50 + delay], [0, maxWaveX - 60],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

          return (
            <g key={i} opacity={wOp}>
              {/* The wave line */}
              <line x1={60} y1={wl.y} x2={60 + wLen} y2={wl.y}
                stroke={wl.color} strokeWidth={wl.strokeW}
                filter="url(#waveGlow05)" />
              {/* Wavy dashes to suggest EM wave */}
              {Array.from({ length: Math.floor(wLen / 20) }, (_, j) => (
                <path key={j}
                  d={`M ${60 + j * 20},${wl.y} Q ${60 + j * 20 + 5},${wl.y - 8} ${60 + j * 20 + 10},${wl.y} Q ${60 + j * 20 + 15},${wl.y + 8} ${60 + j * 20 + 20},${wl.y}`}
                  fill="none" stroke={wl.color} strokeWidth={1.2} opacity={0.4}
                />
              ))}
              {/* Stop mark at Moon edge */}
              {wLen > maxWaveX - 80 && (
                <circle cx={maxWaveX + 50} cy={wl.y} r={4}
                  fill={C.rose_coral} opacity={0.8} />
              )}
            </g>
          );
        })}

        {/* "CANNOT BEND" failed curve attempt */}
        <g opacity={curveEnter}>
          <path
            d={`M ${maxWaveX + 50},760 Q ${maxWaveX + 120},480 ${maxWaveX + 350},400`}
            fill="none" stroke={C.rose_coral} strokeWidth={2.5}
            strokeDasharray="10,8"
          />
          {/* X mark over the curve */}
          <line x1={maxWaveX + 150} y1={570} x2={maxWaveX + 180} y2={600}
            stroke={C.rose_coral} strokeWidth={4} strokeLinecap="round"
            filter="url(#xGlow05)" />
          <line x1={maxWaveX + 180} y1={570} x2={maxWaveX + 150} y2={600}
            stroke={C.rose_coral} strokeWidth={4} strokeLinecap="round"
            filter="url(#xGlow05)" />
          <text x={maxWaveX + 200} y={540}
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={C.rose_coral} letterSpacing="0.12em" opacity={0.9}>
            IMPOSSIBLE
          </text>
        </g>

        {/* "STRAIGHT LINES ONLY" label on left */}
        <g opacity={scaleEnter}>
          <text x={300} y={420}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={700}
            fill={C.steel_blue} letterSpacing="0.08em">
            STRAIGHT LINES ONLY
          </text>
          {/* Arrow indicators */}
          <polygon points="60,440 80,430 80,450" fill={C.steel_blue} opacity={0.6} />
          <line x1={80} y1={440} x2={400} y2={440}
            stroke={C.steel_blue} strokeWidth={2} opacity={0.4} />
        </g>

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="Radio waves travel in straight lines. They cannot bend around a rock that is 3,400 kilometers wide."
          highlight={['straight', 'cannot', 'bend', '3,400']}
        />
      </svg>
    </AbsoluteFill>
  );
};
