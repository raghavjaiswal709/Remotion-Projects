/**
 * Scene 06 — Engineers Calculate
 * "Engineers calculate the exact second of blackout before launch."
 * Duration: 140 frames (~4.7s) — audio 28.080s → 32.720s
 *
 * Visual: Mission control overhead view — workstations, orbital display,
 * countdown timer showing predicted blackout second.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn, easeSnap, clamp } from '../helpers/timing';
import { StarField, CornerBrackets, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// 5 workstations arranged in 2 rows
const STATIONS = [
  { x: 120, y: 1050, w: 200, h: 160 },
  { x: 380, y: 1050, w: 200, h: 160 },
  { x: 640, y: 1050, w: 200, h: 160 },
  { x: 200, y: 1270, w: 200, h: 160 },
  { x: 600, y: 1270, w: 200, h: 160 },
];

export const Scene06_EngineersCalculate: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 18);
  const captionOp  = fadeIn(frame, 10, 20);
  const stEnter    = interpolate(frame, [8, 32], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const displayEnter = interpolate(frame, [14, 38], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const countEnter = interpolate(frame, [24, 48], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const labelEnter = interpolate(frame, [36, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Countdown digit flicker effect (animating seconds digits)
  const tick       = Math.floor(frame / 8);
  const secDigitA  = (59 - (tick % 60)).toString().padStart(2, '0');

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="screenGlow06" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor={C.steel_blue} floodOpacity="0.3" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="pinkGlow06" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={C.warm_pink} floodOpacity="0.4" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Deep background structure */}
        <rect x={0} y={0} width={1080} height={1920} fill={C.muted_blue} opacity={enter * 0.05} />
        {/* Floor grid */}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`hg${i}`} x1={0} y1={900 + i * 100} x2={1080} y2={900 + i * 100}
            stroke={C.slate} strokeWidth={0.4} opacity={enter * 0.18} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`vg${i}`} x1={i * 90 + 45} y1={900} x2={i * 90 + 45} y2={1920}
            stroke={C.slate} strokeWidth={0.4} opacity={enter * 0.14} />
        ))}

        {/* Scene header */}
        <text x={540} y={130}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={C.slate} letterSpacing="0.35em"
          opacity={enter * 0.5}>
          MISSION CONTROL · PRE-LAUNCH
        </text>

        {/* ── Central mission display (top area) ── */}
        <g opacity={displayEnter}>
          {/* Display panel */}
          <rect x={100} y={200} width={880} height={480} rx={12}
            fill={C.muted_blue} opacity={0.22} />
          <rect x={100} y={200} width={880} height={480} rx={12}
            fill="none" stroke={C.steel_blue} strokeWidth={2} opacity={0.6}
            filter="url(#screenGlow06)" />

          {/* Scanlines */}
          {Array.from({ length: 16 }, (_, i) => (
            <line key={i} x1={112} y1={212 + i * 28} x2={968} y2={212 + i * 28}
              stroke={C.steel_blue} strokeWidth={0.3} opacity={0.08} />
          ))}

          {/* Orbital arc */}
          <path d={`M 160,560 Q 540,200 920,560`}
            fill="none" stroke={C.teal} strokeWidth={3}
            strokeDasharray="14,10" opacity={0.7} />

          {/* Moon marker */}
          <circle cx={800} cy={390} r={36}
            fill={C.silver} stroke={C.slate} strokeWidth={2} opacity={0.8} />
          <circle cx={800} cy={390} r={36}
            fill="none" stroke={C.silver} strokeWidth={1.5} opacity={0.5} />

          {/* Spacecraft position on orbit */}
          <circle cx={300} cy={460} r={12}
            fill={C.warm_pink} stroke={C.silver} strokeWidth={2}
            filter="url(#pinkGlow06)" opacity={0.9} />

          {/* Predicted blackout point marker */}
          <circle cx={690} cy={290} r={10}
            fill={C.rose_coral} stroke={C.silver} strokeWidth={1.5} opacity={0.85} />
          <line x1={690} y1={300} x2={690} y2={360}
            stroke={C.warm_pink} strokeWidth={1.5} strokeDasharray="4,4" opacity={0.6} />
          <text x={700} y={385}
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={700}
            fill={C.warm_pink} letterSpacing="0.1em" opacity={0.9}>
            BLACKOUT START
          </text>

          {/* Earth marker */}
          <circle cx={160} cy={550} r={22}
            fill={C.teal} stroke={C.mint} strokeWidth={2} opacity={0.8} />
          <text x={160} y={588}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={14} fontWeight={500}
            fill={C.mint} opacity={0.7}>
            EARTH
          </text>

          {/* Display title */}
          <text x={540} y={244}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={600}
            fill={C.powder_blue} letterSpacing="0.2em" opacity={0.8}>
            TRAJECTORY ANALYSIS · MISSION CONTROL
          </text>
        </g>

        {/* ── Countdown timer ── */}
        <g opacity={countEnter}>
          <rect x={240} y={730} width={600} height={150} rx={10}
            fill={C.bg} opacity={0.9} />
          <rect x={240} y={730} width={600} height={150} rx={10}
            fill="none" stroke={C.warm_pink} strokeWidth={2.5}
            filter="url(#pinkGlow06)" opacity={0.8} />

          <text x={400} y={778}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
            fill={C.silver} letterSpacing="0.25em" opacity={0.7}>
            PREDICTED BLACKOUT
          </text>

          <text x={540} y={848}
            textAnchor="middle"
            fontFamily="monospace" fontSize={52} fontWeight={700}
            fill={C.warm_pink} letterSpacing="0.06em"
            filter="url(#pinkGlow06)">
            {`14:22:${secDigitA}`}
          </text>
          <text x={840} y={852}
            fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
            fill={C.silver} opacity={0.6}>
            MET
          </text>
        </g>

        {/* ── Workstations ── */}
        <g opacity={stEnter}>
          {STATIONS.map((st, i) => (
            <g key={i}>
              {/* Desk */}
              <rect x={st.x} y={st.y} width={st.w} height={st.h} rx={8}
                fill={C.muted_blue} opacity={0.25} />
              <rect x={st.x} y={st.y} width={st.w} height={st.h} rx={8}
                fill="none" stroke={C.steel_blue} strokeWidth={1.5} opacity={0.5} />
              {/* Screen */}
              <rect x={st.x + 16} y={st.y + 14} width={st.w - 32} height={st.h - 50} rx={4}
                fill={C.bg} opacity={0.8} />
              <rect x={st.x + 16} y={st.y + 14} width={st.w - 32} height={st.h - 50} rx={4}
                fill="none" stroke={C.steel_blue} strokeWidth={1} opacity={0.4} />
              {/* Screen content: data lines */}
              {[0, 1, 2].map(j => (
                <line key={j}
                  x1={st.x + 24} y1={st.y + 28 + j * 16}
                  x2={st.x + st.w - 24} y2={st.y + 28 + j * 16}
                  stroke={j === 0 ? C.teal : C.slate}
                  strokeWidth={j === 0 ? 1.5 : 1}
                  opacity={j === 0 ? 0.6 : 0.3}
                />
              ))}
              {/* Engineer silhouette */}
              <ellipse cx={st.x + st.w / 2} cy={st.y + st.h - 12} rx={16} ry={10}
                fill={C.peach} opacity={0.5} />
              <circle cx={st.x + st.w / 2} cy={st.y + st.h - 26} r={10}
                fill={C.peach} opacity={0.5} />
            </g>
          ))}
        </g>

        {/* "EXACT SECOND" label */}
        <g opacity={labelEnter}>
          <text x={540} y={1520}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={54} fontWeight={900}
            fill={C.steel_blue} letterSpacing="0.04em">
            EXACT SECOND
          </text>
          <text x={540} y={1578}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400}
            fill={C.silver} letterSpacing="0.18em" opacity={0.6}>
            OF BLACKOUT · CALCULATED BEFORE LAUNCH
          </text>
        </g>

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="Engineers calculate the exact second of blackout before launch."
          highlight={['exact', 'second', 'blackout']}
        />
      </svg>
    </AbsoluteFill>
  );
};
